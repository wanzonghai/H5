
function isRetError(ret){
    if(!ret == null || ret == undefined || ret < 0) {
        return true;
    }
    return false;
}
function PackReturn(code,message,data) {
    if(data == undefined){
        return JSON.stringify({code:code,message:message});
    }else{
        return JSON.stringify({code:code,message:message,data:data});
    }
}
function randomId(){
    var rnd="";
    var ranString = "0123456789";
    var lenMax = ranString.length;
    var len = 10;
    for(var i = 0;i < len; i++){
        var ran = Math.floor(Math.random()*lenMax)
        rnd += ranString[ran];
    }
     return rnd;
}
//vivo定制 活动到期 积分开奖
module.exports = async (context) =>{
    console.log("updateRankByEndTime");
    try {
        const cloud = context.cloud;
        //获取中奖配置
        var findRankReward = await cloud.db.collection("rankReward").find({
            name: "rankReward"
        },{
            projection: {
                list: 1,
                openNums: 1
            }
        });
        if(isRetError(findRankReward) || findRankReward.length <= 0){
            return PackReturn(-1,"获取中奖配置错误");
        }
        var rankReward = findRankReward[0];
        //检测 活动是否配置
        var findUserData = await cloud.db.collection("users").aggregate([
            {
                $match: {
                    state: true,
                }
            },{
                $project: {
                    activeId: 1,
                    creatorId: 1,
                    rankEndNums: 1,
                    sTime: 1,
                    eTime: 1
                }
            }
        ]);
        if(isRetError(findUserData)){
            return PackReturn(-2,"获取数据失败");
        }

        if(findUserData.length <= 0){
            return PackReturn(-2,"未找到活动数据")
        }

        var curTime = new Date().getTime();
        
        //结算
        for(var t = 0; t < findUserData.length; t++){
            var t_activity = findUserData[t];
            //开奖时间大于 活动结束时间 不开奖
            if(t_activity.hasOwnProperty("eTime")){
                if(curTime < t_activity.eTime){
                    console.log("未到开奖时间：",t_activity.activeId);
                    continue;
                }
            }
            //开奖次数限制
            if(t_activity.rankEndNums >= 1){
                console.log("开奖次数限制");
                continue;
            }
            var sTime = t_activity.sTime;
            var eTime = t_activity.eTime;
            var list_rank = [];
            var allPlayerData = await cloud.db.collection("players").aggregate([
                {
                    $match: {
                        activeId: t_activity.activeId,
                        point: {$gt: 0} 
                    }
                },{
                    $sort: {
                        point: -1
                    }
                },{
                    $project: {
                        point: 1,
                        nickName: 1,
                        headUrl: 1,
                        userCoin: 1,
                        userOpenId: 1,
                    }
                },{
                    $limit: 50
                }
            ]);
            if(isRetError(allPlayerData)){
                continue;
            }
            if(allPlayerData.length > 0){
                for(var i = 0; i < allPlayerData.length; i++){
                    var i_model = allPlayerData[i];
                    list_rank.push({
                        point: i_model.point,
                        nickName: i_model.nickName,
                        headUrl: i_model.headUrl,
                        userCoin: i_model.userCoin,
                        userOpenId: i_model.userOpenId
                    });
                }
            }
            
            list_rank.sort((a,b)=>{
                return b.point - a.point;
            });
    
            //将数据存放到 排行榜记录中  rankEndNums
            var record = new Object();
            record.name = "record";
            record.openid = t_activity.openid;
            record.activeId = t_activity.activeId;
            record.rankEndNums = t_activity.rankEndNums;
            record.openNums = rankReward.openNums;
            record.list = list_rank;
            record.time = curTime;
            //是否 开奖 需要判定 openNums
            record.isOpenReward = false;
            var joinNums = await cloud.db.collection("join").count({
                activeId: t_activity.activeId,
                stampTime: {
                    $gte: sTime,
                    $lte: eTime
                },
            });    
            //开奖限制    
            if(joinNums >= Number(rankReward.openNums)){
                record.isOpenReward = true;
            }else{
                record.isOpenReward = false;
            }
            //最大排名 (定制版需要进一步确定需求)
            var maxRank = 50;
            var isBConfig = false;
            if(rankReward.hasOwnProperty("list")){
                rankReward.list.forEach(element =>{
                    if(element.hasOwnProperty("rankNums")){
                        isBConfig = true;
                        element.rankNums.forEach(num => {
                            if(num > maxRank){
                                maxRank = num;
                            }
                        });
                    }
                });
            }
            //加入 中奖人员 信息
            record.rewardList = [];     //中奖列表
            for(var i = 0; i < list_rank.length; i++){
                if(i >= maxRank){
                    break;
                }
                var newObj = new Object();
                var i_model = list_rank[i];
                var rank = i + 1;
                newObj.rewardType = -1;
                if(i_model.hasOwnProperty("userOpenId")){
                    newObj.userOpenId = i_model.userOpenId;
                    newObj.nickName = i_model.nickName;
                    newObj.headUrl = i_model.headUrl;
                    newObj.userCoin = i_model.userCoin;
                    newObj.point = i_model.point;
                    newObj.rank = rank;
                }
                if(isBConfig){
                    rankReward.list.forEach(element =>{
                        if(element.hasOwnProperty("rankNums")){
                            var isGetRank = false;
                            if(element.rankNums.length == 1){
                                if(rank <= element.rankNums[0]){
                                    isGetRank = true;
                                }
                            }else{
                                if(rank >= element.rankNums[0] && rank <= element.rankNums[1]){
                                    isGetRank = true;
                                }
                            }
                            if(isGetRank){
                                newObj.rewardType = element.type;
                                newObj.title = element.title;
                                if(element.hasOwnProperty("pic_url")){
                                    newObj.pic_url = element.pic_url;
                                }
                                if(element.hasOwnProperty("price")){
                                    newObj.price = element.price;
                                }
                                return;
                            }
                        }
                    });
                }else{
                    // if(rank >= 1 && rank <= 3){
                    //     newObj.rewardType = 1;
                    // }else if(rank >= 4 && rank <= 10){
                    //     newObj.rewardType = 2;
                    // }else if(rank >= 11 && rank <= 50){
                    //     newObj.rewardType = 3;
                    // }else{
                    //     newObj.rewardType = -1;
                    // }
                    continue;
                }
                newObj.isGet = true;
                if(record.isOpenReward){
                    if(newObj.rewardType != -1){
                        newObj.isGet = true;
                    }
                }else{
                    newObj.isGet = false;
                }
                record.rewardList.push(newObj);
            }
            await cloud.db.collection("rankRecord").insertOne(record);
            //更新活动 rankEndNums
            await cloud.db.collection("users").updateMany({
                activeId: t_activity.activeId
            },{
                $inc: {
                    rankEndNums: 1
                }
            });
            //增加本期中奖记录
            for(var i = 0; i < record.rewardList.length; i++){
                var newData = new Object();
                newData.openid = t_activity.creatorId;
                newData.userOpenId = record.rewardList[i].userOpenId;
                newData.activeId = t_activity.activeId;
                newData.isWinner = true;
                newData.from = "rank";
                newData.tbName = record.rewardList[i].nickName;
                newData.rewardTime = new Date().getTime();
                newData.isShip = 0;
                newData.orderId = randomId();
                newData.address = "";
                newData.consignee = "";
                newData.logisticsId = "";
                newData.shipTime = "";
                newData.phone = "";
                newData.company = "";
                newData.rewardInfo = new Object();
                newData.rewardInfo.total = 0;
                newData.rewardInfo.price = 0;
                if(record.rewardList[i].hasOwnProperty("price")){
                    newData.rewardInfo.price = record.rewardList[i].price;
                }
                newData.rewardInfo.num_iid = 0;
                newData.rewardInfo.pic_url = "";
                if(record.rewardList[i].hasOwnProperty("pic_url")){
                    newData.rewardInfo.pic_url =record.rewardList[i].pic_url;
                }
                newData.rewardInfo.title = record.rewardList[i].title;
                newData.rewardInfo.sendNum = 0;
                newData.rewardInfo.type = record.rewardList[i].rewardType;
                newData.rewardInfo.name = "goods";
                newData.rewardInfo.state = 0;
                await cloud.db.collection("winner").insertOne(newData);
            }
        }
        return true;
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
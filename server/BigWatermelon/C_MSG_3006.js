var code = 0;
var message = "成功";

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
//上报排行榜领奖结果
module.exports = async (context) =>{
    console.log("==3006==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        const miniappId = context.miniappId;
        const sourceMiniAppId = context.sourceMiniAppId;
        //赛季计算
        var findUserData = await cloud.db.collection("users").find({
            //openid: openid,
            activeId: data.data.activeId
        },{
            projection: {
                creatorId: 1,
                rankEndNums: 1
            }
        });
        if(isRetError(findUserData) || findUserData.length <= 0){
            return PackReturn(-2,"获取数据失败1")
        }
        var creatorId = findUserData[0].creatorId;
        var rankEndNums = findUserData[0].rankEndNums;
        var lastRankEndNums = rankEndNums - 1;
        //获取上期 排名记录
        var findRankRecord = await cloud.db.collection("rankRecord").find({
            //openid: openid,
            activeId: data.data.activeId,
            rankEndNums: lastRankEndNums
        });
        if(isRetError(findRankRecord) || findRankRecord.length <= 0){
            return PackReturn(-2,"获取数据失败2")
        }
        var rewardConfig = findRankRecord[0].rewardConfig;
        var rewardList  = findRankRecord[0].rewardList;
        //获取 当前用户名次
        var destRank = -1;

        for(var i = 0; i < rewardList.length; i++){
            if(rewardList[i].hasOwnProperty("userOpenId")){
                if(rewardList[i].userOpenId == userOpenId){
                    destRank = i + 1;
                    break;
                }
            }
        }

        var rewardType = -1;  //奖品类型
        if(destRank == -1){
            rewardType = -1;
            return PackReturn(-5,"未获得奖励");
        }

        //检测 是否有B端自定义配置
        // rewardList rankNums
        // 默认配置 [1,3] [4,10] [11,50]
        var isGet = false;
        for(var i = 0; i < rewardConfig.length; i++){
            if(rewardConfig[i].hasOwnProperty("rankNums")){
                isGet = true;
                break;
            }
        }
        if(isGet){
            var isReward = false;
            for(var i = 0; i < rewardConfig.length; i++){
                if(rewardConfig[i].hasOwnProperty("rankNums")){
                    if(destRank >= rewardConfig[i].rankNums[0] && destRank <= rewardConfig[i].rankNums[1]){
                        rewardType = Number(rewardConfig[i].type);
                        isReward = true;
                        break;
                    }
                }
            }
            if(!isReward){
                return PackReturn(-5,"未获得奖励");
            }
        }else{
            //默认领奖配置
            if(destRank >= 1 && destRank <= 3){
                rewardType = 1;
            }else if(destRank >= 4 && destRank <= 10){
                rewardType = 2;
            }else if(destRank >= 11 && destRank <= 50){
                rewardType = 3;
            }else{
                return PackReturn(-5,"未获得奖励");
            }
        }
        if(rewardList[destRank - 1].hasOwnProperty("isGet")){
            rewardList[destRank - 1].isGet = false;
        }
        await cloud.db.collection("rankRecord").updateMany({
            //openid: openid,
            activeId: data.data.activeId,
            rankEndNums: lastRankEndNums
        },{
            $set: {
                rewardList: rewardList
            }
        });

        await cloud.db.collection("players").updateMany({
            //openid: openid,
            activeId: data.data.activeId,
            userOpenId: userOpenId
        },{
            $set: {
                isHasReward_bag: true
            }
        });

        var packet = null;
        for(var i = 0; i < rewardConfig.length; i++){
            if(rewardConfig[i].type == rewardType){
                packet = rewardConfig[i];
                break;
            }
        }
        //奖励 放到winnder
        var curNum = packet.num;
        curNum -= 1;
        packet.num = curNum;
        var openNums = parseInt(packet.openNums);
        openNums += 1;
        packet.openNums = openNums;

        var record = new Object();
        record.userOpenId = userOpenId;
        record.openid = creatorId;
        record.activeId = data.data.activeId;
        record.isWinner = true;
        // record.type = "" + (rewardType + 1);
        // record.tbName = data.data.nickName;
        //C端 已不发nickName 改成后台获取
        var findPlayerData = await cloud.db.collection("players").find({
            userOpenId: userOpenId,
            activeId: data.data.activeId
        });
        if(isRetError(findPlayerData) || findPlayerData.length <= 0){
            return PackReturn(-2,"获取玩家数据失败");
        }
        record.tbName = findPlayerData[0].nickName;
        record.rewardTime = new Date().getTime();
        record.isShip = 0;
        record.orderId = randomId();
        record.address = "";
        record.consignee = "";
        record.logisticsId = "";
        record.shipTime = "";
        record.phone = "";
        record.company = "";
        record.rewardInfo = new Object();
        record.rewardInfo.total = packet.total;
        record.rewardInfo.price = packet.price;
        record.rewardInfo.num_iid = packet.num_iid;
        record.rewardInfo.pic_url = packet.pic_url;
        record.rewardInfo.title = packet.title;
        record.rewardInfo.sendNum = packet.openNums;
        record.rewardInfo.type = packet.type;
        record.rewardInfo.name = packet.name;
        record.rewardInfo.state = 0;
        //新加优惠券关联字段
        if(packet.hasOwnProperty("linkId")){
            record.rewardInfo.linkId = packet.linkId;
        }
        // record.rewardInfo = packet;
        await cloud.db.collection("winner").insertOne(record);

        //-------------------------------如果奖励优惠券 直接发放------------------------
        if(packet.name == "coupon"){
            //检查是否是调试模式
            var bIsDebug = false;
            var debugAccessToken=null;
            const findData1 = await cloud.db.collection("debug").find({uuid:10001});
            if (findData1.length > 0){ //存在旧的
                bIsDebug = findData1[0].debug;
                debugAccessToken = findData1[0].accessToken;
            }
            // console.log("contextData: ",contextData);
            // console.log("context: ",context);
            var time = new Date().getTime(); 
            var uuid = "" + userOpenId + time;
            const resposeData = await context.cloud.topApi.invoke({
                api : 'alibaba.benefit.send',
                data : {
                    'right_ename': packet.num_iid,//Ename
                    'receiver_id': userOpenId,
                    'user_type':'taobao',
                    'unique_id':uuid,
                    'app_name':'promotioncenter-'+sourceMiniAppId,
                    'session':debugAccessToken  //测试时候用的
                },
                autoSession: !bIsDebug  //测试时候填false
            });
        }
        return PackReturn(code,message);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
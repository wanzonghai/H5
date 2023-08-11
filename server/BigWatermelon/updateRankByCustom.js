
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

module.exports = async (context) =>{
    console.log("updateRankByCustom");
    try {
        const cloud = context.cloud;
        //检测 活动是否配置
        var findUserData = await cloud.db.collection("users").aggregate([
            {
                $match: {
                    state: true,
                    "rankRewardConfig.drawTime": "custom"
                }
            },
            {
                $project: {
                    openid: 1,
                    activeId: 1,
                    createTime: 1,
                    rankEndNums: 1,
                    rankCustomUpdateTime: 1,
                    rankRewardConfig: 1,
                    eTime: 1
                }
            }
        ]);
        if(isRetError(findUserData)){
            return PackReturn(-2,"获取数据失败1");
        }
        console.log("findUserData.length: ",findUserData.length);
        if(findUserData.length <= 0){
            return false;
        }
        var curTime = new Date().getTime();
        for(var t = 0; t < findUserData.length; t++){
            var t_activity = findUserData[t];
            var openTimes = t_activity.rankRewardConfig.openTimes;
            //开奖时间大于 活动结束时间 不开奖
            if(t_activity.hasOwnProperty("eTime")){
                if(curTime > t_activity.eTime){
                    continue;
                }
            }
            for(var p = 0; p < openTimes.length; p++){
                var sTime = -1;
                var eTime = -1;
                if(p == 0){
                    //创建活动->p0时间
                    sTime = t_activity.createTime;
                    eTime = openTimes[p];
                }else{
                    sTime = openTimes[p - 1];
                    eTime = openTimes[p];
                }
                if(sTime == -1 || eTime == -1){
                    continue;
                }
                //是否到了开奖时间
                if(eTime > curTime){
                    console.log("未到开奖时间: ",eTime);
                    continue;
                }
                //检测 最后一次开过奖的时间
                if(t_activity.hasOwnProperty("rankCustomUpdateTime")){
                    if(t_activity.rankCustomUpdateTime >= eTime){
                        console.log("已开过奖品时间：",eTime);
                        continue;
                    } 
                }
                var list_rank = [];
                //注意 时间段
                var allPlayerData = await cloud.db.collection("players").aggregate([
                    {
                        $match: {
                            activeId: t_activity.activeId,
                            stampTime: {
                                $gte: sTime,
                                $lte: eTime
                            },
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
                    }
                ]);
                console.log("allPlayerData: ",allPlayerData.length);
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
                
                var findAIData = await cloud.db.collection("rank").aggregate([
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
                            name: 1,
                            point: 1,
                            nameId: 1,
                            headId: 1
                        }
                    }
                ]);
                if(isRetError(findAIData)){
                    continue;
                }
                if(findAIData.length > 0){
                    for(var i = 0; i < findAIData.length; i++){
                        var i_model = findAIData[i];
                        list_rank.push({
                            name: i_model.name,
                            point: i_model.point,
                            nameId: i_model.nameId,
                            headId: i_model.headId
                        });
                    }
                }
                // if(list_rank.length <= 0){
                //     continue;
                // }
                list_rank.sort((a,b)=>{
                    return b.point - a.point;
                });

                //将数据存放到 排行榜记录中  rankEndNums
                var record = new Object();
                record.name = "record";
                record.openid = t_activity.openid;
                record.activeId = t_activity.activeId;
                record.drawTime = t_activity.rankRewardConfig.drawTime;
                record.rankEndNums = t_activity.rankEndNums;
                record.rewardConfig = t_activity.rankRewardConfig.rewardList;   //排行榜配置
                record.list = list_rank;
                record.time = new Date().getTime();
                //是否 开奖 需要判定 openNums
                var joinCount = await cloud.db.collection("join").count({
                    // openid: t_activity.openid,
                    activeId: t_activity.activeId,
                    stampTime: {
                        $gte: sTime,
                        $lte: eTime
                    },
                });        
                var joinNums = joinCount + findAIData.length;
                if(joinNums >= Number(t_activity.rankRewardConfig.openNums)){
                    record.isOpenReward = true;
                }else{
                    record.isOpenReward = false;
                }
                //最大排名
                var maxRank = 50;
                var isBConfig = false;
                record.rewardConfig.forEach(element =>{
                    if(element.hasOwnProperty("rankNums")){
                        isBConfig = true;
                        element.rankNums.forEach(num => {
                            if(num > maxRank){
                                maxRank = num;
                            }
                        });
                    }
                });
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
                    }else{
                        newObj.name = i_model.name;
                        newObj.nameId = i_model.nameId;
                        newObj.headId = i_model.headId;
                        newObj.point = i_model.point;
                    }
                    if(isBConfig){
                        record.rewardConfig.forEach(element =>{
                            if(element.hasOwnProperty("rankNums")){
                                if(rank >= element.rankNums[0] && rank <= element.rankNums[1]){
                                    newObj.rewardType = element.type;
                                    return;
                                }
                            }
                        });
                    }else{
                        if(rank >= 1 && rank <= 3){
                            newObj.rewardType = 1;
                        }else if(rank >= 4 && rank <= 10){
                            newObj.rewardType = 2;
                        }else if(rank >= 11 && rank <= 50){
                            newObj.rewardType = 3;
                        }else{
                            newObj.rewardType = -1;
                        }
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
                    $set: {
                        "rankCustomUpdateTime": curTime
                    },
                    $inc: {
                        rankEndNums: 1
                    }
                });
                //清理 rank机器人数据
                await cloud.db.collection("rank").updateMany({
                    activeId: t_activity.activeId
                },{
                    $set: {
                        point: 0,
                        updateTime: curTime,
                    }
                });
                //清理 活动内所有人的数据
                await cloud.db.collection("players").updateMany({
                    // openid: t_activity.openid,
                    activeId: t_activity.activeId
                },{
                    $set: {
                        point: 0,
                        rank: -1
                    }
                });
            }
        }
        return true;
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
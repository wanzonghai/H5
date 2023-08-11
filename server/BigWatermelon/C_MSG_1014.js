var moment = require("moment");
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
//获取排行榜总榜数据
module.exports = async (context) =>{
    console.log("==1014==");
    try {
        var data = context.data.data;
        var userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        console.log("data: ",data);
        var findPlayerData = await cloud.db.collection("players").find({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        });
        if(isRetError(findPlayerData)){
            return PackReturn(-1,"获取玩家数据失败");
        }
        var playerParm = findPlayerData[0];
        //统计打开 排行榜次数
        var curTime = new Date().getTime();
        await cloud.db.collection("activityRecord").updateMany({
            //openid: openid,
            activeId: data.data.activeId,
            sTime: {$lte: curTime},
            eTime: {$gte: curTime}
        },{
            $inc: {
                rankOpenNums: 1
            }
        });
        //获取配置数据  索引条件： 开启状态
        var findGloabl = await cloud.db.collection("global").find({totalRank_swith: 1});
        if(isRetError(findGloabl)){
            return PackReturn(-1,"获取配置失败");
        }
        if(findGloabl.length <= 0){
            return PackReturn(-1,"周榜未开启");
        }
        //获取配置参数
        var totalRank_count = findGloabl[0].totalRank_count;
        var total_list_rank = [];
        var list_count = 0;

        let ret = await cloud.db.collection("players").aggregate([
            {
                $match: {
                    activeId: data.data.activeId,
                    point: {$gt: 0} 
                }
            },{
                $sort: {
                    point: -1
                }
            },{
                $limit: totalRank_count
            },{
                $project: {
                    point: 1,
                    nickName: 1,
                    headUrl: 1,
                    userOpenId: 1
                }
            }
        ]);

        if(isRetError(ret) || ret.length <= 0){
            
        }else{
            for(var i = 0; i < ret.length; i++){
                list_count += 1;
                total_list_rank.push(ret[i]);
            }
        }
        var findAIData = await cloud.db.collection("rank").find({
            //openid: openid,
            activeId: data.data.activeId,
            point: {$gt: 0}
        },{
            sort: {
                point: -1
            }
        });
        if(isRetError(findAIData) || findAIData.length <= 0){
            
        }else{
            for(var i = 0; i < findAIData.length; i++){
                list_count += 1;
                total_list_rank.push(findAIData[i]);
            }
        }
        total_list_rank.sort((a,b)=>{
            return b.point - a.point;
        });
        //筛选出前100名
        var list_rank = [];
        for(var k = 0; k < total_list_rank.length; k++){
            if(k >= totalRank_count){
                break;
            }
            list_rank.push(total_list_rank[k]);
        }
        var retData = new Object();
        var time = new Date();
        //当前时间
        retData.cTime = time.getTime();
        //当前分数
        retData.curPoint = playerParm.point;
        //当前排名
        var destRank = -1;
        for(var i = 1; i <= list_rank.length; i++){
            if(list_rank[i-1].hasOwnProperty("userOpenId")){
                if(list_rank[i-1].userOpenId == userOpenId){
                    destRank = i;
                    break;
                }
            }
        }
        retData.curRank = destRank;
        // var findUserData = await cloud.db.collection("users").find({
        //     //openid: openid,
        //     activeId: data.data.activeId
        // });
        // if(isRetError(findUserData)){
        //     return PackReturn(-2,"获取数据失败2");
        // }
        // var rankConfig = findUserData[0].rankRewardConfig;
        // var str_time = "";
        // var sTime = -1;
        // var eTime = -1;
        // //活动创建时间 作为sTime
        // var activeCreateTime = findUserData[0].createTime;
        // var createTimeData = new Date(activeCreateTime);
        // var year = createTimeData.getFullYear();
        // var month = createTimeData.getMonth() + 1;
        // var rankEndNums = findUserData[0].rankEndNums;
        // // createTimeData = time;
        // month = month < 10 ? "0" + month : month;

        // var curYear = time.getFullYear();
        // var curMoth = time.getMonth() + 1;
        // curMoth = curMoth < 10 ? "0" + curMoth : curMoth;
        // var curDay = time.getDate();
        // curDay = curDay < 10 ? "0" + curDay : curDay;
        // var curHour = time.getHours();
        // curHour = curHour < 10 ? "0" + curHour : curHour;
        // if(rankConfig.drawTime == "hour"){
        //     var day = createTimeData.getDate();
        //     day = day < 10 ? "0" + day : day;
        //     var hour = createTimeData.getHours();
        //     hour = hour < 10 ? "0" + hour : hour;
        //     str_time = "" + curYear + "-" + curMoth + "-" + curDay + " " + curHour + ":00:00";
        //     var newTime = new Date(str_time).getTime();
        //     // sTime = newTime + (rankEndNums * 3600 * 1000);
        //     sTime = newTime;
        //     eTime = sTime + (3600 * 1000);
        // }else if(rankConfig.drawTime == "day"){
        //     var day = createTimeData.getDate();
        //     day = day < 10 ? "0" + day : day;
        //     str_time = "" + curYear + "-" + curMoth + "-" + curDay + " 00:00:00";
        //     var newTime = new Date(str_time).getTime();
        //     // sTime = newTime + (rankEndNums * 24 * 3600 * 1000);
        //     sTime = newTime;
        //     eTime = sTime + (24 * 3600 * 1000);
        // }else if(rankConfig.drawTime == "week"){
        //     var weekDay = time.getDay();
        //     if(weekDay == 0){
        //         weekDay = 7;
        //     }
        //     var disDay = weekDay - 1;
        //     var day = time.getDate();
        //     day = day < 10 ? "0" + day : day;
        //     str_time = "" + curYear + "-" + curMoth + "-" + curDay + " 00:00:00";
        //     var newTime = new Date(str_time).getTime();
        //     sTime = newTime - (disDay * (24 * 3600 * 1000))
        //     eTime = sTime + (7 * 24 * 3600 * 1000);
        // }else if(rankConfig.drawTime == "month"){
        //     //每月1号开奖 
        //     str_time = "" + curYear + "-" + curMoth + "-" + 1 + " 00:00:00";
        //     var newTime = new Date(str_time).getTime();
        //     sTime = newTime;
        //     // var dayNums = new Date(year,month,0).getDate();
        //     // eTime = sTime + (dayNums * (24 * 3600 * 1000));
        //     eTime = Number(moment(newTime).add(1,"months").format("x").valueOf());
        // }else if(rankConfig.drawTime == "custom"){
        //     //自定义开奖时间
        //     if(rankConfig.hasOwnProperty("openTimes")){
        //         if(rankConfig.openTimes.length > 0){
        //             for(var i = 0; i < rankConfig.openTimes.length; i++){
        //                 if(findUserData[0].hasOwnProperty("rankCustomUpdateTime")){
        //                     if(rankConfig.openTimes.length == 1){
        //                         //只配置一个时间
        //                         if(findUserData[0].rankCustomUpdateTime < rankConfig.openTimes[i]){
        //                             sTime = findUserData[0].createTime;
        //                             eTime = rankConfig.openTimes[0];
        //                         }else{
        //                             sTime = -1;
        //                             eTime = -1;
        //                             console.log("配置时间有误 应该大于rankCustomUpdateTime");
        //                         }
        //                     }else{
        //                         if(findUserData[0].rankCustomUpdateTime < rankConfig.openTimes[i]){
        //                             //小于第一个配置时间
        //                             if(i == 0){
        //                                 sTime = findUserData[0].createTime;
        //                                 eTime = rankConfig.openTimes[i];
        //                             }else{
        //                                 if(findUserData[0].rankCustomUpdateTime >= rankConfig.openTimes[i - 1]){
        //                                     sTime = rankConfig.openTimes[i - 1];
        //                                     eTime = rankConfig.openTimes[i];
        //                                 }
        //                             }
        //                         }else{
        //                             sTime = -1;
        //                             eTime = -1;
        //                             console.log("开奖已结束");
        //                         }
        //                     }
        //                 }else{
        //                     sTime = findUserData[0].createTime;
        //                     eTime = rankConfig.openTimes[0];
        //                     break;
        //                 }
        //             }
        //         }
        //     }
            
        // }
        // retData.sTime = sTime;
        // retData.eTime = eTime;
        // retData.limitNum = rankConfig.openNums; //B端 配置的人数
        retData.list = list_rank;
        //查询 分数大于0的参加人员
        var playerCount = await cloud.db.collection("players").count({
            //openid: openid,
            activeId: data.data.activeId,
            point: {$gt: 0}
        });

        if(isRetError(playerCount)){
            playerCount = 0;
        }
        //获取  分数大于0机器人数量
        var findRankData = await cloud.db.collection("rank").find({
            //openid: openid,
            activeId: data.data.activeId,
            point: {$gt: 0}
        });
        if(isRetError(findRankData)){
            return PackReturn(-2,"获取数据失败2");
        }
        retData.curNum = playerCount + findRankData.length; //统计进入人数  在这个时间段的人数 + 机器人数量

        //上期奖励 
        // var rankEndNums = findUserData[0].rankEndNums;
        // var lastEndNums = rankEndNums - 1;
        // if(lastEndNums < 0){
        //     retData.isGet = false;
        //     retData.rewardConfig = rankConfig.rewardList;
        // }else{
        //     var findRankRecord = await cloud.db.collection("rankRecord").find({
        //         //openid: openid,
        //         activeId: data.data.activeId,
        //         rankEndNums: lastEndNums
        //     });
        //     if(isRetError(findRankRecord)){
        //         return PackReturn(-3,"获取数据失败3");
        //     }
        //     if(findRankRecord.length <= 0){
        //         // retData.curRank = -1;
        //         retData.isGet = false;
        //         retData.rewardConfig = [];
        //     }else{
        //         //是否 已经领奖
        //         var isGet = false;
        //         var rewardList = findRankRecord[0].rewardList;
        //         var rewardConfig = findRankRecord[0].rewardConfig;
        //         var list  = findRankRecord[0].list;
        //         var lastRank = -1;
        //         for(var i = 1; i <= list.length; i++){
        //             if(list[i-1].hasOwnProperty("userOpenId")){
        //                 if(list[i-1].userOpenId == userOpenId){
        //                     lastRank = i;
        //                     break;
        //                 }
        //             }
        //         }
        //         // console.log("lastRank: ",lastRank);
        //         for(var i = 0; i < rewardList.length; i++){
        //             // if(i > 10) break;
        //             if(rewardList[i].hasOwnProperty("userOpenId")){
        //                 if(rewardList[i].userOpenId == userOpenId){
        //                     if(rewardList[i].isGet){
        //                         //红点判定
        //                         var isReward = false;
        //                         for(var k = 0; k < rewardConfig.length; k++){
        //                             if(rewardConfig[k].hasOwnProperty("rankNums")){
        //                                 isReward = true;
        //                                 break;
        //                             }
        //                         }
        //                         if(isReward){
        //                             for(var k = 0; k < rewardConfig.length; k++){
        //                                 if(rewardConfig[k].hasOwnProperty("rankNums")){
        //                                     if(lastRank >= rewardConfig[k].rankNums[0] && lastRank <= rewardConfig[k].rankNums[1]){
        //                                         isGet = true;
        //                                         break;
        //                                     }
        //                                 }
        //                             }
        //                         }else{
        //                             //默认领奖配置
        //                             if(lastRank >= 1 && lastRank <= 3){
        //                                 isGet = true;
        //                             }else if(lastRank >= 4 && lastRank <= 10){
        //                                 isGet = true;
        //                             }else if(lastRank >= 11 && lastRank <= 50){
        //                                 isGet = true;
        //                             }else{
        //                             }
        //                         }
        //                     }
        //                     break;
        //                 }
        //             }
        //         }
        //         retData.isGet = isGet;
        //     }
        //     //人数限制
        //     // if(retData.curNum < retData.limitNum){
        //     //     retData.isGet = false;
        //     // }
        //     //排行榜 奖励是本期的
        //     retData.rewardConfig = rankConfig.rewardList;
        // }
        // //兼容老活动 未使用自定义排行榜得情况
        // if(retData.rewardConfig.length > 0){
        //     for(var i = 0; i < retData.rewardConfig.length; i++){
        //         if(!retData.rewardConfig[i].hasOwnProperty("rankNums")){
        //             //默认配置
        //             if(retData.rewardConfig[i].type == "1"){
        //                 retData.rewardConfig[i]["rankNums"] = [1,3];
        //             }else if(retData.rewardConfig[i].type == "2"){
        //                 retData.rewardConfig[i]["rankNums"] = [4,10];
        //             }else{
        //                 retData.rewardConfig[i]["rankNums"] = [11,50];
        //             }
        //         }
        //     }
        // }
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
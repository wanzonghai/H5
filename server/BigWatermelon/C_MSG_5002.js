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
//下发红点数据
// 1. 奖品包是否有新奖励
// 2. 排行榜是否有新奖励
module.exports = async (context) =>{
    console.log("==5002==");
    try {
        var userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var data = context.data.data;
        var retData = new Object();
        retData.isReward_bag = false;
        retData.isReward_rank = false;
        retData.isReward_task = false;
        retData.bag_num = 0;
        retData.task_num = 0;
        //奖品包奖励
        var findPlayerData = await cloud.db.collection("players").find({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        },{
            projection: {
                isHasReward_bag: 1
            }
        });
        if(isRetError(findPlayerData)){
            return PackReturn(-2,"获取数据错误1");
        }
        if(findPlayerData.length > 0){
            var playerParm = findPlayerData[0];
            if(playerParm.isHasReward_bag){
                retData.isReward_bag = true;
            }
        }

        var findWinnerData = await cloud.db.collection("winner").find({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        },{
            projection: {
                rewardInfo: 1
            }
        });

        if(isRetError(findWinnerData)){
            return PackReturn(-2,"获取奖励数据失败")
        }
        if(findWinnerData.length > 0){
            for(var i = 0; i < findWinnerData.length; i++){
                if(findWinnerData[i].rewardInfo.name == "coupon"){
                    retData.isReward_bag = true;
                    retData.bag_num += 1;
                }else if(findWinnerData[i].rewardInfo.name == "redPacket"){
                    retData.isReward_bag = true;
                    retData.bag_num += 1;
                }else{
                    if(findWinnerData[i].rewardInfo.name == "goods"){
                        if(findWinnerData[i].rewardInfo.state == 0){
                            retData.isReward_bag = true;
                            retData.bag_num += 1;
                        }
                    }
                }
            }
        }
        

        var findUserData = await cloud.db.collection("users").find({
            //openid: openid,
            activeId: data.data.activeId
        },{
            projection: {
                rankEndNums: 1
            }
        });
        if(isRetError(findUserData)){
            return PackReturn(-2,"获取数据失败2");
        }
        if(findUserData.length <= 0){
            return PackReturn(-2,"获取数据失败3");
        }
        var rankEndNums = findUserData[0].rankEndNums;
        var lastEndNums = rankEndNums - 1;
        //排行榜奖励
        var findRankRecord = await cloud.db.collection("rankRecord").find({
            //openid: openid,
            activeId: data.data.activeId,
            rankEndNums: lastEndNums
        });
        if(isRetError(findRankRecord)){
            return PackReturn(-2,"获取数据错误2");
        }
        if(findRankRecord.length > 0){
            var rewardList = findRankRecord[0].rewardList;
            var list = findRankRecord[0].list;
            var rewardConfig = findRankRecord[0].rewardConfig;
            var destRank = -1;
            for(var i = 1; i <= list.length; i++){
                if(list[i-1].hasOwnProperty("userOpenId")){
                    if(list[i-1].userOpenId == userOpenId){
                        destRank = i;
                        break;
                    }
                }
            }
            //检测 玩家
            for(var i = 0; i < rewardList.length; i++){
                if(rewardList[i].hasOwnProperty("userOpenId")){
                    if(rewardList[i].userOpenId == userOpenId){
                        if(rewardList[i].isGet){
                            //检测是否在 配置的排名内
                            var isGet = false;
                            var isReward = false;
                            for(var k = 0; k < rewardConfig.length; k++){
                                if(rewardConfig[k].hasOwnProperty("rankNums")){
                                    isReward = true;
                                    break;
                                }
                            }
                            if(isReward){
                                for(var k = 0; k < rewardConfig.length; k++){
                                    if(rewardConfig[k].hasOwnProperty("rankNums")){
                                        if(destRank >= rewardConfig[k].rankNums[0] && destRank <= rewardConfig[k].rankNums[1]){
                                            isGet = true;
                                            break;
                                        }
                                    }
                                }
                            }else{
                                //默认领奖配置
                                if(destRank >= 1 && destRank <= 3){
                                    isGet = true;
                                }else if(destRank >= 4 && destRank <= 10){
                                    isGet = true;
                                }else if(destRank >= 11 && destRank <= 50){
                                    isGet = true;
                                }else{
                                }
                            }
                            retData.isReward_rank = isGet;
                        }
                        break;
                    }
                }
            }
        }
        //任务奖励
        var findTaskData = await cloud.db.collection("task").find({
            userOpenId: userOpenId,
            activeId: data.data.activeId
        });
        if(isRetError(findTaskData)){
            return PackReturn(-2,"获取任务数据")
        }
        if(findTaskData.length > 0){
            for(var i = 0; i < findTaskData[0].task.length; i++){
                if(findTaskData[0].task[i].state == 0){
                    retData.isReward_task = true;
                    // break;
                    retData.task_num += 1;
                }
            }
        }
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
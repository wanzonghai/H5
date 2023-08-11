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
//获取上个赛季排行榜数据
module.exports = async (context) =>{
    console.log("====3005====");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        //获取活动 赛季值
        var findData = await cloud.db.collection("users").find({
            //openid: openid,
            activeId: data.data.activeId
        },{
            projection: {
                rankEndNums: 1
            }
        });
        if(isRetError(findData) || findData.length <= 0){
            return PackReturn(-2,"获取数据失败");
        }
        var parm = findData[0];
        var rankEndNums = parm.rankEndNums;
        var lastEndNums = rankEndNums - 1;
        var retData = new Object();

        if(lastEndNums < 0){
            retData.list = [];
            retData.isOpenReward = false;
            retData.rewardConfig = [];
            retData.rank = -1;
            retData.rewardType = -1;
            retData.curPoint = 0;
            retData.isGet = false;
        }else{
            var findRankRecord = await cloud.db.collection("rankRecord").find({
                //openid: openid,
                activeId: data.data.activeId,
                rankEndNums: lastEndNums
            });
            if(isRetError(findRankRecord) || findRankRecord.length <= 0){
                // return PackReturn(-3,"查询失败");
                retData.list = [];
                retData.isOpenReward = false;
                retData.rewardConfig = [];
                retData.rank = -1;
                retData.rewardType = -1;
                retData.curPoint = 0;
                retData.isGet = false;
                return PackReturn(code,message,retData);
            }
            var recordParm = findRankRecord[0];
            retData.list = [];
            retData.isOpenReward = recordParm.isOpenReward;
            retData.rewardConfig = recordParm.rewardConfig;
            //排行榜 晒取50人
            for(var i = 0;i < recordParm.list.length; i++){
                if(retData.list.length >= 50){
                    break;
                }
                retData.list.push(recordParm.list[i]);
            }
            //用户 排名
            var list = recordParm.list;
            var destRank = -1;
            var curPoint = 0;
            for(var i = 1; i <= list.length; i++){
                if(list[i-1].hasOwnProperty("userOpenId")){
                    if(list[i-1].userOpenId == userOpenId){
                        destRank = i;
                        curPoint = list[i-1].point;
                        break;
                    }
                }
            }
            retData.curPoint = curPoint;
            retData.rank = destRank;
            //用户 具体奖品 
            var rewardList = recordParm.rewardList;
            var destReward = -1;

            var isGet = false;
            var isReward = false;

            for(var i = 0; i < rewardList.length; i++){
                if(rewardList[i].hasOwnProperty("userOpenId")){
                    if(rewardList[i].userOpenId == userOpenId){
                        destReward = rewardList[i].rewardType;
                        isGet = rewardList[i].isGet;
                        break;
                    }
                }
            }
            //检测 是否可以领取
            if(isGet){
                for(var i = 0; i < retData.rewardConfig.length; i++){
                    if(retData.rewardConfig[i].hasOwnProperty("rankNums")){
                        isReward = true;
                        break;
                    }
                }
                if(isReward){
                    for(var i = 0; i < retData.rewardConfig.length; i++){
                        if(retData.rewardConfig[i].hasOwnProperty("rankNums")){
                            if(destRank >= retData.rewardConfig[i].rankNums[0] && destRank <= retData.rewardConfig[i].rankNums[1]){
                                destReward = retData.rewardConfig[i].type;
                                isGet = true;
                                break;
                            }
                        }
                    }
                }else{
                    //默认领奖配置
                    if(destRank >= 1 && destRank <= 3){
                        isGet = true;
                        rewardType = 1;
                    }else if(destRank >= 4 && destRank <= 10){
                        isGet = true;
                        rewardType = 2;
                    }else if(destRank >= 11 && destRank <= 50){
                        isGet = true;
                        rewardType = 3;
                    }else{
                    }
                }   
            }
            retData.isGet = isGet;
            retData.rewardType = destReward;
        }
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
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
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
//埋点数据综合 
module.exports = async (context) =>{
    console.log("==C_MSG_GET_BURY_8==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;

        var retData = new Object();
        var sTime = data.data.sTime;
        var eTime = data.data.eTime;

        //查看奖池人数	lookPrizePool_players
        var findPoolPlayer = await cloud.db.collection("bury").aggregate([
            {
                $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    action:'lookPrizePool'
                }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
            }
        ]);
        retData.lookPrizePool_players = findPoolPlayer.length;
        //打开任务次数	openTask_nums openTask
        var openTaskNum = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'openTask'
        });
        retData.openTask_nums = openTaskNum;
        //打开任务人数	openTask_Players
        var openTaskPlayers = await cloud.db.collection("bury").aggregate([
        {
            $match: {
                time: { $gte:sTime , $lte:eTime },
                activeId:data.data.activeId,
                action:'openTask'
            }
        },
        {
            $group: {
                _id: '$userOpenId',
                count: { $sum: 1 }
            }
        }]);
        retData.openTask_Players = openTaskPlayers.length;
        //主界面 弹出礼包次数
        var hallShowGift_nums = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'hallShowGift'
        });
        retData.hallShowGift_nums = hallShowGift_nums;

        //主界面打开礼包次数	hallOpenGift_nums
        var hallOpenGift_nums = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'hallOpenGift'
        });
        retData.hallOpenGift_nums = hallOpenGift_nums;
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
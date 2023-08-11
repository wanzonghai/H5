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
    console.log("==C_MSG_GET_BURY_7==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;

        var retData = new Object();
        var sTime = data.data.sTime;
        var eTime = data.data.eTime;

        //[任务插件]看直播次数	tbTask_look_live_nums
        var tbTask_look_live_nums = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'tbTask',
            title:'浏览直播15S'
        });
        retData.tbTask_look_live_nums = tbTask_look_live_nums;
        //[任务插件]看直播人数	tbTask_look_live_players
        var tbTask_look_live_players = await cloud.db.collection("bury").aggregate([
            {
            $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    action:'tbTask',
                    title:'浏览直播15S'
            }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
            }
        ]);
        retData.tbTask_look_live_players = tbTask_look_live_players.length;
        //[任务插件]看店铺次数	tbTask_look_shop_nums
        var tbTask_look_shop_nums = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'tbTask',
            title:'浏览店铺15秒'
        });
        retData.tbTask_look_shop_nums = tbTask_look_shop_nums;
        //[任务插件]看店铺人数	tbTask_look_shop_players
        var tbTask_look_shop_players = await cloud.db.collection("bury").aggregate([
            {
            $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    action:'tbTask',
                    title:'浏览店铺15秒'
            }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
            }
        ]);
        retData.tbTask_look_shop_players = tbTask_look_shop_players.length;
        // //筛选 打开奖池次数
        var findPoolDataNum = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'lookPrizePool'
        });
        retData.lookPrizePool_nums = findPoolDataNum;
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
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
    console.log("==C_MSG_GET_BURY_6==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;

        var retData = new Object();
        var sTime = data.data.sTime;
        var eTime = data.data.eTime;

        //筛选出 总粉丝数
        var fansTodayData = await cloud.db.collection("players").aggregate([
            {
              $match: {
                    stampTime: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    isVip:true
               }
            },
            {
              $group: {
               _id: '$userOpenId',
               count: { $sum: 1 }
              }
            }
        ]);
        retData.fansTotal_today = fansTodayData.length;
        //筛选出 会员数
        var memberTotalData = await cloud.db.collection("players").aggregate([
            {
              $match: {
                    stampTime: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    isMember:true
               }
            },
            {
              $group: {
               _id: '$userOpenId',
               count: { $sum: 1 }
              }
            }
        ]);
        retData.memberTotal_today = memberTotalData.length;
        //淘宝任务
        var findTBTaskData = await cloud.db.collection("bury").find({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "tbTask"
        },{
            projection: {
                userOpenId: 1,
                title: 1
            }
        });
        if(isRetError(findTBTaskData)){
            return PackReturn(-2,"获取淘宝任务数据失败");
        }
        //淘宝-签到任务 浏览直播间15s 浏览店铺15s
        //[任务插件]签到次数	tbTask_sign_nums
        var tbTask_sign_nums = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'tbTask',
            title:'签到任务'
        });
        retData.tbTask_sign_nums = tbTask_sign_nums;
        // //[任务插件]签到人数	tbTask_sign_players
        var tbTask_sign_players = await cloud.db.collection("bury").aggregate([
            {
                $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    action:'tbTask',
                    title:'签到任务'
                }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
            }
        ]);
        retData.tbTask_sign_players = tbTask_sign_players.length;
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
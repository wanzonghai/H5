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
    console.log("==C_MSG_GET_BURY_9==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;

        var retData = new Object();
        var sTime = data.data.sTime;
        var eTime = data.data.eTime;

        //主界面打开礼包人数	hallOpenGift_players
        var hallOpenGift_players = await cloud.db.collection("bury").aggregate([
        {
            $match: {
                time: { $gte:sTime , $lte:eTime },
                activeId:data.data.activeId,
                action:'hallOpenGift'
            }   
        },
        {
            $group: {
                _id: '$userOpenId',
                count: { $sum: 1 }
            }
        }]);
        retData.hallOpenGift_players = hallOpenGift_players.length;
        //主界面 弹出分享送牛的次数
        var hallShowShare_nums = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'hallShowGift'
        });
        retData.hallShowShare_nums = hallShowShare_nums;
        //主界面 打开分享送牛的次数
        var hallOpenShare_nums = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'hallOpenShare'
        });
        retData.hallOpenShare_nums = hallOpenShare_nums;
        //主界面分享人数	hallOpenShare_players
        var hallOpenShare_players = await cloud.db.collection("bury").aggregate([
            {
                $match: {
                        time: { $gte:sTime , $lte:eTime },
                        activeId:data.data.activeId,
                        action:'hallOpenShare'
                }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
        }]);
        retData.hallOpenShare_players = hallOpenShare_players.length;
        //启动游戏次数 openApp
        var openAppNums = await cloud.db.collection("bury").count({
            time: { $gte:sTime , $lte:eTime },
            activeId:data.data.activeId,
            action: "openApp"
        });
        retData.openAppNums = openAppNums;
        //启动游戏人数 openApp_players
        var openApp_players = await cloud.db.collection("bury").aggregate([
            {
                $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    action:'openApp'
                }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
            }
        ]);
        retData.openApp_players = openApp_players.length;
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
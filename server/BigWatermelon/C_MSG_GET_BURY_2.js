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
    console.log("==C_MSG_GET_BURY_2==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;

        var retData = new Object();
        var sTime = data.data.sTime;
        var eTime = data.data.eTime;
        //enterGame
        var enterGameNums = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "enterGame"
        });
        retData.enterGameNums = enterGameNums;
        // 参与游戏人数	enterGamePlayers
        var enterGamePlayers = await cloud.db.collection("bury").aggregate([
            {
                $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    action:'enterGame'
                }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
            }
        ]);
        retData.enterGamePlayers = enterGamePlayers.length;
        //enterGame_type_0
        var enterGame_type_0 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "enterGame",
            type: 0
        });
        retData.enterGame_type_0 = enterGame_type_0;
        //enterGame_type_1
        var enterGame_type_1 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "enterGame",
            type: 1
        });
        retData.enterGame_type_1 = enterGame_type_1;
        //enterGame_type_2
        var enterGame_type_2 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "enterGame",
            type: 2
        });
        retData.enterGame_type_2 = enterGame_type_2;
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
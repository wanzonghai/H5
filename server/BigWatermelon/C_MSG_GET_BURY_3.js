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
    console.log("==C_MSG_GET_BURY_3==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;

        var retData = new Object();
        var sTime = data.data.sTime;
        var eTime = data.data.eTime;

        //joinFavor
        var joinFavorNums = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinFavor",
            type: {
                $gte: 0,
            }
        });
        retData.joinFavorNums = joinFavorNums;
        //关注店铺总人数	joinFavorPlayers
        var joinFavorPlayers = await cloud.db.collection("bury").aggregate([
            {
            
                $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    action:'joinFavor',
                    type: {
                        $gte: 0,
                    }
                }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
            }
        ]);
        retData.joinFavorPlayers = joinFavorPlayers.length;
        //joinFavor_type_0
        var joinFavor_type_0 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinFavor",
            type: 0
        });
        retData.joinFavor_type_0 = joinFavor_type_0;
        //joinFavor_type_1
        var joinFavor_type_1 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinFavor",
            type: 1
        });
        retData.joinFavor_type_1 = joinFavor_type_1;
        //joinFavor_type_2
        var joinFavor_type_2 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinFavor",
            type: 2
        });
        retData.joinFavor_type_2 = joinFavor_type_2;
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
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
    console.log("==C_MSG_GET_BURY_4==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;

        var retData = new Object();
        var sTime = data.data.sTime;
        var eTime = data.data.eTime;

        //joinMember
        var joinMemberNums = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinMember",
            type: {
                $gte: 0,
            }
        });
        retData.joinMemberNums = joinMemberNums;
        //加入会员总人数	joinMemberPlayers
        var joinMemberPlayers = await cloud.db.collection("bury").aggregate([
            {
                $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    action:'joinMember',
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
        retData.joinMemberPlayers = joinMemberPlayers.length;
        //joinMember_type_0
        var joinMember_type_0 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinMember",
            type: 0
        });
        retData.joinMember_type_0 = joinMember_type_0;
        //joinMember_type_1
        var joinMember_type_1 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinMember",
            type: 1
        });
        retData.joinMember_type_1 = joinMember_type_1;
        //joinMember_type_2
        var joinMember_type_2 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinMember",
            type: 2
        });
        retData.joinMember_type_2 = joinMember_type_2;
        //joinMember_type_3
        var joinMember_type_3 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinMember",
            type: 3
        });
        retData.joinMember_type_3 = joinMember_type_3;
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
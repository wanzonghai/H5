var code = 0;
var message = "成功";

function bIsNull(a) {
    if (a !== null && a !== undefined) {
        return false;
    }
    return true;
}

function isRetError(ret) {
    if (!ret == null || ret == undefined || ret < 0) {
        return true;
    }
    return false;
}

function PackReturn(code, message, data) {
    if (data == undefined) {
        return JSON.stringify({
            code: code,
            message: message
        });
    } else {
        return JSON.stringify({
            code: code,
            message: message,
            data: data
        });
    }
}
//发奖确认
module.exports = async(context) => {
    console.log("**3007**");
    try {
        const cloud = context.cloud;
        const data = context.data;
        const openid = context.appOwnerOpenId;
        const findData = await cloud.db.collection("winner").find({
            //openid: openid,
            activeId: data.data.activeId,
            userOpenId: data.data.userOpenId
        });
        if (isRetError(findData) || findData.length <= 0) {
            return PackReturn(-2, "获取发奖数据失败");
        }
        var parm = findData[0];
        // 0: 未发货 1：已发货
        //   if(parm.isShip == 1){
        //       return PackReturn(-3,"奖品已发放");
        //   }
        const ret = await cloud.db.collection("winner").updateMany({
            //openid: openid,
            activeId: data.data.activeId,
            userOpenId: data.data.userOpenId,
            orderId: data.data.orderId,
        }, {
            $set: {
                company: data.data.company,
                logisticsId: data.data.logisticsId,
                isShip: data.data.isShip !== undefined ? data.data.isShip : 1,
                shipTime: new Date().getTime()
            }
        });
        if (isRetError(ret)) {
            return PackReturn(-3, "发奖失败");
        }
        return PackReturn(code, message);
    } catch (e) {
        return PackReturn(-4, "catch失败", e);
    }
}
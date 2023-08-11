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
// B端到期,禁止C端进入
module.exports = async(context) => {
    console.log("**4012**");
    try {
        //时间段
        const cloud = context.cloud;
        const data = context.data;
        const userOpenId = context.openId;

        // 是否B端到期, true:到期 false: 没过期
        let expired = data.data.expired;

        console.log('---userOpenId---', userOpenId)
        console.log('---data---', data.data)
        console.log('---expired---', expired)

        var retData = await cloud.db.collection("users").updateMany({
            creatorId: userOpenId
        }, {
            $set: {
                expired: expired
            }
        });
        return PackReturn(code, message, retData);
    } catch (e) {
        return PackReturn(-4, "catch失败", e);
    }
}
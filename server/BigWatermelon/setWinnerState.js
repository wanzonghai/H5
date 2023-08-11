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
// 修改winner表 领奖状态
module.exports = async(context) => {
    console.log("==setWinnerState==");
    try {
        //时间段
        const cloud = context.cloud;
        var data = context.data.data;
        await cloud.db.collection("winner").updateMany({
            isWinner: true,
            isShip: 0,
            activeId: data.data.activeId,
            "rewardInfo.name": "goods"
        },{
            $set: {
                "rewardInfo.state": 0
            }
        });
        return PackReturn(code,message);
    } catch (e) {
        return PackReturn(-4, "catch失败", e);
    }
}
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
// B端获取配置表
module.exports = async(context) => {
    console.log("**4013**");
    try {
        //时间段
        const cloud = context.cloud;
        var findListTask = await cloud.db.collection("listTask").find({
            name: "listTask"
        });
        if(isRetError(findListTask)){
            return PackReturn(-1,"获取数据失败");
        }
        if(findListTask.length <= 0){
            return PackReturn(code,message,[]);
        }
        return PackReturn(code, message,findListTask[0].task);
    } catch (e) {
        return PackReturn(-4, "catch失败", e);
    }
}
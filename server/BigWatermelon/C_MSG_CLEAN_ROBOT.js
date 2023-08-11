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
//清理指定活动机器人
module.exports = async (context) =>{
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        await cloud.db.collection("rank").updateMany({
            activeId: data.data.activeId, 
        },{
            $set: {
                point: 0
            }
        });
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
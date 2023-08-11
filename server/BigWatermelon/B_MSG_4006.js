var code = 0;
var message = "成功";
function bIsNull(a) {
    if(a !== null && a !== undefined) {
        return false;
    }
    return true;
}
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
//更改活动状态false
module.exports = async (context) =>{
    console.log("**4006**");
    try {
        //时间段
        const cloud = context.cloud;
        const data = context.data;
        const openid = context.appOwnerOpenId;

        var retData = await cloud.db.collection("users").updateMany({
            //openid: openid,
            activeId: data.data.activeId
        },{
            $set: {
                state: false
            }
        });
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
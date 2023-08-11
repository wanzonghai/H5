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
//加入黑名单
module.exports = async (context) =>{
    console.log("**4001**");
    try {
        const cloud = context.cloud;
        const data = context.data;
        const openid = context.appOwnerOpenId;
        var retData = await cloud.db.collection("players").updateMany({ 
            //openid: openid,
            activeId: data.data.activeId,
            userOpenId: data.data.userOpenId
        },{
            $set: {
                isInBackList: true
            }
        });
        if(isRetError(retData)){
            return PackReturn(-2,"加入黑名单失败");
        }
        return PackReturn(code,message);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
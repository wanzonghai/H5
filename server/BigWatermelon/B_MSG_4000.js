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
//配置用户金币
module.exports = async (context) =>{
    console.log("**4000**");
    try {
        const cloud = context.cloud;
        const data = context.data;
        const openid = context.appOwnerOpenId;
        if(!data.data.userCoin || data.data.userCoin == ""){
            return PackReturn(-2,"配置金币数据错误");
        }
        var newUserCoin = Number(data.data.userCoin);
        var retData = await cloud.db.collection("players").updateMany({ 
            //openid: openid,
            activeId: data.data.activeId,
            userOpenId: data.data.userOpenId
        },{
            $set: {
                userCoin: newUserCoin
            }
        });
        if(isRetError(retData)){
            return PackReturn(-2,"配置金币失败");
        }
        return PackReturn(code,message);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
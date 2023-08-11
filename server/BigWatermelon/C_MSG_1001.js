
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
//上传玩家数据
module.exports = async (context) =>{
    console.log("==1001==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var findData = await cloud.db.collection("players").find({
            //openid: openid,
            userOpenId:userOpenId,
            activeId: data.data.activeId
        });
        if(isRetError(findData) || findData.length <= 0){
            return PackReturn(-2,"获取数据失败");
        }
        const ret = await cloud.db.collection("players").updateMany({
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId
        },{
            $set:{
                nickName: data.data.nickName,  
                headUrl: data.data.headUrl
            }
        });
        if(isRetError(ret)){
            return PackReturn(-2,"更新失败");
        }
        //更新 玩家数据 invitationInfo 数据
        var parm = findData[0];
        if(parm.fromInfo.userOpenId != ""){
            await cloud.db.collection("players").updateMany({
                //openid: openid,
                userOpenId: parm.fromInfo.userOpenId,
                activeId: data.data.activeId
            },{
                $set:{
                        "invitationInfo.nickName": data.data.nickName,  
                        "invitationInfo.headUrl": data.data.headUrl
                }
            });
        }
        return PackReturn(code,message);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
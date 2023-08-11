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
//分享信息获取
module.exports = async (context) =>{
    console.log("==1024==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var playerData = await cloud.db.collection("players").find({ 
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId
        });
        if(isRetError(playerData) || playerData.length <= 0){
            return PackReturn(-2,"获取玩家数据失败");
        }
        var info = new Object();
        info.fromInfo = playerData[0].fromInfo;
        info.invitationInfo = playerData[0].invitationInfo;
        //玩家 邀请相关数据置空
        var newFromInfo = {
            userOpenId: "",
            nickName: "",
            headUrl: ""
        };
        var newInvitationInfo = {
            isRegister: false,
            nickName: "",
            headUrl: "",
            coin: 0
        };
        await cloud.db.collection("players").updateMany({ 
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId
        },{
            $set: {
                fromInfo: newFromInfo,
                invitationInfo: newInvitationInfo
            }
        });
        return PackReturn(code,message,info);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
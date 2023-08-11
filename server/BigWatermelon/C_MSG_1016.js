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
//获取任务信息
module.exports = async (context) =>{
    console.log("==1016==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        // const findData = await cloud.db.collection("users").find({ 
        //     //openid: openid,
        //     activeId: data.data.activeId
        // });
        // // console.log("MSG_TASK findData: ",findData);
        // if(isRetError(findData) || findData.length <= 0){
        //     return PackReturn(-1,"获取配置失败");
        // }
        //测试 使用第二个下表 配置
        var playerData = await cloud.db.collection("players").find({ 
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId
        });
        if(isRetError(playerData) || playerData.length <= 0){
            return PackReturn(-2,"获取玩家数据失败");
        }

        var player = playerData[0];

        var retData = {
            shareCount: player.count_share,
            friendCount: player.count_invitation,
        };
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
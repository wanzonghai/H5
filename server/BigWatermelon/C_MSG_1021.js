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
//上报战斗结果
module.exports = async (context) =>{
    console.log("==1021==");
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
        //修改 数据
        var parm = playerData[0];
        parm.allWin = parm.allWin + 1;
        parm.integral = parm.integral + data.data.integral;
        parm.lianshengCount = data.data.lianshengCount;
        if(data.data.lianshengCount > parm.bestWin){
            parm.bestWin = data.data.lianshengCount;
        }
        //更新数据
        const ret = await cloud.db.collection("players").updateMany({
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId
            },{
                $set: parm
            }
        );
        if(isRetError(ret)){
            return PackReturn(-2,"更新数据失败");
        }
        return PackReturn(code,message);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
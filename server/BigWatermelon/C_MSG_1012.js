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
//上报挑战券数量
module.exports = async (context) =>{
    console.log("==1012==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var playerData = await cloud.db.collection("players").find({ 
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId
        },{
            projection: {
                point: 1
            }
        });
        if(isRetError(playerData) || playerData.length <= 0){
            return PackReturn(-2,"获取玩家数据失败");
        }
        var parm = playerData[0];

        var changePoint = Number(data.data.changePoint);
        var curPoint = parm.point + changePoint;
        var isBestPoint = false;
        if(curPoint > parm.bestPoint){
            isBestPoint = true;
        }
        if(isBestPoint){
            //更新数据
            const ret = await cloud.db.collection("players").updateMany({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId
                },{
                    $set: {
                        bestPoint: curPoint
                    },
                    $inc: {
                        point: changePoint
                    }
                }
            );
            if(isRetError(ret)){
                return PackReturn(-2,"更新数据失败");
            }
        }else{
            //更新数据
            const ret = await cloud.db.collection("players").updateMany({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId
                },{
                    $inc: {
                        point: changePoint
                    }
                }
            );
            if(isRetError(ret)){
                return PackReturn(-2,"更新数据失败");
            }
        }
        return PackReturn(code,message,{point: curPoint});
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
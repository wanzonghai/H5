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

//增加金币
module.exports = async (context) =>{
    console.log("==1022==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var changeCoin = parseInt(data.data.changeCoin);
        //获取任务配置
        var playerData = await cloud.db.collection("players").find({ 
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId
        },{
            projection: {
                userCoin: 1
            }
        });
        if(isRetError(playerData) || playerData.length <= 0){
            return PackReturn(-2,"获取玩家数据失败");
        }
        //当前数据
        var parm = playerData[0];
        var curCoin = parm.userCoin;
        curCoin += changeCoin;
        //更新数据
        const ret = await cloud.db.collection("players").updateMany({
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId
            },{
                $inc: {
                    userCoin: changeCoin
                }
            }
        );
        if(isRetError(ret)){
            return PackReturn(-2,"更新数据失败");
        }
       return PackReturn(code,message,{userCoin: curCoin});
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
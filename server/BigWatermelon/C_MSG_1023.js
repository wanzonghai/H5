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
//消耗金币
module.exports = async (context) =>{
    console.log("==1023==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var findUserData = await cloud.db.collection("users").find({
            activeId: data.data.activeId,
            state: true
        });
        if(isRetError(findUserData) || findUserData.length <= 0){
            return PackReturn(-2,"获取数据失败1");
        }
        var userParm = findUserData[0];
        //活动开始检测
        if(userParm.hasOwnProperty("sTime")){
            if(userParm.sTime > new Date().getTime()){
                return PackReturn(-10,"活动未开始");
            }
        }
        //活动开始检测
        if(userParm.hasOwnProperty("sTime")){
            if(userParm.sTime > new Date().getTime()){
                return PackReturn(-10,"活动未开始");
            }
        }
        //活动结束检测
        if(userParm.hasOwnProperty("eTime")){
            if(userParm.eTime <= new Date().getTime()){
                return PackReturn(-11,"活动到期");
            }
        }
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
        //修改 数据
        var parm = playerData[0];
        var curCoin = parm.userCoin;
        curCoin -= Number(data.data.changeCoin);
        if(curCoin < 0){
            return PackReturn(-2,"金币不足");
        }
        //更新数据
        const ret = await cloud.db.collection("players").updateMany({
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId 
            },{
                $set: {
                    userCoin: curCoin
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
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
//存放玩家 已经拥有的角色id
module.exports = async (context) =>{
    console.log("==3007==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var findPlayerData = await cloud.db.collection("players").find({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        });
        if(isRetError(findPlayerData) || findPlayerData.length <= 0){
            return PackReturn(-2,"获取数据失败");
        }
        var playerParm = findPlayerData[0];
        if(playerParm.hasOwnProperty("roleList")){
            await cloud.db.collection("players").updateMany({
                activeId: data.data.activeId,
                userOpenId: userOpenId
            },{
                $addToSet: {
                    roleList: data.data.roleId
                }
            });
        }else{
            var newList = [];
            newList.push(0);
            newList.push(data.data.roleId);
            await cloud.db.collection("players").updateMany({
                activeId: data.data.activeId,
                userOpenId: userOpenId
            },{
                $set: {
                    roleList: newList
                }
            });
        }
        return PackReturn(code,message);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
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
//获取用户中奖信息
module.exports = async (context) =>{
    console.log("**3009**");
    try {
        const cloud = context.cloud;
        const data = context.data;
        const openid = context.appOwnerOpenId;
        const ret = await cloud.db.collection("winner").find(
            {  
                isWinner: true,
                //openid: openid,
                userOpenId: data.data.userOpenId,
                activeId: data.data.activeId,
                "rewardInfo.state": 1
            }, 
            {  
                //预留字段  收货人  电话 地址  发货状态  奖励信息
                projection: {
                    activeId: 1,
                    userOpenId: 1,
                    consignee: 1,
                    phone: 1,
                    address: 1,
                    isShip: 1,
                    rewardInfo: 1,
                    orderId: 1,
                    company: 1,
                    logisticsId: 1,
                    shipTime: 1,
                    rewardTime: 1,
                    tbName: 1
                }, 
            }
        )
        if(isRetError(ret)){
            return PackReturn(-2,"获取用户数据失败");
        }
        if(ret.length > 0){
            for(var i = 0; i < ret.length; i++){
                if(!ret[i].hasOwnProperty("tbName")){
                    var findPlayerData = await cloud.db.collection("players").find({
                        activeId: ret[i].activeId,
                        userOpenId: ret[i].userOpenId
                    },{
                        projection: {
                            nickName: 1,
                        }
                    });
                    if(isRetError(findPlayerData) || findPlayerData.length <= 0){
                        continue;
                    }
                    ret[i]["tbName"] = findPlayerData[0].nickName;
                }
            }
        }
        return PackReturn(code,message,ret);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
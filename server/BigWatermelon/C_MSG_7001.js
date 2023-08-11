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
//获取库存数据
module.exports = async (context) =>{
    console.log("==7001==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const cloud = context.cloud;

        if(!data.data.hasOwnProperty("activeId")){
            console.log("activeId为空");
            return PackReturn(-1,"activeId为空");
        }

        var retData = new Object();

        var findUserData = await cloud.db.collection("users").find({
            activeId: data.data.activeId
        },{
            projection:{
                integralRewardConfig: 1
            }
        });
        if(isRetError(findUserData)){
            return PackReturn(-2,"获取活动数据失败");
        }
        retData.integralRewardConfig = findUserData[0].integralRewardConfig;
        var findStock = await cloud.db.collection("stock").find({
            activeId: data.data.activeId,
        },{
            projection: {
                stockConfig: 1,
                exchangeConfig: 1
            }
        });
        if(isRetError(findStock)){
            return PackReturn(-2,"获取库存数据失败");
        }
        console.log("findStock: ",findStock.length);
        retData.stockConfig = findStock[0].stockConfig;
        retData.exchangeConfig = findStock[0].exchangeConfig;
        var findPlayerData = await cloud.db.collection("players").find({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        },{
            projection: {
                exchangeData: 1
            }
        });
        if(isRetError(findPlayerData)){
            return PackReturn(-2,"获取玩家数据失败");
        }
        console.log("findPlayerData: ",findPlayerData.length);
        if(findPlayerData[0].hasOwnProperty("exchangeData")){
            retData.exchangeData = findPlayerData[0].exchangeData;
        }else{
            retData.exchangeData = [];
        }
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
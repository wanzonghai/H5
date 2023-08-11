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
//获取奖品领取数量
module.exports = async (context) =>{
    console.log("==3003==");
    try {
        var data = context.data.data;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var findData = await cloud.db.collection("users").find({ 
            //openid: openid,
            activeId: data.data.activeId
        },{
            projection: {
                "gameConfig.redPacketList": 1
            }
        });
        if(isRetError(findData)){
            return PackReturn(-2,"获取活动数据失败");
        }
        if(findData.length <= 0){
            return PackReturn(code,message,findData);
        }
        var parm = findData[0];
        var redPacketList = parm.gameConfig.redPacketList;
        var retData = [];
        if(redPacketList.length > 0){
            for(var i = 0; i < redPacketList.length; i++){
                var newObj = new Object();
                newObj.type = redPacketList[i].type;
                newObj.total = redPacketList[i].openNums;
                retData.push(newObj);
            }  
        }
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
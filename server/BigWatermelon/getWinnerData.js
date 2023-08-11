var code = 0;
var message = "成功";

function bIsNull(a) {
    if (a !== null && a !== undefined) {
        return false;
    }
    return true;
}

function isRetError(ret) {
    if (!ret == null || ret == undefined || ret < 0) {
        return true;
    }
    return false;
}

function PackReturn(code, message, data) {
    if (data == undefined) {
        return JSON.stringify({
            code: code,
            message: message
        });
    } else {
        return JSON.stringify({
            code: code,
            message: message,
            data: data
        });
    }
}
// 获取商家对应的 用户中奖数据
module.exports = async(context) => {
    console.log("==getWinnerData==");
    try {
        //时间段
        const cloud = context.cloud;
        var data = context.data.data;
        //"rewardInfo.state": 1
        var retData = await cloud.db.collection("winner").find({
            activeId: data.data.activeId,
            isShip: 0,
            "rewardInfo.name": "goods"
        },{
            projection: {
                userOpenId: 1,
                tbName: 1,
                address: 1,
                phone: 1,
                consignee: 1,
                "rewardInfo.price": 1,
                "rewardInfo.title": 1,
            }
        });
        if(isRetError(retData)){
            return PackReturn(-1,"获取数据失败");
        }
        var list = [];
        if(retData.length > 0){
            for(var i = 0; i < retData.length; i++){
                var newObject = new Object();
                newObject.address = retData[i].address;
                newObject.phone = retData[i].phone;
                newObject.consignee = retData[i].consignee;
                newObject.price = retData[i].rewardInfo.price;
                newObject.title = retData[i].rewardInfo.title;
                if(retData[i].hasOwnProperty("tbName")){
                    newObject.tbName = retData[i].tbName;
                }else{
                    var findPlayer = await cloud.db.collection("players").find({
                        activeId: data.data.activeId,
                        userOpenId: retData[i].userOpenId
                    });
                    console.log("findPlayer: ",findPlayer.length);
                    if(isRetError(findPlayer) || findPlayer.length <= 0){
                        continue;
                    }
                    newObject.tbName = findPlayer[0].nickName;
                }
                list.push(newObject);
            }
        }
        return PackReturn(code,message,list);
    } catch (e) {
        return PackReturn(-4, "catch失败", e);
    }
}
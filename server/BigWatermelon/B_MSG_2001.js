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
//获取活动数据
module.exports = async (context) =>{
    console.log("**2001**");
    try {
        const cloud = context.cloud;
        const data = context.data;
        const openid = context.appOwnerOpenId;
        const userOpenId = context.openId;
        // console.log("data: ",data);

        //获取全部活动
        var findData = await cloud.db.collection("users").find({ 
            //openid: openid,
            creatorId: userOpenId
        },{
            projection: {
                shopName: 1,
                storeId: 1
            }
        });
        // console.log("findData: ",findData);
        if(isRetError(findData)){
            return PackReturn(-2,"获取数据失败");
        }
        if(findData.length <= 0){
            return PackReturn(-2,"未获取到商户数据");
        }

        for(var i = 0; i < findData.length; i++){
            var newObj = new Object();
            if(!findData[i].hasOwnProperty("shopName")){
                newObj.shopName = data.data.shopName;
            }
            if(!findData[i].hasOwnProperty("storeId")){
                newObj.storeId = data.data.storeId;
            }
            // console.log("newObj: ",newObj);
            if(Object.keys(newObj).length > 0){
                await cloud.db.collection("users").updateMany({
                    creatorId: userOpenId
                },{
                    $set: newObj
                });
            }
        }
        return PackReturn(code,message);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
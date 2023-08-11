const moment = require('moment')
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
//获取商家订购关系
module.exports = async (context) =>{
    console.log("==getShopSubscribe==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        
        var findUserData = await cloud.db.collection("users").aggregate([
            {
                $match: {
                    state: true,
                }
            },{
                $group: {
                    _id: {
                        activeId: "$activeId",
                        shopName: "$shopName",
                        createTime: "$createTime",
                        sTime: "$sTime",
                        eTime: "$eTime"
                    }
                }
            }
        ]);
        console.log("findUserData: ",findUserData.length);
        if(isRetError(findUserData)){
            return PackReturn(-2,"获取活动数据失败");
        }
        if(findUserData.length <= 0){
            return PackReturn(-2,"未获取活动数据");
        }
        // console.log("findUserData: ",findUserData[0]._id);
        for(var i = 0; i < findUserData.length; i++){
            var iActive = findUserData[i]._id;
            if(!iActive.hasOwnProperty("shopName")){
                continue;
            }
            if(iActive.shopName == ""){
                continue;
            }
            if(iActive.hasOwnProperty("sTime") || iActive.hasOwnProperty("eTime")){
                continue;
            }
            var iName = iActive.shopName;
            if(iActive.shopName.indexOf(":") != -1){
                iName = iActive.shopName.split(":")[0];
            }
            // console.log("iName: ",iName);
            var ret = await cloud.topApi.invoke({
                api: "taobao.vas.subscribe.get",
                data: {
                    article_code: "FW_GOODS-1001123506",
                    nick: iName
                }
            });
            if(ret.article_user_subscribes.hasOwnProperty("article_user_subscribe")){
                if(ret.article_user_subscribes.article_user_subscribe.length > 0){
                    var endTime = -1;
                    for(var k = 0; k < ret.article_user_subscribes.article_user_subscribe.length; k++){
                        // console.log("article_user_subscribe: ",ret.article_user_subscribes.article_user_subscribe[k]);
                        var newData = new Date(ret.article_user_subscribes.article_user_subscribe[k].deadline);
                        var newTime = newData.getTime();
                        // console.log("newTime: ",newTime);
                        if(newTime > endTime){
                            endTime = newTime;
                        }
                    }
                    if(endTime == -1){
                        continue;
                    }
                    // console.log("createTime: ",iActive.createTime);
                    // console.log("endTime: ",endTime);
                    // console.log("activeId: ",iActive.activeId);
                    //更新活动sTime和eTime
                    await cloud.db.collection("users").updateMany({
                        activeId: iActive.activeId
                    },{
                        $set: {
                            sTime: iActive.createTime,
                            eTime: endTime
                        }
                    });
                    // console.log("retData: ",retData);
                }else{
                    //更新活动sTime和eTime 未获取到订购 默认推迟一个月
                    var endTime = Number(moment(iActive.createTime).add(1,"months").format("x").valueOf());
                    await cloud.db.collection("users").updateMany({
                        activeId: iActive.activeId
                    },{
                        $set: {
                            sTime: iActive.createTime,
                            eTime: endTime
                        }
                    });
                }
            }else{
                //更新活动sTime和eTime
                var endTime = Number(moment(iActive.createTime).add(1,"months").format("x").valueOf());
                await cloud.db.collection("users").updateMany({
                    activeId: iActive.activeId
                },{
                    $set: {
                        sTime: iActive.createTime,
                        eTime: endTime
                    }
                });
            }
        }
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
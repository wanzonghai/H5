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
//获取奖品池奖励
module.exports = async (context) =>{
    console.log("==1031==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var findData = await cloud.db.collection("winner").find({ 
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId,
        });
        if(isRetError(findData)){
            return PackReturn(-2,"获取活动数据失败");
        }
        findData.sort((a,b)=>{
            return b.rewardTime - a.rewardTime
        });
        var rewardList = [];
        if(findData.length > 0){
            for(var i = 0; i < findData.length; i++){
                var parm = findData[i];
                var newRet = new Object();
                newRet.orderId = parm.orderId;
                newRet.id = parm.rewardInfo.num_iid;
                newRet.price = parm.rewardInfo.price;
                newRet.url = parm.rewardInfo.pic_url;
                newRet.name = parm.rewardInfo.name;
                newRet.type = parm.rewardInfo.type;
                newRet.title = parm.rewardInfo.title;
                newRet.state = parm.rewardInfo.state;
                if(parm.rewardInfo.hasOwnProperty("linkId")){
                    newRet.linkId = parm.rewardInfo.linkId;
                }
                newRet.spec = "无";
                if(parm.hasOwnProperty("sTime")){
                    newRet.getDate = parm.sTime || "";
                }else{
                    newRet.getDate = "";
                }
                if(parm.hasOwnProperty("eTime")){
                    newRet.dueDate = parm.eTime || "";
                }else{
                    newRet.dueDate = "";
                }
                newRet.rewardTime = parm.rewardTime;
                rewardList[rewardList.length] = newRet;
            }
        }
        await cloud.db.collection("players").updateMany({
            //openid: openid,
            activeId: data.data.activeId,
            userOpenId: userOpenId
        },{
            $set: {
                isHasReward_bag: false
            }
        });
        return PackReturn(code,message,rewardList);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }   
}
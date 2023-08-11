
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
//获取玩家活动期间 积分排行奖励
module.exports = async (context) =>{
    console.log("==8002==");
    try {
        var data = context.data.data;
        var userOpenId = context.openId;
        const cloud = context.cloud;
        console.log("111: ",data);
        console.log("userOpenId: ",userOpenId);
        console.log("activeId: ",data.data.activeId);
        var findUserData = await cloud.db.collection("users").find({
            activeId: data.data.activeId
        },{
            projection: {
                sTime: 1
            }
        });
        if(isRetError(findUserData) || findUserData.length <= 0){

        }else{
            if(findUserData[0].hasOwnProperty("sTime")){
                if(findUserData[0].sTime > new Date().getTime()){
                    return PackReturn(-10,"活动未开始");
                }
            }
        }
        //检测 是否弹出过奖励弹框
        var findPlayerData = await cloud.db.collection("players").find({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        },{
            projection: {
                isDialogReward: 1
            }
        });
    
        console.log("222");
        if(isRetError(findPlayerData) || findPlayerData.length <= 0){
            return PackReturn(-1,"获取玩家数据失败");
        }
        if(findPlayerData[0].hasOwnProperty("isDialogReward")){
            if(findPlayerData[0].isDialogReward){
                return PackReturn(-2,"已经弹出过奖励弹框")
            }
        }
        //获取排行榜积分结算榜
        var findRankRecord = await cloud.db.collection("rankRecord").find({
            activeId: data.data.activeId
        },{
            projection: {
                rewardList: 1
            }
        });
        if(isRetError(findRankRecord) || findRankRecord.length <= 0){
            return PackReturn(-1,"获取结算排行榜失败");
        }
        var retData = new Object();
        retData.curRank = -1;
        retData.rewardType = -1;
        retData.title = "";
        //具体排名范围 根据vivo定制
        //找到自己的排名
        var isGet = false;
        var rewardList = findRankRecord[0].rewardList;
        for(var i = 0; i < rewardList.length; i++){
            if(rewardList[i].hasOwnProperty("userOpenId")){
                if(userOpenId == rewardList[i].userOpenId){
                    retData.curRank = rewardList[i].rank;
                    retData.rewardType = rewardList[i].rewardType;
                    retData.title = rewardList[i].title;
                    if(rewardList[i].hasOwnProperty("price")){
                        retData.price = rewardList[i].price;
                    }
                    if(rewardList[i].hasOwnProperty("pic_url")){
                        retData.pic_url = rewardList[i].pic_url;
                    }
                    isGet = true;
                    break;
                }
            }
        }
        if(isGet){
            //更新用户弹出记录 
            await cloud.db.collection("players").updateMany({
                activeId: data.data.activeId,
                userOpenId: userOpenId
            },{
                $set: {
                    isDialogReward: true
                }
            });
            return PackReturn(code,message,retData);
        }else{
            return PackReturn(-3,"未上榜");
        }
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
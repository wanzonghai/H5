
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
//获取积分排行奖励
module.exports = async (context) =>{
    console.log("==8003==");
    try {
        const cloud = context.cloud;

        //获取排行榜积分结算榜
        var findRankReward = await cloud.db.collection("rankReward").find({
            name: "rankReward"
        });
        if(isRetError(findRankReward) || findRankReward.length <= 0){
            return PackReturn(-1,"获取排行榜奖励失败");
        }
        return PackReturn(code,message,findRankReward[0].list);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
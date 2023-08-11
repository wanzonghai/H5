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
// 排行榜结算时 人数足够但未发奖时 后端补救 发奖接口
module.exports = async(context) => {
    console.log("**otherRankReward**");
    try {
        const cloud = context.cloud;
        var data = context.data.data;
        console.log("data: ",data);
        //rankEndNums
        var findRank = await cloud.db.collection("rankRecord").find({
            activeId: data.data.activeId,
            rankEndNums: data.data.rankEndNums
        });
        if(isRetError(findRank)){
            return PackReturn(-1,"获取数据失败");
        }
        //取出来 玩家数据
        var rewardConfig = findRank[0].rewardConfig;
        var list_rank = findRank[0].list;
        var isOpenReward = findRank[0].isOpenReward;
        var rewardList = [];
        //最大排名
        var maxRank = 10;
        var isBConfig = false;
        rewardConfig.forEach(element =>{
            if(element.hasOwnProperty("rankNums")){
                isBConfig = true;
                element.rankNums.forEach(num => {
                    if(num > maxRank){
                        maxRank = num;
                    }
                });
            }
        });
        //根据配置发奖
        for(var i = 0; i < list_rank.length; i++){
            if(i >= maxRank) break;
            var newObj = new Object();
            var i_model = list_rank[i];
            var rank = i + 1;
            if(i_model.hasOwnProperty("userOpenId")){
                newObj.userOpenId = i_model.userOpenId;
                newObj.nickName = i_model.nickName;
                newObj.headUrl = i_model.headUrl;
                newObj.userCoin = i_model.userCoin;
                newObj.point = i_model.point;
            }else{
                newObj.name = i_model.name;
                newObj.nameId = i_model.nameId;
                newObj.headId = i_model.headId;
                newObj.point = i_model.point;
            }
            if(isBConfig){
                rewardConfig.forEach(element =>{
                    if(element.hasOwnProperty("rankNums")){
                        if(rank >= element.rankNums[0] && rank <= element.rankNums[1]){
                            newObj.rewardType = element.type;
                            return;
                        }
                    }
                });
            }else{
                if(rank >= 1 && rank <= 3){
                    newObj.rewardType = 1;
                }else if(rank >= 4 && rank <= 10){
                    newObj.rewardType = 2;
                }else if(rank >= 11 && rank <= 50){
                    newObj.rewardType = 3;
                }else{
                    newObj.rewardType = -1;
                }
            }
            newObj.isGet = true;
            // if(isOpenReward){
            //     newObj.isGet = true;
            // }else{
            //     newObj.isGet = false;
            // }
            newObj.isGet = true;
            rewardList.push(newObj);
        }
        //更新排行榜记录数据
        await cloud.db.collection("rankRecord").updateMany({
            activeId: data.data.activeId,
            rankEndNums: data.data.rankEndNums,
        },{
            $set: {
                isOpenReward: true,
                rewardList: rewardList
            }
        });
    } catch (e) {
        return PackReturn(-4, "catch失败", e);
    }
}
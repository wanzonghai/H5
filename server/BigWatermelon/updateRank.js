
function isRetError(ret){
    if(!ret == null || ret == undefined || ret < 0) {
        return true;
    }
    return false;
}
module.exports = async (context) =>{
    console.log("updateRank");
    const cloud = context.cloud;
    var curTime = new Date().getTime();
    //遍历 所有得店铺(开启时间内)
    var findUserData = await cloud.db.collection("users").aggregate([
        {
            $match: {
                state: true
            }
        },
        {
            $project: {
                openid: 1,
                activeId: 1,
                activeType: 1,
                vipInfo: 1
            } 
        }
    ]);
    if(isRetError(findUserData) || findUserData.length <= 0){
        return -1;
    }
    var value1 = [1.75,1.416667,1.166667];
    var value2 = [2.5,1.491667,1.241667];

    //不同类型的 robot单独处理 type = 1积极型  type = 2王者型
    // var rateType = 2; //需要走B端配置
    for(var i = 0;i < findUserData.length; i++){
        var userData = findUserData[i];
        var vipInfo = userData.vipInfo;
        var activeId = userData.activeId;

        var findRankData = await cloud.db.collection("rank").find({
            activeId: activeId
        });
        if(isRetError(findRankData) || findRankData.length <= 0){
            continue;
        }
        var rateValue = 0;
        if(userData.hasOwnProperty("activeType")){
            if(vipInfo != "c"){
                if(userData.activeType == "daily"){
                    rateValue = value2[0];
                }else if(userData.activeType == "pullNew"){
                    rateValue = value2[1];
                }else if(userData.activeType == "trans"){
                    rateValue = value2[2];
                }  
            }else{
                if(userData.activeType == "daily"){
                    rateValue = value1[0];
                }else if(userData.activeType == "pullNew"){
                    rateValue = value1[1];
                }else if(userData.activeType == "trans"){
                    rateValue = value1[2];
                }  
            }
        }else{
            //默认日常促活配置
            if(vipInfo != "c"){
                rateValue = value2[0];
            }else{
                rateValue = value1[0];
            }
        }
        
        for(var k = 0; k < findRankData.length; k++){
            var k_data = findRankData[k];
            var ran = Math.random() * 100;
            var destValue = 0;
            var disTime = Math.round((curTime - k_data.updateTime) / 60000);
            if(disTime < 0) disTime = 0;
            if(k_data.type == 1){
                //积极型
                //判定是否更新
                if(ran < 20){
                    continue;
                }
                var ran2 = Math.random() * (15 - 5);
                destValue = rateValue * (0.05 + (ran2 / 100)) * disTime;
            }else{
                if(ran < 10){
                    continue;
                }
                var ran3 = Math.random() * (25 - 15);
                destValue = rateValue * (0.15 + (ran3 / 100)) * disTime;
            }
            // if(destValue >= 1 && destValue < 7) {
            //     destValue = 7;
            // }else if(destValue > 7 && destValue < 21){
            //     destValue = 21;
            // }else if(destValue > 21 && destValue < 36){
            //     destValue = 36;
            // }else{
            //     destValue = destValue | 0;
            // }
            if(destValue < 7) {
                destValue = 0;
            }else if(destValue > 7 && destValue < 21){
                destValue = 7;
            }else if(destValue > 21 && destValue < 36){
                destValue = 21;
            }else{
                destValue = destValue | 0;
            }
            if(destValue <= 0) continue;
            await cloud.db.collection("rank").updateMany({
                _id: k_data._id
                },{
                    $set: {
                        updateTime: curTime
                    },
                    $inc: {
                        point: destValue
                    }
                }
            );
        }
    }
    return true;
}
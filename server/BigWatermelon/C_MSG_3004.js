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
//获取排行榜前后顺序
module.exports = async (context) =>{
    console.log("==3004==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        //获取配置数据  索引条件： 开启状态
        var findGloabl = await cloud.db.collection("global").find({totalRank_swith: 1});
        if(isRetError(findGloabl)){
            return PackReturn(-1,"获取配置失败");
        }
        if(findGloabl.length <= 0){
            return PackReturn(-1,"排行榜未开启");
        }
        //获取配置参数
        var totalRank_count = findGloabl[0].totalRank_count;

        var list_rank = [];
        var allPlayerData = await cloud.db.collection("players").aggregate([
            {
                $match: {
                    activeId: data.data.activeId,
                    point: {$gt: 0} 
                }
            },{
                $sort: {
                    point: -1
                }
            },{
                $project: {
                    point: 1,
                    nickName: 1,
                    headUrl: 1,
                    userCoin: 1,
                    userOpenId: 1
                }
            }
        ]);
        if(isRetError(allPlayerData)){
            console.log("未找到玩家数据");
            // return PackReturn(-3,"获取数据失败");
        }else{
            
            if(allPlayerData.length > 0){
                for(var i = 0; i < allPlayerData.length; i++){
                    list_rank.push(allPlayerData[i]);
                }
            }
        }
        

        //获取机器人
        var findAIData = await cloud.db.collection("rank").find({
            //openid: openid,
            activeId: data.data.activeId,
            point: {$gt: 0} 
        },{
            sort: {
                point: -1
            }
        });

        if(isRetError(findAIData)){
            console.log("未获得机器人数据");
            // return PackReturn(-2,"获取机器人失败");
        }else{
            if(findAIData.length > 0){
                for(var i = 0; i < findAIData.length; i++){
                    list_rank.push(findAIData[i]);
                }
            }
        }

        var changePoint = data.data.newPoint - data.data.oldPoint;
        
        list_rank.sort((a,b)=>{
            return b.point - a.point;
        });

        var destRank = -1;
        var retData = new Object();

        
        //第一次 排名
        var curPoint = 0;
        for(var i = 1; i <= list_rank.length; i++){
            if(list_rank[i-1].hasOwnProperty("userOpenId")){
                if(list_rank[i-1].userOpenId == userOpenId){
                    destRank = i;
                    curPoint = list_rank[i-1].point;
                    break;
                }
            }
        }
        var cur_myRank = null;
        if(destRank == -1){
            console.log("分数是0 之前没有排名");
            // return PackReturn(-3,"排名失败1");
        }else{
            cur_myRank = new Object();
            let cur_keys = Object.keys(list_rank[destRank - 1]);
            for(var i = 0; i < cur_keys.length; i++){
                cur_myRank["" + cur_keys[i]] = list_rank[destRank - 1][cur_keys[i]];
            }
        }
        
        var cur_lastRank;
        var cur_nextRank;
        if(destRank == -1){
            lastRank = -1;
            nextRank = -1;
            cur_lastRank = null;
            cur_nextRank = null;
        }if(destRank == 1){
            lastRank = -1;
            nextRank = destRank + 1;
            cur_lastRank = null;
            cur_nextRank = list_rank[destRank] ? list_rank[destRank] : null;
        }else if(destRank == list_rank.length){
            lastRank = destRank - 1;
            nextRank = -1;
            cur_lastRank = list_rank[destRank - 1 - 1] ? list_rank[destRank - 1 - 1] : null;
            cur_nextRank = null;
        }else{
            lastRank = destRank - 1;
            nextRank = destRank + 1;
            cur_lastRank = list_rank[destRank - 1 - 1] ? list_rank[destRank - 1 - 1] : null;
            cur_nextRank = list_rank[destRank] ? list_rank[destRank] : null;
        }
        //新 排名结果
        retData.newList = {
            myRankInfo: cur_myRank,
            lastRankInfo: cur_lastRank,
            nextRankInfo: cur_nextRank,
            myRank: destRank,
            lastRank: lastRank,
            nextRank: nextRank
        }

        //老数据 覆盖(C端 提前上报了数据 只能这么改)
       
        if(destRank != -1){
            var oldPoint = curPoint - changePoint;
            if(oldPoint < 0) oldPoint = 0;
            if(list_rank[destRank-1].hasOwnProperty("userOpenId")){
                list_rank[destRank - 1].point = oldPoint;
            }
        }
        
        //修改分数后排名
        list_rank.sort((a,b)=>{
            return b.point - a.point;
        });
        //第二次 排名
        destRank = -1;
        for(var i = 1; i <= list_rank.length; i++){
            if(list_rank[i-1].hasOwnProperty("userOpenId")){
                if(list_rank[i-1].userOpenId == userOpenId){
                    destRank = i;
                    break;
                }
            }
        }
        if(destRank == -1){
            console.log("上次分数是0 没有排名");
            // return PackReturn(-3,"排名失败2");
        }
        
        var pre_myRank = list_rank[destRank - 1];
        var pre_lastRank;
        var pre_nextRank;
        var lastRank = -1;
        var nextRank = -1;
        if(destRank == -1){
            lastRank = -1;
            nextRank = -1;
            pre_lastRank = null;
            pre_nextRank = null;
        }else if(destRank == 1){
            lastRank = -1;
            nextRank = destRank + 1;
            pre_lastRank = null;
            pre_nextRank = list_rank[destRank] ? list_rank[destRank] : null;
        }else if(destRank == list_rank.length){
            lastRank = destRank - 1;
            nextRank = -1;
            pre_lastRank = list_rank[destRank - 1 - 1] ? list_rank[destRank - 1 - 1] : null;
            pre_nextRank = null;
        }else{
            lastRank = destRank - 1;
            nextRank = destRank + 1;
            pre_lastRank = list_rank[destRank - 1 - 1] ? list_rank[destRank - 1 - 1] : null;
            pre_nextRank = list_rank[destRank] ? list_rank[destRank] : null;
        }
        //上一次 排名结果
        retData.oldList = {
            myRankInfo: pre_myRank,
            lastRankInfo: pre_lastRank,
            nextRankInfo: pre_nextRank,
            myRank: destRank,
            lastRank: lastRank,
            nextRank: nextRank
        }
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
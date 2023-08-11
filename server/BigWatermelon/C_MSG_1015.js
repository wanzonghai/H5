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
//获取排行榜排名是否下降
module.exports = async (context) =>{
    console.log("==1015==");
    try {
        //当前排行
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var playerData = await cloud.db.collection("players").find({
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId,
        });
        if(isRetError(playerData) || playerData.length <= 0){
            return PackReturn(-2,"获取数据失败");
        }
        var parm = playerData[0];
        var curRank = parm.rank;
        console.log("curRank: ",curRank);
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

        var allPlayerData = await cloud.db.collection("players").find(
            {  
                //openid: openid,
                activeId: data.data.activeId,
                point: {$gt: 0} 
            }, 
            {  
                //预留字段 1：玩家昵称 2：头像 3：金币数
                projection: {point: 1,userOpenId: 1}, 
                sort: {point: -1},  
                limit: totalRank_count,  
            }
        )
        if(isRetError(allPlayerData)){
            return PackReturn(-3,"获取数据失败");
        }

        var list_rank = [];
        if(allPlayerData.length <= 0){
            console.log("未找到玩家数据");
        }
        for(var i = 0; i < allPlayerData.length; i++){
            list_rank.push(allPlayerData[i]);
        }
        console.log("玩家人数: ",list_rank.length);
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
            
        }else{
            if(findAIData.length <= 0){
                console.log("未找到机器人");
            }
            for(var i = 0; i < findAIData.length; i++){
                list_rank.push(findAIData[i]);
            }
        }
        console.log("总人数: ",list_rank.length);

        list_rank.sort((a,b)=>{
            return b -a;
        });
        // console.log("userOpenId: ",userOpenId);
        // console.log("list_rank.length: ",list_rank.length);
        // console.log("list_rank: ",list_rank);
        var destRank = -1;
        for(var i = 1; i <= list_rank.length; i++){
            if(list_rank[i-1].hasOwnProperty("userOpenId")){
                if(list_rank[i-1].userOpenId == userOpenId){
                    destRank = i;
                    console.log("i: ",i,list_rank[i-1]);
                    break;
                }
            }
        }
        // console.log("list_rank: ",list_rank);
        console.log("curRank: ",curRank);
        console.log("destRank: ",destRank);
        // console.log("list_rank: ",list_rank);
        if(destRank != -1 && destRank != curRank){
            //修改当前排名
            await cloud.db.collection("players").updateMany({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId,
            },{
                $set: {
                    rank: destRank
                }
            });
            if(destRank > 50 && curRank > 50){
                return PackReturn(code,message,{changeRank: 0});
            }else{
                if(curRank - destRank > 0){
                    return PackReturn(code,message,{changeRank: 1});
                }else if(curRank - destRank == 0){
                    return PackReturn(code,message,{changeRank: 0});
                }else{
                    return PackReturn(code,message,{changeRank: -1});
                }
            }
        }else{
            return PackReturn(code,message,{changeRank: 0});
        }
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
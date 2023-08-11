
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
//获取排行榜周榜数据
module.exports = async (context) =>{
    console.log("==1013==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        //获取配置数据  索引条件： 开启状态
        var findGloabl = await cloud.db.collection("global").find({weekRank_swith: 1});
        if(isRetError(findGloabl)){
            return PackReturn(-1,"获取配置失败");
        }
        if(findGloabl.length <= 0){
            return PackReturn(-1,"周榜未开启");
        }
        //获取配置参数
        var weekRank_count = findGloabl[0].weekRank_count;

        var findUserData = await cloud.db.collection("users").find({
            //openid: openid,
            activeId: data.data.activeId
        },{
            projection: {
                season: 1
            }
        });
        if(isRetError(findUserData) || findUserData.length <= 0){
            return PackReturn(-2,"获取数据失败");
        }

        var season = findUserData[0].season;

        const ret = await cloud.db.collection("players").find(
            {  
                //openid: openid,
                activeId: data.data.activeId,
                point: {$gt: 0},
                curSeason: season
            },
            {  
                //预留字段 1：玩家昵称 2：头像 3：金币数
                projection: {nickName: 1,headUrl: 1,point: 1,userOpenId: 1}, 
                sort: {point: -1},  
                limit: weekRank_count,  
            }
        )
        if(isRetError(ret)){
            return PackReturn(-2,"查找失败");
        }
        return PackReturn(code,message,ret);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
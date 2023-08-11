
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
//上报关注vip状态
module.exports = async (context) =>{
    console.log("==1011==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var findPlayerData = await cloud.db.collection("players").find({
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId
        });
        if(isRetError(findPlayerData) || findPlayerData.length <= 0){
            //未找到玩家数据
            return PackReturn(-2,"获取数据失败");
        }
        var parm = findPlayerData[0];
        //相同状态 不处理
        if((parm.isVip && data.data.vipState) || (!parm.isVip && !data.data.vipState)){
            return PackReturn(code,message,{vipState: data.data.vipState});
        }
        //更新关注状态
        await cloud.db.collection("players").updateMany({
            //openid: openid,
            userOpenId:userOpenId,
            activeId: data.data.activeId
        },{
            $set:{
                isVip: data.data.vipState,
            }
        });
        //更新join表 当前vip状态
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        var day = time.getDate();
        day = day < 10 ? "0" + day : day;
        var strTime = "" + year + "-" + month + "-" + day;
        await cloud.db.collection("join").updateMany({
            userOpenId: userOpenId,
            activeId: data.data.activeId,
            time: strTime
        },{
            $set: {
                isVipNow: data.data.vipState
            }
        });
        return PackReturn(code,message,{vipState: data.data.vipState});
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}

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
//上报淘宝会员信息
module.exports = async (context) =>{
    console.log("==1009==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        //1：会员  2：会员等级 memberLv 默认1 C端拿不到等级数据
        var retData = await cloud.db.collection("players").updateMany({
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId
        },{
            $set: {
                isMember: data.data.isMember,
                memberLv: 1
            }
        });
        if(isRetError(retData)){
            return PackReturn(-2,"更新数据失败");
        }
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
                isMemberNow: data.data.isMember
            }
        });
        return PackReturn(code,message);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
    
}
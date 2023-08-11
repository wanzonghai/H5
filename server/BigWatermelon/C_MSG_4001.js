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
//上报 购买数据
module.exports = async (context) =>{
    console.log("==4001==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;

        var price = data.data.price | 0;
        var time = new Date();
        var curTime = time.getTime();
        //统计玩家 购买数据
        await cloud.db.collection("players").updateMany({
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId
        },{
            $inc: {
                buyNum: 1,
                buyCost: price
            }
        });
        //更新join表 消费数据
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
            $inc: {
                consumeNums: price
            }
        });
        var ret = await cloud.db.collection("activityRecord").updateMany({
            //openid: openid,
            activeId: data.data.activeId,
            sTime: {$lte: curTime},
            eTime: {$gte: curTime}
        },{
            $inc: {
                consumeNums: 1,
                consumeTotal: price
            }
        });
        if(isRetError(ret)){
            return PackReturn(-2,"更新数据失败");
        }

        //统计玩家任务完成数
        await cloud.db.collection("players").updateMany({
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId
        },{
            $inc: {
                taskDoneCount: 1
            }
        });

        return PackReturn(code,message);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
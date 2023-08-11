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
//埋点数据综合 
module.exports = async (context) =>{
    console.log("==C_MSG_GET_BURY_5==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;

        var retData = new Object();
        var sTime = data.data.sTime;
        var eTime = data.data.eTime;


        //任务埋点数据  任务次数 任务人数
        //任务完成次数
        var list_task_id = [0,2,4,5,6,7,8,9,10,11,12,13,14];
        for(var i = 0; i < list_task_id.length; i++){
            var task_id = "" + list_task_id[i];
            var task_num = await cloud.db.collection("bury").count({
                //openid: openid,
                activeId: data.data.activeId,
                time: {
                    $gte: sTime,
                    $lte: eTime
                },
                action: "task",
                data: {
                    "task_id": task_id
                } 
            });
            retData["task_" + task_id] = task_num;
            // var strParse = JSON.parse("{task_id:" + );s
            var task_players = await cloud.db.collection("bury").aggregate([
                {
                  $match: {
                        time: { $gte:sTime , $lte:eTime },
                        activeId:data.data.activeId,
                        action:'task',
                        data: {
                            "task_id": task_id
                        } 
                   }
                },
                {
                  $group: {
                   _id: '$userOpenId',
                   count: { $sum: 1 }
                  }
                }
            ]);
            retData["task_" + task_id + "_players"] = task_players.length;
        }
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
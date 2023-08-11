var code = 0;
var message = "成功";
function bIsNull(a) {
    if(a !== null && a !== undefined) {
        return false;
    }
    return true;
}
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
//获取活动参与数据
module.exports = async (context) => {
    console.log("**3005**");
    try {
        const cloud = context.cloud;
        const data = context.data;
        const openid = context.appOwnerOpenId;
        if(data.data.activeId == "all"){
            var findData = await cloud.db.collection("activityRecord").find({ 
                //openid: openid,
                activeId: data.data.activeId
            });
            if(isRetError(findData) || findData.length <= 0){
                return PackReturn(-2,"获取活动数据失败");
            }
            var curDate = new Date();
            var curTime = curDate.getTime();
            var cur_year = curDate.getFullYear();
            var cur_month = curDate.getMonth() + 1  >= 10 ? "" + (curDate.getMonth() + 1) : "0" + (curDate.getMonth() + 1);
            var cur_day = curDate.getDate() >= 10 ? "" + curDate.getDate() : "0" + curDate.getDate(); 
            var cur_limit = "" + cur_year + "-" + cur_month + "-" + cur_day;
            var preTime = curTime - (24 * 3600 * 1000);
            var preData = new Date(preTime);
            var pre_year = preData.getFullYear();
            var pre_month = preData.getMonth() + 1 >= 10 ? "" + (preData.getMonth() + 1) : "0" + (preData.getMonth() + 1);
            var pre_day = preData.getDate() >= 10 ? "" + preData.getDate() : "0" + preData.getDate(); 
            var pre_limit = "" + pre_year + "-" + pre_month + "-" + pre_day;
            var retList = [];
            for(var k = 0; k < findData.length; k++){
                var parm = findData[k];
                var retData = new Object();
                retData.activeId = parm.activeId;
                retData.activeName = parm.activeName;
                retData.consumeNums = parm.consumeNums; //消费人数
                retData.consumeTotal = parm.consumeTotal; //消费总金额
                retData.attentionNums = parm.attentionNums; //关注人数
                //昨日人数
                var pre_join = await cloud.db.collection("join").count({ 
                    //openid: openid,
                    activeId: parm.activeId,
                    time: pre_limit
                });
                //今日人数
                var cur_join = await cloud.db.collection("join").count({ 
                    //openid: openid,
                    activeId: parm.activeId,
                    time: cur_limit
                });
                retData.ytdJoinNums = pre_join;
                retData.joinNums = cur_join;
                retList.push(retData);
            }
            return PackReturn(code,message,retList);
        }else{
            var findData = await cloud.db.collection("activityRecord").find({ 
                //openid: openid,
                activeId: data.data.activeId
            });
            if(isRetError(findData)){
                return PackReturn(-2,"获取活动数据失败");
            }
            var parm = findData[0];
            var retData = new Object();
            retData.activeId = parm.activeId;
            retData.activeName = parm.activeName;
            retData.consumeNums = parm.consumeNums; //消费人数
            retData.consumeTotal = parm.consumeTotal; //消费总金额
            retData.attentionNums = parm.attentionNums; //关注人数
            return PackReturn(code,message,retData);
        }
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}   
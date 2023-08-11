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
//筛选 进入游戏次数的 人数分布
module.exports = async (context) =>{
    console.log("==C_MSG_GET_ENTERGAME==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var sTime = data.data.sTime;
        var eTime = data.data.eTime;
        var curAction = "";
        //兼容C端 未带参数问题
        if(data.data.hasOwnProperty("action")){
            curAction = data.data.action;
        }else{
            curAction = "enterGame";
        }

        var findBuryData = await cloud.db.collection("bury").aggregate([{
            $match: {
                time: {
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: data.data.activeId,
                action: curAction
            }
        }, {
            $group: {
                _id: '$userOpenId',
                count: {
                    $sum: 1
                }
            }
        }]);
        if(isRetError(findBuryData)){
            return PackReturn(-2,"获取数据失败");
        }

        var retData = new Object();
        if(findBuryData.length > 0){
            findBuryData.sort((a,b)=>{
                return b.count - a.count
            });
            var maxNum = findBuryData[0].count;
            for(var i = 0; i < findBuryData.length; i++){
                for(var k = 0; k <= maxNum; k++){
                    if(findBuryData[i].count >= k){
                        if(retData.hasOwnProperty("times_" + k)){
                            retData["times_" + k] += 1;
                        }else{
                            retData["times_" + k] = 1;
                        }   
                    }
                }
            }
        }
        //统计 活跃人数
        var findActive = await cloud.db.collection("join").aggregate([{
            $match: {
                stampTime: {
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: data.data.activeId,
            }
        }, {
            $group: {
                _id: '$userOpenId',
                count: {
                    $sum: 1
                }
            }
        }]);
        retData.activeNums = findActive.length;

        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
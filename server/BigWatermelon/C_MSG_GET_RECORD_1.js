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
//获取面板数据
module.exports = async (context) =>{
    console.log("==C_MSG_GET_RECORD_1==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;

        //获取活动数据
        let sTime = Number(data.data.sTime);
        let eTime = Number(data.data.eTime);
        console.log("sTime: ",sTime);
        console.log("eTime: ",eTime);
        var retData = new Object();

        var findData = await cloud.db.collection("activityRecord").find({
            //openid: openid,
            activeId: data.data.activeId,
            sTime: {$gte: sTime},
            eTime: {$lte: eTime},
        });
        if(isRetError(findData)){
            return PackReturn(-2,"获取数据失败");
        }
        if(findData.length <= 0){
            return PackReturn(-2,"获取活动数据失败");
        }
        console.log("findData: ",findData.length);
        var s_sTime = new Date(sTime).toLocaleString();
        var s_eTime = new Date(eTime).toLocaleString();
        console.log("s_sTime: ",s_sTime);
        console.log("s_eTime: ",s_eTime);
        retData.sTime = s_sTime;
        retData.eTime = s_eTime;
        retData.attentionNums = 0;            //总关注人数
        retData.consumeNums = 0;              //消费人数
        retData.consumeTotal = 0;             //消费总额
        retData.fans = 0;                     //新增粉丝
        retData.activeNums = 0;               //活跃人数

        for(var i = 0; i < findData.length; i++){
            var model = findData[i];
            retData.attentionNums += model.attentionNums;
            retData.consumeNums += model.consumeNums;
            retData.consumeTotal += model.consumeTotal;
            retData.fans += model.fans;
        }
        //统计 活跃人数
        var activeData = await cloud.db.collection("join").aggregate([{
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
        retData.activeNums = activeData.length;
        //新关注人数	attentionNums（汇总）------------------------
        var attentionNums = await cloud.db.collection("activityRecord").aggregate([
            {
            
            $match: {
                    sTime:{$gte: sTime},
                    eTime: {$lte: eTime},
                    activeId:data.data.activeId,
            }
            },
            {
                $group: {
                    _id: 'null',
                    attentionNums: { $sum: '$attentionNums' }
                }
            }
        ]);
        if(attentionNums.length > 0){
            retData.attentionNums = attentionNums[0].attentionNums;
        }
        if(sTime > 1615978800000){
            //消费人数	consumeNums（汇总）----------------------------
            var consumeNums = await cloud.db.collection("join").aggregate([
                {
                    $match:{
                        stampTime:{$gte:sTime,$lte:eTime},
                        activeId:data.data.activeId,
                        consumeNums:{$gt:0}
                    }
                },
                {
                    $group:{
                        _id:"$userOpenId",
                        count:{$sum:1}
                    }
                }
            ]);
            console.log("consumeNums: ",consumeNums);
            if(consumeNums.length > 0){
                retData.consumeNums = consumeNums.length;
            }
            // 消费总额	consumeTotal（汇总）----------------------------
            var consumeTotal = await cloud.db.collection("join").aggregate([
                {
                    "$match":{
                        "stampTime":{"$gte":sTime,"$lte":eTime},
                        "activeId":data.data.activeId,
                        "consumeNums":{"$gt":0}
                    }
                },
                {
                    "$group":{
                        "_id":"null",
                        "consumeNums":{"$sum":"$consumeNums"}
                    }
                }
            ]);
            console.log("consumeTotal: ",consumeTotal);
            if(consumeTotal.length > 0){
                retData.consumeTotal = consumeTotal[0].consumeNums;
            }
        }
        
        //新增粉丝
        var fansData = await cloud.db.collection("join").aggregate([
            {
              $match: {
                    stampTime: { $gte:sTime , $lte:eTime},
                    activeId:data.data.activeId,
                    isVip:true
               }
            },
            {
              $group: {
               _id: '$userOpenId',
               count: { $sum: 1 }
              }
            }
        ]);
        retData.fans = fansData.length;
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
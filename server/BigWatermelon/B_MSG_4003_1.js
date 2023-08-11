const moment = require('moment')
var code = 0;
var message = "成功";
function bIsNull(a) {
   if (a !== null && a !== undefined) {
      return false;
   }
   return true;
}
function isRetError(ret) {
   if (!ret == null || ret == undefined || ret < 0) {
      return true;
   }
   return false;
}

function PackReturn(code, message, data) {
   if (data == undefined) {
      return JSON.stringify({ code: code, message: message });
   } else {
      return JSON.stringify({ code: code, message: message, data: data });
   }
}
//获取数据概括统计
module.exports = async (context) => {
   console.log("**4003_1**");
   try {
      const cloud = context.cloud;
      const data = context.data;
      const openid = context.appOwnerOpenId;


      //  时间段 
      let sTime = Number(data.data.sTime);
      let eTime = Number(data.data.eTime);

      if (sTime === eTime) {
         eTime = moment(sTime).endOf('day').valueOf()
      }

      var retData = new Object();

      var findData = await cloud.db.collection("activityRecord").find({
         //openid: openid,
         activeId: data.data.activeId,
         sTime: { $gte: sTime },
         eTime: { $lte: eTime },
      });
      if (isRetError(findData)) {
         return PackReturn(-2, "获取数据失败");
      }
      retData.attentionNums = 0;            //总关注人数
      retData.consumeNums = 0;              //消费人数
      retData.consumeTotal = 0;             //消费总额

      for (var i = 0; i < findData.length; i++) {
         var model = findData[i];
         retData.attentionNums += model.attentionNums;
         retData.consumeNums += model.consumeNums;
         retData.consumeTotal += model.consumeTotal;
      }
      //活跃人数	activeNums
      var activeNums = await cloud.db.collection("join").aggregate([
         {
            $match: {
               stampTime: { $gte: sTime, $lte: eTime },
               activeId: data.data.activeId
            }
         },
         {
            $group: {
               _id: '$userOpenId',
               count: { $sum: 1 }
            }
         }]);
      retData.activeNums = activeNums.length;
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
     //最后一次 3-18 更新bug时间
     if(sTime > 1615978800000){
         //消费次数 consumeNums
         var consumeNums = await cloud.db.collection("join").aggregate([
            {
               "$match":{
                  "stampTime":{"$gte":sTime,"$lte":eTime},
                  "activeId":data.data.activeId,
                  "consumeNums":{"$gt":0}
               }
         },
         {
               "$group":{
                  "_id":"$userOpenId",
                  "count":{"$sum":1}
               }
         }
         ]);
         if(consumeNums.length > 0){
            retData.consumeNums = consumeNums.length;
         }
         
         //消费总数 consumeTotal
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
         if(consumeTotal.length > 0){
            retData.consumeTotal = consumeTotal[0].consumeNums;
         }
      }
      // 新增粉丝
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
      return PackReturn(code, message, retData);
   } catch (e) {
      return PackReturn(-4, "catch失败", e);
   }
}
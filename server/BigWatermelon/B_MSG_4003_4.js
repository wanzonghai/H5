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
   console.log("**4003_4**");
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
      retData.rankOpenNums = 0;             //排行榜打开次数
      retData.rankPlayerNums = 0;           //排行榜领奖人数
      retData.rankRewardNums = 0;           //排行榜领奖次数
      retData.shareRegisterNums = 0;        //分享新增
      retData.shareEnterNums = 0;           //分享活跃

      for (var i = 0; i < findData.length; i++) {
         var model = findData[i];
         retData.rankOpenNums += model.rankOpenNums;
         retData.rankPlayerNums += model.rankPlayerNums;
         retData.rankRewardNums += model.rankRewardNums;
         retData.shareRegisterNums += model.shareRegisterNums;
         retData.shareEnterNums += model.shareEnterNums;
      }
      //分享数据修改时间后 使用最新的查询方法 
      if(sTime > 1616515199000){
         //shareEnterNums
         var shareEnterNums = await cloud.db.collection("join").aggregate([
             {
             
             $match: {
                 stampTime:{$gte: sTime,$lte: eTime},
                 activeId:data.data.activeId,
                 isFromShare: true
             }
             },
             {
             $group: {
                 _id: '$userOpenId',
                 count: {
                     $sum: 1
                 }
             }
         }]);
         retData.shareEnterNums = shareEnterNums.length;
         // 分享新增人数	shareRegisterNums（汇总）----------------------
         var shareRegisterNums = await cloud.db.collection("join").aggregate([
             {
                 $match: {
                         createTime:{$gte: sTime,$lte: eTime},
                         activeId:data.data.activeId,
                         isFromShare: true
                 }
             },
             {
                 $group: {
                     _id: '$userOpenId',
                     count: {
                         $sum: 1
                     }
                 }
             }
         ]);
         retData.shareRegisterNums = shareRegisterNums.length;
     }else{
         //shareEnterNums
         var shareEnterNums = await cloud.db.collection("activityRecord").aggregate([
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
             shareEnterNums: { $sum: '$shareEnterNums' }
             }
         }]);
         if(shareEnterNums.length > 0){
            retData.shareEnterNums = shareEnterNums[0].shareEnterNums;
         }
         // 分享新增人数	shareRegisterNums（汇总）----------------------
         var shareRegisterNums = await cloud.db.collection("activityRecord").aggregate([
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
                     shareRegisterNums: { $sum: '$shareRegisterNums' }
                 }
             }
         ]);
         if(shareRegisterNums.length > 0){
            retData.shareRegisterNums = shareRegisterNums[0].shareRegisterNums;
         }
     }
      //排行榜打开次数（汇总）rankOpenNums-----------------------------
      var rankOpenNums = await cloud.db.collection("activityRecord").aggregate([
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
                 rankOpenNums: { $sum: '$rankOpenNums' }
             }
         }
     ]);
     if(rankOpenNums.length > 0){
         retData.rankOpenNums = rankOpenNums[0].rankOpenNums;
     }
     //排行榜领奖次数
     var rankRewardNums = await cloud.db.collection("join").count({
         stampTime: {
            $gte: sTime,
            $lte: eTime
         },
         activeId: data.data.activeId,
         rankRewardNums: {
            $gt: 0
         }
     });
     retData.rankRewardNums = rankRewardNums;
     //排行榜领奖人数 rankPlayerNums
     var rankData = await cloud.db.collection("join").aggregate([{
            $match: {
               stampTime: {
                  $gte: sTime,
                  $lte: eTime
               },
               activeId: data.data.activeId,
               rankRewardNums: {
                  $gt: 0
               }
            }
      }, {
            $group: {
               _id: '$userOpenId',
               count: {
                  $sum: 1
               }
            }
      }]);
      if(rankData.length > 0){
         retData.rankPlayerNums = rankData.length;
      }
      // 参与游戏人数	enterGamePlayers
      var enterGamePlayers = await cloud.db.collection("bury").aggregate([
         {
            $match: {
               time: { $gte: sTime, $lte: eTime },
               activeId: data.data.activeId,
               action: 'enterGame'
            }
         },
         {
            $group: {
               _id: '$userOpenId',
               count: { $sum: 1 }
            }
         }
      ]);
      retData.enterGamePlayers = enterGamePlayers.length;

      return PackReturn(code, message, retData);
   } catch (e) {
      return PackReturn(-4, "catch失败", e);
   }
}
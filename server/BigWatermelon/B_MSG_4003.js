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
   console.log("**4003**");
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
      retData.register = 0;                 //新人人数
      retData.fans = 0;                     //新增粉丝
      retData.vipNums = 0;                  //新增vip数量
      retData.joinNums = 0;                 //进入游戏次数
      retData.joinTime = 0;                 //活跃时长
      retData.redBagNums = 0;               //领奖数量
      retData.grabPlayerNums = 0;           //抢红包人数
      retData.rankOpenNums = 0;             //排行榜打开次数
      retData.rankPlayerNums = 0;           //排行榜领奖人数
      retData.rankRewardNums = 0;           //排行榜领奖次数
      retData.taskDoneNums = 0;             //任务完成数
      retData.taskDonePlayers = 0;          //任务完成人数
      retData.shareNums = 0;                //分享数量
      retData.sharePlayers = 0;             //分享人数
      retData.activeNums = 0;               //活跃人数
      retData.shareRegisterNums = 0;        //分享新增
      retData.shareEnterNums = 0;           //分享活跃

      for (var i = 0; i < findData.length; i++) {
         var model = findData[i];
         retData.attentionNums += model.attentionNums;
         retData.consumeNums += model.consumeNums;
         retData.consumeTotal += model.consumeTotal;
         // retData.register += model.register;
         // retData.fans += model.fans;
         // retData.vipNums += model.vipNums;
         retData.joinNums += model.joinNums;
         retData.joinTime += model.joinTime;
         retData.redBagNums += model.redBagNums;
         retData.grabPlayerNums += model.grabPlayerNums;
         retData.rankOpenNums += model.rankOpenNums;
         retData.rankPlayerNums += model.rankPlayerNums;
         retData.rankRewardNums += model.rankRewardNums;
         retData.taskDoneNums += model.taskDoneNums;
         retData.taskDonePlayers += model.taskDonePlayers;
         retData.shareNums += model.shareNums;
         retData.sharePlayers += model.sharePlayers;
         retData.shareRegisterNums += model.shareRegisterNums;
         retData.shareEnterNums += model.shareEnterNums;
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
      //新增会员
      var memberData = await cloud.db.collection("join").aggregate([
            {
               $match: {
                  stampTime: { $gte:sTime , $lte:eTime},
                  activeId:data.data.activeId,
                  isMember:true
               }
            },
            {
               $group: {
                  _id: '$userOpenId',
                  count: { $sum: 1 }
               }
            }
      ]);
      retData.vipNums = memberData.length;
      // 新增用户	register
      var registerData =  await cloud.db.collection("join").aggregate([
         {
           $match: {
                 createTime: { $gte:sTime , $lte:eTime },
                 activeId:data.data.activeId
            }
         },
         {
           $group: {
            _id: '$userOpenId',
            count: { $sum: 1 }
           }
     }]);
     retData.register = registerData.length;
      // 进入次数	joinNums（汇总）--------------------------------
      var joinNums = await cloud.db.collection("activityRecord").aggregate([
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
                 joinNums: { $sum: '$joinNums' }
             }
         }
      ]);
     if(joinNums.length > 0){
         retData.joinNums = joinNums[0].joinNums;
     }
     var joinTime = await cloud.db.collection("activityRecord").aggregate([
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
               joinTime: { $sum: '$joinTime' }
            }
         }
      ]);
      if(joinTime.length > 0){
         retData.joinTime = joinTime[0].joinTime;
      }
      //开了多少礼包	redBagNums（汇总）------------------------------
      var redBagNums = await cloud.db.collection("activityRecord").aggregate([
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
                 redBagNums: { $sum: '$redBagNums' }
             }
         }
     ]);
     if(redBagNums.length > 0){
         retData.redBagNums = redBagNums[0].redBagNums;
     }
     //领取红包人数 并去重
     var redBagData = await cloud.db.collection("join").aggregate([{
            $match: {
               stampTime: {
                  $gte: sTime,
                  $lte: eTime
               },
               activeId: data.data.activeId,
               redBagNums: {
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
      if(redBagData.length > 0){
         retData.grabPlayerNums = redBagData.length;
      }
      //任务完成总数
      var taskDoneData = await cloud.db.collection("activityRecord").aggregate([
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
             taskDoneNums: { $sum: '$taskDoneNums' }
           }
         }
     ]);
     if(taskDoneData.length > 0){
         retData.taskDoneNums = taskDoneData[0].taskDoneNums;
     }
     //任务完成人数 并去重
     var taskData = await cloud.db.collection("join").aggregate([{
            $match: {
               stampTime: {
                  $gte: sTime,
                  $lte: eTime
               },
               activeId: data.data.activeId,
               taskDoneNums: {
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
      if(taskData.length > 0){
         retData.taskDonePlayers = taskData.length;
      }
      //分享次数 shareNums
      var shareNums = await cloud.db.collection("bury").count({
         activeId: data.data.activeId,
         time: {
             $gte: sTime,
             $lte: eTime
         },
         action: 'share'
     });
     retData.shareNums = shareNums;
     //分享人数 并去重
     var shareData = await cloud.db.collection("join").aggregate([{
            $match: {
               stampTime: {
                  $gte: sTime,
                  $lte: eTime
               },
               activeId: data.data.activeId,
               shareNums: {
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
      if(shareData.length > 0){
         retData.sharePlayers = shareData.length;
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
         retData.shareEnterNums = shareEnterNums[0].shareEnterNums;
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
         retData.shareRegisterNums = shareRegisterNums[0].shareRegisterNums;
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
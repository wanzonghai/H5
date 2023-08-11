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
   console.log("**4003_3**");
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
      retData.grabPlayerNums = 0;           //抢红包人数
      retData.taskDoneNums = 0;             //任务完成数
      retData.taskDonePlayers = 0;          //任务完成人数
      retData.shareNums = 0;                //分享数量
      retData.sharePlayers = 0;             //分享人数


      for (var i = 0; i < findData.length; i++) {
         var model = findData[i];
         retData.grabPlayerNums += model.grabPlayerNums;
         retData.taskDoneNums += model.taskDoneNums;
         retData.taskDonePlayers += model.taskDonePlayers;
         retData.shareNums += model.shareNums;
         retData.sharePlayers += model.sharePlayers;
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
   //    var taskDoneData = await cloud.db.collection("activityRecord").aggregate([
   //       {
         
   //         $match: {
   //               sTime:{$gte: sTime},
   //               eTime: {$lte: eTime},
   //               activeId:data.data.activeId,
   //          }
   //       },
   //       {
   //         $group: {
   //           _id: 'null',
   //           taskDoneNums: { $sum: '$taskDoneNums' }
   //         }
   //       }
   //   ]);
      var taskDoneData = await cloud.db.collection("join").aggregate([
         {
            $match: {
                  stampTime:{$gte: sTime,$lte: eTime},
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
         $or: [
            {
               action: 'share'
            },
            {
               action: 'shareSuccess'
            },
         ]
         
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
      return PackReturn(code, message, retData);
   } catch (e) {
      return PackReturn(-4, "catch失败", e);
   }
}
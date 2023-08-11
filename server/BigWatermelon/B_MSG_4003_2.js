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
   console.log("**4003_2**");
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
      retData.register = 0;                 //新人人数
      // retData.fans = 0;                     //新增粉丝
      retData.vipNums = 0;                  //新增vip数量
      retData.joinNums = 0;                 //进入游戏次数
      retData.joinTime = 0;                 //活跃时长
      retData.redBagNums = 0;               //领奖数量

      for (var i = 0; i < findData.length; i++) {
         var model = findData[i];
         retData.register += model.register;
         retData.vipNums += model.vipNums;
         retData.joinNums += model.joinNums;
         retData.joinTime += model.joinTime;
         retData.redBagNums += model.redBagNums;
      }
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
      if(memberData.length > 0){
         retData.vipNums = memberData.length;
      }
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
   //   var joinTime = await cloud.db.collection("activityRecord").aggregate([
   //       {
         
   //       $match: {
   //             sTime:{$gte: sTime},
   //             eTime: {$lte: eTime},
   //             activeId:data.data.activeId,
   //       }
   //       },
   //       {
   //          $group: {
   //             _id: 'null',
   //             joinTime: { $sum: '$joinTime' }
   //          }
   //       }
   //    ]);
      var joinTime = await cloud.db.collection("bury").aggregate([
         {
            $match: {
               time:{$gte: sTime,$lte: eTime},
               action: "activeTime",
               activeId: data.data.activeId,
            }
         },
         {
            $group: {
               _id: 'null',
               joinTime: { $sum: '$playTime' }
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
      return PackReturn(code, message, retData);
   } catch (e) {
      return PackReturn(-4, "catch失败", e);
   }
}
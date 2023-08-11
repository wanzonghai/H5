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
//获取分享数据统计
module.exports = async (context) => {
   console.log("**4005**");
   try {
      //时间段
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
      retData.joinNums = 0;                 //进入游戏次数
      retData.register = 0;                 //总注册数
      retData.shareNums = 0;                //分享数量
      retData.sharePlayers = 0;             //分享人数
      retData.shareEnterNums = 0;           //分享进入
      retData.shareRegisterNums = 0;        //分享新增
      retData.activeNums = 0;               //活跃人数
      retData.enterGamePlayers = 0;        //游戏参与人数

      for (var i = 0; i < findData.length; i++) {
         var model = findData[i];
         retData.joinNums += model.joinNums;
         retData.register += model.register;
         retData.shareNums += model.shareNums;
         retData.sharePlayers += model.sharePlayers;
         retData.shareEnterNums += model.shareEnterNums;
         retData.shareRegisterNums += model.shareRegisterNums;
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
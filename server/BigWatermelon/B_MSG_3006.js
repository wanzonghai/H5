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
      return JSON.stringify({
         code: code,
         message: message
      });
   } else {
      return JSON.stringify({
         code: code,
         message: message,
         data: data
      });
   }
}
//获取获奖用户列表
module.exports = async (context) => {
   console.log("**3006**");
   try {
      const cloud = context.cloud;
      const data = context.data;
      // const openid = context.appOwnerOpenId;
      const openid = context.openId;

      if (data.data.type == 'total') {

         let _sql = {
            openid: openid,
            isWinner: true,
            // activeId: data.data.activeId,
            "rewardInfo.state": 1
         }
         if (data.data.isShip !== undefined) {
            _sql['isShip'] = data.data.isShip;
         }

         let total = await cloud.db.collection("winner").count(_sql)

         if (isRetError(total)) {
            return PackReturn(-2, "查找失败");
         }
         return PackReturn(code, message, total);
      } else if (data.data.type == 'search') {
         let _sql = {
            openid: openid,
            isWinner: true,
            // activeId: data.data.activeId,
            "rewardInfo.state": 1
         };

         if (data.data.orderId !== undefined) {
            _sql['orderId'] = data.data.orderId
         }

         if (data.data.isShip !== undefined) {
            _sql['isShip'] = data.data.isShip
         }
         let result = await cloud.db.collection("winner").find(_sql, {
            sort: {
               rewardTime: -1
            },
            limit: data.data.limit,
            skip: data.data.skip
         })

         if (isRetError(result)) {
            return PackReturn(-2, "查找失败");
         }
         return PackReturn(code, message, result);
      } else if (data.data.type === 'download') {
         let result = await cloud.db.collection("winner").aggregate([
            {
               $match: {
                  openid: openid,
                  isWinner: true,
                  // activeId: data.data.activeId,
                  "rewardInfo.state": 1,
                  isShip: 0,
               }
            }
         ])
         if (isRetError(result)) {
            return PackReturn(-2, "查找失败");
         }
         return PackReturn(code, message, result);
      } else if (data.data.type === 'update') {
         let upt = await cloud.db.collection("winner").updateMany({
            openid: openid,
            isWinner: true,
            "rewardInfo.state": 1,
            isShip: 0,
         }, {
            $set: {
               isShip: 1,
            }
         });

         return PackReturn(code, message, upt);
      } else {
         console.log('openid', openid)
         var ret = await cloud.db.collection("winner").find({
            openid: openid,
            isWinner: true,
            // activeId: data.data.activeId,
            "rewardInfo.state": 1
         }, {
            //预留字段  收货人  电话 地址  发货状态  奖励信息
            projection: {
               activeId: 1,
               userOpenId: 1,
               consignee: 1,
               phone: 1,
               address: 1,
               isShip: 1,
               rewardInfo: 1,
               orderId: 1,
               company: 1,
               logisticsId: 1,
               shipTime: 1,
               rewardTime: 1,
               tbName: 1,
               "city": 1,
               "province": 1,
               "county": 1,
               "street": 1
            },
            sort: {
               rewardTime: -1
            },
            limit: data.data.limit,
            skip: data.data.skip
         })
         console.log('ret------', ret)
         console.log('limit------', data.data.limit)
         console.log('skip------', data.data.skip)
         if (isRetError(ret)) {
            return PackReturn(-2, "查找失败");
         }
         return PackReturn(code, message, ret);
      }


   } catch (e) {
      return PackReturn(-4, "catch失败", e);
   }
}
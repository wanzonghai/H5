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
//获取商家实例化版本
module.exports = async (context) => {
   console.log("**4009**");
   try {
      const cloud = context.cloud;
      const openid = context.openId;
      const online_url = context.data.data.online_url;
      const app_id = context.data.data.app_id;
      var findGlobalData = await cloud.db.collection("global").find({
         type: 'c-game'
      });
      if (isRetError(findGlobalData)) {
         return PackReturn(-2, "获取数据失败1");
      }
      if (findGlobalData.length > 0) {
         var globalParm = findGlobalData[0];

         var findTemplete = await cloud.db.collection("templete").find({
            openid: openid
         });
         if (isRetError(findTemplete)) {
            return PackReturn(-2, "获取数据失败2");
         }
         if (findTemplete.length <= 0) {
            // 初始化
            let newTemplete = {
               openid: openid,
               last_version: globalParm.config.c_prod,
               online_url: online_url,
               app_id: app_id
            }
            await cloud.db.collection("templete").insertOne(newTemplete);
         } else {
            var retData = await cloud.db.collection("templete").updateMany({
               openid: openid
            }, {
               $set: {
                  last_version: globalParm.config.c_prod,
                  online_url: online_url,
                  app_id: app_id
               }
            });
            if (isRetError(retData)) {
               return PackReturn(-2, "更新失败");
            }
         }
      }
      return PackReturn(code, message);
   } catch (e) {
      return PackReturn(-4, "catch失败", e);
   }
}
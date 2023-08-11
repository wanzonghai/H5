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
//获取商家购买后是否实例化
module.exports = async (context) => {
   console.log("**4014**");
   try {
      const cloud = context.cloud;
      const openid = context.appOwnerOpenId;
      const nickName = context.data.data.nickName;

      var findData = await cloud.db.collection("templete").find({
         nickName: nickName
      });
      if (isRetError(findData)) {
         return PackReturn(-2, "获取数据失败1");
      }
      var findGlobalData = await cloud.db.collection("global").find({
         type: 'c-game'
      });
      if (isRetError(findGlobalData)) {
         return PackReturn(-2, "获取数据失败2");
      }
      let retData = {
         prod_version: findGlobalData.length > 0 ? findGlobalData[0].config.c_prod : '',
         last_version: findData.length > 0 ? findData[0].last_version : '',
         app_id: findData.length > 0 ? findData[0].app_id : '',
      }

      return PackReturn(code, message, retData);
   } catch (e) {
      return PackReturn(-4, "catch失败", e);
   }
}
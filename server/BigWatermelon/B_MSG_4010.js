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
//获取C端入口配置
module.exports = async (context) => {
   console.log("**4010**");
   try {
      const cloud = context.cloud;
      const openid = context.openId;
      var retData = await cloud.db.collection("templete").find({
         openid: openid
      });
      if (isRetError(retData)) {
         return PackReturn(-2, "获取数据失败2");
      }

      retData = retData.length > 0 ? retData[0] : undefined;

      return PackReturn(code, message, retData);
   } catch (e) {
      return PackReturn(-4, "catch失败", e);
   }
}
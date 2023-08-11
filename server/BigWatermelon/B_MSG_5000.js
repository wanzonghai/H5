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
// 调试日志
module.exports = async (context) => {
   console.log("**5000**");
   try {
      const cloud = context.cloud;
      const data = context.data;
      const openid = context.openId;
      var record = new Object();
      record.name = "log";
      record.openid = openid;
      record.time = new Date().getTime();
      record.action = data.data.action;
      record.log = data.data.log;
      var retData = await cloud.db.collection("log").insertOne(record);
      if(isRetError(retData)){
         return PackReturn(-2,"添加log失败");
      }
      return PackReturn(code, message);
   } catch (e) {
      return PackReturn(-4, "catch失败", e);
   }
}
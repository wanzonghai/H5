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
// 检测活动名称是否存在
module.exports = async (context) => {
   console.log("**4011**");
   try {
      const cloud = context.cloud;
      console.log('context.data.data.activeName', context.data.data.activeName)
      //获取全部活动
      var findData = await cloud.db.collection("users").find({
         activeName: context.data.data.activeName
      });
      // console.log('findData', findData)
      let obj = {
         state: findData.length > 0 ? true : false
      }

      return PackReturn(code, message, obj);
   } catch (e) {
      return PackReturn(-4, "catch失败", e);
   }
}
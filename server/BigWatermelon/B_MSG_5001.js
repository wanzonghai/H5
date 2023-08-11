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
// B端通用埋点
module.exports = async (context) => {
   console.log("**5001**");
   try {
      const cloud = context.cloud;
      const data = context.data;
      const openid = context.openId;
      var newBury = new Object();
      newBury.userOpenId = openid;
      newBury.action = data.data.action;
      newBury.time = new Date().getTime();
      //创建活动过程  不带活动id
      if(data.data.hasOwnProperty("activeId")){
         var findUserData = await cloud.db.collection("users").find({
            activeId: data.data.activeId
         },{
            projection: {
               createTime: 1,
               shopName: 1
            }
         });
         if(isRetError(findUserData) || findUserData.length <= 0){
            return PackReturn(-1,"获取活动数据失败");
         }
         newBury.activeId = data.data.activeId;
         newBury.createTime = findUserData[0].createTime;
         newBury.nickName = findUserData[0].shopName;
      }
      if(data.data.hasOwnProperty("test")){
         newBury.test = true;
      }
      //版本号b
      if(data.data.hasOwnProperty("bVersion")){
         newBury.bVersion = data.data.bVersion;
      }
      // 打开形式
      if(data.data.hasOwnProperty("openType")){
         newBury.openType = data.data.openType;
      }
      // 是否修改基本信息
      if(data.data.hasOwnProperty("isUpdateActivityName")){
         newBury.isUpdateActivityName = data.data.isUpdateActivityName;
      }
      // 活动界面风格
      if(data.data.hasOwnProperty("styleActivity")){
         newBury.styleActivity = data.data.styleActivity;
      }
      // 活动游戏场景
      if(data.data.hasOwnProperty("sceneActivity")){
         newBury.sceneActivity = data.data.sceneActivity;
      }
      // 是否修改分享图
      if(data.data.hasOwnProperty("isUpdateSharePicture")){
         newBury.isUpdateSharePicture = data.data.isUpdateSharePicture;
      }
      // 结果
      if(data.data.hasOwnProperty("result")){
         newBury.result = data.data.result;
      }
      // 类型
      if(data.data.hasOwnProperty("type")){
         newBury.type = data.data.type;
      }
      // 配置商品数量
      if(data.data.hasOwnProperty("configGoodsNums")){
         newBury.configGoodsNums = data.data.configGoodsNums;
      }
      //礼包奖励是否配置完成
      if(data.data.hasOwnProperty("isConfigGift")){
         newBury.isConfigGift = data.data.isConfigGift;
      }
      // 排行榜奖励是否配置完成
      if(data.data.hasOwnProperty("isConfigRank")){
         newBury.isConfigRank = data.data.isConfigRank;
      }
      // 活动url
      if(data.data.hasOwnProperty("urlActivity")){
         newBury.urlActivity = data.data.urlActivity;
      }
      await cloud.db.collection("bBury").insertOne(newBury);
      return PackReturn(code, message);
   } catch (e) {
      return PackReturn(-4, "catch失败", e);
   }
}
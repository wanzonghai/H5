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
//获取用户列表
module.exports = async (context) => {
   console.log("**3008**");
   try {
      const cloud = context.cloud;
      const data = context.data;
      const openid = context.appOwnerOpenId;

      let _sql = {
         activeId: data.data.activeId,
      }
      if (data.data.isMember !== '') {
         _sql['isMember'] = data.data.isMember
      }
      if (data.data.memberLv !== '') {
         _sql['memberLv'] = data.data.memberLv
      }
      if (data.data.isInBackList !== '') {
         _sql['isInBackList'] = data.data.isInBackList
      }
      if (data.data.nickName !== '') {
         _sql['nickName'] = data.data.nickName
      }
      if (data.data.type == 'total') {
         let result = await cloud.db.collection('players').count({
            activeId: data.data.activeId
         });
         if (isRetError(result)) {
            return PackReturn(-2, "获取用户数据失败");
         }
         return PackReturn(code, message, result);
      } else if (data.data.type == "search") {
         var playerData = await cloud.db.collection("players").find(_sql, {
            projection: {
               userOpenId: 1,
               nickName: 1,
               isMember: 1,
               memberLv: 1,
               userCoin: 1,
               point: 1,
               openRedNum: 1,
               buyNum: 1,
               buyCost: 1,
               shareNum: 1,
               count_invitation: 1,
               taskDoneCount: 1,
               createTime: 1,
               isInBackList: 1,
               activeId: 1,
            },
            sort: { createTime: -1 },
            // limit: data.data.limit,
            // skip: data.data.skip
         });

         if (isRetError(playerData)) {
            return PackReturn(-2, "获取用户数据失败");
         }
         return PackReturn(code, message, playerData);
      } else {
         var playerData = await cloud.db.collection("players").find(_sql, {
            projection: {
               userOpenId: 1,
               nickName: 1,
               isMember: 1,
               memberLv: 1,
               userCoin: 1,
               point: 1,
               openRedNum: 1,
               buyNum: 1,
               buyCost: 1,
               shareNum: 1,
               count_invitation: 1,
               taskDoneCount: 1,
               createTime: 1,
               isInBackList: 1,
               activeId: 1,
            },
            sort: { createTime: -1 },
            limit: data.data.limit,
            skip: data.data.skip
         });
         console.log('----_sql----',_sql)
         console.log('----playerData----',playerData)

         if (isRetError(playerData)) {
            return PackReturn(-2, "获取用户数据失败");
         }
         return PackReturn(code, message, playerData);
      }
   } catch (e) {
      return PackReturn(-4, "catch失败", e);
   }
}
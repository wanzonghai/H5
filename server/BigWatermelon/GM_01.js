var code = 0;
var message = "成功";

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


//gm-mongod数据接口
module.exports = async (context) => {
   try {
      let code = 0;
      let message = 'ok';

      console.log("GM_01");
      const cloud = context.cloud;
      let data = context.data;

      let sqlType = data.data.sqlType;
      let sql = JSON.parse(data.data.sql);
      console.log('sql', sql);
      let dbName = data.data.dbName;
      if (sqlType == "find") {
         try {
            let find = await cloud.db.collection(dbName).find(sql)
            return PackReturn(code, message, find)
         } catch (error) {
            return PackReturn(-1, 'error', error)
         }
      } else if (sqlType == "group") {
         try {
            let aggregate = await cloud.db.collection(dbName).aggregate(sql)
            return PackReturn(code, message, aggregate)
         } catch (error) {
            return PackReturn(-1, 'error', error)
         }
      } else if (sqlType == "count") {
         try {
            let count = await cloud.db.collection(dbName).count(sql)
            return PackReturn(code, message, count)
         } catch (error) {
            return PackReturn(-1, 'error', error)
         }
      }

   } catch (error) {
      console.log('---error----', error)
   }

}
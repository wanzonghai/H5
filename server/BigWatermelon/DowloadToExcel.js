const xlsx = require('node-xlsx');

var code = 0;
var message = "成功";

function PackReturn(code, message, data) {
   if (data == undefined) {
      return JSON.stringify({ code: code, message: message });
   } else {
      console.log('data--------', data);
      return JSON.stringify({ code: code, message: message, data: data });
   }
}
//导出Excel
module.exports = async (context) => {
   console.log("**DowloadToExcel**");
   try {
      const cloud = context.cloud;
      const excelData = context.data.data.excelData
      const excelName = context.data.data.excelName
      console.log('------excelData-----', excelData)
      console.log('------excelName-----', excelName)

      let buffer = await xlsx.build([
         {
            name: 'worksheets',
            data: excelData
         }
      ])
      let result;

      try {
         result = await cloud.file.uploadFile({
            fileContent: buffer,
            fileName: excelName
         })
      } catch (e) {
         console.log('-----e-----', e)
         return PackReturn(-2, 'error', JSON.stringify(e));
      }

      return PackReturn(code, message, result);

   } catch (e) {
      return PackReturn(-4, "catch失败", e);
   }
}
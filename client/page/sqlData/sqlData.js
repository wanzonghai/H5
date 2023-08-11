

const app = getApp();
const cloud = app.cloud;
let cloudFunction = app.cloudFunction;
Page({
   data: {
      loading: true,
      cover: 'cover_none',
      condition: {
         dbName: "",
         sqlType: "",
         sql: "",
      },
      loading: false,
      selectList: [
         {
            label: "find",
            value: "find"
         },
         {
            label: "group",
            value: "group"
         },
         {
            label: "count",
            value: "count"
         },
      ],
      data: []
   },
   async onLoad() {

   },
   async onShow() {
      // 设置topy页面pagename
      await my.setStorageSync({
         key: "pageName",
         data: "内部数据工具"
      })
   },
   async sql(e) {
      let type = e.currentTarget.dataset.type;
      let value = e.detail.value;

      if (type === 'dbName') {
         this.data.condition.dbName = value
         this.setData({
            condition: this.data.condition
         })
      }
      if (type === 'sqlType') {
         this.data.condition.sqlType = value
         this.setData({
            condition: this.data.condition
         })
      }
      if (type === 'sql') {
         this.data.condition.sql = value
         this.setData({
            condition: this.data.condition
         })
      }
   },
   async go() {
      let sqlResult = await cloud.function.invoke(cloudFunction, {
         data: this.data.condition
      }, "GM_01")
      sqlResult = JSON.parse(sqlResult);
      console.log('sqlResult', sqlResult)
      // 如果是数组就转json
      let type = typeof (sqlResult.data);
      let data = [];

      if (type === 'object') {
         for (let i = 0; i < sqlResult.data.length; i++) {
            const item = sqlResult.data[i];
            data.push(JSON.stringify(item))
         }
      } else if (type === 'number') {
         data.push(sqlResult.data)
      }
      if (sqlResult.code === -1) {
         data = [
            JSON.stringify({
               error: "sql错误",
               msg: sqlResult.data
            })
         ]
      }
      this.setData({
         data: data
      })
      console.log('data', this.data.data)
   },
   // 导出数据
   async download() {
      //2，定义存储数据的
      let alldata = [];
      let row = ['数据']; //表属性
      alldata.push(row);

      let data = this.data.data;
      console.log('data', data);
      for (let key in data) {
         let arr = [];
         arr.push(data[key]);
         alldata.push(arr)
      }

      let _dow = await cloud.function.invoke(cloudFunction, {
         data: {
            excelData: alldata,
            excelName: 'userData.xlsx'
         }
      }, "DowloadToExcel");
      _dow = JSON.parse(_dow);
      if (_dow.code == 0 && _dow.message == '成功') {
         let url = _dow.data.url;
         url = url.replace('http', 'https');
         my.setClipboard({
            text: url,
            success: function () {
               my.showToast({
                  type: 'success',
                  content: '数据复制成功,请粘贴浏览器地址栏下载数据~'
               })
            }
         });
      }
   },
});
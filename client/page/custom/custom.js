const app = getApp();
let imageUrl = app.imageUrl;
Page({
   data: {
      company: '',
      imageUrl: imageUrl,
      dingzhi: [
         '../../images/custom/dingzhi_1.png',
      ],
      changjing: [
         '../../images/custom/changjing_1.png',
         '../../images/custom/changjing_2.png',
      ],
      buju: [
         imageUrl + 'custom/pipei.png',
         imageUrl + 'custom/jiazai.png',
      ],
      uidingzhi: [
         imageUrl + 'custom/ui_dingzhi.png',
      ]
   },
   async onLoad() {
      // 获取用户授权信息
      let userInfo = my.getStorageSync({ key: "userInfo" });
      if (userInfo.data) {
         this.setData({
            company: userInfo.data.company
         })
      }

   },
   async onShow() {
      // 设置topy页面pagename
      await my.setStorageSync({
         key: "pageName",
         data: "定制服务"
      })
   },
   //打开千牛客服聊天框
   openQianniu() {

      my.qn.openChat({

         nick: "cntaobao" + '小爱灵动互动娱乐',
         text: '你好',
         success: (res) => {
            console.log(res);
         },
         fail: (res) => {

            console.log(res);
         }
      })
   },
});

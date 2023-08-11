Page({
   data: {},
   onLoad() { },
   async onShow() {
      // 设置topy页面pagename
      await my.setStorageSync({
         key: "pageName",
         data: "投放素材"
      })
   },
});

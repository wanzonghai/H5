//app.js
let $global;

App({
  onLaunch: function () {
    // jd.setEnableDebug({//调试
    //  enableDebug: true
    // })
    // 调用API从本地缓存中获取数据
    var logs = jd.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    jd.setStorageSync('logs', logs);
    this.$global = {window:{}};
   


  },
  getFavoriteStatus(){
    jd.getFavoriteStatus({
      success:(e)=>{
          console.log(e)
      }
    });
  },
  globalData: {
    userInfo: null,
    serverUrl: 'http://jd.eroswift.com',
    // serverUrl: 'http://172.19.82.66:3000',
    uid: '',
    activityId: '',
    userInfo: ''
  },
  
 
  openSetting(){
    jd.openSetting({
      success: (res) => {
        console.log(res)
      }
    })
  },
  getSetting(){
    jd.getSetting({
      success: (res) => {
        console.log(res);
      }
    })
  },
  showToast(_tile){
    jd.showToast({
      title: _tile,
      icon: 'loading',
      duration: 3000
    })
  },
  

  
});
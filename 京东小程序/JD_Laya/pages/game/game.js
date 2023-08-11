var app = getApp();
Page({
  data: {
    motto: 'Hello World',
    params: ''
  },
  onReady() {
  },
  //事件处理函数
  bindViewTap: function () {
    jd.navigateTo({
      url: ''
    });
  },
  onLoad() {

  },
  onShow() {
    console.log('globalData', app.globalData)
    let params = encodeURIComponent('uid=' + app.globalData.uid + '&activityId=' + app.globalData.activityId + '&nickName=' + app.globalData.userInfo.nickname + '&avatarUrl=' + app.globalData.userInfo.avatar_url + '&gender=' + app.globalData.userInfo.gender)
    console.log('params', decodeURIComponent(params))
    this.setData({
      params: params
    })
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function (userInfo) {
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   });

    // });
  }
});
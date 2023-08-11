//index.js
//获取应用实例
var app = getApp();
var _loginSuc;
var _authSuc;
Page({
  data: {
    motto: 'Hello World',
    // 头像信息
    userInfo: {},
    // 用户唯一 id
    uid: 0,
    // 活动 id
    activityId: '1043',
  },
  onReady() {

  },
  onShow() {
  },
  onHide() {

    // if(this._loginSuc){
    //   jd.getSetting({
    //     success: (res) => {
    //       console.log("getsetting"+res.authSetting["scope.userInfo"]);
    //       if(res.authSetting["scope.userInfo"] == false)
    //       {
    //         setTimeout(() => {
    //           this.showModal();
    //         }, 5000);
    //       }else{
    //         if(this._authSuc==false)
    //         {
    //           setTimeout(() => {
    //             this.authCode();
    //           }, 6000);
    //         }
    //       }
    //     }
    //   })
    // } 
  },
  //事件处理函数
  bindViewTap: function () {
    jd.navigateTo({
      url: '../view/view'
    });
  },
  login() {
    //登录
    jd.login({
      success: (res) => {
        if (res.code) {
          //xxxxx
          this._loginSuc = true;
          this.postcode(res.code);
          console.log("登录成功", res);


        } else {
          console.log('登录失败，错误信息：', res.errMsg)
        }
      }
    });
  },
  authCode() {
    console.log("Uid", this.data.uid);
    var that = this;
    //授权
    // jd.getAuthCode({
      // success: (res) => {
        // console.log("获取授权码成功：（getAuthCode）" + JSON.stringify(res));
        jd.requestIsvToken({
          url: "https://xxx-isv.isvjcloud.com",
          id: "",
          method: 'POST',
          success: (res) => {
            console.log("requestIsvToken.success", res);
            // 京东 api 使用 token
            let jdApiToken = res.token;
            console.log("jdApiToken", res.token);
            jd.getUserInfo({
              success: (res) => {
                console.log("用户授权信息", res.userInfo);
                this.postUserInfo(jdApiToken, res);
              }
            });
          },
          fail: (res) => {
            console.log("requestIsvToken.fail", res);
          },
          complete: (res) => {
            console.log("requestIsvToken.complete", res);
          }
        });
      // },
      // fail: (res) => {
      //   console.log("获取授权码失败（getAuthCode  ）：" + JSON.stringify(res));
      //   this.showModal();
      // },
      // complete: (res) => {
      //   console.log("获取授权码compolete（getAuthCode  ）：" + JSON.stringify(res));

      // }
    // });
  },
  showModal() {
    jd.showModal({
      title: '提示',
      content: '是否打开授权设置',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定')
          jd.openSetting({
            success: (res) => {
              console.log(res)
              //  jd.getSetting({
              //     success: (res) => {
              //       console.log("getsetting"+res.authSetting["scope.userInfo"]);
              //       if(res.authSetting["scope.userInfo"] == true)
              //       {
              //         this.login();
              //       }
              //     }
              //   })
            }
          })
        } else if (res.cancel) {
          console.log('点击取消')
        }
      }
    })
  },
  /**
 * 发送code数据到服务器
 */
  postcode(_code) {
    var that = this;
    jd.request({
      url: app.globalData.serverUrl + '/C/loginJD/login', //服务器url地址
      method: 'POST',
      data: {
        code: _code,
        activityId: this.data.activityId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.code == 0) {
          that.data.uid = res.data.data.uid;
          that.authCode();
        }
      }
    })
  },
  /**
 * 发送UserInfo数据到服务器
 */
  postUserInfo(jdApiToken, res) {
    let userInfo = res.userInfo;
    jd.request({
      url: app.globalData.serverUrl + '/C/loginJD/updateUserInfo', //服务器url地址
      method: 'POST',
      data: {
        uid: this.data.uid,
        nivckName: userInfo.nivckName,
        avatarUrl: userInfo.avatarUrl ? userInfo.avatar_url : 'https://',
        gender: userInfo.gender.toString(),
        token: jdApiToken,
        platform: 'C'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log("updateUserInfo:", res)
        // 头像昵称 | uid 存储 localstorage 中
        // try {
        //   jd.setStorageSync('userInfo', userInfo)
        // } catch (error) {
        //   console.log("存储本地数据失败: userInfo", error)
        // }

        if (res.data.code == 0) {
          // 之后 调用 京东 api 的时候需要!!! 
          let userPin = res.data.data.pin;
          app.globalData.uid = this.data.uid;
          app.globalData.activityId = this.data.activityId;
          app.globalData.userInfo = userInfo;
          this.data.userInfo = userInfo
          // 登录成功,跳转页面

          jd.navigateTo({
            url: `/pages/game/game`
          })
          // this.jdApi(userPin);
        }

      }
    })
  },
  /**
   * api 接口调用接口
   */
  jdApi(userPin) {
    // 发送 关注店铺 api 实例
    let apiName = 'jingdong.follow.vender.write.followByPinAndVid';
    jd.request({
      url: app.globalData.serverUrl + '/C/JDapiEvent/jdApi', //服务器url地址
      method: 'POST',
      data: {
        uid: this.data.uid,
        api: apiName,
        params: {
          pin: userPin,
          shopId: 11491523,
          open_id_buyer: userPin
        },
        isNotAuth: true,
        platform: 'C'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log('关注 API--------->', res)
      }
    })
  },

  /**
   * questIsvToken
   */
  onLoad: function () {
    console.log('onLoad');
    this.login();
    //调用应用实例的方法获取全局数据
  }
});

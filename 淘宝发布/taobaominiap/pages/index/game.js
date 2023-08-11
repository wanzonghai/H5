
var touchstartCB;
var touchcancelCB;
var touchendCB;
var touchmoveCB;
var closeCB;
var resultCB;
var shareInfoList = [];
Page({
  onReady(){
  },
  onLoad(query){
    var app = getApp();
    if(query && query.fromId){
      app.fromId = query.fromId;
      // my.showToast({
      //       type: 'success',
      //       content: JSON.stringify(query),
      //       duration: 2000,
      //       success: () => {

      //       },
      //   });
    }
    app.game = this;
  },
  onTouchStart(e){
    touchstartCB&&touchstartCB(e)
  },
  onTouchCancel(e){
    touchcancelCB&&touchcancelCB(e)
  },
  onTouchEnd(e){
    touchendCB&&touchendCB(e)
  },
  onTouchMove(e){
    touchmoveCB&&touchmoveCB(e)
  },
  canvasOnReady(){
    my.onTouchStart = function(cb){
      touchstartCB = cb;
    };
    my.onTouchCancel = function(cb){
      touchcancelCB = cb;
    }
    my.onTouchEnd = function(cb){
      touchendCB = cb;
    }
    my.onTouchMove = function(cb){
      touchmoveCB = cb;
    }

    delete require.cache[require.resolve("layaengine/adapter.js")];
    require("layaengine/adapter.js");
    $global.window.pushSharedInfo = function(obj){
      shareInfoList.push(obj);
    };
    delete require.cache[require.resolve("layaengine/libs/min/laya.tbmini.min.js")];
    require("layaengine/libs/min/laya.tbmini.min.js");
    delete require.cache[require.resolve("./index.js")];
    require("./index.js");
    $global.window.Parser = require("./js/dom_parser");
  },
  onUnload(){
    $global.window.cancelAnimationFrame();
    $global.$isAdapterInjected = false;
    $global.window = null;
  },

  async openMember(cb1, cb2) {
    this.setData({  expend:true,  }) 
    closeCB = cb1;
    resultCB = cb2;
  },
  async onClose(event) {
     this.setData({  expend:false,  }) 
     closeCB && closeCB();
  },
  async onAuthSuccess(res) {
     console.log("onAuthSuccess");
     this.setData({  expend:false,  }) 
     var app = getApp();
     if(app.name == "hinswind" || app.name == "lnn0904") {
      my.alert({
        title: "会员检查成功",
        content: JSON.stringify(res),
      })
     }
     resultCB && resultCB(true);
  },
  async onAuthFail(res) {
     this.setData({  expend:false,  }) 
     var app = getApp();
     if(app.name == "hinswind" || app.name == "lnn0904") {
      my.alert({
        title: "会员检查失败",
        content: JSON.stringify(res),
      })
     }
     resultCB && resultCB(false);
  }


});

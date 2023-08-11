import cloud from '@tbmp/mp-cloud-sdk';
//test | pre | online
cloud.init({
  // env: 'test'
  // env: 'pre'
  env: 'online'
});

var memberPlugin = requirePlugin("cemMember");
// var taskPlugin = requirePlugin("myPlugin");

App({
  key_server: "WaterMelonServer",//"test" | "BigFightServer"
  // activeId: "Zb1zvmUt7y8TIjGQING4", // 提审专用
  // activeId: "Rb5mw71fNVFZgphiM7Er",//测试用
  // activeId: "5CssCO6ZNEjCNYWBsYls",//vivo测试
  // activeId: "yif2subhOEYl09YhfUJL",//vivo online
  // activeId: 1441,//测试服
  activeId: 1175,//正式服
  fromId: "",
  name: "",
  openAppTime: 0,  //上报openApp的时间

  onLaunch(options) {
    // 第一次打开
    console.info('App onLaunch');
    //console.info('App options = ', options);

    //设置启动参数
    if (options && options.query) {
      this.fromId = options.query.fromId || this.fromId;//这里拿不到fromId
      this.activeId = options.query.activityId || this.activityId;
    }

    // my.showToast({
    //         type: 'success',
    //         content: JSON.stringify(options),
    //         duration: 5000,
    //         success: () => {

    //         },
    //     });

    // this.openAppTime = new Date().getTime();
    // let info = { "id": 5001, "data": { activeId: this.activeId, action: "openApp", data: { tag: this.openAppTime } } };
    // this.sendServer(info, (parm) => {
    //   console.log("openApp data = ", parm);
    // });
  },


  onShow(options) {
    if (this.global["onShow"]) {
      this.global["onShow"](options);
    }
  },
  onHide() {
    if (this.global["onHide"]) {
      this.global["onHide"]();
    }
  },

  game: null,
  title: "",
  desc: "",
  imageUrl: "",
  path: 'pages/index/game',
  /**
   * 设置 分享数据
   * @param {title: 标题，desc: 内容，imageUrl: 头像url} options 
   */
  setShare(options) {
    this.title = options.title;
    this.desc = options.desc;
    this.imageUrl = options.imageUrl;
    this.path = options.path;
  },
  onShareAppMessage(options) {
    let self = this;
    console.log("app onShareAppMessage", self.title, self.desc, self.imageUrl, self.path);

    return {
      title: self.title,
      desc: self.desc,
      imageUrl: self.imageUrl,
      path: self.path,
      success: () => {
        console.log("onShareAppMessage success");
        if (self.global["shareSuccess"]) {
          self.global["shareSuccess"]();
          self.global["shareSuccess"] = null;

        }
      },
      fail: () => {
        console.log("onShareAppMessage fail");
        if (self.global["shareFail"]) {
          self.global["shareFail"]();
          self.global["shareFail"] = null;
        }
      }
    }
  },
  /**
   * 全局global对象
   */
  global: {
    // onShow 绑定前端 onShow 事件
    // onHide 绑定前端 onHide 事件
  },

  getServerData(callback, version) {
    console.log("App getServerData ");
    //测试服务器配置
    cloud.function.invoke(this.key_server, {
      data: {
        id: "1000", data: { fromId: this.fromId, activeId: this.activeId, clientVersion: version }//"aWtLhoVDvCNkLQXqUtg7"
      }
    }, "C_MSG_1000").then(res => {
      console.log("getServerData: ", res);
      let parm = JSON.parse(res);
      if (callback) {
        callback(parm);
      }
    });

  },

  /**
   * 向云函数发送请求
   * @param {*} serverName 云函数的名字
   * @param {*} handler 云函数下面的handler
   * @param {*} data 输入参数数据
   * @param {*} thisObj 回调方法所属的对象
   * @param {*} callBack 回调方法
   */
  sendServer(serverName, handler, data, thisObj, callBack) {

    console.log("taoao---Request:【" + serverName + "|" + handler + "】", data);

    console.log(4, !!data);

    let params = !!data ? data : {};

    console.log(5, params);

    //所有的C端消息都应该有activityId，否则是非法的消息。
    if (!params.activityId) {
      console.log(7, this);

      params.activityId = parseInt(this.activeId);
    }

    console.log(6, params);

    cloud.function.invoke(serverName, params, handler).then(result => {

      console.log("taoao---Response:【" + serverName + "|" + handler + "】", thisObj, callBack);

      console.log("taoao---Response:str-result", JSON.stringify(result));

      if (!!callBack) {
        console.log("taoao---Response:result", result);

        callBack.call(thisObj, result);

        console.log("taoao---Response:【2】");
      }

    });

  },

  openMember(cb1, cb2) {
    if (this.game) {
      this.game.openMember(cb1, cb2);
    }
  },

  checkMember(callback) {
    memberPlugin.checkMember({
      success(v) {
        //检查成功返回实际结果
        if (callback) {
          callback(v.data.isMember == "true");
        }
      },
      fail(v) {
        //检查失败时当做非会员
        if (callback) {
          callback(false);
        }
      }
    });
  },

  setName(name) {
    this.name = name;
  },

  taskList: [],
  //获取任务列表
  getTaskList(cb) {
    cb && cb({ result: true, data: [] })
    // cloud.function.invoke(this.key_server, {
    //   data: {
    //     activeId: this.activeId
    //   }
    // }, "C_MSG_2002").then(res => {
    //   console.log("getTaskList: ", res);
    //   let parm = JSON.parse(res);
    //   if (callback) {
    //     callback(parm);
    //   }
    // });
    // taskPlugin.getTaskList()
    //   .then(res => {
    //     cb && cb({ result: true, data: res })
    //     this.taskList = res || [];
    //     console.log('success', JSON.stringify(this.taskList))
    //   }).catch(err => {
    //     cb && cb({ result: false, data: err })
    //     console.log('err', err)
    //   })
  },

  //触发完成任务  value包含deliveryTplId， implId， fromToken， taskType，actionURL
  triggerItem(title, cb) {
    let { value = {} } = {};
    for (let i = 0; i < this.taskList.length; i++) {
      if (this.taskList[i].taskTitle.indexOf(title) != -1) {
        value = this.taskList[i];
      }
    }
    console.log('===== title = %s value = %s ====', title, JSON.stringify(value));
    cloud.function.invoke(this.key_server, {
      data: {
        activeId: this.activeId,
        task_id: title,
      }
    }, "C_MSG_2004").then(res => {
      console.log("triggerItem: ", res);
      let parm = JSON.parse(res);
      if (callback) {
        callback(parm);
      }
    });
    // taskPlugin.triggerItem(value)
    //   .then(res => {
    //     cb && cb(res)
    //     console.log('res', res)
    //   }).catch(err => {
    //     console.log('err', err)
    //     cb && cb(res)
    //   })
  },

  //设置导航条颜色
  setBarColor(style) {
    // let color = '#FEB40D';
    let color = '#5CDCE8';
    // if (style == 1) {
    //   color = '#cc1917';
    // } else if (style == 2) {
    //   color = '#108ee8';
    // } else if (style == 3) {
    //   color = '#d13751';
    // } else if (style == 4) {
    //   color = '#6ADFEA';
    // }

    my.setNavigationBar({ backgroundColor: color });
  },

  getOpenAppTime() {
    return this.openAppTime;
  },

});

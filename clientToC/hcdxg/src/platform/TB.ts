import MainUtil from "../utils/MainUitl";
import SoundPlayer from '../common/SoundPlayer';
import { Global } from "../config/Global";
import { GameLogic } from "../FGUIClass/GameLogic";

declare var my;

class TB {
    _dataQueue: any = [];  //消息队列

    public static _instance: TB = null;
    public static getInstance(): TB {
        this._instance = this._instance || new TB();
        return this._instance;
    }
    /**
     * 初始化  需要手动调用
     */
    init() {
        console.log("TB initSuccess");
        if (!Laya.Browser.onTBMiniGame) return;
        //初始化 切换前后台
        this.initShow();
        //初始化 网络状态
        this.initNetState();

        Laya.timer.frameLoop(5, this, () => {
            this.onUpdate();
        });
    }
    /**
     * api版本兼容
     * @param apiName api名
     */
    checkApiLv(apiName: string, sdkName?: string) {
        if (!Laya.Browser.onTBMiniGame) return false;
        if (!sdkName || sdkName == undefined) {
            if (my[apiName]) return true;
        } else {
            if (my[sdkName][apiName]) return true;
        }
        console.log('当前版本不支持该API: ', apiName);
        return false;
    }
    /**
     * 获取 系统信息
     */
    getSystemInfoSync() {
        if (!this.checkApiLv("authorize")) return null;
        return my.getSystemInfoSync();
    }
    /**
     * 授权
     */
    _isAuthorize: boolean = false;
    _userInfo: any = null;
    authorize(authorizeSuccess?: Function, fail?: Function) {
        if (!this.checkApiLv("authorize")) return;
        let self = this;
        my.authorize({
            scopes: 'scope.userInfo',
            success: (res) => {
                console.log("authorize res: ", res);
                self._isAuthorize = true;
                my.getAuthUserInfo({
                    success: (userInfo) => {
                        self._userInfo = userInfo;
                        if (authorizeSuccess) {
                            authorizeSuccess(self._userInfo);
                        }
                    }, fail: () => {
                        console.log("获取授权失败 引导授权界面");
                        if (!this.checkApiLv("showAuthGuide")) return;
                        my.showAuthGuide();
                    }
                });
            },
            fail: () => {
                if (fail) {
                    fail();
                }
            }
        });
    }
    /**
     * 获取 用户数据
     * @param callback 回调 带userinfo参数
     */
    getAuthUserInfo(callback: Function) {
        if (!this._userInfo) {
            if (!this._isAuthorize) {
                this.authorize(callback);
            } else {
                let self = this;
                if (!this.checkApiLv("getAuthUserInfo")) return;
                my.getAuthUserInfo({
                    success: (userInfo) => {
                        self._userInfo = userInfo;
                        if (callback) {
                            callback(self._userInfo);
                        }
                    }, fail: () => {
                        console.log("获取授权失败 引导授权界面");
                        if (!this.checkApiLv("showAuthGuide")) return;
                        my.showAuthGuide();
                    }
                });
            }
        } else {
            if (callback) {
                callback(this._userInfo);
            }
        }
    }
    isLogin: boolean = false;
    _socket: any = null;
    _openid: string = "";   //玩家ID
    _shopOpenid: string = ""; //商铺ID
    _shopId: string = ""; //商铺ID（关注店铺用）
    _storeId: string = ""; //店铺ID（跳转店铺用）
    _activeId: string = ""; //活动ID
    //_ename: string = "";
    /**
     * 登录接口  暂无
     */
    login(loginSuccess?: Function, loginFail?: Function) {
        if (this.isLogin) {
            if (!this.getServerData()) {
                this.isLogin = false;
                if (loginFail) {
                    loginFail();
                }
                return;
            }
            if (loginSuccess) loginSuccess(this.getServerData());
            return;
        }
        this.showLoad("拉取配置中");
        let app = getApp();
        app["getServerData"]((res) => {
            console.log("login getServerData: ", res);
            if (res["code"] == 0) {
                console.log("login成功");
                this.isLogin = true;
                this.hideLoad();
                console.log("res.data: ", res.data);
                this._openid = res.data.userOpenId;
                this._shopOpenid = res.data.openid;
                this._shopId = res.data.shopId;
                if (res.data.hasOwnProperty("storeId")) {
                    this._storeId = res.data.storeId;
                }
                this._activeId = res.data.activeId;
                console.log("_storeId = ", this._storeId);

                //this._ename = res.data.gameConfig.redPacket.ename;
                console.log("this._openid: ", this._openid);
                //console.log("this._ename: ",this._ename);
                console.log("this._shopOpenid: ", res.data.openid);
                //this.showToast("店铺ID:" + this._shopId);
                this.setServerData(res.data);
                if (loginSuccess) {
                    loginSuccess(res.data);
                }
            }
            else if (res["code"] == -11) {  //黑名单玩家
                this.showToast("黑名单玩家，暂时无法进入游戏！");
            }
            else {
                console.log("login失败");
                this.hideLoad();
                this.isLogin = false;
                this.showToast("拉取配置失败");
                if (loginFail) {
                    loginFail();
                }
            }
        }, Global.hallConfig._version);
    }
    _serverData: any = null;
    setServerData(data: any) {
        this._serverData = data;
    }
    /**
     * 获取 服务器配置数据
     */
    getServerData() {
        return this._serverData;
    }

    /**
     * 发送数据到服务器
     */
    sendServer(data: any, callback?: Function) {
        data["clientVersion"] = Global.hallConfig._version;
        console.log("sendServer: ", data);
        if (this._openid == undefined || this._openid == "") {
            this.login();
            return;
        }
        let app = getApp();
        if (app["sendServer"]) {
            app["sendServer"](data, callback);
        }
    }

    //上报埋点数据
    sendAnalysis(data: any, callback?: Function) {
        data["clientVersion"] = Global.hallConfig._version;
        console.log("sendServerAnalysis: ", data);
        let app = getApp();
        if (app["sendServer"]) {
            app["sendServer"](data, callback);
        }
    }


    /**
     * 分享接口
     */
    share(shareSuccess?: Function, shareFail?: Function) {
        if (!this.checkApiLv("showSharePanel")) return;
        //示例
        let app: any = getApp();
        app.setShare({
            title: Global.ResourceManager.getShareConfig().shareTitle || "合成大作战",
            desc: Global.ResourceManager.getShareConfig().shareDesc || "合成大作战",
            imageUrl: Global.ResourceManager.getShareConfig().shareURL || "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/admin/images/config/skin/tmp_3.png",

            path: "pages/index/game?fromId=" + this._openid + "&activeId=" + app.activeId
        });
        if (shareSuccess) {
            app.global["shareSuccess"] = shareSuccess;
        }
        if (shareFail) {
            app.global["shareFail"] = shareFail;
        }
        my.showSharePanel();
        return;
        //唤起分享功能  分享内容在onShareAppMessage中配置
        my.showSharePanel();
    }
    /**
     * 监控网络状态
     */
    isNetSuccess: boolean = true;
    initNetState() {
        if (!this.checkApiLv("getNetworkType")) return;
        let self = this;
        my.getNetworkType({
            success: (res) => {
                self.isNetSuccess = res.networkAvailable ? true : false;
            }
        });
        my.onNetworkStatusChange((res) => {
            self.isNetSuccess = res.isConnected ? true : false;
        });
    }
    /**
     * 获取网络状态
     */
    getNetState(): boolean {
        return this.isNetSuccess;
    }
    /**
     * 前后台切换
     */
    initShow() {
        let app = getApp();
        app["global"]["onShow"] = this.onShow;
        app["global"]["onHide"] = this.onHide;
        MainUtil.initActivityTime();
    }

    //切前台 调用
    onShow() {
        console.log("TB onshow");
        //检查订单
        Laya.stage.event("checkOrder");
        //浏览商品回调
        Laya.stage.event("checkBrowse");
        //检查任务变化
        Laya.stage.event("TBTaskChange");
        //检查是否是分享回来
        Laya.stage.event("checkShare");

        MainUtil.initActivityTime();
        GameLogic.CheckLuckyBagState();

        //检测背景音乐是否继续播放
        SoundPlayer.resumeSound();
    }

    //切后台 调用
    onHide() {
        console.log("TB onHide");

        //加载界面退出上报埋点
        if (MainUtil.getCurScene() == Global.hallConfig.CUR_SCENE.loading) {
            let t = new Date().getTime() - TB.getInstance().getOpenAppTime();
            console.log("openApp->exit time = ", t);
            //MainUtil.analysis('exit', { type: Global.hallConfig.CUR_SCENE.loading, diff_time: t, tag: TB.getInstance().getOpenAppTime() });
            // //MainUtil.analysis('exit', { type: Global.hallConfig.CUR_SCENE.loading, diff_time: t, tag: TB.getInstance().getOpenAppTime() });
        }

        MainUtil.sendActivityTime();
        //暂停背景音乐
        SoundPlayer.pauseSound();
    }
    /**
     * showLoad
     * @param content 提示内容
     */
    showLoad(content?: string) {
        if (!this.checkApiLv("showLoading")) return;
        let str_content = content == undefined ? "加载中..." : content;
        my.showLoading({
            content: str_content,
            delay: 1000,
        });
        setTimeout(() => {
            this.hideLoad();
        }, 5000);
    }
    hideLoad() {
        if (!this.checkApiLv("hideLoading")) return;
        my.hideLoading();
    }
    /**
     * showToast
     * @param content 提示内容
     */
    showToast(content?: string) {
        if (!this.checkApiLv("showToast")) return;
        if (!content || content == undefined) return;
        my.showToast({
            type: 'success',
            content: content,
            duration: 2000,
            success: () => {

            },
        });
    }

    /**
     * 确认/取消 弹框
     * @param title 
     * @param content 
     * @param str_sure 
     * @param str_cancel 
     */
    confirm(title: string, content: string, str_sure = "确定", str_cancel = "取消") {
        if (!this.checkApiLv("confirm")) return;
        my.confirm({
            title: title,
            content: content,
            confirmButtonText: str_sure,
            cancelButtonText: str_cancel,
            success: (result) => {
                console.log("result: ", result);
            },
        });
    }

    /**
     * 任务
     */
    task() {
        //任务 类型很多

    }
    /**
     * 打开 商品详情
     * @param good_id 商品id
     * @param success 成功回调
     */
    openDetail(good_id: string, success?: Function, fail?: Function) {
        console.log('===== openDetail ====', good_id);
        if (!this.checkApiLv("openDetail", "tb")) return;
        my.tb.openDetail({
            itemId: '' + good_id,
            success: (res) => {
                if (success) {
                    success();
                }
            },
            fail: (res) => {
                if (fail) {
                    fail();
                }
            },
        });
    }
    /**
     * 收藏 商品
     * @param good_id 商品id
     */
    collectGoods(good_id: string, success, fail) {
        if (!this.checkApiLv("collectGoods", "tb")) return;
        let self = this;
        my.tb.collectGoods({
            id: good_id,
            success: (res) => {
                self.showToast("收藏成功");
                if (success) {
                    success(res);
                }
            },
            fail: (res) => {
                if (fail) {
                    fail(res);
                }
            },
            complete: (res) => {
            }
        })
    }
    /**
     * 取消收藏 商品
     * @param good_id 商品id
     */
    unCollectGoods(good_id: string) {
        if (!this.checkApiLv("unCollectGoods", "tb")) return;
        let self = this;
        my.tb.unCollectGoods({
            id: '' + good_id,
            success: (res) => {
                self.showToast("取消关注");
            },
            fail: (res) => {

            },
            complete: (res) => {
            }
        })
    }

    //检测是否已收藏
    checkGoodsCollectedStatus(good_id: string, func?: Function) {
        if (!this.checkApiLv("checkGoodsCollectedStatus", "tb")) return;
        let self = this;
        my.tb.checkGoodsCollectedStatus({
            id: '' + good_id,
            success: (res) => {
                //console.log("商品收藏状态 res = ", res);
                if (func) {
                    func(res.isCollect);
                }
            },
        })
    }

    /**
     * 检测对某个商铺 的关注状态
     * @param shop_id 店铺id
     * @param callback 获取成功 回调
     */
    checkShopFavoredStatus(callback?: Function, failCallback?: Function) {
        if (!this.checkApiLv("checkShopFavoredStatus", "tb")) return;
        my.tb.checkShopFavoredStatus({
            id: '' + this._shopId,
            success: (res) => {
                if (callback) {
                    /*
                        res: {
                            id: 卖家id
                            isFavor: 是否关注(Boolen)
                        }
                    */
                    callback(res);
                }
            },
            fail: (res) => {
                failCallback && failCallback(res);
            }
        })
    }
    /**
     * 关注 店铺
     * @param shop_id 店铺id
     */
    favorShop(successFunc?: Function, failFunc?: Function, type = 0) {
        if (!this.checkApiLv("favorShop", "tb")) return;
        let self = this;
        console.log("shopid = ", this._shopId);
        my.tb.favorShop({
            id: '' + this._shopId,
            success: (res) => {
                if (successFunc) {
                    successFunc();
                }
                //MainUtil.analysis('joinFavor', { isFavor: true, type: type });
                self.showToast("关注成功");
            },
            fail: (res) => {
                if (failFunc) {
                    failFunc();
                }
                self.showToast("关注失败");
            }
        })
    }
    /**
     * 取消关注 店铺
     * @param shop_id 店铺id
     */
    unFavorShop(shop_id: string) {
        if (!this.checkApiLv("unFavorShop", "tb")) return;
        let self = this;
        my.tb.unFavorShop({
            id: '' + shop_id,
            success: (res) => {
                self.showToast("取消关注");
            },
            fail: (res) => {

            }
        });
    }
    /**
     * 跳转其他小程序id
     * @param app_Id 其他小程序id
     */
    navigateToMiniProgram(app_Id: number | string) {
        if (!this.checkApiLv("navigateToMiniProgram")) return;
        my.navigateToMiniProgram({
            appId: app_Id,
            extraData: {
                "data1": "test"
            },
            success: (res) => {
                console.log(JSON.stringify(res))
            },
            fail: (res) => {
                console.log(JSON.stringify(res))
            }
        });
    }
    /**
     * 跳转店铺
     * @param shop_id 店铺id
     */
    navigateToTaobaoPage(successFunc?: Function, failFunc?: Function) {
        if (!this.checkApiLv("navigateToTaobaoPage", "tb")) return;
        let self = this;
        //MainUtil.showToast(self._storeId);
        my.tb.navigateToTaobaoPage({
            appCode: 'shop',
            appParams: {
                shopId: '' + self._storeId,
                weexShopSubTab: "shopindex",
                weexShopTab: "shopindexbar"
            },
            success: (res) => {
                console.log("跳转店铺成功");
                if (successFunc) {
                    successFunc();
                }
            },
            fail: (err) => {
                //MainUtil.showToast(JSON.stringify(err));
                console.log("跳转店铺失败: ", err);
                if (failFunc) {
                    failFunc();
                }
            }
        });
    }

    /**
     * 数据埋点
     * @param state 埋点 
     * @param data  数据
     */
    reportAnalytics(state: string, data?: any) {
        if (!this.checkApiLv("reportAnalytics")) return;
        // my.reportAnalytics("enter", {
        //     // 页面名称埋点，（可选，如此项不填，小程序容器会自动取currentPagePath）
        //     'pageName': 'yourPageName', 
        //     // 页面url埋点（可选，如此项不填，小程序容器会自动取currentPagePath），如传入需要用https//打头
        //     'pageUrl': 'https://' + 'yourPageUrl', 
        //     // 各种自定义参数key-value键值对，不限个数（注意：value只支持字符串格式）
        //     'customKey1': 'customValue1',
        //     'customKey2': 'customValue2',
        //     'customKey3': 'customValue3',
        // })
        my.reportAnalytics(state, data);
    }
    /**
     * 显示SKU选择器
     * @param good_id 商品id
     * @param success 成功回调
     */
    showSku(good_id: string, success?: Function) {
        if (!this.checkApiLv("showSku", "tb")) return;
        my.tb.showSku({
            itemId: good_id,
            success: (res) => {
                console.log("skuId = ", res.skuId);
                if (success) {
                    success(true);
                }
                //浏览完直接下单
                // this.order(res.itemId, res.skuId, res.quantity, success ? success : null);
            },
            fail: (res) => {
                if (success) {
                    success(false);
                }
            },
        });
    }
    /**
     * 下单
     * @param good_id 商品id
     * @param sku_id skuid
     * @param quantity 商品数量
     * @param success 成功回调
     */
    order(good_id: string, sku_id: string, quantity: number, success?: Function) {
        if (!this.checkApiLv("confirmCustomOrder", "tb")) return;
        my.tb.confirmCustomOrder({
            itemId: good_id,
            skuId: sku_id,
            quantity: quantity,
            success: (res) => {
                if (success) {
                    success();
                }
            },
            fail: (res) => {

            },
        });
    }

    /**
     * 打开收货地址选择器
     * @param success 成功回调
     */
    chooseAddress(success?: Function) {
        console.log('chooseAddress', 1);

        if (!this.checkApiLv("chooseAddress", "tb")) return;

        console.log('chooseAddress', 2);
        my.authorize({
            scopes: 'scope.addressList',
            success: (result) => {
                console.log('chooseAddress authorize', result);
                my.tb.chooseAddress({
                    addAddress: "show",
                    searchAddress: "hide",
                    locateAddress: "hide",
                    success: (res) => {
                        console.log('======= 收货地址 ======', JSON.stringify(res))
                        if (success) {
                            let data = {
                                name: res.name,
                                phone: res.telNumber,
                                address: res.provinceName + res.cityName + res.countyName + res.streetName + res.detailInfo,
                                province: res.provinceName,
                                city: res.cityName,
                                county: res.countyName,
                                street: res.streetName,
                                detailInfo: res.detailInfo
                            }
                            success(data);
                        }
                    },
                    fail: (res) => {
                        success && success(null)
                        console.error('======= 收货失败 ======', JSON.stringify(res))
                    },
                });
            },
        })

    }

    /**
     * 打开入会插件
     */
    openMember(closeCB, resultCB) {
        if (!Laya.Browser.onTBMiniGame) return;
        if (this._openid == undefined || this._openid == "") {
            this.login();
            return;
        }
        let app = getApp();
        if (app["openMember"]) {
            app["openMember"](closeCB, resultCB);
        }
    }

    /**
     * 是否为会员
     */
    checkMember(callback) {
        if (!Laya.Browser.onTBMiniGame) return;
        if (this._openid == undefined || this._openid == "") {
            this.login();
            return;
        }
        console.log('==== checkMember ====');
        let app = getApp();
        if (app["checkMember"]) {
            app["checkMember"](callback);
        }
    }

    //保存到队列
    sendMsg(data, callBack, priority?: number) {
        priority = (priority == undefined) ? 2 : priority;
        let msg = { data: data, callBack: callBack, priority: priority };
        for (let i = this._dataQueue.length - 1; i >= 0; i--) {
            let tmp = this._dataQueue[i];
            //按照优先级插入数据
            if (tmp.priority <= priority) {
                //插入数据
                this._dataQueue.splice(i + 1, 0, msg);
                //console.log("数据插入成功，消息id = ", msg.data.id);
                console.log("this._dataQueue = ", this._dataQueue);
                return;
            }
        }

        //优先级最高，直接插入最前面
        this._dataQueue.splice(0, 0, msg);
        //console.log("数据插入成功，优先级最高, 消息id = ", msg.data.id);
        //console.log("this._dataQueue = ", this._dataQueue);
    }

    onUpdate() {
        if (this._dataQueue.length > 0) {
            let msg = this._dataQueue.shift();
            if (msg != undefined && msg != null) {
                this.sendServer(msg.data, msg.callBack);
                console.log("发送数据成功，消息id = ", msg.data.id);
                //console.log("this._dataQueue = ", this._dataQueue);
            }
        }
    }

    phoneVibrate() {
        my.vibrate({
            success: () => {

            }
        });
    }

    //配置名字，特殊人员测试用
    setName(name) {
        let app: any = getApp();
        app.setName(name);
    }

    //获取版本类型：发布、调试..
    getRunScene(cb) {
        if (!this.checkApiLv("getRunScene")) return;
        my.getRunScene({
            success(result) {
                cb(result.envVersion)
            },
        })
    }

    //任务插件-获取任务列表
    getTaskList(cb) {
        let app: any = getApp();
        app.getTaskList((res) => {
            cb && cb(res);
        });
    }

    //任务插件-跳转、签到
    triggerItem(title, cb) {
        let app: any = getApp();
        app.triggerItem(title, (res) => {
            cb && cb(res);
        });
    }

    //调整导航栏
    setBarColor(style) {
        if (!Laya.Browser.onTBMiniGame) return;
        let app: any = getApp();
        app.setBarColor(style);
    }

    //获取openApp埋点上报的时间
    getOpenAppTime() {
        let time = 0;
        if (!Laya.Browser.onTBMiniGame) return time;
        let app: any = getApp();
        time = app.getOpenAppTime();
        return time;
    }
}

export default TB.getInstance();
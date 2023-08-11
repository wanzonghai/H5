import { ShareConfig } from "../../../ShareConfig";
import PlatformBase, { AuthorizeScope, PlatformAdsResult } from "../PlatformBase";
// import TimeMonitor from "../../Debug/TimeMonitor";
//已支持小游戏平台
export enum MiniPlatformE {
    unknow,//未知
    wx,//微信
    qq,//qq
    tt,//头条
};
/**
 * 子类-小游戏
 * 由于小游戏接口类似，这里做统一实现，内部区分
 */
export default class Platform_mini extends PlatformBase {

    constructor() {
        super();
        // console.log('this is ', this.);
        this.init();

    }
    protected init() {
        //把脚本加入html头中
        if (this.isInitComplete) {
            return;
        }

    }

    //延时初始化内容（游戏加载完成后才开始执行此中内容）
    protected async delayInit() {
        this.initListenNet();
        if (this.IsExistRecoder()) {
            //初始化录屏接口
            this.initRecoder();
        }
        super.delayInit();
    }
    //------------------------------------------打点事件---------------------------------//
    SubmitAction(action: string, data: object = {}) {
        if (!mini || !mini.aldSendEvent) {
            console.error('未找到阿拉丁');
            return;
        }
        mini.aldSendEvent(action, data);
        console.log('[Platform_mini]', 'SubmitAction', action);
    }

    //进度打点事件
    IsExistStage() {
        if (PlatformBase.curPlatform && mini["aldStage"]) return true;
        return false;
    }
    Stage_onStart(_info: any) {
        if (!this.IsExistStage()) {
            console.error('IsExistStage', '不存在！');
            return;
        }
        mini.aldStage.onStart(_info);
    }
    Stage_onEnd(_info: any) {
        if (!this.IsExistStage()) {
            console.error('IsExistStage', '不存在！');
            return;
        }
        mini.aldStage.onEnd(_info);
    }
    //------------------------------------------设备信息---------------------------------//
    IsExistGetSystemInfoSync() {
        if (PlatformBase.curPlatform && mini.getSystemInfoSync) {
            return true;
        }
        return false;
    }
    GetSystemInfoSync() {
        return mini.getSystemInfoSync();
    }
    //胶囊按钮
    private menuRect = undefined as any;

    GetMenuButtonRect(_dynamic = false) {
        if (!_dynamic && this.menuRect) {
            return this.menuRect;
        }
        let _menuRect = null;
        let _info = this.GetSystemInfoSync();
        // let _scale = cc.view.getVisibleSize().width / _info.screenWidth;
        let _scale = Laya.stage.width / _info.screenWidth;
        // console.log('GetMenuButtonRect pixelRatio', this.GetSystemInfoSync().pixelRatio, cc.winSize.width);
        let _rect = null as any;
        try {
            if (MiniPlatformE.tt == PlatformBase.curPlatform) {
                _rect = mini.getMenuButtonLayout();
            }
            else {
                _rect = mini.getMenuButtonBoundingClientRect();
            }
        } catch (e) {
            console.error('GetMenuButtonRect获取失败' + e);
        }
        if (_rect) {
            console.log('GetMenuButtonRect _rect', _scale, _rect);
            _menuRect = {
                top: (_info.screenHeight - _rect.top) * _scale,
                bottom: (_info.screenHeight - _rect.bottom) * _scale,
                left: (_rect.left) * _scale,
                right: (_rect.right) * _scale,
                width: _rect.width * _scale,
                height: _rect.height * _scale
            }
        }
        if (!_dynamic) {
            this.menuRect = _dynamic;
        }
        // console.log('GetMenuButtonRect menuRect', this.menuRect);
        return _menuRect;
    }
    IsExistGameClub() {
        if (!mini.createGameClubButton) {
            return false;
        }
        return true;
    }
    CreateGameClubButton(_option: {
        iconType: 'text' | 'image',
        text?: string,
        image?: string,
        icon?: string,
        style: {
            left: number,
            top: number,
            width: number,
            height: number
        }
    }) {
        if (!this.IsExistGameClub()) {
            return null;
        }
        return mini.createGameClubButton({
            type: _option.iconType,
            text: _option.text,
            image: _option.image,
            icon: _option.icon,
            style: _option.style
        })
    }
    /**获取头条的宿主
     * 1 Toutiao -- 今日头条
     *2 tt_lite -- 今日头条极速版
     * 3 Douyin -- 抖音
    * 4 xigua -- 西瓜视频
    * 5 huoshan -- 抖音火山版
     */
    //
    private getTTHost() {
        if (MiniPlatformE.tt != PlatformBase.curPlatform) {
            return null;
        }
        return this.GetSystemInfoSync().appName;
    }
    //---------------------------------------监听小游戏前后台切换---------------------------------//
    //退出游戏
    ExitGame() {
        mini.exitMiniProgram && mini.exitMiniProgram();
        console.log('[Platform_mini]', 'ExitGame');
    }
    OnShow(callback: Function, _enable = true) {
        if (_enable) {
            mini.onShow(callback);
        }
        else {
            mini.offShow(callback);
        }

        console.log('[Platform_mini]', 'OnShow', _enable);
    }
    OnHide(callback: Function, _enable = true) {
        if (_enable) {
            mini.onHide(callback);
        } else {
            mini.offHide(callback);
        }
        console.log('[Platform_mini]', 'OnHide', _enable);
    }
    //---------------------------------------清除旧缓存---------------------------------//
    CleanOldAssets() {
        if (PlatformBase.curPlatform == MiniPlatformE.wx) {
            wxDownloader.cleanOldAssets();
        }
    }
    //------------------------------------------系统弹窗---------------------------------//
    ShowLoading(_data: { title: string, mask?: boolean }) {
        mini.showLoading(_data);
    }
    HideLoading() {
        mini.hideLoading();
    }
    ShowToast(_data: { title: string, icon?: 'success' | 'loading' | 'none', duration?: number }) {
        mini.showToast(_data);
    }
    async ShowModal(_data: { title: string, content: string, confirmText?: string, cancelText?: string }): Promise<boolean> {

        return new Promise(rs => {
            (_data as any).showCancel = !!_data.cancelText;
            (_data as any).success = (res: any) => {
                if (res.confirm) {
                    rs(true)
                } else {
                    rs(false)
                }
            }
            mini.showModal(_data);
        });
    }
    //-----------------------------------------app登录----------------------------------//
    async APPLogin(_isForce = false) {
        if (PlatformBase.curPlatform != MiniPlatformE.tt) {
            return true;
        }
        return new Promise<boolean>((rs) => {
            mini.login({
                force: _isForce,//头条未登录状态下不能主动提示登录否则会被打回
                success(res: any) {
                    console.error('Login-success-res = ' + JSON.stringify(res));
                    rs(res.isLogin);
                },
                fail(res: any) {
                    console.error('Login-fail-res =' + JSON.stringify(res));
                    rs(false);
                }
            });
        })
    }
    //---------------------------------------网络连接-----------------------------------//
    private initListenNet() {
        if (!mini.getNetworkType) {
            console.error('监听网络状态失败！');
            return false;
        }
        mini.getNetworkType({
            success: (_res: any) => {
                console.log('网络变更', _res);
                let _connect = (_res != 'none');
                if (_connect != this.isConnected) {
                    this.isConnected = _connect;
                    this.netChangelistener && this.netChangelistener(this.isConnected)
                }
            }
        })
        mini.onNetworkStatusChange((res: any) => {
            console.log('网络变更监听', res.networkType);
            if (res.isConnected != this.isConnected) {
                this.isConnected = res.isConnected;
                this.netChangelistener && this.netChangelistener(this.isConnected)
            }
        })
        return true;
    }
    private netChangelistener?: (_isConnected: boolean) => void;
    /**
     * 网络变更监听
     */
    OnListenNetChange(_listener: (_isConnected: boolean) => void) {
        this.netChangelistener = _listener;
    }
    private isConnected = true;
    /**
     * 是否有网络连接
     */
    IsNetConnected() {
        return this.isConnected;
    }
    //-----------------------------------------检测更新---------------------------------//
    CheckForUpdate() {
        if (!PlatformBase.curPlatform || !mini.getUpdateManager) {
            // console.log('CheckForUpdate', '不存在');
            return;
        }
        //启动更新机制
        const updateManager = mini.getUpdateManager();
        updateManager.onUpdateReady(async () => {
            let _r = await this.ShowModal({
                title: '版本升级',
                content: '新版本已经准备好，即将切换到新版~'
            });
            updateManager.applyUpdate();
            // if (_r) {
            //     // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            //     updateManager.applyUpdate();
            // }
        });
    }
    //-----------------------------------------启动参数---------------------------------//
    IsExistGetLaunchOptions() {
        if (PlatformBase.curPlatform && mini.getLaunchOptionsSync) {
            return true;
        }
        return false;
    }
    GetLaunchOptions() {
        return mini.getLaunchOptionsSync();
    }
    //----------------------------------------震动-------------------------------------//
    VibrateShort() {
        mini.vibrateShort && mini.vibrateShort({});
    }

    VibrateLong() {
        mini.vibrateLong && mini.vibrateLong();
    }
    //------------------------------------跳转其他小游戏-----------------------------------//
    IsExistNavigateToMiniProgram() {
        if (PlatformBase.curPlatform == MiniPlatformE.wx) {
            return true;
        }
        return false;
    }
    NavigateToMiniProgram(_info: {
        appId: string,
        path?: string,
        extraData?: Object,
        success?: Function,
        fail?: Function,
        complete?: Function,
    }) {
        mini.navigateToMiniProgram(_info);
    }
    //----------------------------------------用户授权-----------------------------------//
    async UserAuthorize(_scope: AuthorizeScope) {
        return new Promise<boolean>((rs) => {
            mini.authorize({
                scope: _scope,
                success() {
                    // 用户同意授权用户信息
                    // _authorize(true);
                    rs(true);
                },
                fail(e: any) {
                    console.error('_authorize 授权失败', e);
                    rs(false);
                }
            });

            // let _authorize = (success) => {
            //     console.log('_authorize', success);
            //     if (success == 'fail') {

            //         return false;
            //     }
            //     if (success) {
            //         rs(true);
            //     }
            //     else {
            //         mini.authorize({
            //             scope: _scope,
            //             success() {
            //                 // 用户同意授权用户信息
            //                 // _authorize(true);
            //             },
            //             fail(e) {
            //                 console.error('_authorize 授权失败', e);

            //             }
            //         });
            //     }
            // }

            // return false;
        })
    }
    //打开权限设置
    async OpenSetting() {
        if (mini.openSetting) {
            return new Promise<boolean>((rs) => {
                mini.openSetting({
                    success() {
                        console.log(`openSetting 打开成功`);
                        rs(true);
                    },
                    fail(res: any) {
                        console.log(`openSetting 失败`);
                        rs(false);
                    }
                });
            })
        }
        return false;
    }
    //获取权限信息
    async GetSetting(_scope: AuthorizeScope) {
        if (mini.openSetting) {
            return new Promise<boolean>((rs) => {
                mini.getSetting({
                    success(res: any) {
                        console.log(`getSetting 调用成功 ${JSON.stringify(res)}`);

                        if (res.authSetting && _scope in res.authSetting) {
                            rs(res.authSetting[_scope]);
                        }
                        else {
                            rs(false);
                        }

                    },
                    fail(res: any) {
                        // _authorize('fail');
                        console.log(`getSetting 调用失败`);
                        rs(false);
                    }
                });
            })
        }
        return false;

    }
    //----------------------------------------预览图片-----------------------------------//
    IsExistPreviewImage() {
        if (PlatformBase.curPlatform && mini.previewImage) {
            return true;
        }
        return false;
    }
    async PreviewImage(_imgPath: string[]) {
        return new Promise<boolean>((re) => {
            mini.previewImage({
                urls: _imgPath,
                success: (res: any) => {
                    re(true);
                },
                fail: (error: any) => {
                    console.error('PreviewImage:' + error);
                    re(false);
                },
            });
        })

    }

    //----------------------------------------创建图片-----------------------------------//
    IsExistCreateImage() {
        if (PlatformBase.curPlatform && mini.createImage) {
            return true;
        }
        return false;
    }
    CreateImage() {
        return mini.createImage();
    }

    //------------------------------------------分享转发--------------------------------------//
    //是否存在分享功能
    IsExistShare() {
        if (typeof (mini) !== 'undefined') {
            return true;
        }
        return false;
    }
    //分享设置
    UpdateShareMenu(_data: {
        withShareTicket: boolean
    }) {
        mini.updateShareMenu(_data);
    }
    //显示和隐藏分享菜单
    ShowShareMenu() {
        mini.showShareMenu()
    }
    HideShareMenu() {
        mini.hideShareMenu()
    }
    //菜单转发信息
    OnShareAppMessage(callFun: () => { title?: string, imageUrl?: string, query?: string }) {
        //自动调用阿拉丁打点分享
        let _fun = mini.aldOnShareAppMessage ? mini.aldOnShareAppMessage : mini.onShareAppMessage;
        _fun(function () {
            let _data = callFun();
            return {
                title: _data.title,
                imageUrl: _data.imageUrl,
                query: _data.query
            }
        });
    }
    //调起分享
    async ShareAppMessage(title?: string, imageUrl?: string, query?: string) {
        // console.log('ShareAppMessage11 query', query);
        return new Promise<boolean>((res) => {
            if (!this.shareTime) {
                this.OnShow(this.listenShareBack.bind(this));
            }
            this.shareTime = Date.now();
            this.shareBackFunc = res;
            //自动调用阿拉丁打点分享
            let _fun = mini.aldShareAppMessage ? mini.aldShareAppMessage : mini.shareAppMessage;
            _fun({
                title: title,
                imageUrl: imageUrl || '',
                query: query || {},
                // success: success,
                // fail: fail,
                // complete: complete
            });
        })
    }
    private shareBackFunc?: (_res: boolean) => void;
    private shareTime = 0;
    private listenShareBack() {
        // console.error('listenShareBack 00');
        // console.error('listenShareBack fuc', this.shareBackFunc);
        if (this.shareBackFunc) {
            // console.error('listenShareBack 11');
            let _dif = Date.now() - this.shareTime;
            let _success = _dif > 2000;
            this.shareBackFunc(_success);
            console.log('listenShareBack time', _dif, _success);
            this.shareBackFunc = undefined;
        }

    }
    //--------------------------------------------开放域-----------------------------------//
    //是否存在开放域功能
    IsExistOpenContext() {
        if (MiniPlatformE.qq == PlatformBase.curPlatform || MiniPlatformE.wx == PlatformBase.curPlatform) {
            return true;
        }
        return false;
    }
    SetUserCloudStorage(_data: { key: string, value: any }[], success?: (args: any) => void, fail?: (args: any) => void) {
        if (!this.IsExistOpenContext()) {
            console.error('[Platform_mini]', 'SetUserCloudStorage', '不存在开放域功能');
            return;
        }
        mini.setUserCloudStorage({
            KVDataList: _data,
            success: success,
            fail: fail
        })
    }
    GetOpenDataContext() {
        if (!this.IsExistOpenContext()) {
            console.error('[Platform_mini]', 'GetOpenDataContext', '不存在开放域功能');
            return null;
        }
        return mini.getOpenDataContext();
    }
    //-----------------------------------------获取广告id---------------------------------//
    GetAdsID(_ad: any) {
        let _get = null
        switch (PlatformBase.curPlatform) {
            case MiniPlatformE.wx:
                if (_ad.wx) {
                    _get = _ad.wx;
                }
                break;
            case MiniPlatformE.qq:
                if (_ad.qq) {
                    _get = _ad.qq;
                }
                break;
            case MiniPlatformE.tt:
                if (_ad.tt) {
                    _get = _ad.tt;
                }
                break;

            default:
                break;
        }
        if (_get == '') {
            _get = null;
        }
        if (!_get) {
            console.log('未找到正确的广告id:', _ad);
        }
        return _get;
    }
    //-----------------------------------------创建广告---------------------------------//
    async CreateADs(_adsID: { banner?: any, video?: any, interstitial?: any }): Promise<void> {
        // console.log('CreateADs');
        let _complete = 3;
        return new Promise(rs => {
            let _completeOne = () => {
                _complete--;
                if (_complete <= 0) {
                    rs();
                }
            }
            (async () => {
                // console.log('CreateADs', 1);

                if (_adsID.banner) {
                    let _id = this.GetAdsID(_adsID.banner);
                    // console.log('CreateADs', 4);
                    _id && await this.CreateBanner(_id);
                }
                _completeOne();
            })();
            (async () => {
                // console.log('CreateADs', 2);
                if (_adsID.video) {
                    let _id = this.GetAdsID(_adsID.video);
                    // console.log('CreateADs', 5);
                    _id && await this.CreateVideoAd(_id);
                }
                _completeOne();
            })();
            (async () => {
                // console.log('CreateADs', 3);
                if (_adsID.interstitial) {
                    let _id = this.GetAdsID(_adsID.interstitial);
                    // console.log('CreateADs', 6);
                    _id && await this.CreateInterstitialAd(_id);
                }
                _completeOne();
            })();
        });


    }
    //--------------------------------------------Banner---------------------------------//
    private bannerAd: any = null;
    private bannerLoaded = false;
    //创建banner
    async CreateBanner(_bannerid: string): Promise<void> {
        if (!mini.createBannerAd || typeof mini.createBannerAd != 'function') {
            console.error('[Platform_mini]', '不支持banner广告');
            return;
        }
        let _sys = this.GetSystemInfoSync();
        let _safeArea = _sys.safeArea;
        let _width: number = MiniPlatformE.tt == PlatformBase.curPlatform ? 208 : _safeArea.width;
        let _height = (_width / 16) * 9 | 0;
        // console.log('_width:' + _width);
        // console.log('_safeArea', _safeArea);
        // console.log('top', _safeArea.bottom + (_width / 16) * 9);
        this.bannerLoaded = false;

        return new Promise(rs => {
            this.bannerAd = mini.createBannerAd({
                adUnitId: _bannerid,
                // adIntervals: 30,
                style: {
                    // left: (_safeArea.width - _width) / 2,
                    // // top: _sys.screenHeight - _height,
                    top: _safeArea.bottom - _height,
                    width: _width,
                }
            })
            console.log('CreateBanner bannerAd', this.bannerAd);

            this.bannerAd.onLoad(() => {
                console.log('banner 广告加载成功');
                this.bannerLoaded = true;
                if (this.isBannerShow) {
                    this.ShowBanner();
                }
                rs && rs();
            })
            this.bannerAd.onError((err: any) => {
                console.error('banner 广告加载失败', err);
                rs && rs();
                try {
                    this.bannerAd.destroy();
                    console.log('加载失败，销毁当前banner');

                } catch (e) {
                    console.error('当前banner销毁失败');
                }
                this.bannerLoaded = false;
                this.bannerAd = null;
                //三秒后重新拉取
                setTimeout(() => {
                    console.log('重新拉取banner');
                    this.CreateBanner(_bannerid);
                }, 3000);

            })
            this.bannerAd.onResize((res: any) => {
                console.log('onResize ' + res.width + res.height);
                // // console.log(_banner.style.realWidth, _banner.style.realHeight)
                // //+1为了留出iphoneX的底部按键
                this.bannerAd.style.top = _safeArea.bottom - res.height;
                this.bannerAd.style.left = (_safeArea.width - res.width) / 2;
            })
        });

    }
    ShowBanner() {
        this.isBannerShow = true;
        console.log('ShowBanner this.bannerAd', this.bannerAd);
        if (!this.bannerAd) {
            console.error('[Platform_mini] bannerAd 不存在', this.bannerAd);
            return;
        }
        if (this.bannerLoaded) {
            try {
                // console.log('ShowBanner this.bannerAd', 2222222222222);
                // console.log('111111111')
                // console.log('[Platform_mini]1', this.bannerAd.show);
                // console.log('[Platform_mini]2', this.bannerAd.show);
                this.bannerAd.show().then(() => {
                    console.log("广告显示成功");
                }).catch((err: any) => {
                    console.error("广告组件出现问题", err);
                });

            } catch (e) {
                console.error('ShowBanner', e);
            }
        }


        // this.bannerAd.show();

    }
    HideBanner() {
        this.isBannerShow = false;
        if (!this.bannerAd) {
            return;
        }
        console.log('[Platform_mini]', 'HideBanner');
        this.bannerAd.hide();

    }
    //--------------------------------------------插屏广告---------------------------------//
    private interstitialAd: any = null;
    async CreateInterstitialAd(_interstitialid: string): Promise<void> {
        // console.error('CreateInterstitialAd', _interstitialid);
        if (!mini.createInterstitialAd || typeof mini.createInterstitialAd != 'function') {
            console.error('[Platform_mini] 不支持插屏广告');
            return;
        }
        // console.log('宿主:', this.getTTHost());
        //字节跳动只是抖音平台可以使用插屏
        if (MiniPlatformE.tt == PlatformBase.curPlatform && 'Douyin' != this.getTTHost()) {
            console.error('[Platform_mini] 仅抖音平台支持插屏广告', this.getTTHost());
            return;
        }
        this.isInterstitialAdLoaded = false;
        return new Promise(rs => {
            this.interstitialAd = mini.createInterstitialAd({
                adUnitId: _interstitialid
            });
            console.log('[Platform_mini] interstitialAd', this.interstitialAd);
            this.interstitialAd.load().then(() => {
                // console.log('load 成功');
                rs && rs();
                // this.interstitialAd.show();
            }).catch((err: any) => {
                rs && rs();
                // console.error('load 失败 ' + err);
            });;
            this.interstitialAd.onLoad(() => {
                this.isInterstitialAdLoaded = true;
                rs && rs();
                console.log('插屏 广告加载成功');
            })
            this.interstitialAd.onError((err: any) => {
                this.isInterstitialAdLoaded = false;
                console.error('插屏 广告加载失败', err);
            })
            this.interstitialAd.onClose((res: any) => {
                let result: PlatformAdsResult = {
                    isOpened: true,
                    isEnd: true
                }
                this.interstitialCallBack && this.interstitialCallBack(result);
                console.log('插屏 广告关闭')
            })
        });

    }
    private isInterstitialShow = false;
    private interstitialCallBack?: (_result: PlatformAdsResult) => void;
    async ShowInterstitialAd(): Promise<PlatformAdsResult> {
        let result: PlatformAdsResult = {
            isOpened: false,
            isEnd: false
        }
        console.log('ShowInterstitialAd this.interstitialAd', this.interstitialAd);
        if (!this.interstitialAd) {
            // console.log('[Platform_mini] interstitialAd 不存在', this.interstitialAd);
            console.error('[Platform_mini] interstitialAd 不存在', this.interstitialAd);
            return result;
        }
        let _show = () => {
            if (!this.isInterstitialShow) {
                return;
            }
            console.log('[Platform_mini]  show()');
            this.interstitialAd.show().catch((err: any) => {
                // console.log('[Platform_mini]  err', err);
                this.interstitialCallBack && this.interstitialCallBack(result);
                setTimeout(() => {
                    this.interstitialAd.load();
                }, 1000);
            })
            // console.log('[Platform_mini]  show()2222222222');
        }
        this.isInterstitialShow = true;
        console.log('[Platform_mini]  ShowInterstitialAd');
        if (!this.isInterstitialAdLoaded) {
            // console.log('[Platform_mini]  load()');
            await this.interstitialAd.load().then(() => {
                // console.log('[interstitialAd.load]  加载成功');
                _show();
            }).catch((err: any) => {
                // console.error('[interstitialAd.load] err', err);
                this.interstitialCallBack && this.interstitialCallBack(result);
            });
        }
        else {
            _show();
        }
        return new Promise((rs) => {
            this.interstitialCallBack = rs;
        })
    }
    HideInterstitialAd() {
        this.isInterstitialShow = false;
    }
    //--------------------------------------------视频广告---------------------------------//
    private videoAd: any = null;
    async CreateVideoAd(_videoid: string): Promise<void> {
        if (!mini.createRewardedVideoAd || typeof mini.createRewardedVideoAd != 'function') {
            console.error('[Platform_mini] 不支持视频广告');
            return;
        }
        // TimeMonitor.start('VideoAd');
        console.log('[Platform_mini] CreateVideoAd', _videoid);
        return new Promise(rs => {
            this.videoAd = mini.createRewardedVideoAd({ adUnitId: _videoid })
            this.videoAd.onLoad(() => {
                this.isVideoAdLoaded = true;
                console.log('激励视频 广告加载成功');
                // TimeMonitor.dot('VideoAd', '加载完成');
                rs && rs();
            })
            this.videoAd.onError((err: any) => {
                this.isVideoAdLoaded = false;
                console.error('_video 广告加载失败', err);
                rs && rs();
            })
            this.videoAd.onClose((res: any) => {
                let isEnd = true;
                //防止低版本没有 isEnded 参数
                if (!res || !res.isEnded) {
                    isEnd = res.isEnded;
                }
                let result: PlatformAdsResult = {
                    isOpened: true,
                    isEnd: isEnd
                }
                this.videoCallBack && this.videoCallBack(result);
            });
        })

    }
    private videoCallBack?: (_result: PlatformAdsResult) => void;
    async ShowVideoAd(): Promise<PlatformAdsResult> {
        let result: PlatformAdsResult = {
            isOpened: false,
            isEnd: false
        }
        console.log('ShowVideoAd this.videoAd', this.videoAd);
        if (!this.videoAd) {
            return result;
        }
        console.log('[Platform_mini] ShowVideoAd');
        if (!this.isVideoAdLoaded) {
            await this.videoAd.load();
        }
        this.videoAd.show().catch((err: any) => {
            this.videoCallBack && this.videoCallBack(result);
            setTimeout(() => {
                this.videoAd.load();
            }, 1000);
        })
        return new Promise((rs) => {
            this.videoCallBack = rs;
        })

    }
    //--------------------------------------------获取广告加载状态---------------------------------//
    //获取插屏广告信息是否加载
    getInterstitialAdState(): boolean {
        return this.isInterstitialAdLoaded;
    }
    //获取视频广告信息是否加载
    getVideoAdState(): boolean {
        return this.isVideoAdLoaded;
    }

    //--------------------------------------------录屏-----------------------------------------//
    //是否存在录屏功能
    IsExistRecoder() {
        if (MiniPlatformE.tt == PlatformBase.curPlatform) {
            if (mini.getGameRecorderManager) {
                return true;
            }
        }
        return false;
    }
    private gameRecorder = null as any;
    private recording = false;
    private videoPath = null as any;
    private videoCliped = false;
    private videoShared = false;
    private recodeTime: { start: number, end: number } = { start: 0, end: 0 };
    private recordListener?: (_state: string, _timeEnough?: boolean) => void;
    //初始化录屏
    private initRecoder() {
        this.videoShared = false;
        this.recording = false;
        this.gameRecorder = mini.getGameRecorderManager();
        this.gameRecorder.onStart(() => {
            this.recording = true;
            this.recordListener && this.recordListener('start');
            console.log('--录屏开始--');
            this.recodeTime.end = this.recodeTime.start = Date.now();
        })
        this.gameRecorder.onStop((res: any) => {
            console.log("--录屏结束--", res);
            this.recodeTime.end = Date.now();
            this.recording = false;
            let _timeEnough = this.recodeTime.end - this.recodeTime.start > 4000
            console.log("录屏时间:", (this.recodeTime.end - this.recodeTime.start) / 1000);
            if (_timeEnough) {
                this.videoPath = res.videoPath;
                this.videoShared = false;
                // 剪辑视频(录屏结束不进行视频剪辑，视频路径可能会被下次录屏覆盖)
                this.videoCliped = false;
                this.clipVideo();
            }
            else {
                console.error('录屏结束-时间不足')
            }
            this.recordListener && this.recordListener('end', _timeEnough);
            this.RecoderEndCallBack && this.RecoderEndCallBack(_timeEnough);
        })
        this.gameRecorder.onError(async (err: any) => {
            this.recording = false;
            console.error('录屏失败', err)
            if (!await this.GetSetting('scope.screenRecord')) {
                let _r = await this.ShowModal({ title: '权限请求', content: '请设置允许录屏', confirmText: '去设置', cancelText: '拒绝' });
                if (_r) {
                    await this.OpenSetting();
                    setTimeout(() => {
                        this.RecoderStart();
                    }, 500);
                }
            }
            // WeappUtil.alert('录屏失败')
        })
        this.gameRecorder.onInterruptionBegin((err: any) => {
            this.recording = false;
            console.error('录屏中断', err)
            // WeappUtil.alert('录屏中断')
        })
    }
    //剪辑视频
    private clipVideo() {
        if (this.videoCliped || !this.videoPath) {
            return;
        }
        let _self = this;
        const timeRange = [300, 300];
        this.gameRecorder.clipVideo({
            path: this.videoPath,
            timeRange: timeRange,
            success(res: any) {
                console.log('视频剪辑成功');
                _self.videoPath = res.videoPath;
                _self.videoCliped = true;
                // _self.ShareRecoder();
            },
            fail(e: any) {
                console.error('视频剪辑失败', e);
            },
        });
    }
    /**
     * 开始录屏
     */
    RecoderStart() {
        if (this.recording) {
            return;
        }
        console.log('主动开始录屏');
        this.gameRecorder.start({
            duration: 300
            // microphoneEnabled: true
        });
    }
    private RecoderEndCallBack?: (_timeEnough: boolean) => void
    /**
     * 结束录屏
     */
    async RecoderEnd(_shareIt = false) {
        console.log('主动结束录屏');
        if (!this.InRecording()) {
            return false;
        }
        console.log('主动结束录屏111');
        this.gameRecorder.stop();
        console.log('主动结束录屏2222');
        return new Promise<boolean>((rs) => {
            this.RecoderEndCallBack = rs;
            console.log('主动结束录屏3333');
        })
    }
    /**
     * 分享录屏
     */
    async ShareRecoder(_shareConfig = ShareConfig.Video.normal): Promise<boolean> {
        if (!this.gameRecorder || !this.videoPath || !mini.shareAppMessage) {
            return false;
        }
        if (!_shareConfig) {
            console.error('[ShareRecoder]:_shareConfig不能为空！');
            return false;
        }
        return new Promise(rs => {
            mini.shareAppMessage({
                channel: 'video',
                title: _shareConfig.topics[0],
                desc: _shareConfig.title,
                // query: `from=videoShare&fromUid=${Global.hhgame.currentUser!._id}&openid=${Global.hhgame.currentUser!.platform.ttappOpenid}`,
                query: _shareConfig.query,
                extra: {
                    videoPath: this.videoPath,
                    videoTopics: _shareConfig.topics,
                    hashtag_list: _shareConfig.topics,
                    video_title: _shareConfig.title,
                    createChallenge: true,
                    // rankData: {
                    //     key: 'rank_v1',
                    //     score: (level.chapter * 15 + level.level + 1) || 1,
                    //     updateTime: ~~(Date.now() / 1e3)
                    // }
                },
                success: async () => {
                    console.log(`分享录屏成功！`);
                    this.videoShared = true;
                    rs(true);
                },
                fail(e: any) {
                    console.error(`分享录屏失败！`, e);
                    rs(false);
                },
                // complete(res: any) {
                //     console.log("1分享结束", res);
                // }
            });
        })
    }
    /**
     * 监听录屏结束
     * @param _listen 
     */
    ListenRecorder(_listen: (_state: string, _timeEnough?: boolean) => void) {
        this.recordListener = _listen;
    }
    UnListenRecorder() {
        this.recordListener = undefined;
    }
    /**
     * 此视频是否分享过
     */
    IsRecoderShared() {
        return this.videoShared;
    }
    /**
     * 是否正在录制视频
     */
    InRecording() {
        return this.recording
    }
    /**
     * 是否有可分享的录屏
     */
    HaveRecoderVideo() {
        return !!this.videoPath;
    }


}

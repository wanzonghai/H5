
import PlatformBase, { AuthorizeScope, PlatformAdsResult } from "../PlatformBase";
// import TimeMonitor from "../../Debug/TimeMonitor";
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
    protected async init() {
        //把脚本加入html头中
        if (this.isInitComplete) {
            return;
        }
        this.initListenNet();
    }

    //延时初始化内容（游戏加载完成后才开始执行此中内容）
    protected async delayInit() {
        // if (this.IsExistRecoder()) {
        //     //初始化录屏接口
        //     this.initRecoder();
        // }
        super.delayInit();
    }
    //------------------------------------------打点事件---------------------------------//
    SubmitAction(action: string, data: object = {}) {
    }

    //进度打点事件
    IsExistStage() {
        return false;
    }
    Stage_onStart(_info: any) {
    }
    Stage_onEnd(_info: any) {
    }
    //------------------------------------------设备信息---------------------------------//
    IsExistGetSystemInfoSync() {
        return false;
    }
    GetSystemInfoSync() {
        return mini.getSystemInfoSync();
    }

    IsExistGameClub() {
        return false;
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
        return null;
    }
    //---------------------------------------监听小游戏前后台切换---------------------------------//
    //退出游戏
    ExitGame() {
    }
    OnShow(callback: Function, _enable = true) {
    }
    OnHide(callback: Function, _enable = true) {
    }
    //---------------------------------------清除旧缓存---------------------------------//
    CleanOldAssets() {
    }
    //------------------------------------------系统弹窗---------------------------------//
    ShowLoading(_data: { title: string, mask?: boolean }) {
    }
    HideLoading() {
    }
    ShowToast(_data: { title: string, icon?: 'success' | 'loading' | 'none', duration?: number }) {
    }
    async ShowModal(_data: { title: string, content: string, confirmText?: string, cancelText?: string }): Promise<boolean> {
        return true;
    }
    //-----------------------------------------app登录----------------------------------//
    async APPLogin(_isForce = false) {
        return false;
    }
    //---------------------------------------网络连接-----------------------------------//
    private initListenNet() {
        return false;
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
        return;
    }
    //-----------------------------------------启动参数---------------------------------//
    IsExistGetLaunchOptions() {
        return false;
    }
    //----------------------------------------震动-------------------------------------//
    VibrateShort() {
    }

    VibrateLong() {
    }
    //------------------------------------跳转其他小游戏-----------------------------------//
    IsExistNavigateToMiniProgram() {
        return false;
    }
    //----------------------------------------用户授权-----------------------------------//
    async UserAuthorize(_scope: AuthorizeScope) {
        return false
    }
    //打开权限设置
    async OpenSetting() {
        return false;
    }
    //获取权限信息
    async GetSetting(_scope: AuthorizeScope) {
        return false;

    }
    //----------------------------------------预览图片-----------------------------------//
    IsExistPreviewImage() {
        return false;
    }
    async PreviewImage(_imgPath: string[]) {
        return false

    }

    //----------------------------------------创建图片-----------------------------------//
    IsExistCreateImage() {
        return false;
    }
    CreateImage() {
        return null;
    }

    //------------------------------------------分享转发--------------------------------------//
    //是否存在分享功能
    IsExistShare() {
        return false;
    }
    //--------------------------------------------开放域-----------------------------------//
    //是否存在开放域功能
    IsExistOpenContext() {
        return false;
    }
    SetUserCloudStorage(_data: { key: string, value: any }[], success?: (args: any) => void, fail?: (args: any) => void) {
    }
    GetOpenDataContext() {
        return null;
    }
    //-----------------------------------------获取广告id---------------------------------//
    GetAdsID(_ad: any) {
        let _get = null
        // switch (PlatformBase.curPlatform) {
        //     case MiniPlatformE.wx:
        //         if (_ad.wx) {
        //             _get = _ad.wx;
        //         }
        //         break;
        //     case MiniPlatformE.qq:
        //         if (_ad.qq) {
        //             _get = _ad.qq;
        //         }
        //         break;
        //     case MiniPlatformE.tt:
        //         if (_ad.tt) {
        //             _get = _ad.tt;
        //         }
        //         break;

        //     default:
        //         break;
        // }
        // if (_get == '') {
        //     _get = null;
        // }
        // if (!_get) {
        //     console.log('未找到正确的广告id:', _ad);
        // }
        return _get;
    }
    //-----------------------------------------创建广告---------------------------------//
    async CreateADs(_adsID: { banner?: any, video?: any, interstitial?: any }): Promise<void> {

    }
    //--------------------------------------------Banner---------------------------------//
    private bannerAd: any = null;
    private bannerLoaded = false;
    //创建banner
    async CreateBanner(_bannerid: string): Promise<void> {

    }
    ShowBanner() {
        this.isBannerShow = true;
    }
    HideBanner() {
        this.isBannerShow = false;

    }
    //--------------------------------------------插屏广告---------------------------------//
    private interstitialAd: any = null;
    async CreateInterstitialAd(_interstitialid: string): Promise<void> {

    }
    private isInterstitialShow = false;
    private interstitialCallBack?: (_result: PlatformAdsResult) => void;
    async ShowInterstitialAd(): Promise<PlatformAdsResult> {
        let result: PlatformAdsResult = {
            isOpened: false,
            isEnd: false
        }
        return result;
    }
    HideInterstitialAd() {
        this.isInterstitialShow = false;
    }
    //--------------------------------------------视频广告---------------------------------//
    private videoAd: any = null;
    async CreateVideoAd(_videoid: string): Promise<void> {
        return;

    }
    private videoCallBack?: (_result: PlatformAdsResult) => void;
    async ShowVideoAd(): Promise<PlatformAdsResult> {
        let result: PlatformAdsResult = {
            isOpened: false,
            isEnd: false
        }
        return result;
        // console.log('ShowVideoAd this.videoAd', this.videoAd);
        // if (!this.videoAd) {
        //     return result;
        // }
        // console.log('[Platform_mini] ShowVideoAd');
        // if (!this.isVideoAdLoaded) {
        //     await this.videoAd.load();
        // }
        // this.videoAd.show().catch((err: any) => {
        //     this.videoCallBack && this.videoCallBack(result);
        //     setTimeout(() => {
        //         this.videoAd.load();
        //     }, 1000);
        // })
        // return new Promise((rs) => {
        //     this.videoCallBack = rs;
        // })

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
        return false;
    }


}

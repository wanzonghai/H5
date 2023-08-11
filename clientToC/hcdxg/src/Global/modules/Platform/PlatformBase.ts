/**
 * 平台区分方法
 * 基类：只做功能声明，供子类实现
 * 
 */
//广告返回结果
export interface PlatformAdsResult {
    isOpened: boolean,
    isEnd: boolean
}
//授权列表
export type AuthorizeScope =
    'scope.userInfo' | 'scope.userLocation' | 'scope.address' | 'scope.record' |
    'scope.album' | 'scope.camera' | 'scope.screenRecord';
export default class PlatformBase {
    protected isBannerLoaded = false;
    protected isInterstitialAdLoaded = false;
    protected isVideoAdLoaded = false;
    protected isInitComplete = false;
    protected isBannerShow = false;
    protected isGameloadCompleted = false;

    static curPlatform: any = undefined;

    constructor() {
        this.isInitComplete = false;
        this.isGameloadCompleted = false;
    }
    //延时初始化内容（游戏加载完成后才开始执行此中内容）
    protected async delayInit() {
        this.isInitComplete = true;
    }
    //--------------------------------------游戏数据加载完成-------------------------------//
    //游戏初始化完成调用此方法
    async SetGameloadCompleted() {
        console.log('游戏数据加载完成');
        this.isGameloadCompleted = true;
        await this.delayInit();
    }
    //设置加载进度
    setLoadingProgress(_pro: number) {
        console.log('[PlatformBase]', 'loading', _pro);
    }
    //------------------------------------------存储和读取---------------------------------//
    //清除存储
    // LocalStorageClear() {
    //     console.log('[PlatformBase]', 'StorageClear');

    //     localStorage.clear()
    // }
    //删除键
    LocalStorageRemoveItem(_str: string) {
        console.log('[PlatformBase]', 'StorageRemoveItem');
        Laya.LocalStorage.removeItem(_str)
    }
    //读取key
    LocalStorageGetItem(_str: string) {
        console.log('[PlatformBase]', 'StorageGetItem', _str);
        let userData = Laya.LocalStorage.getItem(_str) as any
        if (userData) {
            userData = JSON.parse(userData);
        }
        return userData;
    }
    //存储key
    LocalStorageSetItem(_str: string, _data: any) {
        console.log('[PlatformBase]', 'StorageSetItem', _str);
        Laya.LocalStorage.setItem(_str, JSON.stringify(_data));
    }


    //------------------------------------------打点事件---------------------------------//
    SubmitAction(action: string, data: object = {}) {
        console.log('[PlatformBase]', 'SubmitAction', action);
    }
    //进度打点事件
    IsExistStage() {
        console.log('[PlatformBase]', 'IsExistStage');
        return false;
    }
    Stage_onStart(_info: any) {
        console.log('[PlatformBase]', 'Stage_onStart');
    }
    Stage_onEnd(_info: any) {
        console.log('[PlatformBase]', 'Stage_onEnd');
    }
    //------------------------------------------设备信息---------------------------------//
    IsExistGetSystemInfoSync() {
        console.log('[PlatformBase]', 'IsExistGetSystemInfoSync');
        return false;
    }
    GetSystemInfoSync() {
        console.log('[PlatformBase]', 'GetSystemInfoSync');
        return undefined as any;
    }
    /**
     * 获取菜单按钮位置
     * @param _dynamic 是否重新获取
     */
    GetMenuButtonRect(_dynamic = false) {
        return undefined as {
            top: number,
            bottom: number,
            left: number,
            right: number,
            width: number,
            height: number
        } | undefined;
    }
    /**
     * 是否有游戏圈功能
     */
    IsExistGameClub() {
        return false;
    }
    /**
     * 创建游戏圈按钮
     * @param _option 
     */
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
        console.log('[PlatformBase]', 'ExitGame');
    }
    OnShow(callback: Function, _enable = false) {
        console.log('[PlatformBase]', 'OnShow');
    }
    OnHide(callback: Function, _enable = false) {
        console.log('[PlatformBase]', 'OnHide');
    }
    //---------------------------------------清除旧缓存---------------------------------//
    CleanOldAssets() {
        console.log('[PlatformBase]', 'CleanOldAssets');
    }
    //------------------------------------------系统弹窗---------------------------------//
    ShowLoading(_data: { title: string, mask?: boolean }) {
        console.log('[PlatformBase]', 'ShowLoading', _data);
    }
    HideLoading() {
        console.log('[PlatformBase]', 'HideLoading');
    }
    /**
     * 最多显示 7 个汉字长度
     * @param _data 
     */
    ShowToast(_data: { title: string, icon?: 'success' | 'loading' | 'none', duration?: number }) {
        console.log('[PlatformBase]', 'ShowToast', _data);
        return alert(_data.title);
    }
    async ShowModal(_data: { title: string, content: string, confirmText?: string, cancelText?: string }) {
        console.log('[PlatformBase]', 'ShowConfirm', _data);
        return confirm(`${_data.title}\n${_data.content}`)
        // true;
    }
    //-----------------------------------------app登录----------------------------------//
    async APPLogin(_isForce = true) {
        console.log('[PlatformBase]', 'APPLogin', _isForce);
        return true;
    }
    //---------------------------------------网络连接-----------------------------------//
    /**
     * 网络变更监听
     */
    OnListenNetChange(_listener: (_isConnected: boolean) => void) {
        console.log('[PlatformBase]', 'OnListenNetChange');
    }
    /**
     * 是否有网络连接
     */
    IsNetConnected() {
        console.log('[PlatformBase]', 'IsNetConnected');
        return true;
    }
    //-----------------------------------------检测更新---------------------------------//
    CheckForUpdate() {
        console.log('[PlatformBase]', 'OnCheckForUpdate');
    }
    //-----------------------------------------启动参数---------------------------------//
    IsExistGetLaunchOptions() {
        console.log('[PlatformBase]', 'IsExistGetLaunchOptions');
        return false;
    }
    GetLaunchOptions() {
        console.log('[PlatformBase]', 'GetLaunchOptions');
        return undefined as any;
    }
    //----------------------------------------震动-------------------------------------//
    VibrateShort() {
        console.log('[PlatformBase]', 'VibrateShort');
    }

    VibrateLong() {
        console.log('[PlatformBase]', 'VibrateLong');
    }
    //------------------------------------跳转其他小游戏-----------------------------------//
    //此方法是否存在
    IsExistNavigateToMiniProgram() {
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
        console.log('[PlatformBase]', 'VibrateLong');
    }
    //----------------------------------------用户授权-----------------------------------//
    async UserAuthorize(_scope: AuthorizeScope) {
        console.log('[PlatformBase]', 'UserAuthorize');
        return true;
    }
    //打开权限设置
    OpenSetting() {
        console.log('[PlatformBase]', 'OpenSetting');
    }
    //获取权限信息
    async GetSetting(_scope: AuthorizeScope) {
        console.log('[PlatformBase]', 'GetSetting');
        return false;
    }
    //----------------------------------------预览图片-----------------------------------//
    IsExistPreviewImage() {
        return false;
    }
    async PreviewImage(urls: string[]) {
        console.log('[PlatformBase]', 'PreviewImage');
        return false;
    }
    //----------------------------------------创建图片-----------------------------------//
    IsExistCreateImage() {
        return false;
    }
    CreateImage() {
        console.log('[PlatformBase]', 'CreateImage');
    }
    //------------------------------------------分享转发--------------------------------------//
    //是否存在分享功能
    IsExistShare() {
        return false;
    }
    //分享设置
    UpdateShareMenu(_data: {
        withShareTicket: boolean
    }) {
        console.log('[PlatformBase]', 'UpdateShareMenu');
    }
    //显示和隐藏分享菜单
    ShowShareMenu() {
        console.log('[PlatformBase]', 'ShowShareMenu');
    }
    HideShareMenu() {
        console.log('[PlatformBase]', 'HideShareMenu');
    }
    //菜单转发信息
    OnShareAppMessage(callFun: () => { title?: string, imageUrl?: string, query?: string }) {
        console.log('[PlatformBase]', 'onShareAppMessage');
    }
    //调起分享
    async ShareAppMessage(title?: string, imageUrl?: string, query?: string) {
        console.log('[PlatformBase]', 'ShareAppMessage');
        return true;
    }
    //--------------------------------------------开放域-----------------------------------//
    //是否存在开放域功能
    IsExistOpenContext() {
        console.log('[PlatformBase]', 'IsExistOpenContext');
        return false;
    }
    SetUserCloudStorage(_data: { key: string, value: any }[], success?: (args: any) => void, fail?: (args: any) => void) {
        console.error('[PlatformBase]', 'SetUserCloudStorage', '不存在开放域功能');
    }
    GetOpenDataContext() {
        console.error('[PlatformBase]', 'GetOpenDataContext', '不存在开放域功能');
        return null as any;
    }
    //-----------------------------------------获取广告id---------------------------------//
    GetAdsID(_ads: any) {
        // console.log('[PlatformBase]', 'GetAdsID');  
        return null;
    }
    //-----------------------------------------创建广告---------------------------------//
    async CreateADs(_adsID: { banner?: any, video?: any, interstitial?: any }) {
        console.log('[PlatformBase]', 'CreateADs');
    }
    //--------------------------------------------Banner---------------------------------//
    //创建banner
    async CreateBanner(_bannerid: string) {
        console.log('[PlatformBase]', 'CreateBanner');
    }
    ShowBanner() {
        this.isBannerShow = true;
        console.log('[PlatformBase]', 'ShowBanner');
    }
    HideBanner() {
        this.isBannerShow = false;
        console.log('[PlatformBase]', 'HideBanner');
    }
    //--------------------------------------------插屏广告---------------------------------//
    async CreateInterstitialAd(_interstitialid: string) {
        console.log('[PlatformBase]', 'CreateScreen');
    }
    async ShowInterstitialAd(): Promise<PlatformAdsResult> {
        let result: PlatformAdsResult = {
            isOpened: false,
            isEnd: false
        }
        console.log('[PlatformBase]', 'ShowScreen');
        return result;
    }
    HideInterstitialAd() {
        console.log('[PlatformBase]', 'HideScreen');
    }
    //--------------------------------------------视频广告---------------------------------//
    async CreateVideoAd(_videoid: string) {
        console.log('[PlatformBase]', 'CreateVideoAd');
    }
    async ShowVideoAd(): Promise<PlatformAdsResult> {
        let result: PlatformAdsResult = {
            isOpened: true,
            isEnd: true
        }
        console.log('[PlatformBase]', 'ShowVideoAd');
        return result;
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
    /**
     * 开始录屏
     */
    RecoderStart() {
    }
    /**
     * 结束录屏
     */
    async RecoderEnd(_shareIt = false) {
        return false;
    }
    /**
     * 分享录屏
     */
    async ShareRecoder(): Promise<boolean> {
        return false;
    }
    /**
     * 监听录屏结束
     * @param _listen 
     */
    ListenRecorder(_listen: (_state: string, _timeEnough?: boolean) => void) { }
    UnListenRecorder() { }
    /**
     * 此视频是否分享过
     */
    IsRecoderShared() {
        return true;
    }
    /**
     * 是否正在录制视频
     */
    InRecording() {
        return false;
    }
    /**
     * 是否有可分享的录屏
     */
    HaveRecoderVideo() {
        return false;
    }
}

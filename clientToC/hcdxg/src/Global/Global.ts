

// import HHGame from '../../node_modules/xaldgame/index';
import GetCDNData from './modules/CDN/GetCDNData';
import { DataManager } from './modules/Data/DataManager';
import FGUIUtil from './modules/FGUI/FGUIUtil';
import { Platform, PlatformDiff } from './modules/Platform/Platform';
import { ShareConfig, ShareImageType, ShareBathPath } from './ShareConfig';
/**
 * 全局方法
 */
export default class MyGlobal {
    static IsDataInit = false;
    private static isInit = false;
    static hhgame: any = null as any;
    /**
     * 初始化信息
     * 启动游戏调用
     */
    static Init(_enable: {
        checkUpdate?: boolean,
        // hhgame?: boolean,
        statistic?: boolean,
        dataManager?: boolean,
        cdnData?: boolean,
        openFGUI?: boolean,
        loadRetryTime?: number,
    }) {
        if (this.isInit) {
            return;
        }
        //启动平台区分
        PlatformDiff.INS().getPlatForm();
        PlatformDiff.INS().CreateAdsByPlatForm();
        //检查更新
        _enable.checkUpdate && Platform.CheckForUpdate();
        //初始化hhgame
        // _enable.hhgame && this.InitHHgame();
        //初始化打点统计
        // _enable.statistic && Statistic.Init();
        //初始化数据
        _enable.dataManager && DataManager.Init();
        //初始化cdn配置信息
        _enable.cdnData && GetCDNData.Init();
        _enable.openFGUI && FGUIUtil.Init();
        //加载器加载重试次数
        if (_enable.loadRetryTime) {
            Laya.loader.retryNum = _enable.loadRetryTime;
        }
        this.isInit = true;
    }
    /**
     * 初始化hhgame
     */
    static InitHHgame() {
        // this.hhgame = new HHGame(Config.hhConfig.appid, {
        //     serverUrl: Config.hhConfig.url,
        //     onNeedLogin: (request: any) => {
        //         console.log('onNeedLogin', request);

        //         // Platform.ShowToast({
        //         //     title: '自动登录中',
        //         //     icon: 'none',
        //         //     duration: 2000
        //         // })
        //         Platform.LocalStorageRemoveItem('__HHGAME_COOKIE');
        //         Platform.LocalStorageRemoveItem('__HHGAME_CURRENT_USER');
        //         Global.hhgame.currentUser = null;
        //     }
        // });
        // console.error('this.hhgame', this.hhgame);

        // this.hhgame = new HHGame(Config.hhConfig.appid, {
        //     // enableInviteGift: true,
        //     onNeedLogin: () => {
        //     }, serverUrl: Config.hhConfig.url
        // });
    }
    //----------------------------------登录------------------------------------------//
    /**
     * 是否已登录
     */
    static IsLogin() {
        return false;
        // return Global.hhgame && !!Global.hhgame.currentUser;
    }
    /**
     * 登录
     */
    static async Login() {
        let _r = false;
        // if (Global.hhgame.currentUser) {
        //     _r = true
        // }
        // else {
        //     if (!await Platform.APPLogin()) {
        //         return false;
        //     }
        //     while (!Global.hhgame.currentUser) {
        //         // 微信登录
        //         if (Global.hhgame.minigame) {
        //             _r = await this.miniGameLogin();
        //         }
        //         // 浏览器登录
        //         else {
        //             await Global.hhgame.user.login({
        //                 type: 'test',
        //                 testName: 'test_11'
        //             }).catch(e => {
        //                 console.error('浏览器登录失败', e)
        //             });
        //             // console.error('LoginLogin', Global.hhgame);
        //         }
        //         // 登录失败
        //         if (!Global.hhgame.currentUser) {
        //             if (!await (Platform.ShowModal({
        //                 title: "登录失败", content: "登录失败,请检查网络连接",
        //                 confirmText: '重试', cancelText: '不联网'
        //             }))) {
        //                 // Platform.ExitGame();
        //                 return _r;
        //             }
        //         }
        //         // else { }
        //     }
        // }
        // // if (_r) {
        // //     Statistic.LoginSuccess();
        // // }
        return _r;
    }
    private static async miniGameLogin(retry = 3): Promise<boolean> {
        // if (!Global.hhgame.minigame) {
        //     throw new Error('Must be minigame');
        // }
        // // let promiseRs: Function | undefined;
        // // let promise = new Promise<boolean>((rs, rj) => {
        // //     promiseRs = rs;
        // // })
        // // 已经登录成功
        // if (Global.hhgame.currentUser) {
        //     return true;
        // }

        // let _result = false;
        // while (!Global.hhgame.currentUser && retry > 0) {
        //     retry--;
        //     await Global.hhgame.minigame.autoLogin().then(() => {
        //         _result = true;
        //     }).catch(async e => {
        //         console.error('登录失败', e)
        //     });
        //     if (!_result) {
        //         await TimeUtil.wait(0.3);
        //     }
        //     // 等待1秒再试
        // }
        // return _result;
        return false;
    }
    //-----------------------------自定义分享--------------------------------------//
    static ShowShareMenu(_callFun?: (_data: { title?: string, imageUrl?: string, query?: string }) => void) {
        Platform.ShowShareMenu();
        Platform.OnShareAppMessage(() => {
            let _info = this.getShareInfo('normal');
            let _data = { title: _info.title, imageUrl: ShareBathPath + _info.image, query: this.getQueryInfo(_info.image) }
            _callFun && _callFun(_data);
            // Statistic.ShareImage(0, _info.image);
            return _data;
        })
    }
    static async ShareImage(_key: ShareImageType) {
        let _info = this.getShareInfo(_key);

        let _r = await Platform.ShareAppMessage(_info.title, ShareBathPath + _info.image, this.getQueryInfo(_info.image));
        // Statistic.ShareImage(this.getShareType(_key), _info.image, _r);
        return _r;
    }
    static async ShareVideo(_key: ShareImageType) {
        let _r = await Platform.ShareRecoder();
        // Statistic.ShareImage(this.getShareType(_key), 'video', _r);
        return _r;
    }
    private static getShareType(_key: ShareImageType) {
        let _type = 0;
        // switch (_key) {
        //     case 'flaunt':
        //         _type = 1;
        //         break;
        //     case 'normal':
        //         _type = 2;
        //         break;
        //     case 'help':
        //         _type = 3;
        //         break;
        //     case 'prophelp':
        //         _type = 4;
        //         break;
        //     case 'unlockhelp':
        //         _type = 5;
        //         break;
        //     default:
        //         break;
        // }
        return _type;
    }
    private static getShareInfo(_key: ShareImageType) {
        let _info = ShareConfig.Image[_key];
        let _idx = 0;
        if (_info.length > 1) {


            _idx = (Math.random() * _info.length) | 0
            console.log('getShareInfo _idx', _idx, _info.length);
        }
        // if (_key == 'help') {
        //     _titles.push(`我在第${DataManager.Get('curLevel') + 1}关过不去了，快来救救我！`)
        // }
        // let _imgidx = (Math.random() * testShareImage.length) | 0
        return {
            title: _info[_idx].title,
            image: _info[_idx].image//testShareImage[_imgidx]
        }
    }
    private static getQueryInfo(_cardId: string) {
        let _shareCardIDStr = 'cardid=' + _cardId;
        // let _uid = Global.hhgame.currentUser ? Global.hhgame.currentUser._id : 'unknow';
        let _uid = 'unknow';
        let _qid = '&fromUid=' + _uid;
        return _shareCardIDStr + _qid;
    }

    //----------------------------监听启动参数-------------------------------------//
    static ListenBootstrap(_callBack: (res: {
        scene: string,
        query: any
    }) => void) {
        // console.error('ListenBootstrap000');
        if (!Platform.IsExistGetLaunchOptions()) {
            return;
        }
        // console.error('ListenBootstrap111');
        _callBack(Platform.GetLaunchOptions())
        Platform.OnShow(_callBack);
    }
    //----------------------------------------------------------------------------//
}

(window as any).Global = MyGlobal;
/**
 * 平台区分
 * 平台区分入口和类实例化
 * 版本：V1.0.1
 * 
 */
import PlatformBase from "./PlatformBase";
import Platform_mini, { MiniPlatformE } from "./Children/Platform_mini";
export let Platform: PlatformBase = null as any;

export enum PlateformE {
    unknow,
    Mini,//小游戏
    H5,//h5平台
    Android,//安卓平台
    QuickGame//快游戏平台
};
//设置当前平台
export let MyPlatform: PlateformE = PlateformE.Mini;
export class PlatformDiff {

    /**
     * source:可以得到来源平台参数
     */
    private static source: string | undefined = undefined;

    private static _instance: PlatformDiff = null as any;
    static INS() {
        if (!this._instance) {
            this._instance = new PlatformDiff();
        }
        return this._instance;
    }
    getPlatForm() {
        switch (MyPlatform) {
            case PlateformE.Mini:
                this.getPlatFormByMinigame();
                break;
            case PlateformE.H5:
                this.getQueryVariable('source');
                break;
            case PlateformE.Android:
                this.getPlatFormByAndroid();
                break;
            case PlateformE.QuickGame:
                this.getPlatFormByQuickGame();
                break;

            default:
                PlatformDiff.source = undefined;
                break;
        }
    }
    //解析参数信息
    private getQueryVariable(variable: string): string {
        PlatformDiff.source = undefined;
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                PlatformDiff.source = pair[1];
                return pair[1];
            }
        }
        // if (test) {
        //     PlatformDiff.source = 'oppo';
        // }
        // else {
        //     PlatformDiff.source = undefined;
        // }

        return '';
    }
    //获取android平台（现在只有头条）
    getPlatFormByAndroid() {
        // PlatformDiff.source = 'toutiao';
    }
    getPlatFormByQuickGame() { }
    getPlatFormByMinigame() {
        // PlatformDiff.source = 'quick_oppo';
        // console.log('当前平台:','qq');
        if (typeof tt != 'undefined') {
            PlatformBase.curPlatform = MiniPlatformE.tt;
            //统一平台名为mini； 
            //wx = qq 为了在qq平台不替换阿拉丁统计文件
            (window as any).mini = tt;
            mini = tt;
            console.log('当前平台:', 'tt');

        }
        else if (typeof qq != 'undefined') {
            PlatformBase.curPlatform = MiniPlatformE.qq;
            //统一平台名为mini； 
            //wx = qq 为了在qq平台不替换阿拉丁统计文件
            (window as any).mini = (window as any).wx = qq;
            mini = qq;
            console.log('当前平台:', 'qq');

        }
        else if (typeof wx != 'undefined') {
            PlatformBase.curPlatform = MiniPlatformE.wx;
            (window as any).mini = wx;
            console.log('当前平台:', 'wx');
        }
        else {
            PlatformBase.curPlatform = MiniPlatformE.unknow;
            // console.error('当前平台:', '未知小游戏平台');
            MyPlatform = PlateformE.unknow;
        }
    }

    //根据平台创建广告
    CreateAdsByPlatForm() {
        // console.log('CreateAdsByPlatForm', 1);
        // console.log('CreateAdsByPlatForm', 1.5, MyPlatform, PlatformBase.curPlatform);

        if (MyPlatform == PlateformE.Mini && PlatformBase.curPlatform) {
            // console.log('CreateAdsByPlatForm', 2);
            Platform = new Platform_mini();
            // console.log('CreateAdsByPlatForm', 3);
        }
        else if (MyPlatform == PlateformE.unknow) {
            Platform = new PlatformBase();
        }
        else {
            switch (PlatformDiff.source) {
                // case 'toutiao':
                //     PlatformDiff.platformAds = new Android_TT();
                //     break;
                // case 'oppo':
                //     PlatformDiff.platformAds = new Oppo();
                //     break;
                // case 'quick_oppo':
                //     PlatformDiff.platformAds = new Quick_Oppo();
                //     break;
                default:
                    Platform = new PlatformBase();
                    break;
            }
        }
        // console.log('CreateAdsByPlatForm', 9);

    }
}

import PlayDataUtil from '../data/PlayDataUtil';
import SoundPlayer from '../common/SoundPlayer';
import { Global } from '../config/Global';
import TB from '../platform/TB';
import MainUtil from '../utils/MainUitl';
import MyUtils from '../common/MyUtils';
import HHAudio from '../Global/modules/Audio/HHAudio';

export default class Vip {
    private _main: fgui.GComponent;
    private _view: fgui.GComponent;
    private _trans: fgui.Transition;
    private _roleSke: laya.ani.bone.Skeleton;
    private _role: fairygui.GGraph;

    private _isBack: any = true;
    private _finishFunc: any = null;
    private _baseConfigInfos = null;

    _sureFunc = null;
    _cencelFunc = null;

    constructor(sureFunc, cancelFunc) {
        if (Laya.Browser.onTBMiniGame) {
            Laya.loader.load([
                { url: Global.hallConfig._cdn + Global.hallConfig.FGui.Vip, type: Laya.Loader.BUFFER },
                { url: Global.hallConfig._cdn + Global.hallConfig.FGui.VipPng, type: Laya.Loader.IMAGE },
            ], Laya.Handler.create(this, (isSuccess) => {
                if (isSuccess) {
                    fgui.UIPackage.addPackage(Global.hallConfig._cdn + MainUtil.getUI(Global.hallConfig.FGui.Vip));
                    this.onUILoaded();
                }
            }));
        } else {
            fgui.UIPackage.loadPackage(MainUtil.getUI(Global.hallConfig.FGui.Vip), Laya.Handler.create(this, () => {
                fgui.UIPackage.addPackage(MainUtil.getUI(Global.hallConfig.FGui.Vip));
                this.onUILoaded();
            }));
        }

        if (sureFunc) {
            this._sureFunc = sureFunc;
        }
        if (cancelFunc) {
            this._cencelFunc = cancelFunc;
        }
    }

    onUILoaded() {
        MyUtils.closeLoading();
        //获取Main组件，并添加到当前界面
        this._main = fgui.UIPackage.createObject("Vip", "Main").asCom;
        this._main.makeFullScreen();
        this._main.addRelation(fgui.GRoot.inst, fgui.RelationType.Size)
        this._trans = this._main.getTransition("packUp");
        fgui.GRoot.inst.addChild(this._main);

        this._view = this._main.getChild('vip').asCom;

        //取消按钮点击的回调
        let closeBtn = this._view.getChild('cancelBtn').asCom;
        closeBtn.onClick(this, function () {
            HHAudio.PlayEffect('btn');
            //关闭界面，进入游戏
            this.onCancelButton();
        });

        //试用按钮点击的回调
        let getVipBtn = this._view.getChild('tryBtn').asCom;
        getVipBtn.onClick(this, function () {
            HHAudio.PlayEffect('btn');
            this.onSureButton();
        });
    }

    onSureButton() {
        if (Laya.Browser.onTBMiniGame) {
            //关注店铺
            TB.checkShopFavoredStatus((res) => {
                if (res.isFavor) {
                    //关注成功，上报vip
                    MainUtil.sendVip(1, () => {
                        if (this._sureFunc) {
                            this._sureFunc();
                        }
                        this.onBack();
                    }, () => {
                    });
                }
                else {
                    //关注店铺
                    TB.favorShop(() => {
                        //关注成功，上报vip
                        MainUtil.sendVip(1, () => {
                            if (this._sureFunc) {
                                this._sureFunc();
                            }
                            this.onBack();
                        }, () => {
                        });
                    }, () => {
                        TB.showToast("关注失败");
                    }, 2);
                }
            });
        }
        else {
            if (this._sureFunc) {
                this._sureFunc();
            }
            this.onBack();
        }
    }

    onCancelButton() {
        if (this._cencelFunc) {
            this._cencelFunc();
        }
        this.onBack();
    }

    onBack() {
        if (this._isBack) {
            this._isBack = false;
            var callback = Laya.Handler.create(this, function () {
                if (this._finishFunc) {
                    this._finishFunc();
                }
                this._main.dispose();
            })
            this._trans.play(callback);
        }
    }

    destroy() {
        if (this._main) {
            this._main.dispose();
            this._main = null;
        }
    }
}
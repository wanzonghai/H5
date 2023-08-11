import SoundPlayer from "../common/SoundPlayer";
import { Global } from "../config/Global";
import MainUtil from '../utils/MainUitl';
import MyUtils from "../common/MyUtils";
import HHAudio from "../Global/modules/Audio/HHAudio";

export default class Invite {
    private _main: fgui.GComponent;
    private _view: fgui.GComponent;
    private _trans: fgui.Transition;
    private _coin: number;
    private _isBack: boolean;

    constructor(opt) {
        //加载包，完成后展示
        if (Laya.Browser.onTBMiniGame) {
            Laya.loader.load([
                { url: Global.hallConfig._cdn + Global.hallConfig.FGui.invite, type: Laya.Loader.BUFFER },
                { url: Global.hallConfig._cdn + Global.hallConfig.FGui.invitePng, type: Laya.Loader.IMAGE },
            ], Laya.Handler.create(this, () => {
                fgui.UIPackage.addPackage(Global.hallConfig._cdn + MainUtil.getUI(Global.hallConfig.FGui.invite));
                this.onUILoaded(opt);
            }));
        } else {
            fgui.UIPackage.loadPackage(MainUtil.getUI(Global.hallConfig.FGui.invite), Laya.Handler.create(this, () => {
                fgui.UIPackage.addPackage(MainUtil.getUI(Global.hallConfig.FGui.invite));
                this.onUILoaded(opt);
            }));
        }
    }

    onUILoaded(opt) {
        MyUtils.closeLoading();
        this._isBack = true;
        this._coin = 0;
        this._main = fgui.UIPackage.createObject("Invite", "Main").asCom;
        this._main.makeFullScreen();
        this._main.addRelation(fgui.GRoot.inst, fgui.RelationType.Size)
        fgui.GRoot.inst.addChild(this._main);

        this._trans = this._main.getTransition("packUp");
        this._view = this._main.getChild('invite').asCom;
        this._view.getChild("confirmBtn").onClick(this, this.onBack);
        let inviteCtrl = this._view.getController('isInvite');
        inviteCtrl.selectedIndex = opt.coin ? 1 : 0;//1-邀请，0-被邀请
        let tipsTxt = this._view.getChild('tipsTxt').asTextField;
        if (inviteCtrl.selectedIndex == 0) {
            tipsTxt.setVar('name', opt.nickName).flushVars();
        } else {
            tipsTxt.setVar('name', opt.nickName).flushVars();
            //MainUtil.analysis('shareSuccess', { type: -1 });
            // tipsTxt.setVar('name', opt.nickName).setVar('coin', '' + opt.coin).flushVars();
            // let coinTxt = this._view.getChild('coinCom').asCom.getChild('countTxt').asTextField;
            // coinTxt.text = '+' + opt.coin;
            // this._coin = opt.coin;

        }
        let avatar = this._view.getChild('avatar').asLoader;
        avatar.url = opt.headUrl;
    }

    onBack() {
        if (this._isBack) {
            this._isBack = false;
            HHAudio.PlayEffect('btn');
            var callback = Laya.Handler.create(this, function () {
                this._main.dispose();
                if (this._coin > 0) {
                    MainUtil.sendCoin(this._coin);
                }
            })
            this._trans.play(callback);
        }

    }

}


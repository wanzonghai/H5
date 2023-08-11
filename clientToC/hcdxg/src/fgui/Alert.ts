import SoundPlayer from "../common/SoundPlayer";
import { Global } from "../config/Global";
import HHAudio from "../Global/modules/Audio/HHAudio";

export default class Alert {
    private _view: fgui.GComponent;
    private _trans: fgui.Transition;
    private _cbConfirm: any;
    private _cbCancel: any;
    private _main: any;

    constructor(txt, cbConfirm?, cbCancel?) {
        this._cbConfirm = cbConfirm || null;
        this._cbCancel = cbCancel || null;
        this._main = fgui.UIPackage.createObject("Common", "Alert").asCom;
        this._main.makeFullScreen();
        this._main.addRelation(fgui.GRoot.inst, fgui.RelationType.Size)
        this._trans = this._main.getTransition("packUp");
        fgui.GRoot.inst.addChild(this._main);

        this._view = this._main.getChild('alert').asCom;
        let text = this._view.getChild('tipsTxt').asTextField;
        
        this._view.getChild("confirmBtn").onClick(this, this._cbConfirm ? this.onConfirm : this.onBack);
        this._view.getChild("cancelBtn").onClick(this, this.onCancel);
        let alertCtrl = this._view.getController('alertCtrl');
        alertCtrl.selectedIndex = cbCancel ? 0 : 1;

        text.text = txt;
        //默认水平居中显示，超过1行时则左对齐
        let lText = text.displayObject as Laya.Text;
        if (lText.textHeight > lText.fontSize + lText.leading) {
            lText.align = "left";
        }

        //保证最低高度
        if (lText.textHeight < 230) {
            text.autoSize = 0;
            text.height = 230;
        }
        
    }

    onBack() {
        var callback = Laya.Handler.create(this, function () {
            this._main.dispose();
        })
        this._trans.play(callback);
    }

    onConfirm() {
        HHAudio.PlayEffect('btn');
        this._cbConfirm && this._cbConfirm();
        this.onBack();
        
    }

    onCancel() {
        HHAudio.PlayEffect('btn');
        this._cbCancel && this._cbCancel();
        this.onBack();
    }

}


import { Global } from '../config/Global';
import MyUtils from '../common/MyUtils';
import MainUtil from '../utils/MainUitl';

export default class Loading {
    private _main: fgui.GComponent;

    constructor() {
        if (Laya.Browser.onTBMiniGame) {
            fgui.UIPackage.addPackage(Global.hallConfig._cdn + MainUtil.getUI(Global.hallConfig.FGui.Loading));
            this.onUILoaded();
        } else {
            fgui.UIPackage.addPackage(MainUtil.getUI(Global.hallConfig.FGui.Loading));
            this.onUILoaded();
        }
    }

    onUILoaded() {
        //获取Main组件，并添加到当前界面
        this._main = fgui.UIPackage.createObject("Loading", "Main").asCom;
        this._main.makeFullScreen();
        this._main.addRelation(fgui.GRoot.inst, fgui.RelationType.Size)
        fgui.GRoot.inst.addChild(this._main);
        this._main.sortingOrder = 2;
        // this._main.sortingOrder = 99;

        //开启倒计时
        Laya.timer.once(10000, this, () => {
            MyUtils.closeLoading();
        });

    }

    close() {
        Laya.timer.clearAll(this);
        this._main.dispose();
    }

    destroy() {
        this._main.dispose();
    }
}


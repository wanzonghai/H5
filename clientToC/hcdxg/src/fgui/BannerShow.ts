export default class BannerShow {
    private _main: fgui.GComponent;
    private _tipsTxt: fairygui.GTextField;
    private _banner: fairygui.GImage;

    constructor(opt) {
        this.onUILoaded(opt);
    }

    onUILoaded(opt) {
        this._main = fgui.UIPackage.createObject("Common", "BannerShow").asCom;
        fgui.GRoot.inst.addChild(this._main);

        this._main.getController('type').selectedIndex = opt.type;
        this._banner = this._main.getChild('banner' + opt.type).asImage;
        this._tipsTxt = this._main.getChild('tipsTxt').asTextField;
        this._tipsTxt.setVar('name', opt.name).setVar('price', opt.price).setVar('goods', opt.goods).flushVars();
        this.slideTo();
    }

    slideTo() {
        this._main.y = 100;
        this._main.x = Laya.stage.width;
        Laya.Tween.to(this._main, { x: -this._banner.width }, 10000, Laya.Ease.linearNone, Laya.Handler.create(this, this.destroy));
    }

    destroy() {
        this._main.dispose();
    }

}


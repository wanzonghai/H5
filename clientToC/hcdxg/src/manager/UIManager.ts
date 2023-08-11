export default class UIManager {
    private _zOrder: number = 1000;
    private _tipsZOrder: number = 100000;

    private _uiArray = [];
    private _arrTips;

    private _bannerFlag: boolean = true;

    constructor() { }

    //打开UI并转到该UI
    public toUI(uiconfig: any, data: any = null): void {
        if (uiconfig == undefined || uiconfig == null) return;
        for (let i = this._uiArray.length - 1; i >= 0; i--) {
            let ui = this._uiArray[i];
            this.onUIClose(ui, null);
        }
        this._uiArray.length = 0;
        this.openUI(uiconfig, data, true);
    }

    //关闭UI场景
    private closeUI(uiconfig: any, handle: Laya.Handler = null): void {
        if (uiconfig == undefined || uiconfig == null) return;
        let ui;
        for (let i = this._uiArray.length - 1; i >= 0; i--) {
            ui = this._uiArray[i];
            if (ui.uiconfig == uiconfig) {
                this.onUIClose(ui, handle);
                this._uiArray.splice(i, 1);
                break;
            }
        }
        this.checkBanner(ui, false);
    }

    //打开UI场景
    public openUI(uiconfig: any, data: any = null, visible: boolean = true): void {
        if (uiconfig == undefined || uiconfig == null) return;

        if (uiconfig.res && uiconfig.res.length > 0) {
            Laya.loader.load(uiconfig.res, Laya.Handler.create(this, function () {
                this.createUI(uiconfig, data, visible);
            }))
        } else {
            this.createUI(uiconfig, data, visible);
        }
    }

    //打开唯一UI场景
    public openUniqueUI(uiconfig: any, data: any = null, visible: boolean = true): void {
        if (uiconfig == undefined || uiconfig == null) return;

        let ui = this.findUI(uiconfig);
        if (ui) {
            if (data != null) {
                ui.updateData(data);
            }
            ui.visible = visible;
            return;
        }
        this.openUI(uiconfig, data, visible);
    }

    //创建UI场景
    private createUI(uiconfig: any, data: any = null, visible: boolean = true): void {
        if (uiconfig == undefined || uiconfig == null) return;

        let cls = Laya.ClassUtils.getRegClass(uiconfig.class);
        if (cls == null) {
            console.error("openUI error", uiconfig);
            return;
        }

        let ui = new cls(uiconfig);
        ui.uiconfig = uiconfig;
        if (data != null) {
            ui.updateData(data);
        }
        ui.zOrder = this._zOrder++;
        ui.visible = visible;
        Laya.stage.addChild(ui);
        this._uiArray.push(ui);
        if (ui.visible) {
            this.checkBanner(ui, true);
            if (uiconfig.tween) {
                console.log("11111111111");
                Laya.Tween.from(ui, { scaleX: 0.8, scaleY: 0.8 }, 200, Laya.Ease.backOut);
                ui.uitween = uiconfig.tween;
            }
        }
    }

    //UI场景关闭时的动画
    private onUIClose(ui: any, handler: Laya.Handler): void {
        if (ui.uitween) {
            Laya.Tween.to(ui, { scaleX: 0.8, scaleY: 0.8 }, 200, Laya.Ease.backIn, Laya.Handler.create(this, function () {
                this.destroyUI(ui);
                if (handler) handler.method();
            }));
        } else {
            this.destroyUI(ui);
            if (handler) handler.method();
        }
    }

    //摧毁UI场景
    private destroyUI(ui: any): void {
        this.checkBanner(ui, false);
        if (ui._aniList) {
            let ani;
            for (let i = 0; i < ui._aniList.length; i++) {
                ani = ui._aniList[i];
                if (ani && ani.clear) {
                    ani.clear();
                }
            }
        }
        Laya.timer.clearAll(ui);
        Laya.stage.removeChild(ui);
        ui.close();
        ui.destroy();
    }

    //查找UI场景
    public findUI(uiconfig: any): any {
        if (uiconfig == undefined || uiconfig == null) return;

        for (let i = this._uiArray.length - 1; i >= 0; i--) {
            let ui = this._uiArray[i];
            if (ui.uiconfig == uiconfig) {
                return ui;
            }
        }
        return null;
    }

    //设置UI场景可视
    public setUIVisible(uiconfig: any, visible: boolean): void {
        if (uiconfig == undefined || uiconfig == null) return;

        let ui = this.findUI(uiconfig);
        if (ui) {
            ui.visible = visible;
            if (visible) {
                ui.zOrder = this._zOrder++;
            }
            this.checkBanner(ui, visible);
        }
    }

    //设置UI场景到顶部
    public setTop(uiconfig: any): void {
        if (uiconfig == undefined || uiconfig == null) return;

        let ui = this.findUI(uiconfig);
        if (ui) {
            ui.zOrder = this._zOrder++;
        }
    }

    //弹出提示UI
    public showTips(msg: string): void {
        let tips = this._arrTips;
        let txt;
        if (tips == null) {
            tips = [];
            let box = new Laya.Box();
            Laya.stage.addChild(box);
            box.zOrder = this._tipsZOrder;
            for (let i = 0; i < 3; i++) {
                let subBox = new Laya.Box();
                subBox.anchorX = subBox.anchorY = 0.5;
                subBox.centerX = 0;
                let img = new Laya.Image("game/messageBG.png");
                subBox.addChild(img);
                img.width = 800;
                img.height = 80;

                txt = new Laya.Text();
                subBox.addChild(txt);

                txt.fontSize = 36;
                txt.color = "#FFFFFF";
                txt.width = 800;
                txt.height = 50;
                txt.y = 15;
                txt.align = "center";
                txt.valign = "middle";
                // txt.visible = false;
                txt.centerX = 0;
                tips.push(txt)
                box.addChild(subBox);
                subBox.visible = false;
            }
            this._arrTips = tips;
            box.width = 600;
            box.centerX = 0;
            box.centerY = -100;
        }
        if (tips.length == 0)
            return;

        txt = tips.shift()
        txt.text = msg;
        let flipMS: number = 2000;
        txt.color = "#FFFFFF";

        let box = txt.parent;
        box.visible = true;

        box.scale(0.8, 0.8);
        box.alpha = 1;
        Laya.Tween.to(box, { scaleX: 1, scaleY: 1 }, 200, Laya.Ease.backOut, Laya.Handler.create(this, function (obj) {
            Laya.timer.once(flipMS - 600, this, function () {
                Laya.Tween.to(box, { alpha: 0 }, 400, null, Laya.Handler.create(this, function () {
                    obj.parent.visible = false;
                    tips.push(obj);
                }));
            });
        }, [txt]));
    }

    private checkBanner(ui: any, isOpen: boolean) {
        // if (ui == null || ui == undefined || ui.uiconfig == undefined || ui.uiconfig == null) return;
        // if (isOpen) {
        //     var adunit:string = ui.uiconfig.adunit+"";
        //     if (adunit!="undefined" && adunit.length > 1) {
        //         this._bannerFlag = ui.uiconfig.showPrompt;
        //         console.log("has banner show",adunit);
                
        //         setTimeout(() => {
        //             Platform.createBannerAd(adunit, null);
        //         }, 300);
        //     }
        //     else {
        //         // console.log("没有广告：", ui.runtime);
                
        //         Platform.setBannerVisible(false);
        //     }
        // }
        // else {
        //     console.log("qingchu.................");

        //     Platform.closeBannerAd();
        // }
    }

    private createBannercallbackHandle(code: number) {
        // console.log("返回的错误码是：" + code, this._bannerFlag);
        // if (code == 0) {
        //     Platform.setBannerVisible(this._bannerFlag);
        // }
        // else if (code == 1003 || code == 1000) {
        //     // Platform.closeBannerAd();
        // }
    }

}
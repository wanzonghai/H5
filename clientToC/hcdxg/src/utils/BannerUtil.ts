import { Global } from "../config/Global";

export default class BannerUtil extends Laya.Script {
    static _aiName: any;
    static _idx: number;
    static _isOpen: any;

    static init() {
        let list = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.aiNameConfig);
        this._aiName = JSON.parse(JSON.stringify(list));
        this._aiName.sort((a, b) => { return Math.random() > 0.5 ? 1 : -1 });
        this._idx = 0;

        this._isOpen = true;
        this.showBanner();
    }

    static getData() {
        let type = Math.random() <= 0.1 ? 0 : 1;
        let reward = Global.ResourceManager.getPrizeById(type);
        let opt = {
            type: type + 1,
            name: this._aiName[this._idx].name_str,
            price: reward.price,
            goods: reward.title
        }
        this._idx = this._idx + 1 >= this._aiName.length ? 0 : this._idx + 1;
        return opt;
    }

    static getRand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static showBanner() {
        // if (Laya.Browser.onTBMiniGame) {
        //     let time = BannerUtil.getRand(30, 60);
        //     Laya.timer.loop(time * 1000, this, () => {
        //         new BannerShow(BannerUtil.getData());
        //     });
        // }   
    }
}
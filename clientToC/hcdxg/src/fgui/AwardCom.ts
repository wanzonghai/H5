import Utils from '../common/Utils';
import ShopUtil from '../utils/ShopUtil';

export default class AwardCom extends fgui.GComponent {

    private _loader: fairygui.GLoader;
    private _valueTxt: fairygui.GTextField;
    private _nameTxt: fairygui.GTextField;
    private _typeCtrl: fairygui.Controller;

    public constructor() {
        super();
    }

    protected onConstruct(): void {
        this._nameTxt = this.getChild("nameTxt").asTextField;
        this._valueTxt = this.getChild("valueTxt").asTextField;
        this._loader = this.getChild("rewardLoader").asLoader;
        this._typeCtrl = this.getController("type");
    }

    public setOptions(reward: any) {
        if (reward.type == 'Skin') {
            this._typeCtrl.selectedIndex = 1;
            this._loader.url = 'ui://Common/Common_Skin_' + reward.id;
            this._nameTxt.setVar("name", ShopUtil.getName(reward.id)).flushVars();
            this._valueTxt.setVar("value", ShopUtil.getSpeed(reward.id)).flushVars();
        } else if (reward.type == 'Coupon' || reward.type == 'coupon') {
            this._loader.fill = 4;//自由缩放
            this._typeCtrl.selectedIndex = 0;
            this._loader.url = 'ui://Common/Common_Img_Coupon';
            this._nameTxt.setVar("name", reward.name).flushVars();
            this._valueTxt.setVar("value", reward.price).flushVars();
        } else if (reward.type == 'goods') {
            this._loader.fill = 4;//自由缩放
            this._typeCtrl.selectedIndex = 0;
            this._loader.url = reward.url;
            let name = Utils.strClamp(reward.name, 13, "...");
            this._nameTxt.setVar("name", name).flushVars();
            this._valueTxt.setVar("value", reward.price).flushVars();
        } else {
            this._typeCtrl.selectedIndex = 2;
            this._loader.url = 'ui://Common/Common_Coin_1';
            this._nameTxt.setVar("name", "金币").flushVars();
            this._valueTxt.setVar("value", reward.count).flushVars();
        }
    }

}

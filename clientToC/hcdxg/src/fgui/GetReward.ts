import SoundPlayer from "../common/SoundPlayer";
import { Global } from "../config/Global";
import TB from "../platform/TB";
import MainUtil from "../utils/MainUitl";
import ShopUtil from "../utils/ShopUtil";
import MyUtils from '../common/MyUtils';
import PlayDataUtil from '../data/PlayDataUtil';
import hallConfig from '../config/hallConfig';
import HHAudio from "../Global/modules/Audio/HHAudio";

export default class GetReward {
    private _main: fgui.GComponent;
    private _view: fgui.GComponent;
    private _trans: fgui.Transition;
    private _isBack: any = true;
    private _cb: () => void;
    private _opt: any;
    private _taskId: string;
    private _isShare = false;

    constructor(opt, cb = () => { }) {
        this._cb = cb;
        if (Laya.Browser.onTBMiniGame) {
            fgui.UIPackage.addPackage(Global.hallConfig._cdn + MainUtil.getUI(Global.hallConfig.FGui.getReward));
        } else {
            fgui.UIPackage.addPackage(MainUtil.getUI(Global.hallConfig.FGui.getReward));
        }
        this.onUILoaded(opt);
        Laya.stage.on("checkShare", this, this.checkShareFun);
    }

    checkShareFun() {
        if (this._isShare) {
            this._isShare = false;
            //弹出提示语
            TB.showToast("好友进入游戏后，系统会发放奖励");
            //MainUtil.analysis('shareSuccess', { type: 3 });
        }
    }

    onUILoaded(opt) {
        MyUtils.closeLoading();
        this._isBack = true;
        this._opt = opt;
        if (opt.hasOwnProperty("taskId")) {
            this._taskId = opt.taskId;
        }

        //获取Main组件，并添加到当前界面
        this._main = fgui.UIPackage.createObject("GetReward", "Main").asCom;
        this._main.makeFullScreen();
        this._main.addRelation(fgui.GRoot.inst, fgui.RelationType.Size)
        this._trans = this._main.getTransition("packUp");
        fgui.GRoot.inst.addChild(this._main);

        this._view = this._main.getChild('getReward').asCom;


        this._view.getChild("closeBtn").onClick(this, this.onBack);
        this._view.getChild("confirmBtn").onClick(this, this.onBack);
        this._view.getChild("shareBtn").onClick(this, this.onShare);

        let countCtrl = this._view.getController('count');
        if (opt.rewards) {
            countCtrl.selectedIndex = opt.rewards.length == 2 ? 0 : 1;
        }
        let typeCtrl = this._view.getController('type');
        if (opt.type) {
            typeCtrl.selectedIndex = opt.type;//0-比赛 1-奖励 2-补奖
        }
        console.log('GetReward', opt);

        if (opt.rewards) {
            const y1 = [240];
            const y2 = [174, 280];
            console.log('length', opt.rewards.length);

            let _curY = opt.rewards.length == 1 ? y1 : y2;
            for (let i = 1; i <= opt.rewards.length; i++) {
                const reward = opt.rewards[i - 1];
                let rewardCom = this._view.getChild("rewardCom" + i).asCom;
                let typeCtrl = rewardCom.getController('type');
                let loader = rewardCom.getChild('rewardLoader').asLoader;
                let rewardTxt = rewardCom.getChild('rewardTxt').asTextField;
                console.log('reward.type', reward.type, _curY[i - 1]);
                rewardCom.setXY(rewardCom.x, _curY[i - 1])
                if (reward.type == 'Skin') {
                    typeCtrl.selectedIndex = 0;
                    loader.url = 'ui://Common/Common_Skin_' + reward.id;
                    rewardTxt.setVar("name", ShopUtil.getName(reward.id)).setVar("count", reward.count).flushVars();
                } else if (reward.type == 'Coin') {
                    typeCtrl.selectedIndex = 1;
                    // loader.setSize(82, 85);
                    // loader.url = 'ui://Common/icon_jinbi';
                    // rewardTxt.setVar("name", '金币').setVar("count", reward.count).flushVars();
                    rewardTxt.text = '游戏次数+' + reward.count;
                }
                else if (reward.type == 'Point') {//新加积分奖励-xuan 2021/4/9
                    typeCtrl.selectedIndex = 1;
                    rewardTxt.text = '积分+' + reward.count;
                    // loader.setSize(82, 85);
                    // loader.url = 'ui://Common/icon_jifen';
                    // rewardTxt.setVar("name", '积分').setVar("count", reward.count).flushVars();
                } else if (reward.type == 'VIP') {
                    typeCtrl.selectedIndex = 1;
                    loader.url = 'ui://Common/Common_VIP_1';
                    rewardTxt.setVar("name", 'VIP').setVar("count", "1").flushVars();
                } else if (reward.type == 'goods') {
                    typeCtrl.selectedIndex = 2;
                    loader.fill = 4;
                    loader.url = reward.url;
                    rewardTxt.setVar("name", reward.name).setVar("count", "1").flushVars();
                } else {
                    typeCtrl.selectedIndex = 2;
                    loader.fill = 4;
                    loader.url = 'ui://Common/Common_Img_Coupon';
                    rewardTxt.setVar("name", '优惠券').setVar("count", "1").flushVars();
                }

                //默认水平居中显示，超过1行时则左对齐
                let lText = rewardTxt.displayObject as Laya.Text;
                if (lText.textHeight > lText.fontSize + lText.leading) {
                    lText.align = "left";
                }
            }
        }

        if (opt.type == 3 && opt.msg && opt.msg != "") {
            let vipInvalidTxt = this._view.getChild('vipInvalidTxt').asCom;
            vipInvalidTxt.text = opt.msg;
        }
    }

    onBack() {
        if (this._isBack) {
            Laya.stage.offAll("checkShare");
            this._isBack = false;
            HHAudio.PlayEffect('btn');
            MainUtil.addReward(this._opt.rewards, this._taskId);
            var callback = Laya.Handler.create(this, function () {
                Laya.stage.event("updateValue");
                this._cb();
                this._main.dispose();
            })
            this._trans.play(callback);
        }
    }

    onShare() {
        HHAudio.PlayEffect('btn');
        TB.share(() => {
            this._isShare = true;
            //MainUtil.analysis('clickShare', { type: 3 });
        });
    }
}


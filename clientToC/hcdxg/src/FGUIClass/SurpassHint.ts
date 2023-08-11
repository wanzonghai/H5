import HHAudio from "../Global/modules/Audio/HHAudio";
import FGUIMount from "../Global/modules/FGUI/FGUIMount";
import FGUIUtil from "../Global/modules/FGUI/FGUIUtil";
import TB from "../platform/TB";
import { GameLogic } from "./GameLogic";
export interface SurpassHintInfo {
    percent: number,//超越人数比例（0~100）

}

export default class SurpassHint extends FGUIMount {

    //用到的FGUI中元件,必须和fgui名字一致
    element = {
        // bg: null as fgui.GImage,
        // closeBtn: null as fgui.GButton,
        surpassText: null as fgui.GTextField,
        photoLoader1: null as fgui.GLoader,
        photoLoader2: null as fgui.GLoader,
        // btntitle: null as fgui.GTextField,
    }
    // classType={
    //     startBtn:StartScene,
    // }
    //元件路径，在主组件下可以不填，路径以 . 隔开
    protected elementPath = {
        // btntitle: 'attentionBtn.title'
    }
    myInfo: SurpassHintInfo = null as any;

    onStart() {

        this.clickBtn();
        this.listenText();
        this.changeUrl();

    }
    onShow() {
        // this.element.reviveText.text = '';
        // this.element.iconLoader.url = '';
        // this.element.btntitle.text = '';
        console.log('SurpassHint', 'onShow');
        Laya.stage.offAllCaller(this);
        Laya.timer.clearAll(this);

        let _startx = Laya.stage.width + this.width * this.pivotX;
        let _endx = Laya.stage.width - this.width * (1 - this.pivotX);
        this.x = _startx;
        Laya.Tween.to(this, { x: _endx }, 500, undefined, Laya.Handler.create(this, () => {
            Laya.timer.once(2000, this, () => {
                Laya.Tween.to(this, { x: _startx }, 500, undefined, Laya.Handler.create(this, () => {
                    this.Hide();
                }));
            })
        }));
    }
    onHide() {
        this.changeUrl();
    }

    onEnd() {
        Laya.stage.offAllCaller(this);
        Laya.timer.clearAll(this);
    }
    clickBtn() {

    }
    listenText() {

    }
    closeself() {
        Laya.stage.offAllCaller(this);
        if (!this.visible) {
            return;
        }
        FGUIUtil.ActionPopOut(this, () => {
            this.Hide();
            GameLogic.PauseGame(false);
        });
    }
    SetInfo(_info: SurpassHintInfo) {
        this.myInfo = _info;
        this.element.surpassText.setVar("count", '' + _info.percent).flushVars();

    }
    changeUrl() {
        const baseUrl = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/bigFight/matchAvatar/tx_";
        for (let i = 0; i < 2; i++) {
            let _headid = 1 + (Math.random() * 2000) | 0;
            let _url = baseUrl + (Array(5).join('0') + _headid).slice(-5) + ".jpg";
            if (i == 0) {
                this.element.photoLoader1.url = _url;
            }
            else {
                this.element.photoLoader2.url = _url;
            }
        }
    }




}
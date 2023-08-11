import HHAudio from "../Global/modules/Audio/HHAudio";
import FGUIMount from "../Global/modules/FGUI/FGUIMount";
import FGUIUtil from "../Global/modules/FGUI/FGUIUtil";
import TB from "../platform/TB";
import { GameLogic } from "./GameLogic";
export interface GameAwardInfo {
    title: string,
    price: string,
    linkId: number,

}

export default class GameAward extends FGUIMount {

    //用到的FGUI中元件,必须和fgui名字一致
    element = {
        bg: null as fgui.GImage,
        closeBtn: null as fgui.GButton,
        attentionBtn: null as fgui.GButton,
        iconLoader: null as fgui.GLoader,
        describeText: null as fgui.GTextField,
        priceText: null as fgui.GTextField,
        // btntitle: null as fgui.GTextField,
    }
    // classType={
    //     startBtn:StartScene,
    // }
    //元件路径，在主组件下可以不填，路径以 . 隔开
    protected elementPath = {
        // btntitle: 'attentionBtn.title'
    }
    myInfo: GameAwardInfo = null as any;

    onStart() {

        this.clickBtn();
        this.listenText();


    }
    onShow() {
        // this.element.reviveText.text = '';
        // this.element.iconLoader.url = '';
        // this.element.btntitle.text = '';
        Laya.stage.offAllCaller(this);
        FGUIUtil.ActionPopIn(this);
        console.log('GameAward', 'onShow');
    }

    onEnd() {
        Laya.stage.offAllCaller(this);
        Laya.timer.clearAll(this);
    }
    clickBtn() {
        //开始按钮
        this.element.closeBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            console.log('closeBtn');
            GameLogic.PreventGameTouch();
            this.closeself();

        })
        this.element.attentionBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            console.log('attentionBtn', this.myInfo.linkId);
            GameLogic.PreventGameTouch();
            this.GotoUse(this.myInfo.linkId);
        })

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
    SetInfo(_info: GameAwardInfo) {
        this.myInfo = _info;
        this.element.describeText.text = _info.title;
        this.element.priceText.text = _info.price;
        if (Laya.Browser.onIOS && _info.linkId == 0) {
            this.element.attentionBtn.visible = false;
        }
        console.log('SetInfo', _info);

    }
    GotoUse(_linkId: number) {
        if (!Laya.Browser.onTBMiniGame) {
            return;
        }
        if (_linkId == 0) {  //没有跳转连接，就跳转到店铺首页
            TB.navigateToTaobaoPage(() => {
                this.closeself();
            }, () => {
            });
        }
        else {
            TB.openDetail('' + _linkId, () => {
            }, () => {
                this.closeself();
            });
        }
    }




}
import HHAudio from "../Global/modules/Audio/HHAudio";
import FGUIMount from "../Global/modules/FGUI/FGUIMount";
import FGUIUtil from "../Global/modules/FGUI/FGUIUtil";
import { ModulePlatformAPI, PlatformListenKey } from "../module/ModulePlatformAPI";
import TB from "../platform/TB";
import MainUtil from "../utils/MainUitl";
import { GameLogic } from "./GameLogic";
export interface MergeExternAwardInfo {
    score: number,
}

export default class MergeExternAward extends FGUIMount {

    //用到的FGUI中元件,必须和fgui名字一致
    element = {
        closeBtn: null as fgui.GButton,
        attentionBtn: null as fgui.GButton,
        scoreText: null as fgui.GTextField,
        bg: null as fgui.GImage,
        // btntitle: null as fgui.GTextField,
    }
    // classType={
    //     startBtn:StartScene,
    // }
    //元件路径，在主组件下可以不填，路径以 . 隔开
    protected elementPath = {
        // btntitle: 'attentionBtn.title'
    }
    myInfo: MergeExternAwardInfo = null as any;

    private sharestate = 0;

    private addScore = 0;

    onStart() {

        this.clickBtn();
        this.listenText();
        this.sharestate = 0;


    }
    onShow() {
        this.sharestate = 0;
        // this.element.reviveText.text = '';
        // this.element.iconLoader.url = '';
        // this.element.btntitle.text = '';
        // Laya.stage.offAllCaller(this);
        this.element.bg.visible = false;
        FGUIUtil.ActionPopIn(this, () => {
            this.element.bg.visible = true;
        });
        console.log('MergeExternAward', 'onShow');
        // this._isShare = false;
        // Laya.stage.on(PlatformListenKey.onShow, this, this.checkShareFun);
    }
    onHide() {
        // Laya.stage.off(PlatformListenKey.onShow, this, this.checkShareFun);
    }

    onEnd() {
        Laya.stage.offAllCaller(this);
        Laya.timer.clearAll(this);
    }
    // private _isShare = false;
    checkShareFun() {
        if (this.sharestate == 1) {
            console.log('获得分享奖励 50积分');
            this.addScore += 50;
            this.sharestate = 2;
            this.closeself();
            GameLogic.AddCurScore(this.addScore);

            // this.closeself();
        }
        // if (this._isShare) {
        //     this._isShare = false;

        //     //MainUtil.analysis('shareSuccess', { type: 13 });
        // }
    }

    clickBtn() {
        //开始按钮
        this.element.closeBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            console.log('closeBtn');
            GameLogic.PreventGameTouch();
            this.closeself();
            GameLogic.AddCurScore(this.addScore);

        })
        this.element.attentionBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            console.log('attentionBtn');
            GameLogic.PreventGameTouch();

            ModulePlatformAPI.Share(() => {
                // this._isShare = true;
                if (this.sharestate == 0) {
                    this.sharestate = 1;
                }

                // console.log('点击分享成功', this.sharestate);
                Laya.timer.once(2000, this, () => {
                    this.checkShareFun();
                });



            })
            // TB.share(() => {

            //     //MainUtil.analysis('clickShare', { type: 13 });
            //     this._isShare = true;
            // });
        })

    }

    listenText() {

    }
    closeself() {

        Laya.stage.offAllCaller(this);
        if (!this.visible) {
            return;
        }
        this.element.bg.visible = false;
        FGUIUtil.ActionPopOut(this, () => {
            this.Hide();
            GameLogic.PauseGame(false);
        });
    }
    SetInfo(_info: MergeExternAwardInfo) {
        this.addScore = _info.score;
        this.myInfo = _info;
        this.element.scoreText.text = '' + _info.score;
        console.log('SetInfo', _info);

    }



}
import HHAudio from "../Global/modules/Audio/HHAudio";
import FGUIMount from "../Global/modules/FGUI/FGUIMount";
import FGUIUtil from "../Global/modules/FGUI/FGUIUtil";
import { GameLogic } from "./GameLogic";


export default class ConfirmPopup extends FGUIMount {



    //用到的FGUI中元件,必须和fgui名字一致
    element = {
        bg: null as fgui.GImage,
        closeBtn: null as fgui.GButton,
        yesBtn: null as fgui.GButton,
        noBtn: null as fgui.GButton,
        hintText: null as fgui.GTextField,
    }
    // classType={
    //     startBtn:StartScene,
    // }
    //元件路径，在主组件下可以不填，路径以 . 隔开
    protected elementPath = {
    }

    onStart() {

        this.clickBtn();
        this.listenText();


    }
    onShow() {
        this.element.bg.visible = false;
        FGUIUtil.ActionPopIn(this, () => {
            this.element.bg.visible = true;
        });
        // this.element.reviveText.text = '';
        // this.element.iconLoader.url = '';
        // this.element.btntitle.text = '';
    }

    onEnd() {
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
    }
    close(_callBack?: Function) {
        if(!this.visible){
            return;
        }
        this.element.bg.visible = false;
        FGUIUtil.ActionPopOut(this, () => {
            _callBack && _callBack();
            this.Hide();
        })
    }
    clickBtn() {
        //开始按钮
        this.element.closeBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            console.log('closeBtn');
            GameLogic.PreventGameTouch();
            this.close();
            GameLogic.PauseGame(false);
        })
        this.element.noBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            console.log('noBtn');
            GameLogic.PreventGameTouch();
            this.close();
            GameLogic.PauseGame(false);
        })
        this.element.yesBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            console.log('yesBtn');
            GameLogic.PreventGameTouch();
            this.close(() => {
                GameLogic.GameOver(false);
            });

        })


    }
    listenText() {
        // this.element.reviveText.text = '' + GameLogic.GetCurScore();
    }




}
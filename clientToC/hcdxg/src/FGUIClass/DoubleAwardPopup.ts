import HHAudio from "../Global/modules/Audio/HHAudio";
import FGUIMount from "../Global/modules/FGUI/FGUIMount";
import { GameLogic, GameTasksName, GameTaskType } from "./GameLogic";
import FGUIUtil from "../Global/modules/FGUI/FGUIUtil";


export default class DoubleAwardPopup extends FGUIMount {

    //用到的FGUI中元件,必须和fgui名字一致
    element = {
        bg: null as fgui.GImage,
        closeBtn: null as fgui.GButton,
        attentionBtn: null as fgui.GButton,
        iconLoader: null as fgui.GLoader,
        reviveText: null as fgui.GTextField,
        btntitle: null as fgui.GTextField,
    }
    // classType={
    //     startBtn:StartScene,
    // }
    //元件路径，在主组件下可以不填，路径以 . 隔开
    protected elementPath = {
        btntitle: 'attentionBtn.title'
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
        // this._isShare = false;
        // Laya.stage.on("checkShare", this, this.checkShareFun);
    }
    onHide() {
        // Laya.stage.off("checkShare", this, this.checkShareFun);
    }

    onEnd() {
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
    }
    close(_callBack?: Function) {
        if (!this.visible) {
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
            this.close(() => {
                GameLogic.ShowGameOverPopup();
            });
        })
        this.element.attentionBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            console.log('attentionBtn', this.curTaskType);

            GameLogic.DoGameTask(this.curTaskType, (_success) => {
                if (_success) {
                    this.close(() => {
                        GameLogic.ShowGameOverPopup(2);
                    });
                }

            })



        })

    }

    // private _isShare = false;
    // checkShareFun() {
    //     if (this._isShare) {
    //         this._isShare = false;
    //         //MainUtil.analysis('shareSuccess', { type: 12 });
    //     }
    // }
    listenText() {
        // this.element.reviveText.text = '' + GameLogic.GetCurScore();
    }
    private curTaskType: GameTaskType = null as any;
    SetInfo(_taskType: GameTaskType) {
        console.log('DoubleAwardPopup SetInfo', _taskType);

        this.curTaskType = _taskType;
        this.element.reviveText.text = GameTasksName[_taskType] + '领取双倍';
        // this.element.btntitle.text = reviveTask[_taskKey].btnText;
        this.element.iconLoader.url = GameLogic.GetGameTaskIconUrl(_taskType);
    }



}

import HHAudio from "../Global/modules/Audio/HHAudio";
import FGUIMount from "../Global/modules/FGUI/FGUIMount";
import FGUIUtil from "../Global/modules/FGUI/FGUIUtil";
import MainUtil from "../utils/MainUitl";
import { GameFlyTaskAwardInfo, GameFlyTaskAwardType, GameLogic, GameTasksName, GameTaskType } from "./GameLogic";



export interface GameTaskInfo {
    awardType: GameFlyTaskAwardType,
    taskType: GameTaskType,
}

export default class GameTaskPopup extends FGUIMount {


    //用到的FGUI中元件,必须和fgui名字一致
    element = {
        bg: null as fgui.GImage,
        closeBtn: null as fgui.GButton,
        goBtn: null as fgui.GButton,
        titleLoader: null as fgui.GLoader,
        iconLoader: null as fgui.GLoader,
        descText: null as fgui.GTextField,
    }
    // classType={
    //     startBtn:StartScene,
    // }
    //元件路径，在主组件下可以不填，路径以 . 隔开
    protected elementPath = {
        // btntitle: 'attentionBtn.title'
    }

    myInfo: GameTaskInfo = null as any;

    onStart() {

        this.clickBtn();
        this.listenText();

    }
    onShow() {
        this.element.bg.visible = false;
        FGUIUtil.ActionPopIn(this, () => {
            this.element.bg.visible = true;
        });
        GameLogic.PauseGame(true);
        let _awardType = GameLogic.GetCurGameFlyTaskAwardType();
        if (!_awardType) {
            return;
        }
        let _taskType = GameLogic.GetGameFlyTaskType(_awardType);
        this.SetInfo({
            awardType: _awardType,
            taskType: _taskType
        })
        this._isShare = false;
        Laya.stage.on("checkShare", this, this.checkShareFun);
    }
    onHide() {
        Laya.stage.off("checkShare", this, this.checkShareFun);
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
            GameLogic.PreventGameTouch();
            this.close(() => {
                GameLogic.PauseGame(false);
            });


        })
        //立即前往
        this.element.goBtn.onClick(this, () => {

            HHAudio.PlayEffect('btn');
            console.log('goBtn');
            GameLogic.PreventGameTouch();

            GameLogic.DoGameFlyTask(this.myInfo.taskType, this.myInfo.awardType, (_success) => {
                if (_success) {
                    this.close(() => {
                        GameLogic.PauseGame(false);
                    });
                }
            })

        })

    }

    private _isShare = false;
    checkShareFun() {
        if (this._isShare) {
            this._isShare = false;
            //MainUtil.analysis('shareSuccess', { type: 12 });
        }
    }
    listenText() {
        // this.element.reviveText.text = '' + GameLogic.GetCurScore();
    }
    SetInfo(_info: GameTaskInfo) {
        // console.error('SetInfo', _info);

        this.myInfo = _info;
        this.element.descText.text = `${GameTasksName[_info.taskType]}\n${GameFlyTaskAwardInfo[_info.awardType].desc}`;
        this.element.iconLoader.url = this.getUrl('icon', _info.awardType);
        this.element.titleLoader.url = this.getUrl('title', _info.awardType);
        // console.error('titleLoader', this.element.titleLoader);

    }

    getUrl(_type: 'icon' | 'title', _taskType: GameFlyTaskAwardType) {
        // console.error('_taskType', _taskType);
        // console.error('_taskType2', GameFlyTaskAwardInfo[_taskType]);

        const pktName = 'GameScene';
        let _name = '';
        switch (_type) {
            case 'icon':
                _name = GameFlyTaskAwardInfo[_taskType].iconPic;
                break;
            case 'title':
                _name = GameFlyTaskAwardInfo[_taskType].titlePic;
                break;

            default:
                break;
        }
        // console.error('getUrl _name',_name);

        return fgui.UIPackage.getItemURL(pktName, _name);
    }




}
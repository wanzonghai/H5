/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
import UI_taskItem from './Task/UI_taskItem';
import { TaskInfo, TaskLogic, TaskStatusType, TaskType } from './TaskLogic';
import { ModuleAudio, ModuleTool } from './../ModuleTool';
import { GCurrencyType, ModuleGlobal } from '../ModuleGlobal';
import ModuleWindow from '../ModuleWindow';
import uiAlert from '../GeneralInterface/uiAlert';

export default class uitaskItem extends UI_taskItem {

    private myInfo: TaskInfo = null as any;
    private lastIcon = '';
    onConstruct() {
        super.onConstruct();
        this.clickBtn();
    }

    private parentWinHandler?: ModuleWindow
    SetInfo(_info: TaskInfo, _parentwinHandler?: ModuleWindow) {
        this.parentWinHandler = _parentwinHandler;
        this.clearAll();
        this.setShow(_info);
        //监听状态变化
        Laya.stage.on(TaskLogic.TaskUpdateKey + this.myInfo.detailType, this, this.setShow);
    }

    //设置显示内容
    private setShow(_info: TaskInfo) {
        this.myInfo = _info;
        this.ShowBaseInfo();
        this.ShowProgress();
        this.ChangeTaskState(this.myInfo.status);
        this.SetAwardShow();

        //改变类型才会更新icon
        if (this.lastIcon != _info.detailType) {
            this.lastIcon = _info.detailType;
            this.m_iconLoader.url = TaskLogic.GetTaskIconUrl(_info.detailType);
        }
    }


    //显示进度
    private ShowBaseInfo() {
        this.m_titleTxt.text = this.myInfo.title;
    }
    //设置任务状态
    private ChangeTaskState(_state: TaskStatusType) {
        let _text = '前往';
        switch (_state) {
            case TaskStatusType.waiting:
                _text = '前往';

                break;
            case TaskStatusType.allow:
                _text = '可领取';
                break;
            case TaskStatusType.finish:
                _text = '已领取';
                break;

            default:
                break;
        }

        this.m_state.setSelectedPage(_text);
        this.ChangeTimerState();
    }
    //更改时间状态
    private ChangeTimerState() {
        if (this.myInfo.status != TaskStatusType.waiting) {
            return;
        }
        this.m_isTimer.selectedIndex = this.myInfo.period > 0 ? 1 : 0;
        //更新时间
        if (this.m_isTimer.selectedIndex == 1) {
            this.m_timeTxt.setVar('time', ModuleTool.GetTime(this.myInfo.period, 'hh:mm:ss')).flushVars();
        }
    }
    //设置奖品显示
    private SetAwardShow() {
        let _awradTime = 0;
        let _awradScore = 0;
        if (this.myInfo.detailType != TaskType.spend) {
            for (const awrad of this.myInfo.reward) {
                switch (awrad.type) {
                    case GCurrencyType.times:
                        _awradTime = awrad.value;
                        break;
                    case GCurrencyType.wmScore:
                        _awradScore = awrad.value;
                        break;
                    default:
                        break;
                }
            }
        }

        let _haveTime = _awradTime > 0;
        let _haveScore = _awradScore > 0;
        if (_haveTime && _haveScore) {
            this.m_iconShowState.setSelectedPage('双奖励');
        }
        else if (_haveTime) {
            this.m_iconShowState.setSelectedPage('奖励1');
        }
        else if (_haveScore) {
            this.m_iconShowState.setSelectedPage('奖励2');
        }
        else {
            this.m_iconShowState.setSelectedPage('无奖励');
        }
        // this.m_coinIcon.visible = _haveTime;
        // this.m_countTxt.visible = _haveTime;
        // this.m_scoreIcon.visible = _haveScore;
        // this.m_scorecountTxt.visible = _haveScore;
        if (_haveTime) {
            this.m_countTxt.setVar('count', '' + _awradTime).flushVars();
        }
        if (_haveScore) {
            this.m_scorecountTxt.setVar('scorecount', '' + _awradScore).flushVars();
        }
    }
    //显示进度
    private ShowProgress() {
        let _show = true;
        if (this.myInfo.rewardTime && this.myInfo.rewardTime == 1) {
            _show = false;
        }
        // this.m_taskTxt.visible = _show;
        this.m_progressState.setSelectedPage(_show ? '显示' : '不显示');
        if (_show) {
            this.m_taskTxt.text = `(${this.myInfo.competition})`;
        }

    }

    private clickBtn() {
        this.m_goBtn.onClick(this, () => {
            console.log('m_goBtn');

            ModuleAudio.PlayComonBtnAudio();
            
            if(uiAlert.AutoShowActivityState()){
                return;
            }
            // if (ModuleGlobal.ActivityState == 'off') {
            //     uiAlert.Show({ content: "活动已下线,下次再来吧~" });
            //     return;
            // }
            this.doTask();

        })
        this.m_followBtn.onClick(this, () => {
            console.log('m_followBtn');

            ModuleAudio.PlayComonBtnAudio();
            if(uiAlert.AutoShowActivityState()){
                return;
            }
            // if (ModuleGlobal.ActivityState == 'off') {
            //     uiAlert.Show({ content: "活动已下线,下次再来吧~" });
            //     return;
            // }
            this.doTask();

        })
        this.m_getBtn.onClick(this, () => {
            console.log('m_getBtn');

            ModuleAudio.PlayComonBtnAudio();
            if(uiAlert.AutoShowActivityState()){
                return;
            }
            // if (ModuleGlobal.ActivityState == 'off') {
            //     uiAlert.Show({ content: "活动已下线,下次再来吧~" });
            //     return;
            // }
            this.getReward();
        })
    }
    //去做任务
    private doTask() {
        console.log('去做任务');

        TaskLogic.DoTask(this.myInfo.detailType, (_success) => {
            // if (_success) {
            //     this.getReward();
            // }
            console.log('doTask结果', _success);
        }, 2, true);
    }
    //获得奖励
    private getReward() {
        console.log('领取任务奖励');
        this.parentWinHandler.showModalWait();
        let _closeModalWait = () => {
            Laya.timer.clear(this, _closeModalWait);
            this.parentWinHandler.closeModalWait();
        }
        Laya.timer.once(5000, this, _closeModalWait);
        TaskLogic.ReceiveTaskAward(this.myInfo.detailType, (_success, _rewardData) => {
            console.log('getReward结果', _success, _rewardData);
            _closeModalWait();
        })
    }


    clearAll() {
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
    }


}
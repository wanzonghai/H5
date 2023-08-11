
import { PkgNameType } from '../Global/FGUIConfig';
import FGUIUtil from '../Global/modules/FGUI/FGUIUtil';
import { GameLogic } from './GameLogic';
import StartScene from './StartScene';
import FGUIScene from './../Global/modules/FGUI/FGUIScene';
import SceneUtil from './../Global/modules/tools/SceneUtil';
import HHAudio from './../Global/modules/Audio/HHAudio';
import GameOver from './GameOver';
import RevivePopup from './RevivePopup';
import ConfirmPopup from './ConfirmPopup';
import GetScore from './FGUIPrefab/GetScore';
import DoubleAwardPopup from './DoubleAwardPopup';
import TB from '../platform/TB';
import GameAward, { GameAwardInfo } from './GameAward';
import ComboEffect from './FGUIPrefab/ComboEffect';
import MergeExternAward from './MergeExternAward';
import SurpassHint from './SurpassHint';
import NoticeBoard from './NoticeBoard';
import GameTaskPopup from './GameTaskPopup';
import { ModuleSkins } from '../module/ModuleSkins';

enum answerState {
    during,
    wait
}
export default class GameScene extends FGUIScene {

    pkgName: PkgNameType = 'GameScene';
    element = {
        //返回按钮
        backButton: null as fgui.GButton,
        score: null as fgui.GTextField,
        scoreIcon: null as fgui.GLoader,

        //背景图
        // bg: null as fgui.GComponent,
        //开始界面
        // startPannel: null as fgui.GComponent,
        //结束界面
        GameOver: null as GameOver,
        ConfirmPopup: null as ConfirmPopup,
        //复活弹窗
        RevivePopup: null as RevivePopup,
        //双倍奖励弹窗
        DoubleAwardPopup: null as DoubleAwardPopup,
        //游戏内优惠券奖励
        GameAward: null as GameAward,
        //游戏内优惠券奖励
        MergeExternAward: null as MergeExternAward,
        gameStartHint: null as fgui.GTextField, //开始文字提示
        SurpassHint: null as SurpassHint, //超过人数提示
        gameFlyTaskBtn: null as fgui.GButton, //游戏内飞入任务按钮
        GameTaskPopup: null as GameTaskPopup, //游戏内飞入任务弹窗
        //倒计时数字
        // start_CountDownLabel: null as fgui.GLabel,
        //
        // restartBtn: null as fgui.GButton,
    }
    /**
     * 元件路径
     * 直接在主组件下可以不填
     */
    protected elementPath = {
        // scoreNText: 'scoreBtn.scoreNText',
    };
    mountPath = {
        GameOver: {
            classType: GameOver,//自定义类名
            compName: "GameOver"//(组件名)
        },
        RevivePopup: {
            classType: RevivePopup,//自定义类名
            compName: "RevivePopup"//(组件名)
        },
        DoubleAwardPopup: {
            classType: DoubleAwardPopup,//自定义类名
            compName: "DoubleAwardPopup"//(组件名)
        },
        ConfirmPopup: {
            classType: ConfirmPopup,//自定义类名
            compName: "ConfirmPopup"//(组件名)
        },
        GameAward: {
            classType: GameAward,//自定义类名
            compName: "GameAward"//(组件名)
        },
        MergeExternAward: {
            classType: MergeExternAward,//自定义类名
            compName: "MergeExternAward"//(组件名)
        },
        SurpassHint: {
            classType: SurpassHint,//自定义类名
            compName: "SurpassHint"//(组件名)
        },
        GameTaskPopup: {
            classType: GameTaskPopup,//自定义类名
            compName: "GameTaskPopup"//(组件名)
        },
        // EmojiComp: {
        //     classType: EmojiComp,//自定义类名
        //     compName: "EmojiComp"//(组件名)
        // }
    };
    // private mapBgs: fgui.GImage[] = [];

    // private answerInfo = {
    //     state: answerState.wait,
    //     leftTime: 0,
    // }
    // private haveResult = false;
    private curScore = 0;

    async onStart() {
        // console.log('Map', this.element.Map);
        //获取所有背景图片
        // this.mapBgs = this.element.bg._children as any[];
        this.element.RevivePopup.Hide();
        this.element.DoubleAwardPopup.Hide();
        this.changeSkin();
        this.clickBtn();
        // console.log('this.mapBgs', this.mapBgs);
        // Laya.timer.loop(15, this, this.bgMove);
        GameLogic.InGame();
        GetScore.SetParent(this.main);
        ComboEffect.SetParent(this.main);
        GameLogic.gameScene = this;
        GameLogic.Restart();

        this.listenText();
        this.element.GameAward.Hide();
        this.HideFlyTask();
        // console.log('GameLogic.gameScene', GameLogic.gameScene);

        this.element.gameFlyTaskBtn.getChildAt(0).asImage



    }
    onEnd() {
        // console.error('onEnd');
        GameLogic.gameScene = null;
        GameLogic.OutGame();
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
    }
    changeSkin() {
        ModuleSkins.ChangeFguiICON(this.element.gameFlyTaskBtn, 'honeybeeIcon');
        ModuleSkins.ChangeSkin(this.element.scoreIcon, 'integralIcon');
        // console.error('scoreIcon', this.element.scoreIcon);

    }
    clickBtn() {
        //返回按钮
        this.element.backButton.onClick(this, () => {
            // console.log('backButton');


            HHAudio.PlayEffect('btn');
            GameLogic.PreventGameTouch();


            GameLogic.PauseGame(true);
            this.element.ConfirmPopup.Show();

            // SceneUtil.CloseScene('MyGameScene');
            // FGUIUtil.ShowScene(StartScene);

            // GameLogic.GameOver();

            //测试飞入任务
            // GameLogic.flyTaskTest(2, 'share', 'supperFruit');

            // this.ShowMergeExternAward(100);
            // GameLogic.AddScoreByKind(9);


        })
        //飞入任务按钮
        this.element.gameFlyTaskBtn.onClick(this, () => {
            console.log('gameFlyTaskBtn');


            GameLogic.PreventGameTouch();

            HHAudio.PlayEffect('btn');
            GameLogic.PauseGame(true);
            this.element.GameTaskPopup.Show();

            // SceneUtil.CloseScene('MyGameScene');
            // FGUIUtil.ShowScene(StartScene);

            // GameLogic.GameOver();

        })


        //重玩按钮
        // this.element.restartBtn.onClick(this, () => {
        //     HHAudio.PlayEffect('btn');
        //     GameLogic.Restart();
        // })
    }
    listenText() {
        this.element.score.text = '' + GameLogic.GetCurScore();
        Laya.stage.on('curScore', this, () => {
            this.scorePerAdd = 1;
            let _dif = GameLogic.GetCurScore() - this.curScore;
            if (_dif > 10) {
                this.scorePerAdd = _dif / 12;
            }
            this.stopScoreUpdate();
            Laya.Tween.to(this.element.score, { scaleX: 1.3, scaleY: 1.3 }, 100);
            Laya.timer.frameLoop(5, this, this.scoreUpdate);
        })
    }

    async GameStart() {
        this.surpassLevel = 0;
        this.HideFlyTask();
        this.stopScoreUpdate();
        this.showGameOver(false);
        this.showStart(false);
        this.element.ConfirmPopup.close();
        // this.haveResult = false;
        console.log('Gamestart');
        this.element.GameOver.GameStart();
        // this.CheckTaskState();
        this.ShowStartHint(true);
        this.element.MergeExternAward.closeself();
    }
    GameRevive() {
        this.showGameOver(false);
        console.log('GameRevive');
        this.element.GameOver.GameRevive();
        // this.CheckTaskState();
    }
    GameOver() {
        console.log('gamescene GameOver');
        this.stopScoreUpdate();
        if (!GameLogic.isGameFail) {
            FGUIUtil.ShowScene(StartScene);
        }
        else {
            // NoticeBoard.AutoShow('endGame', () => {
            //     GameLogic.ShowGameOverPopup();
            // })
            let _gettask = GameLogic.GetGameOverTask();
            if (GameLogic.reviveLeftTime > 0 && _gettask) {
                this.element.RevivePopup.Show();
                this.element.RevivePopup.SetInfo(_gettask);
            }
            else {
                GameLogic.ShowGameOverPopup();
            }

        }



    }
    GamePause(_pause: boolean) {
        if (this.element.gameFlyTaskBtn.visible) {
            this.main.getTransition("flyTask").setPaused(_pause);
        }

    }
    private scorePerAdd = 1;
    scoreUpdate() {
        if (GameLogic.GetCurScore() - this.curScore > 1) {
            this.curScore += this.scorePerAdd;
        }
        else {
            this.curScore = GameLogic.GetCurScore();
            this.stopScoreUpdate();
        }
        this.AutoShowSurpassHint(this.curScore);
        this.element.score.text = '' + (this.curScore | 0);
    }
    stopScoreUpdate() {
        this.element.score.text = '' + (GameLogic.GetCurScore() | 0);
        this.element.score.setScale(1, 1);
        Laya.Tween.clearAll(this.element.score);
        Laya.timer.clear(this, this.scoreUpdate);
    }
    async showStart(_show: boolean) {
        // this.element.startPannel.visible = _show;
        // if (_show) {
        //     console.log('leftTime', this.answerInfo.leftTime);

        //     this.element.start_CountDownLabel.text = '' + this.answerInfo.leftTime;
        // }

        // if (_show) {
        //     await this.ShowCountDown(this.element.start_CountDownLabel, 3);
        //     this.element.startPannel.visible = false;
        // }
    }

    showGameOver(_show: boolean) {
        if (_show) {
            let _gettask = GameLogic.GetGameOverTask();
            this.element.GameOver.Show();
        }
        else {
            this.element.GameOver.close();
        }
        console.log('showGameOver', _show);
    }
    showDoubleAward(_show: boolean) {
        if (_show) {
            let _gettask = GameLogic.GetGameOverTask();
            this.element.DoubleAwardPopup.Show();
            this.element.DoubleAwardPopup.SetInfo(_gettask);
        }
        else {
            this.element.DoubleAwardPopup.close();
        }
        console.log('showDoubleAward', _show);
    }
    ShowGameAward(_data: GameAwardInfo) {
        console.log('ShowGameAward', _data);

        this.element.GameAward.SetInfo(_data);
        this.element.GameAward.Show();
    }
    ShowStartHint(_show: boolean) {
        if (_show == this.element.gameStartHint.visible) {
            return;
        }
        this.element.gameStartHint.visible = _show;
    }
    ShowMergeExternAward(_awardScore: number) {
        GameLogic.PauseGame(true);
        this.element.MergeExternAward.SetInfo({ score: _awardScore });
        this.element.MergeExternAward.Show();
    }
    //显示超越榜
    ShowSurpassHint(_surpassPercent: number) {
        console.log('显示超越榜', _surpassPercent);
        this.element.SurpassHint.SetInfo({ percent: _surpassPercent });
        this.element.SurpassHint.Show();
    }
    private surpassLevel = 0;
    // private SurpassLevelInfo = [
    //     { score: 2, percent: 80 },
    //     { score: 10, percent: 90 },
    //     { score: 15, percent: 95 },
    //     { score: 20, percent: 99 }
    // ];
    private SurpassLevelInfo = [
        { score: 250, percent: 80 },
        { score: 300, percent: 90 },
        { score: 450, percent: 95 },
        { score: 600, percent: 99 }
    ];
    AutoShowSurpassHint(_curscore: number) {
        // console.error('AutoShowSurpassHint', _curscore);

        // let _surpassInfo: { score: number, percent: number } = null as any;
        let _show = false;
        while (this.surpassLevel < this.SurpassLevelInfo.length) {
            let _info = this.SurpassLevelInfo[this.surpassLevel];
            if (_curscore < _info.score) {
                break;
            }
            _show = true;
            this.surpassLevel++;
        }
        if (_show) {
            this.element.SurpassHint.SetInfo({ percent: this.SurpassLevelInfo[this.surpassLevel - 1].percent });
            this.element.SurpassHint.Show();
        }

    }
    HideFlyTask() {
        this.element.gameFlyTaskBtn.visible = false;
        this.main.getTransition("flyTask").stop();
    }

    ShowFlyTask() {
        //如果正在执行动画则不再重复执行
        if (this.element.gameFlyTaskBtn.visible) {
            return;
        }
        this.element.gameFlyTaskBtn.visible = true;
        let _fly = this.main.getTransition("flyTask");
        _fly.timeScale = 0.8;
        // _fly.changePlayTimes(2);
        // let _y = (300 + Math.random() * 100) | 0;
        // this.element.gameFlyTaskBtn.setXY(-150, _y);
        _fly.play((Laya.Handler.create(this, () => {
            this.HideFlyTask();
        })));


    }
    // private haveTask = false;
    // CheckTaskState() {
    //     this.haveTask = false;
    //     //复活
    //     // if (GameLogic.reviveLeftTime > 0) 
    //     {
    //         TaskUtil.getTaskList(() => {
    //             let list = TaskUtil.getTasks();
    //             console.error('list', list);
    //             let _task = null as any;
    //             let _taskKey = '' as any;
    //             let _showtask = (_favorShop: boolean) => {
    //                 _task = list.find(v => v.id == reviveTask.attention.id);
    //                 console.log('_task', _task.title, _task.finish, _task.limit);

    //                 if (_favorShop && _task && _task.finish < _task.limit) {
    //                     _taskKey = 'attention';
    //                 }
    //                 else {
    //                     //浏览或收藏或邀请
    //                     let keys = ['browse', 'collect', 'invite'];
    //                     keys = keys.sort(v => Math.random() - 0.5);
    //                     // let _idx = Math.random() < 0.5 ? 0 : 1;
    //                     while (keys.length > 0) {
    //                         let _curKey = keys.pop();
    //                         _task = list.find(v => v.id == reviveTask[_curKey].id);
    //                         console.log('_task', _task.title, _task.finish, _task.limit);
    //                         if (_task && _task.finish < _task.limit) {
    //                             _taskKey = _curKey;
    //                             break;
    //                         }
    //                     }

    //                     // else {
    //                     //     _idx = 1 - _idx
    //                     //     _task = list.find(v => v.id == reviveTask[keys[_idx]].id);
    //                     //     console.log('_task', _task.title, _task.finish, _task.limit);
    //                     //     if (_task && _task.finish < _task.limit) {
    //                     //         _taskKey = keys[_idx];
    //                     //     }
    //                     // }
    //                 }
    //                 if (_task) {
    //                     this.element.RevivePopup.SetInfo(_taskKey, _task.title);
    //                     this.element.DoubleAwardPopup.SetInfo(_taskKey, _task.title);
    //                     this.haveTask = true;
    //                 }
    //                 else {
    //                     console.error('未找相关任务');
    //                     this.haveTask = false;
    //                 }
    //             }
    //             // console.log('关注店铺');
    //             //关注店铺
    //             TB.checkShopFavoredStatus((res) => {
    //                 console.log('关注店铺1', res);
    //                 _showtask(!res.isFavor);
    //             }, () => {
    //                 console.log('关注店铺2');
    //                 _showtask(false);
    //             })


    //         })
    //     }
    // }
}
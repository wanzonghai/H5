import HHAudio from "../Global/modules/Audio/HHAudio";
import FGUIMount from "../Global/modules/FGUI/FGUIMount";
import FGUIUtil from "../Global/modules/FGUI/FGUIUtil";
import { GameLogic, GameTaskType } from "./GameLogic";
import StartScene from "./StartScene";
import MainUtil from "../utils/MainUitl";
import { ModuleControl } from "../Global/Config";
import MyUtils from "../common/MyUtils";
import Alert from "../fgui/Alert";
import ModulePackage from "../module/ModulePackage";
import uiAlert from "../module/GeneralInterface/uiAlert";
import { ModuleSkins } from "../module/ModuleSkins";





export default class GameOver extends FGUIMount {



    //用到的FGUI中元件,必须和fgui名字一致
    element = {
        bg: null as fgui.GImage,

        restartBtn: null as fgui.GButton,
        overScoreIcon: null as fgui.GLoader,

        luckBagBtn: null as fgui.GButton,

        moreAwardBtn: null as fgui.GButton,
        goHomeBtn: null as fgui.GButton,
        goHomeBtn2: null as fgui.GButton,
        curScore: null as fgui.GTextField, //得分数量

        getAwardIcon: null as fgui.GImage,

        scorebg: null as fgui.GImage,
        scoreBtn: null as fgui.GButton,
        scoreNText: null as fgui.GTextField, //积分数量


        // title: null as fgui.GTextField,
    }
    // classType={
    //     startBtn:StartScene,
    // }
    //元件路径，在主组件下可以不填，路径以 . 隔开
    protected elementPath = {
        scoreNText: 'scoreBtn.scoreNText',
    };
    private stateCtrl: fgui.Controller = null as any;

    onStart() {
        // this.doubleAwardState(false);
        this.scoreY = this.element.scorebg.y;
        console.log(' this.scoreY', this.scoreY);
        this.stateCtrl = this.getController('statectrl');
        this.changeSkin();
        this.clickBtn();

    }
    private scoreY = 0;
    onShow() {
        this.element.bg.visible = false;
        this.element.scoreBtn.visible = false;
        FGUIUtil.ActionPopIn(this, () => {
            this.element.bg.visible = true;
            this.element.scoreBtn.visible = true;
        });
        // this.element.luckBagBtn.visible = GameLogic.canBuyluckybag;
        // this.element.moreAwardBtn.visible = !GameLogic.canBuyluckybag;
        // this.element.luckyTitle.visible = GameLogic.canBuyluckybag;
        // if (GameLogic.canBuyluckybag) {
        //     this.element.scorebg.y = Laya.stage.height / 2 + 20;
        // }
        // else {
        //     this.element.scorebg.y = Laya.stage.height / 2 - 20;
        // }

        //控制器
        let _idx = 0;
        let _gettask = GameLogic.GetGameOverTask();
        if (GameLogic.awardMult > 1 || !_gettask) {
            _idx = 1;
        }
        console.log('GameOver onShow', _idx, GameLogic.awardMult, _gettask);

        this.stateCtrl.selectedIndex = (_idx);
        this.element.getAwardIcon.visible = GameLogic.awardMult > 1;

        //数据信息
        this.listenText();


        // GameLogic.ListenLuckyBagState(this, this.listenBagState)


    }
    onHide() {
        // Laya.stage.off(GameLogic.LuckyBagEventKey, this, this.listenBagState);
    }


    onEnd() {
        Laya.stage.offAllCaller(this);
        Laya.timer.clearAll(this);
    }
    close(_callBack?: Function) {
        if (!this.visible) {
            return;
        }
        this.element.bg.visible = false;
        this.element.scoreBtn.visible = false;
        FGUIUtil.ActionPopOut(this, () => {
            _callBack && _callBack();
            this.Hide();
        })
    }
    changeSkin() {
        ModuleSkins.ChangeFguiICON(this.element.scoreBtn, 'integralIcon');
        ModuleSkins.ChangeSkin(this.element.overScoreIcon, 'integralIcon');
    }

    clickBtn() {
        //模块显示设置
        {
            // this.element.scoreBtn.visible = ModuleControl.EnableGift;
        }
        //双倍领取按钮
        this.element.moreAwardBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            console.log('doubelAwardBtn');
            this.close(() => {
                GameLogic.ShowDoubleAward();
            });

        })
        // //领取更多积分
        // this.element.moreAwardBtn.onClick(this, () => {
        //     HHAudio.PlayEffect('btn');
        //     console.log('moreAwardBtn');
        //     // console.error('待增加');
        //     // this.openUI(MiniTask);

        // })
        this.element.restartBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            console.log('restartBtn');
            MyUtils.showLoading();
            GameLogic.ChangeCoin(-GameLogic.gameExpendCoin, () => {
                // console.log('startBtn');
                // FGUIUtil.closeScene();
                MyUtils.closeLoading();
                //结算积分
                GameLogic.SettleGameScore();
                //重新开始
                GameLogic.Restart();
                //任务完成打点
                //MainUtil.analysis('enterGame', { type: 2 });

            }, () => {
                //活动错误
                if (uiAlert.AutoShowActivityState()) {
                    return;
                }
                new Alert("次数不足，做任务获取更多次数吧~", () => {
                    // this.openUI(Task);
                }, () => {
                });
                console.error('次数不足！');

            })

        })

        // let clicked = false;
        //积分按钮
        this.element.luckBagBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            console.log('luckBagImageBtn');
            GameLogic.BuyLuckyBag((_success: boolean, _price: string) => {
                // clicked = false;
                console.log('BuyLuckyBag _callbackFunc', _success, _price);
            }, 5);
        });
        let _gohome = () => {
            HHAudio.PlayEffect('btn');
            //结算积分
            GameLogic.SettleGameScore();
            // SceneUtil.CloseScene('MyGameScene');
            FGUIUtil.ShowScene(StartScene);
        }
        this.element.goHomeBtn.onClick(this, _gohome)
        this.element.goHomeBtn2.onClick(this, _gohome)

        //积分按钮
        this.element.scoreBtn.onClick(this, () => {
            if (!ModuleControl.EnableGift) {
                console.log('未开启兑换好礼模块');
                return;
            }
            HHAudio.PlayEffect('btn');
            console.log('scoreBtn');
            ModulePackage.Instance.Show('gift', 0, 0, this);
            // FGUIUtil.ShowFreeScene(Gift);

        })
    }
    // listenBagState(_data: any) {
    //     console.log('ListenLuckyBagState _callbackFunc', GameLogic.canBuyluckybag, _data);
    //     this.element.luckBagBtn.visible = GameLogic.canBuyluckybag;
    //     this.element.moreAwardBtn.visible = !GameLogic.canBuyluckybag;
    //     //完成任务并领取奖励
    //     MainUtil.sendTaskProgress(TaskID.LuckyBag, (pdata) => {
    //         MainUtil.sendGetTaskReward(TaskID.LuckyBag, (data) => {
    //             {
    //                 let luckybagInfo = {
    //                     type: 5, record: _data.record,
    //                     nickName: RankUtil.getMyPlayer().name,
    //                     payNum: _data.price
    //                 };
    //                 //显示奖励界面
    //                 let rewards = [];
    //                 if (data.reward && data.reward.count) {
    //                     rewards.push(data.reward);
    //                     luckybagInfo['rewardNum'] = data.reward.count;
    //                 }
    //                 if (data.reward2 && data.reward2.count) {
    //                     rewards.push(data.reward2);
    //                     luckybagInfo['rewardNum2'] = data.reward2.count;
    //                 }
    //                 //MainUtil.analysis('pay', luckybagInfo);
    //                 // console.error('GetReward22222');
    //                 // rewards.push(reward);
    //                 new GetReward({ type: 1, rewards: rewards, taskId: TaskID.LuckyBag });
    //                 PlayDataUtil.setData('buyLuckyTime', 0);
    //             }
    //         }, 2);
    //     });
    // }
    private perAdd = 1;
    private curScore = 0;
    private toScore = 0;
    listenText() {
        this.toScore = this.curScore = GameLogic.GetCurScore();
        this.element.curScore.text = '' + this.curScore;
        Laya.timer.clear(this, this.scoreUpdate);
        //增加金币动画
        if (GameLogic.awardMult > 1) {
            let _add = (GameLogic.awardMult - 1) * this.curScore;
            this.toScore = _add + this.curScore;
            this.perAdd = 1;
            if (_add > 120) {
                this.perAdd = _add / 120;
            }
            Laya.timer.frameLoop(1, this, this.scoreUpdate)
        }



        this.element.scoreNText.text = '' + GameLogic.GetScore();
        Laya.stage.on('score', this, () => {
            this.element.scoreNText.text = '' + GameLogic.GetScore();

        })

    }
    //积分增加动画
    scoreUpdate() {
        this.curScore += this.perAdd;
        if (this.curScore >= this.toScore) {
            this.curScore = this.toScore;
            Laya.timer.clear(this, this.scoreUpdate);
        }
        this.element.curScore.text = '' + (this.curScore | 0);
    }
    GameStart() {
    }
    GameRevive() {
    }
    // SetTaskInfo(_task: GameTaskType) {

    //     // this.element.gotIcon.visible = GameLogic.awardMult > 1;
    //     // _have = _have && !this.element.gotIcon.visible;
    //     // this.element.doubelAwardBtn.visible = _have;
    //     // this.element.goHomeBtn2.visible = _have;
    //     // this.element.goHomeBtn.visible = !_have;


    // }

    openUI(UIClass: any): void {
        MyUtils.showLoading();
        let demo: any = new UIClass();
    }
}
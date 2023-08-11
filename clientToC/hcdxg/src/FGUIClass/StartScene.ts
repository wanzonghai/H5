
import { PkgNameType } from '../Global/FGUIConfig';
import FGUIUtil from '../Global/modules/FGUI/FGUIUtil';
import GameScene from './GameScene';
import FGUIScene from './../Global/modules/FGUI/FGUIScene';
import SceneUtil from './../Global/modules/tools/SceneUtil';
import HHAudio from '../Global/modules/Audio/HHAudio';
import { GameLogic } from './GameLogic';
import MyUtils from '../common/MyUtils';
import { Global } from '../config/Global';
import Alert from './../fgui/Alert';
import MainUtil from './../utils/MainUitl';
import { ModuleControl } from '../Global/Config';
import ModulePackage from '../module/ModulePackage';
import { TaskLogic, TaskType } from '../module/Task/TaskLogic';
import uiActivityEndPopup from '../module/activity/uiActivityEndPopup';
import { ModuleGlobal } from '../module/ModuleGlobal';
import { ModuleStatistics } from '../module/ModuleStatistics';
import uiAlert from '../module/GeneralInterface/uiAlert';
import { ModuleSkins } from '../module/ModuleSkins';
import UIPackage = fgui.UIPackage;
import uiAwards from '../module/rank/uiAwards';
export default class StartScene extends FGUIScene {

    static INS: StartScene = null as any;
    pkgName: PkgNameType = 'StartScene';
    private curScore: number = 0;
    private lastScore: number = 0;
    private isPlaying: boolean = false;


    //用到的FGUI中元件,必须和fgui名字一致
    element = {
        startBtn: null as fgui.GButton,
        getCoinBtn: null as fgui.GButton,
        // bagBtn: null as fgui.GButton,
        rankBtn: null as fgui.GButton,
        // coinBtn: null as fgui.GButton,
        scoreBtn: null as fgui.GButton,
        ruleBtn: null as fgui.GButton,
        // expendCoin: null as fgui.GTextField, //消耗金币数量
        coinNText: null as fgui.GTextField, //金币数量
        scoreNText: null as fgui.GTextField, //积分数量
        // bagBubble: null as fgui.GImage, //奖品包气泡
        // bagNText: null as fgui.GTextField, //奖品包数量
        getCoinBubble: null as fgui.GImage, //领金币气泡
        getCoinNText: null as fgui.GTextField, //领金币数量


        scoreIcon: null as fgui.GLoader, //积分icon
        // ruleIcon: null as fgui.GLoader, //规则icon
        // rankIcon: null as fgui.GLoader, //排行icon
        // taskIcon: null as fgui.GLoader, //任务icon
        bg: null as fgui.GLoader, //背景图片


        awardShow: null as fgui.GComboBox, //奖品显示图

        // title: null as fgui.GTextField,
    }
    // classType={
    //     startBtn:StartScene,
    // }
    //元件路径，在主组件下可以不填，路径以 . 隔开
    protected elementPath = {
        // expendCoin: 'startBtn.expendCoin',
        coinNText: 'startBtn.coinNText',
        scoreNText: 'scoreBtn.scoreNText',
        // bagBubble: 'bagBtn.bubbleBG',
        // bagNText: 'bagBtn.bagNText',
        getCoinBubble: 'getCoinBtn.bubbleBG',
        getCoinNText: 'getCoinBtn.bagNText',
        scoreIcon: 'scoreBtn.icon',
    }

    private static isFist = true;

    onStart() {

        ModuleStatistics.ChangeCurGameState('beforeGame');
        StartScene.INS = this;


        this.changeSkin();
        this.clickBtn();
        this.listenText();
        //关闭所有laya场景
        Laya.Scene.closeAll();
        this.setAwardInfo();

        // GameLogic.checkLogin();
        // GameLogic.checkVIP();
        // GameLogic.checkMember();

        if (StartScene.isFist) {
            StartScene.isFist = false;
            // if (ModuleGlobal.ActivityState == 'on') {

            // }
            //活动结束 暂时关闭简易版审核用
            uiActivityEndPopup.AutoShowActivityEnd((_show) => {
                if (!_show && StartScene.INS && ModuleGlobal.IsActivityOn()) {
                    TaskLogic.AutoShowExtraPopup(TaskType.dayGift);
                }
            })


        }
        // //获取活动是否结束
        // {
        //     ServerAPI.Cloud.Connect('GetRankReward', {
        //         callBack: (success, _getdata, code) => {
        //             console.log('GetRankReward', success, _getdata, code);
        //             if (code == 0 || code == -3) {
        //                 FGUIUtil.ShowFreeScene(ActivityEndPopup, (_class: ActivityEndPopup) => {
        //                     _class.SetInfo({
        //                         haveAward: code == 0,
        //                         _awardData: _getdata,
        //                     });
        //                 });
        //                 if (code == 0) {
        //                     ////MainUtil.analysis('rankAward', { type: _getdata.rewardType });
        //                 }
        //             }
        //             else {
        //                 let _checkState = () => {
        //                     MainUtil.checkGetTradesSold();
        //                     this.showDailyGift();
        //                     GameLogic.CheckLuckyBagState();
        //                 }
        //                 if (StartScene.isFist) {
        //                     NoticeBoard.AutoShow('startGame', () => {
        //                         _checkState();
        //                     });
        //                     StartScene.isFist = false;
        //                 }
        //                 else {
        //                     _checkState();
        //                 }
        //             }

        //         }
        //     })
        // }
        // GameLogic.ListenLuckyBagState(this, (_data) => {
        //     console.log('ListenLuckyBagState _callbackFunc', GameLogic.canBuyluckybag, _data);
        //     //如果不是在任务界面就监听礼包状态
        //     if (Task.InTask || NoticeBoard.InNotice) {
        //         return;
        //     }
        //     //完成任务并领取奖励
        //     MainUtil.sendTaskProgress(TaskID.LuckyBag, (pdata) => {
        //         MainUtil.sendGetTaskReward(TaskID.LuckyBag, (data) => {
        //             {
        //                 let luckybagInfo = {
        //                     type: 3, record: _data.record,
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
        //                 ////MainUtil.analysis('pay', luckybagInfo);
        //                 // console.error('GetReward22222');
        //                 // rewards.push(reward);
        //                 new GetReward({ type: 1, rewards: rewards, taskId: TaskID.LuckyBag });
        //                 PlayDataUtil.setData('buyLuckyTime', 0);
        //             }
        //         });
        //     });
        // })

        // Laya.stage.on(Global.hallConfig.EventEnum.VIP_STATE_CHANGE, this, () => {
        //     //刷新vip图片状态
        //     // let vipImg = this._view.getChild("avatarCom").asCom.getChild('vip').asImage;
        //     // vipImg.visible = (PlayDataUtil.data.isVip == 1);
        //     GameLogic.checkVIP();
        // });

        this.refreshNewNumber();
        // GameLogic.GetActivityState();

        Laya.timer.loop(1000, this, this.countDownUpdate);



        if (ModuleGlobal.ActivityState == 'on') {
            //尝试领取好友奖励
                 //邀请好友界面 简易版暂时关闭审核用
           TaskLogic.ReceiveTaskAward(TaskType.friendship, () => { }, true);
        }


        // ModulePackage.Instance.Show("base", 100, 100, this.main);
        this.showCoin();
    }
    setAwardInfo() {
        uiAwards.GetRankData((_getData) => {
            if (!_getData.data || _getData.data.length <= 0) {
                return;
            }
            let _awardData = _getData.data[0];
            let _awardLoader = this.element.awardShow.getChild('awardLoader') as fgui.GLoader;
            let _priceText = this.element.awardShow.getChild('priceText') as fgui.GTextField;
            _awardLoader.url = _awardData.prizePicture;
            _priceText.text = '' + _awardData.prizePrice;

        })
    }

    showCoin() {
        this.curScore = GameLogic.GetCurScore();
        this.lastScore = GameLogic.GetScore();
        if (this.curScore <= 0) {
            return;
        }
        this.isPlaying = true;
        let coinNum = 7;//Math.ceil(GameLogic.GetCurScore() / 5);
        let index = 0;
        let icon = this.element.scoreBtn.getChild("icon");
        for (let i = 0; i < coinNum; i++) {
            let image = UIPackage.createObject("GameCommon", "gamejifen").asImage;
            image.x = Laya.stage.width / 2;
            image.y = Laya.stage.height / 2;
            this.main.addChild(image);

            Laya.Tween.to(image, { x: image.x + (i < (coinNum / 2) ? -100 : 100), y: image.y + ((1 - 2 * Math.random()) * 100) }, 400, Laya.Ease.backInOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(image, { x: this.element.scoreBtn.x - this.element.scoreBtn.width / 2, y: this.element.scoreBtn.y }, Math.random() * 500 + 500, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
                    image.removeFromParent();
                    index++;
                    if (index >= coinNum) {
                        //Laya.Tween.clearTween(icon);
                    }
                    if (index == 1) {
                        Laya.timer.loop(50, this, this.updateScore);
                    }
                }))
            }))
        }

        if (coinNum > 0) {
            let _scaleLoop = () => {
                const _sb = 1.15;
                const _ss = 0.85;
                const _t = 400;
                Laya.Tween.to(icon, { scaleX: _sb, scaleY: _sb }, _t, undefined, Laya.Handler.create(this, () => {
                    Laya.Tween.to(icon, { scaleX: _ss, scaleY: _ss }, _t, undefined, Laya.Handler.create(this, _scaleLoop));
                }));
            }
            _scaleLoop();
        }
    }

    onEnd() {
        StartScene.INS = null;
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
    }
    clickBtn() {
        //模块显示设置
        {
            // this.element.bagBtn.visible = ModuleControl.EnableBag;
            this.element.rankBtn.visible = ModuleControl.EnableScoreRank;
            // this.element.scoreBtn.visible = ModuleControl.EnableGift;
            this.element.getCoinBtn.visible = ModuleControl.EnableTask;
        }
        //开始按钮呼吸效果
        let _scaleLoop = () => {
            const _sb = 1.05;
            const _ss = 0.95;
            const _t = 800;
            Laya.Tween.to(this.element.startBtn, { scaleX: _sb, scaleY: _sb }, _t, undefined, Laya.Handler.create(this, () => {
                // console.log('big');
                Laya.Tween.to(this.element.startBtn, { scaleX: _ss, scaleY: _ss }, _t, undefined, Laya.Handler.create(this, _scaleLoop));
            }));
        }
        _scaleLoop();
        //开始按钮
        this.element.startBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            // ////MainUtil.analysis('clickGame');
            //
            ModuleStatistics.ClickGameBtn();
            if (uiAlert.AutoShowActivityState()) {
                return;
            }
            MyUtils.showLoading();
            GameLogic.ChangeCoin(-GameLogic.gameExpendCoin,
                () => {
                    // console.log('startBtn');
                    // FGUIUtil.closeScene();

                    SceneUtil.loadScene("MyGameScene");
                    MyUtils.closeLoading();
                    //任务完成打点
                    ////MainUtil.analysis('enterGame', { type: 1 });

                }, (_code: number) => {
                    MyUtils.closeLoading();
                    //活动错误
                    if (uiAlert.AutoShowActivityState()) {
                        return;
                    }
                    new Alert("次数不足，做任务获取更多次数吧~", () => {
                        // this.openUI(Task);
                        ModulePackage.Instance.Show('Task', 0, 0, this.main);
                    }, () => {
                    });
                    // console.error('次数不足！');
                    // console.error('次数不足！');
                    // if (_code == -10) {
                    //     new Alert("活动还未开始~", () => {
                    //     });
                    // }
                    // else if (_code == -11) {
                    //     new Alert("活动已结束，下次再来吧~", () => {
                    //     });
                    // }
                    // else {
                    //     new Alert("次数不足，做任务获取更多次数吧~", () => {
                    //         // this.openUI(Task);
                    //     }, () => {
                    //     });
                    //     console.error('次数不足！');
                    // }


                })
            console.log('startBtn111');

            // SceneUtil.loadScene("MyGameScene");

        })
        //领金币按钮
        this.element.getCoinBtn.onClick(this, () => {
            console.log('getCoinBtn11');
            HHAudio.PlayEffect('btn');

            // if (ModuleGlobal.ActivityState == 'off') {
            //     new Alert("活动已下线,下次再来吧~", () => {
            //         // this.openUI(Task);
            //     }, () => {
            //     });
            //     return;
            // }

            // this.openUI(Task);
            ModulePackage.Instance.Show('Task', 0, 0, this.main);



        })

        // //奖品包按钮
        // this.element.bagBtn.onClick(this, () => {
        //     console.log('bagBtn11');
        //     HHAudio.PlayEffect('btn');
        //     this.openUI(Bag);


        // })
        //奖品包按钮
        this.element.ruleBtn.onClick(this, () => {
            console.log('ruleBtn');
            HHAudio.PlayEffect('btn');
            // this.openUI(Rule);
            ////MainUtil.analysis('clickRule', {});
            ModulePackage.Instance.Show('Rule', 0, 0, this.main);

            // ServerAPI.Cloud.Connect('GetRankAllReward', {
            //     callBack: (success, _getdata, code) => {
            //         console.error('GetRankAllReward', success, _getdata, code);

            //     }
            // })

        })

        // //金币按钮
        // this.element.coinBtn.onClick(this, () => {
        //     console.log('coinBtn');
        //     // let _str = Global.hallConfig.Jsons.taskConfig;
        //     // for (let index = 0; index < TaskUtil._taskList.length; index++) {
        //     //     _str = JSON.stringify(TaskUtil._taskList[index]);
        //     //     new Alert(_str, () => {
        //     //     }, () => {
        //     //     });

        //     // }
        //     // _str = Global.hallConfig.Jsons.taskConfig;
        //     // new Alert(_str, () => {
        //     // }, () => {
        //     // });

        // })
        //积分按钮
        this.element.scoreBtn.onClick(this, () => {
            if (!ModuleControl.EnableGift) {
                console.log('未开启兑换好礼模块');
                return;
            }
            HHAudio.PlayEffect('btn');
            console.log('scoreBtn');
            // // FGUIUtil.ShowFreeScene(Gift);
            // if (ModuleGlobal.ActivityState == 'off') {
            //     new Alert("活动已下线,下次再来吧~", () => {
            //         // this.openUI(Task);
            //     }, () => {
            //     });
            //     return;
            // }
            ModulePackage.Instance.Show('gift', 0, 0, this.main);
        })

        // this.element.rankBtn.visible = false;
        this.element.rankBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            console.log('rankBtn');
            ModulePackage.Instance.Show('rank', 0, 0, this.main);
            // FGUIUtil.ShowFreeScene(ScoreRank);
        })
    }
    listenText() {
        // this.element.expendCoin.text = '' + GameLogic.gameExpendCoin;
        this.element.coinNText.text = '' + GameLogic.GetCoin();

        // this.element.bagNText.text = '' + GameLogic.GetNewInBag();
        this.element.getCoinNText.text = '' + GameLogic.GetNewInCoin();
        //监听数据变化
        Laya.stage.on('coin', this, () => {
            this.element.coinNText.text = '' + GameLogic.GetCoin();
        })
        this.element.scoreNText.text = '' + GameLogic.GetScore();
        Laya.stage.on('score', this, () => {
            if (!this.isPlaying) {
                this.element.scoreNText.text = '' + GameLogic.GetScore();
            }
        })
        // Laya.stage.on('newInBag', this, () => {
        //     this.element.bagNText.text = '' + GameLogic.GetNewInBag();
        // })
        Laya.stage.on('newInCoin', this, () => {
            this.element.getCoinNText.text = '' + GameLogic.GetNewInCoin();
        })
    }

    updateScore() {
        let scoreAdd = Math.max(Math.floor(this.curScore / 40), 1);
        let score = parseInt(this.element.scoreNText.text);
        if (score + scoreAdd >= this.curScore + this.lastScore) {
            scoreAdd = this.curScore + this.lastScore - score;
        }
        if (score < this.curScore + this.lastScore) {
            this.element.scoreNText.text = "" + (score + scoreAdd);
        } else {
            this.element.scoreNText.text = '' + GameLogic.GetScore();
            this.isPlaying = false;
            this.curScore = 0;
            this.lastScore = 0;
            let icon = this.element.scoreBtn.getChild("icon");
            Laya.Tween.clearTween(icon);
            Laya.timer.clear(this, this.updateScore);
        }
    }

    changeSkin() {
        ModuleSkins.ChangeSkin(this.element.bg, 'bgImage');
        ModuleSkins.ChangeSkin(this.element.scoreIcon, 'integralIcon');
        ModuleSkins.ChangeFguiICON(this.element.ruleBtn, 'ruleIcon');
        ModuleSkins.ChangeFguiICON(this.element.rankBtn, 'rankingIcon');
        ModuleSkins.ChangeFguiICON(this.element.getCoinBtn, 'numberIcon');
        ModuleSkins.ChangeFguiICON(this.element.startBtn, 'StartIcon');
    }
    countDownUpdate() {
        // //任务数量
        // TaskUtil.updateCountDownTask();
        // // TaskUtil.getTaskGets();
        // let _taskN = TaskUtil.getTaskGets();
        // // let _taskN = this.taskPointN;
        // // if (this.countDownTask.length > 0) {
        // //     for (const timetask of this.countDownTask) {
        // //         let cache = TaskUtil.getCache(timetask.id);
        // //         let _spanTime = MainUtil.getTimeSpan(cache, new Date().getTime());
        // //         if (timetask.need <= _spanTime) {
        // //             _taskN++;
        // //         }
        // //     }
        // // }
        // this.element.getCoinNText.visible = _taskN > 0;
        // this.element.getCoinBubble.visible = this.element.getCoinNText.visible;
        // // console.error('getCoinBubble', _taskN, this.element.getCoinBubble.visible);

        // if (this.element.getCoinNText.visible) {
        //     this.element.getCoinNText.text = '' + _taskN;
        // }

    }
    // private taskPointN = 0;
    // //未完成的倒计时任务
    // private countDownTask: { id: number, need: number, }[] = []

    refreshNewNumber() {
        let _refresh = (_n: number) => {
            console.log('_refresh');
            this.element.getCoinBubble.visible = _n > 0;
            this.element.getCoinNText.visible = _n > 0;
            if (this.element.getCoinNText.visible) {
                this.element.getCoinNText.text = '' + _n;
            }
            // this.countDownTask = [];
            // this.taskPointN = 0;
            // MainUtil.reqStateChange((_data: any) => {
            //     //返回数据 data:{bag_num:1,task_num:2}
            //     console.log('refreshNewNumber _data', _data);
            //     // this.taskPointN = _data.task_num;
            //     // let _bagN = _data.bag_num;
            //     // let _taskN = this.taskPointN = _data.task_num;
            //     // this.element.bagBubble.visible = _bagN > 0;
            //     // this.element.bagNText.visible = _bagN > 0;
            //     // if (this.element.bagNText.visible) {
            //     //     this.element.bagNText.text = '' + _bagN;
            //     // }

            // })
        }
        _refresh(GameLogic.listenRefreshNewNumber());
        Laya.stage.on('refreshBubbleUI', this, _refresh)


    }
    showDailyGift() {
        // if (!ModuleControl.EnableTask) {
        //     return;
        // }
        // //查看是否有礼包可开启
        // let result = TaskUtil.checkGift();
        // console.log('showDailyGift result', result);

        // if (result.isOpen) {
        //     ////MainUtil.analysis('hallShowGift', {});
        //     new openGift(false, () => {
        //         ////MainUtil.analysis('hallOpenGift', {});
        //         MainUtil.sendGetTaskReward(result.id);
        //     }, () => {
        //         // showNoticeFunc();
        //     });
        // }
    }
    openUI(UIClass: any): void {
        MyUtils.showLoading();
        let demo: any = new UIClass();
    }
    NewAlert(_str: string) {
        new Alert(_str, () => { }, () => { });
    }







}
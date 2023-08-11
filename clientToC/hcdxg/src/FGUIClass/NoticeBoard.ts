import MyUtils from "../common/MyUtils";
import PlayDataUtil from "../data/PlayDataUtil";
import GetReward from "../fgui/GetReward";
import { ModuleControl } from "../Global/Config";
import { PkgNameType } from "../Global/FGUIConfig";
import HHAudio from "../Global/modules/Audio/HHAudio";
import FGUIScene from "../Global/modules/FGUI/FGUIScene";
import FGUIUtil from "../Global/modules/FGUI/FGUIUtil";
import ServerAPI from "../Global/modules/Server/ServerAPI";
import TimeUtil from "../Global/modules/tools/TimeUtil";
import MainUtil from "../utils/MainUitl";
import RankUtil from "../utils/RankUtil";
import { TaskID } from "../utils/TaskUtil";
import { GameLogic } from "./GameLogic";



export default class NoticeBoard extends FGUIScene {


    pkgName: PkgNameType = 'GameCommon';
    mainName = 'NoticeBoard';

    //用到的FGUI中元件,必须和fgui名字一致
    element = {
        bg: null as fgui.GImage,
        closeBtn: null as fgui.GButton,
        noticeLoader: null as fgui.GLoader,//公告图片区
        luckyImageBtn: null as fgui.GImage,//福袋图片按钮
        hintText: null as fgui.GTextField,
        // title: null as fgui.GTextField,
    }
    mountPath = {

    };
    // classType={
    //     startBtn:StartScene,
    // }
    //元件路径，在主组件下可以不填，路径以 . 隔开
    protected elementPath = {

    }
    private leftTime = 0;
    static InNotice = false;
    private static curscene: 'startGame' | 'endGame' = 'startGame';

    private static endCallBack?: Function
    static AutoShow(scene: 'startGame' | 'endGame', _endCallBack?: Function) {
        if (!ModuleControl.EnableNotice) {
            _endCallBack && _endCallBack();
            return;
        }
        this.curscene = scene;
        MyUtils.showLoading();
        this.endCallBack = _endCallBack;
        ServerAPI.Cloud.Connect('Notice', {
            sendData: { scene: scene },
            callBack: (_success, _data) => {
                if (_success) {
                    FGUIUtil.ShowFreeScene(NoticeBoard, (_scene: NoticeBoard) => {
                        GameLogic.canBuyluckybag = !_data.isBuyLuckyBag;
                        console.log('可购买福袋状态', GameLogic.canBuyluckybag);

                        let _url = _data.isBuyLuckyBag ? _data.no : _data.yes;
                        _scene.setInfo(_url, !_data.isBuyLuckyBag);
                    });
                }
                else {
                    console.error('公告获取失败', scene);
                    _endCallBack && _endCallBack();

                }
                MyUtils.closeLoading();
            }
        })
    }

    onStart() {
        this.element.luckyImageBtn.visible = false;
        this.clickBtn();
        this.listenText();

    }
    onShow() {
        // for (let index = 0; index < 3; index++) {
        //     // this.element.giftList.addItem();
        //     console.error('giftList');
        //     this.element.giftList.addChild(new GiftItem());

        // }
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
        this.element.bg.visible = false;
        FGUIUtil.ActionPopIn(this.main, () => {
            this.element.bg.visible = true;
            Laya.timer.loop(1000, this, () => {
                this.leftTime--;
                this.element.hintText.setVar('count', '' + this.leftTime).flushVars();
                if (this.leftTime <= 0) {
                    Laya.timer.clearAll(this);
                    this.Close();
                }
            })
        })
        GameLogic.ListenLuckyBagState(this, this.listenBagState)
        NoticeBoard.InNotice = true;
    }
    onHide() {
        Laya.stage.off(GameLogic.LuckyBagEventKey, this, this.listenBagState)
        Laya.stage.event('refreshBubble');
        NoticeBoard.InNotice = false;
    }

    onEnd() {
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
    }
    clickBtn() {
        //开始按钮
        this.element.closeBtn.onClick(this, () => {
            HHAudio.PlayEffect('btn');
            console.log('closeBtn');
            this.Close();
        })


        let clicked = false;
        this.element.noticeLoader.onClick(this, () => {
            if (!this.haveLuckyBtn) {
                return;
            }
            if (clicked) {
                return;
            }
            // clicked = true;
            HHAudio.PlayEffect('btn');
            console.log('luckyImageBtn');
            GameLogic.BuyLuckyBag(() => {
                // clicked = false;
            }, NoticeBoard.curscene == 'endGame' ? 4 : 3);

        })
        // this.element.luckyImageBtn.onClick(this, () => {
        //     if (clicked) {
        //         return;
        //     }
        //     clicked = true;
        //     HHAudio.PlayEffect('btn');
        //     console.log('luckyImageBtn');
        //     GameLogic.BuyLuckyBag(() => {
        //         clicked = false;
        //         GameLogic.ListenLuckyBagState(this, (_data) => {
        //             clicked = false;
        //             this.Close();
        //         })
        //     });

        // })

    }
    listenBagState(_data: any) {
        //完成任务并领取奖励
        MainUtil.sendTaskProgress(TaskID.LuckyBag, (pdata) => {
            MainUtil.sendGetTaskReward(TaskID.LuckyBag, (data) => {
                {
                    let luckybagInfo = {
                        type: NoticeBoard.curscene == 'endGame' ? 4 : 3, record: _data.record,
                        nickName: RankUtil.getMyPlayer().name,
                        payNum: _data.price
                    };
                    //显示奖励界面
                    let rewards = [];
                    if (data.reward && data.reward.count) {
                        rewards.push(data.reward);
                        luckybagInfo['rewardNum'] = data.reward.count;
                    }
                    if (data.reward2 && data.reward2.count) {
                        rewards.push(data.reward2);
                        luckybagInfo['rewardNum2'] = data.reward2.count;
                    }
                    //MainUtil.analysis('pay', luckybagInfo);
                    // console.error('GetReward22222');
                    // rewards.push(reward);
                    new GetReward({ type: 1, rewards: rewards, taskId: TaskID.LuckyBag });
                    PlayDataUtil.setData('buyLuckyTime', 0);
                }
            }, NoticeBoard.curscene == 'endGame' ? 2 : 1);
        });
        this.Close();
    }

    Close(_callBacK?: Function) {
        if (!this.main.visible) {
            return;
        }
        this.element.bg.visible = false;
        FGUIUtil.ActionPopOut(this.main, () => {
            this.Hide();

            _callBacK && _callBacK();
            NoticeBoard.endCallBack && NoticeBoard.endCallBack();
            NoticeBoard.endCallBack = undefined;

        })

    }
    listenText() {
        // this.element.updateTime.text = '' + GameLogic.GetCurScore();
    }
    private haveLuckyBtn = false;
    private setInfo(url: string, _haveLuckyBtn: boolean) {
        this.element.noticeLoader.url = url;
        // this.element.luckyImageBtn.visible = _haveLuckyBtn;
        this.haveLuckyBtn = _haveLuckyBtn;

        this.leftTime = 5;
        this.element.hintText.setVar('count', '' + this.leftTime).flushVars();
    }
}
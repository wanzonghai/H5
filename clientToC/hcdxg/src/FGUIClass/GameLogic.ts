
import PlayDataUtil from '../data/PlayDataUtil';
import TB from '../platform/TB';
import MainUtil from './../utils/MainUitl';
import { Global } from './../config/Global';
import GetScore, { GetScoreInfo } from './FGUIPrefab/GetScore';
import { GameAwardInfo } from './GameAward';
import ComboEffect, { ComboEffectInfo } from './FGUIPrefab/ComboEffect';
// import { TaskID } from '../utils/TaskUtil';
import ServerAPI from '../Global/modules/Server/ServerAPI';
import Invite from '../fgui/Invite';
import { ClockUtil } from '../Global/modules/tools/TimeUtil';
import uiAutotriggerAward from '../module/autotriggerAward/uiAutotriggerAward';
import { TaskLogic, TaskStatusType, TaskType } from './../module/Task/TaskLogic';
import { ModulePlatformAPI } from './../module/ModulePlatformAPI';
import { GCurrencyType, ModuleGlobal } from '../module/ModuleGlobal';
import { ModuleGameInfo } from '../module/ModuleGameInfo';
import HHAudio from '../Global/modules/Audio/HHAudio';
import { ModuleStatistics } from '../module/ModuleStatistics';
import ModulePackage from '../module/ModulePackage';
export enum ActivityState {
    unStart = 0,
    open = 1,
    end = 2,
}

//游戏内可做任务名
export const GameTasksName = {
    joinMember: '加入会员',
    attention: '关注店铺',
    browse: '浏览商品',
    collect: '收藏商品',
    buy: '购买商品',
    share: '分享游戏',
    browseStore: '浏览店铺',
}
//游戏内可做任务类型
export type GameTaskType = keyof typeof GameTasksName;

//飞入的任务信息
export const GameFlyTaskAwardInfo = {
    clearFruit: {
        title: '水果消除',
        iconPic: 'GameTask_Icon1',
        titlePic: 'GameTask_Title1',
        desc: '消除当前屏幕1/3水果',
        data: 0.3,
    },
    removeFruit: {
        title: '水果清除',
        iconPic: 'GameTask_Icon2',
        titlePic: 'GameTask_Title2',
        desc: '清除当前屏幕等级4以下的水果',
        data: 4,

    },
    supperFruit: {
        title: '万能水果',
        iconPic: 'GameTask_Icon3',
        titlePic: 'GameTask_Title3',
        desc: '可合并任意一个水果',
        data: 1,
    },
    addScore: {
        title: '积分奖励',
        iconPic: 'GameTask_Icon4',
        titlePic: 'GameTask_Title4',
        desc: '积分+50',
        data: 50,
    },
}
//飞入的任务类型
export type GameFlyTaskAwardType = keyof typeof GameFlyTaskAwardInfo;

class GameLogic_c {
    //总人数
    //----------------------------游戏状态信息----------------------------//
    isInGame = false;
    //游戏内ui场景类
    gameScene: any = null;
    //游戏内物理场景类
    myGameScene: any = null;
    //----------------------------游戏数据信息----------------------------//
    //水果信息
    readonly fruitConfig = [
        // {//葡萄
        //     image: 'fruit_1.png',//本地图片名
        //     imagesW: 70,
        //     score: 0,

        // },
        {//樱桃
            image: 'fruit_2.png',//本地图片名
            imagesW: 145,
            score: 0
        },
        {//橘子
            image: 'fruit_3.png',//本地图片名
            imagesW: 170,
            score: 1
        },
        {//柠檬
            image: 'fruit_4.png',//本地图片名
            imagesW: 200,
            score: 2
        },
        {//猕猴桃
            image: 'fruit_5.png',//本地图片名
            imagesW: 230,
            score: 3
        },
        {//番茄
            image: 'fruit_6.png',//本地图片名
            imagesW: 260,
            score: 4
        },
        // {//桃子
        //     image: 'fruit_7.png',//本地图片名
        //     imagesW: 280,
        //     score: 6
        // },
        {//菠萝
            image: 'fruit_8.png',//本地图片名
            imagesW: 290,
            score: 5
        },
        {//椰子
            image: 'fruit_9.png',//本地图片名
            imagesW: 330,
            score: 6
        },
        {//桃子
            image: 'fruit_10.png',//本地图片名
            imagesW: 380,
            score: 7
        },
        {//菠萝
            image: 'fruit_11.png',//本地图片名
            imagesW: 430,
            score: 8
        },
    ]
    //道具水果
    readonly propFruitConfig = {
        //超级水果
        supper: {
            image: 'fruit_supper.png',//本地图片名
            imagesW: 170,
            score: 0,
        },
    }
    //合成水果得分
    // readonly fruitScore = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    //合成最高阶额外得分
    readonly maxExtScore = 100;
    gameExpendCoin = 1;
    //本局分数
    curScore = 0;
    //我的金币
    myCoin = 1;
    //我的积分
    myScore = 2;

    //奖品包里物品数量
    newInBag = 3;
    //领金币里物品数量
    newInCoin = 4;
    //合成的最高水果种类
    curTopKind = 0;
    //可以合成的最高水果种类
    maxFruitKind = 11;

    //水果最高位置
    fruitTopY = 2000;
    //连消次数
    comboTime = 0;
    //上次连消水果id
    lastComboId = -1;
    // //玩游戏时间
    // playGameTime = 0;

    //水果有效高度
    gameFruitValidY = { bottom: 0, top: 0 };



    //游戏状态（0未开始，1开始，2游戏中，3结束）
    gameState = 0;

    isGameFail = false;
    reviveLeftTime = 1;
    //结算奖励倍数
    awardMult = 1;
    //是否已经获取过游戏内优惠券奖励
    isGotGameAward = false;

    isPause = false;

    private gameClockName = 'GameClock';

    //游戏每局uid,保证每局唯一
    private gameuid = 0;

    //-------------------------------------------------------------------//

    private static instance: GameLogic_c = null as any;
    static INS() {
        if (!this.instance) {
            this.instance = new GameLogic_c();
        }
        return this.instance;
    }
    Init() {
        this.gameState = 0;
        //可合成的最高水果
        this.maxFruitKind = this.fruitConfig.length;
        this.InitCoin();
        this.InitScore();

        ModuleGameInfo.GetGameInfo('watermelong', (_success, _info) => {
            console.log('GetGameInfo', _info);
            if (_success) {
                let _fs: { id: number, url: string, custom: boolean }[] = [];
                for (let index = 0; index < _info.iconList.length; index++) {
                    const element = _info.iconList[index][0];
                    let _fruit: { id: number, url: string, custom: boolean } = {
                        id: index + 1,
                        url: element.url,
                        custom: element.custom || false,
                    }
                    _fs.push(_fruit);
                    this.SetAndPreLoadFruit(_fs);

                };

            }

        });

    }
    //----------------------------------------游戏生命周期---------------------------------//
    private restartTimeID = null as any;
    Restart() {
        ModuleStatistics.ChangeCurGameState('game');
        this.isGameFail = false;
        this.gameState = 1;
        if (this.restartTimeID) {
            clearTimeout(this.restartTimeID);
            this.restartTimeID = 0;
        }
        //防止场景未加载完成
        if (!this.gameScene || !this.myGameScene) {
            this.restartTimeID = setTimeout(() => {
                this.Restart();
            }, 100);
            return;
        }
        //开启游戏计时器
        ClockUtil.Start(this.gameClockName);
        ClockUtil.insertEvent(this.gameClockName, {
            interval: 1, //间隔时间(最小0.001s)
            callBack: (clockTag: string, tag: string, _n: number) => {
                // console.log('insertEvent 触发', clockTag, tag, _n);

                this.AutoTriggerGameFlyTask();
            }
        })

        this.gameuid = ((Date.now() + Math.random()) * 10000) | 0;
        // this.playGameTime = 0;
        this.fruitTopY = 2000;
        this.comboTime = 0;
        this.ResetCurScore();
        this.gameScene && this.gameScene.GameStart();
        this.myGameScene && this.myGameScene.GameStart();
        this.gameState = 2;
        this.reviveLeftTime = 1;
        this.awardMult = 1;

        this.isGotGameAward = false;
        this.ResetGameFlyTask();
        this.ResetGameoverTask();

        //更新一次福袋购买状态
        this.CheckLuckyBagState();
        this.PauseGame(false)



    }
    Revive() {
        this.comboTime = 0;
        this.isGameFail = false;
        this.gameState = 1;
        this.fruitTopY = 2000;
        this.gameScene && this.gameScene.GameRevive();
        this.myGameScene && this.myGameScene.GameRevive();
        this.gameState = 2;
        this.awardMult = 1;
        this.reviveLeftTime--;
        this.PauseGame(false);
        HHAudio.PlayEffect('revive');
    }
    GameOver(_fail = true) {
        this.isGameFail = _fail;
        this.gameState = 3;
        this.PauseGame(true);
        // console.log('gamelogic GameOver', this.gameScene, this.myGameScene);

        if (!_fail) {
            this.curScore = 0;
        }
        this.gameScene && this.gameScene.GameOver();
        this.myGameScene && this.myGameScene.GameOver();
        if (_fail) {
            HHAudio.PlayEffect('gameOver');
        }
    }
    ShowGameOverPopup(awrdN = 1) {
        this.awardMult = awrdN;
        this.gameScene && this.gameScene.showGameOver(true);
        if (awrdN == 2) {
            HHAudio.PlayEffect('getDoubleScore');
        }
        ModuleStatistics.ChangeCurGameState('afterGame');
    }
    ShowDoubleAward() {
        this.gameScene && this.gameScene.showDoubleAward(true);
    }
    PauseGame(_pause: boolean) {
        if (!this.isInGame) {
            return;
        }
        this.isPause = _pause;
        // this.GameClock(!_pause);
        if (_pause) {
            ClockUtil.Pause(this.gameClockName);
        }
        else {
            ClockUtil.Resume(this.gameClockName);
        }
        this.gameScene && this.gameScene.GamePause(_pause);
    }
    InGame() {
        this.isInGame = true;

    }
    OutGame() {
        this.isInGame = false;
        if (this.restartTimeID) {
            clearTimeout(this.restartTimeID);
            this.restartTimeID = 0;
        }
        ClockUtil.Stop(this.gameClockName);
    }
    //阻止游戏内点击事件
    private gameTouchEnabled = true;
    PreventGameTouch() {
        this.gameTouchEnabled = false;
        Laya.timer.frameOnce(2, this, this.restoreGameTouchState);
    }
    restoreGameTouchState() {
        this.gameTouchEnabled = true;
    }
    IsGameTouchEnable() {
        return this.gameTouchEnabled;
    }
    // private clockIntervalId = null as any;
    // //游戏计时器
    // GameClock(_resume = true) {


    //     let _curstate = !!this.clockIntervalId;

    //     console.error('GameClock', _resume, _curstate);
    //     if (_resume == _curstate) {
    //         return;
    //     }
    //     if (this.clockIntervalId) {
    //         clearInterval(this.clockIntervalId);
    //         this.clockIntervalId = null;
    //     }
    //     if (_resume) {

    //         //更新间隔s
    //         const _add = 0.1;
    //         this.clockIntervalId = setInterval(() => {

    //             //保留小数点后三位
    //             this.playGameTime = Number((this.playGameTime + _add).toFixed(3));
    //             //每n秒触发一次
    //             const n = 1;
    //             if (((this.playGameTime * 10) | 0) % (n * 10) == 0) {
    //                 this.AutoTriggerGameFlyTask();
    //             }
    //         }, _add * 1000);
    //     }

    // }
    //----------------------------------------游戏数据逻辑---------------------------------//
    //合成水果
    NewFruit(_kind: number) {
        if (_kind > this.curTopKind) {
            this.curTopKind = _kind;
        }
    }
    //结算游戏积分
    SettleGameScore() {
        let _addscore = ((this.curScore / 1) * this.awardMult + 0.5) | 0;
        // MainUtil.sendChangePoint(_addscore);
        this.ChangeScore(_addscore);
        //this.ResetCurScore();
        Laya.stage.event('curScore');
    }
    //-----------------------------------界面显示控制--------------------------------//
    //显示获得分数效果
    ShowGetScoreEffect(_info: GetScoreInfo) {
        if (!this.gameScene) {
            return;
        }
        GetScore.Create(_info);
    }

    //显示连击效果
    ShowComboEffect(_comboN: number) {
        if (!this.gameScene) {
            return;
        }
        ComboEffect.Create({ comboN: _comboN, pos: [375, Laya.stage.height / 2] });
    }
    //显示合成奖励弹窗
    ShowMergeAward(_data: GameAwardInfo) {
        console.log('gameScene.ShowGameAward');
        this.gameScene && this.gameScene.ShowGameAward(_data);
    }
    //显示开场提示
    ShowStartHint(_show: boolean) {
        this.gameScene && this.gameScene.ShowStartHint(_show);
    }


    //--------------------------水果皮肤---------------------//
    private fruitUrlObj = {};
    //获取水果url列表，并预加载水果
    SetAndPreLoadFruit(_fruitinfo: { id: number, url: string, custom: boolean }[]) {
        let _urls = [];
        for (let index = 0; index < _fruitinfo.length; index++) {
            const fruit = _fruitinfo[index];
            _urls.push(fruit.url);
            this.fruitUrlObj['id' + fruit.id] = { url: fruit.url, custom: fruit.custom };
        }
        console.log('SetAndPreLoadFruit fruitUrlObj', this.fruitUrlObj);
        console.log('_urls', _urls);

        Laya.loader.load(_urls, Laya.Handler.create(this, (isSuccess) => {
            console.log('水果皮肤加载完毕：', isSuccess);
        }));
    }
    GetFruitUrlInfo(_id: number | string): { url: string, custom: boolean } {
        if (typeof _id == 'number') {
            let _info = this.fruitUrlObj['id' + _id];
            if (_info) {
                return _info;
            }
            return { url: `img/fruits/` + this.fruitConfig[_id - 1].image, custom: false };
        }
        else {
            return { url: `img/fruits/` + this.propFruitConfig[_id].image, custom: false };
        }

    }
    GetFruitConfig(_id: number | string) {
        if (typeof _id == 'number') {
            return this.fruitConfig[_id - 1];
        }
        return this.propFruitConfig[_id];

    }
    //--------------------------金币信息---------------------//
    SetGameExpendCoin(_coin: number) {
        console.error('不从服务端设置花费次数数量', _coin);

        // this.gameExpendCoin = _coin;
    }
    InitCoin() {

        // this.myCoin = _coin;
        // Laya.stage.event('coin');
        // // PlayDataUtil.listen('coin', (newValue: number) => {
        // //     this.myCoin = newValue;
        // //     Laya.stage.event('coin');
        // // })
        ModuleGlobal.ListenCurrencyChange(GCurrencyType.times, this, (_n) => {
            this.myCoin = _n;
            Laya.stage.event('coin');
            // this.UpdateCoin(_n)
        })
        this.myCoin = ModuleGlobal.MyCurrency.times;
        ModuleGlobal.UpdateCurrency(GCurrencyType.times);

    }
    ChangeCoin(_add: number, cbSuccess?: Function, cbFail?: Function, taskId?: string) {
        if (ModulePackage.Instance.CanUseNetAPI()) {
            if (_add == 0) {
                return;
            }
            if (_add > 0) {
                console.error('ChangeCoin', '没有add');

                // MainUtil.sendCoin(_add, taskId, (_coin: number) => {
                //     this.myCoin = _coin;
                //     Laya.stage.event('coin');
                //     console.log('ChangeCoin _add', _coin);
                //     cbSuccess && cbSuccess();
                // });
            }
            else {
                ModuleGlobal.ConsumeCurrency(GCurrencyType.times, -_add, (_success) => {
                    if (_success) {
                        cbSuccess && cbSuccess();
                    }
                    else {
                        cbFail && cbFail();
                    }
                });
                // MainUtil.costCoin(-_add, (_coin: number) => {
                //     this.myCoin = _coin;
                //     console.log('ChangeCoin sub', _coin);

                //     Laya.stage.event('coin');
                //     cbSuccess && cbSuccess();

                // }, cbFail);
            }
        }
        else {
            this.myCoin += _add;
            Laya.stage.event('coin');
            cbSuccess && cbSuccess();

            // cbFail && cbFail(-11);
        }


    }
    // UpdateCoin(_coin: number) {
    //     this.myCoin = _coin;
    //     Laya.stage.event('coin');
    // }
    GetCoin() {
        return this.myCoin;
    }


    //--------------------------积分信息---------------------//
    InitScore(_score = 0) {
        ModuleGlobal.ListenCurrencyChange(GCurrencyType.wmScore, this, (_n) => {
            this.myScore = _n;
            Laya.stage.event('score');
        })

        this.myScore = ModuleGlobal.MyCurrency.wmScore;
        ModuleGlobal.UpdateCurrency(GCurrencyType.wmScore);
    }
    ChangeScore(_add: number) {
        // if (_set != undefined) {
        //     this.myScore = _set;
        // }
        // else {
        //     this.myScore += _add;
        // }
        // console.log('ChangeScore', this.myScore);
        // Laya.stage.event('score');
        // ModuleGlobal.AddCurrency(GCurrencyType.wmScore, _add);
        ModuleGlobal.AddRankScore(_add);
    }
    GetScore() {
        return this.myScore;
    }
    //--------------------------背包内数量信息---------------------//
    InitNewInBag(_n = 0) {
        this.newInBag = _n;
        Laya.stage.event('newInBag');
    }
    ChangeNewInBag(_add: number) {
        this.newInBag += _add;
        Laya.stage.event('newInBag');
    }
    GetNewInBag() {
        return this.newInBag;
    }
    //--------------------------领金币内数量信息---------------------//
    InitNewInCoin(_n = 0) {
        this.newInCoin = _n;
        Laya.stage.event('newInCoin');
    }
    ChangeNewInCoin(_add: number) {
        this.newInCoin += _add;
        Laya.stage.event('newInCoin');
    }
    GetNewInCoin() {
        return this.newInCoin;
    }
    //--------------------------本局分数信息---------------------//
    ResetCurScore() {
        this.curScore = 0;
        Laya.stage.event('curScore');
    }
    AddScoreByKind(_kind: number) {
        // console.error('AddCurScore _kind', _kind);

        let _addscore = this.fruitConfig[_kind - 1].score;
        if (this.maxFruitKind == _kind) {
            // _addscore += this.maxExtScore;
            this.gameScene && this.gameScene.ShowMergeExternAward(this.maxExtScore);
            HHAudio.PlayEffect('mergeTop');
        }
        // this.gameScene && this.gameScene.ShowMergeExternAward(_addscore);
        this.AddCurScore(_addscore);
        return _addscore;
    }
    AddCurScore(_addscore) {
        this.curScore += _addscore;
        Laya.stage.event('curScore');
        return this.curScore;
    }
    GetCurScore() {
        return this.curScore;
    }
    //--------------------------福袋信息---------------------//
    private luckyBagConfig = { price: '0.01', num_iid: '637552722895', title: '福袋' };
    InitLuckyBagConfig(_config: {
        price: string,
        approve_status: "onsale",
        num: number,
        name: string,
        num_iid: string,
        pic_url: string,
        title: string,
        seller_cids: string
    }) {
        for (const key in this.luckyBagConfig) {
            if (!Object.prototype.hasOwnProperty.call(_config, key)) {
                console.error('[福袋初始化]缺少字段:', key);
                continue;
            }
            this.luckyBagConfig[key] = _config[key];
        }

    }
    GetLuckyBagConfig() {
        return this.luckyBagConfig;
    }


    //--------------------------外部上传接口---------------------//
    //获取玩家信息上报
    checkLogin(cb?) {
        // this.updateUser(PlayDataUtil.data.name, PlayDataUtil.data.avatar);
        if (PlayDataUtil.data.name == "玩家8573" || PlayDataUtil.data.name == "") {
            TB.authorize((data) => {
                console.log("data: ", data);
                // this.updateUser(data.nickName, data.avatar);
                PlayDataUtil.setData('name', data.nickName);
                PlayDataUtil.setData('avatar', data.avatar);
                //上报头像/昵称信息
                MainUtil.reqUserInfo(data.avatar, data.nickName, () => {
                    cb && cb();
                    this.updateState();
                });
            });
        } else {
            cb && cb();
            this.updateState();
        }
    }
    checkVIP() {
        // //查询VIP状态（关注店铺）
        // TB.checkShopFavoredStatus((res) => {
        //     PlayDataUtil.setData("isVip", res.isFavor ? 1 : 0);
        //     console.error('checkShopFavoredStatus isVip', res.isFavor ? 1 : 0);

        //     // let vipImg = this._view.getChild("avatarCom").asCom.getChild('vip').asImage;
        //     // vipImg.visible = (PlayDataUtil.data.isVip == 1);

        //     //上报vip状态
        //     MainUtil.sendVip((res.isFavor ? 1 : 0), () => {
        //     }, () => {
        //     });
        // });
    }

    checkMember() {
        // //查询会员状态（加入会员）
        // if (Laya.Browser.onTBMiniGame) {
        //     TB.checkMember((res) => {
        //         let curState = PlayDataUtil.data.isMember;
        //         console.log('Gamelogic checkMember res', res);
        //         //会员状态有变化，上报服务器    没有变化，跳过
        //         if (res != curState) {
        //             MainUtil.sendMember(res, () => {

        //             }, () => {

        //             });
        //         }
        //     })
        // }
    }
    updateState() {
        console.log('====== 更新页面状态 ======')
        //请求分享信息
        MainUtil.reqShare((res) => {
            if (res.code == 0) {
                if (res.data.invitationInfo.nickName != "") {
                    //邀请成功
                    new Invite(res.data.invitationInfo);
                } else if (res.data.fromInfo.nickName != "") {
                    //被邀请进来
                    new Invite(res.data.fromInfo);
                }
            }
        })
    }
    //--------------------------获取任务icon---------------------//
    GetGameTaskIconUrl(_type: GameTaskType) {
        const baseUrl = 'https://oss.ixald.com/' + 'BigWatermelon/C_client/taskIcon/'
        let _ext = '.png';
        let _iconstr = 'meiri';
        switch (_type) {
            case 'attention':
                _iconstr = 'guanzhu';
                break;
            case 'joinMember':
                _iconstr = 'jiaru';
                break;
            case 'browse':
                _iconstr = 'liulan';
                break;
            case 'browseStore':
                _iconstr = 'liulanshouye';
                break;
            case 'share':
                _iconstr = 'yaoqing';
                break;
            case 'collect':
                _iconstr = 'shoucang';
                break;
            case 'buy':
                _iconstr = 'shangpinfuli';
                break;

            default:
                break;
        }
        return baseUrl + _iconstr + _ext;
    }
    // GetTaskIconUrl(_id: TaskID) {
    //     const baseUrl = 'https://oss.ixald.com/' + 'BigWatermelon/vivo/C_client/taskIcon/'
    //     let _ext = '.png';
    //     let _iconstr = 'meiri';
    //     switch (_id) {
    //         case TaskID.SingIn:
    //             _iconstr = 'meiri';
    //             break;
    //         case TaskID.Attention:
    //             _iconstr = 'guanzhu';
    //             break;
    //         case TaskID.JoinMember:
    //             _iconstr = 'jiaru';
    //             break;
    //         case TaskID.LuckyBag:
    //             _iconstr = 'fudai';
    //             break;
    //         case TaskID.Browse:
    //             _iconstr = 'liulan';
    //             break;
    //         case TaskID.BrowseHomePage:
    //             _iconstr = 'liulanshouye';
    //             break;
    //         // case 7:
    //         //     _iconstr = 'shangpinfuli';
    //         //     break;
    //         case TaskID.Invite:
    //             _iconstr = 'yaoqing';
    //             break;

    //         default:
    //             break;
    //     }
    //     return baseUrl + _iconstr + _ext;
    // }
    //--------------------------兑换商品接口---------------------//
    //获取兑换列表
    // GetScoreShopList(_callBack: (_dataList: {
    //     rewardList: [
    //         {
    //             exchangeConfig: any,//商品兑换限制 配置
    //             price: number,//兑换价格
    //             total: number,//B端最早配置的库存数
    //             leftN: number,//剩余库存数
    //             name: "goods" | "coupon",//奖品种类（"goods": 真实商品  “coupon”: 优惠券）
    //             type: number,//奖品级别（唯一）（对应1，2，3等奖。。。）
    //             pic_url: string,//商品url链接
    //             title: string,//商品名字
    //             num_iid: string,//商品id
    //             getN: number,//已获得数量
    //             limitN: number,//可兑换限制数量
    //         }
    //     ], // B端配置的奖品列表
    //     resetConfig: {
    //         state: boolean,//(true: 设置开启重置时间  false: 未设置)
    //         time: string,//每日重置或刷新库存的时间点
    //     }
    // }) => void) {

    //     let _getInfo = (_data) => {
    //         // console.error('_data', _data);

    //         let _dataList = {
    //             rewardList: [],
    //             resetConfig: _data.integralRewardConfig.resetConfig
    //         }
    //         for (const reward of _data.integralRewardConfig.rewardList) {
    //             let _dd = {
    //                 exchangeConfig: reward.exchangeConfig,//商品兑换限制 配置

    //                 price: this.ChangeToNumber(reward.integral),//兑换价格
    //                 name: reward.name,//奖品种类（"goods": 真实商品  “coupon”: 优惠券）
    //                 type: this.ChangeToNumber(reward.type),//奖品级别（对应1，2，3等奖。。。）
    //                 pic_url: reward.pic_url,//商品url链接
    //                 title: reward.title,//商品名字
    //                 num_iid: reward.num_iid,//商品id
    //                 total: this.ChangeToNumber(reward.num),//B端最早配置的库存数
    //                 leftN: 0,//剩余库存数
    //                 getN: 0,//已获得数量
    //                 limitN: -1,//可兑换限制数量<=0没有限制

    //             }

    //             let _findstock = _data.stockConfig.find(v => v.type == _dd.type);
    //             if (_findstock) {
    //                 _dd.leftN = this.ChangeToNumber(_findstock.nums);
    //             }
    //             else {
    //                 console.error('未找到此商品库存:', _dd.type, _dd.title);
    //             }
    //             if (_data.exchangeData && _data.exchangeData != []) {
    //                 let _findgetN = _data.exchangeData.find(v => v.type == _dd.type);
    //                 if (_findgetN) {
    //                     _dd.getN = this.ChangeToNumber(_findgetN.nums);
    //                 }
    //                 else {
    //                     console.error('未找到此商品已获得数量:', _dd.type, _dd.title);
    //                 }
    //             }

    //             if (_data.exchangeConfig && _data.exchangeConfig != []) {
    //                 let _findlimitN = _data.exchangeConfig.find(v => v.type == _dd.type);
    //                 if (_findlimitN) {
    //                     if (!_findlimitN.state) {
    //                         _dd.limitN = -1;
    //                     }
    //                     else {
    //                         _dd.limitN = this.ChangeToNumber(_findlimitN.nums);
    //                     }

    //                 }
    //                 else {
    //                     console.error('未找到此商品兑换限制数量:', _dd.type, _dd.title);
    //                 }
    //             }
    //             _dataList.rewardList.push(_dd);
    //         }
    //         console.log('_getInfo _dataList', _dataList);
    //         _callBack(_dataList as any);
    //     }
    //     if (Laya.Browser.onTBMiniGame) {
    //         let reqData = {
    //             activeId: TB._activeId,
    //         }
    //         let info = { "id": Global.MSG_GET_SCORESHOP_LIST, "data": reqData };
    //         TB.sendMsg(info, (buf) => {
    //             if (buf.code == 0) {
    //                 console.log('获取兑换列表成功', buf.data)
    //                 _getInfo(buf.data);

    //             } else {
    //                 console.error('获取兑换列表失败', buf.message)
    //                 _callBack(null);
    //             }
    //         });
    //     } else {
    //         let data = {
    //             integralRewardConfig: {
    //                 rewardList: [
    //                     {
    //                         exchangeConfig: [],//商品兑换限制 配置
    //                         price: 100,//商品价格
    //                         integral: 100,//兑换所需积分
    //                         num: 20,//B端最早配置的库存数
    //                         name: "goods",//奖品种类（"goods": 真实商品  “coupon”: 优惠券）
    //                         type: 1,//奖品级别（对应1，2，3等奖。。。）
    //                         pic_url: '',//商品url链接
    //                         title: '测试商品hfdshsfdhadhadhahaehearh',//商品名字
    //                         num_iid: '',//商品id
    //                     },
    //                     {
    //                         exchangeConfig: [],//商品兑换限制 配置
    //                         price: 120,//商品价格
    //                         integral: 10,//兑换所需积分
    //                         num: 20,//B端最早配置的库存数
    //                         name: "“coupon”",//奖品种类（"goods": 真实商品  “coupon”: 优惠券）
    //                         type: 2,//奖品级别（对应1，2，3等奖。。。）
    //                         pic_url: '',//商品url链接
    //                         title: '测试商品测试商品测试商品测试商品测试商品测试商品测试商品',//商品名字
    //                         num_iid: '',//商品id
    //                     }
    //                 ], // B端配置的奖品列表
    //                 resetConfig: {
    //                     state: true,//(true: 设置开启重置时间  false: 未设置)
    //                     time: "08:00:00",//每日重置或刷新库存的时间点
    //                 }
    //             },
    //             stockConfig: [
    //                 {
    //                     type: 1,//奖品类型
    //                     total: 20,//库存总数
    //                     nums: 10,//当前库存剩余数量
    //                 },
    //                 {
    //                     type: 2,//奖品类型
    //                     total: 20,//库存总数
    //                     nums: 8,//当前库存剩余数量
    //                 }
    //             ]//库存数据
    //             ,
    //             exchangeConfig: [
    //                 {
    //                     type: 1,//奖品类型
    //                     state: true,//是否受限
    //                     nums: 10,//总共可兑换的次数
    //                 },
    //                 {
    //                     type: 2,//奖品类型
    //                     state: true,//是否受限
    //                     nums: 8,//总共可兑换的次数
    //                 }
    //             ],//库存数据
    //             exchangeData: [{
    //                 type: 1,//奖品类型
    //                 state: true,//
    //                 nums: 1,//当前已兑换数量
    //             }]
    //         }
    //         _getInfo(data)

    //     }
    // }
    ChangeToNumber(_v: any) {
        if (typeof _v == 'number') {
            return _v;
        } else if (typeof _v == 'string') {
            return Number(_v);
        }
        console.error('ChangeToNumber错误类型：', _v);
        return 0;
    }
    /**
     * 积分兑换奖品
     * @param _type 商品类型
     * @param _callback  _code 0：成功 -5：积分不足 -6：库存不足 -7：兑换次数限制
     */
    ExchangeAward(_type: number, _callback: (_code: number) => void) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                activeId: TB._activeId,
                type: _type
            }
            let info = { "id": Global.MSG_SCORE_EXHANGE, "data": reqData };
            TB.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    console.log('7002兑换成功', buf.data);
                    PlayDataUtil.setData('point', buf.data.point);
                    Laya.stage.event("updateValue");
                    // this.ChangeScore(0, buf.data.point);
                    // MainUtil.sendChangePoint();
                } else {
                    console.error('7002兑换失败', buf.message);
                }
                _callback(buf.code);
            });
        } else {
            _callback(-10);
        }

    }
    //--------------------------获得合成奖励---------------------//
    //兑奖券
    GetGameAward(_kind: number, _callback?: (_data: { get: boolean, title: string, price: string, linkId: number }) => void) {
        console.log('GetGameAward', _kind);
        //只有半个和整个西瓜才有几率获得奖励
        if (this.isGotGameAward || _kind < this.maxFruitKind - 1) {
            return;
        }
        let _type: 8 | 9 = 8;
        if (_kind == this.maxFruitKind) {
            _type = 9;
        }

        // let _getData = { get: false, title: '', price: '', linkId: 0 }
        // let _getcallBack = (_data: any) => {
        //     if (_data.get) {
        //         this.isGotGameAward = true;
        //     }
        //     console.log('_getcallBack', _data);

        //     _callback && _callback(_data);
        // }
        // if (Laya.Browser.onTBMiniGame) {
        //     let reqData = {
        //         activeId: TB._activeId,
        //         type: _type
        //     }
        //     let info = { "id": Global.MSG_GAME_MERGEAWARD, "data": reqData };

        //     TB.sendMsg(info, (buf) => {
        //         if (!buf.data || buf.code != 0) {
        //             console.error('7003优惠券获取失败', buf);
        //             return;
        //         }

        //         console.log('7003优惠券获取成功', buf.data);
        //         if (buf.data.type != -1) {


        //             _getData.get = true;
        //             _getData.title = buf.data.title;
        //             _getData.price = '' + buf.data.price;
        //             _getData.linkId = buf.data.linkId;
        //             // this.ChangeScore(0, buf.data.point);
        //             // MainUtil.sendChangePoint();
        //         } else {
        //             _getData.get = false;
        //             console.log('7003优惠券获取成功', '没有获得兑换奖励', buf.data.type);
        //         }
        //         _getcallBack(_getData);
        //     });
        // } else 
        {
            uiAutotriggerAward.AutoShow(_type, this.gameuid, (_show) => {
                if (_show) {
                    this.isGotGameAward = true;
                    this.PauseGame(true);
                    HHAudio.PlayEffect('getCoupon');
                }

            }, () => {
                this.PauseGame(false);
            })
            // _getData = { get: true, title: '测试券', price: '55', linkId: 0 };
            // _getcallBack(_getData);
        }
    }
    //--------------------------购买福袋---------------------//
    // private lastBuyType = 0;
    canBuyluckybag = true;
    InitLuckyBagState(_isBuy: boolean) {
        // this.canBuyluckybag = !_isBuy;

    }
    //购买福袋
    BuyLuckyBag(_callbackFunc?: (_success?: boolean, _price?: string) => void, sceneType: number = 3) {
        // let _info = this.GetLuckyBagConfig();
        // //去购买
        // let time = new Date().getTime();
        // PlayDataUtil.setData('buyLuckyTime', time);
        // if (Laya.Browser.onTBMiniGame) {
        //     //MainUtil.analysis('buyLuckyTime', { time: time })
        //     TB.showSku('' + _info.num_iid, (_success: boolean) => {
        //         if (_callbackFunc) {
        //             // this.lastBuyType = sceneType;
        //             //曝光埋点
        //             //MainUtil.analysis('exposure', { type: sceneType, goodsId: _info.num_iid, goodsName: _info.title, price: _info.price });
        //             _callbackFunc(_success, _info.price);
        //         }
        //     });
        // }
        // else {
        //     if (_callbackFunc) {

        //         _callbackFunc(true, _info.price);
        //         console.log('send  CheckLuckyBagState');

        //         this.CheckLuckyBagState();
        //     }
        // }
    }
    //检测订单状态
    readonly LuckyBagEventKey = 'checkLuckyOrder';
    CheckLuckyBagState() {
        // if (PlayDataUtil.data.buyLuckyTime == 0) {
        //     return;
        // }
        // //监听成功回调
        // let _successCallback = (_getData: {
        //     price: number,//价格
        //     time: number,//订单时间
        //     record: any, //订单信息
        // }) => {
        //     MainUtil.uploadOrder(_getData.price);

        //     this.canBuyluckybag = false;
        //     console.log('CheckLuckyBagOrder _successCallback', _getData);

        //     Laya.stage.event(this.LuckyBagEventKey, _getData);

        //     Laya.stage.offAll(this.LuckyBagEventKey);
        // }

        // //检测订单
        // let _retry = {
        //     time: 1,//重试次数
        //     delay: 10000//重试间隔
        // }
        // let _check = () => {
        //     ServerAPI.Cloud.Connect('CheckLuckyBagOrder', {
        //         callBack: (_success: boolean, _getData) => {
        //             if (_success) {
        //                 _retry.time = 0;
        //                 console.error('CheckLuckyBagOrder _getData', _getData);
        //                 _successCallback(_getData);
        //             }
        //             else {
        //                 if (_retry.time > 0) {
        //                     Laya.timer.once(_retry.delay, this, _check);
        //                     _retry.time--;
        //                 }

        //             }
        //         }
        //     })
        // }
        // _check();

    }
    //监听订单状态
    ListenLuckyBagState(caller: any, listener: (_data: {
        price: number,//价格
        time: string,//订单时间
        record: any, //订单信息
        taskData?: any//任务状态信息
    }) => void) {
        Laya.stage.on(this.LuckyBagEventKey, caller, listener);
    }
    //-------------------------刷新气泡数据（任务和奖品包）--------------------//
    private refreshNewNumber = -1;
    listenRefreshNewNumber() {
        if (this.refreshNewNumber >= 0) {
            return this.refreshNewNumber;
        }
        let _refresh = () => {

            let _n = 0;
            let _tasks = TaskLogic.GetAllTaskInfo();
            console.log('_refresh');
            for (const task of _tasks) {
                if (task.status == TaskStatusType.allow) {
                    _n++;
                }
            }
            this.refreshNewNumber = _n;
            // // this.countDownTask = [];
            // // this.taskPointN = 0;
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

            //     Laya.stage.event('refreshBubbleUI', _data);

            // })
            Laya.stage.event('refreshBubbleUI', _n);
        }
        Laya.stage.on('refreshBubble', this, _refresh)
        _refresh();
        return this.refreshNewNumber;


    }
    //-------------------------获取浏览新品信息--------------------//
    //是否有浏览新商品任务
    haveBrowseNewTask = false;
    private curBrowseNewInfo = null as any;
    GetBrowseNewInfo(_successCallback?: (_data: {
        time: string,//活动开始时间
        num_iid: string,//商品id
        title: string,//商品名
        price: string,//商品价格
    }) => void, forceUpdate = false) {
        if (this.curBrowseNewInfo && !forceUpdate) {
            _successCallback && _successCallback(this.curBrowseNewInfo);
            return;
        }
        ServerAPI.Cloud.Connect('BrowseNewInfo', {
            callBack: (_sccess, _data, _code) => {
                if (_sccess) {
                    this.curBrowseNewInfo = _data;
                    _successCallback && _successCallback(this.curBrowseNewInfo);
                }

            }
        })
    }
    //-------------------------获取活动状态--------------------//
    //活动状态
    CurActivityState: ActivityState = ActivityState.unStart;
    GetActivityState(_callBacK?: Function) {


        // ServerAPI.Cloud.Connect('GetActivityState', {
        //     callBack: (_sccess, _data, _code) => {
        //         if (_sccess) {
        //             this.CurActivityState = _data.state;
        //         }
        //         _callBacK && _callBacK(this.CurActivityState);
        //     }
        // })
    }
    //----------------------游戏内任务---------------------//

    //是否可做此任务
    WhetherHaveTask(_type: GameTaskType) {
        switch (_type) {
            case 'joinMember':
                // return false;
                if (ModulePlatformAPI.IsMember) {
                    return false;
                }
                return !!TaskLogic.GetTaskInfo(TaskType.joinMember);
                break;
            case 'attention':
                return !ModulePlatformAPI.IsFavor;
                break;
            case 'browse':
                return true;
                break;
            case 'collect':
                let _have = !ModuleGlobal.IsAllGoodsColelcted;
                ModuleGlobal.GetGoodsList(undefined, { pageSize: 30, sortType: 'random' });
                return _have;
                break;
            case 'buy':
                return false;
                break;
            case 'share':
                return true;
            case 'browseStore':
                return true;
                break;

            default:
                break;
        }
        return false;
    }
    //去执行游戏内任务
    DoGameTask(_type: GameTaskType, _callback?: (_success: boolean, data?: any) => void) {
        let _taskCallback = (_success: boolean, data?: any) => {

            _callback && _callback(_success, data);

            //做完一次任务就刷新记录
            if (_success) {

                this.ResetGameoverTask();
                this.ClearFlyTaskLastInfo();
            }
        }
        if (Laya.Browser.onTBMiniGame) {
            // _taskCallback(true);
            let _task: TaskType = TaskType.scanGoods;
            switch (_type) {
                case 'attention':
                    _task = TaskType.subscribeShop;
                    break;
                case 'browse':
                    _task = TaskType.scanGoods;
                    break;
                case 'browseStore':
                    _task = TaskType.scanShop;
                    break;
                case 'buy':
                    _task = TaskType.spend;
                    break;
                case 'collect':
                    _task = TaskType.collectGoods;
                    break;
                case 'joinMember':
                    _task = TaskType.joinMember;
                    break;
                case 'share':
                    _task = TaskType.friendship;
                    break;

                default:
                    break;
            }
            TaskLogic.DoTask(_task, (_success) => {
                _taskCallback(_success);
                if (_success) {
                    ModuleStatistics.CompleteTask(_type);
                }
            }, 0, false);
        }
        else {
            _taskCallback(true);
        }
    }
    ResetGameoverTask() {
        this.preDoGameOverTask = null;
    }
    private preDoGameOverTask: GameTaskType | null = null;
    //获取游戏结束后任务
    GetGameOverTask() {
        if (this.preDoGameOverTask !== null) {
            return this.preDoGameOverTask;
        }
        //可执行的任务
        const taskList = ['joinMember', 'attention', ['browse', 'collect']]

        //0为检测过所有任务没有可做的
        let _gettask: any = 0;

        for (const task of taskList) {
            //顺序检测外测任务是否可以做（顺序）
            if (typeof task == 'string') {
                if (this.WhetherHaveTask(task as any)) {
                    _gettask = task as any;
                    break;
                }
            }
            else {
                //打乱顺序检测数组内任务是否可以做（随机）
                let _arr = task.sort(v => Math.random() - 0.5);
                while (_arr.length > 0) {
                    let _ctask = _arr.pop() as any;
                    if (this.WhetherHaveTask(_ctask)) {
                        _gettask = _ctask as any;
                        break;
                    }
                }
                if (_gettask) {
                    break;
                }
            }
        }
        this.preDoGameOverTask = _gettask;
        return _gettask;
    }
    //有任务从1开始，0为没有触发过任何任务
    private curFlyTaskLevel = 0;
    //触发游戏内任务
    AutoTriggerGameFlyTask() {
        //任务触发条件
        const teiggerCondition = [
            // { time: 1, score: 2 },
            { time: 30, score: 90 },
            { time: 120, score: 160 },
            { time: 200, score: 200 },
            { time: 300, score: 300 },
        ];

        // console.log('AutoTriggerGameFlyTask', ClockUtil.GetTime(this.gameClockName), this.curScore);

        //是否触发任务
        let _trigger = false;

        for (let index = this.curFlyTaskLevel; index < teiggerCondition.length; index++) {

            const _condition = teiggerCondition[index];

            if (ClockUtil.GetTime(this.gameClockName) <= _condition.time || this.curScore <= _condition.score) {
                break;
            }

            this.curFlyTaskLevel = index + 1;
            _trigger = true;
        }

        if (_trigger) {
            //预获取任务
            let _awardType = this.GetCurGameFlyTaskAwardType();
            let _taskType = this.GetGameFlyTaskType(_awardType);

            //显示飞入任务按钮
            this.ShowGameFlyTask();


        }

    }
    //显示游戏飞入任务
    ShowGameFlyTask() {
        console.log('ShowGameFlyTask');

        this.gameScene && this.gameScene.ShowFlyTask();
    }
    HideGameFlyTask() {

        console.log('HideGameFlyTask');
        this.gameScene && this.gameScene.HideFlyTask();
    }
    //上次获取的任务信息（防止多次获取）
    private lastgetFlyTaskInfo = {
        id: 0,
        awardType: null as GameFlyTaskAwardType,
        taskType: null as GameTaskType,
    }
    //重置游戏内飞入任务
    ResetGameFlyTask() {
        this.curFlyTaskLevel = 0;
        this.ClearFlyTaskLastInfo();
    }
    ClearFlyTaskLastInfo() {
        this.lastgetFlyTaskInfo = {
            id: 0,
            awardType: null,
            taskType: null,
        }
    }
    //获取当前飞入任务奖励类型
    GetCurGameFlyTaskAwardType() {
        if (this.curFlyTaskLevel < 1) {
            return null;
        }
        //如果已经获取过直接返回任务值
        if (this.lastgetFlyTaskInfo.id == this.curFlyTaskLevel && this.lastgetFlyTaskInfo.awardType) {
            return this.lastgetFlyTaskInfo.awardType;
        }
        //道具出现概率选择
        let _curprob = { clearFruit: 50, removeFruit: 40, supperFruit: 10, addScore: 0 };
        //当前水果最高高度占比
        let _hp = (this.fruitTopY - this.gameFruitValidY.bottom) / (this.gameFruitValidY.top - this.gameFruitValidY.bottom) * 100;
        console.log('当前水果最高高度占比', _hp);

        if (this.curFlyTaskLevel < 2 || _hp < 70) {
            const _allprob = [
                { clearFruit: 20, removeFruit: 20, supperFruit: 50, addScore: 10 },

                { clearFruit: 10, removeFruit: 40, supperFruit: 30, addScore: 20 },

                { clearFruit: 40, removeFruit: 20, supperFruit: 30, addScore: 10 },

                { clearFruit: 10, removeFruit: 20, supperFruit: 20, addScore: 10 },
            ];
            _curprob = _allprob[this.curFlyTaskLevel - 1];
        }

        //按概率随机任务
        let _totalprob = 0;
        for (const key in _curprob) {
            _totalprob += _curprob[key];
        }
        let _key = '';
        let _randp = Math.random() * _totalprob;
        for (const key in _curprob) {
            if (_randp < _curprob[key]) {
                _key = key;
                break;
            }
            _randp -= _curprob[key];
        }

        //返回任务
        if (_key == '') {
            console.error('[GetCurGameFlyTaskAwardType] 数据错误', this.curFlyTaskLevel, _hp);
            return null;
        }
        this.lastgetFlyTaskInfo.id = this.curFlyTaskLevel;
        this.lastgetFlyTaskInfo.awardType = _key as any;

        return _key as GameFlyTaskAwardType;
    }

    //获取飞入任务需要做的任务类型
    GetGameFlyTaskType(_awardType: GameFlyTaskAwardType) {
        //如果已经获取过直接返回任务值
        if (this.lastgetFlyTaskInfo.id == this.curFlyTaskLevel && this.lastgetFlyTaskInfo.taskType) {
            return this.lastgetFlyTaskInfo.taskType;
        }
        //任务奖励和需要做的任务对应概率
        const taskProb = {
            clearFruit: { browse: 10, buy: 40, collect: 10, share: 20, browseStore: 20 },
            removeFruit: { browse: 20, buy: 30, collect: 10, share: 30, browseStore: 10 },
            supperFruit: { browse: 30, buy: 10, collect: 20, share: 30, browseStore: 10 },
            addScore: { browse: 20, buy: 10, collect: 20, share: 30, browseStore: 20 }
        }
        let _curprob = taskProb[_awardType];

        //按概率随机任务
        let _totalprob = 0;
        for (const key in _curprob) {
            if (_curprob[key] > 0) {

                if (!this.WhetherHaveTask(key as any)) {
                    //不能完成的任务概率改为0
                    _curprob[key] = 0;
                    continue;
                }
            }
            console.log("按概率随机任务:",key,_curprob[key])
            _totalprob += _curprob[key];
        }
        let _key = '';
        let _randp = Math.random() * _totalprob;
        for (const key in _curprob) {
            if (_randp < _curprob[key]) {
                _key = key;
                break;
            }
            _randp -= _curprob[key];
        }
        if (_key == '') {
            console.error('[GetGameFlyTaskType] 数据错误', _awardType);
            return null;
        }
        this.lastgetFlyTaskInfo.id = this.curFlyTaskLevel;
        this.lastgetFlyTaskInfo.taskType = _key as any;
        return _key as keyof typeof _curprob;
    }

    //执行飞入任务
    DoGameFlyTask(_taskType: GameTaskType, _awardType: GameFlyTaskAwardType, callBack?: (_success: boolean) => void) {
        this.DoGameTask(_taskType, (_success) => {
            if (_success) {
                console.log('DoGameFlyTask', _awardType, GameFlyTaskAwardInfo[_awardType]);

                let _awardData = GameFlyTaskAwardInfo[_awardType].data;
                switch (_awardType) {
                    case 'clearFruit'://消除当前屏幕1/3水果
                        let _h = Math.abs(this.gameFruitValidY.top - this.gameFruitValidY.bottom) * _awardData;
                        this.myGameScene.clearFruitYExceed(this.gameFruitValidY.bottom - _h);
                        HHAudio.PlayEffect('propClear');
                        break;
                    case 'removeFruit'://清除当前屏幕等级4以下的水果
                        this.myGameScene.removeFruitBelowLevel(_awardData);
                        HHAudio.PlayEffect('propClear');
                        break;
                    case 'supperFruit'://万能水果
                        this.myGameScene.GetASupperFruit();
                        HHAudio.PlayEffect('propSupperFruit');
                        break;
                    case 'addScore'://奖励积分
                        this.AddCurScore(_awardData);
                        this.ShowGetScoreEffect({ score: _awardData, pos: [375, 500] });
                        HHAudio.PlayEffect('propScore');
                        break;

                    default:
                        break;
                }
                this.HideGameFlyTask();
            }
            callBack && callBack(_success);
        })
    }
    //测试飞入任务
    flyTaskTest(_level: number, _task: GameTaskType, _awardTask: GameFlyTaskAwardType) {
        this.curFlyTaskLevel = _level;
        this.lastgetFlyTaskInfo = {
            id: _level,
            awardType: _awardTask,
            taskType: _task,
        }
        this.ShowGameFlyTask();
    }


    //------------------------------------------------------//
}
export let GameLogic = GameLogic_c.INS();

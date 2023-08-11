import { Global } from "../config/Global";
import { IsCDN } from "../Global/FGUIConfig";
import MainUtil from './../utils/MainUitl';

export default class ResourceManager {
    public _idx = 0;
    //主界面预加载资源
    public PreloadRes = [



        { url: Global.hallConfig.Jsons.aiNameConfig, type: Laya.Loader.JSON },
        { url: Global.hallConfig.Jsons.baseConfig, type: Laya.Loader.JSON },

        { url: Global.hallConfig.Jsons.awardConfig, type: Laya.Loader.JSON },
        { url: Global.hallConfig.Jsons.rankConfig, type: Laya.Loader.JSON },
        { url: Global.hallConfig.Jsons.taskConfig, type: Laya.Loader.JSON },
        { url: Global.hallConfig.Jsons.gameConfig, type: Laya.Loader.JSON },

        { url: Global.hallConfig.FGui.main, type: Laya.Loader.BUFFER, isCDN: true },
        { url: Global.hallConfig.FGui.common, type: Laya.Loader.BUFFER, isCDN: true },
        { url: Global.hallConfig.FGui.getReward, type: Laya.Loader.BUFFER, isCDN: true },
        { url: Global.hallConfig.FGui.Loading, type: Laya.Loader.BUFFER, isCDN: true },

        { url: Global.hallConfig.FGui.mainPng, type: Laya.Loader.IMAGE, isCDN: true },
        { url: Global.hallConfig.FGui.commonPng, type: Laya.Loader.IMAGE, isCDN: true },
        { url: Global.hallConfig.FGui.getRewardPng, type: Laya.Loader.IMAGE, isCDN: true },
        { url: Global.hallConfig.FGui.LoadingPng, type: Laya.Loader.IMAGE, isCDN: true },
    ]

    private _allConf: any;
    private _taskConf: any = null;
    private _browseTaskConf: any = null;   //浏览商品的配置
    private _buyTaskConf: any = null;   //购买商品的配置


    private _goodsConf: any = null;     //浏览/购买的商品配置
    private _prizePoolConf: any = null;   //奖品池的配置
    private _rankPrizeConf: any = null;     //排名奖品配置
    private _activeTimeConf: any = null;   //活动时间
    private _shareConfig: any = null;     //分享的配置
    private _invateNewUserCoin = 0;     //邀请新玩家金币
    private _invateUserCoin = 0;        //邀请老玩家金币
    private _exchangeIdx = [0, 0];           //金币,积分奖励比例
    private _lookGoodsCoin = 0;         //浏览商品的奖励配置
    private _subCoin = 1;               //消耗的金币数
    private _atmosphereConfig: any = null;//UI配置
    private _ruleConf: any;
    private _rankSTime = -1;
    private _rankETime = -1;

    constructor() {
        this.setDefaultConf();
    }

    public PreloadResources() {
        // let resModel = this.PreloadRes[this._idx];
        // if (Laya.Browser.onTBMiniGame) {
        //     // if(resModel.isSound){
        //     //     this._idx++;
        //     //     this.onPreLoadResComplete();
        //     //     return;
        //     // }
        //     if (resModel.isCDN) {
        //         Laya.loader.load(Global.hallConfig._cdn + resModel.url, Laya.Handler.create(this, this.onPreLoadResComplete), null, resModel.type);
        //     } else {
        //         Laya.loader.load(resModel.url, Laya.Handler.create(this, this.onPreLoadResComplete), null, resModel.type);
        //     }

        // } else {
        //     Laya.loader.load(resModel.url, Laya.Handler.create(this, this.onPreLoadResComplete), null, resModel.type);
        // }
        // console.error('PreloadResources', resModel.url);
        let _resarr = this.PreloadRes.map(v => {
            if (Laya.Browser.onTBMiniGame && v['isCDN']) {
                // if (!IsCDN) {
                //     return;
                // }
                v.url = Global.hallConfig._cdn + v.url;
            }
            // console.log('v.url', v.url);

            return v;
        });

        let _toload = () => {
            Laya.loader.load(_resarr, Laya.Handler.create(this, (isSuccess) => {
                if (isSuccess) {
                    for (const iterator of _resarr) {
                        if (iterator.isCDN && iterator.type == Laya.Loader.BUFFER) {

                            fgui.UIPackage.addPackage(MainUtil.getUI(iterator.url));
                        }
                    }
                    this.onPreLoadResComplete();
                } else {
                    _toload();
                }
            }), Laya.Handler.create(this, (progress) => {
                // this.progress.text = Math.floor(progress * 100) + '%';
                this._idx = (progress * 100) | 0;

                // console.error('progress', progress);
                //通知进度
                if (this._idx < 100) {
                    console.log('load _idx', this._idx);
                    Global.EventManager.event(Global.hallConfig.EventEnum.Res_Load_Complete);
                }

            }, null, false));
        }
        _toload();

        // this._idx++;
    }

    //预加载完成
    private onPreLoadResComplete() {
        this._idx = 100;
        console.log('load _idx', this._idx);
        //通知进度完成
        Global.EventManager.event(Global.hallConfig.EventEnum.Res_Load_Complete);
        // console.error('onPreLoadResComplete');
        // Global.EventManager.event(Global.hallConfig.EventEnum.Res_Load_Complete);
        // // console.error('onPreLoadResComplete');
        // if (this._idx < this.PreloadRes.length) {
        //     this.PreloadResources();
        // }
    }

    // //预加载过程
    // private onPreLoadResProgress(value: number) {
    //     console.log("onPreLoadResProgress...");
    //     Global.EventManager.event(Global.hallConfig.EventEnum.Res_Load_Progress, value);
    // }

    //获取资源
    public GetRes(url) {
        var res = Laya.loader.getRes(url);
        if (res == null) {
            console.error("资源未加载/已释放:", url);
        }
        return res;
    }

    //初始化商家配置
    public initConf(data) {
        this._allConf = data;
    }

    //获取商家配置
    public getConf(name) {
        if (!this._allConf) return null;
        if (!this._allConf[name]) {
            console.error("配置获取失败");
            return null;
        } else
            return this._allConf[name];
    }

    /////////////////////////////////////////////////////////////
    //设置默认数据
    setDefaultConf() {
        //奖品
        let prizeList = [{ "isRewardControl": { "buyPrice": 88, "intiveNums": 15, "type": false }, "rate": "0.0500000000", "price": "708.00", "approve_status": "onsale", "num": 971, "name": "goods", "num_iid": 634413319548, "type": "1", "pic_url": "https://img.alicdn.com/bao/uploaded/i2/2210005895332/O1CN01bYG0fa1pG6TWuQ5rL_!!2210005895332.png", "title": "Dimoo太空系列整盒12款", "openNums": 30, "seller_cids": "-1" }, { "isRewardControl": { "buyPrice": 5, "intiveNums": 8, "type": false }, "rate": "0.5000000000", "price": 1, "approve_status": "", "num": 952, "name": "coupon", "num_iid": "ce72c637187e4716b860419b9ccded4e", "type": "2", "pic_url": "https://oss.ixald.com/bigFight/admin/images/yhj.png", "title": "满25减1", "openNums": 48, "seller_cids": "" }, { "isRewardControl": { "buyPrice": 0, "intiveNums": 0, "type": false }, "rate": "0.5000000000", "price": 10, "approve_status": "", "num": 272, "name": "coupon", "num_iid": "52560b0a6e8e4b7c8166d57b08f74c72", "type": "3", "pic_url": "https://oss.ixald.com/bigFight/admin/images/yhj.png", "title": "董帅优惠券", "openNums": 64, "seller_cids": "" }];
        this._prizePoolConf = prizeList;

    }

    //保存浏览/购买的商品配置
    public saveGoodsConf(data) {
        this._goodsConf = data;
    }

    //获取浏览/购买的商品配置
    public getGoodsConf() {
        return this._goodsConf;
    }

    //保存奖品池的配置
    public savePrizePoolConf(data) {
        this._prizePoolConf = data;
    }

    //获取奖品池的配置
    public getPrizePoolConf() {
        return this._prizePoolConf;
    }

    //保存排名奖品数据
    public saveRankPrizeConf(data) {
        this._rankPrizeConf = data;
    }

    //获取浏览/购买的商品配置
    public getRankPrizeConf() {
        return this._rankPrizeConf;
    }

    //获取单个奖励
    public getPrizeById(id) {
        if (id >= this._prizePoolConf.length) {
            return null;
        }
        return this._prizePoolConf[id];
    }

    //保存任务配置
    public saveTaskConf(data) {
        this._taskConf = data;
    }

    //获取任务配置
    public getTaskConf() {
        return this._taskConf;
    }

    //根据配置刷新本地任务表
    public refreshTaskConf() {
        let confs = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.taskConfig);
        // if (this._taskConf) {
        //     for (let i = 0; i < confs.length; i++) {
        //         let conf = confs[i];
        //         for (let j = 0; j < this._taskConf.length; j++) {
        //             let newConf = this._taskConf[j];
        //             if (newConf.id == conf.id) {   //服务器有下发新配置
        //                 if (newConf.hasOwnProperty("rewardCount")) {  //重置奖励数量
        //                     let data = [newConf.rewardCount, newConf.rewardCount, newConf.rewardCount];
        //                     conf.rewardCount = JSON.stringify(data);//买买买任务这个字段代表奖励的倍数
        //                     if (newConf.id == '9') {
        //                         this._exchangeIdx = newConf.rewardCount;
        //                     }
        //                 }
        //                 if (newConf.hasOwnProperty("need")) {         //需要达成的次数
        //                     conf.need = newConf.need;
        //                 }

        //                 if (newConf.hasOwnProperty("limit")) {         //每日上限
        //                     let data = [newConf.limit, newConf.limit, newConf.limit];
        //                     conf.limit = JSON.stringify(data);
        //                 }

        //                 if (newConf.hasOwnProperty("time")) {          //时间
        //                     conf.time = newConf.time;
        //                 }
        //                 break;
        //             }
        //         }
        //     }
        // }
        return confs;
    }

    //保存分享配置
    public saveShareConfig(data) {
        this._shareConfig = data;
    }

    //获取分享配置
    public getShareConfig() {
        return this._shareConfig;
    }

    //保存每局消耗的金币数
    public saveSubCoin(coin) {
        this._subCoin = coin;
    }

    public getSubCoin() {
        return this._subCoin;
    }

    //保存金币奖励兑换比例
    public saveExchangeIdx(coinrate, scorerate) {
        this._exchangeIdx = [coinrate, scorerate];
    }

    public getExchangeIdx() {
        return this._exchangeIdx;
    }

    //保存UI配置
    saveAtmosphere(data) {
        if (data) {
            this._atmosphereConfig = data;
        }
    }

    //获取UI配置
    public getAtmosphere() {
        // console.error('getAtmosphere 需要修改');

        this._atmosphereConfig = {
            style: 3,
            scene: 2,
        }
        return this._atmosphereConfig;

        if (!this._atmosphereConfig) {
            this._atmosphereConfig = {
                style: 3,
                scene: 2,
            }
        }
        return this._atmosphereConfig;
    }

    //更新UI地址
    public updateUI() {
        Global.hallConfig._cdn = Global.hallConfig._cdn.replace("index", "" + this.getAtmosphere().style + "/index");
        // for (let key in Global.hallConfig.FGui) {
        //     let ui = Global.hallConfig.FGui[key];
        //     Global.hallConfig.FGui[key] = ui.replace("UI", "UI/" + this.getAtmosphere().style);
        // }
    }

    //保存规则配置
    public saveRuleConf(data) {
        this._ruleConf = data;
    }

    //获取规则配置
    public getRuleConf() {
        return this._ruleConf;
    }

    //保存冲榜开始和结束的时间
    public saveRankTime(sTime, eTime) {
        this._rankSTime = sTime;
        this._rankETime = eTime;
    }

    //获取开始时间
    public getRankSTime() {
        return this._rankSTime;
    }

    //获取结束时间
    public getRankETime() {
        return this._rankETime;
    }
}

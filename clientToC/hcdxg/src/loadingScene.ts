import { Global } from './config/Global';
import PlayDataUtil from './data/PlayDataUtil';
import SoundPlayer from './common/SoundPlayer';
import TB from './platform/TB';
import BannerUtil from './utils/BannerUtil';
import MainUtil from './utils/MainUitl';
import HHAudio from './Global/modules/Audio/HHAudio';
import MyGlobal from './Global/Global';
import StartScene from './FGUIClass/StartScene';
import FGUIUtil from './Global/modules/FGUI/FGUIUtil';
import { GameLogic } from './FGUIClass/GameLogic';
import ModulePackage from './module/ModulePackage';
import { ModuleGlobal } from './module/ModuleGlobal';
import { ModulePlatformAPI } from './module/ModulePlatformAPI';
import { TaskLogic } from './module/Task/TaskLogic';
import { ModuleAudio } from './module/ModuleTool';
import { AudioCDNPath } from './Global/AudioConfig';
import { ModuleStatistics } from './module/ModuleStatistics';
import { ModuleSkins } from './module/ModuleSkins';
import uiAwards from './module/rank/uiAwards';

export default class LoadingUI extends Laya.View {
    public loadingBar: Laya.ProgressBar;
    public bg: Laya.Sprite;
    public progress: Laya.Label;
    public img_load: Laya.Sprite;
    public logo: Laya.Sprite;

    _allValue = 0; //总数
    _curValue = 0; //已加载个数
    _isComplete = false;
    constructor() { super(); }

    onEnable(): void {
        MainUtil.setCurScene(Global.hallConfig.CUR_SCENE.loading);
        Global.EventManager.on(Global.hallConfig.EventEnum.Res_Load_Complete, this, this.complete);
        this.innerRound();

        // //预加载资源
        // this._allValue = Global.ResourceManager.PreloadRes.length;
        PlayDataUtil.init();
        // TB.init();
        SoundPlayer.init();


        this.centerFit();
        PlayDataUtil.setData("version", Global.hallConfig._version);

        //加载声效
        for (const key in Global.hallConfig.Sound) {
            SoundPlayer.preloadSound(key, false);
        }
        // this.logo.texture.url = 
        // this.logo.repaint();


        ModulePlatformAPI.Init();
        // //更换皮肤初始化
        // ModuleSkins.Init(() => {
        //     // this.logo.texture = Laya.loader.getRes('https://oss.ixald.com/ProductInfo/HCDXG/default/game/GameGadget.png')
        //     // console.log('logo', this.logo);

        //     ModuleSkins.ChangeSkin(this.logo, 'beginLogo');
        // });
        this.progress.text = '5%';
        ModuleStatistics.StartLoadRes();
        //初始化全局信息类
        ModuleGlobal.Init(() => {
            this.progress.text = '10%';

            //设置模块按钮通用音效
            ModuleAudio.SetComonBtnAudioPath(AudioCDNPath + 'Audio/btn.mp3');
            //初始化任务系统
            TaskLogic.Init(() => {
                ModulePlatformAPI.CheckMember();
                ModulePlatformAPI.CheckShopFavoredStatus();
                this.progress.text = '20%';
                console.log('任务初始化成功');
                Global.ResourceManager.PreloadResources();


            });
            //预先获取一次商品列表
            ModuleGlobal.GetGoodsList(undefined, { pageSize: 30, sortType: 'random' });
            //预先获取排行榜奖品信息
            uiAwards.GetRankData();

        })

        // //获取商家配置
        // if (Laya.Browser.onTBMiniGame) {



        //     // TB.login((data) => {
        //     //     this.progress.text = '10%';
        //     //     console.log('login suc------', 1);

        //     //     Global.ResourceManager.initConf(data);
        //     //     console.log('login suc------', 2);
        //     //     PlayDataUtil.setData("openId", data.openid);  //保存商铺id
        //     //     console.log('login suc------', 3);
        //     //     PlayDataUtil.setData("userOpenId", data.userOpenId);  //保存玩家userOpenId
        //     //     console.log('login suc------', 4);
        //     //     if (data.player) {
        //     //         console.log('login suc------', 5);
        //     //         PlayDataUtil.savePlayerData(data.player);
        //     //         console.log('login suc------', 6);
        //     //         GameLogic.InitCoin(data.player.userCoin);
        //     //         GameLogic.InitScore(data.player.point);
        //     //         GameLogic.InitLuckyBagConfig(data.bouncedConfig.luckyBag);
        //     //         GameLogic.InitLuckyBagState(data.player.isBuyLuckyBag);


        //     //         // //兼容老玩家本地保存的角色列表
        //     //         // let newRoleList = data.player.roleList;
        //     //         // console.log('login suc------',7);
        //     //         // let localRoleList = PlayDataUtil.data.myRoleIDArray;
        //     //         // console.log('login suc------',8);
        //     //         // for (let i = 0; i < localRoleList.length; i++) {
        //     //         //     let roleId = localRoleList[i];
        //     //         //     if (data.player.roleList.indexOf(roleId) == -1) {  //服务器数据中没有这个角色
        //     //         //         MainUtil.reqMyRole(roleId, () => {
        //     //         //             newRoleList.push(roleId);
        //     //         //         });
        //     //         //     }
        //     //         // }
        //     //         // console.log('login suc------',9);
        //     //         // PlayDataUtil.setData('myRoleIDArray', newRoleList, true);
        //     //         console.log('login suc------', 10);
        //     //     }
        //     //     // 保存是否开启礼包vip控制
        //     //     PlayDataUtil.setData("isVipControl", data.isVipControl);
        //     //     // // 是否有vip体系 
        //     //     PlayDataUtil.setData("isVipSystem", data.isVipSystem);

        //     //     //保存每局消耗的金币数
        //     //     Global.ResourceManager.saveSubCoin(data.gameConfig.subCoin);
        //     //     GameLogic.SetGameExpendCoin(data.gameConfig.subCoin);
        //     //     console.log('login suc------', 11);

        //     //     //保存购买商品的配置
        //     //     Global.ResourceManager.saveGoodsConf(data.gameConfig.promotionList);
        //     //     console.log('login suc------', 12);

        //     //     // //保存奖品池的配置
        //     //     // Global.ResourceManager.savePrizePoolConf(data.gameConfig.redPacketList);无
        //     //     // //保存排名奖品数据
        //     //     // Global.ResourceManager.saveRankPrizeConf(data.rankRewardConfig.rewardList);无

        //     //     //保存分享配置
        //     //     Global.ResourceManager.saveShareConfig(data.gameConfig.shareConfig);
        //     //     console.log('login suc------', 13);

        //     //     //保存任务配置
        //     //     Global.ResourceManager.saveTaskConf(data.gameConfig.missionConfig);
        //     //     console.log('login suc------', 14);

        //     //     //保存规则配置
        //     //     Global.ResourceManager.saveRuleConf(data.gameConfig.rule);
        //     //     console.log('login suc------', 15);

        //     //     //保存排行榜开始和结束时间
        //     //     Global.ResourceManager.saveRankTime(data.sTime, data.eTime);
        //     //     console.log('login suc------', 16);

        //     //     //保存UI配置
        //     //     Global.ResourceManager.saveAtmosphere(data.gameConfig.atmosphereConfig);
        //     //     console.log('login suc------', 17);
        //     //     Global.ResourceManager.updateUI();
        //     //     console.log('login suc------', 18);

        //     //     MainUtil.checkCollectState();
        //     //     console.log('login suc------', 19);
        //     //     //MainUtil.analysis('loadingRes', {});
        //     //     console.log('login suc------', 20);
        //     //     //MainUtil.analysis('version', { type: Global.hallConfig._version });
        //     //     console.log('login suc------', 21);
        //     //     //登录成功后再加载资源
        //     //     Global.ResourceManager.PreloadResources();
        //     //     //设置和预加载水果皮肤
        //     //     GameLogic.SetAndPreLoadFruit(data.gameConfig.atmosphereConfig);
        //     //     console.log('login suc------', 22);
        //     // }, () => {
        //     //     console.log("登录信息获取失败");
        //     //     Global.ResourceManager.updateUI();
        //     //     Global.ResourceManager.PreloadResources();
        //     // })
        // }
        // else {
        //     ///////////测试数据////////////
        //     //保存排名奖品数据
        //     Global.ResourceManager.saveRankPrizeConf([{ "price": "708.00", "approve_status": "onsale", "num": 999, "rewardNums": 1, "name": "goods", "rankNums": [1, 1], "num_iid": 634413319548, "type": "1", "pic_url": "https://img.alicdn.com/bao/uploaded/i2/2210005895332/O1CN01bYG0fa1pG6TWuQ5rL_!!2210005895332.png", "title": "Dimoo太空系列整盒12款", "seller_cids": "-1" }, { "price": "255.00", "approve_status": "onsale", "num": 222, "rewardNums": 2, "name": "goods", "rankNums": [2, 3], "num_iid": 633427312626, "type": "2", "pic_url": "https://img.alicdn.com/bao/uploaded/i3/2210005895332/O1CN01tBra6m1pG6SvS1n1Y_!!2210005895332.jpg", "title": "我想试一下超过八九十一二三四五六七八个字", "seller_cids": "-1" }, { "price": "28.00", "approve_status": "onsale", "num": 153, "rewardNums": 7, "name": "goods", "rankNums": [4, 5], "num_iid": 634092978270, "type": "3", "pic_url": "https://img.alicdn.com/bao/uploaded/i3/2210005895332/O1CN01hktb1s1pG6SyZXKlK_!!2210005895332.jpg", "title": "测试保温袋", "seller_cids": "-1" }, { "price": "28.00", "approve_status": "onsale", "num": 153, "rewardNums": 7, "name": "goods", "rankNums": [6, 10], "num_iid": 634092978270, "type": "3", "pic_url": "https://img.alicdn.com/bao/uploaded/i3/2210005895332/O1CN01hktb1s1pG6SyZXKlK_!!2210005895332.jpg", "title": "测试第四名", "seller_cids": "-1" }, { "price": "28.00", "approve_status": "onsale", "num": 153, "rewardNums": 7, "name": "goods", "rankNums": [11, 15], "num_iid": 634092978270, "type": "3", "pic_url": "https://img.alicdn.com/bao/uploaded/i3/2210005895332/O1CN01hktb1s1pG6SyZXKlK_!!2210005895332.jpg", "title": "测试第四名", "seller_cids": "-1" }, { "price": "28.00", "approve_status": "onsale", "num": 153, "rewardNums": 7, "name": "goods", "rankNums": [16, 20], "num_iid": 634092978270, "type": "3", "pic_url": "https://img.alicdn.com/bao/uploaded/i3/2210005895332/O1CN01hktb1s1pG6SyZXKlK_!!2210005895332.jpg", "title": "测试第四名", "seller_cids": "-1" }]);
        //     //保存规则配置
        //     Global.ResourceManager.saveRuleConf("测试用规则\n测试用规则\n测试用规则\n测试用规则\n测试用规则\n测试用规则\n测试用规则\n测试用规则\n测试用规则\n测试用规则\n测试用规则\n测试用规则\n测试用规则\n测试用规则\n测试用规则\n测试用规则\n测试用规则来来来\n测试用规则来来来\n测试用规则来来来\n测试用规则来来来\n测试用规则来来来");
        //     // 保存是否开启礼包vip控制
        //     PlayDataUtil.setData("isVipControl", 1);
        //     // 是否有会员体系 
        //     PlayDataUtil.setData("isVipSystem", true);
        //     //测试用商品详情
        //     Global.ResourceManager.saveGoodsConf([
        //         { "price": "2532.00", "approve_status": "onsale", "num": 215, "num_iid": 634413319548, "pic_url": "https://img.alicdn.com/bao/uploaded/i2/2210005895332/O1CN01LClMdZ1pG6SrlgY4i_!!2210005895332.jpg", "title": "万代高12359达模型 原装进口 正品模型HG", "seller_cids": "-1" },
        //         { "price": "50.00", "approve_status": "onsale", "num": 215, "num_iid": 634413319542, "pic_url": "https://img.alicdn.com/bao/uploaded/i2/2210005895332/O1CN01LClMdZ1pG6SrlgY4i_!!2210005895332.jpg", "title": "万代高达模型", "seller_cids": "-1" },
        //         { "price": "999.00", "approve_status": "onsale", "num": 215, "num_iid": 634413319543, "pic_url": "https://img.alicdn.com/bao/uploaded/i2/2210005895332/O1CN01LClMdZ1pG6SrlgY4i_!!2210005895332.jpg", "title": "万代高达模型万代高达模型万代高达模型万代高达模型万代高达模型", "seller_cids": "-1" },
        //         { "price": "110.00", "approve_status": "onsale", "num": 215, "num_iid": 634413319544, "pic_url": "https://img.alicdn.com/bao/uploaded/i2/2210005895332/O1CN01LClMdZ1pG6SrlgY4i_!!2210005895332.jpg", "title": "万代高达模型", "seller_cids": "-1" }
        //     ])

        //     Global.ResourceManager.PreloadResources();
        // }
        // console.log('login suc------', 23);

        HHAudio.PreloadAudioClip('ALL');

        console.log('login suc------', 24);
    }

    innerRound() {
        Laya.Tween.to(this.img_load, { rotation: 360 }, 4000, Laya.Ease.linearNone, Laya.Handler.create(this, function (): void {
            this.img_load.rotation = 0;
            this.innerRound();
        }, null, true));
    }

    onDisable(): void {
        Global.EventManager.off(Global.hallConfig.EventEnum.Res_Load_Complete, this, this.complete);
    }

    updateBar(value: number): void {
        console.log("updateBar value = ", value);
        if (value > 1) {
            value = 1;
        }
        this.loadingBar.value = value;
    }

    complete(curFrame: number = 0): void {
        this._curValue += 1;
        // this.loadingBar.value = this._curValue / this._allValue;
        this.progress.text = (20 + Math.floor(Global.ResourceManager._idx * 0.6)) + '%';
        if (Global.ResourceManager._idx < 100) {
            return;
        }
        if (!this._isComplete) {
            this._isComplete = true;
            console.log("进度条结束加载");
            // RankUtil.init();
            // TaskUtil.init();
            // BannerUtil.init();

            // if (Laya.Browser.onTBMiniGame) 
            // {
            //     // //加载网络资源
            //     let _cdn: string = Global.hallConfig._cdn;
            //     let ection = "ection_" + Global.ResourceManager.getAtmosphere().scene;
            //     Laya.loader.load([
            //         { url: _cdn + Global.hallConfig.FGui.common, type: Laya.Loader.BUFFER },
            //         { url: _cdn + Global.hallConfig.FGui.commonPng, type: Laya.Loader.IMAGE },
            //         { url: _cdn + Global.hallConfig.FGui.main, type: Laya.Loader.BUFFER },
            //         { url: _cdn + Global.hallConfig.FGui.mainPng, type: Laya.Loader.IMAGE },
            //         { url: _cdn + Global.hallConfig.FGui.Loading, type: Laya.Loader.BUFFER },
            //         { url: _cdn + Global.hallConfig.FGui.LoadingPng, type: Laya.Loader.IMAGE },
            //         // { url: Global.hallConfig.Ection[ection], type: Laya.Loader.IMAGE },
            //     ], Laya.Handler.create(this, (isSuccess) => {
            //         this.progress.text = '93%';
            //         if (isSuccess) {
            //             this.changeScene();
            //         }
            //         else {

            //         }
            //     }));
            // } else 
            {
                // this.progress.text = '93%';
                // let _res = FGUIConfig.CDNBasePath + 'res/FGUI/GameCommon.txt';
                // Laya.loader.load(_res, Laya.Handler.create(this, (result, result2) => {
                //     console.error('_package00', FGUIConfig.CDNBasePath + 'res/FGUI/GameCommon');
                //     fgui.UIPackage.loadPackage(FGUIConfig.CDNBasePath + 'res/FGUI/GameCommon', Laya.Handler.create(this, (result, result2) => {
                //         console.log('loadPackage', result, result2);

                //     }))
                //     // let _package = fgui.UIPackage.addPackage(FGUIConfig.CDNBasePath + 'res/FGUI/GameCommon');
                //     console.error('_package', result);

                // }));

                let _initComplete = () => {
                    this.progress.text = '95%';
                    FGUIUtil.PreLoadResouce('All', () => {
                        this.changeScene();
                    });

                    // ModulePackage.Instance.Show("base", 100, 100, this as any);
                }

                ModulePackage.Instance.PreloadResources();

                if (ModulePackage.Instance.IsInitComplete()) {
                    _initComplete();
                }
                else {
                    let callback = () => {
                        ModulePackage.Instance.off(ModulePackage.MODULE_INIT_COMPLETE, this, callback)
                        _initComplete();

                    };

                    ModulePackage.Instance.on(ModulePackage.MODULE_INIT_COMPLETE, this, callback);
                }

            }
        }
    }
    changeScene() {
        // fgui.UIPackage.addPackage(Global.hallConfig._cdn + MainUtil.getUI(Global.hallConfig.FGui.common));
        // if (IsCDN) {
        //     fgui.UIPackage.addPackage(Global.hallConfig._cdn + MainUtil.getUI(Global.hallConfig.FGui.common));
        // } else {
        //     fgui.UIPackage.addPackage(MainUtil.getUI(Global.hallConfig.FGui.common));
        // }
        GameLogic.Init();
        GameLogic.GetActivityState();
        GameLogic.listenRefreshNewNumber();
        MyGlobal.Init({ cdnData: false, dataManager: true, openFGUI: true });

        FGUIUtil.loadPackage('GameCommon', this, () => {
            TB.setBarColor(1);
            FGUIUtil.ShowScene(StartScene);
            this.progress.text = '100%';
        })
        // TaskUtil.getTaskList(() => {
        //     this.progress.text = '97%';
        //     PlayDataUtil.setData("isShowNotice", true);
        //     //MainUtil.analysis('enterHall', {});
        //     //跳转场景
        //     // Laya.physicsTimer.scale = 1;
        //     // Laya.Physics.I.allowSleeping = true;
        //     MyGlobal.Init({ cdnData: false, dataManager: true, openFGUI: true });

        //     FGUIUtil.loadPackage('GameCommon', this, () => {
        //         TB.setBarColor(1);
        //         FGUIUtil.ShowScene(StartScene);
        //         this.progress.text = '100%';
        //     })

        // })
        // PlayDataUtil.setData("isShowNotice", true);
        // //console.log("changeScene MainScene");

        // let t = new Date().getTime() - TB.getOpenAppTime();
        // console.log("openApp->enterHall time = ", t);
        // //MainUtil.analysis('enterHall', { diff_time : t, tag : TB.getOpenAppTime()});

        // //跳转场景
        // Laya.Scene.close(Global.loadSceneName)

        // new MainScene();
    }

    //界面适配
    centerFit() {
        this.bg.height = 2000;
        this.bg.x = 0;
        this.bg.y = 0;
    }

}
import moment from 'moment';

const QR = require('../../utils/qrcode.js')
//引入插件
var plugin = requirePlugin("myPlugin");
var Ename = "";
//这个bridge用于和插件进行数据通信
const bridge = {
    bizCode: "3000000041291431", //此处输入想配置的业务身份
    //这个方法用于获取插件中用户选择的奖池ID
    getCheckBenefitID({
        ename,
    }) {
        //在这这里把emame存到数据库就完成了商家配置。
        Ename = ename;
        my.navigateBack({
            delta: 1
        })
    },
};

const app = getApp();
const cloud = app.cloud;
let imageUrl = app.imageUrl;
let shareUrl = app.shareUrl;
let cloudFunction = app.cloudFunction;
let tbWebUrl = app.tbWebUrl;
let b_appId = app.b_appId;
let subCoin = 1;
let c_tb_url = app.c_tb_url;
let atmoConfig = [{
        id: 1,
        url: imageUrl + 'config/skin/fruit_2.png',
        customUrl: '',
        checkCustomUrl: false,
        width: 60,
        height: 60,
        shipName: '樱桃',
        check: true,
        type: 'default',
    },
    {
        id: 2,
        url: imageUrl + 'config/skin/fruit_3.png',
        customUrl: '',
        checkCustomUrl: false,
        width: 70,
        height: 70,
        shipName: '橘子',
        check: false,
        type: 'default',
    },
    {
        id: 3,
        url: imageUrl + 'config/skin/fruit_4.png',
        customUrl: '',
        checkCustomUrl: false,
        width: 70,
        height: 70,
        shipName: '柠檬',
        check: false,
        type: 'default',
    },
    {
        id: 4,
        url: imageUrl + 'config/skin/fruit_5.png',
        customUrl: '',
        checkCustomUrl: false,
        width: 70,
        height: 70,
        shipName: '猕猴桃',
        check: false,
        type: 'default',
    },
    {
        id: 5,
        url: imageUrl + 'config/skin/fruit_6.png',
        customUrl: '',
        checkCustomUrl: false,
        width: 70,
        height: 70,
        shipName: '番茄',
        check: false,
        type: 'default',
    },
    {
        id: 6,
        url: imageUrl + 'config/skin/fruit_8.png',
        customUrl: '',
        checkCustomUrl: false,
        width: 70,
        height: 70,
        shipName: '菠萝',
        check: false,
        type: 'default',
    },
    {
        id: 7,
        url: imageUrl + 'config/skin/fruit_9.png',
        customUrl: '',
        checkCustomUrl: false,
        width: 70,
        height: 70,
        shipName: '椰子',
        check: false,
        type: 'default',
    },
    {
        id: 8,
        url: imageUrl + 'config/skin/fruit_10.png',
        customUrl: '',
        checkCustomUrl: false,
        width: 70,
        height: 70,
        shipName: '半个西瓜',
        check: false,
        type: 'default',
    },
    {
        id: 9,
        url: imageUrl + 'config/skin/fruit_11.png',
        customUrl: '',
        checkCustomUrl: false,
        width: 70,
        height: 70,
        shipName: '大西瓜',
        check: false,
        type: 'default',
    }
];
let intergralRewardList = [{
    "exchangeConfig": {
        "state": true,
        "nums": 1
    },
    "price": "499",
    "integral": "18888",
    "approve_status": false,
    "num": "2",
    "name": "goods",
    "num_iid": "1",
    "type": 1,
    "pic_url": imageUrl + 'tmp/1.png',
    "title": " 真无线耳机 vivo TWS Neo 皓月白 N",
    "seller_cids": "custom"
}, {
    "exchangeConfig": {
        "state": true,
        "nums": 1
    },
    "price": "199",
    "integral": "11880",
    "approve_status": false,
    "num": "10",
    "name": "goods",
    "num_iid": "1",
    "type": 3,
    "pic_url": imageUrl + 'tmp/3.png',
    "title": "游戏手柄-iQOO",
    "seller_cids": "custom"
}, {
    "exchangeConfig": {
        "state": true,
        "nums": 1
    },
    "price": "99",
    "integral": "6180",
    "approve_status": false,
    "num": "20",
    "name": "goods",
    "num_iid": "1",
    "type": 2,
    "pic_url": imageUrl + 'tmp/2.png',
    "title": "18W充电器套装",
    "seller_cids": "custom"
}, {
    "exchangeConfig": {
        "state": true,
        "nums": 1
    },
    "price": "129",
    "integral": "8618",
    "approve_status": false,
    "num": "10",
    "name": "goods",
    "num_iid": "1",
    "type": 4,
    "pic_url": imageUrl + 'tmp/4.png',
    "title": "智能天猫精灵方糖R",
    "seller_cids": "custom"
},{
    "exchangeConfig": {
        "state": true,
        "nums": 1
    },
    "price": "120",
    "integral": "8618",
    "approve_status": false,
    "num": "40",
    "name": "goods",
    "num_iid": "1",
    "type": 5,
    "pic_url": imageUrl + 'tmp/5.png',
    "title": "游戏手柄 新游 N1Pro",
    "seller_cids": "custom"
},{
    "exchangeConfig": {
        "state": true,
        "nums": 1
    },
    "price": "200",
    "integral": "8618",
    "approve_status": false,
    "num": "100",
    "name": "goods",
    "num_iid": "1",
    "type": 6,
    "pic_url": imageUrl + 'tmp/6.png',
    "title": " 已包装耳机 50Ω Φ3.5 4POLE 白 XE800 精装",
    "seller_cids": "custom"
}, {
    "exchangeConfig": {
        "state": true,
        "nums": 1
    },
    "price": "80",
    "integral": "6618",
    "approve_status": false,
    "num": "25",
    "name": "goods",
    "num_iid": "1",
    "type": 7,
    "pic_url": imageUrl + 'tmp/7.png',
    "title": "欧姆龙血糖仪",
    "seller_cids": "custom"
}, {
    "exchangeConfig": {
        "state": true,
        "nums": 1
    },
    "price": "69",
    "integral": "5618",
    "approve_status": false,
    "num": "80",
    "name": "goods",
    "num_iid": "1",
    "type": 8,
    "pic_url": imageUrl + 'tmp/8.png',
    "title": "毛绒公仔 ZOEY 160×120×300",
    "seller_cids": "custom"
}, {
    "exchangeConfig": {
        "state": true,
        "nums": 1
    },
    "price": "20",
    "integral": "3618",
    "approve_status": false,
    "num": "100",
    "name": "goods",
    "num_iid": "10",
    "type": 9,
    "pic_url": imageUrl + 'tmp/10.png',
    "title": "彩虹中性笔 KACO 字母A K1032 酒红(十支装)",
    "seller_cids": "custom"
}];
Page({
        data: {
            c_tb_url:c_tb_url,
            current: 1,
            stockConfig: {},
            atmoConfig: JSON.parse(JSON.stringify(atmoConfig)),
            tbWebUrl: tbWebUrl,
            couponId: '',
            deadline: '',
            bouncedBox: 'cover_none',
            mergeBox: 'cover_none',
            integralBox: 'cover_none',
            customInfo: {
                pic_url: '',
                num: 0,
                title: '',
                price: 0,
                state: false,
            },
            imgTmp: '',
            meatchName: '',
            customImages: '../../images/config/jia.png',
            subPageName: "基本信息",
            jumpType: '',
            tf_img_url: '',
            tf_img_frame: 'cover_none',
            imageUrl: imageUrl,
            image_active: [1],
            activePid: 1,
            configType: '',
            customizeFrame: 'cover_none',
            cover: 'cover_none',
            more_shipList_frame: 'cover_none',
            single_shipList_frame: 'cover_none',
            single_shipList_frame_1: 'cover_none',
            rewardType: '',
            nextConfig: [{
                    title: '活动信息',
                    type: 'info'
                },
                {
                    title: '活动配置',
                    type: 'config'
                }, {
                    title: '投放推广',
                    type: 'put'
                }
            ],
            check_active_type: 1,
            // 氛围配置
            //   氛围mmain-图片
            atmo_main: '../../images/index/main.png',
            // 基础配置
            activeTypeList: {
                daily: {
                    typeId: 1,
                    title: '会员运营-预设配置',
                    msg: '适合日常运营需求, 有效提高用户活跃和留存, 间接提高新增和转化',
                    desc: '提升指标: 时长/活跃/留存',
                    imgUrl: '../../images/config/liu_cheng.png',
                    config: {
                        // 比赛消耗
                        subCoin: subCoin,
                        type: 'daily',
                        missionConfig: [],
                    }
                }
            },
            // C端固定任务配置
            // 不现实的任务数据
            disableMission: ['关注店铺', '加入会员', '邀请1名好友', '购买店铺商品'],
            // 最终活动配置
            active: {
                activeName: '',
                sTime: 0,
                eTime: 0,
                activeType: 'daily',
                storeId: 71799145,
                atmosphereConfig: JSON.parse(JSON.stringify(atmoConfig)),
                rule: "1 、用户消耗一定的金币，进入游戏，通过对相同水果的位置合并，可合成更为高阶的水果，每次合成均可得分，得分越高，所获得的积分越多。\n2 、用户可通过积分，兑换商家设定的商品奖励。兑换奖品后，可以在奖品包中查看详情，向商家申请发货。\n3、用户可以通过任务，获得金币及积分奖励。\n4、游戏内购买商品获得奖励时，下单后请点击做返回游戏，否则无法获得任务奖励。",
                missionConfig: [],
                basisConfig: {
                    promotionList: [],
                    isVipSystem: true,
                    subCoin: subCoin,
                    shareConfig: {
                        shareTitle: 'iQOO合成大作战',
                        shareURL: shareUrl + 'config/skin/tmp_3.png',
                        shareDesc: '冲榜单, 赢618手机免单',
                    }
                },
                // 积分商品配置
                integralRewardConfig: {
                    resetConfig: {
                        state: false,
                        time: '20:00:00',
                    },
                    rewardList: intergralRewardList,
                },
                // 合成奖励
                mergeRewardConfig: [{}],
                // 游戏弹窗配置
                bouncedConfig: {
                    // 福袋奖励配置:
                    luckyBag: {

                    },
                    // 开始弹窗
                    startGame: {
                        // 未购买
                        no: imageUrl + "config/no2.png",
                        // 已购买
                        yes: imageUrl + "config/yes2.png",
                    },
                    // 结算弹窗
                    endGame: {
                        // 未购买
                        no: imageUrl + "config/no2.png",
                        // 已购买
                        yes: imageUrl + "config/yes2.png",
                    }
                }
            },
            //   需要展示的商品数据
            shipList: [],
            //   接口返回全部商品数据
            allShipdata: [],
            //   临时商品数组
            tmpShipList: [],
            checkAllShipList: [],
            skip: 1,
            limit: 9999,
            pageSize: 10,
            total: 0,
            activeId: '',
            tb_url: '',
            tb_appid: '',
            redState: '',
        },
        async onLoad(option) {
            //必要信息，请勿遗漏
            plugin.setBridge(bridge);
            // 获取缓存中基础配置信息
            await this.getStoryData();
            // option = {
            //     activeId:"b7M7UCEuejYaAgahmxyz"
            // }
            if (option && option.activeId) {
                this.setData({
                    activeId: option.activeId,
                    image_active: [1],
                    activePid: 1,
                });
                // 获取活动数据
                let _activeData = await cloud.function.invoke(cloudFunction, {
                    data: {
                        activeId: option.activeId
                    }
                }, 'B_MSG_3002');
                _activeData = JSON.parse(_activeData);
                console.log("获取修改活动数据", _activeData)

                if (_activeData.data) {
                    let _stockConfig = _activeData.data.stockConfig;
                    let _mergeConfig = _activeData.data.mergeConfig;

                    let _basisConfig = {
                        promotionList: _activeData.data.gameConfig.promotionList,
                        isVipSystem: _activeData.data.isVipSystem,
                        shareConfig: _activeData.data.gameConfig.shareConfig,
                        subCoin: _activeData.data.gameConfig.subCoin,
                    }
                    let _bouncedConfig = {
                        // 福袋奖励配置:
                        luckyBag: {

                        },
                        // 开始弹窗
                        startGame: {
                            // 未购买
                            no: imageUrl + "config/no2.png",
                            // 已购买
                            yes: imageUrl + "config/yes2.png",
                        },
                        // 结算弹窗
                        endGame: {
                            // 未购买
                            no: imageUrl + "config/no2.png",
                            // 已购买
                            yes: imageUrl + "config/yes2.png",
                        }
                    }
                    if (_activeData.data.bouncedConfig) {
                        _bouncedConfig = _activeData.data.bouncedConfig;
                    }
                    let _obj = {
                        activeName: _activeData.data.activeName,
                        shopName: _activeData.data.shopName,
                        sTime: moment(parseInt(_activeData.data.sTime)).format('YYYY-MM-DD HH:mm:ss').valueOf(),
                        eTime: moment(parseInt(_activeData.data.eTime)).format('YYYY-MM-DD HH:mm:ss').valueOf(),
                        activeType: _activeData.data.activeType,
                        storeId: _activeData.data.storeId,
                        basisConfig: _basisConfig,
                        integralRewardConfig: _activeData.data.integralRewardConfig,
                        atmosphereConfig: _activeData.data.gameConfig.atmosphereConfig,
                        missionConfig: _activeData.data.gameConfig.missionConfig,
                        mergeRewardConfig: _activeData.data.mergeRewardConfig,
                        rule: _activeData.data.gameConfig.rule,
                        bouncedConfig: _bouncedConfig
                    };

                    for (let i = 0; i < _obj.atmosphereConfig.length; i++) {
                        const item = _obj.atmosphereConfig[i];
                        let _index = this.data.atmoConfig.findIndex(v => v.id == item.id);
                        let _atmoInfo = this.data.atmoConfig[_index];
                        if (item.type == 'custom' && item.checkCustomUrl == true) {
                            _obj.atmosphereConfig[i].url = _atmoInfo.url;
                        }
                    }

                    this.data.activeTypeList.daily.config.missionConfig = JSON.parse(JSON.stringify(_obj.missionConfig));
                    // console.log("获取修改活动数据", _obj)

                    _stockConfig = _stockConfig.sort((a, b) => {
                        return a.type - b.type
                    })

                    _mergeConfig = _mergeConfig.sort((a, b) => {
                        return a.type - b.type
                    })

                    console.log('积分商品库存数据', _stockConfig)
                    console.log('合成商品库存数据', _mergeConfig)

                    this.setData({
                        stockConfig: _stockConfig,
                        mergeConfig: _mergeConfig,
                        activeTypeList: this.data.activeTypeList,
                        active: _obj,
                        check_active_type: _obj.activeType == 'daily' ? 1 : _obj.activeType == 'custom' ? 2 : 1,
                    })
                }
            }
        },
        async onShow() {
            this.setData({
                atmoConfig: atmoConfig
            });

            // 获取任务配置
            await this.getMissionConfig();
            // 初始化 商品list
            await this.initShipList();
            // 设置topy页面pagename
            await my.setStorageSync({
                key: "pageName",
                data: "活动配置"
            });
            // 活动时间
            let sTime = moment().valueOf();
            // 下一个月时间
            let eTime = moment().add(1, 'months').valueOf()
            if (this.data.deadline) {
                eTime = moment(this.data.deadline).valueOf();
            }
            if (typeof (this.data.active.sTime) == 'number' && typeof (this.data.active.eTime) == 'number') {
                this.data.active.sTime = moment(parseInt(sTime)).format('YYYY-MM-DD HH:mm:ss').valueOf();
                this.data.active.eTime = moment(parseInt(eTime)).format('YYYY-MM-DD HH:mm:ss').valueOf();
                this.setData({
                    active: this.data.active
                })
            }

            // 检测是否如果没有活动id并且配置完成,初始化配置
            if (!this.data.activeId && this.data.image_active.length >= 3) {
                let _initActiveConfig = {
                    activeName: this.data.active.activeName,
                    sTime: moment(parseInt(sTime)).format('YYYY-MM-DD HH:mm:ss').valueOf(),
                    eTime: moment(parseInt(eTime)).format('YYYY-MM-DD HH:mm:ss').valueOf(),
                    activeType: 'daily',
                    storeId: 71799145,
                    atmosphereConfig: JSON.parse(JSON.stringify(atmoConfig)),
                    rule: "1 、用户消耗一定的金币，进入游戏，通过对相同水果的位置合并，可合成更为高阶的水果，每次合成均可得分，得分越高，所获得的积分越多。\n2 、用户可通过积分，兑换商家设定的商品奖励。兑换奖品后，可以在奖品包中查看详情，向商家申请发货。\n3、用户可以通过任务，获得金币及积分奖励。\n4、游戏内购买商品获得奖励时，下单后请点击做返回游戏，否则无法获得任务奖励。",
                    missionConfig: [],
                    basisConfig: {
                        promotionList: [],
                        isVipSystem: true,
                        subCoin: subCoin,
                        shareConfig: {
                            shareTitle: 'iQOO合成大作战',
                            shareURL: shareUrl + 'config/skin/tmp_3.png',
                            shareDesc: '冲榜单, 赢618手机免单',
                        }
                    },
                    // 积分商品配置
                    integralRewardConfig: {
                        resetConfig: {
                            state: false,
                            time: '20:00:00',
                        },
                        rewardList: intergralRewardList,
                    },
                    // 合成奖励
                    mergeRewardConfig: [{}],
                    // 弹窗配置
                    bouncedConfig: {
                        // 福袋奖励配置:
                        luckyBag: {
                        },
                        // 开始弹窗
                        startGame: {
                            // 未购买
                            no: imageUrl + "config/no2.png",
                            // 已购买
                            yes: imageUrl + "config/yes2.png",
                        },
                        // 结算弹窗
                        endGame: {
                            // 未购买
                            no: imageUrl + "config/no2.png",
                            // 已购买
                            yes: imageUrl + "config/yes2.png",
                        }
                    }
                }
                this.setData({
                    image_active: [1],
                    activePid: 1,
                    active: _initActiveConfig,
                    subPageName: '基本信息'
                })
            }
            if (Ename) {
                console.log('Ename', Ename)
                let ename_result = await cloud.topApi.invoke({
                    api: 'alibaba.benefit.query',
                    data: {
                        'ename': Ename,
                        'app_name': 'promotioncenter-' + b_appId,
                        'award_type': '1',
                    }
                });

                let ename_title = '';
                let ename_num = '';
                let ename_price = '';
                let ename_use_start_time = '';
                let ename_use_end_time = '';

                if (ename_result) {
                    if (ename_result.result.datas.length > 0) {
                        ename_title = ename_result.result.datas[0].benefit_name;
                        ename_num = ename_result.result.datas[0].prize_quantity;
                        ename_price = (ename_result.result.datas[0].amount / 100).toString();
                        ename_use_start_time = ename_result.result.datas[0].use_start_time;
                        ename_use_end_time = ename_result.result.datas[0].use_end_time;
                    }
                }
                // 第二步
                if (this.data.configType === 'integral') {
                    let rewardType = this.data.rewardType
                    let name = this.data.redState == 'true' ? 'redPacket' : 'coupon';
                    
                    let redIngergalNum = this.data.redState == 'true' ? 1618 : 0;
                    let pic_url = this.data.redState == 'true' ? 'https://oss.ixald.com/BigWatermelon/admin/images/redpacket.png' : 'https://oss.ixald.com/bigFight/admin/images/yhj.png';

                    this.data.active.integralRewardConfig.rewardList[rewardType - 1] = {
                        name: name,
                        type: rewardType,
                        approve_status: '',
                        num: ename_num,
                        num_iid: Ename,
                        pic_url: pic_url,
                        price: ename_price,
                        seller_cids: '',
                        title: ename_title,
                        use_start_time: ename_use_start_time,
                        use_end_time: ename_use_end_time,
                        linkId: 0,
                        integral: redIngergalNum,
                        exchangeConfig: {
                            state: true,
                            nums: 1
                        },
                    };
                    this.setData({
                        active: this.data.active
                    })
                }
                // 第三步
                if (this.data.configType === 'merge') {
                    let rewardType = this.data.rewardType

                    this.data.active.mergeRewardConfig[rewardType - 1] = {
                        name: 'coupon',
                        type: rewardType,
                        num: ename_num,
                        num_iid: Ename,
                        pic_url: 'https://oss.ixald.com/bigFight/admin/images/yhj.png',
                        price: ename_price,
                        title: ename_title,
                        use_start_time: ename_use_start_time,
                        use_end_time: ename_use_end_time,
                        nums: 0,
                        linkId: 0,
                    };
                    this.setData({
                        active: this.data.active
                    })
                };
                // 红包
                if (this.data.configType === 'bounced') {
                    this.data.active.bouncedConfig.luckyBag = {
                        name: 'redpacket',
                        type: 1,
                        num: ename_num,
                        num_iid: Ename,
                        pic_url: 'https://oss.ixald.com/BigWatermelon/admin/images/redpacket.png',
                        price: ename_price,
                        title: ename_title,
                        use_start_time: ename_use_start_time,
                        use_end_time: ename_use_end_time,
                        nums: 0,
                    };
                    this.setData({
                        active: this.data.active
                    })
                }
            }
        },
        onHide() {
            Ename = '';
            console.log('退出活动配置页面');
        },
        async getStoryData() {
            this.data.active.activeName = 'iQOO合成大作战_' + moment().format("YYYYMMDDhhmm").valueOf();

            this.setData({
                active: this.data.active
            })
            // 获取服务器到期时间
            let _deadline = my.getStorageSync({
                key: "deadline"
            })
            if (_deadline.data) {
                this.setData({
                    deadline: _deadline.data
                })
            };
        },
        // 初始化商品列表数据
        async initShipList() {
            // 数据调用，获取商品list
            let shipList = await cloud.function.invoke(cloudFunction, {
                data: {
                    skip: this.data.skip,
                    limit: this.data.pageSize,
                }
            }, "SaleShopItems");
            shipList = JSON.parse(shipList);

            if (shipList.data && shipList.data.list.length > 0) {
                // 修改活动商铺数据标记选中
                if (this.data.active.basisConfig.promotionList.length > 0) {
                    for (let i = 0; i < this.data.active.basisConfig.promotionList.length; i++) {
                        const item_1 = this.data.active.basisConfig.promotionList[i];
                        for (let j = 0; j < shipList.data.list.length; j++) {
                            const item_2 = shipList.data.list[j];
                            if (item_1.num_iid == item_2.num_iid) {
                                shipList.data.list[j]['moreDisplay'] = true;
                            }
                        }
                    }
                };
                console.log('shipList', shipList.data.list);
                console.log('this.data.active.basisConfig.promotionList', this.data.active.basisConfig.promotionList)
                this.setData({
                    shipList: shipList.data.list,
                    checkAllShipList: this.data.active.basisConfig.promotionList,
                    total: shipList.data.shipTotal
                })
            }
        },
        // 选择基础信息活动配置
        checkActiveEvent(e) {
            let typeId = e.currentTarget.dataset.typeId;
            let config = e.currentTarget.dataset.config;
            let type = config.type;

            this.data.active.basisConfig.subCoin = config.subCoin;
            this.data.active.activeType = type

            this.setData({
                check_active_type: typeId,
                active: this.data.active,
            })
        },
        // 开关选择
        checkSwitchEvent(e) {
            let type = e.currentTarget.dataset.type;

            this.data.active.basisConfig[type] = !this.data.active.basisConfig[type]
            this.setData({
                active: this.data.active,
            })
        },
        // 打开商品
        async checkShipData(e) {
            let configType = e.currentTarget.dataset.configType;
            let redState = e.currentTarget.dataset.redState;
            // 打开多选商品弹窗
            if (configType === 'promotion') {
                this.setData({
                    redState: redState,
                    cover: 'cover',
                    more_shipList_frame: 'more_shipList_frame'
                })
            }
            // 打开单选商品弹窗
            if (configType === 'integral') {
                let rewardType = e.currentTarget.dataset.rewardType;
                this.setData({
                    single_shipList_frame: 'single_shipList_frame',
                    cover: 'cover_1',
                    rewardType: rewardType,
                    skip: 1,
                    pageSize: 10,
                    redState: redState,
                })
            }
        },
        // 关闭弹窗
        close(e) {
            let type = e;
            let cover = 'cover_none';
            if (type.currentTarget) {
                type = type.currentTarget.dataset.close
            }
            this.data[type] = 'cover_none';
            if (type === 'single_shipList_frame' || type === "single_shipList_frame_1" || type === 'customizeFrame') {
                cover = 'cover'
            }
            this.setData({
                type: this.data[type],
                cover: cover,
                more_shipList_frame: this.data[type],
                single_shipList_frame: this.data[type],
                single_shipList_frame_1: this.data[type],
                tf_img_frame: 'cover_none',
                customizeFrame: 'cover_none',
            })
        },
        async onPageChange(e) {
            let skip = e.detail.value;
            let limit = e.detail.limit;
            // 数据调用，获取商品list
            let shipList = await cloud.function.invoke(cloudFunction, {
                data: {
                    skip: skip,
                    limit: limit ? limit : this.data.pageSize,
                }
            }, "SaleShopItems");
            shipList = JSON.parse(shipList);
            for (let i = 0; i < this.data.shipList.length; i++) {
                const item = this.data.shipList[i];
                if (item.moreDisplay) {
                    this.data.tmpShipList.push(item);
                }
            }
            for (let i = 0; i < shipList.data.list.length; i++) {
                const item_i = shipList.data.list[i];
                for (let j = 0; j < this.data.tmpShipList.length; j++) {
                    const item_j = this.data.tmpShipList[j];
                    if (item_j.moreDisplay && item_i.num_iid == item_j.num_iid) {
                        shipList.data.list[i]['moreDisplay'] = true;
                    }
                }
            }

            // 修改活动商铺数据标记选中
            if (this.data.active.basisConfig.promotionList.length > 0) {
                for (let i = 0; i < this.data.active.basisConfig.promotionList.length; i++) {
                    const item_1 = this.data.active.basisConfig.promotionList[i];
                    for (let j = 0; j < shipList.data.list.length; j++) {
                        const item_2 = shipList.data.list[j];
                        if (item_1.num_iid == item_2.num_iid) {
                            shipList.data.list[j]['moreDisplay'] = true;
                        }
                    }
                }
            };


            this.setData({
                shipList: shipList.data.list,
                current: skip
            })
        },
        // 分页处理
        onPageSizeChange(e) {
            if (e.detail && e.detail.value) {
                this.setData({
                    pageSize: e.detail.value
                })
                this.onPageChange({
                    detail: {
                        limit: e.detail.value
                    }
                });

            }
        },
        // 搜索商品
        async searchShipData(e) {
            if (e.detail && e.detail.value) {
                // 调用接口返回指定查询的商品信息
                let searchShipList = await cloud.function.invoke(cloudFunction, {
                    data: {
                        type: 'search',
                        title: e.detail.value,
                    }
                }, "SaleShopItems");
                searchShipList = JSON.parse(searchShipList);
                if (searchShipList.data.list.length > 0) {
                    this.setData({
                        shipList: searchShipList.data.list,
                        total: searchShipList.data.shipTotal
                    })
                }
            } else {
                this.onShow()
            }
        },
        // 选择商品
        checkShopItem(e) {
            let checkShipType = e.currentTarget.dataset.type;
            let configType = e.currentTarget.dataset.configType;
            if (this.data.integralBox === 'integralBox') {
                configType = 'integral'
            }

            let num_iid = e.currentTarget.dataset.num_iid;
            let close = e.currentTarget.dataset.close

            if (checkShipType === 'more') {
                for (let i = 0; i < this.data.shipList.length; i++) {
                    const item = this.data.shipList[i];
                    if (num_iid == item.num_iid) {
                        if (!item.moreDisplay) {
                            this.data.shipList[i]['moreDisplay'] = true;
                            // 全选增加
                            if (this.data.checkAllShipList.findIndex(v => v.num_iid == num_iid) >= 0) {
                                // continue
                            } else {
                                this.data.checkAllShipList.push(item);
                            }
                        } else {
                            this.data.shipList[i]['moreDisplay'] = false;
                            // 全选减少
                            let _pIndex = this.data.checkAllShipList.findIndex(v => v.num_iid == num_iid);
                            if (_pIndex >= 0) {
                                this.data.checkAllShipList.splice(_pIndex, 1)
                            }
                        }
                    }
                }

                this.setData({
                    shipList: this.data.shipList,
                    checkAllShipList: this.data.checkAllShipList
                })

            }
            if (checkShipType === 'single') {
                for (let i = 0; i < this.data.shipList.length; i++) {
                    const item = this.data.shipList[i];
                    if (num_iid == item.num_iid) {
                        if (!item.singleDisplay) {
                            this.data.shipList[i]['singleDisplay'] = true;
                        } else {
                            this.data.shipList[i]['singleDisplay'] = false;
                        }
                    } else {
                        this.data.shipList[i]['singleDisplay'] = false;
                    }
                }

                this.setData({
                    shipList: this.data.shipList
                })
            }
            if(checkShipType === 'cancel') {
                
                for (let i = 0; i < this.data.shipList.length; i++) {
                    const item = this.data.shipList[i];
                    this.data.shipList[i]['moreDisplay'] = false;

                    if (this.data.shipList[i]['moreDisplay'] === false) {
                        let _pIndex = this.data.checkAllShipList.findIndex(v => v.num_iid == item.num_iid);
                        if (_pIndex >= 0) {
                            this.data.checkAllShipList.splice(_pIndex, 1);
                        }
                    }
                }

                this.setData({
                    shipList: this.data.shipList,
                    checkAllShipList: this.data.checkAllShipList
                })
            }
            if (checkShipType === 'all') {
                for (let i = 0; i < this.data.shipList.length; i++) {
                    const item = this.data.shipList[i];
                    this.data.shipList[i]['moreDisplay'] = true;

                    if (this.data.shipList[i]['moreDisplay'] === true) {
                        let _pIndex = this.data.checkAllShipList.findIndex(v => v.num_iid == item.num_iid);
                        if (_pIndex < 0) {
                            this.data.checkAllShipList.push(item);
                        }
                    }
                }
                this.setData({
                    shipList: this.data.shipList,
                    checkAllShipList: this.data.checkAllShipList
                })
            }
            if (checkShipType === 'ok') {
                // 促销商品
                if (configType === 'promotion') {
                    // 初始化
                    this.data.active.basisConfig.promotionList = [];

                    for (let i = 0; i < this.data.checkAllShipList.length; i++) {
                        const item = this.data.checkAllShipList[i];
                        let obj = {
                            approve_status: item.approve_status,
                            num: item.num,
                            num_iid: (item.num_iid).toString(),
                            pic_url: item.pic_url,
                            price: item.price,
                            seller_cids: item.seller_cids,
                            title: item.title,
                        }
                        this.data.active.basisConfig.promotionList.push(obj)
                    }
                }
                for (let i = 0; i < this.data.shipList.length; i++) {
                    const item = this.data.shipList[i];
                    // 积分奖品
                    if (configType === 'integral' && item.singleDisplay) {

                        let obj = {
                            name: 'goods',
                            type: this.data.rewardType,
                            approve_status: item.approve_status,
                            num: item.num,
                            num_iid: (item.num_iid).toString(),
                            pic_url: item.pic_url,
                            price: item.price,
                            seller_cids: item.seller_cids,
                            title: item.title,
                            integral: this.data.active.integralRewardConfig.rewardList[this.data.rewardType - 1].interval ? this.data.active.integralRewardConfig.rewardList[this.data.rewardType - 1] : 0,
                            exchangeConfig: {
                                state: true,
                                nums: 1
                            },

                        };
                        this.data.active.integralRewardConfig.rewardList[this.data.rewardType - 1] = obj;
                    }
                    // 积分奖品
                    if (configType === 'bounced' && item.singleDisplay) {

                        let obj = {
                            name: 'goods',
                            approve_status: item.approve_status,
                            num: item.num,
                            num_iid: (item.num_iid).toString(),
                            pic_url: item.pic_url,
                            price: item.price,
                            seller_cids: item.seller_cids,
                            title: item.title,
                        };
                        this.data.active.bouncedConfig.luckyBag = obj;
                    }

                }
                this.setData({
                    active: this.data.active,
                    shipList: this.data.shipList
                })
                this.close(close)
            }

        },
        async fudaiReward(e) {
            let configType = e.currentTarget.dataset.configType
            // 打开单选商品弹窗
            if (configType === 'bounced') {
                this.setData({
                    single_shipList_frame_1: 'single_shipList_frame_1',
                    cover: 'cover_1',
                    skip: 1,
                    pageSize: 10
                })
            }

        },
        // 优惠券
        navigateToPlugin(e) {
            let rewardType = e.currentTarget.dataset.rewardType;
            let redState = e.currentTarget.dataset.redState;
            let configType = e.currentTarget.dataset.configType;
            // 这个方法用于跳转到插件页面navigateToPlugin
            this.setData({
                rewardType: rewardType,
                configType: configType,
                redState: redState
            })
            my.navigateTo({
                url: 'plugin://myPlugin/orightindex-page',
            });
        },
        // 红包
        navigateToPlugin_red(e) {
            let rewardType = e.currentTarget.dataset.rewardType
            let configType = e.currentTarget.dataset.configType;
            let redState = e.currentTarget.dataset.redState;
            // 这个方法用于跳转到插件页面navigateToPlugin
            this.setData({
                configType: configType,
                rewardType: rewardType,
                redState: redState
            })
            my.navigateTo({
                url: 'plugin://myPlugin/orightindex-page',
            });
        },
        // 下一步
        async nextConfig(e) {
            this.data.activePid = parseInt(this.data.activePid)
            let state = await this.dead_common()
            if (!state) {
                return false;
            }
            let type = e.currentTarget.dataset.type;

            if (type == 'stepUp') {
                if (this.data.activePid > 0) {
                    let indexId = this.data.image_active.indexOf(this.data.activePid);
                    this.data.image_active.splice(indexId, 1);
                    this.data.activePid -= 1
                }
            } else {
                if (this.data.activePid == 1) {
                    if (!this.data.active.activeName) {
                        my.showToast({
                            type: 'fail',
                            content: '请配置活动名称,在继续下一步操作~'
                        })
                        return;
                    }
                    // 检测活动名称
                    let _activeNameExits = await cloud.function.invoke(cloudFunction, {
                        data: {
                            activeName: this.data.active.activeName
                        }
                    }, "B_MSG_4011")
                    _activeNameExits = JSON.parse(_activeNameExits);

                    if (this.data.activeId == '' && _activeNameExits.data.state == true) {
                        my.showToast({
                            type: 'fail',
                            content: '该活动名称已存在,请重新填写~'
                        })
                        return;
                    }

                    if (
                        moment(this.data.active.eTime).valueOf() < moment(this.data.active.sTime).add(3, 'hours').valueOf()
                    ) {
                        my.showToast({
                            type: 'fail',
                            content: '活动时间至少大于3小时'
                        });
                        return
                    }

                    if (
                        moment(this.data.active.sTime).valueOf() > moment(this.data.deadline).valueOf() ||
                        moment(this.data.active.eTime).valueOf() > moment(this.data.deadline).valueOf()
                    ) {
                        my.showToast({
                            type: 'fail',
                            content: '活动时间不能大于产品到期时间，请续订小程序'
                        });
                        return
                    }
                    this.setData({
                        subPageName: '活动配置'
                    })
                }
                if (this.data.activePid == 2) {
                    if (this.data.active.basisConfig.promotionList.length <= 0) {
                        my.showToast({
                            type: 'fail',
                            content: '请配置促销商品,在继续下一步操作~'
                        })
                        return;
                    }

                    if (this.data.active.integralRewardConfig.rewardList.length < 1) {
                        my.showToast({
                            type: 'fail',
                            content: '请完成配置积分奖品,在继续下一步操作~'
                        })
                        return;
                    }

                    if (
                        !this.data.active.bouncedConfig.startGame.no ||
                        !this.data.active.bouncedConfig.startGame.yes ||
                        !this.data.active.bouncedConfig.endGame.no ||
                        !this.data.active.bouncedConfig.endGame.yes
                    ) {
                        my.showToast({
                            type: 'fail',
                            content: '请完成弹窗配置,在继续下一步操作~'
                        })
                        return;
                    }

                    this.setData({
                        subPageName: '投放推广'
                    })
                }

                if (this.data.activePid < 3) {
                    this.data.activePid += parseInt(1);
                    this.data.image_active.push(this.data.activePid)
                }
            }

            if (this.data.activePid >= 3) {
                // 获取商家的名称
                let _shopName = await my.getStorageSync({
                    key: 'userInfo'
                })
                if (_shopName.data) {
                    this.data.active.shopName = _shopName.data.nickName;
                    this.setData({
                        active: this.data.active
                    })
                };
                // 判断最终选择的任务类型
                this.data.active.missionConfig = JSON.parse(JSON.stringify(this.data.activeTypeList[this.data.active.activeType].config.missionConfig));

                // 更改活动时间为时间戳
                this.data.active.sTime = moment(this.data.active.sTime).valueOf();
                this.data.active.eTime = moment(this.data.active.eTime).valueOf();

                console.log('活动名称', this.data.active.activeName)

                if (this.data.activeId) {
                    let updateData = {
                        activeId: this.data.activeId,
                        ...this.data.active
                    };
                    // 更新活动
                    let updateActive = await cloud.function.invoke(cloudFunction, {
                        data: updateData
                    }, 'B_MSG_3004');
                    updateActive = JSON.parse(updateActive);
                    this.setData({
                        activeId: this.data.activeId
                    })

                    console.log('----更新活动----', updateActive)
                    console.log('----最终配置----', updateData);
                } else {
                    // 创建活动
                    let crateActive = await cloud.function.invoke(cloudFunction, {
                        data: this.data.active
                    }, "B_MSG_3003");
                    crateActive = JSON.parse(crateActive);
                    this.setData({
                        activeId: crateActive.data.activeId
                    })

                    console.log('----创建活动----', crateActive)
                    console.log('----最终配置----', this.data.active);

                }
                await this.createQrCode(c_tb_url + '&query=' + encodeURI('activeId=' + this.data.activeId), "mycanvasDetail", 150, 150);
            }

            this.setData({
                activePid: parseInt(this.data.activePid),
                image_active: this.data.image_active,
            })
        },
        async createQrCode(url, canvasId, cavW, cavH) {
            //调用插件中的draw方法，绘制二维码图片
            QR.api.draw(url, canvasId, cavW, cavH, this);

        },

        // 替换选择
        globalData(e) {
            let type = e.currentTarget.dataset.type;
            let value = e.detail.value;
            if (type == 'activeName') {
                this.data.active.activeName = value;
            }
            console.log('this.data.active.activeName', this.data.active.activeName)
            this.setData({
                active: this.data.active,
            });
        },
        // 跳转
        jump(e) {
            let type = e.currentTarget.dataset.type;
            if (type === 'configlist') {
                my.navigateTo({
                    url: '/page/configlist/configlist'
                });
                my.qn.switchTabEx({
                    id: 'configlist'
                })
            }
        },
        // 修改商品数量
        giftShipNum(e) {
            let type = e.currentTarget.dataset.type;
            let value = e.detail.value;

            if (value <= 0) {
                my.showToast({
                    type: 'fail',
                    content: '商品库存最少为1'
                })
                return false;
            }

            for (let i = 0; i < this.data.active.giftRewardConfig.length; i++) {
                const item = this.data.active.giftRewardConfig[i];
                if (item.type == type) {
                    this.data.active.giftRewardConfig[i].num = parseInt(value);
                }
            }
            this.setData({
                active: this.data.active
            })
        },
        // 复制剪切板
        setClipboard(e) {
            let activeUrl = e.currentTarget.dataset.activeUrl;
            my.setClipboard({
                text: activeUrl,
                success: function () {
                    my.showToast({
                        type: 'success',
                        content: '复制成功~'
                    })
                }
            });
        },
        tf_jump(e) {
            let type = e.currentTarget.dataset.type;
            // 直播
            if (type === 'video') {
                my.qn.navigateToWebPage({
                    url: "https://liveplatform.taobao.com/live/live_detail.htm%20%20?spm=a217wi.openworkbeachtb",
                    success: res => {},
                    fail: res => {}
                });
            }
            if (type === 'toufang') {
                my.qn.navigateToWebPage({
                    url: "https://market.m.taobao.com/app/taefed/shopping-delivery-wapp/index.html#/putin?tabKey=all&appId=" + this.data.tb_appid,
                    success: res => {},
                    fail: res => {}
                });
            }
            // 淘宝旺铺
            if (type === 'tb_wangwang') {
                my.qn.navigateToWebPage({
                    url: "https://xiangqing.wangpu.taobao.com/index.html?spm=a211b7.9460856.0.0.295c1e7dCLEGOL",
                    success: res => {},
                    fail: res => {}
                });
            }

            // 直播教程
            if (type === 'video_Tutorials') {
                my.qn.navigateToWebPage({
                    url: "https://www.yuque.com/docs/share/5ecc9bd5-f550-4d0d-86eb-88d54c9b704c?#YPfBT",
                    success: res => {},
                    fail: res => {}
                });

            }

            // 手淘首页
            if (type === 'taobao_main') {
                my.qn.navigateToWebPage({
                    url: "https://www.yuque.com/docs/share/5ecc9bd5-f550-4d0d-86eb-88d54c9b704c?#YPfBT",
                    success: res => {},
                    fail: res => {}
                });
            }
            // 手淘详情
            if (type === 'taobao_detail') {
                my.qn.navigateToWebPage({
                    url: "https://www.yuque.com/docs/share/5ecc9bd5-f550-4d0d-86eb-88d54c9b704c?#YPfBT",
                    success: res => {},
                    fail: res => {}
                });
            }
        },
        async dead_common() {

            if (cloud.topApi.options.env === 'test') {
                my.showToast({
                    type: 'success',
                    content: '当前测试环境：TEST（正式服不提示！！！）'
                })
                return true;
            }

            // 子账户未授权不能登陆
            let _childAccount = my.getStorageSync({
                key: "childAccountError"
            })
            if (_childAccount.data) {
                if (_childAccount.data.state === true) {
                    my.alert({
                        title: '温馨提示',
                        content: "请前往账号中心,配置子账号授权该小程序~",
                        buttonText: '马上去',
                        success: () => {
                            my.qn.navigateToWebPage({
                                url: "https://zizhanghao.taobao.com/",
                                success: (res) => {
                                    console.log('res', res)
                                },
                                fail: (res) => {
                                    console.error('res', res)
                                }
                            });
                        }
                    });
                    return false;
                }
            }
            return true;
        },
        // 优惠券教程跳转
        couponHelp() {
            my.qn.navigateToWebPage({
                url: "https://www.yuque.com/docs/share/5ecc9bd5-f550-4d0d-86eb-88d54c9b704c?#WBwmc",
                success: res => {},
                fail: res => {}
            });
        },
        // 自定义商品
        async customizeEvent(e) {
            let rewardType = e.currentTarget.dataset.rewardType;
            let configType = e.currentTarget.dataset.configType;

            // 初始化自定义
            this.data.customInfo.pic_url = '';
            this.data.customInfo.num = 0;
            this.data.customInfo.title = '';
            this.data.customInfo.price = 0;
            this.data.customInfo.state = false;

            this.setData({
                cover: 'cover_1',
                customizeFrame: 'customizeFrame',
                rewardType: rewardType,
                customInfo: this.data.customInfo,
                configType: configType
            })

        },
        async shipUploadImage(e) {
            // 打开文件对话框并选择文件
            let _tmpFile = await my.chooseImage({
                count: 1, // 返回的文件数，默认 1
                type: 0x01, // 图片=0x01，文档=0x02，多媒体=0x04，自由组合，默认 0x01
            });
            if (_tmpFile.success == true) {
                console.log('-----选择图片-----', _tmpFile)
                // 检测图片大小
                let _imageInfo = await my.getImageInfo({
                    src: _tmpFile.apFilePaths[0],
                })
                console.log('-----检测图片大小-----', _imageInfo)

                let _fileName = moment().format('YYYYMMDDhhmmss').valueOf() + '.png';
                let _fileInfo = await cloud.file.uploadFile({
                    filePath: _tmpFile.apFilePaths[0],
                    fileType: 'image',
                    fileName: '/tmp/' + _fileName,
                    seller: false,
                })
                // 物品图片上传
                if (this.data.activePid == 1 && _fileInfo.url) {
                    let id = e.currentTarget.dataset.id;

                    for (let i = 0; i < this.data.active.atmosphereConfig.length; i++) {
                        const item = this.data.active.atmosphereConfig[i];
                        if (item.id === id) {
                            this.data.active.atmosphereConfig[i].customUrl = _fileInfo.url;
                            this.data.active.atmosphereConfig[i].checkCustomUrl = true;
                            this.data.active.atmosphereConfig[i].type = 'custom';
                        }
                    }

                    this.setData({
                        active: this.data.active,
                    })
                }
            }
        },
        async check_atmp_tmp(e) {
            let id = e.currentTarget.dataset.id;
            let type = e.currentTarget.dataset.type;

            for (let i = 0; i < this.data.active.atmosphereConfig.length; i++) {
                const item = this.data.active.atmosphereConfig[i];
                if (item.id == id) {
                    this.data.active.atmosphereConfig[i].check = true;
                    this.data.active.atmosphereConfig[i].checkCustomUrl = type === 'default' ? false : true;
                    this.data.active.atmosphereConfig[i].type = type;
                }
            }
            this.setData({
                active: this.data.active
            })

        },
        // 上传图片
        async uploadImage(e) {
            let pType = e.currentTarget.dataset.pType;
            let configType = e.currentTarget.dataset.configType

            // 打开文件对话框并选择文件
            let _tmpFile = await my.chooseImage({
                count: 1, // 返回的文件数，默认 1
                type: 0x01, // 图片=0x01，文档=0x02，多媒体=0x04，自由组合，默认 0x01
            });
            console.log('this.data.activePid ', this.data.activePid)
            if (_tmpFile.success == true) {
                console.log('-----选择图片-----', _tmpFile)
                // 检测图片大小
                let _imageInfo = await my.getImageInfo({
                    src: _tmpFile.apFilePaths[0],
                })
                console.log('-----检测图片大小-----', _imageInfo)
                if (this.data.activePid == 1 && _imageInfo.width != 420 && _imageInfo.height != 420) {
                    my.showToast({
                        type: "fail",
                        content: '请上传420x420大小的png,jpg图片~'
                    })
                    return false;
                }
                if (this.data.activePid == 2 && configType === 'integral' && _imageInfo.width != 250 && _imageInfo.height != 250) {
                    my.showToast({
                        type: "fail",
                        content: '请上传250x250大小的png,jpg图片~'
                    })
                    return false;
                }

                this.data.customInfo.state = true;
                this.setData({
                    customInfo: this.data.customInfo
                })

                let _fileName = moment().format('YYYYMMDDhhmmss').valueOf() + '.png';
                let _fileInfo = await cloud.file.uploadFile({
                    filePath: _tmpFile.apFilePaths[0],
                    fileType: 'image',
                    fileName: '/tmp/' + _fileName,
                    seller: false,
                })
                if (_fileInfo) {
                    this.data.customInfo.state = false;
                    this.setData({
                        customInfo: this.data.customInfo
                    })
                }
                // 分型图片配置
                if (!pType && this.data.activePid == 1 && _fileInfo.url) {
                    if (this.data.active.basisConfig.shareConfig == undefined) {
                        this.data.active.basisConfig.shareConfig = {
                            shareTitle: 'iQOO合成大作战',
                            shareURL: shareUrl + 'config/skin/tmp_3.png',
                            shareDesc: '冲榜单, 赢618手机免单',
                        }
                    }
                    this.data.active.basisConfig.shareConfig['shareURL'] = _fileInfo.url;
                    this.setData({
                        active: this.data.active,
                    })
                }

                // 自定义增加商品
                if (!pType && (this.data.configType == 'integral') && _fileInfo.url) {
                    this.data.customInfo.pic_url = _fileInfo.url
                    this.setData({
                        customInfo: this.data.customInfo
                    })
                }

                // 单独修改商品图片 第二步修改图片
                if (pType && configType === 'integral' && _fileInfo.url) {
                    this.data.active.integralRewardConfig.rewardList[pType - 1].pic_url = _fileInfo.url
                }
                this.setData({
                    active: this.data.active
                })
            }
        },
        // 修改分享信息
        async updateShareInfo(e) {
            let type = e.currentTarget.dataset.type;
            let value = e.detail.value;
            const chinese = /[^\u4E00-\u9FA5]/g;
            if (type == 'title') {
                this.data.active.basisConfig.shareConfig.shareTitle = value;
            }
            if (type == 'desc') {
                this.data.active.basisConfig.shareConfig.shareDesc = value;
            }
            if (type == 'ship_title') {
                this.data.customInfo.title = value
            }
            if (type == 'ship_num') {
                if (chinese.test(value) === false) {
                    my.showToast({
                        type: 'fail',
                        content: '商品库存不可为文字'
                    })
                    return false;
                }
                this.data.customInfo.num = value
            }
            if (type == 'ship_price') {
                if (chinese.test(value) === false) {
                    my.showToast({
                        type: 'fail',
                        content: '商品库存不可为文字'
                    })
                    return false;
                }
                this.data.customInfo.price = value
            }

            this.setData({
                active: this.data.active,
                customInfo: this.data.customInfo
            })

        },

        // 自定义商品按钮
        async customBtn() {
            let rewardType = this.data.rewardType;
            if (this.data.configType === 'integral') {
                if (this.data.customInfo.title == '') {
                    my.showToast({
                        type: "fail",
                        content: "请填写商品标题~"
                    })
                    return false;
                }
                if (this.data.customInfo.price <= 0) {
                    my.showToast({
                        type: "fail",
                        content: "请填写商品价格~"
                    })
                    return false;
                }

                let _lastRankNums = this.data.active.integralRewardConfig.rewardList.slice(-1)[0].rankNums;

                if (this.data.active.integralRewardConfig.rewardList[this.data.rewardType - 1]) {
                    _lastRankNums = this.data.active.integralRewardConfig.rewardList[this.data.rewardType - 1].rankNums
                }

                this.data.active.integralRewardConfig.rewardList[rewardType - 1] = {
                    name: 'goods',
                    type: rewardType,
                    approve_status: false,
                    num: this.data.customInfo.num,
                    num_iid: '1',
                    pic_url: this.data.customInfo.pic_url,
                    price: this.data.customInfo.price,
                    seller_cids: 'custom',
                    title: this.data.customInfo.title,
                    integral: 0,
                    exchangeConfig: {
                        state: true,
                        nums: 1
                    },
                }

                this.setData({
                    active: this.data.active
                })
            }
            this.close('customizeFrame')
        },
        // 配置C端界面风格
        async checkAtmo(e) {
            let info = e.currentTarget.dataset.info;
            let _index = this.data.atmoConfig.findIndex(v => v.id == info.id);
            info = this.data.atmoConfig[_index];

            for (let i = 0; i < this.data.active.atmosphereConfig.length; i++) {
                const item = this.data.active.atmosphereConfig[i];
                if (item.id == info.id) {
                    this.data.active.atmosphereConfig[i].check = true;
                } else {
                    this.data.active.atmosphereConfig[i].check = false;
                }
            }

            this.setData({
                active: this.data.active
            })
        },
        // 打开积分配置
        async openIntegralRewardBox(e) {
            let opType = e.currentTarget.dataset.opType;

            if (opType === 'open') {
                this.setData({
                    cover: 'cover',
                    integralBox: 'integralBox',
                })
            }
            if (opType === 'close') {
                this.setData({
                    cover: 'cover_none',
                    integralBox: 'cover_none',
                })
            }
            if (opType === 'success') {
                for (let i = 0; i < this.data.active.integralRewardConfig.rewardList.length; i++) {
                    const item = this.data.active.integralRewardConfig.rewardList[i];
                    if (item.title === undefined) {
                        my.showToast({
                            type: 'fail',
                            content: '请先完成奖品的添加~'
                        })
                        return false;
                    }
                }
                for (let i = 0; i < this.data.active.integralRewardConfig.rewardList.length; i++) {
                    const item = this.data.active.integralRewardConfig.rewardList[i];
                    if (item.integral <= 0) {
                        my.showToast({
                            type: 'fail',
                            content: '兑换积分不可小于0~'
                        })
                        return false;
                    }
                }

                this.setData({
                    cover: 'cover_none',
                    integralBox: 'cover_none',
                })
            }
        },
        // 打开合成配置
        async openMergeRewardBox(e) {
            let opType = e.currentTarget.dataset.opType;

            if (opType === 'open') {
                this.setData({
                    cover: 'cover',
                    mergeBox: 'mergeBox',
                })
            }
            if (opType === 'close') {
                this.setData({
                    cover: 'cover_none',
                    mergeBox: 'cover_none',
                })
            }
            if (opType === 'success') {
                this.setData({
                    cover: 'cover_none',
                    mergeBox: 'cover_none',
                })
            }
        },
        // 打开弹窗配置
        async openBouncedBox(e) {
            let opType = e.currentTarget.dataset.opType;
            if (opType === 'open') {
                this.setData({
                    cover: 'cover',
                    bouncedBox: 'bouncedBox',
                })
            }
            if (opType === 'close') {
                this.setData({
                    cover: 'cover_none',
                    bouncedBox: 'cover_none',
                })
            }
            if (opType === 'success') {
                if (!this.data.active.bouncedConfig.luckyBag.title) {
                    my.showToast({
                        type: 'fail',
                        content: '请先完成红包配置~'
                    })
                    return false;
                }
                this.setData({
                    cover: 'cover_none',
                    bouncedBox: 'cover_none',
                })
            }
        },
        // 获取任务配置
        async getMissionConfig() {
            let _missionConfig = await cloud.function.invoke(cloudFunction, {
                data: {}
            }, "B_MSG_4013");
            _missionConfig = JSON.parse(_missionConfig);
            if (this.data.active.missionConfig == undefined) {
                this.data.active.missionConfig = [];
            }
            if (this.data.active.missionConfig.length <= 0) {
                _missionConfig.data = _missionConfig.data.sort((a, b) => {
                    return a.bSortId > b.bSortId ? 1 : -1
                })

                let _tmpDaily = [];
                for (let i = 0; i < _missionConfig.data.length; i++) {
                    const item = _missionConfig.data[i];
                    _tmpDaily.push({
                        id: item.id,
                        bTitle: item.bTitle,
                        limit: item.limit,
                        need: item.need,
                        time: item.time,
                        rewardCount_1: item.rewardCount_1,
                        rewardCount_2: item.rewardCount_2,
                        rewardType: item.rewardType,
                        mType: item.mType,
                    })
                }
                this.data.activeTypeList.daily.config.missionConfig = JSON.parse(JSON.stringify(_tmpDaily));
            }

            this.setData({
                activeTypeList: this.data.activeTypeList,
                active: this.data.active,

            })
        },
        // 修改任务配置
        async editMissionConfig(e) {
            let item = e.currentTarget.dataset.item;
            let id = item.id;
            let type = e.currentTarget.dataset.type;
            let value = e.detail.value;

            console.log('item', item)
            console.log('id', id)
            console.log('type', type)
            console.log('value', value)
            console.log('this.data.activeTypeList.daily.config.missionConfig', this.data.activeTypeList.daily.config.missionConfig)

            for (let i = 0; i < this.data.activeTypeList.daily.config.missionConfig.length; i++) {
                const _item = this.data.activeTypeList.daily.config.missionConfig[i];
                if (_item.id === id) {
                    this.data.activeTypeList.daily.config.missionConfig[i][type] = value != '' ? parseInt(value) : '';
                }
            }
            console.log('this.data.activeTypeList.daily.config.missionConfig', this.data.activeTypeList.daily.config.missionConfig)
            this.setData({
                activeTypeList: this.data.activeTypeList
            })
        },
        // 排行榜的增加删除
        async rankRewardAction(e) {
            let type = e.currentTarget.dataset.type;
            if (type === 'add') {
                this.data.active.integralRewardConfig.rewardList.push({})
                this.setData({
                    active: this.data.active,
                })
            }
            if (type === 'del') {
                let index = e.currentTarget.dataset.index;
                this.data.active.integralRewardConfig.rewardList.splice(index, 1);
                this.setData({
                    active: this.data.active
                })
            }
            console.log(type, this.data.active)
        },
        // 合并的增加删除
        async mergeRewardAction(e) {
            let type = e.currentTarget.dataset.type;
            if (type === 'add') {
                this.data.active.mergeRewardConfig.push({})
                this.setData({
                    active: this.data.active,
                })
            }
            if (type === 'del') {
                let index = e.currentTarget.dataset.index;
                this.data.active.mergeRewardConfig.splice(index, 1);
                this.setData({
                    active: this.data.active
                })
            }
            console.log(type, this.data.active)
        },
        updateDesc(e) {
            let value = e.detail.value;
            value = value.replace('↵', '\n');
            this.data.active.rule = value;
            if (value.length > 1000) {
                my.showToast({
                    type: 'fail',
                    content: '字数限制在1000以内'
                })
                return false;
            }
            this.setData({
                active: this.data.active
            })

        },

        checkActiveTime(e) {
            let type = e.currentTarget.dataset.type;
            let value = moment(e.detail.value).valueOf();
            if (type === 'eTime') {

                if (value < moment().add(3, 'hours').valueOf()) {
                    my.showToast({
                        type: 'fail',
                        content: '活动时间至少大于3小时'
                    });
                }
            }

            if (value > moment(this.data.deadline).valueOf()) {
                my.showToast({
                    type: 'fail',
                    content: '活动时间不能大于产品到期时间，请续订小程序'
                });
            }
            this.data.active[type] = e.detail.value;

            this.setData({
                active: this.data.active
            })
        },

        checkCouponUrl(e) {
            let configType = e.currentTarget.dataset.configType;
            let rewardType = e.currentTarget.dataset.rewardType;
            let url = e.detail.value;

            let couponId = url.split('id=')[1];
            console.log('configType', configType)
            console.log('rewardType', rewardType)
            if (configType === 'integral') {
                console.log('this.data.active.integralRewardConfig.rewardList[rewardType - 1]', this.data.active.integralRewardConfig.rewardList[rewardType - 1])
                if (this.data.active.integralRewardConfig.rewardList[rewardType - 1].name === 'coupon') {
                    this.data.active.integralRewardConfig.rewardList[rewardType - 1].linkId = parseInt(couponId)
                }
            }
            if (configType === 'merge') {
                console.log('this.data.active.mergeRewardConfig[rewardType - 1]', this.data.active.mergeRewardConfig[rewardType - 1])
                if (this.data.active.mergeRewardConfig[rewardType - 1].name === 'coupon') {
                    this.data.active.mergeRewardConfig[rewardType - 1].linkId = parseInt(couponId)
                }
            }

            this.setData({
                active: this.data.active
            })

        },
        //  跳转新的网页地址
        jumpNewUrl(e) {
            let configType = e.currentTarget.dataset.configType;
            let rewardType = e.currentTarget.dataset.rewardType;

            if (configType == 'integral') {
                if (this.data.active.integralRewardConfig.rewardList[rewardType - 1].name === 'coupon') {
                    let linkId = this.data.active.integralRewardConfig.rewardList[rewardType - 1].linkId;
                    my.qn.navigateToWebPage({
                        url: tbWebUrl + linkId,
                        success: res => {},
                        fail: res => {}
                    });
                }
            }
            if (configType == 'merge') {
                if (this.data.active.mergeRewardConfig[rewardType - 1].name === 'coupon') {
                    let linkId = this.data.active.mergeRewardConfig[rewardType - 1].linkId;
                    my.qn.navigateToWebPage({
                        url: tbWebUrl + linkId,
                        success: res => {},
                        fail: res => {}
                    });
                }
            }
        },
        checkShipName(e) {
            let id = e.currentTarget.dataset.id;
            let value = e.detail.value;

            let _index = this.data.active.atmosphereConfig.findIndex(v => v.id == id);
            this.data.active.atmosphereConfig[_index].shipName = value;

            this.setData({
                active: this.data.active
            })
        },
        // 奖励兑换配置
        checkResetConfig(e) {
            let value = e.detail.value;
            let type = e.currentTarget.dataset.type;
            if (type === 'check') {
                this.data.active.integralRewardConfig.resetConfig.state = value;
            }
            if (type === 'disabled') {
                this.data.active.integralRewardConfig.resetConfig.state = !value;
            }
            if (type === 'time') {
                this.data.active.integralRewardConfig.resetConfig.time = value;
            }

            this.setData({
                active: this.data.active
            })
        },
        //修改兑换次数状态
        checkExchangeState(e) {
            let value = e.detail.value;
            let type = e.currentTarget.dataset.type;
            let index = e.currentTarget.dataset.index;

            if (!this.data.active.integralRewardConfig.rewardList[index].name) {
                my.showToast({
                    type: 'fail',
                    content: '请先添加商品信息~'
                })
                return;
            }
            if (type === 'check') {
                this.data.active.integralRewardConfig.rewardList[index].exchangeConfig.state = value;

            }
            if (type === 'disabled') {
                this.data.active.integralRewardConfig.rewardList[index].exchangeConfig.state = !value;

            }
            this.setData({
                active: this.data.active
            })
        },

        // 修改商品积分
        checkIntegral(e) {
            let index = e.currentTarget.dataset.index;
            let value = e.detail.value;

            this.data.active.integralRewardConfig.rewardList[index].integral = value;
            this.setData({
                active: this.data.active
            })
        },
        // 修改商品库存
        checkNum(e) {
            let rewardType = e.currentTarget.dataset.rewardType;
            let index = e.currentTarget.dataset.index;
            let value = e.detail.value;

            switch (rewardType) {
                case 'integral':
                    this.data.active.integralRewardConfig.rewardList[index].num = value;
                    break;

                case 'merge':
                    this.data.active.mergeRewardConfig[index].num = value;
                    break;
            }

            this.setData({
                active: this.data.active
            })
        },
        // 修改商品兑换次数
        checkShipExchangeNums(e) {
            let index = e.currentTarget.dataset.index;
            let value = e.detail.value;

            this.data.active.integralRewardConfig.rewardList[index].exchangeConfig.nums = value;
            this.setData({
                active: this.data.active
            })
        },
        tf_btnEvent(e) {
            let type = e.currentTarget.dataset.type;
            let imageUrl = this.data.imageUrl + e.currentTarget.dataset.img;
            let imgTmp = e.currentTarget.dataset.img;
            this.setData({
                cover: 'cover',
                tf_img_frame: 'tf_img_frame',
                tf_img_url: imageUrl,
                jumpType: type,
                imgTmp: imgTmp
            })
        },
        lookImage() {
            my.previewImage({
                enablesavephoto: true,
                enableShowPhotoDownload: true,
                urls: [imageUrl + 'config/guize.png'],
            });
        },
        async gameUploadImage(e) {

            let type = e.currentTarget.dataset.type;
            let state = e.currentTarget.dataset.state;

            // 打开文件对话框并选择文件
            let _tmpFile = await my.chooseImage({
                count: 1, // 返回的文件数，默认 1
                type: 0x01, // 图片=0x01，文档=0x02，多媒体=0x04，自由组合，默认 0x01
            });
            if (_tmpFile.success == true) {
                // 检测图片大小
                let _imageInfo = await my.getImageInfo({
                    src: _tmpFile.apFilePaths[0],
                })

                let _fileName = moment().format('YYYYMMDDhhmmss').valueOf() + '.png';
                let _fileInfo = await cloud.file.uploadFile({
                    filePath: _tmpFile.apFilePaths[0],
                    fileType: 'image',
                    fileName: '/tmp/' + _fileName,
                    seller: false,
                })

                if (this.data.activePid == 2 && _imageInfo.width !== 658 && _imageInfo.height !== 900) {
                    my.showToast({
                        type: "fail",
                        content: '请上传658x900大小的png,jpg图片~'
                    })
                    return false;
                }

                // 物品图片上传
                if (this.data.activePid == 2 && _fileInfo.url) {
                    this.data.active.bouncedConfig[type][state] = _fileInfo.url
                    this.setData({
                        active: this.data.active,
                    })
                }
            }
        },

    },


);
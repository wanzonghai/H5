//玩家相关数据字段
export interface PlayData {
    version: string;
    coin: number;           //金币
    level: number;          //等级
    energy: number;         //体力
    diamond: number;        //钻石
    point: number;          //奖杯
    integral: number;      //积分
    energyCache: number;
    energyTime: number;
    ranklist: {
        name: string,
        score: number,
        avatar: string,
    }[];
    rankDay: string;        //排行日期
    name: string;           //玩家姓名
    avatar: string;         //玩家头像列表
    userOpenId: string;    //玩家openID
    openId: string;        //商铺ID

    heroOldCoin: number;           //刷新前的金币数
    isFirstEnter: number;          //是否第一次进入 1：是 0:不是
    isReceivedEight: number;       //是否已领取888888奖励 1：是 0:不是
    isReceivedSix: number;         //是否已领取6666668奖励 1：是 0:不是
    shareTime: number;             //分享切后台的时间
    startGameTime: number;         //游戏开始的时间
    openGameTime: number;          //打开游戏的时间
    receiveCount: number;          //今天已领取的看广告奖励次数
    lastReceiveTime: number;       //上一次看广告领取奖励的时间
    allPlayCount: number;          //总局数
    isShowNotice: boolean;         //是否显示公告页面
    openSignTime: number;          //上一次主动弹出签到的时间
    signedTimesArray: number[];    //已签到的时间数组          
    tryRoleID: number;             //试用角色类型         
    myRoleIDArray: number[];       //已拥有的角色类型    
    curRoleID: number;             //当前选中的角色类型     
    lianshengCount: number;        //连胜次数    
    isPlayFirstAni: number;        //是否吃鸡     1：是 0:不是
    heroFirstCount: number;        //吃鸡次数

    gameMode: number;               //
    musicState: number;            //音乐状态 //打开-0，关闭-1
    effectState: number;           //音效状态 //打开-0，关闭-1

    musicCtrl: number;            //音乐开关 // 0-关闭  打开-1

    isMember: boolean;             //是否加入会员
    isVip: number;                 //是否为vip
    vipMarkUp: number;             //vip获得的金币加成（百分比）
    curSeason: number;             //当前赛季
    bestPoint: number;             //最好成绩
    bestRank: number;              //最高名次
    bestSeason: number;            //最高名次的赛季
    bestWin: number;               //最高连胜
    allWin: number;                //总的获胜次数

    rewardTimes_free: number,          //领免费券已领奖次数
    rewardTimes_challenge: number,     //领免费券已领奖次数
    rewardTimes_share: number,         //邀请好友已领奖次数
    rewardTimes_live: number,          //访问直播间已领奖次数
    rewardTimes_lookGoods: number,     //浏览商品已领奖次数
    rewardTimes_member: number,        //超级会员已领奖次数
    rewardTimes_favor: number,         //关注店铺已领奖次数
    rewardTimes_kgold: number,         //氪金玩家已领奖次数
    rewardTimes_invitation: number,    //呼朋唤友已领奖次数
    rewardTimes_buy: number,           //我要买买买已购买合集
    rewardTimes_memberFree: number,    //会员领免费券已领奖次数
    rewardTimes_collectGoods: number,  //收藏商品已领奖次数
    rewardTimes_dayReward: number,     //每日礼包已领奖次数

    buyTime: number,        //下单时间戳
    buyLuckyTime: number,   //福袋下单时间戳
    browseTime: number,     //浏览时间戳

    //任务相关
    taskDay: string;
    //dailyFree: number;      //每日免费
    challenge: number;      //匹配挑战
    share: number;         //分享
    live: number;           //直播
    browse: number;         //浏览商品
    shop: number;           //关注店铺
    order: number           //店内消费
    invite: number;         //邀请
    buy: number             //购买指定商品
    //memberDailyFree: number;      //每日免费
    freeCache: number;
    freeTime: number;
    memberFreeCache: number;
    memberFreeTime: number;
    openGiftCache: number;
    openGiftTime: number;

    taskState: number[];    //任务状态 0-可领取 1-未完成 2-已领取

    isVipControl: boolean;  // 是否开启礼包vip控制
    isVipSystem: boolean;   // 是否有vip体系 

    isNewReward: boolean;   //奖品包是否有新奖励
    collectIdArr: number[];   //已收藏的商品ID
    giftTargetCount: number;     //开礼包目标局数
    giftCurCount: number;        //开礼包当前局数
}

//玩家相关默认数据
export const defaultPlayData: PlayData = {
    version: "1.0.0",
    coin: 0,
    level: 1,
    energy: 20,
    diamond: 0,
    point: 3,
    integral: 0,
    energyCache: 0,
    energyTime: 0,
    ranklist: [],
    rankDay: '2020-11-23',
    name: '玩家8573',
    avatar: 'hallRes/common/tx_player.png',
    userOpenId: "", //玩家ID
    openId: "",     //商铺ID

    heroOldCoin: 0,
    isFirstEnter: 1,
    isReceivedEight: 0,
    isReceivedSix: 0,
    shareTime: 0,
    startGameTime: 0,
    openGameTime: 0,
    receiveCount: 0,
    lastReceiveTime: 0,
    allPlayCount: 0,
    isShowNotice: true,
    openSignTime: 0,
    signedTimesArray: [],
    tryRoleID: 0,
    myRoleIDArray: [0],
    curRoleID: 0,
    lianshengCount: 0,
    isPlayFirstAni: 0,
    heroFirstCount: 0,
    gameMode: 0,

    musicState: 0,
    effectState: 0,
    musicCtrl: 1,

    isMember: false,
    isVip: 0,
    vipMarkUp: 20,
    curSeason: 1,
    bestPoint: 0,
    bestRank: 0,
    bestSeason: 1,
    bestWin: 0,
    allWin: 0,

    rewardTimes_free: 0,
    rewardTimes_challenge: 0,
    rewardTimes_share: 0,
    rewardTimes_live: 0,
    rewardTimes_lookGoods: 0,
    rewardTimes_member: 0,
    rewardTimes_favor: 0,
    rewardTimes_kgold: 0,
    rewardTimes_invitation: 0,
    rewardTimes_buy: 0,
    rewardTimes_memberFree: 0,
    rewardTimes_collectGoods: 0,
    rewardTimes_dayReward: 0,
    buyTime: 0,
    buyLuckyTime: 0,
    browseTime: 0,

    taskDay: '',
    //dailyFree: 0, 
    challenge: 0,      //有用
    share: 0,       //有用
    live: 0,
    browse: 0,
    shop: 0,
    order: 0,       //有用
    invite: 0,      //有用
    buy: 0,
    //memberDailyFree : 0,
    freeCache: 0,
    freeTime: 0,
    memberFreeCache: 0,
    memberFreeTime: 0,
    openGiftCache: 0,
    openGiftTime: 0,
    taskState: [],

    isVipControl: false,
    isVipSystem: false,
    isNewReward: false,

    collectIdArr: [],   //已收藏的商品ID
    giftTargetCount: 2,     //开礼包目标局数
    giftCurCount: 0,        //开礼包当前局数
}
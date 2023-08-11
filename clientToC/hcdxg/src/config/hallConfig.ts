export default class hallConfig {
    public EventEnum = {
        Res_Load_Progress: "Res_Load_Progress",
        Res_Load_Complete: "Res_Load_Complete",
        TASK_CHANGE: "TASK_CHANGE",    //任务数据发生变化
        VIP_STATE_CHANGE: "TASK_CHANGE",    //vip状态发生变化

    }

    public GAME_MOVE = {
        BOMB: 0,           //炸弹模式
        RED_ENVELOPES: 1,  //礼包模式
        RED_BOMB: 2,       //礼包+炸弹模式
    }

    public TASK_CONFIG_ENUM = {
        cuhuo: 0,           //促活
        laxin: 1,           //拉新
        zhuanhua: 2,        //礼包转化
    }

    public SHARE_TYPE_ENUM = {
        shareFriend: 0,           //邀请好友
        rank: 1,                  //开奖分享
        notice: 2,                //邀请得年年牛
    }

    public CUR_SCENE = {
        loading: 0,                //加载界面
        hall: 1,                   //主界面
        game: 2,                   //游戏界面
    }

    public UIEnum = {
        SetUI: {
            id: 0,
            class: "common/setLayer.ts",
        },
        SignUI: {
            id: 1,
            class: "common/signLayer.ts",
        },

        GameScene3d: {
            id: 2,
            class: "game/gameScene3d.ts",
        },
    }

    //版本号
    _version: string = "0.0.95";
    //cdn
    _commonCdn: string = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/normal/C_client/" + 'v16/';
    _cdn: string = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/normal/C_client/" + 'v16/';

    //从第几局开始开礼包
    _openGiftCount = 2;

    //资源配置
    public Jsons = {
        aiNameConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/aiNameConfig.json" : this._commonCdn + "res/jsons/aiNameConfig.json",
        baseConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/baseConfig.json" : this._commonCdn + "res/jsons/baseConfig.json",
        // enemyConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/enemyConfig.json" : this._commonCdn + "res/jsons/enemyConfig.json",
        // levelConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/levelConfig.json" : this._commonCdn + "res/jsons/levelConfig.json",
        // signConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/signConfig.json" : this._commonCdn + "res/jsons/signConfig.json",
        awardConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/awardConfig.json" : this._commonCdn + "res/jsons/awardConfig.json",
        rankConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/rankConfig.json" : this._commonCdn + "res/jsons/rankConfig.json",
        taskConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/taskConfig.json" : this._commonCdn + "res/jsons/taskConfig.json",
        gameConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/gameConfig.json" : this._commonCdn + "res/jsons/gameConfig.json",
        // avatarConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/avatarConfig.json" : this._commonCdn + "res/jsons/avatarConfig.json",
    }

    public Prefabs = {
        // role: "prefab/game/role.json",
        // ground0: "prefab/game/ground0.json",
        // ground1: "prefab/game/ground1.json",
        // ground2: "prefab/game/ground2.json",
        // ground3: "prefab/game/ground3.json",
        // ground4: "prefab/game/ground4.json",
        // matchLayer: "prefab/game/matchLayer.json",
        // guideImgLayer: "prefab/game/guideImgLayer.json",
        // resultLayer: "prefab/game/resultLayer.json",
        // bombTipsImg: "prefab/game/bombTipsImg.json",
        // redBagTipsImg: "prefab/game/redBagTipsImg.json",
        // speedProp: "prefab/game/speedProp.json",
        // emojiLayer: "prefab/game/emojiLayer.json",
        // broadcastTips: "prefab/game/broadcastTips.json",
        // dialog: "prefab/game/dialog.json",
        // getAwardLayer: "prefab/game/getAwardLayer.json",
        // vipDialog: "prefab/game/vipDialog.json",
    }

    public FGui = {
        main: "res/UI/Main.txt",
        rank: "res/UI/Rank.txt",
        shop: "res/UI/Shop.txt",
        task: "res/UI/Task.txt",
        common: "res/UI/Common.txt",
        getReward: "res/UI/GetReward.txt",
        invite: "res/UI/Invite.txt",
        userInfo: "res/UI/UserInfo.txt",
        Loading: "res/UI/Loading.txt",
        TaskBrowse: "res/UI/TaskBrowse.txt",
        Rule: "res/UI/Rule.txt",
        Bag: "res/UI/Bag.txt",
        TryRole: "res/UI/TryRole.txt",
        Notice: "res/UI/Notice.txt",
        OpenGift: "res/UI/openGift.txt",
        Vip: "res/UI/Vip.txt",
        PrizePool: "res/UI/PrizePool.txt",

        mainPng: "res/UI/Main_atlas0.png",
        rankPng: "res/UI/Rank_atlas0.png",
        shopPng: "res/UI/Shop_atlas0.png",
        taskPng: "res/UI/Task_atlas0.png",
        commonPng: "res/UI/Common_atlas0.png",
        getRewardPng: "res/UI/GetReward_atlas0.png",
        invitePng: "res/UI/Invite_atlas0.png",
        userInfoPng: "res/UI/UserInfo_atlas0.png",
        LoadingPng: "res/UI/Loading_atlas0.png",
        TaskBrowsePng: "res/UI/TaskBrowse_atlas0.png",
        RulePng: "res/UI/Rule_atlas0.png",
        BagPng: "res/UI/Bag_atlas0.png",
        TryRolePng: "res/UI/TryRole_atlas0.png",
        NoticePng: "res/UI/Notice_atlas0.png",
        OpenGiftPng: "res/UI/openGift_atlas0.png",
        VipPng: "res/UI/Vip_atlas0.png",
        PrizePoolPng: "res/UI/PrizePool_atlas0.png",
    }

    // public Ection = {
    //     ection_1: "roleAni/ection_1.png",
    //     ection_2: "roleAni/ection_2.png",
    //     ection_3: "roleAni/ection_3.png",
    //     ection_4: "roleAni/ection_4.png",
    // }

    // public LocalImg = {
    //     roleAni: "res/atlas/roleAni.png",
    //     roleAni1: "res/atlas/roleAni1.png",
    //     roleAni2: "res/atlas/roleAni2.png",
    //     roleAni3: "res/atlas/roleAni3.png",
    //     roleAni4: "res/atlas/roleAni4.png",
    // }

    // public LocalAtlas = {
    //     roleAni: "res/atlas/roleAni.atlas",
    // }

    public Sound = {
        gameBg1: "sound/bg1.mp3",
        gameBg2: "sound/bg2.mp3",
        bad: "sound/bad.mp3",
        bomb: "sound/bomb.mp3",
        happy: "sound/happy.mp3",
        jump: "sound/jump.mp3",
        lose: "sound/lose.mp3",
        over: "sound/over.mp3",
        restTime: "sound/restTime.mp3",
        win: "sound/win.mp3",
        click: "sound/click.mp3",
        bg1: "sound/hallBg1.mp3",
        bg2: "sound/hallBg2.mp3",
    }

    // public SoundName = {
    //     gameBg1: "bg1",
    //     gameBg2: "bg2",
    //     bad: "bad",
    //     bomb: "bomb",
    //     happy: "happy",
    //     jump: "jump",
    //     lose: "lose",
    //     over: "over",
    //     restTime: "restTime",
    //     win: "win",
    //     click: "click",
    //     bg1: "hallBg1",
    //     bg2: "hallBg2",
    // }
}

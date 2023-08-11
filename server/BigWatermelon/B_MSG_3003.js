
var code = 0;
var message = "成功";
function bIsNull(a) {
    if(a !== null && a !== undefined) {
        return false;
    }
    return true;
}
function isRetError(ret){
    if(!ret == null || ret == undefined || ret < 0) {
        return true;
    }
    return false;
}

function PackReturn(code,message,data) {
    if(data == undefined){
        return JSON.stringify({code:code,message:message});
    }else{
        return JSON.stringify({code:code,message:message,data:data});
    }
}
function randomId(){
    var rnd="";
    var ranString = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var lenMax = ranString.length;
    var len = 20;
    for(var i = 0;i < len; i++){
        var ran = Math.floor(Math.random()*lenMax)
        rnd += ranString[ran];
    }
     return rnd;
}
//增加活动
module.exports = async (context) => {
    console.log("**3003**");
    try {
        const cloud = context.cloud;
        const data = context.data;
        // console.log("data: ",data);
        const openid = context.appOwnerOpenId;
        const userOpenId = context.openId;
        var bIsDebug = false;
        var debugAccessToken = null;
        const findDebug = await context.cloud.db.collection("debug").find({uuid:10001});
        console.log("findDebug: ",findDebug);
        if (findDebug.length > 0) //存在旧的
        {
            bIsDebug = findDebug[0].debug;
            debugAccessToken = findDebug[0].accessToken;
        }
        
        console.log(`1------------------->>>(${JSON.stringify(context)})`);
        //获取商家个人信息
        // const resposeData = await context.cloud.topApi.invoke({
        //     api: 'taobao.user.seller.get',
        //     data: {
        //         'fields': 'user_id,nick,vip_info',
        //         'session': debugAccessToken //测试时候填商家授权acccessToken
        //     },
        //     autoSession: !bIsDebug  //测试时候填false
        // });
        // console.log("resposeData: ",resposeData);
        //增加活动
        var time = new Date();
        var newData = new Object();
        newData.name = "users";
        newData.openid = openid;
        newData.state = true;
        //活动创建者
        newData.creatorId = userOpenId;
        //创建时间
        newData.createTime = time.getTime();
        //赛季 默认1
        newData.season = 1;
        //店家淘宝名
        // newData.userNick = "" || resposeData.user.nick;
        newData.userNick = "";
        //店铺商户拥有者id  作为关注店铺的shopId
        // newData.shopId = 0 || resposeData.user.user_id;
        //vivo指定shopId
        newData.shopId = 883737303;
        //店铺Id 兼容老活动数据
        if(data.data.hasOwnProperty("storeId")){
            newData.storeId = data.data.storeId;
        }else{
            //获取店铺信息
            // const retShopData = await context.cloud.topApi.invoke({
            //     api: "taobao.shop.seller.get",
            //     data: {
            //         "fields": 'sid,title,pic_path',
            //         'session': debugAccessToken //测试时候填商家授权acccessToken
            //     },
            //     autoSession: !bIsDebug  //测试时候填false
            // });
            // if(isRetError(retShopData)){

            // }else{
            //     newData.storeId = 0 || retShopData.shop.sid;
            // }
            //vivo定制 storeId
            newData.storeId = 71799145;
        }
        //会员信息
        // newData.vipInfo = 'c' || resposeData.user.vip_info;
        newData.vipInfo = 'c';
        //活动名
        newData.activeName = data.data.activeName;
        //店铺名称
        newData.shopName = data.data.shopName || "";
        //活动id
        var curID = randomId();
        newData.activeId = curID;
        newData.rankEndNums = 0;
        newData.gameConfig = {};
        //基础配置
        if(data.data.hasOwnProperty("basisConfig")){
            //是否开启礼包vip控制
            if(data.data.basisConfig.hasOwnProperty("isVipControl")){
                newData.isVipControl = data.data.basisConfig.isVipControl;
            }
            // 是否有vip体系
            if(data.data.basisConfig.hasOwnProperty("isVipSystem")){
                newData.isVipSystem = data.data.basisConfig.isVipSystem;
            }
            //活动类型
            newData.activeType = data.data.activeType;
            //比赛消耗金币
            if(data.data.basisConfig.hasOwnProperty("subCoin")){
                // newData.gameConfig.subCoin = data.data.basisConfig.subCoin;
                //vivo写死1
                newData.gameConfig.subCoin = 1;
            }
            // 浏览商品获得金币
            if(data.data.basisConfig.hasOwnProperty("lookGoodsCoin")){
                newData.gameConfig.lookGoodsCoin = data.data.basisConfig.lookGoodsCoin;
            }
            // 邀请好友获得金币
            if(data.data.basisConfig.hasOwnProperty("invite")){
                newData.gameConfig.inviteConfig = data.data.basisConfig.invite;
            }
            // 买买买 兑换系数
            if(data.data.basisConfig.hasOwnProperty("exchangeIndex")){
                newData.gameConfig.exchangeIndex = data.data.basisConfig.exchangeIndex;
            }
            // 促销表现
            if(data.data.basisConfig.hasOwnProperty("promotion")){
                newData.gameConfig.promotion = data.data.basisConfig.promotion;
            }
            //促销商品
            if(data.data.basisConfig.hasOwnProperty("promotionList")){
                newData.gameConfig.promotionList = data.data.basisConfig.promotionList;
            }
            //分享配置
            if(data.data.basisConfig.hasOwnProperty("shareConfig")){
                newData.gameConfig.shareConfig = data.data.basisConfig.shareConfig;
            }
        }
        //奖励配置
        if(data.data.hasOwnProperty("giftRewardConfig")){
            newData.gameConfig.redPacketList = data.data.giftRewardConfig;
        }
        //排行榜配置
        if(data.data.hasOwnProperty("rankRewardConfig")){
            newData.rankRewardConfig = data.data.rankRewardConfig;
        }
        //排行榜 自定义开奖时间 -> 刷新时间
        newData.rankCustomUpdateTime = 0;
        //氛围配置
        if(data.data.hasOwnProperty("atmosphereConfig")){
            newData.gameConfig.atmosphereConfig = data.data.atmosphereConfig;
        }
        //任务配置
        if(data.data.hasOwnProperty("missionConfig")){
            newData.gameConfig.missionConfig = data.data.missionConfig;
        }
        //规则配置
        if(data.data.hasOwnProperty("rule")){
            newData.gameConfig.rule = data.data.rule;
        }
        //活动创建时间
        if(data.data.hasOwnProperty("sTime")){
            newData.sTime = data.data.sTime;
        }
        //活动结束时间
        if(data.data.hasOwnProperty("eTime")){
            newData.eTime = data.data.eTime;
        }
        //大西瓜奖励配置
        var newStock = new Object();
        if(data.data.hasOwnProperty("integralRewardConfig")){
            newData.integralRewardConfig = data.data.integralRewardConfig;
            //提取库存信息 保留下来  用于定时刷新库存
            newStock.openId = userOpenId;
            newStock.activeId = curID;
            newStock.createTime = newData.createTime;
            newStock.updateTime = newData.createTime;
            newStock.resetConfig = newData.integralRewardConfig.resetConfig;
            newStock.exchangeConfig = [];
            newStock.stockConfig = [];
            if(newData.integralRewardConfig.hasOwnProperty("rewardList")){
                newData.integralRewardConfig.rewardList.forEach(element => {
                    newStock.stockConfig.push({
                        type: element.type,
                        total: element.num,
                        nums: element.num
                    });
                    newStock.exchangeConfig.push({
                        type: element.type,
                        state: element.exchangeConfig.state,
                        nums: element.exchangeConfig.nums,
                    });
                });
            }
        }
        //大西瓜 合成配置
        if(data.data.hasOwnProperty("mergeRewardConfig")){
            newData.mergeRewardConfig = data.data.mergeRewardConfig;
            newStock.mergeConfig = [];
            newData.mergeRewardConfig.forEach(element =>{
                newStock.mergeConfig.push({
                    type: element.type,
                    total: element.num,
                    nums: element.num
                });
            });
        }
        await cloud.db.collection("stock").insertOne(newStock);

        //游戏弹窗配置
        if(data.data.hasOwnProperty("bouncedConfig")){
            newData.bouncedConfig = data.data.bouncedConfig;
        }

        //插入活动数据
        const ret = await cloud.db.collection("users").insertOne(newData);
        if(isRetError(ret)){
            return PackReturn(-2,"增加失败");
        }
        //增加一条 活动记录数据
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        month = month > 10 ? month : "0" + month;
        var day = time.getDate();
        day = day > 10 ? day : "0" + day;
        var e_time = "" + year + "-" + month + "-" + day + " " + "23:59:59"; 
        //0点 开始 
        var sTime = time.getTime();
        //24点 结束
        var eTime = new Date(e_time).getTime();
        var record = new Object();
        record.name = "record";
        record.activeId = curID;
        record.activeName = data.data.activeName;
        record.openid = openid;
        record.consumeNums = 0;
        record.consumeTotal = 0;
        record.attentionNums = 0;
        record.register = 0;
        record.fans = 0;
        record.vipNums = 0;
        record.joinNums = 0;
        record.joinTime = 0;
        record.redBagNums = 0;
        record.grabPlayerNums = 0;
        record.taskDoneNums = 0;
        record.taskDonePlayers = 0;
        record.rankOpenNums = 0;
        record.rankPlayerNums = 0;
        record.rankRewardNums = 0;
        record.shareNums = 0;
        record.sharePlayers = 0;
        record.shareEnterNums = 0;
        record.shareRegisterNums = 0;
        //2-1 行为操作埋点
        record.enterGameNums = 0;
        record.enterGamePlayers = 0;
        record.loadingNums = 0;
        record.loadingPlayers = 0;
        record.enterHallNums = 0;
        record.enterHallPlayers = 0;
        //任务 统计埋点
        record.task_0 = 0;
        record.task_2 = 0;
        record.task_3 = 0;
        record.task_5 = 0;
        record.task_6 = 0;
        record.task_7 = 0;
        record.task_8 = 0;
        record.task_9 = 0;
        record.task_10 = 0;
        record.task_11 = 0;
    
        record.sTime = sTime;
        record.eTime = eTime;
        await cloud.db.collection("activityRecord").insertOne(record);
        //增加 机器人 是否已经有机器人判定
        var shopData = await cloud.db.collection("shop").find({
            //openid: openid,
            activeId: curID
        });
        if(isRetError(shopData) || shopData.length <= 0){
            var shop = new Object();
            shop.openid = userOpenId;
            shop.activeId = curID;
            shop.robot = true;
            await cloud.db.collection("shop").insertOne(shop);
        }else{
        }
        return PackReturn(code,message,{activeId: curID});
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
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
//更新活动
module.exports = async (context) => {
    console.log("**3004**");
    try {
        const cloud = context.cloud;
        const data = context.data;
        const openid = context.appOwnerOpenId;
        var findUserData = await cloud.db.collection("users").find({
            //openid: openid,
            activeId: data.data.activeId,
        });
        if(isRetError(findUserData)){
            return PackReturn(-2,"获取数据失败");
        }
        var userParm = findUserData[0];
        //更新活动
        var newData = new Object();
        newData.gameConfig = {};
        //店铺名称
        if(data.data.hasOwnProperty("shopName")){
            newData.shopName = data.data.shopName;
        }
        //活动名称
        if(data.data.hasOwnProperty("activeName")){
            newData.activeName = data.data.activeName;
            newData.gameConfig.activeName = data.data.activeName;
        }
        //活动状态
        if(data.data.hasOwnProperty("state")){
            newData.state = data.data.state;
        }
        //活动类型
        if(data.data.hasOwnProperty("activeType")){
            newData.activeType = data.data.activeType;
        }
        //基础配置
        if(data.data.hasOwnProperty("basisConfig")){
            //是否开启礼包vip控制
            if(data.data.basisConfig.hasOwnProperty("isVipControl")){
                newData.isVipControl = data.data.basisConfig.isVipControl;
            }
            //是否有vip体系
            if(data.data.basisConfig.hasOwnProperty("isVipSystem")){
                newData.isVipSystem = data.data.basisConfig.isVipSystem;
            }
            //比赛金币消耗
            if(data.data.basisConfig.hasOwnProperty("subCoin")){
                // newData.gameConfig.subCoin = data.data.basisConfig.subCoin;
                newData.gameConfig.subCoin = 1;
            }
            //exchangeIndex
            //买买买 兑换系数
            if(data.data.basisConfig.hasOwnProperty("exchangeIndex")){
                newData.gameConfig.exchangeIndex = data.data.basisConfig.exchangeIndex;
            }
            //浏览商品获得金币
            if(data.data.basisConfig.hasOwnProperty("lookGoodsCoin")){
                newData.gameConfig.lookGoodsCoin = data.data.basisConfig.lookGoodsCoin;
            }
            //邀请好友获得金币
            if(data.data.basisConfig.hasOwnProperty("invite")){
                newData.gameConfig.inviteConfig = data.data.basisConfig.invite;
            }
            //促销表现
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
            //兼容 开奖次数限制
            newData.gameConfig.redPacketList = data.data.giftRewardConfig;
            if(userParm.gameConfig.redPacketList){
                for(var i = 0; i < userParm.gameConfig.redPacketList.length; i++){
                    if(userParm.gameConfig.redPacketList[i].hasOwnProperty("openNums")){
                        if(userParm.gameConfig.redPacketList[i].openNums != newData.gameConfig.redPacketList[i].openNums){
                            newData.gameConfig.redPacketList[i].openNums = userParm.gameConfig.redPacketList[i].openNums || 0;
                        }
                    }else{
                        newData.gameConfig.redPacketList[i].openNums = 0;
                    }
                }
            }
        }

        //排行榜配置
        if(data.data.hasOwnProperty("rankRewardConfig")){
            newData.rankRewardConfig = data.data.rankRewardConfig;
        }

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
        // 排行榜 自定义开奖时间 -> 刷新时间
        if(data.data.hasOwnProperty("rankCustomUpdateTime")){
            newData.rankCustomUpdateTime = 0;
        }
        //店铺Id 兼容老活动数据
        if(data.data.hasOwnProperty("storeId")){
            newData.storeId = data.data.storeId;
        }else{
            if(!userParm.hasOwnProperty("storeId")){
                // var bIsDebug = false;
                // var debugAccessToken=null;
                // const findData1 = await context.cloud.db.collection("debug").find({uuid:10001});
                // if (findData1.length > 0) //存在旧的
                // {
                //     bIsDebug = findData1[0].debug;
                //     debugAccessToken = findData1[0].accessToken;
                // }
                // //获取店铺信息
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
                newData.storeId = 0;
            }
        }
        //大西瓜奖励配置
        if(data.data.hasOwnProperty("integralRewardConfig")){
            newData.integralRewardConfig = data.data.integralRewardConfig;
            //更新库存数据
            var newResetConfig = newData.integralRewardConfig.resetConfig;
            var newExchangeConfig = [];
            var newStockConfig = [];
            if(newData.integralRewardConfig.hasOwnProperty("rewardList")){
                newData.integralRewardConfig.rewardList.forEach(element => {
                    newStockConfig.push({
                        type: element.type,
                        total: element.num,
                        nums: element.num
                    });
                    newExchangeConfig.push({
                        type: element.type,
                        state: element.exchangeConfig.state,
                        nums: element.exchangeConfig.nums,
                    });
                });
            }
            await cloud.db.collection("stock").updateMany({
                activeId: data.data.activeId
            },{
                $set: {
                    stockConfig: newStockConfig,
                    resetConfig: newResetConfig,
                    exchangeConfig: newExchangeConfig
                }
            });
        }
        //合成奖励配置
        if(data.data.hasOwnProperty("mergeRewardConfig")){
            newData.mergeRewardConfig = data.data.mergeRewardConfig;
            var newMergeConfig = [];
            newData.mergeRewardConfig.forEach(element =>{
                newMergeConfig.push({
                    type: element.type,
                    total: element.num,
                    nums: element.num
                });
            });
            await cloud.db.collection("stock").updateMany({
                activeId: data.data.activeId
            },{
                $set: {
                    mergeConfig: newMergeConfig,
                }
            });
        }
        //游戏弹窗配置
        if(data.data.hasOwnProperty("bouncedConfig")){
            newData.bouncedConfig = data.data.bouncedConfig;
        }
        await cloud.db.collection("users").updateMany({
            activeId: data.data.activeId,
        },{
            $set: newData
        });
        return PackReturn(code,message);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
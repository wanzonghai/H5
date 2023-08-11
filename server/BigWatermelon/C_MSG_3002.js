var code = 0;
var message = "成功";

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
    var ranString = "0123456789";
    var lenMax = ranString.length;
    var len = 10;
    for(var i = 0;i < len; i++){
        var ran = Math.floor(Math.random()*lenMax)
        rnd += ranString[ran];
    }
     return rnd;
}
//请求开红包
module.exports = async (context) =>{
    console.log("==3002==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        const miniappId = context.miniappId;
        const sourceMiniAppId = context.sourceMiniAppId;
        var time = new Date().getTime(); 
        //防止作弊 处理（前后两次开奖时间）
        var findPlayerData = await cloud.db.collection("players").find({
            //openid: openid,
            activeId: data.data.activeId,
            userOpenId: userOpenId
        });
        if(isRetError(findPlayerData)){
            return PackReturn(-2,"获取用户数据失败");
        }
        var playerParm = findPlayerData[0];
        //检测时间 小于2s 默认不中奖
        if(playerParm.hasOwnProperty("openRedTime")){
            if(time - playerParm.openRedTime <= 2 * 1000){
                console.log("遇到玩家刷中奖概率");
                return PackReturn(-8,"防刷限制");
            }
        }else{
            await cloud.db.collection("players").updateMany({
                activeId: data.data.activeId,
                userOpenId: userOpenId
            },{
                $set: {
                    openRedTime: time
                }
            });
        }
        //中奖概率 获取中奖类型
        var findData = await cloud.db.collection("users").find({ 
            //openid: openid,
            activeId: data.data.activeId
        });
        if(isRetError(findData) || findData.length <= 0){
            return PackReturn(-2,"获取活动数据失败");
        }
        var parm = findData[0];
        var creatorId = parm.creatorId;
        //活动开始检测
        if(parm.hasOwnProperty("sTime")){
            if(parm.sTime > new Date().getTime()){
                return PackReturn(-10,"活动未开始");
            }
        }
        //活动结束判定
        if(parm.hasOwnProperty("eTime")){
            if(parm.eTime <= new Date().getTime()){
                return PackReturn(-11,"活动到期");
            }
        }

        //开奖vip限制(关注用户 才能领奖)
        // if(parm.isVipControl){
        //     var findPlayerData = await cloud.db.collection("players").find({
        //         //openid: openid,
        //         activeId: data.data.activeId,
        //         userOpenId: userOpenId
        //     },{
        //         projection: {
        //             isVip: 1,
        //         }
        //     });
        //     if(isRetError(findPlayerData)){
        //         return PackReturn(-2,"获取数据失败");
        //     }
        //     if(findPlayerData[0].isVip <= 0){
        //         return PackReturn(-7,"未关注店铺");
        //     }
        // }
        //获取 中奖概率分布
        var rateList = [];
        var maxRate = 0;
        var setData = new Object();

        var redPacketList = parm.gameConfig.redPacketList;
        //首先 筛选出 满足条件的概率 进行计算
        for(var i = 0;i < redPacketList.length; i++){
            var model = redPacketList[i];
            if(!model) continue;
            //库存限制
            if(model.num <= 0){
                rateList.push(0);
                continue;
            }
            if(model.isRewardControl.type){
                //邀请人数限制 和 购买金额限制
                if((playerParm.count_invitation >= Number(model.isRewardControl.intiveNums)) || (playerParm.buyCost >= Number(model.isRewardControl.buyPrice))){
                        
                }else{
                    rateList.push(0);
                    continue;
                }
                //开奖次数限制
                if(model.hasOwnProperty("limitNums")){
                    // if(playerParm.openRedNum < model.limitNums - 1){
                    //     rateList.push(0);
                    //     continue;
                    // }
                    //谈子决定 第一次也要获得奖励
                    if(playerParm.openRedNum >= model.limitNums - 1){
                        
                    }else{
                        rateList.push(0);
                        continue;
                    }
                }
                //领奖次数限制
                if(model.isRewardControl.hasOwnProperty("maxLimit")){
                    if(playerParm.hasOwnProperty("openRedNum_" + model.type)){
                        if(playerParm["openRedNum_" + model.type] >= model.isRewardControl.maxLimit){
                            rateList.push(0);
                            continue;
                        }
                    }
                }
            }
            var i_rate = 0;
            if(model.num > 0){
                i_rate = Number(model.rate) * 100;
            }
            rateList.push(i_rate);
            maxRate += i_rate;
        }
        console.log("maxRate: ",maxRate);
        var maxRan = 0;
        if(maxRate > 100){
            maxRan = maxRate;
            rateList.push(maxRate - maxRate);
        }else{
            maxRan = 100;
            rateList.push(100 - maxRate);
        }
        console.log("maxRan: ",maxRan);
        console.log("通过限制条件的概率: ",rateList);

        //每个不为0的概率 随机判断是否可得
        for(var i = 0; i < rateList.length; i++){
            if(i == rateList.length - 1){
                continue;
            }
            if(rateList[i] == 0){
                continue;
            }
            if(rateList[i] >= 100){
                continue;
            }
            var newRandrom = Math.random() * 100;
            console.log("newRandrom: ",newRandrom);
            if(newRandrom > 0 && newRandrom <= rateList[i]){

            }else{
                rateList[i] = 0;
            }
        }

        console.log("随机得到 可能中奖的概率: ",rateList);
        //奖励类型
        var ran = Math.random() * maxRan;
        console.log("first ran: ",ran);
        var rewardType = -1;
        var sRate = 0;
        for(var k = 0; k < rateList.length; k++){
            var k_rate = sRate + rateList[k];
            if(ran > sRate && ran < k_rate){
                rewardType = k;
                break;
            }
            sRate += rateList[k];
        }
        console.log("first rewardType: ",rewardType);
        if(rewardType == -1){
            //查找是否配置有 超过100%概率的奖品
            var newMaxRan = 0;
            var typeList = [];
            var newRateList = [];
            for(var i = 0; i < rateList.length; i++){
                if(rateList[i] >= 100){
                    typeList.push(i+1);
                    newRateList.push(rateList[i]);
                    newMaxRan += rateList[i];
                }
            }
            //保证100%配置的可以领奖 
            if(newRateList.length > 0){
                var newsRate = 0;
                ran = Math.random() * newMaxRan;
                console.log("second ran: ",ran);
                for(var k = 0; k < newRateList.length; k++){
                    var k_rate = newsRate + newRateList[k];
                    if(ran > newsRate && ran < k_rate){
                        rewardType = k;
                        break;
                    }
                    newsRate += newRateList[k];
                }
            }
            console.log("second rewardType: ",rewardType);
        }
        //test
        //  rewardType = 0;
        
        //更新中奖记录
        if(rewardType != -1 && rewardType < rateList.length - 1){
            var packet = redPacketList[rewardType];
            setData.isHasReward_bag = true;
            //每个奖品 领取限制
            if(playerParm.hasOwnProperty("openRedNum_" + packet.type)){
                setData["openRedNum_" + packet.type] = playerParm["openRedNum_" + packet.type] + 1;
            }else{
                setData["openRedNum_" + packet.type] = 1;
            }
            // console.log("setData: ",setData);

            var curNum = packet.num;
            if(curNum <= 0){
                return PackReturn(-7,"奖品数量不足");
            }
            curNum -= 1;
            packet.num = curNum;
            //兼容B段配置过来 openNums为null的情况
            if(!packet.openNums){
                packet.openNums = 0;
            }
            var openNums = parseInt(packet.openNums);
            openNums += 1;
            packet.openNums = openNums;
            //packet 类型
            redPacketList[rewardType] = packet;
            var record = new Object();
            record.userOpenId = userOpenId;
            record.openid = creatorId;
            record.activeId = data.data.activeId;
            record.isWinner = true;
            // record.type = "" + (rewardType + 1);
            record.tbName = data.data.nickName;
            record.rewardTime = new Date().getTime();
            record.isShip = 0;
            record.orderId = randomId();
            record.address = "";
            record.consignee = "";
            record.logisticsId = "";
            record.shipTime = "";
            record.phone = "";
            record.company = "";
            record.rewardInfo = new Object();
            record.rewardInfo.total = packet.total;
            record.rewardInfo.price = packet.price;
            record.rewardInfo.num_iid = packet.num_iid;
            record.rewardInfo.pic_url = packet.pic_url;
            record.rewardInfo.title = packet.title;
            record.rewardInfo.sendNum = packet.openNums;
            record.rewardInfo.type = packet.type;
            record.rewardInfo.name = packet.name;
            record.rewardInfo.state = 0;
            //新加优惠券关联字段
            if(packet.hasOwnProperty("linkId")){
                record.rewardInfo.linkId = packet.linkId;
            }

            await cloud.db.collection("winner").insertOne(record);
            //更新 服务器奖池数据
            await cloud.db.collection("users").updateMany({
                //openid: openid,
                activeId: data.data.activeId
            },{
                $set: {
                    "gameConfig.redPacketList": redPacketList
                }
            });
            //-------------------------------如果奖励优惠券 直接发放------------------------
            if(packet.name == "coupon"){
                //检查是否是调试模式
                var bIsDebug = false;
                var debugAccessToken=null;
                const findData1 = await cloud.db.collection("debug").find({uuid:10001});
                if (findData1.length > 0){ //存在旧的
                    bIsDebug = findData1[0].debug;
                    debugAccessToken = findData1[0].accessToken;
                }
                // console.log("contextData: ",contextData);
                // console.log("context: ",context);
                var uuid = "" + userOpenId + time;
                const resposeData = await context.cloud.topApi.invoke({
                    api : 'alibaba.benefit.send',
                    data : {
                        'right_ename': packet.num_iid,//Ename
                        'receiver_id': userOpenId,
                        'user_type':'taobao',
                        'unique_id':uuid,
                        'app_name':'promotioncenter-'+sourceMiniAppId,
                        'session':debugAccessToken  //测试时候用的
                    },
                    autoSession: !bIsDebug  //测试时候填false
                });
            }
            //统计 玩家开红包次数 openRedNum
            await cloud.db.collection("players").updateMany({
                //openid: openid,
                activeId: data.data.activeId,
                userOpenId: userOpenId
            },{
                $set: setData,
                $inc: {
                    openRedNum: 1
                }
            });
        }else{
            //统计 玩家开红包次数 openRedNum
            await cloud.db.collection("players").updateMany({
                //openid: openid,
                activeId: data.data.activeId,
                userOpenId: userOpenId
            },{
                $inc: {
                    openRedNum: 1
                }
            });
        }
        //统计 抢红包次数
        var timeData = new Date();
        var curTime = timeData.getTime();
        var year = timeData.getFullYear();
        var month = timeData.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        var day = timeData.getDate();
        day = day < 10 ? "0" + day : day;
        var strTime = "" + year + "-" + month + "-" + day;
        var findJoinData = await cloud.db.collection("join").find({
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId,
            time: strTime,
            redBagNums: {$gt: 0}
        });
        if(isRetError(findJoinData)){
            return PackReturn(-2,"获取数据失败");
        }
        await cloud.db.collection("join").updateMany({
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId,
            time: strTime,
        },{
            $inc: {
                redBagNums: 1
            }
        });
        if(findJoinData.length <= 0){
            await cloud.db.collection("activityRecord").updateMany({
                //openid: openid,
                activeId: data.data.activeId,
                sTime: {$lt: curTime},
                eTime: {$gt: curTime},
            },{
                $inc: {
                    redBagNums: 1,
                    grabPlayerNums: 1
                }
            });
        }else{
            //分享总数 +1
            await cloud.db.collection("activityRecord").updateMany({
                //openid: openid,
                activeId: data.data.activeId,
                sTime: {$lt: curTime},
                eTime: {$gt: curTime},
            },{
                $inc: {
                    redBagNums: 1
                }
            });
        }
        if(rewardType == -1){
            return PackReturn(code,message,{type: 4});
        }
        return PackReturn(code,message,{type: rewardType + 1});
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
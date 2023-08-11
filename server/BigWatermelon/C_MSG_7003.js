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
//获取 合成奖励
module.exports = async (context) =>{
    console.log("==7003==");
    try {
        const sourceMiniAppId = context.sourceMiniAppId;
        var data = context.data.data;
        var userOpenId = context.openId;
        const cloud = context.cloud;
        console.log("data: ",data);
        console.log("activeId: ",data.data.activeId);
        //获取玩家数据
        var findPlayerData = await cloud.db.collection("players").find({
            userOpenId: userOpenId,
            activeId: data.data.activeId
        });
        if(isRetError(findPlayerData) || findPlayerData.length <= 0){
            return PackReturn(-2,"获取玩家数据失败");
        }
        var findStock = await cloud.db.collection("stock").find({
            activeId: data.data.activeId,
        },{
            projection: {
                stockConfig: 1,
                mergeConfig: 1,
                mergeData: 1
            }
        });
        if(isRetError(findStock)){
            return PackReturn(-2,"获取库存数据失败");
        }
        if(findStock.length <= 0){
            return PackReturn(-2,"未获得活动库存数据")
        }
        var findData = await cloud.db.collection("users").find({ 
            activeId: data.data.activeId
        },{
            projection: {
                sTime: 1,
                eTime: 1,
                creatorId: 1,
                mergeRewardConfig: 1
            }
        });
        if(isRetError(findData) || findData.length <= 0){
            return PackReturn(-2,"获取活动数据失败");
        }
        var parm = findData[0];
        //活动开始检测
        if(parm.hasOwnProperty("sTime")){
            if(parm.sTime > new Date().getTime()){
                return PackReturn(-10,"活动未开始");
            }
        }
        //活动结束检测
        if(parm.hasOwnProperty("eTime")){
            if(parm.eTime <= new Date().getTime()){
                return PackReturn(-11,"活动到期");
            }
        }
        var creatorId = parm.creatorId;
        //获取 中奖概率分布
        var rateList = [];
        var maxRate = 0;
        if(!parm.hasOwnProperty("mergeRewardConfig")){
            return PackReturn(-2,"合成奖励字段未配置");
        }
        var mergeRewardConfig = parm.mergeRewardConfig;
        //检测是否里面 都是空对象
        if(mergeRewardConfig.length <= 0){
            return PackReturn(-2,"合成奖励数组为空");
        }else{
            var isGetNull = false;
            for(var i = 0; i < mergeRewardConfig.length; i++){
                if(Object.keys(mergeRewardConfig[i]).length <= 0){
                    isGetNull = true;
                    break;
                }
            }
            if(isGetNull){
                return PackReturn(-2,"合成奖励配置错误");
            }
        }
        var mergeConfig = findStock[0].mergeConfig;
        //首先 筛选出 满足条件的概率 进行计算
        //目前概率 B端不显示 服务器写死 1: 20% 2: 30%
        var cRate = 0;
        if(data.data.type == "half"){
            cRate = 20;
        }else if(data.data.type == "whole"){
            cRate = 30;
        }
        rateList.push(cRate);
        maxRate += cRate;
        // for(var i = 0;i < mergeConfig.length; i++){
        //     var model = mergeConfig[i];
        //     if(!model) continue;
        //     //库存限制
        //     if(model.nums <= 0){
        //         rateList.push(0);
        //         continue;
        //     }
        //     // var i_rate = Number(model.rate) * 100;
        //     var i_rate = 0;
        //     if(model.type == 1){
        //         i_rate = 20;
        //     }else if(model.type == 2){
        //         i_rate = 30;
        //     }
        //     rateList.push(i_rate);
        //     maxRate += i_rate;
        // }
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
        var packet = null;
        var sendData = null;
        var curMergeConfig = null;

        if(rewardType != -1 && rewardType < rateList.length - 1){
            //随机一个中奖的奖励
            rewardType = -1;
            var typeList = [];
            for(var i = 0; i < mergeConfig.length; i++){
                if(mergeConfig[i].nums > 0){
                    typeList.push(mergeConfig[i].type);
                }
            }
            if(typeList.length <= 0){
                console.log("库存不足");
                return PackReturn(code,message,{type: -1});
            }
            if(typeList.length == 1){
                rewardType = 0;
            }else{
                rewardType = parseInt(Math.random() * typeList.length);
            }
            console.log("奖品类型 - 1 ：",rewardType);
            packet = mergeRewardConfig[rewardType];
            var openNums = 0;
            if(findStock[0].hasOwnProperty("mergeData")){
                sendData = findStock[0].mergeData;
                for(var i = 0; i < sendData.length; i++){
                    if(sendData[i].type == rewardType + 1){
                        sendData[i].nums = Number(sendData[i].nums) + 1;
                        openNums = Number(sendData[i].nums);
                        break;
                    }
                }
            }else{
                sendData = [];
                for(var i = 0; i < findStock[0].stockConfig.length; i++){
                    sendData[i] = new Object();
                    sendData[i].type = findStock[0].stockConfig[i].type;
                    if(findStock[0].stockConfig[i].type == rewardType + 1){
                        sendData[i].nums = 1;
                        openNums = Number(sendData[i].nums);
                        break;
                    }
                }
            }
            
            if(findStock[0].hasOwnProperty("mergeConfig")){
                curMergeConfig = findStock[0].mergeConfig;
                for(var i = 0; i < curMergeConfig.length; i++){
                    if(curMergeConfig[i].type == rewardType + 1){
                        curMergeConfig[i].nums = Number(curMergeConfig[i].nums) - 1;
                        break;
                    }
                }
            }
            //packet 类型
            var record = new Object();
            record.userOpenId = userOpenId;
            record.openid = creatorId;
            record.activeId = data.data.activeId;
            record.isWinner = true;
            record.from = "merge";
            record.tbName = findPlayerData[0].nickName;
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
            record.rewardInfo.sendNum = openNums;
            record.rewardInfo.type = packet.type;
            record.rewardInfo.name = packet.name;
            record.rewardInfo.state = 0;
            //新加优惠券关联字段
            if(packet.hasOwnProperty("linkId")){
                record.rewardInfo.linkId = packet.linkId;
            }
            //添加中奖记录
            await cloud.db.collection("winner").insertOne(record);
            //更新玩家奖品包记录
            await cloud.db.collection("players").updateMany({
                activeId: data.data.activeId,
                userOpenId: userOpenId
            },{
                $set: {
                    isHasReward_bag: true
                }
            });

            //-------------------------------如果奖励优惠券 直接发放------------------------
            if(packet.name == "coupon" || packet.name == "redpacket"){
                //检查是否是调试模式
                var bIsDebug = false;
                var debugAccessToken=null;
                const findDebug = await cloud.db.collection("debug").find({uuid:10001});
                if (findDebug.length > 0){ //存在旧的
                    bIsDebug = findDebug[0].debug;
                    debugAccessToken = findDebug[0].accessToken;
                }
                // console.log("contextData: ",contextData);
                // console.log("context: ",context);
                var uuid = "" + userOpenId + record.rewardTime;
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
        }
        if(rewardType == -1 || rewardType >= rateList.length - 1){
            return PackReturn(code,message,{type: -1});
        }
        //库存数量 更新 + 更新合成奖励 发放数量
        await cloud.db.collection("stock").updateMany({
            activeId: data.data.activeId
        },{
            $set: {
                mergeData: sendData,
                mergeConfig: curMergeConfig
            }
        });
        return PackReturn(code,message,mergeRewardConfig[rewardType]);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
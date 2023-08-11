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
//积分兑换奖品
module.exports = async (context) =>{
    console.log("==7002==");
    try {
        var data = context.data.data;
        const sourceMiniAppId = context.sourceMiniAppId;
        const userOpenId = context.openId;
        const cloud = context.cloud;
        console.log("data: ",data);
        if(!data.data.hasOwnProperty("activeId")){
            console.log("activeId为空");
            return PackReturn(-1,"activeId为undefined");
        }
        if(!data.data.hasOwnProperty("type")){
            return PackReturn(-1,"兑换需要的type类型为undefined")
        }
        var findPlayerData = await cloud.db.collection("players").find({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        },{
            projection: {
                point: 1,
                nickName: 1,
                exchangeData: 1
            }
        });
        if(isRetError(findPlayerData) || findPlayerData.length <= 0){
            return PackReturn(-2,"获取玩家数据失败");
        }
        //获取活动数据
        var findUserData = await cloud.db.collection("users").find({
            activeId: data.data.activeId
        },{
            projection:{
                creatorId: 1,
                integralRewardConfig: 1,
                sTime: 1,
                eTime: 1
            }
        });
        if(isRetError(findUserData) || findUserData.length <= 0){
            return PackReturn(-2,"获取活动数据失败");
        }
        //活动开始检测
        if(findUserData[0].hasOwnProperty("sTime")){
            if(findUserData[0].sTime > new Date().getTime()){
                return PackReturn(-10,"活动未开始");
            }
        }
        //活动结束检测
        if(findUserData[0].hasOwnProperty("eTime")){
            if(findUserData[0].eTime <= new Date().getTime()){
                return PackReturn(-11,"活动到期");
            }
        }
        var packet = null;
        //判定是否 满足兑换条件
        var flag = false;
        var needPoint = 0;
        console.log("type: ",data.data.type);
        for(var i = 0; i < findUserData[0].integralRewardConfig.rewardList.length; i++){
            if(findUserData[0].integralRewardConfig.rewardList[i].type == data.data.type){
                packet = findUserData[0].integralRewardConfig.rewardList[i];
                needPoint = Math.ceil(Number(findUserData[0].integralRewardConfig.rewardList[i].integral));
                console.log("needPoint: ",needPoint);
                console.log("point: ",findPlayerData[0].point);
                //积分足够
                if(Number(findPlayerData[0].point) >= needPoint){
                    flag = true;
                }
                break;
            }
        }
        if(!flag){
            return PackReturn(-5,"积分不足");
        }
        //获取库存数据
        var findStock = await cloud.db.collection("stock").find({
            activeId: data.data.activeId
        },{
            projection: {
                stockConfig: 1,
                exchangeConfig: 1,
                sendConfig: 1
            }
        });
        if(isRetError(findStock) || findStock.length <= 0){
            return PackReturn(-2,"获取库存数据失败");
        }
        //判定库存 
        var isHasStock = true;
        for(var i = 0; i < findStock[0].stockConfig.length; i++){
            if(findStock[0].stockConfig[i].type == data.data.type){
                if(findStock[0].stockConfig[i].nums <= 0){
                    isHasStock = false;
                }
                break;
            }
        }
        if(!isHasStock){
            return PackReturn(-6,"库存不足");
        }

        //判定 个人兑换次数
        var isLimit = false;
        if(findStock[0].hasOwnProperty("exchangeConfig")){
            for(var i = 0; i < findStock[0].exchangeConfig.length; i++){
                if(findStock[0].exchangeConfig[i].type == data.data.type){
                    if(!findStock[0].exchangeConfig[i].state){
                        //未开启限制
                        break;
                    }
                    if(findPlayerData[0].hasOwnProperty("exchangeData")){
                        for(var k = 0; k < findPlayerData[0].exchangeData.length; k++){
                            if(findPlayerData[0].exchangeData[k].type == data.data.type){
                                if(findPlayerData[0].exchangeData[k].nums >= findStock[0].exchangeConfig[i].nums){
                                    isLimit = true;
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        console.log("type: ",data.data.type);
        console.log("isLimit: ",isLimit);
        if(isLimit){
            return PackReturn(-7,"兑换次数不足");
        }
        //开始兑换
        var curExchangeData = null;
        if(findPlayerData[0].hasOwnProperty("exchangeData")){
            curExchangeData = findPlayerData[0].exchangeData;
            for(var i = 0; i < curExchangeData.length; i++){
                if(curExchangeData[i].type == data.data.type){
                    curExchangeData[i].nums = Number(curExchangeData[i].nums) + 1;
                    break;
                }
            }
        }else{
            curExchangeData = [];
            for(var i = 0; i < findStock[0].stockConfig.length; i++){
                curExchangeData[i] = new Object();
                curExchangeData[i].type = findStock[0].stockConfig[i].type;
                if(findStock[0].stockConfig[i].type == data.data.type){
                    curExchangeData[i].nums = 1;
                }else{
                    curExchangeData[i].nums = 0;
                }
            }
        }
        var curStockConfig = null;
        if(findStock[0].hasOwnProperty("stockConfig")){
            curStockConfig = findStock[0].stockConfig;
            for(var i = 0; i < findStock[0].stockConfig.length; i++){
                if(findStock[0].stockConfig[i].type == data.data.type){
                    curStockConfig[i].nums = Number(curStockConfig[i].nums) - 1;
                    break;
                }
            }
        }
        var curSendConfig = null;
        var openNums = 0;
        if(findStock[0].hasOwnProperty("sendConfig")){
            curSendConfig = findStock[0].sendConfig;
            for(var i = 0; i < curSendConfig.length; i++){
                if(curSendConfig[i].type == data.data.type){
                    curSendConfig[i].nums = Number(curSendConfig[i].nums) + 1;
                    openNums = Number(curSendConfig[i].nums);
                    break;
                }
            }
        }else{
            curSendConfig = [];
            for(var i = 0; i < findStock[0].stockConfig.length; i++){
                curSendConfig[i] = new Object();
                curSendConfig[i].type = findStock[0].stockConfig[i].type;
                if(findStock[0].stockConfig[i].type == data.data.type){
                    curSendConfig[i].nums = 1;
                    openNums = Number(curSendConfig[i].nums);
                    break;
                }
            }
        }
        console.log("333");
        //生成奖品
        // var packet = findUserData[0].integralRewardConfig.rewardList
        var record = new Object();
        record.openid = findUserData[0].creatorId;
        record.userOpenId = userOpenId;
        record.activeId = data.data.activeId;
        record.isWinner = true;
        record.from = "point";
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
        //添加记录
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
        if(packet.name == "coupon" || packet.name == "redPacket"){
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
            var time = new Date().getTime(); 
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
        //更新玩家 积分 兑换记录 exchangeData
        var curPoint = findPlayerData[0].point - needPoint;
        await cloud.db.collection("players").updateMany({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        },{
            $set: {
                point: curPoint,
                exchangeData: curExchangeData
            }
        });
        //更新库存数量 和  发放数量
        await cloud.db.collection("stock").updateMany({
            activeId: data.data.activeId
        },{
            $set: {
                sendConfig: curSendConfig,
                stockConfig: curStockConfig
            }
        });
        return PackReturn(code,message,{point: curPoint});
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
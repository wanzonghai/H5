var code = 0;
var message = "成功";

function bIsNull(a) {
    if (a !== null && a !== undefined) {
        return false;
    }
    return true;
}

function isRetError(ret) {
    if (!ret == null || ret == undefined || ret < 0) {
        return true;
    }
    return false;
}

function PackReturn(code, message, data) {
    if (data == undefined) {
        return JSON.stringify({
            code: code,
            message: message
        });
    } else {
        return JSON.stringify({
            code: code,
            message: message,
            data: data
        });
    }
}
// 购买商品 补发金币接口
module.exports = async(context) => {
    console.log("==C_MSG_6001==");
    try {
        //时间段
        const cloud = context.cloud;
        const userOpenId = context.openId;
        var data = context.data.data;
        // console.log("data: ",data.data);
        //获取活动 
        var findUserData = await cloud.db.collection("users").find({
            activeId: data.data.activeId
        },{
            projection: {
                "gameConfig.missionConfig": 1
            }
        });
        if(isRetError(findUserData)){
            return PackReturn(-1,"获取活动数据失败");
        }
        if(findUserData.length <= 0){
            return PackReturn(-1,"未获取到活动数据");
        }
        //购买店铺商品 任务奖励金币数
        var rewardCount = 0;
        if(findUserData[0].gameConfig.hasOwnProperty("missionConfig")){
            for(var i = 0; i < findUserData[0].gameConfig.missionConfig.length; i++){
                if(findUserData[0].gameConfig.missionConfig[i].id == 9){
                    //金币奖励
                    rewardCount = findUserData[0].gameConfig.missionConfig[i].rewardCount_1;
                    break;
                }
            }
        }
        console.log("rewardCount: ",rewardCount);
        var requireTime = new Date().getTime();
        var userNickName = context.userNick;//获取C端用户的id
        // console.log("222");
        //获取未领奖的时间点
        var getTimeData = await cloud.db.collection("bury").aggregate([
            {
                $match: {
                    activeId: data.data.activeId,
                    userOpenId: userOpenId,
                    action: "buyTime",
                    time: {
                        $gt: 0
                    },
                }
            },{
                $group: {
                    _id: "$time",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]);
        if(isRetError(getTimeData)){
            return PackReturn(-1,"获取数据失败");
        }
        if(getTimeData.length <= 0){
            return PackReturn(-2,"未获得时间点数据");
        }
        console.log("getTimeData.length : ",getTimeData.length);
        //找到 最早的时间点
        var preTime = requireTime;
        for(var i = 0; i < getTimeData.length; i++){
            // console.log("_id: ",getTimeData[i]._id);
            if(getTimeData[i]._id < preTime){
                preTime = Number(getTimeData[i]._id);
            }
        }
        // console.log("preTime: ",preTime);
        //时间段 处理
        var sDate = new Date(preTime);
        var sYear = sDate.getFullYear();
        var sMonth = sDate.getMonth() + 1;
        sMonth = sMonth < 10 ? "0" + sMonth : sMonth;
        var sDay = sDate.getDate();
        sDay = sDay < 10 ? "0" + sDay : sDay;
        var sHour = sDate.getHours();
        sHour = sHour < 10 ? "0" + sHour : sHour;
        var sMinute = sDate.getMinutes();
        sMinute = sMinute < 10 ? "0" + sMinute : sMinute;
        var sSecond = sDate.getSeconds();
        sSecond = sSecond < 10 ? "0" + sSecond : sSecond;
        var strBeginDateTime = "" + sYear + "-" + sMonth + "-" + sDay + " " + sHour + ":" + sMinute + ":" + sSecond;

        var eDate = new Date();
        var eYear = eDate.getFullYear();
        var eMonth = eDate.getMonth() + 1;
        eMonth = eMonth < 10 ? "0" + eMonth : eMonth;
        var eDay = eDate.getDate();
        eDay = eDay < 10 ? "0" + eDay : eDay;
        var eHour = eDate.getHours();
        eHour = eHour < 10 ? "0" + eHour : eHour;
        var eMinute = eDate.getMinutes();
        eMinute = eMinute < 10 ? "0" + eMinute : eMinute;
        var eSecond = eDate.getSeconds();
        eSecond = eSecond < 10 ? "0" + eSecond : eSecond;
        var strNowDateTime = "" + eYear + "-" + eMonth + "-" + eDay + " " + eHour + ":" + eMinute + ":" + eSecond;

        console.log("strBeginDateTime: ",strBeginDateTime);
        console.log("strNowDateTime: ",strNowDateTime);

         //检查是否是调试模式
         var bIsDebug = false;
         var debugAccessToken=null;
         const findData = await cloud.db.collection("debug").find({uuid:10001});
         if (findData.length > 0) //存在旧的
         {
           bIsDebug = findData[0].debug;
           debugAccessToken = findData[0].accessToken;
         }
        //获取订单列表
        /*
          'start_created':strBeginDateTime,
          'end_created':strNowDateTime,
          'status':'WAIT_SELLER_SEND_GOODS',
        */
          var params = {
            'fields':'tid,type,status,num_iid,buyer_nick,price,orders,pay_time,payment',
            'start_created':strBeginDateTime,
            'end_created':strNowDateTime,
            'type':'guarantee_trade',
            'page_no':'1',
            'page_size':'40',
            'use_has_next':'true',
            'buyer_open_id':userOpenId,   //买家的openid
            'buyer_nick':userNickName,
            'session':debugAccessToken  //测试时候用的
          };
  
        //   console.log(`input--->>>${JSON.stringify(params)}`);
  
          const resposeData = await context.cloud.topApi.invoke({
              api: 'taobao.open.trades.sold.get',
              data: params,
              autoSession: !bIsDebug //测试时候用的
          });
        //   console.log(`output--->>>${JSON.stringify(resposeData)}`);
        //   var buryData = new Object(); 
        //   buryData.record = {};
          var retData = new Object();
          retData.record = {};
          retData.price = 0;
          if(resposeData.hasOwnProperty("trades")){
             if(resposeData.trades.hasOwnProperty("trade")){
                if(resposeData.trades.trade.length > 0){
                    for(var i = 0; i < resposeData.trades.trade.length; i++){
                        var element = resposeData.trades.trade[i];
                        //判定用户id
                        if(element.buyer_open_uid == userOpenId){
                           if(element.orders.hasOwnProperty("order")){
                              if(element.orders.order.length > 0){
                                 element.orders.order.forEach(order =>{
                                    //屏蔽 未付款的订单
                                    if(order.status == "WAIT_BUYER_PAY" 
                                        || order.status == "TRADE_CLOSED"
                                        || order.status == "TRADE_CLOSED_BY_TAOBAO"
                                        || order.status == "TRADE_NO_CREATE_PAY"
                                        || order.status == "PAY_PENDING"
                                        || order.status == "ALL_WAIT_PAY"
                                        || order.status == "ALL_CLOSED"
                                    ){
                                        console.log("not pay status: ",order.status);
                                        return;
                                    }
                                    console.log("num: ",order.num);
                                    console.log("payment: ",order.payment);
                                    retData.price += Number(order.payment);
                                    // buryData["record"]["" + order.num_iid] = order.num;
                                    retData["record"]["" + order.num_iid] = order.num;
                                 });
                              }
                           }else{
                              retData.price += Number(element.payment);
                           }
                        
                        }
                    }
                }
             }
          }
          console.log("total payment: ",retData.price);
          retData.price = Math.ceil(retData.price);
          
          if(retData.price > 0){
            // buryData.action = "pay";
            // buryData.activeId = data.data.activeId;
            // buryData.userOpenId = userOpenId;
            // buryData.nickName = userNickName;
            // buryData.time = requireTime;
            // buryData.record_num = retData.price;
            // buryData.reward_num = rewardCount * retData.price;
            // if(data.hasOwnProperty("clientVersion")){
            //     buryData.clientVersion = data.clientVersion;
            // }
            // //订单埋点
            // await cloud.db.collection("bury").insertOne(buryData);

            //埋点改成C端上报 后端提供数据
            retData.time = requireTime;
            //更新 埋点表中的数据
            await cloud.db.collection("bury").updateMany({
                activeId: data.data.activeId,
                userOpenId: userOpenId,
                action: "buyTime",
                time: {
                    $gte: preTime
                }
            },{
                $set: {
                    time: 0
                }
            });
          }else{
              return PackReturn(-1,"未获取到补偿订单");
          }
          return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4, "catch失败", e);
    }
}
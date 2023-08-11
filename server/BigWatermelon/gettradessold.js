function isRetError(ret) {
  if (!ret == null || ret == undefined || ret < 0) {
      return true;
  }
  return false;
}
module.exports = async (context) => {

    console.log(`开始测试`);
    const userOpenId = context.openId;
    function PackReturn (code, message, data) {

        return JSON.stringify({code: code, message: message, data: data});
    }

    //Date.prototype.TimeZone = new Map([
    //     ['Europe/London',0],
    //     ['Asia/Shanghai',-8],
    //     ['America/New_York',5]
    // ])
    process.env.TZ = "Asia/Shanghai";

    try {
      console.log("context.data: ",context.data);
      if(context.data.hasOwnProperty("clientVersion")){
          console.log("clientVersion111: ",context.data.clientVersion);
      }
      //获取活动 
      var findUserData = await context.cloud.db.collection("users").find({
          activeId: context.data.activeId
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
                  rewardCount = findUserData[0].gameConfig.missionConfig[i].rewardCount_1;
                  break;
              }
          }
      }
      console.log("rewardCount: ",rewardCount);
      //获取未领奖的时间点
      var isGetTime = true;
      var getTimeData = await context.cloud.db.collection("bury").find({
        activeId: context.data.activeId,
        userOpenId: userOpenId,
        action: "buyTime",
        time: context.data.openDetilTime
      });

      if(isRetError(getTimeData)){
        return PackReturn(-1,"获取数据错误")
      }
      if(getTimeData.length <= 0){
        isGetTime =false;
      }

        var code = 0;
        var message = "";
        var retData = new Object();

        //检查是否是调试模式
        var bIsDebug = false;
        var debugAccessToken=null;
        const findData = await context.cloud.db.collection("debug").find({uuid:10001});
        if (findData.length > 0) //存在旧的
        {
          bIsDebug = findData[0].debug;
          debugAccessToken = findData[0].accessToken;
        }

        console.log(`1------------------->>>(${JSON.stringify(context.data)})`);

        var buyerOpenid = context.openId;//获取C端用户的id
        var buyerNickName = context.userNick;//获取C端用户的id
        var strBeginDateTime = new Date(context.data.openDetilTime).toLocaleString() ;
        var strNowDateTime = new Date().toLocaleString();
        

        var sDate = new Date(context.data.openDetilTime);
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
        strBeginDateTime = "" + sYear + "-" + sMonth + "-" + sDay + " " + sHour + ":" + sMinute + ":" + sSecond;

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
        strNowDateTime = "" + eYear + "-" + eMonth + "-" + eDay + " " + eHour + ":" + eMinute + ":" + eSecond;

        console.log("strBeginDateTime: ",strBeginDateTime);
        console.log("strNowDateTime: ",strNowDateTime);
        /*
          'start_created':strBeginDateTime,
          'end_created':strNowDateTime,
        */
        var params = {
          'fields':'tid,type,status,num_iid,buyer_nick,price,orders,payment',
          'start_created':strBeginDateTime,
          'end_created':strNowDateTime,
          'status':'WAIT_SELLER_SEND_GOODS',
          'type':'guarantee_trade',
          'page_no':'1',
          'page_size':'40',
          'use_has_next':'true',
          'buyer_open_id':buyerOpenid,   //买家的openid
          'buyer_nick':buyerNickName,
          'session':debugAccessToken  //测试时候用的
        };

        console.log(`input--->>>${JSON.stringify(params)}`);

        const resposeData = await context.cloud.topApi.invoke({
            api: 'taobao.open.trades.sold.get',
            data: params,
            autoSession: !bIsDebug //测试时候用的
        });

        // console.log(`output--->>>${JSON.stringify(resposeData)}`);

        if( resposeData.trades !=null && resposeData.trades != "undefined" )
        {
          if( resposeData.trades.trade !=null && resposeData.trades.trade != "undefined" )
          {
            if( resposeData.trades.trade[0] !=null && resposeData.trades.trade[0] != "undefined" )
            {
              if (resposeData.trades.trade[0].buyer_open_uid == buyerOpenid) //说明这个用户已经付完钱了
              {
                  code = 0;
                  message = "OK";
                  retData = resposeData.trades.trade[0];
                  
                  var retObj = new Object();
                  retObj.record = {};
                  //实际付款金额
                  console.log("payment: ",retData.payment);
                  retObj.price = Math.ceil(Number(retData.payment));
                  console.log("isGetTime: ",isGetTime);
                  if(isGetTime){
                    // var buryData = new Object();
                    //   buryData.record = {};
                      if(retData.orders.hasOwnProperty("order")){
                        if(retData.orders.order.length > 0){
                            retData.orders.order.forEach(order =>{
                              // buryData["record"]["" + order.num_iid] = order.num;
                              retObj["record"]["" + order.num_iid] = order.num;
                            });
                        }
                      }
                      // buryData.action = "pay";
                      // buryData.activeId = context.data.activeId;
                      // buryData.userOpenId = userOpenId;
                      // buryData.nickName = buyerNickName;
                      // buryData.time = new Date().getTime();
                      // buryData.record_num = retObj.price;
                      // buryData.reward_num = rewardCount * retObj.price;
                      // if(context.data.hasOwnProperty("clientVersion")){
                      //     buryData.clientVersion = context.data.clientVersion;
                      // }
                      // //订单埋点
                      // await context.cloud.db.collection("bury").insertOne(buryData);
                      retObj.time = new Date().getTime();
                      //更新购买时间 埋点数据
                      await context.cloud.db.collection("bury").updateMany({
                        activeId: context.data.activeId,
                        userOpenId: userOpenId,
                        action: "buyTime",
                        time: {
                          $gte: context.data.openDetilTime,
                        }
                      },{
                        $set: {
                            time: 0
                        }
                      });
                  }
                  return PackReturn(code, message, retObj);
              }
            }
          }
      }
  
        
      code = -1;
      message = "没有已完成付款的订单！";
      console.log("retData: ",retData);
      return PackReturn(code, message, retData);

    } catch (e) {

        console.log(`Error:(${e})`);
        return PackReturn(-4, `Error:(${JSON.stringify(e)})`);
    }
    finally {
        console.log(`结束测试`);
    }
};





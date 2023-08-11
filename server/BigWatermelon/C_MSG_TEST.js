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
    var ranString = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var lenMax = ranString.length;
    var len = 20;
    for(var i = 0;i < len; i++){
        var ran = Math.floor(Math.random()*lenMax)
        rnd += ranString[ran];
    }
     return rnd;
}
//测试接口
module.exports = async (context) =>{
    console.log("C_MSG_TEST");
    // try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        // //shareNums
        // var findData = await cloud.db.collection("activityRecord").find({
        //     //openid: openid,
        //     activeId: data.data.activeId,
        //     shareNums: {$gt: 0},
        //     shareNums: {$lt: 10}
        // });
        // if(isRetError(findData) || findData.length <= 0){
        //     return PackReturn(-2,"获取数据错误")
        // }
        // console.log("findData: ",findData[0]);
        // return PackReturn(code,message);

        // //获取当前活动记录
        // var findUserData = await cloud.db.collection("users").find({
        //     //openid: openid,
        //     activeId: data.data.activeId
        // });
        // if(isRetError(findUserData)){
        //     return PackReturn(-2,"获取数据失败");
        // }
        // var parm = findUserData[0];
        // //生成排行榜记录
        // var list_rank = [];
        // var totalRank_count = 50;
        // var allPlayerData = await cloud.db.collection("players").find(
        //     {  
        //         //openid: openid,
        //         activeId: data.data.activeId,
        //         point: {$gte: 0} 
        //     }, 
        //     {  
        //         //预留字段 1：玩家昵称 2：头像 3：金币数 
        //         projection: {point: 1,nickName: 1,headUrl: 1,userCoin: 1,userOpenId: 1}, 
        //         sort: {point: -1},  
        //         limit: totalRank_count,  
        //     }
        // )

        // if(isRetError(allPlayerData)){
        //     return PackReturn(-3,"获取数据失败");
        // }else{
        //     if(allPlayerData.length > 0){
        //         for(var i = 0; i < allPlayerData.length; i++){
        //             list_rank.push(allPlayerData[i]);
        //         }
        //     }
        // }
        
        // //获取机器人
        // var findAIData = await cloud.db.collection("rank").find({
        //     //openid: openid,
        //     activeId: data.data.activeId,
        //     name: "robot"
        // },{
        //     sort: {
        //         point: -1
        //     }
        // });

        // if(isRetError(findAIData)){
        //     return PackReturn(-2,"获取机器人失败");
        // }else{
        //     if(findAIData.length > 0){
        //         for(var i = 0; i < findAIData.length; i++){
        //             list_rank.push(findAIData[i]);
        //         }
        //     }
        // }
        // list_rank.sort((a,b)=>{
        //     return b.point - a.point;
        // });

        // var record = new Object();
        // record.name = "record";
        // record.rankEndNums = parm.rankEndNums + 1;
        // record.openid = openid;
        // record.activeId = data.data.activeId;
        // record.list = list_rank;
        // await cloud.db.collection("rank").insertOne(record);
        // return 1;

        // var bIsDebug = false;
        // var debugAccessToken=null;
        // const findData1 = await context.cloud.db.collection("debug").find({uuid:10001});
        // if (findData1.length > 0) //存在旧的
        // {
        //     bIsDebug = findData1[0].debug;
        //     debugAccessToken = findData1[0].accessToken;
        // }
        // //console.log(`1------------------->>>(${JSON.stringify(context)})`);
        // const resposeData = await context.cloud.topApi.invoke({
        //     api: 'taobao.user.seller.get',
        //     data: {
        //         'fields': 'user_id,nick,vip_info',
        //         'session': debugAccessToken //测试时候填商家授权acccessToken
        //     },
        //     autoSession: !bIsDebug  //测试时候填false
        // });
        // console.log("---3003----",resposeData);

        // var curTime = new Date().getTime();
        // for(var i = 0; i < 20; i++){
        //     var robot = new Object();
        //     robot.openid = openid;
        //     robot.activeId = "aWtLhoVDvCNkLQXqUtg7";
        //     robot.name = "robot";
        //     robot.type = parseInt(Math.random() * 2) + 1;
        //     robot.point = 0;
        //     robot.nameId = parseInt(Math.random() * 600) + 1;
        //     robot.headId = parseInt(Math.random() * 2248) + 1;
        //     robot.updateTime = curTime;
        //     await cloud.db.collection("rank").insertOne(robot);
        // }

        
        //导出 活动数据 ULpUCOZVDdRP7X0fHJIq
        //  时间段 
        // var activeId = data.data.activeId;
        // var timeData = new Date();
        // var year = timeData.getFullYear();
        // var month = timeData.getMonth() + 1;
        // month = data.data.month;
        // month = month < 10 ? "0" + month : month;
        // var day = timeData.getDate();
        // // day -= 1;
        // day = data.data.day;
        // day = day < 10 ? "0" + day : day;
        // var s_sTime = "" + year + "-" + month + "-" + day + " " + "00:00:00";
        // var s_eTime = "" + year + "-" + month + "-" + day + " " + "23:59:59";
        // // let sTime = Number(data.data.sTime);
        // // let eTime = Number(data.data.eTime);
        // var sTime = new Date(s_sTime).getTime();
        // var eTime = new Date(s_eTime).getTime();

        // var retData = new Object();

        // var findData = await cloud.db.collection("activityRecord").find({
        //     //openid: openid,
        //     activeId: activeId,
        //     sTime: {$gte: sTime},
        //     eTime: {$lte: eTime},
        // });
        // if(isRetError(findData)){
        //     return PackReturn(-2,"获取数据失败");
        // }
        // retData.time = "" + year + "-" + month + "-" + day;
        // retData.attentionNums = 0;            //总关注人数
        // retData.consumeNums = 0;              //消费人数
        // retData.consumeTotal = 0;             //消费总额
        // retData.register = 0;                 //新人人数
        // retData.fans = 0;                     //新增粉丝
        // retData.vipNums = 0;                  //新增vip数量
        // retData.joinNums = 0;                 //进入游戏次数
        // retData.joinTime = 0;                 //活跃时长
        // retData.redBagNums = 0;               //领奖数量
        // retData.grabPlayerNums = 0;           //抢红包人数
        // retData.rankOpenNums = 0;             //排行榜打开次数
        // retData.rankPlayerNums = 0;           //排行榜领奖人数
        // retData.rankRewardNums = 0;           //排行榜领奖次数
        // retData.taskDoneNums = 0;             //任务完成数
        // retData.taskDonePlayers = 0;          //任务完成人数
        // retData.shareNums = 0;                //分享数量
        // retData.sharePlayers = 0;             //分享人数
        // retData.activeNums = 0;               //活跃人数
        // retData.shareRegisterNums = 0;        //分享新增
        // retData.shareEnterNums = 0;           //分享活跃
        // for(var i = 0; i < findData.length; i++){
        //     var model = findData[i];
        //     retData.attentionNums += model.attentionNums;
        //     retData.consumeNums += model.consumeNums;
        //     retData.consumeTotal += model.consumeTotal;
        //     // retData.register += model.register;
        //     retData.fans += model.fans;
        //     retData.vipNums += model.vipNums;
        //     retData.joinNums += model.joinNums;
        //     retData.joinTime += model.joinTime;
        //     retData.redBagNums += model.redBagNums;
        //     retData.grabPlayerNums += model.grabPlayerNums;
        //     retData.rankOpenNums += model.rankOpenNums;
        //     retData.rankPlayerNums += model.rankPlayerNums;
        //     retData.rankRewardNums += model.rankRewardNums;
        //     retData.taskDoneNums += model.taskDoneNums;
        //     retData.taskDonePlayers += model.taskDonePlayers;
        //     retData.shareNums += model.shareNums;
        //     retData.sharePlayers += model.sharePlayers;
        //     retData.shareRegisterNums += model.shareRegisterNums;
        //     retData.shareEnterNums += model.shareEnterNums;
        // }
        // //统计新增数量
        // let addResult = await cloud.db.collection("join").find({
        //     //openid: openid,
        //     activeId: activeId,
        //     createTime: {
        //        $gte: sTime,
        //        $lte: eTime
        //     }
        //  }, {
        //     projection: {
        //        userOpenId: 1
        //     }
        //  });
        //  retData.register = addResult.length;
        // //统计 活跃人数
        // var findActive = await cloud.db.collection("join").find({
        //     //openid: openid,
        //     activeId: activeId,
        //     stampTime: {
        //         $gte: sTime,
        //         $lte: eTime
        //     },
        // },{
        //     projection: {
        //         userOpenId: 1
        //     }
        // });
        // if(isRetError(findActive)){
        //     return PackReturn(-2,"获取数据失败1");
        // }else{
        //     //活跃人数 去重
        //     // if(findActive.length > 0){
        //     //     var newList = new Set();
        //     //     for(var i = 0; i < findActive.length; i++){
        //     //         newList.add(findActive[i].userOpenId);
        //     //     }
        //     //     newList.forEach((a,b)=>{
        //     //         retData.activeNums += 1;
        //     //     });
        //     // }else{
        //     //     retData.activeNums = findActive.length;
        //     // }
        //     retData.activeNums = findActive.length;
        // }
        // return PackReturn(code,message,retData);

        //排行榜数据 week  ULpUCOZVDdRP7X0fHJIq
        // var total_list_rank = [];
        // var list_count = 0;
        // const ret = await cloud.db.collection("players").find(
        //     {  
        //         //openid: openid,
        //         activeId: "ULpUCOZVDdRP7X0fHJIq",
        //         point: {$gt: 0} 
        //     }, 
        //     {  
        //         //预留字段 1：玩家昵称 2：头像 3：金币数
        //         projection: {nickName: 1,headUrl: 1,point: 1,userOpenId: 1}, 
        //         sort: {point: -1}
        //     }
        // )
        // if(isRetError(ret) || ret.length <= 0){
            
        // }else{
        //     for(var i = 0; i < ret.length; i++){
        //         list_count += 1;
        //         total_list_rank.push(ret[i]);
        //     }
        // }
        // var findAIData = await cloud.db.collection("rank").find({
        //     //openid: openid,
        //     activeId: "ULpUCOZVDdRP7X0fHJIq",
        //     name: "robot",
        //     point: {$gt: 0}
        // },{
        //     sort: {
        //         point: -1
        //     }
        // });
        // if(isRetError(findAIData) || findAIData.length <= 0){
            
        // }else{
        //     for(var i = 0; i < findAIData.length; i++){
        //         list_count += 1;
        //         total_list_rank.push(findAIData[i]);
        //     }
        // }
        // total_list_rank.sort((a,b)=>{
        //     return b.point - a.point;
        // });

        // return PackReturn(code,message,total_list_rank);

        // var aaaa = await cloud.db.collection("rank").find({
        //     activeId: "ULpUCOZVDdRP7X0fHJIq",
        //     name: "robot"
        // });
        // console.log("aaaa: ",aaaa.length);
        // if(isRetError(aaaa)){
        //     return false;
        // }
        // for(var i = 0;i < aaaa.length; i++){
        //     var i_data = aaaa[i];
        //     var i_point = i_data.point;
        //     var i_curPoint = i_point / 10;
        //     await cloud.db.collection("rank").updateMany({
        //         _id: i_data._id,
        //     },{
        //         $set: {
        //             point: i_curPoint
        //         }
        //     });
        // }

        //查询单个活动的活跃
        // 1611763200000 
        // 1611849599999 
        // stampTime: {$gte: 1611763200000},
        // stampTime: {$lte: 1611849599999},
        // stampTime: {
        //     $gte: 1611763200000,
        //     $lte: 1611849599999
        // }
        // var findActive = await cloud.db.collection("join").find({
        //     //openid: openid,
        //     activeId: "4X7aaPD8m5yY0gTWpHGo",
        //     stampTime: {$gte: 1611763200000},
        //     stampTime: {$lte: 1611849599999},
        // },{
        //     projection: {
        //         stampTime: 1,
        //         userOpenId: 1,
        //         time: 1,
        //         activeName: 1
        //     }
        // });
        // if(isRetError(findActive)){
        //     return PackReturn(-2,"获取数据失败1");
        // }else{
        //     //活跃人数 去重
        //     console.log("findActive.length: ",findActive.length);
        //     var num = 0;
        //     if(findActive.length > 0){
        //         var newList = new Set();
        //         for(var i = 0; i < findActive.length; i++){
        //             newList.add(findActive[i].userOpenId);
        //         }
        //         newList.forEach((a,b)=>{
        //             num += 1;
        //         });
        //     }
        //     console.log("num: ",num);
        //     console.log("findActive: ",findActive);
        // }

        //获取活动数据
        // let sTime = Number(data.data.sTime);
        // let eTime = Number(data.data.eTime);

        // var retData = new Object();

        // var findData = await cloud.db.collection("activityRecord").find({
        //     //openid: openid,
        //     activeId: data.data.activeId,
        //     sTime: {$gte: sTime},
        //     eTime: {$lte: eTime},
        // });
        // if(isRetError(findData)){
        //     return PackReturn(-2,"获取数据失败");
        // }
        // var s_sTime = new Date(sTime).toLocaleString();
        // var s_eTime = new Date(eTime).toLocaleString();

        // retData.sTime = s_sTime;
        // retData.eTime = s_eTime;
        // retData.attentionNums = 0;            //总关注人数
        // retData.consumeNums = 0;              //消费人数
        // retData.consumeTotal = 0;             //消费总额
        // retData.register = 0;                 //新人人数
        // retData.fans = 0;                     //新增粉丝
        // retData.vipNums = 0;                  //新增vip数量
        // retData.joinNums = 0;                 //进入游戏次数
        // retData.joinTime = 0;                 //活跃时长
        // retData.redBagNums = 0;               //领奖数量
        // retData.grabPlayerNums = 0;           //抢红包人数
        // retData.rankOpenNums = 0;             //排行榜打开次数
        // retData.rankPlayerNums = 0;           //排行榜领奖人数
        // retData.rankRewardNums = 0;           //排行榜领奖次数
        // retData.taskDoneNums = 0;             //任务完成数
        // retData.taskDonePlayers = 0;          //任务完成人数
        // retData.shareNums = 0;                //分享数量
        // retData.sharePlayers = 0;             //分享人数
        // retData.activeNums = 0;               //活跃人数
        // retData.shareRegisterNums = 0;        //分享新增
        // retData.shareEnterNums = 0;           //分享活跃

        // for(var i = 0; i < findData.length; i++){
        //     var model = findData[i];
        //     retData.attentionNums += model.attentionNums;
        //     retData.consumeNums += model.consumeNums;
        //     retData.consumeTotal += model.consumeTotal;
        //     // retData.register += model.register;
        //     retData.fans += model.fans;
        //     retData.vipNums += model.vipNums;
        //     retData.joinNums += model.joinNums;
        //     retData.joinTime += model.joinTime;
        //     retData.redBagNums += model.redBagNums;
        //     retData.grabPlayerNums += model.grabPlayerNums;
        //     retData.rankOpenNums += model.rankOpenNums;
        //     retData.rankPlayerNums += model.rankPlayerNums;
        //     retData.rankRewardNums += model.rankRewardNums;
        //     retData.taskDoneNums += model.taskDoneNums;
        //     retData.taskDonePlayers += model.taskDonePlayers;
        //     retData.shareNums += model.shareNums;
        //     retData.sharePlayers += model.sharePlayers;
        //     retData.shareRegisterNums += model.shareRegisterNums;
        //     retData.shareEnterNums += model.shareEnterNums;
        // }
        // //统计新增数量
        // let addResult = await cloud.db.collection("join").find({
        //     //openid: openid,
        //     activeId: data.data.activeId,
        //     createTime: {
        //        $gte: sTime,
        //        $lte: eTime
        //     }
        //  }, {
        //     projection: {
        //        userOpenId: 1
        //     }
        //  });
        //  if(isRetError(addResult)){
        //     return PackReturn(-2,"获取数据失败0");
        //  }else{
        //     retData.register = addResult.length;
        //  }
        // //统计 活跃人数
        // var findActive = await cloud.db.collection("join").find({
        //     //openid: openid,
        //     activeId: data.data.activeId,
        //     stampTime: {
        //         $gte: sTime,
        //         $lte: eTime
        //     }
        // },{
        //     projection: {
        //         userOpenId: 1
        //     }
        // });
        // if(isRetError(findActive)){
        //     return PackReturn(-2,"获取数据失败1");
        // }else{
        //     //活跃人数 去重
        //     retData.activeNums = findActive.length;
        // }
        // return PackReturn(code,message,retData);

        //美的ai数据 清0
        // await cloud.db.collection("rank").updateMany({
        //     activeId: data.data.activeId, 
        // },{
        //     $set: {
        //         point: 0
        //     }
        // });

        //筛选埋点 数据
        // var retData = new Object();
        // var sTime = data.data.sTime;
        // var eTime = data.data.eTime;
        // //活跃人数
        // var findActive = await cloud.db.collection("join").find({
        //     //openid: openid,
        //     activeId: data.data.activeId,
        //     stampTime: {
        //         $gte: sTime,
        //         $lte: eTime
        //     }
        // },{
        //     projection: {
        //         userOpenId: 1
        //     }
        // });
        // if(isRetError(findActive)){
        //     return PackReturn(-2,"获取数据失败1");
        // }else{
        //     retData.activeNums = findActive.length;
        // }
        
        // //筛选出不同的 埋点数据
        // var list_bury = ["loadingRes","enterGame","enterHall","joinFavor","joinMember"];
        // var key1 = ["loadingNums","enterGameNums","enterHallNums","joinFavorNums","joinMemberNums"];
        // var key2 = ["loadingPlayers","enterGamePlayers","enterHallPlayers","joinFavorPlayers","joinMemberPlayers"];
        // //初始化 type类型数据
        // for(var x = 0; x < list_bury.length; x++){
        //     if(list_bury[x] == "loadingRes" || list_bury[x] == "enterHall"){
        //         continue;
        //     }
        //     for(var y = 0; y < 3; y++){
        //         retData["" + list_bury[x] + "_type_" + y] = 0;
        //     }
        // }
        // for(var x = 0; x < list_bury.length; x++){
        //     //筛选出人数
        //     var findBuryData = await cloud.db.collection("bury").find({
        //         activeId: data.data.activeId,
        //         time: {
        //             $gte: sTime,
        //             $lte: eTime
        //         },
        //         action: list_bury[x]
        //     });
        //     if(isRetError(findBuryData)){
        //         return PackReturn(-2,"获取数据失败")
        //     }
        //     var list_user = [];
        //     for(var i = 0;i < findBuryData.length; i++){
        //         //筛选类型
        //         if(findBuryData[i].hasOwnProperty("type")){
        //             if(retData.hasOwnProperty("" + list_bury[x] + "_type_" + findBuryData[i].type)){
        //                 retData["" + list_bury[x] + "_type_" + findBuryData[i].type] += 1;
        //             }else{
        //                 retData["" + list_bury[x] + "_type_" + findBuryData[i].type] = 1;
        //             }
        //         }else{
        //             if(retData.hasOwnProperty("" + list_bury[x] + "_type_undefined")){
        //                 retData["" + list_bury[x] + "_type_undefined"] += 1;
        //             }else{
        //                 retData["" + list_bury[x] + "_type_undefined"] = 1;
        //             }
        //         }
        //         if(list_user.length == 0){
        //             list_user.push(findBuryData[i].userOpenId);
        //         }else{
        //             //去重
        //             var isGet = false;
        //             for(var k = 0; k < list_user.length; k++){
        //                 if(list_user[k] == findBuryData[i].userOpenId){
        //                     isGet = true;
        //                     break;
        //                 }
        //             }
        //             if(!isGet){
        //                 list_user.push(findBuryData[i].userOpenId);
        //             }
        //         }
        //     }
        //     retData["" + key2[x]] = list_user.length;
        //     //筛选次数
        //     retData["" + key1[x]] = findBuryData.length;
        // }
        
        // //loading 和 enterHall数据
        // retData.loadingNums = 0;
        // retData.loadingPlayers = 0;
        // retData.enterHallNums = 0;
        // retData.enterHallPlayers = 0;
        
        
        // //任务数据
        // retData.task_0 = 0;
        // retData.task_1 = 0;
        // retData.task_2 = 0;
        // retData.task_3 = 0;
        // retData.task_4 = 0;
        // retData.task_5 = 0;
        // retData.task_6 = 0;
        // retData.task_7 = 0;
        // retData.task_8 = 0;
        // retData.task_9 = 0;
        // retData.task_10 = 0;
        // retData.task_11 = 0;

        // var findRecordData = await cloud.db.collection("activityRecord").find({
        //     activeId: data.data.activeId,
        //     sTime: {$gte: sTime},
        //     eTime: {$lte: eTime}
        // });
        // if(isRetError(findRecordData)){
        //     return PackReturn(-2,"获取记录失败");
        // }
        
        // for(var i = 0; i < findRecordData.length; i++){
        //     retData.loadingNums += findRecordData[i].loadingNums;
        //     retData.loadingPlayers += findRecordData[i].loadingPlayers;
        //     retData.enterHallNums += findRecordData[i].enterHallNums;
        //     retData.enterHallPlayers += findRecordData[i].enterHallPlayers;

        //     for(var k = 0; k < 12; k++){
        //         if(findRecordData[i].hasOwnProperty("task_" + k)){
        //             retData["task_" + k] += findRecordData[i]["task_" + k];
        //         }
        //     }
        // }
        // //筛选出 总粉丝数
        // var findFansData = await cloud.db.collection("players").find({
        //     activeId: data.data.activeId,
        //     stampTime: {
        //         $gte: sTime,
        //         $lte: eTime
        //     },
        //     isVip: true
        // });
        // if(isRetError(findFansData)){
        //     return PackReturn(-2,"获取粉丝数据失败");
        // }
        // retData.fansNums = findFansData.length;
        // //筛选出 会员数
        // var findMemberData = await cloud.db.collection("players").find({
        //     activeId: data.data.activeId,
        //     stampTime: {
        //         $gte: sTime,
        //         $lte: eTime
        //     },
        //     isMember: true
        // });
        // if(isRetError(findMemberData)){
        //     return PackReturn(-2,"获取粉丝数据失败");
        // }
        // retData.memberNums = findMemberData.length;
        // return PackReturn(code,message,retData);

        // var time = "" + new Date().getTime();
        // var ret = await cloud.db.collection("players").updateMany({
        //     curSeason: {$gt: 0},
        //     activeId: "4X7aaPD8m5yY0gTWpHGo"
        //     },{
        //         $set: {
        //             dayUpdateTime: time,
        //             rewardTimes_free: 0,   //领免费券已领奖次数
        //             rewardTimes_challenge: 0, //炸弹挑战已领奖次数
        //             rewardTimes_share: 0,     //邀请好友已领奖次数
        //             rewardTimes_live: 0,	  //访问直播间已领奖次数
        //             rewardTimes_lookGoods: 0, //浏览商品已领奖次数
        //             rewardTimes_buy: 0,       //我要买买买已购买合集
        //             rewardTimes_memberFree: 0,//会员福利 每天领三次
        //             rewardTimes_collectGoods: 0,//收藏商品次数
        //             rewardTimes_dayReward: 0, //每日奖励
        //             rewardTimes_playGame: 0,  //每日进入次数
                    
        //             count_challenge: 0,			//炸弹挑战次数
        //             count_share: 0,				//分享次数
        //             count_look: 0,              //浏览商品数量
        //             "invitationInfo.isRegister": false,
        //             "invitationInfo.nickName": "",
        //             "invitationInfo.headUrl": "",
        //             "invitationInfo.coin": 0,  
        //             "fromInfo.nickName": "",
        //             "fromInfo.headUrl": "",
        //             inviteList: []
        //         }
        //     }
        // );
        // if(isRetError(ret)){
        //     return JSON.stringify({code:-4,message:"失败",ret});
        // }
        // return JSON.stringify({code:0,message:"成功"});

        // var findPlayers = await cloud.db.collection("players").find({
        //     dayUpdateTime: 1612761208933,
        //     stampTime: {$lt: 1612761208933}
        // },{
        //     projection: {
        //         rewardTimes_free: 1,
        //         rewardTimes_challenge: 1,
        //         rewardTimes_memberFree: 1,
        //         rewardTimes_collectGoods: 1,
        //         rewardTimes_dayReward: 1,
        //         userOpenId: 1
        //     }
        // });
        // console.log("findPlayers: ",findPlayers.length);
        // var misNum = 0;
        // var misList = [];
        // for(var i = 0; i < findPlayers.length; i++){
        //     if(findPlayers[i].rewardTimes_free > 0){
        //         misNum += 1;
        //         continue;
        //     }
        //     if(findPlayers[i].rewardTimes_challenge > 0){
        //         misNum += 1;
        //         continue;
        //     }
        //     if(findPlayers[i].rewardTimes_memberFree > 0){
        //         misNum += 1;
        //         continue;
        //     }
        //     if(findPlayers[i].rewardTimes_collectGoods > 0){
        //         misNum += 1;
        //         misList.push(findPlayers[i].userOpenId);
        //         continue;
        //     }
        //     if(findPlayers[i].rewardTimes_dayReward > 0){
        //         misNum += 1;
        //         continue;
        //     }
        // }
        // console.log("misNUm: ",misNum);
        // console.log("misList: ",misList);

        //统计新增数量
        // var sTime = 1612108800000;
        // var eTime = 1614095999000;
        // let addResult = await cloud.db.collection("players").find({
        //     //openid: openid,
        //     activeId: data.data.activeId,
        //  }, {
        //     projection: {
        //         userOpenId: 1
        //     }
        //  });
        //  if(isRetError(addResult)){
        //     return PackReturn(-2,"获取数据失败0");
        //  }
        //  console.log("activeId: ",data.data.activeId);
        //  console.log("美的总共人数： ",addResult.length);
        //统计 活跃人数
        // var findActive = await cloud.db.collection("join").find({
        //     //openid: openid,
        //     activeId: data.data.activeId,
        //     stampTime: {
        //         $gte: sTime,
        //         $lte: eTime
        //     }
        // },{
        //     projection: {
        //         userOpenId: 1,
        //     }
        // });
        // if(isRetError(findActive)){
        //     return PackReturn(-3,"获取数据失败2");
        // }


        // var list_lose = [];
        // var num_1 = 0;
        // var num_2 = 0;
        // for(var i = 0; i < addResult.length; i++){
        //     var isGet = false;
        //     for(var k = 0; k < findActive.length; k++){
        //         if(addResult[i].userOpenId == findActive[k].userOpenId){
        //             isGet = true;
        //         }
        //     }
        //     if(isGet){
        //         num_1 += 1;
        //     }else{
        //         num_2 += 1;
        //         list_lose.push(addResult[i]);
        //     }
        // }
        // console.log("num_1: ",num_1);
        // console.log("num_2: ",num_2);
        // for(var i = 0; i < 10; i++){
        //     console.log("lost: ",list_lose[i]);
        // }
        //  var sTime = data.data.sTime;
        //  var eTime = data.data.eTime;
        // var findJoinData = await cloud.db.collection("join").count({
        //     // openid: t_activity.openid,
        //     activeId: data.data.activeId,
        //     stampTime: {
        //         $gte: sTime,
        //         $lte: eTime
        //     },
        // });
        // console.log("findJoinData: ",findJoinData);
        //  var sTime = data.data.sTime;
        //  var eTime = data.data.eTime;
        // var count = await cloud.db.collection("join").aggregate([
        //     {
        //       $match: {
        //             createTime: { $gte:sTime , $lte:eTime },
        //             activeId:data.data.activeId
        //        }
        //     },
        //     {
        //       $group: {
        //         _id: "$userOpenId",
        //         count: { $sum: 1 }
        //       }
        //     }
        // ]);
        // console.log("count: ",count);

        // var joinNums = findJoinData.length;
        // if(joinNums >= Number(t_activity.rankRewardConfig.openNums)){
        //     record.isOpenReward = true;
        // }else{
        //     record.isOpenReward = false;
        // }

        //  var sTime = data.data.sTime;
        //  var eTime = data.data.eTime;
        // var enterGameNums = await cloud.db.collection("bury").count({
        //     //openid: openid,
        //     activeId: data.data.activeId,
        //     stampTime: {
        //         $gte: sTime,
        //         $lte: eTime
        //     },
        //     action: "enterGame"
        // });
        // console.log("enterGameNums: ",enterGameNums);
        // activeId: "fFJNdLVNFFOo3EqQgxyF"

        //修正 中奖列表中 没有淘宝名情况
        // var findTBNameData = await cloud.db.collection("winner").find({
        //     isWinner: true,
        //     isShip: 0,
        //     tbName: ""
        // });
        // console.log("findTBNameData: ",findTBNameData.length);
        // for(var i = 0; i < findTBNameData.length; i++){
        //     // if(findTBNameData[i].hasOwnProperty("tbName")){
        //     //     if(findTBNameData[i].tbName != "") continue;
        //     // }
        //     var findPlayer = await cloud.db.collection("players").find({
        //         activeId: findTBNameData[i].activeId,
        //         userOpenId: findTBNameData[i].userOpenId
        //     });
        //     console.log("findPlayer: ",findPlayer.length);
        //     if(isRetError(findPlayer) || findPlayer.length <= 0){
        //         continue;
        //     }
        //     console.log("nickName: ",findPlayer[0].nickName);
        //     await cloud.db.collection("winner").updateMany({
        //         isWinner: true,
        //         userOpenId: findTBNameData[i].userOpenId
        //     },{
        //         $set: {
        //             tbName: findPlayer[0].nickName
        //         }
        //     });
        // }


      // let _sql = {
      //    activeId: data.data.activeId,
      // }
      // if (data.data.isMember !== '') {
      //    _sql['isMember'] = data.data.isMember
      // }
      // if (data.data.memberLv !== '') {
      //    _sql['memberLv'] = data.data.memberLv
      // }
      // if (data.data.isInBackList !== '') {
      //    _sql['isInBackList'] = data.data.isInBackList
      // }
      // if (data.data.nickName !== '') {
      //    _sql['nickName'] = data.data.nickName
      // }
      // console.log("_sql: ",_sql);
      // if (data.data.type == 'total') {
      //    let result = await cloud.db.collection('players').count({
      //       activeId: data.data.activeId
      //    });
      //    if (isRetError(result)) {
      //       return PackReturn(-2, "获取用户数据失败");
      //    }
      //    return PackReturn(code, message, result);
      // } else if (data.data.type == "search") {
      //    var playerData = await cloud.db.collection("players").find(_sql, {
      //       projection: {
      //          userOpenId: 1,
      //          nickName: 1,
      //          isMember: 1,
      //          memberLv: 1,
      //          userCoin: 1,
      //          point: 1,
      //          openRedNum: 1,
      //          buyNum: 1,
      //          buyCost: 1,
      //          shareNum: 1,
      //          count_invitation: 1,
      //          taskDoneCount: 1,
      //          createTime: 1,
      //          isInBackList: 1,
      //          activeId: 1,
      //       },
      //       sort: { createTime: -1 },
      //       // limit: data.data.limit,
      //       // skip: data.data.skip
      //    });

      //    if (isRetError(playerData)) {
      //       return PackReturn(-2, "获取用户数据失败");
      //    }
      //    return PackReturn(code, message, playerData);
      // } else {
      //    var playerData = await cloud.db.collection("players").find(_sql, {
      //       projection: {
      //          userOpenId: 1,
      //          nickName: 1,
      //          isMember: 1,
      //          memberLv: 1,
      //          userCoin: 1,
      //          point: 1,
      //          openRedNum: 1,
      //          buyNum: 1,
      //          buyCost: 1,
      //          shareNum: 1,
      //          count_invitation: 1,
      //          taskDoneCount: 1,
      //          createTime: 1,
      //          isInBackList: 1,
      //          activeId: 1,
      //       },
      //       sort: { createTime: -1 },
      //       limit: data.data.limit,
      //       skip: data.data.skip
      //    });
      //    console.log("playerData: ",playerData.length);
      //    if (isRetError(playerData)) {
      //       return PackReturn(-2, "获取用户数据失败");
      //    }
      //    return PackReturn(code, message, playerData);
      // }

      //测试 isRetError
    //   var retData = await cloud.db.collection("test").find({
    //      test: true
    //   });

    //   console.log("retData: ",retData);
    //   console.log("retData: ",!retData);
    //   if(isRetError(retData)){
    //      console.log("error");
    //   }else{
    //      console.log("no error");
    //   }

        //处理会员、粉丝数 记录
        // var joinData = await cloud.db.collection("join").find({
        //     activeId: ""
        // });
        // var findData1 = await cloud.db.collection("winner").count({
        //     activeId: "QAhWBBg9TMTPT25NZA5E",
        //     "rewardInfo.type": "1"
        // });
        // console.log("findData1: ",findData1);
        // var findData2 = await cloud.db.collection("winner").count({
        //     activeId: "QAhWBBg9TMTPT25NZA5E",
        //     "rewardInfo.type": "2"
        // });
        // console.log("findData2: ",findData2);
        // var findData3 = await cloud.db.collection("winner").count({
        //     activeId: "QAhWBBg9TMTPT25NZA5E",
        //     "rewardInfo.type": "3"
        // });
        // console.log("findData3: ",findData3);

        //导出zhengliu数据 8etHObiXjRlzHejseKZk
        //z粉 z1f3JWeFBVMCEm1iMcvk
        // var findData = await cloud.db.collection("rankRecord").find({
        //     activeId: "z1f3JWeFBVMCEm1iMcvk",
        //     rankEndNums: 1
        // },{
        //     projection: {
        //         rewardList: 1
        //     }
        // });
        // var rewardList = findData[0].rewardList;
        // var list = [];
        // for(var i = 0; i < rewardList.length; i++){
        //     if(rewardList[i].hasOwnProperty("userOpenId")){
        //         list.push({
        //             userOpenId: rewardList[i].userOpenId,
        //             nickName: rewardList[i].nickName,
        //             rewardType: rewardList[i].rewardType
        //         });
        //     }   
        // }
        // return PackReturn(code,message,list);
        //z粉 获奖记录
        var findData1 = await cloud.db.collection("winner").find({
            activeId: "z1f3JWeFBVMCEm1iMcvk",
            "rewardInfo.type": "1"
        });
        console.log("findData1: ",findData1.length);
        var findData2 = await cloud.db.collection("winner").find({
            activeId: "z1f3JWeFBVMCEm1iMcvk",
            "rewardInfo.type": "2"
        });
        console.log("findData2: ",findData2.length);
        var findData3 = await cloud.db.collection("winner").find({
            activeId: "z1f3JWeFBVMCEm1iMcvk",
            "rewardInfo.type": "3"
        });
        console.log("findData3: ",findData3.length);
    // } catch (e) {
    //     return PackReturn(-4,"catch失败",e);
    // }
}
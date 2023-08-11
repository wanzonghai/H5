
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
//请求玩家数据
module.exports = async (context) =>{
    console.log("==1000==");
    try {
        var data = context.data.data;
        console.log("==data==",data);
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        const miniappId = context.miniappId;
        const sourceMiniAppId = context.sourceMiniAppId;
        console.log("openid: ",openid);
        console.log("userOpenId: ",userOpenId);
        console.log("activeId: ",data.data.activeId);
        //获取任务配置
        var findListTask = await cloud.db.collection("listTask").find({
            name: "listTask"
        });
        if(isRetError(findListTask)){
            return PackReturn(-2,"获取数据失败0")
        }
        var taskConfig = findListTask[0].task;
        const findData = await cloud.db.collection("users").find({ 
            //openid: openid,
            activeId: data.data.activeId,
            state: true
        });
        if(isRetError(findData) || findData.length <= 0){
            return PackReturn(-1,"获取数据失败");
        }
        //查到最新正在开放得活动
        var parm = findData[0];
        var retData = new Object();
        //检测活动到期
        var time = new Date();
        var curTime = time.getTime();
        if(parm.hasOwnProperty("eTime")){
            if(parm.eTime <= curTime){
                // return PackReturn(-1,"活动到期");
                //活动结束  加个字段
                retData.isActiveOver = true;
            }else{
                retData.isActiveOver = false;
            }
        }else{
            retData.isActiveOver = false;
        }
        var fromId = data.data.fromId;
        retData.gameConfig = {};
        
        var inviteConfig = null;
        //店铺商户id
        retData.shopId = parm.shopId;
        //vivo定制
        if(retData.shopId == 0){
            retData.shopId = 883737303;
        }
        //店铺id
        if(parm.hasOwnProperty("storeId")){
            retData.storeId = parm.storeId;
        }else{
            //获取店铺id
            // var bIsDebug = false;
            // var debugAccessToken=null;
            // const findData1 = await context.cloud.db.collection("debug").find({uuid:10001});
            // console.log("findData1: ",findData1);
            // if (findData1.length > 0) //存在旧的
            // {
            //     bIsDebug = findData1[0].debug;
            //     debugAccessToken = findData1[0].accessToken;
            // }
            //获取店铺信息
            // const retShopData = await context.cloud.topApi.invoke({
            //     api: "taobao.shop.seller.get",
            //     data: {
            //         "fields": 'sid,title,pic_path',
            //         'session': debugAccessToken //测试时候填商家授权acccessToken
            //     },
            //     autoSession: !bIsDebug  //测试时候填false
            // });
            // console.log("retShopData: ",retShopData);
            // if(isRetError(retShopData)){

            // }else{
            //     retData.storeId = retShopData.shop.sid;
            // }
            retData.storeId = 0;
        }
        //vivo定制
        retData.storeId = 71799145;
        retData.openid = parm.creatorId;
        retData.userOpenId = userOpenId;
        retData.activeId = parm.activeId;
        retData.isVipControl = parm.isVipControl;
        retData.isVipSystem = parm.isVipSystem;
        retData.activeType = parm.activeType;
        retData.gameConfig = parm.gameConfig;
        retData.bouncedConfig = parm.bouncedConfig;
        
        //活动开始时间
        if(parm.hasOwnProperty("sTime")){
            retData.sTime = parm.sTime;
        }
        //活动结束时间
        if(parm.hasOwnProperty("eTime")){
            retData.eTime = parm.eTime;
        }
        //兼容老配置 （谈子3-3定的规则 newUserCoin = 2 * userCoin）
        //获取表中邀请任务配置
        var bTaskConfig = null;
        if(parm.gameConfig.hasOwnProperty("missionConfig")){
            for(var i = 0; i < parm.gameConfig.missionConfig.length; i++){
                if(parm.gameConfig.missionConfig[i].id == 2){
                    bTaskConfig = parm.gameConfig.missionConfig[i];
                    break;
                }
            }
        }
        if(bTaskConfig){
            // inviteConfig = {
            //     "newUserCoin": bTaskConfig.rewardCount * 2,
            //     "userCoin": bTaskConfig.rewardCount
            // };
            inviteConfig = {
                "newUserCoin": bTaskConfig.rewardCount_1 * 2,
                "userCoin": bTaskConfig.rewardCount_1
            };
        }else{
            var curModel = null;
            for(var i = 0; i < taskConfig.length; i++){
                if(taskConfig[i].title == "邀请好友"){
                    curModel = taskConfig[i];
                    break;
                }
            }
            //0: daily 1:pullNew 2:trans
            var activeTypeIdx = 0;
            if(parm.hasOwnProperty("activeType")){
                if(parm.activeType == "pullNew"){
                    activeTypeIdx = 1;
                }else if(parm.activeType == "trans"){
                    activeTypeIdx = 2;
                }else{
                    activeTypeIdx = 0;
                }
            }else{
                //默认日常促活
                activeTypeIdx = 0;
            }
            if(curModel){
                // var listRewardCount = JSON.parse(curModel["rewardCount"]);
                // var rewardCount = listRewardCount[activeTypeIdx];
                // retData.gameConfig.inviteConfig = {
                //     "newUserCoin": rewardCount * 2,
                //     "userCoin": rewardCount
                // };
                retData.gameConfig.inviteConfig = {
                    "newUserCoin": curModel.rewardCount_1 * 2,
                    "userCoin": curModel.rewardCount_1
                };
                inviteConfig = retData.gameConfig.inviteConfig;
            }
        }
        
        // B端到期,C无法进去的状态  true: 过期 false: 未过期
        if(parm.hasOwnProperty("expired")){
            retData.expired = parm.expired 
        }else{
            retData.expired = false;
        }
        
        //任务配置
        var findTaskData = await cloud.db.collection("task").find({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        });
        if(isRetError(findTaskData)){
            return PackReturn(-2,"获取数据失败2");
        }
        if(findTaskData.length <= 0){
            //新加任务表
            var newTask = new Object();
            newTask.name = "task";
            newTask.userOpenId = userOpenId;
            newTask.activeId = parm.activeId;
            newTask.activeName = parm.activeName;
            newTask.time = curTime;
            //默认配置
            newTask.task = [];
            for(var i = 0; i < taskConfig.length; i++){
                var newModel = new Object();
                newModel.id = taskConfig[i].id;
                newModel.rewardType = taskConfig[i].rewardType;
                newModel.rewardCount_1 = taskConfig[i].rewardCount_1;
                newModel.rewardCount_2 = taskConfig[i].rewardCount_2;
                newModel.limit = taskConfig[i].limit;
                newModel.type = taskConfig[i].type;
                newModel.need = taskConfig[i].need;
                newModel.finish = 0;
                newModel.get = 0;
                newModel.state = 1;
                newModel.done = 0;
                newModel.mType = taskConfig[i].mType;
                if(taskConfig[i].tType == 1){
                    //时间配置 单独处理 time默认是0
                    newModel.time = 0;
                }
                newTask.task.push(newModel);
            }
            //自定义 限制配置
            if(parm.gameConfig.hasOwnProperty("missionConfig")){
                //是否 自定义奖励配置
                for(var i = 0; i < parm.gameConfig.missionConfig.length; i++){
                    for(var k = 0; k < newTask.task.length; k++){
                        if(parm.gameConfig.missionConfig[i].id == newTask.task[k].id){
                            newTask.task[k].rewardCount_1 = parm.gameConfig.missionConfig[i].rewardCount_1;
                            newTask.task[k].rewardCount_2 = parm.gameConfig.missionConfig[i].rewardCount_2;
                            newTask.task[k].limit = parm.gameConfig.missionConfig[i].limit;
                            newTask.task[k].need = parm.gameConfig.missionConfig[i].need;
                            break;
                        }
                    }
                }
            }
            await cloud.db.collection("task").insertOne(newTask);
        }else{
            //更新任务表
            var listTask = findTaskData[0].task;
            //自定义 限制配置
            if(parm.gameConfig.hasOwnProperty("missionConfig")){
                //是否 自定义奖励配置
                for(var i = 0; i < parm.gameConfig.missionConfig.length; i++){
                    for(var k = 0; k < listTask.length; k++){
                        if(parm.gameConfig.missionConfig[i].id == listTask[k].id){
                            listTask[k].rewardCount_1 = parm.gameConfig.missionConfig[i].rewardCount_1;
                            listTask[k].rewardCount_2 = parm.gameConfig.missionConfig[i].rewardCount_2;
                            listTask[k].limit = parm.gameConfig.missionConfig[i].limit;
                            listTask[k].need = parm.gameConfig.missionConfig[i].need;
                            break;
                        }
                    }
                }
                //时间任务 刷新
                listTask.forEach((element)=>{
                    if(element.hasOwnProperty("time")){
                        if(element.time != 0){
                            //时间任务刷新
                            if(element.get >= element.limit){
                                return;
                            }else{
                                var finishTime = element.time + (element.need * 1000);
                                if(finishTime <= new Date().getTime()){
                                    element.state = 0;
                                }
                            }
                        }
                    }
                });
                await cloud.db.collection("task").updateMany({
                    activeId: data.data.activeId,
                    userOpenId: userOpenId
                },{
                    $set: {
                        task: listTask
                    }
                });
            }
        }


        var isRegister = false;
        var isFromShare = false;
        var isNewInvite = true;
        //新家 玩家数据
        var playerData = await cloud.db.collection("players").find({ 
            //openid: openid,
            userOpenId: userOpenId,
            activeId: retData.activeId
        });
        if(isRetError(playerData) || playerData.length <= 0){
            isRegister = true;
            //新增一个player
            var newPlayer = {
                dayUpdateTime: "",
                weekUpdateTime: "",
                openid: parm.creatorId,
                userOpenId: userOpenId,
                activeId: parm.activeId,
                nickName:"",
                headUrl:"",
                userCoin : 1,               //金币数量（杨磊要求改成50）
                integral : 0,               //段位
                lianshengCount : 0,         //连胜次数
                isVip : 0,                  //(0:不是, 1:是)
                isVipHistory: false,        //是否曾经关注过
                isMember: false,            //是否是会员
                isMemberHistory: false,     //是否曾经是会员
                memberLv: 0,                //会员等级
                curSeason : parm.season,   	//当前是第几赛季
                point : 0,                  //挑战券数量
                bestPoint: 0,               //最佳奖杯数
                bestRank : 0,               //最高名次
                bestSeason : parm.season,   //最高名次的赛季
                bestWin : 0,                //最高连胜
                allWin  : 0,                //总的获胜次数
                fromId: "",                 //分享来源id
                rewardTimes_free: 0,        //领免费券已领奖次数
                rewardTimes_challenge: 0,   //炸弹挑战已领奖次数
                rewardTimes_share: 0,       //邀请好友已领奖次数
                rewardTimes_live: 0,	    //访问直播间已领奖次数
                rewardTimes_lookGoods: 0,   //浏览商品已领奖次数
                rewardTimes_favor: 0,       //关注店铺已领奖次数
                rewardTimes_kgold: 0,       //氪金玩家已领奖次数
                rewardTimes_invitation: 0,  //呼朋唤友已领奖次数
                rewardTimes_buy: 0,         //我要买买买已购买合集
                rewardTimes_memberFree: 0,  //会员免费福利领取次数
                rewardTimes_member: 0,      //超级会员 领奖次数
                rewardTimes_collectGoods: 0,//收藏商铺 领奖次数
                rewardTimes_inviteReward: 0,//领取邀请好友获得年年牛次数
                rewardTimes_dayReward: 0,   //每日礼包领奖次数
                count_challenge: 0,			//任务：炸弹挑战进度
                count_share: 0,				//任务：分享进度
                count_look: 0,              //任务：浏览商品数量
                count_kgold: 0,				//任务：氪金玩家（店铺消费一次）
                count_invitation: 0,        //任务：好友从分享进入人数
                createTime: curTime,        //创建时间
                stampTime: curTime,         //登录时间
                buyNum: 0,                  //购买数量
                buyCost: 0,                 //购买花费总额
                shareNum: 0,                //分享次数
                openRedNum: 0,              //开红包数量
                rank: -1,                   //排行榜
                isInBackList: false,        //黑名单
                taskDoneCount: 0,           //任务完成次数
                fromInfo: {  
                    userOpenId: "",          //分享来源 玩家信息
                    nickName: "",
                    headUrl: ""
                },                          
                invitationInfo: {
                    isRegister: false,      //判定类型 增加金币数量不同 3 和 9
                    nickName: "",
                    headUrl: "",
                    coin: 0
                },                          //邀请成功信息（主要收集新用户）
                inviteList: [],             //邀请玩家id数组
                roleList: [0],               //玩家角色列表
                isHasReward_bag: false,      //是否有奖品包奖励
                isBuyLuckyBag: false,         //是否购买了福袋
                isDialogReward: false       //是否弹出了中奖框
            };
            retData.player = newPlayer;
            //更新 邀请人数据(目前需求 做注册邀请)
            if(fromId && fromId != userOpenId  && fromId != ""){
                isFromShare = true;
                var sharePlayerData = await cloud.db.collection("players").find({ 
                    //openid: openid,
                    userOpenId: fromId,
                    activeId: data.data.activeId
                });
                if(isRetError(sharePlayerData)){
                    console.log("未获取到分享者数据");
                }else{
                    //如果 不是新增用户时
                    var userCoin = inviteConfig.userCoin;
                    var newUserCoin = inviteConfig.newUserCoin;
                    if(sharePlayerData.length > 0){
                        var shareParm = sharePlayerData[0];
                        if(!shareParm.invitationInfo.isRegister){
                            newPlayer.fromInfo.nickName = shareParm.nickName;
                            newPlayer.fromInfo.headUrl = shareParm.headUrl;
                            newPlayer.fromInfo.userOpenId = fromId;
                            retData.player.fromInfo.nickName = shareParm.nickName;
                            retData.player.fromInfo.headUrl = shareParm.headUrl;
                            retData.player.fromInfo.userOpenId = fromId;
                            //判断是否已经邀请过 此人
                            var addCoinNum = newUserCoin;
                            if(shareParm.hasOwnProperty("inviteList")){
                                var inviteList = shareParm.inviteList;
                                for(var i = 0; i < inviteList.length; i++){
                                    if(inviteList[i] == userOpenId){
                                        isNewInvite = false;
                                        break;
                                    }
                                }
                                if(!isNewInvite){
                                    addCoinNum = 0;
                                }
                            }
                            const ret = await cloud.db.collection("players").updateMany({
                                //openid: openid,
                                userOpenId:fromId,
                                activeId: data.data.activeId
                                },{
                                    $inc: {
                                        count_invitation: 1,
                                        count_share: 1,
                                        "invitationInfo.coin": addCoinNum
                                    },
                                    $set: {
                                        "invitationInfo.isRegister": true,
                                        "invitationInfo.nickName": retData.player.nickName,
                                        "invitationInfo.headUrl": retData.player.headUrl
                                    },
                                    $addToSet: {
                                        inviteList: userOpenId
                                    }
                                }
                            );
                            if(isRetError(ret)){
                                console.log("更新分享者数据失败");
                            }
                        }else{
                            newPlayer.fromInfo.nickName = shareParm.nickName;
                            newPlayer.fromInfo.headUrl = shareParm.headUrl;
                            newPlayer.fromInfo.userOpenId = fromId;
                            retData.player.fromInfo.nickName = shareParm.nickName;
                            retData.player.fromInfo.headUrl = shareParm.headUrl;
                            retData.player.fromInfo.userOpenId = fromId;

                            //判断是否已经邀请过 此人
                            var addCoinNum = newUserCoin;
                            if(shareParm.hasOwnProperty("inviteList")){
                                var inviteList = shareParm.inviteList;
                                
                                for(var i = 0; i < inviteList.length; i++){
                                    if(inviteList[i] == userOpenId){
                                        isNewInvite = false;
                                        break;
                                    }
                                }
                                if(!isNewInvite){
                                    addCoinNum = 0;
                                }
                            }
                            await cloud.db.collection("players").updateMany({
                                //openid: openid,
                                userOpenId:fromId,
                                activeId: data.data.activeId
                                },{
                                    $inc: {
                                        count_invitation: 1,
                                        count_share: 1,
                                        "invitationInfo.coin": addCoinNum
                                    },
                                    $set: {
                                        "invitationInfo.isRegister": true,
                                        "invitationInfo.nickName": retData.player.nickName,
                                        "invitationInfo.headUrl": retData.player.headUrl
                                    },
                                    $addToSet: {
                                        inviteList: userOpenId
                                    }
                                }
                            );
                        }
                    }
                    
                }
            }
            //添加到 数据库
            await cloud.db.collection("players").insertOne(newPlayer);
            
        }else{
            if(playerData[0].isInBackList){
                return PackReturn(-11,"黑名单玩家");
            }
            retData.player = playerData[0];
            //修改登录时间
            retData.player.stampTime = curTime;
            //赛季值  同步
            retData.player.curSeason = parm.season;
            //新加字段 兼容老用户
            if(playerData[0].hasOwnProperty("rewardTimes_collectGoods")){
                retData.player.rewardTimes_collectGoods = playerData[0].rewardTimes_collectGoods;
            }else{
                retData.player["rewardTimes_collectGoods"] = 0;
            }
            if(playerData[0].hasOwnProperty("rewardTimes_inviteReward")){
                retData.player.rewardTimes_inviteReward = playerData[0].rewardTimes_inviteReward;
            }else{
                retData.player["rewardTimes_inviteReward"] = 0;
            }
            if(playerData[0].hasOwnProperty("rewardTimes_dayReward")){
                retData.player.rewardTimes_dayReward = playerData[0].rewardTimes_dayReward;
            }else{
                retData.player["rewardTimes_dayReward"] = 0;
            }
            if(playerData[0].hasOwnProperty("roleList")){
                retData.player.roleList = playerData[0].roleList;
            }else{
                retData.player["roleList"] = [0];
            }

            //如果 存在数据invitationInfo 处理
            //更新 邀请人数据(目前需求 做注册邀请)
            if(fromId && fromId != userOpenId  && fromId != ""){
                isFromShare = true;
                var sharePlayerData = await cloud.db.collection("players").find({ 
                    //openid: openid,
                    userOpenId: fromId,
                    activeId: data.data.activeId
                });
                if(isRetError(sharePlayerData)){
                    console.log("未获取到分享者数据");
                }else{
                    var userCoin = inviteConfig.userCoin;
                    var newUserCoin = inviteConfig.newUserCoin;
                    if(sharePlayerData.length > 0){
                        var shareParm = sharePlayerData[0];

                        //判断是否已经邀请过 此人
                        var addCoinNum = userCoin;
                        if(shareParm.hasOwnProperty("inviteList")){
                            var inviteList = shareParm.inviteList;
                            for(var i = 0; i < inviteList.length; i++){
                                if(inviteList[i] == userOpenId){
                                    isNewInvite = false;
                                    break;
                                }
                            }
                            if(!isNewInvite){
                                addCoinNum = 0;
                            }
                        }
                        retData.player.fromInfo.nickName = shareParm.nickName;
                        retData.player.fromInfo.headUrl = shareParm.headUrl;
                        retData.player.fromInfo.userOpenId = fromId;
                        //新邀请人 加金币
                        if(isNewInvite){
                            await cloud.db.collection("players").updateMany({
                                //openid: openid,
                                userOpenId:fromId,
                                activeId: data.data.activeId
                                },{
                                    $inc: {
                                        "invitationInfo.coin": addCoinNum,
                                    },
                                    $set: {
                                        "invitationInfo.isRegister": false,
                                        "invitationInfo.nickName": retData.player.nickName,
                                        "invitationInfo.headUrl": retData.player.headUrl   
                                    },
                                    $addToSet: {
                                        inviteList: userOpenId
                                    }
                                }
                            );
                        }
                    }
                }
            }
        }

        //更新邀请人任务(vivo版)
        console.log("isNewInvite: ",isNewInvite);
        if(isNewInvite){
            console.log("fromId: ",fromId);
            if(fromId && fromId != userOpenId  && fromId != ""){
                var  findShareTaskData = await cloud.db.collection("task").find({
                    activeId: data.data.activeId,
                    userOpenId: fromId,
                },{
                    projection: {
                        task: 1
                    }
                });
                if(isRetError(findShareTaskData) || findShareTaskData.length <= 0){
                    console.log("获取分享者任务数据失败");
                }else{
                    var shareTask = findShareTaskData[0].task;
                    var shareTask_id = 2;
                    //修改任务数据
                    var curTask = null;
                    for(var i = 0; i < shareTask.length; i++){
                        if(shareTask[i].id == shareTask_id){
                            curTask = shareTask[i];
                        }
                    }
                    if(curTask.get < curTask.limit){
                        curTask.state = 0;
                        curTask.finish += 1;
                        curTask.done += 1;
                        //更新分享人任务数据
                        var ret = await cloud.db.collection("task").updateMany({
                            activeId: data.data.activeId,
                            userOpenId: fromId,
                        },{
                            $set: {
                                task: shareTask
                            }
                        });
                        console.log("ret: ",ret);
                    }
                }
            }    
        }
        

        //加入活动 数据
        var cur_year = time.getFullYear();
        var cur_month = time.getMonth() + 1  >= 10 ? "" + (time.getMonth() + 1) : "0" + (time.getMonth() + 1);
        var cur_day = time.getDate() >= 10 ? "" + time.getDate() : "0" + time.getDate(); 
        var cur_limit = "" + cur_year + "-" + cur_month + "-" + cur_day;
        var joinData = await cloud.db.collection("join").find({ 
            //openid: openid,
            userOpenId: userOpenId,
            activeId: retData.activeId,
            time:  cur_limit
        });
        if(isRetError(joinData) || joinData.length <= 0){
            //加入一条 数据
            var joinRecord = new Object();
            joinRecord.name = "join";
            joinRecord.openid = openid;
            joinRecord.userOpenId = userOpenId;
            joinRecord.activeId = parm.activeId;
            joinRecord.activeName = parm.activeName;
            joinRecord.time = cur_limit;                        //时间格式
            joinRecord.stampTime = curTime;                     //时间戳
            joinRecord.createTime = retData.player.createTime;  //创建时间
            joinRecord.shareNums = 0;                           //分享次数
            joinRecord.joinTime = 0;                            //进入时长
            joinRecord.redBagNums = 0;                          //领奖次数
            joinRecord.consumeNums = 0;                         //消费金额
            joinRecord.attentionNums = 0;                       //关注次数
            joinRecord.rankRewardNums = 0;                      //排行榜领奖次数
            joinRecord.taskDoneNums = 0;                        //任务完成次数
            joinRecord.isVip = false;                           //是否关注一次
            joinRecord.isVipNow = retData.player.isVip;         //当天粉丝状态
            joinRecord.isMember = false;                        //是否成为会员一次
            joinRecord.isMemberNow = retData.player.isMember;   //当天会员状态
            joinRecord.isEnterGame = false;                     //是否进入游戏
            joinRecord.isLoadingGame = false;                   //是否loading
            joinRecord.isEnterHall = false;                     //是否登录成功
            joinRecord.isFromShare = isFromShare;               //是否是分享进入
            await cloud.db.collection("join").insertOne(joinRecord);
            if(isFromShare || isRegister){
                if(isFromShare && isRegister){
                    await cloud.db.collection("activityRecord").updateMany({
                        //openid: openid,
                        activeId: data.data.activeId,
                        sTime: {$lt: curTime},
                        eTime: {$gt: curTime}
                    },{
                        $inc: {
                            shareEnterNums: 1,
                            shareRegisterNums: 1,
                            joinNums: 1,
                            register: 1
                        }
                    });
                }else if(isRegister){
                    await cloud.db.collection("activityRecord").updateMany({
                        //openid: openid,
                        activeId: data.data.activeId,
                        sTime: {$lt: curTime},
                        eTime: {$gt: curTime}
                    },{
                        $inc: {
                            register: 1,
                            joinNums: 1,
                        }
                    });
                }else if(isFromShare){
                    await cloud.db.collection("activityRecord").updateMany({
                        //openid: openid,
                        activeId: retData.player.activeId,
                        sTime: {$lt: curTime},
                        eTime: {$gt: curTime}
                    },{
                        $inc: {
                            shareEnterNums: 1,
                            joinNums: 1,
                        }
                    });
                }
            }else{
                await cloud.db.collection("activityRecord").updateMany({
                    //openid: openid,
                    activeId: retData.player.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime}
                },{
                    $inc: {
                        joinNums: 1,
                    }
                });
            }
        }else{
            if(isFromShare){
                await cloud.db.collection("join").updateMany({
                    activeId: retData.player.activeId,
                    userOpenId: userOpenId,
                    time: cur_limit
                },{
                    $set: {
                        isFromShare: true
                    }
                });
                await cloud.db.collection("activityRecord").updateMany({
                    //openid: openid,
                    activeId: retData.player.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime}
                },{
                    $inc: {
                        shareEnterNums: 1,
                        joinNums: 1
                    }
                });
            }else{
                await cloud.db.collection("activityRecord").updateMany({
                    //openid: openid,
                    activeId: retData.player.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime}
                },{
                    $inc: {
                        joinNums: 1
                    }
                });
            }
        }
        return PackReturn(code,message,retData);   
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
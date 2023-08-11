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
//统计数据
module.exports = async (context) =>{
    console.log("==5001==");
    try {
        var data = context.data.data;
        console.log("data: ",data);
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var time = new Date();
        var curTime = time.getTime();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        var day = time.getDate();
        day = day < 10 ? "0" + day : day;
        var strTime = "" + year + "-" + month + "-" + day;
        //获取 统计类型
        var action = data.data.action;
        console.log("userOpenId: ",userOpenId);
        console.log("action: ",action);
        if(action == "joinFavor" || action == "joinMember"){
            //不走通用方法 需要特殊判定
        }else{
            var buryData = new Object();
            buryData.time = curTime;
            buryData.action = action;
            buryData.userOpenId = userOpenId;
            buryData.activeId = data.data.activeId;
            //版本号
            if(data.hasOwnProperty("clientVersion")){
                buryData.clientVersion = data.clientVersion;
            }
            //特殊字段 增加
            if(data.data.hasOwnProperty("data")){
                //type
                if(data.data.data.hasOwnProperty("type")){
                    buryData.type = data.data.data.type;
                }
                //时间差
                if(data.data.data.hasOwnProperty("diff_time")){
                    buryData.diff_time = data.data.data.diff_time;
                }
                //tag
                if(data.data.data.hasOwnProperty("tag")){
                    buryData.tag = data.data.data.tag;
                }
                //title
                if(data.data.data.hasOwnProperty("title")){
                    buryData.title = data.data.data.title;
                }
                //time
                if(action == "buyTime" || action == "buyLuckyTime"){
                    //购买时间点
                    if(data.data.data.hasOwnProperty("time")){
                        buryData.time = data.data.data.time;
                    }
                }else{
                    //活动时长
                    if(data.data.data.hasOwnProperty("time")){
                        buryData.addtime = data.data.data.time;
                    }
                }
                //userFrom 进入游戏渠道
                if(data.data.data.hasOwnProperty("userFrom")){
                    buryData.userFrom = data.data.data.userFrom;
                }
                //游戏时长
                if(data.data.data.hasOwnProperty("playTime")){
                    buryData.playTime = data.data.data.playTime;
                }
                if(data.data.data.hasOwnProperty("sub")){
                    buryData.sub = data.data.data.sub;
                }
                if(data.data.data.hasOwnProperty("goodsId")){
                    buryData.goodsId = data.data.data.goodsId;
                }
                if(data.data.data.hasOwnProperty("goodsName")){
                    buryData.goodsName = data.data.data.goodsName;
                }
                if(data.data.data.hasOwnProperty("price")){
                    buryData.price = data.data.data.price;
                }
                if(data.data.data.hasOwnProperty("record")){
                    buryData.record = data.data.data.record;
                }
                if(data.data.data.hasOwnProperty("nickName")){
                    buryData.nickName = data.data.data.nickName;
                }
                if(data.data.data.hasOwnProperty("payNum")){
                    buryData.payNum = data.data.data.payNum;
                }
                if(data.data.data.hasOwnProperty("rewardNum")){
                    buryData.rewardNum = data.data.data.rewardNum;
                }
            }
            await cloud.db.collection("bury").insertOne(buryData);
        }
        //处理统计 和 特殊埋点
        if(action == "share" || action == "shareSuccess"){
            //统计玩家 分享次数
            await cloud.db.collection("players").updateMany({
                //openid: openid,
                activeId: data.data.activeId,
                userOpenId: userOpenId
            },{
                $inc: {
                    shareNum: 1
                }
            });
            //当天 分享人数是否 +1
            var findData = await cloud.db.collection("join").find({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId,
                time: strTime,
                shareNums: {$gt: 0}
            });
            if(isRetError(findData)){
                return PackReturn(-2,"获取数据失败1");
            }
            await cloud.db.collection("join").updateMany({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId,
                time: strTime
            },{
                $inc: {
                    shareNums: 1
                }
            });
            if(findData.length <= 0){
                //分享总数 +1  分享人数 +1
                await cloud.db.collection("activityRecord").updateMany({
                    //openid: openid,
                    activeId: data.data.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime},
                },{
                    $inc: {
                        shareNums: 1,
                        sharePlayers: 1
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
                        shareNums: 1
                    }
                });
            }
            return PackReturn(code,message);
        }else if(action == "activity"){
            var findData = await cloud.db.collection("join").find({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId,
                time: strTime,
                joinTime: {$gte: 0}
            });
            if(isRetError(findData)){
                return PackReturn(-2,"获取数据失败2");
            }
            var addTime = parseInt(data.data.data.time);
            console.log("addTime: ",addTime);
            await cloud.db.collection("join").updateMany({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId,
                time: strTime
            },{
                $inc: {
                    joinTime: addTime
                }
            });
            if(findData.length <= 0){
                await cloud.db.collection("activityRecord").updateMany({
                    //openid: openid,
                    activeId: data.data.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime},
                },{
                    $inc: {
                        joinTime: addTime,
                        joinNums: 1
                    }
                });
            }else{
                //活动时长 +time
                await cloud.db.collection("activityRecord").updateMany({
                    //openid: openid,
                    activeId: data.data.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime},
                },{
                    $inc: {
                        joinTime: addTime
                    }
                });
            }
            return PackReturn(code,message);
        }else if(action == "activeTime"){
            var findData = await cloud.db.collection("join").find({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId,
                time: strTime,
                joinTime: {$gte: 0}
            });
            if(isRetError(findData)){
                return PackReturn(-2,"获取数据失败2");
            }
            var addTime = parseInt(data.data.data.playTime);
            console.log("addTime: ",addTime);
            await cloud.db.collection("join").updateMany({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId,
                time: strTime
            },{
                $inc: {
                    joinTime: addTime
                }
            });
            if(findData.length <= 0){
                await cloud.db.collection("activityRecord").updateMany({
                    //openid: openid,
                    activeId: data.data.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime},
                },{
                    $inc: {
                        joinTime: addTime,
                        joinNums: 1
                    }
                });
            }else{
                //活动时长 +time
                await cloud.db.collection("activityRecord").updateMany({
                    //openid: openid,
                    activeId: data.data.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime},
                },{
                    $inc: {
                        joinTime: addTime
                    }
                });
            }
            return PackReturn(code,message);
        }else if(action == "rankAward"){
            var findData = await cloud.db.collection("join").find({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId,
                time: strTime,
                rankRewardNums: {$gt: 0}
            });
            if(isRetError(findData)){
                return PackReturn(-2,"获取数据失败3");
            }
            await cloud.db.collection("join").updateMany({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId,
                time: strTime
            },{
                $inc: {
                    rankRewardNums: 1
                }
            });
            if(findData.length <= 0){
                await cloud.db.collection("activityRecord").updateMany({
                    //openid: openid,
                    activeId: data.data.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime},
                },{
                    $inc: {
                        rankRewardNums: 1,
                        rankPlayerNums: 1
                    }
                });
            }else{
                await cloud.db.collection("activityRecord").updateMany({
                    //openid: openid,
                    activeId: data.data.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime},
                },{
                    $inc: {
                        rankRewardNums: 1
                    }
                });
            }
        }else if(action == "joinFavor"){
            //统计 关注
            var findPlayerData = await cloud.db.collection("players").find({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId
            });
            if(isRetError(findPlayerData) || findPlayerData.length <= 0){
                //未找到玩家数据
                return PackReturn(-2,"获取数据失败");
            }
            var parm = findPlayerData[0];
            
            //屏蔽历史关注过的人 
            if(parm.hasOwnProperty("isVipHistory")){
                if(parm.isVipHistory){
                    await cloud.db.collection("players").updateMany({
                        //openid: openid,
                        userOpenId:userOpenId,
                        activeId: data.data.activeId
                    },{
                        $set:{
                            isVip: data.data.data.isFavor,  
                        }
                    });
                    if(data.data.data.isFavor){
                        //更新当天的历史记录 
                        await cloud.db.collection("join").updateMany({
                            userOpenId: userOpenId,
                            activeId: data.data.activeId,
                            time: strTime
                        },{
                            $set: {
                                isVipNow: true
                            }
                        });
                        //添加一条 埋点记录
                        var newBury = new Object();
                        newBury.time = curTime;
                        newBury.activeId = data.data.activeId;
                        newBury.userOpenId = userOpenId;
                        newBury.action = action;
                        newBury.type = data.data.data.type;
                        if(data.hasOwnProperty("clientVersion")){
                            newBury.clientVersion = data.clientVersion;
                        }
                        await cloud.db.collection("bury").insertOne(newBury);
                    }else{
                        await cloud.db.collection("join").updateMany({
                            userOpenId: userOpenId,
                            activeId: data.data.activeId,
                            time: strTime
                        },{
                            $set: {
                                isVipNow: false
                            }
                        });
                    }
                    return PackReturn(code,message);
                }
            }
            if(data.data.data.isFavor){
                //添加一条 埋点记录
                var newBury = new Object();
                newBury.time = curTime;
                newBury.activeId = data.data.activeId;
                newBury.userOpenId = userOpenId;
                newBury.action = action;
                newBury.type = data.data.data.type;
                if(data.hasOwnProperty("clientVersion")){
                    newBury.clientVersion = data.clientVersion;
                }
                await cloud.db.collection("bury").insertOne(newBury);
                
                //统计玩家任务完成次数  
                await cloud.db.collection("players").updateMany({
                    //openid: openid,
                    userOpenId:userOpenId,
                    activeId: data.data.activeId
                },{
                    $set:{
                        isVip: data.data.data.isFavor,  
                        isVipHistory: data.data.data.isFavor
                    },
                    $inc: {
                        taskDoneCount: 1
                    }
                });
                //统计任务完成人数 统计一次 taskDonePlayers 
                var findJoinData = await cloud.db.collection("join").find({
                    //openid: openid,
                    userOpenId: userOpenId,
                    activeId: data.data.activeId,
                    time: strTime,
                    taskDoneNums: {$gt: 0}
                });
                if(isRetError(findJoinData)){
                    return PackReturn(-2,"获取数据失败")
                }
                
                await cloud.db.collection("join").updateMany({
                    //openid: openid,
                    userOpenId: userOpenId,
                    activeId: data.data.activeId,
                    time: strTime
                },{
                    $set: {
                        isVip: true,
                        isVipNow: true
                    },
                    $inc: {
                        taskDoneNums: 1
                    }
                });
                var findRecordData = await cloud.db.collection("activityRecord").find({
                    //openid: openid,
                    activeId: data.data.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime},
                });
                if(isRetError(findRecordData)){
                    return PackReturn(-2,"获取数据失败1");
                }
                if(findRecordData.length > 0){
                    var recordParm = findRecordData[0];
                    var newObject = new Object();
                    if(recordParm.hasOwnProperty("task_6")){
                        newObject["task_6"] = recordParm["task_6"] + 1;
                    }else{
                        newObject["task_6"] = 1;
                    }
                    if(findJoinData.length <= 0){
                        await cloud.db.collection("activityRecord").updateMany({
                            //openid: openid,
                            activeId: data.data.activeId,
                            sTime: {$lt: curTime},
                            eTime: {$gt: curTime},
                        },{
                            $set: newObject,
                            $inc: {
                                taskDonePlayers: 1,
                                taskDoneNums: 1,
                                attentionNums: 1,
                                fans: 1
                            }
                        });
                    }else{
                        var joinParm = findJoinData[0];
                        if(!joinParm.isVip){
                            await cloud.db.collection("activityRecord").updateMany({
                                //openid: openid,
                                activeId: data.data.activeId,
                                sTime: {$lt: curTime},
                                eTime: {$gt: curTime},
                            },{
                                $set: newObject,
                                $inc: {
                                    taskDoneNums: 1,
                                    attentionNums: 1,
                                    fans: 1
                                }
                            });
                        }
                    }
                }
            }else{
                await cloud.db.collection("join").updateMany({
                    //openid: openid,
                    userOpenId: userOpenId,
                    activeId: data.data.activeId,
                    time: strTime
                },{
                    $set: {
                        isVipNow: false
                    }
                });
            }
        }else if(action == "joinMember"){
            var findPlayerData = await cloud.db.collection("players").find({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId
            });
            if(isRetError(findPlayerData) || findPlayerData.length <= 0){
                //未找到玩家数据
                return PackReturn(-2,"获取数据失败1");
            }
            var parm = findPlayerData[0];
            console.log("isMember: ",data.data.data.isMember);
            //屏蔽历史关注过的人 
            if(parm.hasOwnProperty("isMemberHistory")){
                if(parm.isMemberHistory){
                    await cloud.db.collection("players").updateMany({
                        //openid: openid,
                        userOpenId:userOpenId,
                        activeId: data.data.activeId
                    },{
                        $set:{
                            isMember: data.data.data.isMember,  
                        }
                    });
                    if(data.data.data.isMember){
                        //更新当天的历史记录 
                        await cloud.db.collection("join").updateMany({
                            userOpenId: userOpenId,
                            activeId: data.data.activeId,
                            time: strTime
                        },{
                            $set: {
                                isMemberNow: true,
                            }
                        });
                        //添加一条 埋点记录
                        var newBury = new Object();
                        newBury.time = curTime;
                        newBury.activeId = data.data.activeId;
                        newBury.userOpenId = userOpenId;
                        newBury.action = action;
                        newBury.type = data.data.data.type;
                        if(data.hasOwnProperty("clientVersion")){
                            newBury.clientVersion = data.clientVersion;
                        }
                        await cloud.db.collection("bury").insertOne(newBury);
                    }else{
                        await cloud.db.collection("join").updateMany({
                            userOpenId: userOpenId,
                            activeId: data.data.activeId,
                            time: strTime
                        },{
                            $set: {
                                isMemberNow: false,
                            }
                        });
                    }
                    return PackReturn(code,message);
                }
            }
            //统计 会员
            if(data.data.data.isMember){
                //添加一条 埋点记录
                var newBury = new Object();
                newBury.time = curTime;
                newBury.activeId = data.data.activeId;
                newBury.userOpenId = userOpenId;
                newBury.action = action;
                newBury.type = data.data.data.type;
                if(data.hasOwnProperty("clientVersion")){
                    newBury.clientVersion = data.clientVersion;
                }
                await cloud.db.collection("bury").insertOne(newBury);
   
                //统计玩家任务完成次数  
                await cloud.db.collection("players").updateMany({
                    //openid: openid,
                    userOpenId:userOpenId,
                    activeId: data.data.activeId
                },{
                    $set:{
                        isMember: data.data.data.isMember,  
                        isMemberHistory: data.data.data.isMember
                    },
                    $inc: {
                        taskDoneCount: 1
                    }
                });
                //统计任务完成人数 统计一次 taskDonePlayers 
                var findJoinData = await cloud.db.collection("join").find({
                    //openid: openid,
                    userOpenId: userOpenId,
                    activeId: data.data.activeId,
                    time: strTime,
                    taskDoneNums: {$gt: 0}
                });
                if(isRetError(findJoinData)){
                    return PackReturn(-2,"获取数据失败2");
                }
                await cloud.db.collection("join").updateMany({
                    //openid: openid,
                    userOpenId: userOpenId,
                    activeId: data.data.activeId,
                    time: strTime
                },{
                    $set: {
                        isMember: true,
                        isMemberNow: true
                    },
                    $inc: {
                        taskDoneNums: 1
                    }
                });
                var findRecordData = await cloud.db.collection("activityRecord").find({
                    //openid: openid,
                    activeId: data.data.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime},
                });
                if(isRetError(findRecordData)){
                    return PackReturn(-2,"获取数据失败1");
                }
                if(findRecordData.length > 0){
                    var recordParm = findRecordData[0];
                    var newObject = new Object();
                    if(recordParm.hasOwnProperty("task_5")){
                        newObject["task_5"] = recordParm["task_5"] + 1;
                    }else{
                        newObject["task_5"] = 1;
                    }
                    if(findJoinData.length <= 0){
                        await cloud.db.collection("activityRecord").updateMany({
                            //openid: openid,
                            activeId: data.data.activeId,
                            sTime: {$lt: curTime},
                            eTime: {$gt: curTime},
                        },{
                            $set: newObject,
                            $inc: {
                                taskDonePlayers: 1,
                                taskDoneNums: 1,
                                vipNums: 1
                            }
                        });
                    }else{
                        var joinParm = findJoinData[0];
                        if(joinParm.hasOwnProperty("isMember")){
                            if(!joinParm.isMember){
                                await cloud.db.collection("activityRecord").updateMany({
                                    //openid: openid,
                                    activeId: data.data.activeId,
                                    sTime: {$lt: curTime},
                                    eTime: {$gt: curTime},
                                },{
                                    $set: newObject,
                                    $inc: {
                                        taskDoneNums: 1,
                                        vipNums: 1
                                    }
                                });
                            }
                        }
                    }
                }
            }else{
                await cloud.db.collection("join").updateMany({
                    //openid: openid,
                    userOpenId: userOpenId,
                    activeId: data.data.activeId,
                    time: strTime
                },{
                    $set: {
                        isMemberNow: false
                    }
                });
            }
        }else if(action == "enterGame"){
            //统计 进入游戏玩法次数
            var findJoinData = await cloud.db.collection("join").find({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId,
                time: strTime,
                isEnterGame: true
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
                $set: {
                    isEnterGame: true
                }
            });
            var findRecordData = await cloud.db.collection("activityRecord").find({
                activeId: data.data.activeId,
                sTime: {$lt: curTime},
                eTime: {$gt: curTime},
            });

            if(isRetError(findRecordData) || findRecordData.length <= 0){
                return PackReturn(-2,"获取数据失败");
            }
            var recordParm = findRecordData[0];
            if(recordParm.hasOwnProperty("enterGameNums")){
                if(findJoinData.length <= 0){
                    await cloud.db.collection("activityRecord").updateMany({
                        //openid: openid,
                        activeId: data.data.activeId,
                        sTime: {$lt: curTime},
                        eTime: {$gt: curTime},
                    },{
                        $inc: {
                            enterGameNums: 1,
                            enterGamePlayers: 1
                        }
                    });
                }else{
                    await cloud.db.collection("activityRecord").updateMany({
                        //openid: openid,
                        activeId: data.data.activeId,
                        sTime: {$lt: curTime},
                        eTime: {$gt: curTime},
                    },{
                        $inc: {
                            enterGameNums: 1,
                        }
                    });
                }
            }else{
                await cloud.db.collection("activityRecord").updateMany({
                    //openid: openid,
                    activeId: data.data.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime},
                },{
                    $set: {
                        enterGameNums: 1,
                        enterGamePlayers: 1
                    }
                });
            }
        }else if(action == "loadingRes"){
            //统计 加载游戏次数
            var findJoinData = await cloud.db.collection("join").find({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId,
                time: strTime,
                isLoadingGame: true
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
                $set: {
                    isLoadingGame: true
                }
            });
            var findRecordData = await cloud.db.collection("activityRecord").find({
                activeId: data.data.activeId,
                sTime: {$lt: curTime},
                eTime: {$gt: curTime},
            });

            if(isRetError(findRecordData) || findRecordData.length <= 0){
                return PackReturn(-2,"获取数据失败");
            }
            var recordParm = findRecordData[0];
            if(recordParm.hasOwnProperty("loadingNums")){
                if(findJoinData.length <= 0){
                    await cloud.db.collection("activityRecord").updateMany({
                        //openid: openid,
                        activeId: data.data.activeId,
                        sTime: {$lt: curTime},
                        eTime: {$gt: curTime},
                    },{
                        $inc: {
                            loadingNums: 1,
                            loadingPlayers: 1
                        }
                    });
                }else{
                    await cloud.db.collection("activityRecord").updateMany({
                        //openid: openid,
                        activeId: data.data.activeId,
                        sTime: {$lt: curTime},
                        eTime: {$gt: curTime},
                    },{
                        $inc: {
                            loadingNums: 1,
                        }
                    });
                }
            }else{
                await cloud.db.collection("activityRecord").updateMany({
                    //openid: openid,
                    activeId: data.data.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime},
                },{
                    $set: {
                        loadingNums: 1,
                        loadingPlayers: 1
                    }
                });
            }
        }else if(action == "enterHall"){
            //统计 登录成功次数
            var findJoinData = await cloud.db.collection("join").find({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId,
                time: strTime,
                isEnterHall: true
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
                $set: {
                    isEnterHall: true
                }
            });
            var findRecordData = await cloud.db.collection("activityRecord").find({
                activeId: data.data.activeId,
                sTime: {$lt: curTime},
                eTime: {$gt: curTime},
            });

            if(isRetError(findRecordData) || findRecordData.length <= 0){
                return PackReturn(-2,"获取数据失败");
            }
            var recordParm = findRecordData[0];
            if(recordParm.hasOwnProperty("loadingNums")){
                if(findJoinData.length <= 0){
                    await cloud.db.collection("activityRecord").updateMany({
                        //openid: openid,
                        activeId: data.data.activeId,
                        sTime: {$lt: curTime},
                        eTime: {$gt: curTime},
                    },{
                        $inc: {
                            enterHallNums: 1,
                            enterHallPlayers: 1
                        }
                    });
                }else{
                    await cloud.db.collection("activityRecord").updateMany({
                        //openid: openid,
                        activeId: data.data.activeId,
                        sTime: {$lt: curTime},
                        eTime: {$gt: curTime},
                    },{
                        $inc: {
                            enterHallNums: 1,
                        }
                    });
                }
            }else{
                await cloud.db.collection("activityRecord").updateMany({
                    //openid: openid,
                    activeId: data.data.activeId,
                    sTime: {$lt: curTime},
                    eTime: {$gt: curTime},
                },{
                    $set: {
                        enterHallNums: 1,
                        enterHallPlayers: 1
                    }
                });
            }
        }else if(action == "tbTask"){
            //添加一条 埋点记录(淘宝任务 1：签到任务 2：浏览直播间15s 3：浏览店铺15s)
        }else if(action == "lookPrizePool"){
            //添加一条 埋点记录 (查看奖池)
        }else if(action == "openTask"){
            //添加一条 埋点记录 (打开任务面板)
        }else if(action == "buyTime"){
            //购买前 时间点上传
        }else if(action == "openApp"){
            //打开游戏
        }else if(action == "exit"){
            //游戏切后台 埋点
        }else{
            //hallShowGift hallOpenGift hallShowShare hallOpenShare
        }
        return PackReturn(code,message);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
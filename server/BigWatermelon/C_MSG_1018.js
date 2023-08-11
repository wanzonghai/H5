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

//上报领取任务
module.exports = async (context) =>{
    console.log("==1018==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        //获取任务配置
        var findListTask = await cloud.db.collection("listTask").find({
            name: "listTask"
        });
        if(isRetError(findListTask)){
            return PackReturn(-2,"获取数据失败0")
        }
        var taskConfig = findListTask[0].task;
        var findUserData = await cloud.db.collection("users").find({
            //openid: openid,
            activeId: data.data.activeId
        });
        if(isRetError(findUserData) || findUserData.length <= 0){
            return PackReturn(-2,"获取数据失败1");
        }
        var userParm = findUserData[0];
        //0: daily 1:pullNew 2:trans
        var activeTypeIdx = 0;
        if(findUserData[0].hasOwnProperty("activeType")){
            if(findUserData[0].activeType == "pullNew"){
                activeTypeIdx = 1;
            }else if(findUserData[0].activeType == "trans"){
                activeTypeIdx = 2;
            }else{
                activeTypeIdx = 0;
            }
        }else{
            //默认日常促活
            activeTypeIdx = 0;
        }
        var playerData = await cloud.db.collection("players").find({ 
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId
        });
        if(isRetError(playerData) || playerData.length <= 0){
            return PackReturn(-2,"获取玩家数据失败2");
        }
        var parm = playerData[0];
        //判断任务 类型
        var task_id = data.data.task_id;
        var cur_times = 0;
        var task_key = "";
        var setData = new Object();
        // if(task_id == 0){
        //     task_key = "rewardTimes_free";
        // }else if(task_id == 2){
        //     task_key = "rewardTimes_share";
        // }else if(task_id == 5){
        //     task_key = "rewardTimes_member";
        // }else if(task_id == 6){
        //     task_key = "rewardTimes_favor";
        // }else if(task_id == 7){
        //     task_key = "rewardTimes_kgold";
        // }else if(task_id == 8){
        //     task_key = "rewardTimes_invitation";
        // }else if(task_id == 9){
        //     task_key = "rewardTimes_buy";
        // }else if(task_id == 10){
        //     task_key = "rewardTimes_memberFree";
        // }else if(task_id == 12){
        //     task_key = "rewardTimes_inviteReward";
        // }else if(task_id == 13){
        //     task_key = "rewardTimes_dayReward";
        // }else if(task_id == 14){
        //     task_key = "rewardTimes_playGame";
        // }else {
        //     return PackReturn(-3,"task_id错误");
        // }

        if(task_id == 1){
            task_key = "rewardTimes_free";
        }else if(task_id == 2){
            task_key = "rewardTimes_favor";
        }else if(task_id == 3){
            task_key = "rewardTimes_memberFree";
        }else if(task_id == 4){
            task_key = "rewardTimes_collectGoods";
        }else if(task_id == 5){
            task_key = "count_look";
        }else if(task_id == 6){
            task_key = "rewardTimes_member";
        }else if(task_id == 7){
            task_key = "rewardTimes_buy";
        }else if(task_id == 8){
            task_key = "rewardTimes_share";
        }else if(task_id == 9){
            
        }else if(task_id == 10){
            
        }else if(task_id == 11){
            
        }else {
            return PackReturn(-3,"task_id错误");
        }

        if(parm.hasOwnProperty(task_key)){
            cur_times = parm[task_key];
        }else{
            cur_times = 0;
        }
        var isLeftTimes = true;
        var taskModel = null;
        for(var i = 0; i < taskConfig.length; i++){
            if(taskConfig[i].id == task_id){
                taskModel = taskConfig[i];
                break;
            }
        }
        if(!taskModel){
            return PackReturn(-1,"配置读取错误");
        }
        var listLimit = JSON.parse(taskModel["limit"]);
        var limitTimes = listLimit[activeTypeIdx];
        var needTimes = parseInt(taskModel["need"]);
        //检查B端配置
        if(userParm.gameConfig.hasOwnProperty("missionConfig")){
            var bTaskConfig = null;
            for(var i = 0; i < userParm.gameConfig.missionConfig.length; i++){
                if(userParm.gameConfig.missionConfig[i].id == data.data.task_id){
                    bTaskConfig = userParm.gameConfig.missionConfig[i];
                    break;
                }
            }
            if(bTaskConfig){
                limitTimes = bTaskConfig.limit;
                needTimes = bTaskConfig.need;
            }
        }else{
            console.log("not has missionConfig");
        }
        console.log("limitTimes: ",limitTimes);
        console.log("needTimes: ",needTimes);
        if(cur_times >= limitTimes){
            isLeftTimes = false;
        }
        if(!isLeftTimes){
            return PackReturn(-1,"可领取次数不足");
        }else{
            //领取奖励 更新数据
            setData[task_key] = cur_times + 1;
            //活动记录更新 任务完成度+1
            var isTaskDone = false;
            // if(task_id == 0){
            //     if(setData[task_key] == 3){
            //         isTaskDone = true;
            //     }
            // }else if(task_id == 9){
            //     if(setData[task_key] == 6){
            //         isTaskDone = true;
            //     }
            // }else if(task_id == 10){
            //     if(setData[task_key] == 3){
            //         isTaskDone = true;
            //     }
            // }else if(task_id == 11){
            //     if(setData[task_key] == 3){
            //         isTaskDone = true;
            //     }
            // }
            if(setData[task_key] >= needTimes){
                isTaskDone = true;
            }

            //任务完成 统计任务完成度
            if(isTaskDone){
                var timeData = new Date();
                var curTime = timeData.getTime();
                var year = timeData.getFullYear();
                var month = timeData.getMonth() + 1;
                month = month < 10 ? "0" + month : month;
                var day = timeData.getDate();
                day = day < 10 ? "0" + day : day;
                var strTime = "" + year + "-" + month + "-" + day;
                //统计 玩家任务完成数
                await cloud.db.collection("players").updateMany({
                    //openid: openid,
                    userOpenId:userOpenId,
                    activeId: data.data.activeId
                    },{
                        $set: setData,
                        $inc: {
                            taskDoneCount: 1
                        }
                    }
                );
                //新加 任务埋点数据
                var newBury = new Object();
                newBury.time = curTime;
                newBury.activeId = data.data.activeId;
                newBury.userOpenId = userOpenId;
                newBury.action = "task";
                newBury.data = new Object();
                newBury.data.task_id = task_id;
                if(data.hasOwnProperty("clientVersion")){
                    newBury.clientVersion = data.clientVersion;
                }
                await cloud.db.collection("bury").insertOne(newBury);
                
                var findJoinData = await cloud.db.collection("join").find({
                    //openid: openid,
                    userOpenId: userOpenId,
                    activeId: data.data.activeId,
                    time: strTime,
                    taskDoneNums: {$gt: 0}
                });
                if(isRetError(findJoinData)){
                    return PackReturn(-2,"获取数据失败");
                }
                await cloud.db.collection("join").updateMany({
                    //openid: openid,
                    userOpenId: userOpenId,
                    activeId: data.data.activeId,
                    time: strTime
                },{
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
                    if(findJoinData.length <= 0){
                        await cloud.db.collection("activityRecord").updateMany({
                            //openid: openid,
                            activeId: data.data.activeId,
                            sTime: {$lt: curTime},
                            eTime: {$gt: curTime},
                        },{
                            $inc: {
                                taskDonePlayers: 1,
                                taskDoneNums: 1
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
                                taskDoneNums: 1
                            }
                        });
                    }
                }
            }else{
                await cloud.db.collection("players").updateMany({
                    //openid: openid,
                    userOpenId:userOpenId,
                    activeId: data.data.activeId
                    },{
                        $set: setData
                    }
                );
            }
            return PackReturn(code,message);
        }   
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
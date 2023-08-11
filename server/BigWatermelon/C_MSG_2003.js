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

//上报任务 进度
module.exports = async (context) =>{
    console.log("==2003==");
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
            return PackReturn(-2,"获取任务数据失败0")
        }
        var taskConfig = findListTask[0].task;
        var findUserData = await cloud.db.collection("users").find({
            activeId: data.data.activeId,
            state: true
        },{
            projection: {
                sTime: 1,
                eTime: 1,
                "gameConfig.missionConfig": 1
            }
        });
        if(isRetError(findUserData) || findUserData.length <= 0){
            return PackReturn(-2,"获取数据失败1");
        }
        var userParm = findUserData[0];
        //活动开始检测
        if(userParm.hasOwnProperty("sTime")){
            if(userParm.sTime > new Date().getTime()){
                return PackReturn(-10,"活动未开始");
            }
        }
        //活动结束检测
        if(userParm.hasOwnProperty("eTime")){
            if(userParm.eTime <= new Date().getTime()){
                return PackReturn(-11,"活动到期");
            }
        }
        var isTaskDone = false;
        var retData = new Object();
        //任务配置
        

        //任务数据
        var findTaskData = await cloud.db.collection("task").find({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        });

        if(isRetError(findTaskData) || findTaskData.length <= 0){
            return PackReturn(-2,"获取数据失败2");
        }
        var taskData = findTaskData[0].task;
        //获取当前活动
        var curTask = null;
        for(var i = 0;i < taskData.length; i++){
            if(taskData[i].id == data.data.task_id){
                curTask = taskData[i];
                break;
            }
        }
        //任务表 配置
        var taskModel = null;
        for(var i = 0; i < taskConfig.length; i++){
            if(taskConfig[i].id == data.data.task_id){
                taskModel = taskConfig[i];
                break;
            }
        }
        // console.log("taskModel: ",taskModel);
        curTask.rewardCount_1 = Number(taskModel.rewardCount_1);
        curTask.rewardCount_2 = Number(taskModel.rewardCount_2);
        //自定义 限制配置
        var bTaskConfig = null;
        if(userParm.gameConfig.hasOwnProperty("missionConfig")){
            //是否 自定义奖励配置
            for(var i = 0; i < userParm.gameConfig.missionConfig.length; i++){
                if(userParm.gameConfig.missionConfig[i].id == data.data.task_id){
                    bTaskConfig = userParm.gameConfig.missionConfig[i];
                    break;
                }
            }
        }
        // console.log("bTaskConfig: ",bTaskConfig);
        var isLimit = false;
        var needCount = 0;
        if(bTaskConfig){
            if(bTaskConfig.hasOwnProperty("limit")){
                if(curTask.get >= bTaskConfig.limit){
                    isLimit = true;
                }
            }
            if(bTaskConfig.hasOwnProperty("need")){
                needCount = bTaskConfig.need;
            }else{
                needCount = taskModel.need;
            }
            if(bTaskConfig.hasOwnProperty("rewardCount_1")){
                curTask.rewardCount_1 = bTaskConfig.rewardCount_1;
            }
            if(bTaskConfig.hasOwnProperty("rewardCount_2")){
                curTask.rewardCount_2 = bTaskConfig.rewardCount_2;
            }
        }else{
            needCount = taskModel.need;
            if(curTask.get >= taskModel.limit){
                isLimit = true;
            }
        }
        if(isLimit){
            //领奖超过限制
            curTask.state = 2;
            //vivo定制 分享任务 单独处理
            // if(curTask.id == 2){
            //     curTask.state = 1;   
            // }
        }else{
            //更新  任务 可领取状态  0: 可领取  1： 未完成 2：已领取
            if(taskModel.tType == 1){
                //倒计时任务
                curTask.state = 0;
            }else if(taskModel.tType == 2){
                //即时任务
                curTask.state = 0;
            }else if(taskModel.tType == 3){
                //进度任务
                if(curTask.finish + 1 >= needCount){
                    curTask.state = 0;
                }
            }else if(taskModel.tType == 4){
                //状态任务
                curTask.state = 0;
            }
            if(curTask.state == 0){
                isTaskDone = true;
            }
            curTask.finish += 1;
            curTask.done += 1;
        }
        retData.finish = curTask.finish;
        retData.state = curTask.state;
        retData.get = curTask.get;
        //更新任务表
        await cloud.db.collection("task").updateMany({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        },{
            $set: {
                task: taskData
            }
        });
        //统计任务完成人数 统计一次 taskDonePlayers 
        if(isTaskDone){
            var timeData = new Date();
            var curTime = timeData.getTime();
            var year = timeData.getFullYear();
            var month = timeData.getMonth() + 1;
            month = month < 10 ? "0" + month : month;
            var day = timeData.getDate();
            day = day < 10 ? "0" + day : day;
            var strTime = "" + year + "-" + month + "-" + day;
            //更新玩家数据
            await cloud.db.collection("players").updateMany({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId
                },{
                    $inc: {
                        taskDoneCount: 1
                    }
                }
            );
            //新加 任务埋点数据
            await cloud.db.collection("bury").insertOne({
                time: curTime,
                activeId: data.data.activeId,
                userOpenId: userOpenId,
                action: "task",
                data: {
                    task_id: data.data.task_id
                }
            });
            var findJoinData = await cloud.db.collection("join").find({
                //openid: openid,
                userOpenId: userOpenId,
                activeId: data.data.activeId,
                time: strTime,
                taskDoneNums: {$gte: 0}
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
            //统计任务 埋点（分任务类型）
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
        }
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
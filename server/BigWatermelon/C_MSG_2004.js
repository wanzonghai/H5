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

//任务进度 更新
module.exports = async (context) =>{
    console.log("==2004==");
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
            //openid: openid,
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
        console.log("state: ",curTask.state);
        if(curTask.state != 0){
            return PackReturn(-5,"未达到领奖条件");
        }
        //任务表 配置
        var taskModel = null;
        for(var i = 0; i < taskConfig.length; i++){
            if(taskConfig[i].id == data.data.task_id){
                taskModel = taskConfig[i];
                break;
            }
        }
        //获取奖励内容
        //检测 是否有B端自定义配置
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
        //奖励次数
        var nextReward = curTask.get + 1;
        if(bTaskConfig){
            if(nextReward > bTaskConfig.limit){
                return PackReturn(-6,"领奖次数超过限制");
            }else if(nextReward == bTaskConfig.limit){
                //领奖超过限制
                curTask.state = 2;
            }else{
                //检测 可领剩余次数
                if(curTask.done - 1 > 0){
                    curTask.state = 0;
                }else{
                    curTask.state = 1;
                }
                // curTask.state = 1;
                curTask.finish = 0;
                curTask.done -= 1;
            }
            var newReward = new Object();
            for(var i = 0; i < bTaskConfig.rewardType.length; i++){
                newReward["rewardCount_" + bTaskConfig.rewardType[i]] = parseInt(bTaskConfig["rewardCount_" + bTaskConfig.rewardType[i]]);
            }
            newReward.id = taskModel.rewardId;
            //vivo定制 超过5次 不奖励积分
            if(curTask.id == 2){
                if(curTask.get >= 5){
                    newReward["rewardCount_2"] = 0;
                }
            }
            retData.reward = newReward;
        }else{
            if(nextReward > taskModel.limit){
                return PackReturn(-6,"领奖次数超过限制");
            }else if(nextReward == taskModel.limit){
                //领奖超过限制
                curTask.state = 2;
                //vivo定制 分享任务 单独处理
                // if(curTask.id == 2){
                //     curTask.state = 1;   
                // }
            }else{
                //检测 可领剩余次数
                if(curTask.done - 1 > 0){
                    curTask.state = 0;
                }else{
                    curTask.state = 1;
                }
                // curTask.state = 1;
                curTask.finish = 0;
                curTask.done -= 1;
            }
            //默认奖励配置
            var newReward = new Object();
            for(var i = 0; i < taskModel.rewardType.length; i++){
                newReward["rewardCount_" + taskModel.rewardType[i]] = parseInt(taskModel["rewardCount_" + taskModel.rewardType[i]]);
            }
            newReward.id = taskModel.rewardId;
            //vivo定制 超过5次 不奖励积分
            if(curTask.id == 2){
                if(curTask.get >= 5){
                    newReward["rewardCount_2"] = 0;
                }
            }
            retData.reward = newReward;
            
        }
        curTask.get += 1;
        retData.get = curTask.get;
        retData.state = curTask.state;
        if(taskModel.tType == 1){
            //倒计时任务 更新时间戳
            if(curTask.hasOwnProperty("time")){
                curTask.time = new Date().getTime();
            }
        }
        console.log("curTask: ",curTask);
        //奖励 保存到用户信息
        if(Array.isArray(taskModel.rewardType)){
            //针对大西瓜
            // if(retData.reward.hasOwnProperty("rewardCount_1") && retData.reward.hasOwnProperty("rewardCount_2")){
            //     //金币和积分奖励
            //     await cloud.db.collection("players").updateMany({
            //         activeId: data.data.activeId,
            //         userOpenId: userOpenId
            //     },{
            //         $inc: {
            //             userCoin: retData.reward.rewardCount_1,
            //             point: retData.reward.rewardCount_2
            //         }
            //     });
            // }else if(retData.reward.hasOwnProperty("rewardCount_1")){
            //     //金币奖励
            //     await cloud.db.collection("players").updateMany({
            //         activeId: data.data.activeId,
            //         userOpenId: userOpenId
            //     },{
            //         $inc: {
            //             userCoin: retData.reward.rewardCount_1
            //         }
            //     });
            // }else if(retData.reward.hasOwnProperty("rewardCount_2")){
            //     //金币奖励
            //     await cloud.db.collection("players").updateMany({
            //         activeId: data.data.activeId,
            //         userOpenId: userOpenId
            //     },{
            //         $inc: {
            //             point: retData.reward.rewardCount_2
            //         }
            //     });
            // }
            
        }else{
            var rewardCount = Number(curTask.rewardCount);
            if(taskModel.rewardType == "Coin"
                || taskModel.rewardType == "VIP"
                || taskModel.rewardType == "Member"
            ){
                //金币奖励
                await cloud.db.collection("players").updateMany({
                    activeId: data.data.activeId,
                    userOpenId: userOpenId
                },{
                    $inc: {
                        userCoin: rewardCount
                    }
                });
            }else if(taskModel.rewardType == "Skin"){
                //皮肤奖励
                await cloud.db.collection("players").updateMany({
                    activeId: data.data.activeId,
                    userOpenId: userOpenId
                },{
                    $addToSet: {
                        roleList: taskModel.rewardId
                    }
                });
            }else if(taskModel.rewardType == "Gift"){
                //礼包奖励 (走单独接口)

            }
        }
        //更新任务表
        await cloud.db.collection("task").updateMany({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        },{
            $set: {
                task: taskData
            }
        });
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
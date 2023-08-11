function isRetError(ret){
    if(!ret == null || ret == undefined || ret < 0) {
        return true;
    }
    return false;
}
module.exports = async (context) =>{
    console.log("==updateDayTask==");
    try {
        const cloud = context.cloud;
        var time = "" + new Date().getTime();
        //按照赛季 更新任务
        var ret = await cloud.db.collection("players").updateMany({
            curSeason: {$gt: 0},
            },{
                $set: {
                    dayUpdateTime: time,
                    rewardTimes_free: 0,   //领免费券已领奖次数
                    rewardTimes_challenge: 0, //炸弹挑战已领奖次数
                    rewardTimes_share: 0,     //邀请好友已领奖次数
                    rewardTimes_live: 0,	  //访问直播间已领奖次数
                    rewardTimes_lookGoods: 0, //浏览商品已领奖次数
                    rewardTimes_buy: 0,       //我要买买买已购买合集
                    rewardTimes_memberFree: 0,//会员福利 每天领三次
                    rewardTimes_collectGoods: 0,//收藏商品次数
                    rewardTimes_dayReward: 0, //每日奖励
                    rewardTimes_playGame: 0,  //每日进入次数
                    
                    count_challenge: 0,			//炸弹挑战次数
                    count_share: 0,				//分享次数
                    count_look: 0,              //浏览商品数量
                    "invitationInfo.isRegister": false,
                    "invitationInfo.nickName": "",
                    "invitationInfo.headUrl": "",
                    "invitationInfo.coin": 0,  
                    "fromInfo.nickName": "",
                    "fromInfo.headUrl": "",
                    inviteList: []
                }
            }
        );
        if(isRetError(ret)){
            return JSON.stringify({code:-4,message:"失败",ret});
        }

        //清理 task每日任务
        // await cloud.db.collection("task").updateMany({
        //     "task.type": 1
        // },{
        //     $set: {
        //         "task.$.finish": 0,
        //         "task.$.get": 0,
        //         "task.$.state": 1
        //     }
        // });

        var findTaskData = await cloud.db.collection("task").aggregate([
            {
                $match: {
                    name: "task"
                }
            },
            {
                $project: {
                    activeId: 1,
                    userOpenId: 1,
                    task: 1
                }
            }
        ]);
        if(isRetError(findTaskData)){
            return JSON.stringify({code:-4,message:"获取任务数据失败"});
        }

        if(findTaskData.length > 0){
            for(var i = 0; i < findTaskData.length; i++){
                var list = [];
                var iTask = findTaskData[i].task;
                for(var k = 0; k < iTask.length; k++){
                    var newObj = new Object();
                    newObj.rewardCount_1 = iTask[k].rewardCount_1;
                    newObj.rewardCount_2 = iTask[k].rewardCount_2;
                    newObj.tType = iTask[k].tType;
                    newObj.need = iTask[k].need;
                    newObj.rewardType = iTask[k].rewardType;
                    newObj.type = iTask[k].type;
                    newObj.id = iTask[k].id;
                    newObj.limit = iTask[k].limit;
                    
                    //成为购买福袋、粉丝和加入会员 任务 每日 不刷新
                    //普通商家版本
                    // if(iTask[k].id == 2 || iTask[k].id == 6){
                    //vivo定制版本 
                    if(iTask[k].id == 1 || iTask[k].id == 4 || iTask[k].id == 6){
                        //获取当前任务数据
                        newObj.finish = iTask[k].finish;
                        newObj.get = iTask[k].get;
                        newObj.state = iTask[k].state;
                        newObj.done = iTask[k].done;;
                    }else{
                        newObj.finish = 0;
                        newObj.get = 0;
                        newObj.state = 1;
                        newObj.done = 0;
                    }
                    list.push(newObj);
                }
                await cloud.db.collection("task").updateMany({
                    activeId: findTaskData[i].activeId,
                    userOpenId: findTaskData[i].userOpenId
                },{
                    $set: {
                        task: list
                    }
                });
            }
        }
        
        return JSON.stringify({code:0,message:"成功"});
    } catch (e) {
        return JSON.stringify({code:-4,message:"catch失败",e});
    }
}
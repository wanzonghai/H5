function isRetError(ret){
    if(!ret == null || ret == undefined || ret < 0) {
        return true;
    }
    return false;
}

module.exports = async (context) => {
    console.log("==updateActivity==");
    const cloud = context.cloud;
    //获取活动数据
    var findUserData = await cloud.db.collection("users").aggregate([
        {
            $match: {
                state: true
            }
        },
        {
            $project: {
                openid: 1,
                activeId: 1,
                activeName: 1
            }
        }
    ]);
    if(isRetError(findUserData)){
        return PackReturn(-2,"获取数据失败1");
    }
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    var day = time.getDate();
    day = day < 10 ? "0" + day : day;
    var s_time = "" + year + "-" + month + "-" + day + " " + "00:00:00";
    var e_time = "" + year + "-" + month + "-" + day + " " + "23:59:59"; 
    //0点 开始 
    var sTime = new Date(s_time).getTime();
    //24点 结束
    var eTime = new Date(e_time).getTime();

    for(var i = 0; i < findUserData.length; i++){
        var activity = findUserData[i];
        var newRecord = new Object();
        newRecord.openid = activity.openid; 
        newRecord.name = "record";
        newRecord.activeId = activity.activeId; 
        newRecord.activeName = activity.activeName;
        newRecord.attentionNums = 0;            //总关注人数
        newRecord.consumeNums = 0;              //消费人数
        newRecord.consumeTotal = 0;             //消费总额
        newRecord.register = 0;                 //新人人数
        newRecord.fans = 0;                     //新增粉丝
        newRecord.vipNums = 0;                  //新增会员人数
        newRecord.activeNums = 0;               //活跃人数
        newRecord.joinNums = 0;                 //进入次数
        newRecord.joinTime = 0;                 //活跃时长
        newRecord.redBagNums = 0;               //领奖数量
        newRecord.grabPlayerNums = 0;           //抢红包人数
        newRecord.rankOpenNums = 0;             //排行榜打开次数
        newRecord.rankRewardNums = 0;           //排行榜奖励数量
        newRecord.rankPlayerNums = 0;           //排行榜领奖人数
        newRecord.taskDoneNums = 0;             //任务完成数
        newRecord.taskDonePlayers = 0;          //任务完成人数
        newRecord.shareNums = 0;                //分享数量
        newRecord.sharePlayers = 0;             //分享人数
        newRecord.shareEnterNums = 0;           //分享进入人数
        newRecord.shareRegisterNums = 0;        //分享新增人数
        newRecord.enterGameNums = 0;            //进入游戏玩法次数
        newRecord.enterGamePlayers = 0;         //进入游戏玩法人数
        newRecord.loadingNums = 0;              //加载次数
        newRecord.loadingPlayers = 0;           //加载完成人数
        newRecord.enterHallNums = 0;            //登录成功次数
        newRecord.enterHallPlayers = 0;         //登录成功人数
        newRecord.sTime = sTime;                //开始时间
        newRecord.eTime = eTime;                //结束时间
        await cloud.db.collection("activityRecord").insertOne(newRecord);
    }
    return 1;
}

module.exports = async (context) =>{
    const cloud = context.cloud;
    var time = "" + new Date().getTime();

    //更新活动 赛季值
    await cloud.db.collection("users").updateMany({
        state: true
    },{
        $inc: {
            season: 1
        }
    });

    //更新 所有玩家 赛季值（周排行榜）
    await cloud.db.collection("players").updateMany({
        curSeason: {$gt: 0},
    },{
            $set: {
                weekUpdateTime: time
            },
            $inc: {
                curSeason: 1
            }
        }
    );
    return true;
}
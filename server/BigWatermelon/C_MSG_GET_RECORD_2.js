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
//获取面板数据
module.exports = async (context) =>{
    console.log("==C_MSG_GET_RECORD_2==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;

        //获取活动数据
        let sTime = Number(data.data.sTime);
        let eTime = Number(data.data.eTime);
        console.log("sTime: ",sTime);
        console.log("eTime: ",eTime);
        var retData = new Object();
        //新增会员
        var vipData = await cloud.db.collection("join").aggregate([
            {
                $match: {
                    stampTime: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    isMember:true
               }
            },
            {
              $group: {
               _id: '$userOpenId',
               count: { $sum: 1 }
              }
            }
        ]);
        retData.vipNums = vipData.length;
        //统计新增数量
        var registerData =  await cloud.db.collection("join").aggregate([
            {
              $match: {
                    createTime: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId
               }
            },
            {
              $group: {
               _id: '$userOpenId',
               count: { $sum: 1 }
              }
        }]);
        retData.register = registerData.length;
        // 进入次数	joinNums（汇总）--------------------------------
        var joinNums = await cloud.db.collection("activityRecord").aggregate([
            {
            
            $match: {
                    sTime:{$gte: sTime},
                    eTime: {$lte: eTime},
                    activeId:data.data.activeId,
            }
            },
            {
                $group: {
                    _id: 'null',
                    joinNums: { $sum: '$joinNums' }
                }
            }
        ]);
        if(joinNums.length > 0){
            retData.joinNums = joinNums[0].joinNums;
        }else{
            retData.joinNums = 0;
        }
        //进入游戏时长
        var joinTime = await cloud.db.collection("activityRecord").aggregate([
            {
            
            $match: {
                    sTime:{$gte: sTime},
                    eTime: {$lte: eTime},
                    activeId:data.data.activeId,
            }
            },
            {
                $group: {
                    _id: 'null',
                    joinTime: { $sum: '$joinTime' }
                }
            }
        ]);
        if(joinTime.length > 0){
            retData.joinTime = joinTime[0].joinTime;
        }else{
            retData.joinTime = 0;
        }
        //开了多少礼包	redBagNums（汇总）------------------------------
        var redBagNums = await cloud.db.collection("activityRecord").aggregate([
            {
            
            $match: {
                    sTime:{$gte: sTime},
                    eTime: {$lte: eTime},
                    activeId:data.data.activeId,
            }
            },
            {
                $group: {
                    _id: 'null',
                    redBagNums: { $sum: '$redBagNums' }
                }
            }
        ]);
        if(redBagNums.length > 0){
            retData.redBagNums = redBagNums[0].redBagNums;
        }else{
            retData.redBagNums = 0;
        }
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
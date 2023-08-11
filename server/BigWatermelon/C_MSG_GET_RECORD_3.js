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
    console.log("==C_MSG_GET_RECORD_3==");
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
        //领取红包人数 并去重
        var redBagData = await cloud.db.collection("join").aggregate([{
            $match: {
                stampTime: {
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: data.data.activeId,
                redBagNums: {
                    $gt: 0
                }
            }
        }, {
            $group: {
                _id: '$userOpenId',
                count: {
                    $sum: 1
                }
            }
        }]);
        retData.grabPlayerNums = redBagData.length;
        //任务完成总数
        var taskDoneData = await cloud.db.collection("activityRecord").aggregate([
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
                taskDoneNums: { $sum: '$taskDoneNums' }
              }
            }
        ]);
        if(taskDoneData.length > 0){
            retData.taskDoneNums = taskDoneData[0].taskDoneNums;
        }else{
            retData.taskDoneNums = 0;
        }
        //任务完成人数 并去重
        var taskData = await cloud.db.collection("join").aggregate([{
            $match: {
                stampTime: {
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: data.data.activeId,
                taskDoneNums: {
                    $gt: 0
                }
            }
        }, {
            $group: {
                _id: '$userOpenId',
                count: {
                    $sum: 1
                }
            }
        }]);
        retData.taskDonePlayers = taskData.length;
        //分享次数 shareNums
        var shareNums = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            $or: [
                {
                    action: 'share'
                },{
                    action: 'shareSuccess'
                }
            ]
            
        });
        retData.shareNums = shareNums;
        //分享人数 并去重
        var shareData = await cloud.db.collection("join").aggregate([{
            $match: {
                stampTime: {
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: data.data.activeId,
                shareNums: {
                    $gt: 0
                }
            }
        }, {
            $group: {
                _id: '$userOpenId',
                count: {
                    $sum: 1
                }
            }
        }]);
        retData.sharePlayers = shareData.length;
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
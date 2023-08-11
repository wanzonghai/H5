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
    console.log("==C_MSG_GET_RECORD_4==");
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

        var s_sTime = new Date(sTime).toLocaleString();
        var s_eTime = new Date(eTime).toLocaleString();
        console.log("s_sTime: ",s_sTime);
        console.log("s_eTime: ",s_eTime);
        retData.sTime = s_sTime;
        retData.eTime = s_eTime;
        //分享数据修改时间后 使用最新的查询方法 
        if(sTime > 1616515199000){
            //shareEnterNums
            var shareEnterNums = await cloud.db.collection("join").aggregate([
                {
                
                $match: {
                    stampTime:{$gte: sTime,$lte: eTime},
                    activeId:data.data.activeId,
                    isFromShare: true
                }
                },
                {
                $group: {
                    _id: '$userOpenId',
                    count: {
                        $sum: 1
                    }
                }
            }]);
            retData.shareEnterNums = shareEnterNums.length;
            // 分享新增人数	shareRegisterNums（汇总）----------------------
            var shareRegisterNums = await cloud.db.collection("join").aggregate([
                {
                    $match: {
                            createTime:{$gte: sTime,$lte: eTime},
                            activeId:data.data.activeId,
                            isFromShare: true
                    }
                },
                {
                    $group: {
                        _id: '$userOpenId',
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]);
            retData.shareRegisterNums = shareRegisterNums.length;
        }else{
            //shareEnterNums
            var shareEnterNums = await cloud.db.collection("activityRecord").aggregate([
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
                shareEnterNums: { $sum: '$shareEnterNums' }
                }
            }]);
            if(shareEnterNums.length > 0){
                retData.shareEnterNums = shareEnterNums[0].shareEnterNums;
            }else{
                retData.shareEnterNums = 0;
            }
            // 分享新增人数	shareRegisterNums（汇总）----------------------
            var shareRegisterNums = await cloud.db.collection("activityRecord").aggregate([
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
                        shareRegisterNums: { $sum: '$shareRegisterNums' }
                    }
                }
            ]);
            if(shareRegisterNums.length > 0){
                retData.shareRegisterNums = shareRegisterNums[0].shareRegisterNums;
            }else{
                retData.shareRegisterNums = 0;
            }
        }
        //排行榜打开次数（汇总）rankOpenNums-----------------------------
        var rankOpenNums = await cloud.db.collection("activityRecord").aggregate([
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
                    rankOpenNums: { $sum: '$rankOpenNums' }
                }
            }
        ]);
        if(rankOpenNums.length > 0){
            retData.rankOpenNums = rankOpenNums[0].rankOpenNums;
        }else{
            retData.rankOpenNums = 0;
        }
        
        //排行榜领奖人数 rankPlayerNums
        var rankData = await cloud.db.collection("join").aggregate([{
            $match: {
                stampTime: {
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: data.data.activeId,
                rankRewardNums: {
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
        retData.rankPlayerNums = rankData.length;
        //筛选出 总粉丝数
        var fansData = await cloud.db.collection("players").aggregate([{
            $match: {
                stampTime: {
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: data.data.activeId,
                isVip: true
            }
        }, {
            $group: {
                _id: '$userOpenId',
                count: {
                    $sum: 1
                }
            }
        }]);
        retData.fansTotal_today = fansData.length;
        //筛选出 会员数
        var findMemberData = await cloud.db.collection("players").aggregate([{
            $match: {
                stampTime: {
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: data.data.activeId,
                isMember: true
            }
        }, {
            $group: {
                _id: '$userOpenId',
                count: {
                    $sum: 1
                }
            }
        }]);
        retData.memberTotal_today = findMemberData.length;
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
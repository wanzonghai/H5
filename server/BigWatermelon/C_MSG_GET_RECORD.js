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
    console.log("==C_MSG_GET_RECORD==");
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

        var findData = await cloud.db.collection("activityRecord").find({
            //openid: openid,
            activeId: data.data.activeId,
            sTime: {$gte: sTime},
            eTime: {$lte: eTime},
        });
        if(isRetError(findData)){
            return PackReturn(-2,"获取数据失败");
        }
        if(findData.length <= 0){
            return PackReturn(-2,"获取活动数据失败");
        }
        console.log("findData: ",findData.length);
        var s_sTime = new Date(sTime).toLocaleString();
        var s_eTime = new Date(eTime).toLocaleString();
        console.log("s_sTime: ",s_sTime);
        console.log("s_eTime: ",s_eTime);
        retData.sTime = s_sTime;
        retData.eTime = s_eTime;
        retData.attentionNums = 0;            //总关注人数
        retData.consumeNums = 0;              //消费人数
        retData.consumeTotal = 0;             //消费总额
        retData.register = 0;                 //新人人数
        retData.fans = 0;                     //新增粉丝
        retData.vipNums = 0;                  //新增vip数量
        retData.joinNums = 0;                 //进入游戏次数
        retData.joinTime = 0;                 //活跃时长
        retData.redBagNums = 0;               //领奖数量
        retData.grabPlayerNums = 0;           //抢红包人数
        retData.rankOpenNums = 0;             //排行榜打开次数
        retData.rankPlayerNums = 0;           //排行榜领奖人数
        retData.rankRewardNums = 0;           //排行榜领奖次数
        retData.taskDoneNums = 0;             //任务完成数
        retData.taskDonePlayers = 0;          //任务完成人数
        retData.shareNums = 0;                //分享数量
        retData.sharePlayers = 0;             //分享人数
        retData.activeNums = 0;               //活跃人数
        retData.shareRegisterNums = 0;        //分享新增
        retData.shareEnterNums = 0;           //分享活跃

        for(var i = 0; i < findData.length; i++){
            var model = findData[i];
            retData.attentionNums += model.attentionNums;
            retData.consumeNums += model.consumeNums;
            retData.consumeTotal += model.consumeTotal;
            // retData.register += model.register;
            retData.fans += model.fans;
            retData.vipNums += model.vipNums;
            retData.joinNums += model.joinNums;
            retData.joinTime += model.joinTime;
            retData.redBagNums += model.redBagNums;
            // retData.grabPlayerNums += model.grabPlayerNums;
            retData.rankOpenNums += model.rankOpenNums;
            retData.rankRewardNums += model.rankRewardNums;
            // retData.rankPlayerNums += model.rankPlayerNums;
            retData.taskDoneNums += model.taskDoneNums;
            // retData.taskDonePlayers += model.taskDonePlayers;
            retData.shareNums += model.shareNums;
            // retData.sharePlayers += model.sharePlayers;
            retData.shareRegisterNums += model.shareRegisterNums;
            retData.shareEnterNums += model.shareEnterNums;
        }
        //统计 活跃人数
        var activeData = await cloud.db.collection("join").aggregate([{
            $match: {
                stampTime: {
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: data.data.activeId,
            }
        }, {
            $group: {
                _id: '$userOpenId',
                count: {
                    $sum: 1
                }
            }
        }]);
        retData.activeNums = activeData.length;
        //新关注人数	attentionNums（汇总）------------------------
        var attentionNums = await cloud.db.collection("activityRecord").aggregate([
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
                    attentionNums: { $sum: '$attentionNums' }
                }
            }
        ]);
        if(attentionNums.length > 0){
            retData.attentionNums = attentionNums[0].attentionNums;
        }
        if(sTime > 1615978800000){
            //消费人数	consumeNums（汇总）----------------------------
            var consumeNums = await cloud.db.collection("join").aggregate([
                {
                    $match:{
                        stampTime:{$gte:sTime,$lte:eTime},
                        activeId:data.data.activeId,
                        consumeNums:{$gt:0}
                    }
                },
                {
                    $group:{
                        _id:"$userOpenId",
                        count:{$sum:1}
                    }
                }
            ]);
            console.log("consumeNums: ",consumeNums);
            if(consumeNums.length > 0){
                retData.consumeNums = consumeNums.length;
            }
            // 消费总额	consumeTotal（汇总）----------------------------
            var consumeTotal = await cloud.db.collection("join").aggregate([
                {
                    "$match":{
                        "stampTime":{"$gte":sTime,"$lte":eTime},
                        "activeId":data.data.activeId,
                        "consumeNums":{"$gt":0}
                    }
                },
                {
                    "$group":{
                        "_id":"null",
                        "consumeNums":{"$sum":"$consumeNums"}
                    }
                }
            ]);
            console.log("consumeTotal: ",consumeTotal);
            if(consumeTotal.length > 0){
                retData.consumeTotal = consumeTotal[0].consumeNums;
            }
        }
        
        //新增粉丝
        var fansData = await cloud.db.collection("join").aggregate([
            {
              $match: {
                    stampTime: { $gte:sTime , $lte:eTime},
                    activeId:data.data.activeId,
                    isVip:true
               }
            },
            {
              $group: {
               _id: '$userOpenId',
               count: { $sum: 1 }
              }
            }
        ]);
        retData.fans = fansData.length;
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
        retData.joinNums = joinNums[0].joinNums;
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
        retData.joinTime = joinTime[0].joinTime;
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
        retData.redBagNums = redBagNums[0].redBagNums;
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
        retData.taskDoneNums = taskDoneData[0].taskDoneNums;
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
            $or:[
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
            retData.shareEnterNums = shareEnterNums[0].shareEnterNums;
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
            retData.shareRegisterNums = shareRegisterNums[0].shareRegisterNums;
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
        retData.rankOpenNums = rankOpenNums[0].rankOpenNums;
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
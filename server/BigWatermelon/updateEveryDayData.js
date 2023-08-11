function isRetError(ret){
    if(!ret == null || ret == undefined || ret < 0) {
        return true;
    }
    return false;
}
module.exports = async (context) =>{
    console.log("updateEveryDayData");
    const cloud = context.cloud;
    var data = context.data;
    console.log("data: ",data);
    //检测 活动是否配置
    var findUserData = await cloud.db.collection("users").aggregate([
        {
            $match: {
                state: true,
                server: {
                    $eq: null
                }
            }
        },
        {
            $project: {
                userNick: 1,
                shopName: 1,
                activeId: 1,
                activeName: 1,
                createTime: 1
            }
        }
    ]);
    if(isRetError(findUserData)){
        return PackReturn(-2,"获取数据失败1");
    }
    console.log("findUserData.length: ",findUserData.length);
    if(findUserData.length <= 0){
        return false;
    }
    var eTime = 0;
    var sTime = 0;
    var strTime = "";
    if(data.hasOwnProperty("time")){
        //时间格式 参数
        var timeData = new Date(data.time);
        var year = timeData.getFullYear();
        var month = timeData.getMonth() + 1;
        var day = timeData.getDate();
        strTime = "" + year + "-" + month + "-" + day;
        var str_sTime = strTime + " 00:00:00";
        sTime = new Date(str_sTime).getTime();
        eTime = sTime + (24 * 3600 * 1000);
    }else{
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var day = time.getDate();
        strTime = "" + year + "-" + month + "-" + day;
        var str_sTime = strTime + " 00:00:00";
        eTime = new Date(str_sTime).getTime();
        sTime = eTime - (24 * 3600 * 1000);
    }
    
    if(data.hasOwnProperty("sTime")){
        sTime = data.sTime;
    }
    if(data.hasOwnProperty("eTime")){
        eTime = data.eTime;
    }
    for(var i = 0; i < findUserData.length; i++){
        var iActive = findUserData[i];
        var newData = new Object();
        //活动id
        newData.activeId = iActive.activeId;
        //商家名称 userNick
        newData.userNick = iActive.userNick;
        //店铺名称 shopName
        newData.shopName = iActive.shopName;
        //日期
        newData.time = strTime;
        //活跃人数
        var activeData = await cloud.db.collection("join").aggregate([{
            $match: {
                stampTime: {
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: iActive.activeId,
            }
        }, {
            $group: {
                _id: '$userOpenId',
                count: {
                    $sum: 1
                }
            }
        }]);
        // if(activeData.length < 30){
        //     continue;
        // }
        newData.activeNums = activeData.length;
        //新增人数
        var registerData =  await cloud.db.collection("join").aggregate([
            {
              $match: {
                    createTime: { 
                        $gte:sTime, 
                        $lte:eTime 
                    },
                    activeId: iActive.activeId
               }
            },
            {
              $group: {
               _id: '$userOpenId',
               count: { $sum: 1 }
              }
        }]);
        newData.register = registerData.length;
        // 参与游戏人数	enterGamePlayers
        var enterGamePlayers = await cloud.db.collection("bury").aggregate([
            {
                $match: {
                    time: { 
                        $gte:sTime, 
                        $lte:eTime 
                    },
                    activeId: iActive.activeId,
                    action:'enterGame'
                }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
            }
        ]);
        newData.enterGamePlayers = enterGamePlayers.length;
        //游戏参与率
        newData.enterGameRate = newData.activeNums > 0 ? "" + ((newData.enterGamePlayers / newData.activeNums) * 100).toFixed(2) + "%" : "0%";
        //人均时长
        var joinTime = await cloud.db.collection("bury").aggregate([
            {
                $match: {
                    time:{$gte: sTime,$lte: eTime},
                    action: "activeTime",
                    activeId: iActive.activeId,
                }
            },
            {
                $group: {
                    _id: 'null',
                    joinTime: { $sum: '$playTime' }
                }
            }
        ]);
        var totalJoinTime = 0;
        if(joinTime.length > 0){
            totalJoinTime = joinTime[0].joinTime;
        }
        newData.joinTime = newData.enterGamePlayers > 0 ? "" + (totalJoinTime / newData.enterGamePlayers).toFixed(2) + "s" : "0s";
        //分享率
        var shareData = await cloud.db.collection("join").aggregate([{
            $match: {
                stampTime: {
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: iActive.activeId,
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
        newData.shareRate = newData.enterGamePlayers > 0 ? "" + (shareData.length / newData.enterGamePlayers * 100).toFixed(2) + "%" : "0%";
        //分享进入人数
        var shareEnterNums = await cloud.db.collection("join").aggregate([
            {
            
            $match: {
                stampTime:{
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: iActive.activeId,
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
        newData.shareEnterNums = shareEnterNums.length;
        //分享回流率
        newData.shareBackRate = newData.enterGamePlayers > 0 ? "" + (shareEnterNums.length / newData.enterGamePlayers * 100).toFixed(2) + "%" : "0%";
        //粉丝活跃数
        var fansActiveData = await cloud.db.collection("join").aggregate([{
            $match: {
                stampTime: {
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: iActive.activeId,
                $or: [
                    {
                        isVip: true
                    },
                    {
                        isVipNow: true
                    },
                ]
            }
        }, {
            $group: {
                _id: '$userOpenId',
                count: {
                    $sum: 1
                }
            }
        }]);
        newData.fansActiveNum = fansActiveData.length;
        //会员活跃数
        var memberActiveNum = await cloud.db.collection("join").aggregate([{
            $match: {
                stampTime: {
                    $gte: sTime,
                    $lte: eTime
                },
                activeId: iActive.activeId,
                $or: [
                    {
                        isMember: true
                    },
                    {
                        isMemberNow: true
                    },
                ]
            }
        }, {
            $group: {
                _id: '$userOpenId',
                count: {
                    $sum: 1
                }
            }
        }]);
        newData.memberActiveNum = memberActiveNum.length;
        //次留时间
        var _sTime = sTime + (24 * 3600 * 1000);
        var _eTime = eTime + (24 * 3600 * 1000);
        //新增次留
        var addResult = await cloud.db.collection("join").aggregate([{
            $match: {
               createTime: {
                  $gte: sTime,
                  $lte: eTime
               },
               activeId: iActive.activeId,
            }
         }, {
            $group: {
               _id: '$userOpenId',
               count: {
                  $sum: 1
               }
            }
         }]);
         let addUserOpenIdList = [];
         for (let i = 0; i < addResult.length; i++) {
            addUserOpenIdList.push(addResult[i]._id)
         }
         let addRetainNums = await cloud.db.collection("join").count({
            activeId: iActive.activeId,
            stampTime: {
               $gte: _sTime,
               $lte: _eTime
            },
            userOpenId: {
               $in: addUserOpenIdList
            }
         })
         newData.addRetainNums = "" + (addResult.length > 0 && addRetainNums > 0 ? ((addRetainNums / addResult.length) * 100).toFixed(2) : 0) + "%";
        //活跃次留
        var activeResult = await cloud.db.collection("join").aggregate([{
            $match: {
               stampTime: {
                  $gte: sTime,
                  $lte: eTime
               },
               activeId: iActive.activeId,
            }
         }, {
            $group: {
               _id: '$userOpenId',
               count: {
                  $sum: 1
               }
            }
         }]);
         let activeUserOpenIdList = [];
         for (let i = 0; i < activeResult.length; i++) {
            activeUserOpenIdList.push(activeResult[i]._id)
         }
         let activeRetainNums = await cloud.db.collection("join").count({
            activeId: iActive.activeId,
            stampTime: {
               $gte: _sTime,
               $lte: _eTime
            },
            userOpenId: {
               $in: activeUserOpenIdList
            }
         })
         newData.activeRetainNums = "" +  (activeResult.length > 0 && activeRetainNums > 0 ? ((activeRetainNums / activeResult.length) * 100).toFixed(2) : 0) + "%";
        //订阅人数
        var fansData = await cloud.db.collection("join").aggregate([
            {
              $match: {
                    stampTime: { 
                        $gte:sTime, 
                        $lte:eTime
                    },
                    activeId: iActive.activeId,
                    isVip: true
               }
            },
            {
              $group: {
               _id: '$userOpenId',
               count: { $sum: 1 }
              }
            }
        ]);
        newData.fans = fansData.length;
        //订阅率
        newData.fansRate = newData.enterGamePlayers > 0 ? "" + (newData.fans / newData.enterGamePlayers * 100).toFixed(2) + "%" : "0%";
        //新增会员
        var vipData = await cloud.db.collection("join").aggregate([
            {
                $match: {
                    stampTime: { 
                        $gte:sTime, 
                        $lte:eTime 
                    },
                    activeId: iActive.activeId,
                    isMember: true
               }
            },
            {
              $group: {
               _id: '$userOpenId',
               count: { $sum: 1 }
              }
            }
        ]);
        newData.vipNums = vipData.length;
        //入会率
        newData.vipRate = newData.enterGamePlayers > 0 ? "" + (newData.vipNums / newData.enterGamePlayers * 100).toFixed(2) + "%": "0%";
        //收藏率
        var task_collect = await cloud.db.collection("bury").aggregate([
            {
              $match: {
                    time: { 
                        $gte:sTime, 
                        $lte:eTime 
                    },
                    activeId: iActive.activeId,
                    action:'collectGoods'
               }
            },
            {
              $group: {
               _id: '$userOpenId',
               count: { $sum: 1 }
              }
            }
        ]);
        newData.collectRate = newData.enterGamePlayers > 0 ? "" + (task_collect.length / newData.enterGamePlayers * 100).toFixed(2) + "%": "0%";
        //浏览商品率
        var look_id = "4";
        var task_look = await cloud.db.collection("bury").aggregate([
            {
              $match: {
                    time: { 
                        $gte:sTime, 
                        $lte:eTime 
                    },
                    activeId: iActive.activeId,
                    action:'exposure',
               }
            },
            {
              $group: {
               _id: '$userOpenId',
               count: { $sum: 1 }
              }
            }
        ]);
        newData.lookRate = newData.enterGamePlayers > 0 ? "" + (task_look.length / newData.enterGamePlayers * 100).toFixed(2) + "%": "0%";
        //消费人数
        var consumeNums = await cloud.db.collection("join").aggregate([
            {
                $match:{
                    stampTime:{
                        $gte:sTime,
                        $lte:eTime
                    },
                    activeId: iActive.activeId,
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
        newData.consumeNums = consumeNums.length;
        //消费金额
        var consumeTotal = await cloud.db.collection("join").aggregate([
            {
                "$match":{
                    "stampTime":{
                        "$gte":sTime,
                        "$lte":eTime
                    },
                    "activeId": iActive.activeId,
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
        var consumeTotalNums = 0;
        if(consumeTotal.length > 0){
            consumeTotalNums = consumeTotal[0].consumeNums;
        }
        newData.consumeTotal = consumeTotalNums;
        //客单价
        if(newData.consumeNums <= 0){
            newData.consumePrice = 0;
        }else{
            newData.consumePrice = newData.consumeNums > 0 ? "" + (newData.consumeTotal / newData.consumeNums).toFixed(2) : "0%";
        }

        //检测 是否已经有当天的数据
        var findActionTip = await cloud.db.collection("activeTip").find({
            activeId: iActive.activeId,
            time: strTime
        });
        if(isRetError(findActionTip) || findActionTip.length <= 0){
            //将整合数组 存储到数据库
            await cloud.db.collection("activeTip").insertOne(newData);
        }else{
            //更新 活动提醒 数据
            await cloud.db.collection("activeTip").updateMany({
                activeId: iActive.activeId,
                time: strTime
            },{
                $set: newData
            });
        }
    }

    return true;
}
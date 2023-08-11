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
//埋点数据综合 
module.exports = async (context) =>{
    console.log("==C_MSG_GET_BURY==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;

        var retData = new Object();
        var sTime = data.data.sTime;
        var eTime = data.data.eTime;
        //活跃人数
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

        //loadingRes
        var loadingNums = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "loadingRes"
        });
        retData.loadingNums = loadingNums;
        //进入加载页的人数	loadingPlayers
        var loadingPlayers = await cloud.db.collection("bury").aggregate([
            {
                $match: {
                    time: { $gte:sTime , $lte:eTime},
                    activeId:data.data.activeId,
                    action:'loadingRes'
                }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
            }
        ]);
        retData.loadingPlayers = loadingPlayers.length;
        //enterHall
        var enterHallNums = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "enterHall"
        });
        retData.enterHallNums = enterHallNums;

        //登录到主页人数	enterHallPlayers
        var enterHallPlayers = await cloud.db.collection("bury").aggregate([
            {
            
                $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    action:'enterHall'
                }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
            }
        ]);
        retData.enterHallPlayers = enterHallPlayers.length;
        //enterGame
        var enterGameNums = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "enterGame"
        });
        retData.enterGameNums = enterGameNums;
        // 参与游戏人数	enterGamePlayers
        var enterGamePlayers = await cloud.db.collection("bury").aggregate([
            {
                $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
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
        retData.enterGamePlayers = enterGamePlayers.length;
        //enterGame_type_0
        var enterGame_type_0 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "enterGame",
            type: 0
        });
        retData.enterGame_type_0 = enterGame_type_0;
        //enterGame_type_1
        var enterGame_type_1 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "enterGame",
            type: 1
        });
        retData.enterGame_type_1 = enterGame_type_1;
        //enterGame_type_2
        var enterGame_type_2 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "enterGame",
            type: 2
        });
        retData.enterGame_type_2 = enterGame_type_2;
        //joinFavor
        var joinFavorNums = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinFavor",
            type: {
                $gte: 0,
            }
        });
        retData.joinFavorNums = joinFavorNums;
        //关注店铺总人数	joinFavorPlayers
        var joinFavorPlayers = await cloud.db.collection("bury").aggregate([
            {
            
                $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    action:'joinFavor',
                    type: {
                        $gte: 0,
                    }
                }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
            }
        ]);
        retData.joinFavorPlayers = joinFavorPlayers.length;
        //joinFavor_type_0
        var joinFavor_type_0 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinFavor",
            type: 0
        });
        retData.joinFavor_type_0 = joinFavor_type_0;
        //joinFavor_type_1
        var joinFavor_type_1 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinFavor",
            type: 1
        });
        retData.joinFavor_type_1 = joinFavor_type_1;
        //joinFavor_type_2
        var joinFavor_type_2 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinFavor",
            type: 2
        });
        retData.joinFavor_type_2 = joinFavor_type_2;
        //joinMember
        var joinMemberNums = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinMember",
            type: {
                $gte: 0,
            }
        });
        retData.joinMemberNums = joinMemberNums;
        //加入会员总人数	joinMemberPlayers
        var joinMemberPlayers = await cloud.db.collection("bury").aggregate([
            {
                $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    action:'joinMember',
                    type: {
                        $gte: 0,
                    }
                }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
            }
        ]);
        retData.joinMemberPlayers = joinMemberPlayers.length;
        //joinMember_type_0
        var joinMember_type_0 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinMember",
            type: 0
        });
        retData.joinMember_type_0 = joinMember_type_0;
        //joinMember_type_1
        var joinMember_type_1 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinMember",
            type: 1
        });
        retData.joinMember_type_1 = joinMember_type_1;
        //joinMember_type_2
        var joinMember_type_2 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinMember",
            type: 2
        });
        retData.joinMember_type_2 = joinMember_type_2;
        //joinMember_type_3
        var joinMember_type_3 = await cloud.db.collection("bury").count({
            //openid: openid,
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: "joinMember",
            type: 3
        });
        retData.joinMember_type_3 = joinMember_type_3;

        //任务埋点数据  任务次数 任务人数
        //任务完成次数
        var list_task_id = [0,2,4,5,6,7,8,9,10,11,12,13,14];
        for(var i = 0; i < list_task_id.length; i++){
            var task_id = "" + list_task_id[i];
            var task_num = await cloud.db.collection("bury").count({
                //openid: openid,
                activeId: data.data.activeId,
                time: {
                    $gte: sTime,
                    $lte: eTime
                },
                action: "task",
                data: {
                    "task_id": task_id
                } 
            });
            retData["task_" + task_id] = task_num;
            // var strParse = JSON.parse("{task_id:" + );s
            var task_players = await cloud.db.collection("bury").aggregate([
                {
                  $match: {
                        time: { $gte:sTime , $lte:eTime },
                        activeId:data.data.activeId,
                        action:'task',
                        data: {
                            "task_id": task_id
                        } 
                   }
                },
                {
                  $group: {
                   _id: '$userOpenId',
                   count: { $sum: 1 }
                  }
                }
            ]);
            retData["task_" + task_id + "_players"] = task_players.length;
        }
        //筛选出 总粉丝数
        var fansTodayData = await cloud.db.collection("players").aggregate([
            {
              $match: {
                    stampTime: { $gte:sTime , $lte:eTime },
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
        retData.fansTotal_today = fansTodayData.length;
        //筛选出 会员数
        var memberTotalData = await cloud.db.collection("players").aggregate([
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
        retData.memberTotal_today = memberTotalData.length;
        // //淘宝任务
        // var findTBTaskData = await cloud.db.collection("bury").find({
        //     activeId: data.data.activeId,
        //     time: {
        //         $gte: sTime,
        //         $lte: eTime
        //     },
        //     action: "tbTask"
        // },{
        //     projection: {
        //         userOpenId: 1,
        //         title: 1
        //     }
        // });
        // if(isRetError(findTBTaskData)){
        //     return PackReturn(-2,"获取淘宝任务数据失败");
        // }
        // //淘宝-签到任务 浏览直播间15s 浏览店铺15s
        // //[任务插件]签到次数	tbTask_sign_nums
        // var tbTask_sign_nums = await cloud.db.collection("bury").count({
        //     activeId: data.data.activeId,
        //     time: {
        //         $gte: sTime,
        //         $lte: eTime
        //     },
        //     action: 'tbTask',
        //     title:'签到任务'
        // });
        // retData.tbTask_sign_nums = tbTask_sign_nums;
        // // //[任务插件]签到人数	tbTask_sign_players
        // var tbTask_sign_players = await cloud.db.collection("bury").aggregate([
        //     {
        //         $match: {
        //             time: { $gte:sTime , $lte:eTime },
        //             activeId:data.data.activeId,
        //             action:'tbTask',
        //             title:'签到任务'
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: '$userOpenId',
        //             count: { $sum: 1 }
        //         }
        //     }
        // ]);
        // retData.tbTask_sign_players = tbTask_sign_players.length;
        // //[任务插件]看直播次数	tbTask_look_live_nums
        // var tbTask_look_live_nums = await cloud.db.collection("bury").count({
        //     activeId: data.data.activeId,
        //     time: {
        //         $gte: sTime,
        //         $lte: eTime
        //     },
        //     action: 'tbTask',
        //     title:'浏览直播15S'
        // });
        // retData.tbTask_look_live_nums = tbTask_look_live_nums;
        // //[任务插件]看直播人数	tbTask_look_live_players
        // var tbTask_look_live_players = await cloud.db.collection("bury").aggregate([
        //     {
        //     $match: {
        //             time: { $gte:sTime , $lte:eTime },
        //             activeId:data.data.activeId,
        //             action:'tbTask',
        //             title:'浏览直播15S'
        //     }
        //     },
        //     {
        //         $group: {
        //             _id: '$userOpenId',
        //             count: { $sum: 1 }
        //         }
        //     }
        // ]);
        // retData.tbTask_look_live_players = tbTask_look_live_players.length;
        //[任务插件]看店铺次数	tbTask_look_shop_nums
        // var tbTask_look_shop_nums = await cloud.db.collection("bury").count({
        //     activeId: data.data.activeId,
        //     time: {
        //         $gte: sTime,
        //         $lte: eTime
        //     },
        //     action: 'tbTask',
        //     title:'浏览店铺15秒'
        // });
        // retData.tbTask_look_shop_nums = tbTask_look_shop_nums;
        // //[任务插件]看店铺人数	tbTask_look_shop_players
        // var tbTask_look_shop_players = await cloud.db.collection("bury").aggregate([
        //     {
        //     $match: {
        //             time: { $gte:sTime , $lte:eTime },
        //             activeId:data.data.activeId,
        //             action:'tbTask',
        //             title:'浏览店铺15秒'
        //     }
        //     },
        //     {
        //         $group: {
        //             _id: '$userOpenId',
        //             count: { $sum: 1 }
        //         }
        //     }
        // ]);
        // retData.tbTask_look_shop_players = tbTask_look_shop_players.length;
        // //筛选 打开奖池次数
        var findPoolDataNum = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'lookPrizePool'
        });
        retData.lookPrizePool_nums = findPoolDataNum;
        //查看奖池人数	lookPrizePool_players
        var findPoolPlayer = await cloud.db.collection("bury").aggregate([
            {
                $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    action:'lookPrizePool'
                }
            },
            {
                $group: {
                    _id: '$userOpenId',
                    count: { $sum: 1 }
                }
            }
        ]);
        retData.lookPrizePool_players = findPoolPlayer.length;
        //打开任务次数	openTask_nums openTask
        var openTaskNum = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'openTask'
        });
        retData.openTask_nums = openTaskNum;
        //打开任务人数	openTask_Players
        var openTaskPlayers = await cloud.db.collection("bury").aggregate([
        {
            $match: {
                time: { $gte:sTime , $lte:eTime },
                activeId:data.data.activeId,
                action:'openTask'
            }
        },
        {
            $group: {
                _id: '$userOpenId',
                count: { $sum: 1 }
            }
        }]);
        retData.openTask_Players = openTaskPlayers.length;
        //主界面 弹出礼包次数
        var hallShowGift_nums = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'hallShowGift'
        });
        retData.hallShowGift_nums = hallShowGift_nums;

        //主界面打开礼包次数	hallOpenGift_nums
        var hallOpenGift_nums = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'hallOpenGift'
        });
        retData.hallOpenGift_nums = hallOpenGift_nums;
        //主界面打开礼包人数	hallOpenGift_players
        var hallOpenGift_players = await cloud.db.collection("bury").aggregate([
        {
            $match: {
                time: { $gte:sTime , $lte:eTime },
                activeId:data.data.activeId,
                action:'hallOpenGift'
            }   
        },
        {
            $group: {
                _id: '$userOpenId',
                count: { $sum: 1 }
            }
        }]);
        retData.hallOpenGift_players = hallOpenGift_players.length;
        //主界面 弹出分享送牛的次数
        var hallShowShare_nums = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'hallShowGift'
        });
        retData.hallShowShare_nums = hallShowShare_nums;
        //主界面 打开分享送牛的次数
        var hallOpenShare_nums = await cloud.db.collection("bury").count({
            activeId: data.data.activeId,
            time: {
                $gte: sTime,
                $lte: eTime
            },
            action: 'hallOpenShare'
        });
        retData.hallOpenShare_nums = hallOpenShare_nums;
        //主界面分享人数	hallOpenShare_players
        var hallOpenShare_players = await cloud.db.collection("bury").aggregate([
            {
            $match: {
                    time: { $gte:sTime , $lte:eTime },
                    activeId:data.data.activeId,
                    action:'hallOpenShare'
            }
            },
            {
            $group: {
                _id: '$userOpenId',
                count: { $sum: 1 }
            }
        }]);
        retData.hallOpenShare_players = hallOpenShare_players.length;
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
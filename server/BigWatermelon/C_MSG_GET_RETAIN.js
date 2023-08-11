const moment = require('moment')
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
//单独获取留存数据接口
module.exports = async (context) =>{
    console.log("==C_MSG_GET_RETAIN==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        //  时间段 
        let sTime = Number(data.data.sTime);
        let eTime = Number(data.data.eTime);

        // 计算间隔天数
        let days = Math.floor((eTime - sTime) / 1000 / 60 / 60 / 24);

        // 今日时间
        let todayTime = moment().valueOf();

        let result = {
        active: [],
        add: []
        }

        for (let i = 0; i <= days; i++) {
            console.log("i: ",i);
            let _sTime = moment(sTime).add(i, 'days').valueOf();
            let _eTime = moment(_sTime).add(1, 'days').valueOf();
            console.log("_sTime: ",_sTime);
            console.log("_eTime: ",_eTime);
            // ***********活跃留存数据***********
            // 获取每日活跃用户留存
            // let activeResult = await cloud.db.collection("join").find({
            //     //openid: openid,
            //     activeId: data.data.activeId,
            //     stampTime: {
            //         $gte: _sTime,
            //         $lte: _eTime
            //     }
            // }, {
            //     projection: {
            //         userOpenId: 1
            //     }
            // });
            var activeResult = await cloud.db.collection("join").aggregate([
                {
                    $match: {
                        stampTime: { $gte:_sTime , $lte:_eTime},
                        activeId: data.data.activeId,
                    }
                },
                {
                    $group: {
                        _id: '$userOpenId',
                        count: { $sum: 1 }
                    }
                }
            ]);
            console.log("activeResult 第一个数据: ",activeResult[0]);
            // 活跃用户userOpenIdList
            let activeUserOpenIdList = [];
            for (let j = 0; j < activeResult.length; j++) {
                const item = activeResult[j];
                // activeUserOpenIdList.push(item.userOpenId)
                activeUserOpenIdList.push(item._id);
            }

            // ***********新增留存数据***********
            // let addResult = await cloud.db.collection("join").find({
            //     //openid: openid,
            //     activeId: data.data.activeId,
            //     createTime: {
            //         $gte: _sTime,
            //         $lte: _eTime
            //     }
            // }, {
            //     projection: {
            //         userOpenId: 1
            //     }
            // });

            var addResult = await cloud.db.collection("join").aggregate([
                {
                    $match: {
                        createTime: { $gte:_sTime , $lte:_eTime},
                        activeId: data.data.activeId
                    }
                },
                {
                    $group: {
                        _id: '$userOpenId',
                        count: { $sum: 1 }
                    }
                }
            ]);
            console.log("addResult 第一个数据: ",addResult[0]);
            // 新增用户userOpenIdList
            let addUserOpenIdList = [];
            for (let j = 0; j < addResult.length; j++) {
                const item = addResult[j];
                // addUserOpenIdList.push(item.userOpenId)
                addUserOpenIdList.push(item._id)
            }

            // 计算 当前日期的 7日留存
            let activeRetainResult = [];
            let addRetainResult = [];
            for (let j = 1; j <= 7; j++) {
                let tmpStime = moment(_sTime).add(j, 'days').valueOf();
                let tmpEtime = moment(tmpStime).add(1, 'days').valueOf();

                if (tmpStime > todayTime) {
                    continue;
                }

                // 活跃留存人数计算
                let activeRetainNums = await cloud.db.collection("join").count({
                    //openid: openid,
                    activeId: data.data.activeId,
                    stampTime: {
                        $gte: tmpStime,
                        $lte: tmpEtime
                    },
                    userOpenId: {
                        $in: activeUserOpenIdList
                    }
                })
                activeRetainResult.push({
                    retainTime: j,
                    retainNums: activeResult.length > 0 && activeRetainNums > 0 ? (activeRetainNums / activeResult.length).toFixed(4) * 100 : 0
                })

                // 新增留存人数计算
                let addRetainNums = await cloud.db.collection("join").count({
                    //openid: openid,
                    activeId: data.data.activeId,
                    stampTime: {
                        $gte: tmpStime,
                        $lte: tmpEtime
                    },
                    userOpenId: {
                        $in: addUserOpenIdList
                    }
                })
                addRetainResult.push({
                    retainTime: j,
                    retainNums: addResult.length > 0 && addRetainNums > 0 ? (addRetainNums / addResult.length).toFixed(4) * 100 : 0
                })
            }

            result.active.push({
                time: moment(_sTime).format('YYYY-MM-DD').valueOf(),
                retainNum: activeResult.length,
                retainResult: activeRetainResult,
            })
            result.add.push({
                time: moment(_sTime).format('YYYY-MM-DD').valueOf(),
                retainNum: addResult.length,
                retainResult: addRetainResult
            })
        }
        return PackReturn(code, message, result);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
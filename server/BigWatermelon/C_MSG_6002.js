var code = 0;
var message = "成功";

function bIsNull(a) {
    if (a !== null && a !== undefined) {
        return false;
    }
    return true;
}

function isRetError(ret) {
    if (!ret == null || ret == undefined || ret < 0) {
        return true;
    }
    return false;
}

function PackReturn(code, message, data) {
    if (data == undefined) {
        return JSON.stringify({
            code: code,
            message: message
        });
    } else {
        return JSON.stringify({
            code: code,
            message: message,
            data: data
        });
    }
}
// 下发公告信息 用于C端弹出显示
module.exports = async(context) => {
    console.log("==C_MSG_6002==");
    try {
        //时间段
        const cloud = context.cloud;
        var userOpenId = context.openId;
        var data = context.data.data;

        var sqlObj = new Object();
        sqlObj.name = "notice";
        if(data.data.hasOwnProperty("scene")){
            sqlObj.scene = data.data.scene;
        }
        if(data.data.hasOwnProperty("type")){
            sqlObj.type = data.data.type;
        }

        var findNoticeData = await cloud.db.collection("notice").find(sqlObj,{
            projection: {
                type: 1,
                msg: 1,
                scene: 1,
                haveImg: 1,
                ver: 1
            }
        });
        if(isRetError(findNoticeData)){
            return PackReturn(-1,"获取公告配置失败");
        }
        if(findNoticeData.length <= 0){
            return PackReturn(-2,"获取公告配置为空");
        }

        var findPlayerData = await cloud.db.collection("players").find({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        });
        if(isRetError(findPlayerData)){
            return PackReturn(-1,"获取玩家数据失败");
        }
        if(findPlayerData.length <= 0){
            return PackReturn(-2,"获取玩家数据为空");
        }
        // if(findPlayerData[0].hasOwnProperty("noticeVersion")){
        //     if(findPlayerData[0].noticeVersion == findNoticeData[0].ver){
        //         return PackReturn(-1,"公告已发");
        //     }
        // }
        // //更新玩家公告版本号
        // await cloud.db.collection("players").updateMany({
        //     activeId: data.data.activeId,
        //     userOpenId: userOpenId
        // },{
        //     $set: {
        //         noticeVersion: findNoticeData[0].ver
        //     }
        // });

        //是否购买了福袋
        findNoticeData[0]["isBuyLuckyBag"] = findPlayerData[0].isBuyLuckyBag;

        //大西瓜 根据B端配置 下发
        var findUserData = await cloud.db.collection("users").find({
            activeId: data.data.activeId
        },{
            projection: {
                bouncedConfig: 1
            }
        });
        if(isRetError(findUserData)){
            return PackReturn(-2,"获取活动数据失败");
        }
        console.log("findUserData.length: ",findUserData.length);
        console.log("scene: ",data.data.scene);
        if(findUserData.length > 0){
            //获取scene对应的 图片配置
            if(findUserData[0].bouncedConfig.hasOwnProperty("" + data.data.scene)){
                var sceneData = findUserData[0].bouncedConfig["" + data.data.scene];
                if(sceneData.hasOwnProperty("no")){
                    findNoticeData[0]["no"] = sceneData.no;
                }
                if(sceneData.hasOwnProperty("yes")){
                    findNoticeData[0]["yes"] = sceneData.yes;
                }
            }else{
                console.log("scene is null");
            }
        }
        return PackReturn(code,message,findNoticeData[0]);
    } catch (e) {
        return PackReturn(-4, "catch失败", e);
    }
}
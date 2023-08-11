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
//测试 手动增加机器人
module.exports = async (context) =>{
    console.log("==C_MSG_ADD_ROBOT==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var curTime = new Date().getTime();

        // var nameSet = new Set();
        // var headSet = new Set();
        // //随机30-40个机器人
        // var ranNums = Math.random() * 10;
        // var aiNums = 30 + parseInt(ranNums);
        // //先随机 名字和头像(去重)
        // for(var i = 0; i < 200; i++){
        //     var nameId = parseInt(Math.random() * 600);
        //     if(nameSet.has(nameId)){
        //         continue;
        //     }
        //     nameSet.add(nameId);
        //     if(nameSet.size >= aiNums){
        //         break;
        //     }
        // }
        // for(var i = 0; i < 200; i++){
        //     var headId = parseInt(Math.random() * 2248);
        //     if(headSet.has(headId)){
        //         continue;
        //     }
        //     headSet.add(headId);
        //     if(headSet.size >= aiNums){
        //         break;
        //     }
        // }

        // var list_name = Array.from(nameSet);
        // var list_head = Array.from(headSet);

        // for(var i = 0; i < aiNums; i++){
        //     var robot = new Object();
        //     robot.openid = openid;
        //     robot.activeId = data.data.activeId;
        //     robot.name = "robot";
        //     robot.type = parseInt(Math.random() * 2) + 1;
        //     robot.point = 0;
        //     robot.nameId = list_name[i];
        //     robot.headId = list_head[i];
        //     robot.updateTime = curTime;
        //     await cloud.db.collection("rank").insertOne(robot);
        // }
        var curID = data.data.activeId;
        var shopData = await cloud.db.collection("shop").find({
            //openid: openid,
            activeId: curID
        });
        if(isRetError(shopData) || shopData.length <= 0){
            var shop = new Object();
            shop.openid = userOpenId;
            shop.activeId = curID;
            shop.robot = true;
            await cloud.db.collection("shop").insertOne(shop);
            var nameSet = new Set();
            var headSet = new Set();
            //随机30-40个机器人
            var ranNums = Math.random() * 10;
            var aiNums = 30 + parseInt(ranNums);
            //先随机 名字和头像(去重)
            for(var i = 0; i < 200; i++){
                var nameId = parseInt(Math.random() * 600);
                if(nameSet.has(nameId)){
                    continue;
                }
                nameSet.add(nameId);
                if(nameSet.size >= aiNums){
                    break;
                }
            }
            for(var i = 0; i < 200; i++){
                var headId = parseInt(Math.random() * 2248);
                if(headSet.has(headId)){
                    continue;
                }
                headSet.add(headId);
                if(headSet.size >= aiNums){
                    break;
                }
            }

            var list_name = Array.from(nameSet);
            var list_head = Array.from(headSet);
            for(var i = 0; i < aiNums; i++){
                var robot = new Object();
                robot.openid = userOpenId;
                robot.activeId = curID;
                robot.name = "robot";
                robot.type = parseInt(Math.random() * 2) + 1;
                robot.point = 0;
                robot.nameId = list_name[i];
                robot.headId = list_head[i];
                robot.updateTime = curTime;
                await cloud.db.collection("rank").insertOne(robot);
            }
        }else{
            var rankData = await cloud.db.collection("rank").find({
                //openid: openid,
                activeId: curID
            });
            console.log("rankData: ",rankData.length);
            if(isRetError(rankData)){
                return PackReturn(-2,"获取数据失败");
            }else{

                var nameSet = new Set();
                var headSet = new Set();
                var aiNums = rankData.length;
                //先随机 名字和头像(去重)
                for(var i = 0; i < 200; i++){
                    var nameId = parseInt(Math.random() * 600);
                    if(nameSet.has(nameId)){
                        continue;
                    }
                    nameSet.add(nameId);
                    if(nameSet.size >= aiNums){
                        break;
                    }
                }
                for(var i = 0; i < 200; i++){
                    var headId = parseInt(Math.random() * 2248);
                    if(headSet.has(headId)){
                        continue;
                    }
                    headSet.add(headId);
                    if(headSet.size >= aiNums){
                        break;
                    }
                }
                var list_name = Array.from(nameSet);
                var list_head = Array.from(headSet);

                for(var i = 0; i < rankData.length; i++){
                    var i_data = rankData[i];
                    var robot = new Object();
                    robot.point = 0;
                    robot.type = parseInt(Math.random() * 2) + 1;
                    robot.nameId = list_name[i];
                    robot.headId = list_head[i];
                    robot.updateTime = curTime;
                    await cloud.db.collection("rank").updateMany({
                        _id: i_data._id,
                    },{
                        $set: robot
                    });
                }
            }
        }

    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
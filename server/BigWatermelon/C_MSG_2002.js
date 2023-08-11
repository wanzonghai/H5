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


//获取任务列表 
module.exports = async (context) =>{
    console.log("==2002==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        console.log("data: ",data.activeId);
        //活动配置
        var findUserData = await cloud.db.collection("users").find({
            activeId: data.data.activeId,
            state: true
        });
        if(isRetError(findUserData)){
            return PackReturn(-2,"获取数据失败1");
        }
        if(findUserData.length <= 0){
            return PackReturn(code,message,[]);
        }
        var parm = findUserData[0];
        //获取任务配置
        var findListTask = await cloud.db.collection("listTask").find({
            name: "listTask"
        });
        if(isRetError(findListTask)){
            return PackReturn(-2,"获取任务数据失败0")
        }
        
        //任务配置
        var findTaskData = await cloud.db.collection("task").find({
            activeId: data.data.activeId,
            userOpenId: userOpenId
        });
        if(isRetError(findTaskData)){
            return PackReturn(-2,"获取数据失败2");
        }
        if(findTaskData.length <= 0){
            return PackReturn(code,message,[]);
        }        
        //更新任务表
        var listTask = findTaskData[0].task;
        //自定义 限制配置
        if(parm.gameConfig.hasOwnProperty("missionConfig")){
            //是否 自定义奖励配置
            for(var i = 0; i < parm.gameConfig.missionConfig.length; i++){
                for(var k = 0; k < listTask.length; k++){
                    if(parm.gameConfig.missionConfig[i].id == listTask[k].id){
                        listTask[k].rewardCount_1 = parm.gameConfig.missionConfig[i].rewardCount_1;
                        listTask[k].rewardCount_2 = parm.gameConfig.missionConfig[i].rewardCount_2;
                        listTask[k].limit = parm.gameConfig.missionConfig[i].limit;
                        listTask[k].need = parm.gameConfig.missionConfig[i].need;
                        break;
                    }
                }
            }
        }
        //提取任务数据
        var keys = ["id","type","tType","rewardType","state","need","limit","finish","get","rewardCount_1","rewardCount_2","mType"];
        var newList = [];
        //判定特殊任务时间 2021-05-18 10：00：00
        var findSpecialTask = await cloud.db.collection("specialTask").find({
            name: "specialTask"
        });
        if(isRetError(findSpecialTask) || findSpecialTask.length <= 0){
            return PackReturn(-2,"获取特殊任务失败");
        }
        var strSpecialTime = findSpecialTask[0].time;
        var specialTime = new Date(strSpecialTime).getTime();
        var isSpecial = new Date().getTime() >= specialTime ? true : false;  
        console.log("isSpecial: ",isSpecial);
        listTask.forEach((element)=>{
            var newObj = new Object();
            keys.forEach((key)=>{
                if(element.hasOwnProperty(key)){
                    newObj[key] = element[key];
                }
            });
            //特殊任务
            if(element.id == 8){
                if(!isSpecial){
                    return;
                }
            }
            newList.push(newObj);
        });
        return PackReturn(code,message,newList);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
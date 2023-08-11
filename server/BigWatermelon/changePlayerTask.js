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
module.exports = async (context) =>{
    console.log("==changePlayerTask==");
    try {
        const cloud = context.cloud;
        var data = context.data;
        //针对活动id
        if(!data.hasOwnProperty("activeId")){
            return PackReturn(-2,"未上传活动id");
        }
        var activeId = data.activeId;
        //单独增加任务id
        var addTask_id = -1;
        var deleTask_id = -1;
        if(data.hasOwnProperty("addTask_id")){
            addTask_id = data.addTask_id;
        }
        if(data.hasOwnProperty("deleTask_id")){
            deleTask_id = data.deleTask_id;
        }
        //获取所有配置任务
        var findListTask = await cloud.db.collection("listTask").find({
            name: "listTask"
        });
        if(isRetError(findListTask) || findListTask.length <= 0){
            return PackReturn(-2,"获取任务数据失败0")
        }
        //新加
        if(addTask_id != -1){
            var addModel = null;
            findListTask[0].task.forEach(element => {
                if(element.id == addTask_id){
                    addModel = element;
                    return;
                }
            });
            if(!addModel){
                return PackReturn(-3,"未找到需要新加的任务");
            }
            //提取 任务需要的数据
            var newData = new Object();
            newData.id = addModel.id;
            newData.type = addModel.type;
            newData.need = addModel.need;
            newData.limit = addModel.limit;
            newData.finish = 0;
            newData.get = 0;
            newData.state = 1;
            newData.done = 0;
            newData.rewardType = addModel.rewardType;
            newData.rewardCount_1 = addModel.rewardCount_1;
            newData.rewardCount_2 = addModel.rewardCount_2;
            //避免添加重复id
            await cloud.db.collection("task").updateMany({
                activeId: activeId,
                "task.id": {
                    $ne: addTask_id
                }
            },{
                $push: {
                    task: newData
                }
            });
        }
        //删除
        if(deleTask_id != -1){
            await cloud.db.collection("task").updateMany({
                activeId: activeId
            },{
                $pull: {
                    task: {
                        id: deleTask_id
                    }
                }
            });
        }
    } catch (e) {
        return JSON.stringify({code:-4,message:"catch失败",e});
    }
}
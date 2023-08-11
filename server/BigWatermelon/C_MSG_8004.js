
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
//获取特殊任务 商品id
module.exports = async (context) =>{
    console.log("==8004==");
    try {
        const cloud = context.cloud;
        var findSpecialTask = await cloud.db.collection("specialTask").find({
            name: "specialTask"
        });
        if(isRetError(findSpecialTask) || findSpecialTask.length <= 0){
            return PackReturn(-2,"获取特殊任务失败");
        }
        var retData = new Object();
        retData.num_iid = findSpecialTask[0].num_iid;
        retData.time = findSpecialTask[0].time;
        retData.title = findSpecialTask[0].title;
        retData.price = findSpecialTask[0].price;
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
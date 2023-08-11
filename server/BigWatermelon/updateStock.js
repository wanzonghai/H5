
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
//更新 库存
module.exports = async (context) =>{
    console.log("updateStock");
    try {
        const cloud = context.cloud;
        //检测 活动是否配置
        var findStock = await cloud.db.collection("stock").aggregate([
            {
                $match: {
                    "resetConfig.state": true
                }
            },
            {
                $project: {
                    activeId: 1,
                    resetConfig: 1,
                    stockConfig: 1,
                    resetTime: 1
                }
            }
        ]);
        if(isRetError(findStock)){
            return PackReturn(-2,"获取数据失败1");
        }
        if(findStock.length <= 0){
            return false;
        }
        var timeData = new Date();
        var curTime = timeData.getTime();
        var year = timeData.getFullYear();
        var month = timeData.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        var day = timeData.getDate();
        day = day < 10 ? "0" + day : day;
        for(var i = 0; i < findStock.length; i++){
            var iStock = findStock[i];
            var time = iStock.resetConfig.time;
            //时间转换
            var strTime = "" + year + "-" + month + "-" + day + " " + time;
            var destTime = new Date(strTime).getTime();
            //时间未到
            if(curTime < destTime){
                console.log("未到时间");
                continue;
            }
            //时间范围判定
            if(iStock.hasOwnProperty("resetTime")){
                if(iStock.resetTime >= destTime){
                    console.log("今日已重置");
                    continue;
                }
            }
            //重置 库存
            var newStockConfig = iStock.stockConfig;
            for(var k = 0; k < newStockConfig.length; k++){
                newStockConfig[k].nums = newStockConfig[k].total;
            }
            //更新表
            await cloud.db.collection("stock").updateMany({
                activeId: iStock.activeId
            },{
                $set: {
                    resetTime: curTime,
                    stockConfig: newStockConfig
                }
            });
        }
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
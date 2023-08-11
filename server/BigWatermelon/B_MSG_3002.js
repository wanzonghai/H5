var code = 0;
var message = "成功";
function bIsNull(a) {
    if(a !== null && a !== undefined) {
        return false;
    }
    return true;
}
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
//获取活动数据
module.exports = async (context) =>{
    console.log("**3002**");
    try {
        const cloud = context.cloud;
        const data = context.data;
        const openid = context.appOwnerOpenId;
        //获取全部活动
        var findData = await cloud.db.collection("users").find({ 
            //openid: openid,
            activeId: data.data.activeId
        });
        // console.log("findData: ",findData);
        if(isRetError(findData)){
            return PackReturn(-2,"暂无活动配置数据~");
        }
        var findStock = await cloud.db.collection("stock").find({
            activeId: data.data.activeId
        },{
            projection: {
                stockConfig: 1,
                mergeConfig: 1
            }
        });
        if(isRetError(findStock)){
            return PackReturn(-2,"获取库存数据失败~");
        }
        //大西瓜 增加 库存 字段
        if(findStock[0].hasOwnProperty("stockConfig")){
            findData[0]["stockConfig"] = findStock[0].stockConfig;
        }
        //大西瓜  增加合成奖励 库存字段
        if(findStock[0].hasOwnProperty("mergeConfig")){
            findData[0]["mergeConfig"] = findStock[0].mergeConfig;
        }
        return PackReturn(code,message,findData[0]);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
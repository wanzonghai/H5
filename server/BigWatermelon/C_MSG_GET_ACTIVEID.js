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
//获取配置活动list
module.exports = async (context) => {
    console.log("==C_MSG_GET_ACTIVEID==");
    try {
        const cloud = context.cloud;
        const ret = await cloud.db.collection("users").find(
            {  
                //openid: openid,
                name: "users",
                // state: true
            }, 
            {  
                //活动名称  活动Id
                projection: {
                    activeName: 1,
                    activeId: 1,
                },
                sort: { createTime: -1 }
            }
        )
        if(isRetError(ret)){
            return PackReturn(-2,"获取配置活动list失败");
        }
        var list = [];
        if(ret.length > 0){
            for(var i = 0;i < ret.length; i++){
                list.push({
                    activeName: ret[i].activeName,
                    activeId: ret[i].activeId
                });
            }
        }
        return PackReturn(code,message,list);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
 }
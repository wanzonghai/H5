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
    console.log("**3010**");
    try {
        const cloud = context.cloud;
        const openid = context.appOwnerOpenId;
        const userOpenId = context.openId;
        const ret = await cloud.db.collection("users").find(
            {  
                //openid: openid,
                creatorId: userOpenId
            }, 
            {  
                //活动名称  活动Id
                projection: {
                    activeName: 1,
                    activeId: 1,
                    createTime: 1,
                    state: 1
                }, 
                sort: {
                    state: -1
                }
            }
        )
        if(isRetError(ret)){
            return PackReturn(-2,"获取配置活动list失败");
        }
        return PackReturn(code,message,ret);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
 }

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
//获取当前活动状态
module.exports = async (context) =>{
    console.log("==1002==");
    try {
        const cloud = context.cloud;
        var data = context.data.data;
        if(!data.hasOwnProperty("data")){
            return PackReturn(-1,"data is undefined");
        }
        if(!data.data.hasOwnProperty("activeId")){
            return PackReturn(-1,"未上传活动id");
        }
        var findUserData = await cloud.db.collection("users").find({
            activeId: data.data.activeId
        },{
            $project: {
                sTime: 1,
                eTime: 1
            }
        });
        if(isRetError(findUserData) || findUserData.length <= 0){
            return PackReturn(-2,"获取活动数据失败");
        }
        var retData = new Object();
        var isSet = false;
        var userParm = findUserData[0];
        if(userParm.hasOwnProperty("sTime")){
            if(userParm.sTime > new Date().getTime()){
                retData.state = 0;
                isSet = true;
            }
        }
        if(userParm.hasOwnProperty("eTime")){
            if(userParm.eTime < new Date().getTime()){
                retData.state = 2;
                isSet = true;
            }
        }
        if(!isSet){
            retData.state = 1;
        }
        return PackReturn(code,message,retData);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
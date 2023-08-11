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
//上报收货人信息
module.exports = async (context) =>{
    console.log("==1032==");
    try {
        var data = context.data.data;
        const userOpenId = context.openId;
        const openid = context.appOwnerOpenId;
        const cloud = context.cloud;
        var province = "";
        var city = "";
        var county = "";
        var street = "";
        var detailInfo = "";
        var address = "";
        var name = "";
        var phone = "";
        console.log("data: ",data.data)
        //省
        if(data.data.hasOwnProperty("province")){
            province = data.data.province;
        }
        //市
        if(data.data.hasOwnProperty("city")){
            city = data.data.city;
        }
        //城镇
        if(data.data.hasOwnProperty("county")){
            county = data.data.county;
        }
        //街道
        if(data.data.hasOwnProperty("street")){
            street = data.data.street;
        }
        //详细信息
        if(data.data.hasOwnProperty("detailInfo")){
            detailInfo = data.data.detailInfo;
        }
        //address
        if(data.data.hasOwnProperty("address")){
            address = data.data.address;
        }
        //name
        if(data.data.hasOwnProperty("name")){
            name = data.data.name;
        }
        //phone
        if(data.data.hasOwnProperty("phone")){
            phone = data.data.phone;
        }
        
        var retData = await cloud.db.collection("winner").updateMany({ 
            //openid: openid,
            userOpenId: userOpenId,
            activeId: data.data.activeId,
            rewardTime: data.data.rewardTime,
            "rewardInfo.num_iid": data.data.id
        },{
            $set: {
                address: address,
                consignee: name,
                phone: phone,
                province: province,
                city: city,
                county: county,
                street: street,
                "rewardInfo.state": 1
            }
        });
        if(isRetError(retData)){
            return PackReturn(-2,"上报失败");
        }
        return PackReturn(code,message);
    } catch (e) {
        return PackReturn(-4,"catch失败",e);
    }
}
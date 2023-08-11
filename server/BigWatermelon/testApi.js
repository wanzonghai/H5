module.exports = async (context) => {

    console.log(`开始测试`);

    function PackReturn (code, message, data) {

        return JSON.stringify({code: code, message: message, data: data});
    }

    try {

        var code = 0;
        var message = "";
        var retData = {};

        //检查是否是调试模式
        var bIsDebug = false;
        var debugAccessToken=null;
        const findData = await context.cloud.db.collection("debug").find({uuid:10001});
        if (findData.length > 0) //存在旧的
        {
          bIsDebug = findData[0].debug;
          debugAccessToken = findData[0].accessToken;
        }

        //console.log(`1------------------->>>(${JSON.stringify(context)})`);
        const resposeData = await context.cloud.topApi.invoke({

          api: 'taobao.user.seller.get',

          data: {
            'fields': 'user_id,nick',
            'session': debugAccessToken //测试时候填商家授权acccessToken
          },
          
          autoSession: !bIsDebug  //测试时候填false
        });

        console.log(`test!${JSON.stringify(resposeData)}`);//{"user":{"nick":"小爱灵动互动娱乐","user_id":2210005895332},"request_id":"7hdaiexrq1bq"}

        if (resposeData.user.user_id > 0) //商品总数
        {
            code = 0;
            message = "OK";
            retData = resposeData.user;
        }
        else 
        {
            code = -1;
            message = "没有找到商家！";
        }

        return PackReturn(code, message, retData);
    } 
    catch (e) {

        return PackReturn(-4, `Error:(${e})`);
    }
    finally {
       
        console.log(`结束测试`);
    }
};





module.exports = async (context) => {

    console.log(`开始测试`);

    function IsNull(a) {

      if (a !== null && a !== undefined) {
      
        return false;
      }

      return true;
    }

    function PackReturn (code, message, data) {

        return JSON.stringify({code: code, message: message, data: data});
    }

    try 
    {
      var code = 0;
      var message = "OK";
      var retData = { debug: context.data.debug };

      const findData = await context.cloud.db.collection("debug").find({uuid:10001});

      if (findData.length > 0) //存在旧的,更新
      {
        var newData = findData[0];
        console.log("context.data: ",context.data);
        
        newData.debug = context.data.debug;
        console.log("newData： ",newData);
        newData.accessToken = newData.debug == true ? context.accessToken : "";

        const ret = await context.cloud.db.collection("debug").updateMany({uuid:10001}, { $set: newData });
        console.log("ret ",ret);
        if (ret < 0) //ret是受影响条数
        {
          code = -1;
          message = "修改失败";
        }
      }
      else //插入
      {
        var newData = {
          
          uuid:10001,
          debug: context.data.debug,
          accessToken: context.data.debug == true ? context.accessToken : ""
        }

        const ret = await context.cloud.db.collection("debug").insertOne(newData);

        if (IsNull(ret)) {

          code = -2;
          message = "插入失败";
        }
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





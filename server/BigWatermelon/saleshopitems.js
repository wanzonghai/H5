module.exports = async (context) => {

   console.log(`开始测试`);

   function PackReturn(code, message, data) {

      return JSON.stringify({ code: code, message: message, data: data });
   }

   try {

      var code = 0;
      var message = "";
      var retData = {};

      //检查是否是调试模式
      var bIsDebug = false;
      var debugAccessToken = null;

      const data = context.data;
      console.log('-----data', data)

      const findData = await context.cloud.db.collection("debug").find({ uuid: 10001 });
      if (findData.length > 0) //存在旧的
      {
         bIsDebug = findData[0].debug;
         debugAccessToken = findData[0].accessToken;
      }

      if (data.data.type === 'search') {
         const searchResult = await context.cloud.topApi.invoke({
            api: 'taobao.items.onsale.get',
            data: {
               'q': data.data.title,
               'fields': 'num_iid,title,pic_url,approve_status,price,seller_cids,num',
               'session': debugAccessToken //测试时候填商家授权acccessToken
            },
            autoSession: !bIsDebug  //测试时候填false
         });
         console.log('data.data.title', data.data.title)
         console.log('searchResult', searchResult)
         let res = {
            shipTotal: searchResult.total_results > 0 ? searchResult.total_results : 0,
            list: searchResult.items ? searchResult.items.item : []
         }
         return PackReturn(code, "OK", res);
      } else {

         const shipTotal = await context.cloud.topApi.invoke({

            api: 'taobao.items.onsale.get',

            data: {
               'fields': 'num_iid,title,pic_url,approve_status,price,seller_cids,num',
               'session': debugAccessToken //测试时候填商家授权acccessToken
            },

            autoSession: !bIsDebug  //测试时候填false
         });

         const resposeData = await context.cloud.topApi.invoke({

            api: 'taobao.items.onsale.get',

            data: {
               'fields': 'num_iid,title,pic_url,approve_status,price,seller_cids,num',
               'page_no': data.data.skip,
               'page_size': data.data.limit,
               'session': debugAccessToken //测试时候填商家授权acccessToken
            },

            autoSession: !bIsDebug  //测试时候填false
         });
         console.log('-----商家商品数:-------', resposeData.items)
         console.log(`test!${JSON.stringify(resposeData)}`);

         if (resposeData.total_results > 0) //商品总数
         {
            code = 0;
            message = "OK";
            retData = resposeData.items.item;
         }
         else {
            code = -1;
            message = "没有找到商品！";
         }
         let res = {
            shipTotal: shipTotal.total_results > 0 ? shipTotal.total_results : 0,
            list: resposeData.items.item
         }

         return PackReturn(code, message, res);
      }

   } catch (e) {

      console.log(`添加失败!(${e})`);
      return PackReturn(-4, `Error:(${JSON.stringify(e)})`);
   }
   finally {
      console.log(`结束测试`);
   }
};





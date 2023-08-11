const xlsx = require('node-xlsx');

function isRetError(ret){
    if(!ret == null || ret == undefined || ret < 0) {
        return true;
    }
    return false;
}
module.exports = async (context) =>{
    console.log("==changeDataToCsv==");
    try {
        const cloud = context.cloud;
        var data = context.data;
        var time = "" + new Date().getTime();
        //按照赛季 更新任务
        var strTime = "";
        if(data.hasOwnProperty("time")){
            var timeData = new Date(data.time);
            var year = timeData.getFullYear();
            var month = timeData.getMonth() + 1;
            var day = timeData.getDate();
            strTime = "" + year + "-" + month + "-" + day;
        }else{
            var time = new Date();
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            var day = time.getDate();
            strTime = "" + year + "-" + month + "-" + day;
            var str_sTime = strTime + " 00:00:00";
            var eTime = new Date(str_sTime).getTime();
            var sTime = eTime - (24 * 3600 * 1000);
            //昨日时间
            var preTime = new Date(sTime);
            var preYear = preTime.getFullYear();
            var preMonth = preTime.getMonth() + 1;
            var preDay = preTime.getDate();
            var strPreTime = "" + preYear + "-" + preMonth + "-" + preDay;
        }
        
        var findData = await cloud.db.collection("activeTip").aggregate([
            {
                $match: {
                    time: strTime
                }
            }
        ]);
        console.log("findData: ",findData.length);
        //数据字段
        var key_list = ["userNick","shopName","activeId","time","activeNums","register","enterGamePlayers",
            "enterGameRate","joinTime","shareRate","shareEnterNums","shareBackRate","fansActiveNum","memberActiveNum",
            "addRetainNums","activeRetainNums","fans","fansRate","vipNums","vipRate","collectRate","lookRate","consumeNums",
            "consumeTotal","consumePrice"
        ];
        // var strCsv = "";
        // //表头字段
        // for(var i = 0; i < key_list.length; i++){
        //     strCsv += key_list[i] + "  ";
        // }
        // strCsv += "\n";
        // //增加表内容
        // for(var i = 0; i < findData.length; i++){
        //     var i_data = findData[i];
        //     for(var k = 0; k < key_list.length; k++){
        //         if(key_list[k] == "time"){
        //             strCsv += strPreTime + "  ";
        //         }else{
        //             strCsv += i_data["" + key_list[k]] + "  ";
        //         }
        //     }
        //     strCsv += "\n";
        // }

        var allData = [];
        allData.push(key_list);
        for(var i = 0; i < findData.length; i++){
            var i_data = findData[i];
            var i_arr = [];
            for(var k = 0; k < key_list.length; k++){
                i_arr.push(i_data["" + key_list[k]]);
            }
            allData.push(i_arr);
        }
        let buffer = await xlsx.build([
            {
                name: 'worksheets',
                data: allData
            }
        ])
        //文件导出名字
        var fileName = "activeTip_" + strTime;
        if(data.hasOwnProperty("fileName")){
            fileName = data.fileName;
        }
        let result = await cloud.file.uploadFile({
            fileContent: buffer,
            fileName: fileName 
        })
        return JSON.stringify({code:0,message:"成功",result});
    } catch (e) {
        return JSON.stringify({code:-4,message:"catch失败",e});
    }
}
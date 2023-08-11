// import cloud from '@tbmp/mp-cloud-sdk';

let cloudFunction = 'BigWatermelon';
var points = {
    /**
     * 
     * @param {*} action 行为
     * @param {*} type  类型
     * @param {*} value 数值
     */
    async setLog(data) {

        // 写入埋点
        // await cloud.function.invoke(cloudFunction, {
        //     data: data
        // }, 'B_MSG_5001');
    }
}

export default {
    points
}
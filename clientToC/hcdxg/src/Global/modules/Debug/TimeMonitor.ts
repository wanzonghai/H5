import { DebugConfig } from "../../DebugConfig";

/**
 * 时间监视器
 * 用来输出每段逻辑用时（测试用）
 */
export default class TimeMonitor {
    private static keyName: { [key: string]: { useS: boolean, time: number[] } } = {};
    /**
     * 开始计时
     * @param _key 键名
     * @param _showS 是否使用秒计时（false为毫秒）
     */
    static start(_key: string, _useS = true) {
        if (!DebugConfig.TimeMonitor.enable) {
            return;
        }
        this.keyName[_key] = { useS: _useS, time: [] };
        this.keyName[_key].time[0] = (new Date()).getTime();
        if (this.keyName[_key].useS) {
            this.keyName[_key].time[0] /= 1000;
        }
        console.info(`监测-[${_key}]: ${this.keyName[_key].time[0]} 开始`);
    }
    /**
     * 增加打点
     * @param _key 键名
     * @param _tag 打点标签
     */
    static dot(_key: string, _tag = '') {
        if (!DebugConfig.TimeMonitor.enable) {
            return null;
        }
        if (!(_key in this.keyName)) {
            this.start(_key);
            return null;
        }
        let _time = (new Date()).getTime();
        if (this.keyName[_key].useS) {
            _time /= 1000;
        }
        console.info(`监测-[${_key} ${_tag}]:`, `本次用时：${_time - this.keyName[_key].time[this.keyName[_key].time.length - 1]}`
            , `总用时：${_time - this.keyName[_key].time[0]}`, `当前：${_time}`);
        this.keyName[_key].time.push(_time);
        return _time - this.keyName[_key].time[0];
    }
    static reportPerformance(_id: string) {
        if ((window as any).myLastTime 
        // && typeof wx !== 'undefined' && wx.reportPerformance
        ) {
            let _curTime = Date.now();
            let _dif = _curTime - (window as any).myLastTime;
            // wx.reportPerformance(_id, _dif);
            (window as any).myLastTime = _curTime;
            // //之后不再判断
            // if (_id == '2005' || _id == '2006') {
            //     (window as any).myLastTime = 0;
            // }
            console.log('监测：', _id, _dif);
        }
    }

}
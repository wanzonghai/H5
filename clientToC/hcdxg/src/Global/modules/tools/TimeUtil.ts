/**
 * 时间等待
 */
export default class TimeUtil {
    static wait(ms: number) {
        return new Promise(rs => {
            setTimeout(rs, ms);
        })
    }

    static waitFrame(frame: number = 1) {
        return new Promise<void>(rs => {
            let finished = 0;
            let wait = function () {
                requestAnimationFrame(() => {
                    if (++finished >= frame) {
                        rs();
                    }
                    else {
                        wait()
                    }
                })
            }
            wait();
        })
    }
    //按钮等待,给按钮加入按下间隔,防止重复点击,返回为true时不能点击
    private static _cantouch: any = {};
    static ButtonWait(key = 'btn', _time = 300): boolean {
        if (key in TimeUtil._cantouch) {
            return true;
        }
        TimeUtil._cantouch[key] = true;
        setTimeout(() => {
            delete TimeUtil._cantouch[key];
        }, _time);
        return false;
    }

}

//时钟事件
export interface ClockEventType {
    tag?: string,//事件名,用来确定唯一,默认随机
    type?: 'once' | 'continue',//事件类型（一次性/持续触发事件）默认continue
    interval?: number, //间隔时间(最小0.001s)默认0.1

    callBack: (clockTag: string, tag: string, _n: number) => void //触发回调(tag:事件名,_n:第几次触发)
}
//时钟类型
export interface ClockType {
    id: any,
    interval: number,//(最小0.001s)
    eventList: { [tag: string]: ClockEventType },

    time: number,
    resume: boolean,
}

//计时器
export class ClockUtil {

    private static allClock: { [tag: string]: ClockType } = {};
    //开启一个计时器
    static Start(_tag: string, _interval = 0.1) {

        this.createClock(_tag, _interval);
    }
    //重置计时器
    static Reset(_tag: string) {
        if (!(_tag in this.allClock)) {
            console.error('【Reset】计时器不存在', _tag);

            return false;
        }

        console.log('重置计时器', _tag);
        this.allClock[_tag].time = 0;

        return true;
    }
    //暂停计时器
    static Pause(_tag: string) {

        if (!(_tag in this.allClock)) {
            console.error('【Pause】计时器不存在', _tag);

            return false;
        }

        console.log('暂停计时器', _tag);
        this.allClock[_tag].resume = false;
    }
    //继续计时器
    static Resume(_tag: string) {

        if (!(_tag in this.allClock)) {
            console.error('【Resume】计时器不存在', _tag);

            return false;
        }

        console.log('继续计时器', _tag);
        this.allClock[_tag].resume = true;

    }
    //停止计时器
    static Stop(_tag: string) {
        if (!(_tag in this.allClock)) {
            if (this.allClock[_tag]) {
                clearInterval(this.allClock[_tag].id);
            }
            delete this.allClock[_tag];
            return true;
        }
        console.log('停止计时器', _tag);

        return false;

    }
    //插入事件
    static insertEvent(_tag: string, _event: ClockEventType) {
        if (!(_tag in this.allClock)) {
            console.error('【insertEvent】计时器不存在', _tag);

            return false;
        }
        this.allClock[_tag].eventList[_event.tag] = _event;
        //可选项设置默认值
        _event.interval = _event.interval || 0.1;
        _event.tag = _event.tag || ('tag_' + Object.keys(this.allClock[_tag].eventList).length);
        _event.type = _event.type || 'continue';

        //添加计数变量
        _event['curN'] = 0;
        console.log('计时器插入事件', _tag, JSON.stringify(_event));


        return true;
    }
    //移除事件
    static removeEvent(_tag: string, _eventTag: string) {
        if (!(_tag in this.allClock)) {
            console.error('【removeEvent】计时器不存在', _tag);

            return false;
        }
        console.log('计时器移除事件', _tag, _eventTag);
        if (_eventTag in this.allClock[_tag].eventList) {
            delete this.allClock[_tag].eventList[_eventTag];
        }
        return true;

    }
    /**
     * 获取计时器当前时间
     * @param _tag 
     * @returns 
     */
    static GetTime(_tag: string) {
        if (!(_tag in this.allClock)) {
            console.error('【GetTime】计时器不存在', _tag);

            return 0;
        }
        return this.allClock[_tag].time;
    }
    private static createClock(_tag: string, _interval: number) {
        //如果有计时器先销毁
        if (_tag in this.allClock) {
            clearInterval(this.allClock[_tag].id);
        }
        //创建新计时器
        let _clock: ClockType = { id: 0, time: 0, interval: _interval, eventList: {}, resume: true }

        _clock.id = setInterval(() => {
            //暂停时不增加计时
            if (!_clock.resume) {
                return;
            }
            //保留小数点后三位即毫秒
            _clock.time = Number((_clock.time + _clock.interval).toFixed(3));

            //检测触发事件
            for (const key in _clock.eventList) {
                let _e = _clock.eventList[key];

                if (_e.type == 'once') {
                    if (_clock.time >= _e.interval) {
                        _e['curN']++;
                        _e.callBack && _e.callBack(_tag, _e.tag, _e['curN']);
                        delete _clock.eventList[key];
                    }
                }
                else if (_e.type == 'continue') {
                    if (((_clock.time * 1000) | 0) % ((_e.interval * 1000) | 0) == 0) {
                        _e['curN']++;
                        _e.callBack && _e.callBack(_tag, _e.tag, _e['curN']);
                    }

                }

            }
        }, _interval * 1000);
        this.allClock[_tag] = _clock;
        console.log('创建计时器', _clock);
        // console.log('所有计时器', this.allClock);

    }
}

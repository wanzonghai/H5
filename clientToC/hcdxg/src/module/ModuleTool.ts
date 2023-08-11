// import SoundPlayer from "../common/SoundPlayer";

declare var my;

/**
 * 模块公用的一些工具
 */
export class ModuleTool {
    //截取指定长度的字符串，省略部分补...
    public static getCutString(str, length) {
        let newStr = "";
        let lastStr = "";
        var regNum = new RegExp(/^[0-9]*$/);
        var regStr = new RegExp(/(?!.*?_$)[a-zA-Z0-9_]+$/);
        for (let i = 0; i < str.length; i++) {
            if (i < length) {
                if ((regNum.test(lastStr) && !regStr.test(str[i])) || (!regStr.test(lastStr) && regNum.test(str[i]))) {
                    newStr += " " + str[i];
                }
                else {
                    newStr += str[i];
                }
                lastStr = str[i];
            }
            else if (i == length) {
                newStr += "...";
            }
            else {
                break;
            }
        }
        return newStr;
    }
    /**
     * 根据秒数返回时间	例如:123秒=02:03;
     */
    public static SurviveTimeToString(surviveSecond: number): string {

        var str: string = "";

        if (surviveSecond < 0) {

            str = "00分00秒";//负的时间

        } else if (surviveSecond >= 0 && surviveSecond < 60) {

            var strSecond: String = surviveSecond < 10 ? "0" + surviveSecond : surviveSecond.toString();
            str = "00分" + strSecond + "秒";

        } else {

            var strYuSecond: number = Math.floor(surviveSecond % 60);//余:秒数
            var strZongMinute: number = Math.floor(surviveSecond / 60);//总:分钟
            var strYuMinute: number = strZongMinute % 60;//余:分钟
            var strZongHour: number = Math.floor(strZongMinute / 60);//总:小时

            if (strZongHour < 24)//小于一天
            {
                if (strZongHour != 0) {

                    str = (strZongHour < 10 ? "0" + strZongHour : strZongHour) + "时" + (strYuMinute < 10 ? "0" + strYuMinute : strYuMinute) + "分" + (strYuSecond < 10 ? "0" + strYuSecond : strYuSecond) + '秒';

                } else {

                    str = (strYuMinute < 10 ? "0" + strYuMinute : strYuMinute) + "分" + (strYuSecond < 10 ? "0" + strYuSecond : strYuSecond) + '秒';
                }

            } else if (strZongHour == 24 && strYuMinute == 0 && strYuSecond == 0) { //刚刚一天的时间

                str = "24时00分00秒";

            } else { //大于一天

                var strZongDay: number = Math.floor(strZongHour / 24);
                var strYuHour: number = strZongHour % 24;
                str = strZongDay + "天" + (strYuHour < 10 ? "0" + strYuHour : strYuHour) + "时" + (strYuMinute < 10 ? "0" + strYuMinute : strYuMinute) + "分" + (strYuSecond < 10 ? "0" + strYuSecond : strYuSecond) + '秒';
            }
        }

        return str;
    }
    /**
     * 时间戳转字符串
     * @param timestamp 
     * @returns 
     */
    public static TimestampToString(timestamp: number) {

        let time = new Date(timestamp);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let hours = time.getHours();
        let minute = time.getMinutes();
        let second = time.getSeconds();

        let strRet = year + '年';
        strRet += ((month < 10) ? '0' + month : month) + '月';
        strRet += ((day < 10) ? '0' + day : day) + '日';
        strRet += ((hours < 10) ? '0' + hours : hours) + '时';
        strRet += ((minute < 10) ? '0' + minute : minute) + '分';
        strRet += ((second < 10) ? '0' + second : second) + '秒';

        return strRet;
    }
    // 格式化时间
    // @param timeMS 毫秒
    // @param format 格式 形如 dd hh: mm: ss
    static GetTime(timeMS: number, format: string = 'dhms') {
        // timeMS有毫秒的，补齐至1秒
        let ms = timeMS % 1000;
        if (ms) {
            timeMS += 1000 - ms;
        }

        let replacePattern: {
            [key: string]: {
                div: number,
                isLast?: boolean
            }
        } = {
            "d+": { div: 86400000 },
            "h+": { div: 3600000 },
            "m+": { div: 60000 },
            "s+": { div: 1000 }
        };

        for (let key in replacePattern) {
            let toReplace = '';
            format = format.replace(new RegExp(key, 'g'), str => {
                if (!toReplace) {
                    let pattern = replacePattern[key];
                    let result = timeMS / pattern.div | 0;
                    let resultStr = result + '';
                    timeMS -= result * pattern.div;
                    toReplace = '0'.repeat(Math.max(str.length - resultStr.length, 0)) + resultStr;
                }
                return toReplace;
            })
        }

        return format;
    }

    /**
     * 检测数据类型
     * @param _port 数据名
     * @param _nD 实际数据
     * @param _oD 模型数据
     */
    static DetectType(_port: string, _nD: any, _oD: any, otherInfo?: string) {
        let _nType = typeof _nD;//实际数据
        let _oType = typeof _oD;//模型数据
        if (_nType != _oType) {
            console.error('------------------------------')
            console.error('[云函数]检测到数据类型不符:', _port);
            console.error('模型数据类型:', _oType);
            console.error('实际数据类型:', _nType);
            if (otherInfo) {
                console.error('其他消息:', otherInfo);
            }
            console.error('------------------------------')

        }
        if (_oType == 'object') {
            let _isoDArray = Array.isArray(_oD);
            let _isnDArray = Array.isArray(_nD);
            if (_isoDArray != _isnDArray) {
                console.error('------------------------------')
                console.error('[云函数]检测到数据类型不符:', _port);
                console.error('模型数据类型是数组:', _isoDArray);
                console.error('实际数据类型是数组:', _isnDArray);
                if (otherInfo) {
                    console.error('其他消息:', otherInfo);
                }
                console.error('------------------------------')
                return;

            }
            for (const key in _oD) {

                if (!Object.prototype.hasOwnProperty.call(_nD, key)) {
                    if (!_isoDArray) {
                        console.error('------------------------------')
                        console.error('[云函数]数据错误:', _port);
                        console.error('实际数据中缺少字段:', key);
                        if (otherInfo) {
                            console.error('其他消息:', otherInfo);
                        }
                        console.error('------------------------------')
                    }
                }
                else {
                    this.DetectType(_port + '.' + key, _nD[key], _oD[key]);
                }
                if (_isoDArray) {
                    console.log('数组类型不再检测');
                    break;
                }
            }
        }
    }
    /**
     * 转换为number类型
     * @param _v 
     * @returns 
     */
    static ChangeToNumber(_v: any) {
        if (typeof _v == 'number') {
            return _v;
        } else if (typeof _v == 'string') {
            return Number(_v);
        }
        console.error('ChangeToNumber错误类型：', _v);
        return 0;
    }
    //-------------------------------------------------------FGUI工具------------------------------------------------//
    //文字自动缩放
    static SetTextAndFitSize(fText: fgui.GTextField, txt: string) {
        fText.text = '' + txt;
        let text = fText.displayObject as Laya.Text;
        text.wordWrap = false;
        if (fText.width < text.textWidth) {
            text.fontSize = Math.floor((fText.width / text.textWidth) * fText.fontSize)
        }
    }
    //-------------------------------------------------------本地存储------------------------------------------------//
    //根据键值读取本地数据
    static GetLocalItem(_key: string) {
        let _getdata = null as any;
        if (Laya.Browser.onTBMiniGame) {
            let data = my.getStorageSync({ key: _key });
            //console.log("data: ",data);

            if (data && data["data"]) {
                _getdata = data["data"];
            }
        } else {
            let data = Laya.LocalStorage.getItem(_key);
            //console.log("data: ",data);
            if (data) {
                _getdata = JSON.parse(data);
            }
        }
        return _getdata;
    }
    //根据键值存储本地数据
    static SetLocalItem(_key: string, _data: any) {
        if (Laya.Browser.onTBMiniGame) {
            my.setStorage({
                key: _key,
                data: _data,
                success: () => {
                    console.log(_key, "写入成功");
                }
            });
        } else {
            Laya.LocalStorage.setItem(_key, JSON.stringify(_data));
        }
    }
    //-------------------------------------------------------公用动画------------------------------------------------//
    //弹入动画
    static ActionPopIn(_node: any, _endcallbacK?: Function) {
        _node.setScale(0.3, 0.3);
        Laya.Tween.to(_node, { scaleX: 1.15, scaleY: 1.15, }, 150, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
            // Laya.Tween.to(_node, { scaleX: 1.1, scaleY: 1.1 }, 200, undefined, Laya.Handler.create(this, () => {
            Laya.Tween.to(_node, { scaleX: 1, scaleY: 1 }, 400, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
                _endcallbacK && _endcallbacK();
            }));
            // }));
        }));
    }
    //弹出动画
    static ActionPopOut(_node: any, _endcallbacK?: Function) {
        Laya.Tween.to(_node, { scaleX: 1.1, scaleY: 1.1, }, 200, Laya.Ease.linearOut, Laya.Handler.create(this, () => {
            Laya.Tween.to(_node, { scaleX: 0, scaleY: 0 }, 200, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                _endcallbacK && _endcallbacK();
            }));
        }));
    }
}

export class ModuleAudio {

    private static allEffectContext = {};
    static preloadAudio(path) {

        let _url = path;
        if (Laya.Browser.onTBMiniGame) {
            // if (path in this.effectContext) {
            //     console.log('已创建音效：', path);
            //     return this.effectContext[path];
            // }

            // if (isDXG) {
            //     _url = path;
            // }
            // else {
            //     const soundBase = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/C_client/"
            //     _url = soundBase + path;
            // }
            let effectContext = my.createInnerAudioContext()
            effectContext.autoplay = false;
            effectContext.loop = false;
            effectContext.src = _url;
            this.allEffectContext[path] = effectContext;

            effectContext.onSeeked((res) => {
                console.log('onSeeked', res)
            })
            effectContext.onSeeking((res) => {
                console.log('onSeeking', res)
            })
            effectContext.onSeeked((res) => {
                console.log('onSeeked', res)
            })
            effectContext.onCanPlay((res) => {
                console.log('onCanPlay', res)
            })
            effectContext.onPlay((res) => {
                console.log('开始播放', res);
                effectContext['isplaying'] = true;
            })
            effectContext.onError((res) => {
                console.error('音效错误', path, res);
                effectContext.destroy();
                if (this.allEffectContext[path]) {
                    delete this.allEffectContext[path];
                }
            })
            effectContext.onStop((res) => {
                console.log('====onStop===', res);
                effectContext['isplaying'] = false;
            })
            effectContext.onTimeUpdate((res) => {
                console.log('====onTimeUpdate===', res);
            })

            effectContext.onEnded((res) => {
                console.log('====onEnded===', res);
                effectContext['isplaying'] = false;
                effectContext.stop();
                // effectContext.destroy();
                // effectContext = null;

                // if (PlayDataUtil.data.musicCtrl == 1 && this.musicContext) {
                //     //console.log('====音效播放结束,继续播放音乐===');
                //     this.musicContext.play();
                // }
            });
            console.log('初次创建音效：', path);
            return this.allEffectContext[path];
        }
        else {
            Laya.loader.load(_url, Laya.Handler.create(this, () => {

            }), null, Laya.Loader.SOUND);
        }
        return null;
    }
    // playEffect2(path, isDXG = false) {
    //     if (Laya.Browser.onTBMiniGame) {
    //         if (!this.effectContext[path]) {
    //             console.error('未加载的音效', path);
    //             return;
    //         }
    //         this.effectContext[path].play();
    //     }
    // }

    //播放音效
    static playEffect(path: string) {
        // //音乐关闭，直接跳过
        // if (PlayDataUtil.data.musicCtrl == 0) {
        //     return;
        // }

        let _url = path;
        // if (isDXG) {
        //     _url = path;
        // }
        // else {
        //     const soundBase = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/C_client/"
        //     _url = soundBase + path;
        // }
        // console.log('playEffect _url', _url);

        if (Laya.Browser.onTBMiniGame) {

            if (!this.allEffectContext[path]) {
                this.preloadAudio(path);
            }
            if (this.allEffectContext[path]['isplaying']) {
                this.allEffectContext[path].stop();
            }
            // SoundPlayer.ResetSound();
            this.allEffectContext[path].play();
            // let effectContext = my.createInnerAudioContext()
            // effectContext.autoplay = true;
            // effectContext.loop = false;
            // effectContext.src = _url;

            // effectContext.onEnded(() => {
            //     //console.log('====音效播放结束===');
            //     effectContext.destroy();
            //     effectContext = null;

            //     if (PlayDataUtil.data.musicCtrl == 1 && this.musicContext) {
            //         //console.log('====音效播放结束,继续播放音乐===');
            //         this.musicContext.play();
            //     }
            // });
        }
        else {
            Laya.SoundManager.playSound(_url, 1);
            // Laya.loader.load(_url, Laya.Handler.create(this, () => {

            // }), null, Laya.Loader.SOUND);
        }
    }

    private static _comonBtnAudioPath = '';
    //设置通用音效路径
    static SetComonBtnAudioPath(_path: string) {
        this._comonBtnAudioPath = _path;
        this.preloadAudio(_path);
    }
    /**
     * 播放通用按钮音效
     * @returns 
     */
    static PlayComonBtnAudio() {
        if (this._comonBtnAudioPath == '') {
            console.error('请先传入通用按钮音效路径');
            return;
        }
        this.playEffect(this._comonBtnAudioPath);
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
export class ModuleClock {

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
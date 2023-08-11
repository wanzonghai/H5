import { Global } from '../config/Global';
import PlayDataUtil from "../data/PlayDataUtil";
import TB from '../platform/TB';
import MyUtils from '../common/MyUtils';
import GetReward from '../fgui/GetReward';
// import Rule from '../fgui/Rule';
import RankUtil from './RankUtil';
import Alert from './../fgui/Alert';
import { GameLogic } from '../FGUIClass/GameLogic';

export default class MainUtil extends Laya.Script {
    static _activityTime: number;
    static _curScene: number = 0;  //当前场景类型

    //日期是否同一周
    static isSameWeek(old, now) {
        old = new Date(old);
        now = new Date(now);
        var oneDayTime = 1000 * 60 * 60 * 24;
        var old_count = Math.ceil(old.getTime() / oneDayTime);
        var now_other = Math.ceil(now.getTime() / oneDayTime);
        return Math.ceil((old_count + 4) / 7) == Math.ceil((now_other + 4) / 7);
    }

    //格式化日期
    static dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }

    //格式化当前日期
    static getDate() {
        return this.dateFormat("YYYY-mm-dd", new Date())
    }

    //格式化倒计时
    // @param timeMS 毫秒
    static getCountDown(timeMS: number) {
        // timeMS有毫秒的，补齐至1秒
        let ms = timeMS % 1000;
        if (ms) {
            timeMS += 1000 - ms;
        }
        let replacePattern: {
            [key: string]: {
                div: number,
                format: string,
                isLast?: boolean
            }
        } = {
            "d+": { div: 86400000, format: "天" },
            "h+": { div: 3600000, format: ":" },
            "m+": { div: 60000, format: ":" },
            "s+": { div: 1000, format: "" }
        };
        let format = "dhhmmss";//固定格式
        let isHide = true;
        for (let key in replacePattern) {
            let toReplace = '';
            format = format.replace(new RegExp(key, 'g'), str => {
                if (!toReplace) {
                    let pattern = replacePattern[key];
                    let result = timeMS / pattern.div | 0;
                    timeMS -= result * pattern.div;
                    let resultStr = result + '';
                    if (result == 0 && isHide) {
                        resultStr = '';
                        toReplace = resultStr;
                    } else {
                        isHide = false;
                        toReplace = '0'.repeat(Math.max(str.length - resultStr.length, 0)) + resultStr + pattern.format;
                    }
                }
                return toReplace;
            })
        }

        return format;
    }

    // 格式化时间
    // @param timeMS 毫秒
    // @param format 格式 形如 dd hh: mm: ss
    static getTime(timeMS: number, format: string = 'dhms') {
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

    //数字前面补0 num-要修改的数字 count-补0的位数
    static formatNum(num, count) {
        let str = num + "";
        if (str.length < count) {
            str = '0'.repeat(Math.max(count - str.length, 0)) + str;
        }
        return str;
    }

    //获取时间间隔
    static getTimeSpan(startTime, endTime, type = 'sec') {
        if (type == 'sec') {
            return Math.floor((endTime - startTime) / 1000)
        } else if (type == 'min') {
            return Math.floor((endTime - startTime) / 1000 / 60);
        } else if (type == 'hour') {
            return Math.floor((endTime - startTime) / 1000 / 60 / 60)
        } else if (type == 'day') {
            return Math.floor((endTime - startTime) / 1000 / 60 / 60 / 24);
        }

        return Math.floor((endTime - startTime) / 1000)
    }

    //获取奖励
    static addReward(rewards, taskId?: string) {
        for (let i = 0; i < rewards.length; i++) {
            const reward = rewards[i];
            if (reward.type == 'Skin') {
                MainUtil.reqMyRole(parseInt(reward.id), () => {
                    let roleArr = PlayDataUtil.data.myRoleIDArray;
                    if (roleArr.indexOf(parseInt(reward.id)) == -1) { //没有这个角色
                        roleArr.push(parseInt(reward.id));
                        PlayDataUtil.setData('myRoleIDArray', roleArr);
                    }
                });
            } else if (reward.type == 'Coin') {
                this.sendCoin(parseInt(reward.count), taskId);
            } else if (reward.type == 'Point') {
                // let allCount = PlayDataUtil.data.point + parseInt(reward.count);
                this.sendChangePoint(parseInt(reward.count), null, null);
            }
        }
    }

    //是否开启终极挑战
    static isChallenge() {
        // let conf = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.gameConfig)
        // if (Laya.Browser.onTBMiniGame) {
        //     conf = Global.ResourceManager.getConf('gameConfig');
        // }
        // if (conf) {
        //     conf = conf.challenge;
        //     let state = 0;//0-关闭
        //     let date = new Date();
        //     let day = date.getDay();
        //     if (conf.day) {
        //         if (conf.day.indexOf(day) != -1) {
        //             let hour = date.getHours();
        //             if (hour >= conf.hourMin && hour <= conf.hourMax) {
        //                 state = 1;
        //             }
        //         }
        //     }
        //     return state;
        // }
        return 0;
    }

    static getTips() {
        // let conf = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.gameConfig)
        // if (Laya.Browser.onTBMiniGame) {
        //     conf = Global.ResourceManager.getConf('gameConfig');
        // }
        // if (conf) {
        //     conf = conf.challenge;
        //     let str = "每";
        //     let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        //     let day = 0;
        //     for (let i = 0; i < conf.day.length; i++) {
        //         str = str + (day == 0 ? '' : '、') + week[conf.day[i]];
        //         day++;
        //     }
        //     str = str + conf.hourMin + ":00-" + conf.hourMax + ":00开启";
        //     return str;
        // }

        return '尚未开启，敬请期待';
    }

    //上报获得奖杯
    static sendChangePoint(count, successFun?, failFun?) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                activeId: TB._activeId,
                changePoint: parseInt(count) | 0,//增加的积分数
                // allPoint: parseInt(allCount) | 0
            }
            let info = { "id": Global.MSG_UPLOAD_POINT, "data": reqData };
            TB.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    // console.log('sendChangePoint');

                    PlayDataUtil.setData('point', buf.data.point);
                    console.log("上报积分成功", buf.data);
                    Laya.stage.event("updateValue");
                    if (successFun) {
                        successFun();
                    }
                }
                else {
                    console.log("上报积分失败");
                    if (failFun) {
                        failFun();
                    }
                }
            });
        }
        else {
            PlayDataUtil.setData('point', PlayDataUtil.data.point + count);
            if (successFun) {
                successFun();
            }
            Laya.stage.event("updateValue");
        }
    }

    //上报获得金币
    static sendCoin(addCoin, taskId?: string, cbSuccess?: Function) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                activeId: TB._activeId,
                changeCoin: parseInt(addCoin) | 0,
            }
            if (taskId) {
                reqData["taskId"] = taskId;
            }

            let info = { "id": Global.MSG_COIN_ADD, "data": reqData };
            TB.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    PlayDataUtil.setData("coin", buf.data.userCoin);
                    Laya.stage.event("updateValue");
                    console.log("上报分数成功", buf.data);
                    cbSuccess && cbSuccess(buf.data.userCoin);
                }
                else {
                    console.log("上报分数失败");
                }
            });
        }
        else {
            PlayDataUtil.setData('coin', PlayDataUtil.data.coin + addCoin);
        }
    }

    //上报消耗金币
    static costCoin(costCoin, cbSuccess?: Function, cbFail?: Function) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                activeId: TB._activeId,
                changeCoin: parseInt(costCoin) | 0
            }
            let info = { "id": Global.MSG_COIN_COST, "data": reqData };
            TB.sendMsg(info, (buf) => {
                MyUtils.closeLoading();
                if (buf.code == 0) {
                    //刷新金币
                    PlayDataUtil.setData('coin', buf.data.userCoin);
                    console.log("上报消耗金币成功", buf.data);
                    cbSuccess && cbSuccess(buf.data.userCoin);
                }
                else {
                    cbFail && cbFail(buf.code);
                }
            });
        } else {
            PlayDataUtil.setData('coin', PlayDataUtil.data.coin - costCoin);
        }
    }

    //上报获得vip
    static sendVip(isVip, successFunc, FailFunc) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                activeId: TB._activeId,
                vipState: (isVip == 1) ? true : false,
            }
            let info = { "id": Global.MSG_UPLOAD_VIPSTATE, "data": reqData };
            TB.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    PlayDataUtil.setData("isVip", isVip);
                    console.log("获得vip成功:1011", isVip);

                    if (successFunc) {
                        successFunc();
                    }
                }
                else {
                    if (FailFunc) {
                        FailFunc();
                    }
                    console.log("获得vip失败:1011", isVip);
                }
            });
        }
    }

    //上报会员状态
    static sendMember(isMember, successFunc, FailFunc) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                activeId: TB._activeId,
                isMember: isMember,
            }
            let info = { "id": Global.MSG_MEMBER_STATE, "data": reqData };
            TB.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    PlayDataUtil.setData("isMember", isMember);
                    console.log("上报会员状态成功:1009", isMember);
                    if (successFunc) {
                        successFunc();
                    }
                }
                else {
                    if (FailFunc) {
                        FailFunc();
                    }
                    console.log("上报会员状态失败:1009", isMember);
                }
            });
        }
    }

    //上报头像昵称/获取玩家基础数据
    static reqUserInfo(headUrl, name, func) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                headUrl: headUrl,
                nickName: name,
                activeId: TB._activeId,
            }
            let info = { "id": Global.MSG_LOGIN, "data": reqData };
            TB.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    console.log("上报玩家基础信息成功:1001");
                }
                else {
                    console.error("上报玩家基础信息失败:1001");
                }
                if (func) {
                    func();
                }
            });
        }
    }

    //上报获得的角色
    static reqMyRole(roleId, func) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                roleId: roleId,
                activeId: TB._activeId,
            }
            let info = { "id": Global.MSG_MY_ROLE, "data": reqData };
            TB.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    console.log("上报角色成功");
                }
                else {
                    console.log("上报角色失败");
                }
                if (func) {
                    func();
                }
            });
        }
        else {
            if (func) {
                func();
            }
        }
    }

    //提示框
    static showToast(txt) {
        let toast = fgui.UIPackage.createObject("Common", "Toast").asCom;
        toast.getChild('tipsTxt').asTextField.text = txt;
        toast.y = Laya.stage.height / 2;
        let fadeOut = toast.getTransition("fadeOut");
        var callback = Laya.Handler.create(this, function () {
            toast.dispose();
        })
        fadeOut.play(callback);
        fgui.GRoot.inst.addChild(toast);
    }

    //文字自动缩放
    static autoSize(fText, txt: string) {
        fText.text = '' + txt;
        let text = fText.displayObject as Laya.Text;
        text.wordWrap = false;
        if (fText.width < text.textWidth) {
            text.fontSize = Math.floor((fText.width / text.textWidth) * fText.fontSize)
        }
    }

    //上报埋点数据
    static analysis(action, data?) {
        // if (Laya.Browser.onTBMiniGame) {
        //     let reqData = {
        //         activeId: TB._activeId,
        //         action: action,
        //         data: data || {},
        //     }
        //     let info = { "id": Global.MSG_ANALYSIS, "data": reqData };
        //     TB.sendAnalysis(info, (buf) => {
        //         if (buf.code == 0) {
        //             console.log("上报埋点成功 = ", buf);
        //         } else {
        //             console.log("上报埋点失败");
        //         }
        //     });
        // } else {
        //     console.log('==== 上报%s数据：=====', action, data)
        // }
        // return;

    }

    static initActivityTime() {
        this._activityTime = new Date().getTime();
    }

    static sendActivityTime() {
        // this.analysis('activity', { time: this.getTimeSpan(this._activityTime, new Date().getTime(), 'sec') });
        this.analysis('activeTime', { playTime: this.getTimeSpan(this._activityTime, new Date().getTime(), 'sec') });
    }

    //获取排行榜名次变化
    static reqRanking(func, priority?: number) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                activeId: TB._activeId,
            }
            let info = { "id": Global.MSG_RANKING, "data": reqData };
            TB.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    console.log("排行榜名次获取成功", buf.data.changeRank);
                    if (func) {
                        func(buf.data.changeRank);
                    }
                }
                else {
                    console.log("排行榜名次获取失败");
                }
            });
        }
    }

    //请求本期排名
    static reqCurRank(successFunc, FailFunc) {
        let reqData = {
            activeId: TB._activeId,
        }
        let info = { "id": Global.MSG_CUR_RANK, "data": reqData };
        TB.sendMsg(info, (buf) => {
            MyUtils.closeLoading();
            if (buf.code == 0) {
                if (successFunc) {
                    successFunc(buf);
                }
            }
            else {
                if (FailFunc) {
                    FailFunc();
                }
            }
        });
    }

    //请求上期排名
    static reqLastRank(successFunc, FailFunc) {
        let reqData = {
            activeId: TB._activeId,
        }
        let info = { "id": Global.MSG_LAST_RANK, "data": reqData };
        TB.sendMsg(info, (buf) => {
            MyUtils.closeLoading();
            if (buf.code == 0) {
                if (successFunc) {
                    successFunc(buf);
                }
            }
            else {
                if (FailFunc) {
                    FailFunc();
                }
            }
        });
    }

    //请求排行榜数据
    static reqResultRank(oldPoint, newPoint, successFunc, FailFunc) {
        let reqData = {
            activeId: TB._activeId,
            oldPoint: oldPoint,
            newPoint: newPoint,
        }
        let info = { "id": Global.MSG_RESULT_RANK, "data": reqData };
        TB.sendMsg(info, (buf) => {
            MyUtils.closeLoading();
            if (buf.code == 0) {
                if (successFunc) {
                    successFunc(buf);
                }
            }
            else {
                if (FailFunc) {
                    FailFunc();
                }
            }
        });
    }

    //获取邀请信息
    static reqShare(cb) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                activeId: TB._activeId,
            }
            let info = { "id": Global.MSG_SHARE_INFO, "data": reqData };
            TB.sendMsg(info, (buf) => {
                cb && cb(buf);
                console.log("获取邀请信息成功");
            });
        }
    }

    //按钮点击事件
    static btnClickEvent(btnNode, caller, Func) {
        btnNode.on(Laya.Event.MOUSE_DOWN, caller, () => {
            //缩小动作
            Laya.Tween.to(btnNode, { scaleX: 0.8, scaleY: 0.8 }, 80, Laya.Ease.backInOut, null);
        });
        btnNode.on(Laya.Event.MOUSE_UP, caller, () => {
            //缩小动作
            Laya.Tween.to(btnNode, { scaleX: 1, scaleY: 1 }, 40, Laya.Ease.backInOut, null);
            if (Func) {
                Func();
            }
        });
        btnNode.on(Laya.Event.MOUSE_OUT, caller, () => {
            //回复大小
            Laya.Tween.to(btnNode, { scaleX: 1, scaleY: 1 }, 40, Laya.Ease.backInOut, null);
        });
    }

    //获取红点变化
    static reqStateChange(cb) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                activeId: TB._activeId,
            }
            console.log('reqStateChange');

            let info = { "id": Global.MSG_STATE_CHANGE, "data": reqData };
            TB.sendMsg(info, (buf) => {
                //返回数据 data:{bag_num:1,task_num:2}
                cb && cb(buf.data);
                console.log("获取红点变化成功", buf.data);
            });
        }
        else {
            cb && cb({ bag_num: 1, task_num: 2 });
        }
    }

    //查询商品是否已收藏
    static checkCollectState() {
        if (Laya.Browser.onTBMiniGame) {
            let listData = Global.ResourceManager.getGoodsConf();
            let localData = PlayDataUtil.data.collectIdArr;
            for (let i = 0; i < listData.length; i++) {
                let goodsId = listData[i].num_iid;
                TB.checkGoodsCollectedStatus(goodsId, (res) => {
                    //console.log("商品id%s, 状态%s:", goodsId, res);
                    //检测本地收藏列表中是否包含
                    let idx = localData.indexOf(goodsId);
                    if (res) {  //已收藏
                        if (idx == -1) {
                            localData.push(goodsId);
                        }
                    }
                    else {
                        if (idx > -1) {
                            localData.splice(idx, 1);
                        }
                    }
                })
            }
        }
    }

    //上报领取任务
    static sendGetTask(taskId) {
        //上报领取奖励id
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                task_id: taskId,
                activeId: TB._activeId,
            }
            let info = { "id": Global.MSG_GET_TASK, "data": reqData };
            TB.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    console.log("领取成功");
                }
                else {
                    console.log("该奖励已发放,不能重复领取");
                }
            });
        }
    }

    //获取对应的UI路径
    static getUI(ui) {
        return ui.replace(".txt", "");
    }

    //获取对应的style控制器类型
    static getStyle() {
        let idx = Global.ResourceManager.getAtmosphere().style - 1;
        if (Global.ResourceManager.getAtmosphere().style >= 3) {
            idx = 0;
        }
        return idx;
    }

    static TradesSoldInfo: {
        num_iid: string, pic_url: string, title: string, price: string,
        rewardCount: number
        , scorerewardCount: number,
        nickName: string
    } = null as any;
    //校验是否购买成功
    static checkGetTradesSold() {
        console.log('========= checkGetTradesSold ==========');
        if (PlayDataUtil.data.buyTime == 0) {
            return
        }

        let func = (price) => {
            // let awardCoin = Math.ceil(parseFloat('' + price)) * Global.ResourceManager.getExchangeIdx()[0];
            // let awardScore = Math.ceil(parseFloat('' + price)) * Global.ResourceManager.getExchangeIdx()[1];
            // console.log("awardCoin = ", awardCoin)
            // console.log("awardScore = ", awardScore)
            // if (awardCoin > 0 || awardScore > 0) {
            //     //上报加金币
            //     let rewards = [];
            //     if (awardCoin > 0) {
            //         rewards.push({ type: 'Coin', count: awardCoin });
            //     }
            //     if (awardScore > 0) {
            //         rewards.push({ type: 'Point', count: awardScore });
            //     }
            //     new GetReward({ type: 2, rewards: rewards });
            // }
            Global.EventManager.event(Global.hallConfig.EventEnum.TASK_CHANGE);
            this.uploadOrder(price);
        };

        //请求是否付款成功
        if (Laya.Browser.onTBMiniGame) {
            console.log('======= 查询付款是否成功 ======')
            let reqData = {
                activeId: TB._activeId,
            }
            let info = { "id": Global.MSG_CHECK_TRADES_SOLD, "data": reqData };
            TB.sendMsg(info, (buf) => {
                console.log("请求是否付款成功", JSON.stringify(buf));
                if (buf.code == 0) {
                    console.log("付款成功");
                    PlayDataUtil.setData('buyTime', 0);
                    func(buf.data.price);
                    let nickName = RankUtil.getMyPlayer().name;
                    let awardCoin = (buf.data.price * Global.ResourceManager.getExchangeIdx()[0]) | 0;
                    let awardScore = (buf.data.price * Global.ResourceManager.getExchangeIdx()[1]) | 0;
                    // MainUtil.analysis('pay', {
                    //     type: 1,
                    //     record: buf.data.record,
                    //     nickName: nickName,
                    //     payNum: buf.data.price,
                    //     rewardNum: awardCoin,
                    //     rewardNum2: awardScore,
                    // });


                }
                else {
                    console.log("付款失败");
                }
            });
        }
    }

    //上报金额
    static uploadOrder(price) {
        //上报购买数据
        let reqData = {
            price: parseFloat(price),
            activeId: TB._activeId,
        }
        let info = { "id": Global.MSG_BUY_DATA, "data": reqData };
        TB.sendMsg(info, (buf) => {
            if (buf.code == 0) {
                // this.sendTask7();
                console.log("上报购买数据成功");
            } else {
                // this.sendTask7();
                console.log("上报购买数据失败");
            }
        });
    }

    // //上报买一送一进度
    // static sendTask7() {
    //     if (Laya.Browser.onTBMiniGame) {
    //         let reqData = {
    //             task_id: "7",
    //             activeId: TB._activeId,
    //         }
    //         let info = { "id": Global.MSG_TASK_PROGRESS, "data": reqData };
    //         TB.sendMsg(info, (buf) => {
    //             if (buf.code == 0) {
    //                 console.log("上报任务进度成功");
    //             }
    //             else {
    //                 console.log("上报任务进度失败");
    //             }
    //         });
    //     }
    // }

    //查询公告
    static checkNotice() {
        // if (Laya.Browser.onTBMiniGame) {
        //     let reqData = {
        //         activeId: TB._activeId,
        //     }
        //     let info = { "id": Global.MSG_NOTICE, "data": reqData };
        //     TB.sendMsg(info, (buf) => {
        //         if (buf.code == 0) {
        //             if (buf.data.type != 0) {
        //                 new Rule(buf.data);
        //             }
        //         } else {
        //             console.log('查无公告')
        //         }
        //     });
        // } else {
        //     let data = {
        //         type: 0,
        //         msg: '测试一下公告先',
        //         ver: '1.0.0'
        //     }
        //     if (data.type != 0) {
        //         new Rule(data);
        //     }
        // }
    }

    //当前界面类型  type : 0-加载界面
    static setCurScene(type) {
        this._curScene = type;
    }

    static getCurScene() {
        return this._curScene;
    }
    static TradesSoldType = 0;
    //校验是否购买成功
    static sendGetTradesSold(isBuy, finishFunc = null) {
        Laya.stage.offAll('checkOrder');
        //let myPrice = this._orderPrice;
        // //校验是否购买成功
        // let func = (price) => {
        //     console.log("实际购买价格 = ", price)
        //     let awardCoin = Math.ceil(parseFloat(''+price)) * Global.ResourceManager.getExchangeIdx();
        //     console.log("awardCoin = ", awardCoin)
        //     if (awardCoin > 0) {
        //         //上报加金币
        //         let rewards = [];
        //         rewards.push({ type: 'Coin', count: awardCoin });
        //         new GetReward({ type: 1, rewards: rewards, taskId : this._opt.id});
        //     }
        //     //购买成功,下单任务+1
        //     TaskUtil.setTaskDone(7);
        //     //购买任务+1
        //     TaskUtil.setTaskDone(9);
        //     Global.EventManager.event(Global.hallConfig.EventEnum.TASK_CHANGE);

        //     this.uploadOrder(price);
        // };

        //请求是否付款成功
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                openDetilTime: PlayDataUtil.data.buyTime,  //打开详情页面的时间
                activeId: TB._activeId,
            }
            console.log('======= 查询付款是否成功 reqData======', reqData)
            let info = { "id": Global.MSG_GET_TRADES_SOLD, "data": reqData };
            TB.sendMsg(info, (buf) => {
                console.log("请求是否付款成功", JSON.stringify(buf));
                if (buf.code == 0) {
                    PlayDataUtil.setData('buyTime', 0);
                    console.log("付款成功");
                    //上报加金币
                    if (finishFunc) {
                        finishFunc(buf.data.price);
                    }
                    let nickName = RankUtil.getMyPlayer().name;
                    let awardCoin = (buf.data.price * Global.ResourceManager.getExchangeIdx()[0]) | 0;
                    let awardScore = (buf.data.price * Global.ResourceManager.getExchangeIdx()[1]) | 0;
                    // //MainUtil.analysis('pay', {
                    //     type: this.TradesSoldType, record: buf.data.record,
                    //     nickName: nickName,
                    //     payNum: buf.data.price,
                    //     rewardNum: awardCoin,
                    //     rewardNum2: awardScore,
                    // });
                    //func(buf.data.price);
                }
                else {
                    console.log("付款失败");
                    if (isBuy) {
                        TB.showToast('订单核准中，核对后将发放对应奖励');
                        Laya.timer.once(10000, this, MainUtil.checkGetTradesSold);//十秒后重试
                    }
                }
            });
        }
        else {
            if (finishFunc) {
                finishFunc(1);
            }
            //func(myPrice);
        }
    }
    //获取任务列表-2002
    static sendGetTaskList(cb?) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                activeId: TB._activeId,
            }
            let info = { "id": Global.MSG_GET_TASKLIST, "data": reqData };
            TB.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    cb && cb();
                    console.log("获取列表成功");
                } else {
                    console.log("获取列表失败");
                }
            });
        }
    }

    //领取任务奖励-2004
    //taskPlace任务所在位置（1:主界面，2游戏内，3结算界面）
    static sendGetTaskReward(taskId, cb?, taskPlace = 1) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                task_id: taskId,
                activeId: TB._activeId,
            }
            let info = { "id": Global.MSG_GET_TASK_REWARD, "data": reqData };
            //任务完成打点
            MainUtil.analysis('task', { type: GameLogic.isInGame ? 2 : 1, sub: taskId });
            TB.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    /*返回格式
                    "data":{"reward":{"rewardCount_1":20,"rewardCount_2":20,"id":1},"get":3,"state":2}}
                    */
                    //返回值转换为GetReward可用格式 -xuan 2021/4/9
                    let _rewardData = buf.data.reward;
                    buf.data.reward = {//金币
                        type: 'Coin',
                        count: _rewardData.rewardCount_1,
                        id: 1,
                    };
                    buf.data.reward2 = {//积分
                        type: 'Point',
                        count: _rewardData.rewardCount_2,
                        id: 1,
                    },
                        cb && cb(buf.data);
                    console.log("领取成功:2004", buf.data);
                } else {
                    console.log("领取奖励失败:2004 code", buf.code);
                    if (buf.code == -10) {
                        new Alert('活动未开始！');
                    }
                    else if (buf.code == -11) {
                        new Alert('活动已结束！');
                    }
                }
            });
        }
        else {
            // new Alert('活动已结束！');
            cb && cb({
                finish: 1,
                state: 2,
                get: 1,
                reward: {//金币
                    type: 'Coin',
                    count: 1,
                    id: 1,
                },
                reward2: {//积分
                    type: 'Point',
                    count: 2,
                    id: 1,
                }
            });
        }
    }

    //上报任务进度-2003
    static sendTaskProgress(id, cb?) {
        if (Laya.Browser.onTBMiniGame) {
            let reqData = {
                task_id: id,
                activeId: TB._activeId,
            }
            let info = { "id": Global.MSG_GET_TASK_PROGRESS, "data": reqData };
            TB.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    console.log("上报任务进度成功:2003");
                    if (cb) {
                        cb(buf.data);
                    }
                } else {
                    console.log("上报任务进度失败:2003 code", buf.code);
                    if (buf.code == -10) {
                        new Alert('活动未开始！');
                    }
                    else if (buf.code == -11) {
                        new Alert('活动已结束！');
                    }
                }

            });
        } else {
            if (cb) {
                cb({
                    finish: 1,
                    state: 1,
                    get: 1,
                });
                // new Alert('活动已结束！');
            }
        }
    }
}
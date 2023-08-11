

/**
 * 任务数据逻辑类
 * 
 */

import ModulePackage from "../ModulePackage";
import { ModulePlatformAPI, PlatformListenKey } from "../ModulePlatformAPI";
import { ModuleTool } from './../ModuleTool';
import uiTaskPrecondition from './uiTaskPrecondition';
import uiTaskExtraPopup from './uiTaskExtraPopup';
import uiGetReward from './uiGetReward';
import uiTaskBrowse from './uiTaskBrowse';
import { GCurrencyType, ModuleGlobal } from "../ModuleGlobal";
import uiTaskInvite from './uiTaskInvite';
import { ModuleStatistics } from "../ModuleStatistics";
import uiAlert from "../GeneralInterface/uiAlert";

/**
 * 当前支持的任务
 */
export enum TaskType {

    /**每日礼包*/dayGift = 'dayGift',
    /**每日签到*/checkInDay = 'checkInDay',
    /**会员福利*/memberAward = 'memberAward',
    /**收藏商品*/collectGoods = 'collectGoods',
    /**浏览店铺*/scanShop = 'scanShop',
    /**邀请好友*/friendship = 'friendship',
    /**购买商品*/spend = 'spend',
    /**订阅店铺*/subscribeShop = 'subscribeShop',
    /**加入会员*/joinMember = 'joinMember',
    /**浏览商品*/scanGoods = 'scanGoods',

    // /**浏览直播间*/scanLive='scanLive',
    // /**加入群聊*/joinGroup=' joinGroup',
}
/**
 * 任务状态类型
 */
export enum TaskStatusType {
    /**未完成*/waiting = 'waiting',
    /**完成待领取*/allow = 'allow',
    /**已经领取*/finish = 'finish',
}
/**
 * 任务奖励类型
 */
// type TaskAwardType = 'blade' | 'score' | 'gold' | 'times';
/**
 * 任务奖励
 */
export interface TaskAwardInfo {
    type: GCurrencyType,//奖励类型
    value: number,//奖励数值
}
/**
 * 任务信息
 * (用到的任务数据)
 */
export interface TaskInfo {

    /**任务类型*/detailType: TaskType,

    /**排序id*/sortIndex: number,

    /**任务名*/title: string,

    /**任务内容*/content: string,

    /**任务状态*/status: TaskStatusType,

    /**等待时间*/period?: number,//时间间隔(毫秒)

    /**任务次数限制*/rewardTime?: number,// -1为不限

    /**任务奖励*/reward: TaskAwardInfo[],

    /**任务进度显示*/competition: string,//例如0/3

    /**任务前置任务*/giftParams?: TaskType,//必须完成前置任务才能完成此任务


}

class TaskLogic_c {
    private static myInstance: TaskLogic_c = null as any;
    static Instance() {
        if (!this.myInstance) {
            this.myInstance = new TaskLogic_c();
        }
        return this.myInstance;
    }

    //任务更新触发key
    readonly TaskUpdateKey = 'TaskUpdate_';

    //当前任务信息
    curTaskInfoArr: TaskInfo[] = [];
    curTaskInfoObj: { [key: string]: TaskInfo } = {};



    private isInit = false;

    //任务icon所在路径
    private taskIconPath = 'https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/normal/C_client/taskIcon/';
    //浏览需要时间:ms
    private readonly browseTime = 10000;


    //------------------------------------------具体任务相关信息--------------------------------//
    //倒计时任务倒计时完成目标时间
    private targetCountDownTime = {};


    //去浏览的时间
    private goBrowseTime = {
        scanShop: 0,
        scanGoods: 0,
    };
    //购买任务，存储key
    private spendStoreKey = 'speedKey';
    private spendStoreTime = 0;

    // private inShare = 0;


    //------------------------------------------初始化--------------------------------//
    /**
     *  任务初始化操作
     * @param _successcallBack 获取任务列表成功才会返回
     * @param _waitTaskList 是否一直等待，直到获取任务成功
     * @returns 
     */
    Init(_successcallBack?: () => void, _waitTaskList = true) {
        if (this.isInit) {
            return;
        }
        this.getLocalStoreInfo();
        //开启任务倒计时
        this.TaskCountDown();
        //监听返回游戏
        Laya.stage.on(PlatformListenKey.onShow, this, () => {

            //浏览商品
            this.DetectWaitTaskResult(TaskType.scanGoods);
            //浏览商品
            this.DetectWaitTaskResult(TaskType.scanShop);
            //浏览购买
            this.DetectWaitTaskResult(TaskType.spend);
            //分享
            this.DetectWaitTaskResult(TaskType.friendship);

        })
        Laya.stage.on(PlatformListenKey.onHide, this, () => {
            // if (this.inShare == 1) {
            //     this.inShare = 2;
            // }

        })
        let _getlist = () => {
            this.UpdateTaskList((_success) => {
                if (_success) {

                    _successcallBack && _successcallBack();

                }
                else {
                    if (_waitTaskList) {
                        setTimeout(() => {
                            _getlist();
                        }, 100);
                    }
                }
            })
        }
        _getlist();
        //
        Laya.stage.on(PlatformListenKey.FavorChange, this, () => {
            if (!ModuleGlobal.IsActivityOn()) {
                console.error('活动结束不能再做任务');
                return;
            }
            if (ModulePlatformAPI.IsFavor) {
                this.ReportTask(TaskType.subscribeShop);
            }
        })
        Laya.stage.on(PlatformListenKey.MemberChange, this, () => {
            if (!ModuleGlobal.IsActivityOn()) {
                console.error('活动结束不能再做任务');
                return;
            }
            if (ModulePlatformAPI.IsMember) {
                this.ReportTask(TaskType.joinMember);
            }
        })


    }
    getLocalStoreInfo() {
        this.spendStoreTime = ModuleTool.GetLocalItem(this.spendStoreKey) || 0;
    }


    //-----------------------------------------------任务列表--------------------------------------//
    /**
     * 获取任务列表
     * appointUpdate 指定只更新某个任务
     */
    UpdateTaskList(_callBack?: (_success: boolean, _data?: TaskInfo[]) => void, appointUpdate?: TaskType | TaskType[]) {
        //假数据
        let _fakeData: TaskInfo[] = [
            {

                /**任务类型*/detailType: TaskType.checkInDay,
                /**排序id*/sortIndex: 1,
                /**任务名*/title: '每日签到',
                /**任务内容*/content: '每日签到内容',
                /**任务状态*/status: TaskStatusType.allow,
                /**任务次数限制*/rewardTime: 3,
                // /**等待时间*/period: 100000,
                /**任务奖励*/reward: [
                    {
                        type: GCurrencyType.wmScore,//奖励类型
                        value: 10,//奖励数值
                    },
                    // {
                    //     type: GCurrencyType.times,//奖励类型
                    //     value: 1,//奖励数值
                    // }
                ],
                /**任务进度显示*/competition: '1/3',//例如0/3

            },
            {

                /**任务类型*/detailType: TaskType.dayGift,
                /**排序id*/sortIndex: 1,
                /**任务名*/title: '每日礼包',
                /**任务内容*/content: '每日礼包内容',
                /**任务次数限制*/rewardTime: 1,
                /**任务状态*/status: TaskStatusType.allow,
                /**等待时间*/period: 11235,
                /**任务奖励*/reward: [
                    // {
                    //     type: GCurrencyType.wmScore,//奖励类型
                    //     value: 10,//奖励数值
                    // },
                    {
                        type: GCurrencyType.times,//奖励类型
                        value: 2,//奖励数值
                    }
                ],
                /**任务进度显示*/competition: '0/1',//例如0/3

                // /**前置任务*/giftParams: TaskType.joinMember,//例如0/3

            },
            {

                /**任务类型*/detailType: TaskType.collectGoods,
                /**排序id*/sortIndex: 1,
                /**任务名*/title: '收藏商品',
                /**任务内容*/content: '收藏商品内容',
                /**任务状态*/status: TaskStatusType.waiting,
                /**任务次数限制*/rewardTime: 1,
                /**等待时间*/period: 0,
                /**任务奖励*/reward: [
                    {
                        type: GCurrencyType.wmScore,//奖励类型
                        value: 10,//奖励数值
                    },
                    {
                        type: GCurrencyType.times,//奖励类型
                        value: 2,//奖励数值
                    }
                ],
                /**任务进度显示*/competition: '0/1',//例如0/3

            },
            {

                /**任务类型*/detailType: TaskType.scanGoods,
                /**排序id*/sortIndex: 1,
                /**任务名*/title: '浏览商品',
                /**任务内容*/content: '浏览商品内容',
                /**任务状态*/status: TaskStatusType.waiting,
                /**任务次数限制*/rewardTime: 3,
                /**等待时间*/period: 0,
                /**任务奖励*/reward: [
                    {
                        type: GCurrencyType.wmScore,//奖励类型
                        value: 10,//奖励数值
                    }
                ],
                /**任务进度显示*/competition: '0/3',//例如0/3

            },
            {

                /**任务类型*/detailType: TaskType.joinMember,
                /**排序id*/sortIndex: 1,
                /**任务名*/title: '加入会员',
                /**任务内容*/content: '加入会员内容',
                /**任务状态*/status: TaskStatusType.waiting,
                /**等待时间*/period: 0,
                /**任务奖励*/reward: [
                    {
                        type: GCurrencyType.wmScore,//奖励类型
                        value: 10,//奖励数值
                    },
                    {
                        type: GCurrencyType.times,//奖励类型
                        value: 2,//奖励数值
                    }
                ],
                /**任务进度显示*/competition: '0/3',//例如0/3

            },
            {

                /**任务类型*/detailType: TaskType.joinMember,
                /**排序id*/sortIndex: 1,
                /**任务名*/title: '加入会员',
                /**任务内容*/content: '加入会员内容',
                /**任务状态*/status: TaskStatusType.waiting,
                /**等待时间*/period: 0,
                /**任务奖励*/reward: [
                    {
                        type: GCurrencyType.wmScore,//奖励类型
                        value: 10,//奖励数值
                    },
                    {
                        type: GCurrencyType.times,//奖励类型
                        value: 2,//奖励数值
                    }
                ],
                /**任务进度显示*/competition: '0/3',//例如0/3

            },
            {

                /**任务类型*/detailType: TaskType.joinMember,
                /**排序id*/sortIndex: 1,
                /**任务名*/title: '加入会员',
                /**任务内容*/content: '加入会员内容',
                /**任务状态*/status: TaskStatusType.waiting,
                /**等待时间*/period: 0,
                /**任务奖励*/reward: [
                    {
                        type: GCurrencyType.wmScore,//奖励类型
                        value: 10,//奖励数值
                    },
                    {
                        type: GCurrencyType.times,//奖励类型
                        value: 2,//奖励数值
                    }
                ],
                /**任务进度显示*/competition: '0/3',//例如0/3

            },
            {

                /**任务类型*/detailType: TaskType.joinMember,
                /**排序id*/sortIndex: 1,
                /**任务名*/title: '加入会员',
                /**任务内容*/content: '加入会员内容',
                /**任务状态*/status: TaskStatusType.waiting,
                /**等待时间*/period: 0,
                /**任务奖励*/reward: [
                    {
                        type: GCurrencyType.wmScore,//奖励类型
                        value: 10,//奖励数值
                    },
                    {
                        type: GCurrencyType.times,//奖励类型
                        value: 2,//奖励数值
                    }
                ],
                /**任务进度显示*/competition: '0/3',//例如0/3

            },
            {

                /**任务类型*/detailType: TaskType.joinMember,
                /**排序id*/sortIndex: 1,
                /**任务名*/title: '加入会员',
                /**任务内容*/content: '加入会员内容',
                /**任务状态*/status: TaskStatusType.waiting,
                /**等待时间*/period: 0,
                /**任务奖励*/reward: [
                    {
                        type: GCurrencyType.wmScore,//奖励类型
                        value: 10,//奖励数值
                    },
                    {
                        type: GCurrencyType.times,//奖励类型
                        value: 2,//奖励数值
                    }
                ],
                /**任务进度显示*/competition: '0/3',//例如0/3

            },
        ]
        //获得数据
        let getData = (_getData: TaskInfo[]) => {
            if (!this.curTaskInfoArr) {
                this.curTaskInfoArr = _getData;
            }
            else {
                let _updateType: string | null = null;
                let _typesArr: TaskType[] = [];
                if (appointUpdate) {
                    if (typeof appointUpdate == 'string') {
                        _typesArr.push(appointUpdate);
                    }
                    else {
                        _typesArr = JSON.parse(JSON.stringify(appointUpdate));
                    }
                }
                while (_getData.length > 0) {
                    let _newtask: TaskInfo = null as any;
                    if (_typesArr.length > 0) {
                        _updateType = _typesArr.pop();
                    }
                    else {
                        _updateType = null;
                    }
                    if (_updateType) {
                        _newtask = _getData.find(v => v.detailType == _updateType);
                    }
                    else {
                        _newtask = _getData.pop();
                    }
                    if (!_newtask) {
                        console.error('没有找到任务', _updateType);
                        continue;
                    }

                    let _task = this.GetTaskInfo(_newtask.detailType);
                    let _triggerUpdate = false;
                    if (_task) {
                        for (const key in _task) {
                            if (_task[key] == _newtask[key]) {
                                continue;
                            }
                            _triggerUpdate = true;
                            _task[key] = _newtask[key];
                        }
                    }
                    else {
                        _triggerUpdate = true;
                        _task = _newtask;
                        this.curTaskInfoArr.push(_task);
                    }
                    if (_triggerUpdate) {
                        this.TriggerTaskUpdate(_newtask.detailType, _task);
                    }
                    if (_updateType && _typesArr.length <= 0) {
                        break;
                    }
                }
            }

            for (const task of this.curTaskInfoArr) {
                //满足倒计时条件
                if (task.status == TaskStatusType.waiting
                    && task.period > 0) {

                    this.targetCountDownTime[task.detailType] = Date.now() + task.period;
                    // console.error('targetCountDownTime ', task.detailType, this.targetCountDownTime[task.detailType]);
                }
                //添加一个任务对象方便查找
                this.curTaskInfoObj[task.detailType] = task;
            }


            _callBack && _callBack(true, this.curTaskInfoArr);
            Laya.stage.event('refreshBubble');
        }

        if (ModulePackage.Instance.CanUseNetAPI()) {

            //从服务端获取真实数据
            ModulePackage.Instance.SendNetMessage("", "/C/task/getTaskList", {}, "post", this,
                (data) => {

                    console.log("getTaskList", data);
                    if (data.code != 0) {
                        _callBack && _callBack(false);
                        return;
                    }
                    //检测数据是否吻合
                    ModuleTool.DetectType('getTaskList', data.data, _fakeData);

                    //获得数据
                    getData(JSON.parse(JSON.stringify(data.data)));

                });

        }
        else {
            getData(_fakeData);
        }
    }



    //-----------------------------------------------做任务和领奖--------------------------------------//
    /**
     * 去做任务
     * @param _type 
     * @param _callback 其中_awardata只有在_degree ==2时才会有内容
     * @param _degree 做任务的程度(注意：购买任务不能是0,0会默认改为2)
     * 0：只做任务，完成则返回结果
     * 1：做任务，并上报任进度
     * 2：只做任务，上报进度，并且领取奖励
     * 
     *  * @param _showAwardPopup 获得购买奖励后是否显示购买弹窗(默认不显示)
     */
    DoTask(_type: TaskType, _callback?: (_success: boolean, _awardata?: TaskAwardInfo[]) => void, _degree = 0, _showAwardPopup = false) {
        console.log('去做任务:', _type);
        // let _curTask = this.GetTaskInfo(_type);
        //回调结果
        let _doCallback = (_success: boolean) => {

            console.log('做任务结果:', _type, _success);
            if (!_success) {
                _callback && _callback(_success);
                return;
            }

            switch (_degree) {
                case 0:
                    _callback && _callback(_success);
                    break;
                case 1:
                    this.ReportTask(_type, _callback);
                    break;
                case 2:
                    this.ReportTask(_type, (_success: boolean) => {
                        if (!_success) {
                            _callback && _callback(_success);
                            return;
                        }
                        this.ReceiveTaskAward(_type, _callback, _showAwardPopup);
                    }, false);
                    break;

                default:
                    break;
            }
        }
        //完成当前任务
        let _toComplete = () => {
            let _curTask = this.GetTaskInfo(_type);
            if (_curTask && _curTask.status == TaskStatusType.finish && _degree > 0) {
                _doCallback(false);
                return;
            }
            if (_curTask && _curTask.status == TaskStatusType.allow && _degree > 0) {
                _doCallback(true);
                return;
            }
            //去做任务
            switch (_type) {

                case TaskType.joinMember://入会
                    ModulePlatformAPI.OpenMember((_isFavor) => {
                        _doCallback(_isFavor);
                    })
                    break;
                case TaskType.subscribeShop://关注店铺
                    ModulePlatformAPI.FavorShop((_isFavor) => {
                        _doCallback(_isFavor);
                    })
                    break;

                case TaskType.dayGift:
                    break;
                case TaskType.checkInDay:
                    break;
                case TaskType.memberAward:
                    break;
                case TaskType.collectGoods:
                    uiTaskBrowse.Show('collect', (_goodsid) => {
                        console.log('uiTaskBrowse clickok', _type, _goodsid);
                        ModulePlatformAPI.CollectGoods(_goodsid, (_success) => {
                            if (_success) {
                                uiTaskBrowse.Hide();
                            }
                            _doCallback(_success);
                        })
                    })
                    break;
                case TaskType.scanShop:

                    this.goBrowseTime[_type] = 0;
                    ModulePlatformAPI.NavigateToTaobaoPage((_navigateSuccess) => {
                        ModulePlatformAPI.showToast('浏览10秒即可获得奖励')
                        //关注店铺
                        if (_navigateSuccess) {
                            //bug,因为关注店铺会成功会自动调用淘宝的onshow方法，暂时先延时获取成功来处理
                            let _delayTime = 1000;
                            setTimeout(() => {
                                this.goBrowseTime[_type] = Date.now() - _delayTime;
                                this.WaitTaskResult(_type, (_success) => {
                                    _doCallback(_success);
                                    if (_success) {
                                        ModulePlatformAPI.showToast('浏览成功')
                                    }
                                    else {
                                        ModulePlatformAPI.showToast('浏览时长不够')
                                    }
                                })
                            }, _delayTime);

                        } else {
                            _doCallback(_navigateSuccess);
                        }

                    })
                    break;
                case TaskType.scanGoods:
                    this.goBrowseTime[_type] = 0;
                    uiTaskBrowse.Show('browse', (_goodsid) => {
                        console.log('uiTaskBrowse clickok', _type, _goodsid);

                        ModulePlatformAPI.showToast('浏览10秒即可获得奖励')
                        ModulePlatformAPI.OpenShopItemDetail('' + _goodsid, (_opensuccess) => {
                            if (_opensuccess) {
                                this.goBrowseTime[_type] = Date.now();
                                this.WaitTaskResult(_type, (_success) => {
                                    _doCallback(_success);
                                    if (_success) {
                                        uiTaskBrowse.Hide();
                                        ModulePlatformAPI.showToast('浏览成功')
                                    }
                                    else {
                                        ModulePlatformAPI.showToast('浏览时长不够')
                                    }
                                })

                            }
                            else {

                                _doCallback(_opensuccess);
                            }

                        })
                    })

                    break;

                case TaskType.spend:
                    uiTaskBrowse.Show('buy', (_goodsid) => 
                    {
                        console.log('uiTaskBrowse clickok', _type, _goodsid);
                        this.ReportTask(_type, (_success1) => {
                            if (!_success1) {

                                return;
                            }
                            ModulePlatformAPI.showSku('' + _goodsid, (_success) => {
                                if (_success) {
                                    //购买任务只能是2,因为购买行为需要先成功领取奖励才能判断成功
                                    //购买任务单独处理
                                    this.spendStoreTime = Date.now();
                                    ModuleTool.SetLocalItem(this.spendStoreKey, this.spendStoreTime);

                                    this.WaitTaskResult(_type, (_success, _award) => {
                                        if (_success) {
                                            uiTaskBrowse.Hide();
                                        }
                                        _callback && _callback(_success, _award);
                                        if (_showAwardPopup) {
                                            uiGetReward.Show(_award);
                                        }
                                    })
                                }

                            })
                            // _doCallback(_success);

                        })
                    })
                    break;

                case TaskType.friendship:
                    ModuleStatistics.ClickShare();
                    ModulePlatformAPI.Share(() => {
                        ModuleStatistics.ShareSuccess();
                        if (_degree == 0) {
                            _callback && _callback(true);
                        }
                        else {
                            this.WaitTaskResult(_type, (_success, _award) => {
                                _callback && _callback(_success, _award);
                                if (_showAwardPopup && _award) {
                                    uiGetReward.Show(_award);
                                }
                            })
                        }

                    }, () => {
                        _callback && _callback(false);
                    })
                    break;
                // case TaskType.scanLive:
                // case TaskType.joinGroup:

                // break;

                default:
                    console.error('[DoTask]未知任务！', _type);
                    return;
            }
        }

        //先检测完成前置任务
        this.DetectShowPreTask(_type, (_success) => {
            if (!_success) {
                return;
            }
            _toComplete();
        })



    }
    /**
     * 向服务端上报任务状态
     * @param _type 
     * @param _callback 
     * @returns 
     */
    ReportTask(_type: TaskType, _callback?: (_success: boolean) => void, _refreshTaskState = true) {
        console.log('上报任务', _type);
        //模拟上报
        if (!ModulePackage.Instance.CanUseNetAPI()) {
            _callback && _callback(true);
            return;
        }

        let _netPort = '';
        let _sendData = undefined;
        switch (_type) {
            //入会
            case TaskType.joinMember:
            //关注店铺
            case TaskType.subscribeShop:
                //从服务端获取真实数据
                _netPort = "/C/task/entranceMember";
                _sendData = { detailType: _type, outcome: 'success' };

                break;
            //购买奖励
            case TaskType.spend:
                _netPort = "/C/task/spendReport";
                // _sendData = { detailType: _type };
                break;
            case TaskType.scanShop:
                _netPort = "/C/task/taskReport";
                _sendData = { detailType: _type };

                break;

            default:
                // console.error('[ReportTask]没有此上报操作！', _type);

                _netPort = "/C/task/taskReport";
                _sendData = { detailType: _type };
                _callback && _callback(true);
                return;
        }
        ModulePackage.Instance.SendNetMessage("", _netPort, _sendData, "post", this,
            (data) => {
                if (data.code != 0) {
                    //活动已结束
                    if (data.code == 98 || data.code == 99) {
                        ModuleGlobal.ChangeActivityState(data.code == 98 ? 'unstart' : 'off', data.msg);
                        uiAlert.AutoShowActivityState();
                        // uiAlert.Show({ content: _data.msg });
                    }
                    console.error('上报失败', _type, data.code, data.msg);
                    _callback && _callback(false);
                    return;
                }
                //刷新任务列表
                _refreshTaskState && this.ToUpdateTaskState(_type);
                _callback && _callback(true);
            });
    }

    /**
     * 领取任务奖励
     * @param _type 
     * @param _callback 
     * @param _showAwardPopup 是否显示获得奖励弹窗，默认显示
     * @returns 
     */
    ReceiveTaskAward(_type: TaskType, _callback?: (_success: boolean, _awardata?: TaskAwardInfo[], _otherInfo?: any) => void, _showAwardPopup = true) {
        console.log('领取任务奖励', _type);
        //去领取奖励
        let _toReceive = () => {

            //显示奖励弹窗
            let _showReward = (_reward, _userlist?: any) => {
                if (TaskType.friendship == _type && _userlist && _userlist.length > 0) {
                    uiTaskInvite.Show({
                        type: 'invit',
                        info: _userlist,
                        callBack: () => {
                            console.log('uiGetReward', _type, _reward);
                            //显示获得奖励弹窗
                            uiGetReward.Show(_reward);
                        }
                    })
                }
                else {
                    // console.error('uiGetReward', _type, _reward);

                    //显示获得奖励弹窗
                    uiGetReward.Show(_reward);
                }
            }
            //模拟
            if (!ModulePackage.Instance.CanUseNetAPI()) {
                let _reward: TaskAwardInfo[] = [
                    {
                        type: GCurrencyType.wmScore,//奖励类型
                        value: 10,//奖励数值
                    },
                    {
                        type: GCurrencyType.times,//奖励类型
                        value: 1,//奖励数值
                    }
                ];
                let _result = true;
                _callback && _callback(_result, _reward);
                if (_result && _showAwardPopup) {
                    //显示获得奖励弹窗
                    _showReward(_reward, _type == TaskType.friendship ? [{ avatar: '', nickName: '被邀请人' }] : undefined);
                    // uiGetReward.Show(_reward);
                }
                return;
            }
            if (!this.GetTaskInfo(_type)) {
                _callback && _callback(false);
                return;
            }

            let _netPort = '';
            let _sendData = undefined;
            switch (_type) {

                case TaskType.joinMember://入会
                case TaskType.subscribeShop://关注店铺
                    _netPort = 'getMemberOrFollowPrize';
                    _sendData = { detailType: _type };

                    break;
                case TaskType.dayGift://每日礼包
                    _netPort = 'getDayGift';
                    break;

                case TaskType.checkInDay:
                case TaskType.memberAward:
                case TaskType.collectGoods:
                case TaskType.scanShop:
                case TaskType.scanGoods:
                    // case TaskType.scanLive:
                    // case TaskType.joinGroup:
                    _netPort = 'getTaskPrize';
                    _sendData = { detailType: _type };

                    break;

                case TaskType.spend:
                    _netPort = 'getSpendPrize';
                    break;

                case TaskType.friendship:
                    _netPort = 'getInvitePrize';
                    break;

                default:
                    console.error('[ReceiveTaskAward]不合法的领取操作！', _type);
                    return;
            }

            //从服务端获取真实数据
            ModulePackage.Instance.SendNetMessage("", "/C/task/" + _netPort, _sendData, "post", this,
                (_data) => {
                    if (_data.code != 0) {
                        //活动已结束
                        if (_data.code == 98 || _data.code == 99) {
                            ModuleGlobal.ChangeActivityState(_data.code == 98 ? 'unstart' : 'off', _data.msg);
                            uiAlert.AutoShowActivityState();
                            // uiAlert.Show({ content: _data.msg });
                        }
                        console.error('领取任务奖励失败', _data.code, _type, _data.msg);
                        _callback && _callback(false);
                        return;
                    }
                    //获取奖励内容
                    let _reward: TaskAwardInfo[] = undefined;
                    let _isArr = Array.isArray(_data.data);
                    if (_isArr) {
                        _reward = _data.data;
                    }
                    else {
                        _reward = _data.data.reward;
                    }
                    //查找并删除数据为0的奖励
                    if (_reward && _reward.length > 0) {
                        for (let index = _reward.length - 1; index >= 0; index--) {
                            const element = _reward[index];
                            if (!element.value) {
                                _reward.splice(index, 1);
                            }

                        }
                    }

                    _callback && _callback(true, _reward);
                    //任务打点
                    ModuleStatistics.CompleteTask(_type);
                    //任务消费打点
                    if (_type == TaskType.spend) {
                        let _record = _data.data.numIids || {};
                        let _payN = '' + _data.data.totalFee;
                        let _rewardN = '';
                        let _timesN = '';
                        if (_reward) {
                            let _rn = _reward.find(v => v.type == GCurrencyType.wmScore);
                            if (_rn) {
                                _rewardN = '' + _rn.value;
                            }
                            let _tn = _reward.find(v => v.type == GCurrencyType.times);
                            if (_tn) {
                                _timesN = '' + _tn.value;
                            }
                        }
                        ModuleStatistics.TaskPay(_record, _payN, _rewardN, _timesN);
                    }
                    if (_showAwardPopup) {
                        _showReward(_reward, _data.data.userList);

                    }
                    if (_reward) {

                        for (const iterator of _reward) {
                            if (iterator.type) {
                                //更新货币
                                ModuleGlobal.UpdateCurrency(iterator.type);
                            }
                        }

                    }
                    //刷新任务列表
                    // this.UpdateTaskList(undefined, _type);
                    this.ToUpdateTaskState(_type)
                });
        }
        //领取前确定前置任务已完成
        this.DetectShowPreTask(_type, (_success) => {
            if (!_success) {
                return;
            }
            _toReceive();


        });

    }
    /**
     * 检测执行前置任务
     * @param _taskT 
     * @param _completeCallback 
     */
    DetectShowPreTask(_taskT: TaskType | TaskInfo, _completeCallback?: (_success: boolean) => void) {
        let _curTask = null as TaskInfo
        if (typeof _taskT == 'object') {
            _curTask = _taskT;
        }
        else {
            _curTask = this.GetTaskInfo(_taskT);
        }
        if (_curTask && _curTask.giftParams) {
            let _preTask = this.GetTaskInfo(_curTask.giftParams);
            if (!_preTask) {
                ModulePlatformAPI.showToast("未找到前置任务:" + _curTask.giftParams);
            }
            if (_preTask && _preTask.status == TaskStatusType.waiting) {
                uiTaskPrecondition.Show({
                    info: { title: _preTask.title }, callBack: (_successCallback?: Function) => {

                        this.DoTask(_curTask.giftParams, (_success: boolean) => {
                            if (_success) {
                                //完成前置任务关闭前置任务界面
                                _successCallback && _successCallback();
                                this.ToUpdateTaskState(_curTask.detailType, () => {
                                    _completeCallback && _completeCallback(_success);
                                })
                            }
                            else {
                                _completeCallback && _completeCallback(_success);
                            }

                        }, 1)
                    }
                })
            }
            else {
                _completeCallback && _completeCallback(true);
            }

        }
        else {
            _completeCallback && _completeCallback(true);
        }
    }


    //-----------------------------------------------需要等待完成的任务--------------------------------------//
    private taskResultCallback: { [key: string]: (_success: boolean, _info?: any) => void } = {};
    /**
     * 等待任务执行结果
     * @param _type 
     * @param _callback 
     */
    WaitTaskResult(_type: TaskType, _callback?: (_success: boolean, _info?: any) => void) {
        this.taskResultCallback[_type] = _callback;
    }
    /**
     * 获得等待任务的结果
     * @param _type 
     * @param _success 
     */
    DetectWaitTaskResult(_type: TaskType) {

        if (!ModuleGlobal.IsActivityOn()) {
            console.error('活动结束不能再做任务');
            return;
        }
        let fireWaitTaskResult = (_success: boolean, _info?: any) => {
            this.taskResultCallback[_type] && this.taskResultCallback[_type](_success, _info);
            this.taskResultCallback[_type] = null;
        }
        switch (_type) {
            //浏览店铺
            case TaskType.scanGoods:
            case TaskType.scanShop:
                if (this.goBrowseTime[_type] > 0) {
                    if (Date.now() - this.goBrowseTime[_type] >= this.browseTime) {
                        fireWaitTaskResult(true);
                    }
                    else {
                        fireWaitTaskResult(false);
                    }
                    this.goBrowseTime[_type] = 0;
                }
                break;
            //购买商品
            case TaskType.spend:
                if (this.spendStoreTime > 0) {
                    //检测次数
                    let _tryTime = 1;
                    //如果有购买行为尝试获取奖励
                    let _detect = () => {
                        _tryTime--;
                        this.ReceiveTaskAward(_type, (_success, _award) => {
                            if (_success) {
                                this.spendStoreTime = 0;
                                ModuleTool.SetLocalItem(this.spendStoreKey, this.spendStoreTime);
                                fireWaitTaskResult(true, _award);
                            }
                            else {
                                //购买没成功5秒后再检测
                                if (_tryTime > 0) {
                                    setTimeout(() => {
                                        _detect();
                                    }, 5000);
                                }
                            }
                        }, false);
                    }
                    _detect();

                }
                // if (uiTaskBrowse.curType == 'browse' && this.goBrowseTime > 0) {
                //     if (Date.now() - this.goBrowseTime >= this.browseTime) {
                //         fireWaitTaskResult(true);
                //     }
                //     this.goBrowseTime = 0;
                // }
                break;
            //分享好友
            case TaskType.friendship:
                //检测次数
                let _tryTime = 1;
                let _detect = () => {
                    _tryTime--;
                    this.ReceiveTaskAward(_type, (_success, _award) => {
                        if (_success) {
                            fireWaitTaskResult(true, _award);
                        }
                        else {
                            //没成功5秒后再检测
                            if (_tryTime > 0) {
                                setTimeout(() => {
                                    _detect();
                                }, 5000);
                            }
                        }
                    }, false);
                }
                _detect();
                break;

            default:
                return;
        }


    }




    //-----------------------------------------------其他--------------------------------------//

    /**
     * 自动判断显示任务外部弹窗
     * @param _type 
     * @param _callback 
     */
    AutoShowExtraPopup(_type: TaskType, _parent?: fgui.GComponent, _callback?: (_success: boolean) => void) {
        let _task = this.GetTaskInfo(_type);
        console.log('_task', _task)
        if (_task.status == TaskStatusType.finish
            || (_task.status == TaskStatusType.waiting && _task.period > 0)) {
            _callback && _callback(false);
            return;
        }
        console.log('AutoShowExtraPopup');

        uiTaskExtraPopup.Show({
            // parent:_parent
            info: { type: _type }, callBack: (_successCallback?: Function) => {
                this.DoTask(_type, (_success) => {
                    if (_success) {
                        _successCallback && _successCallback();
                    }
                    _callback && _callback(_success);
                }, 2, true)
            }
        })
    }


    //任务倒计时
    private TaskCountDown() {
        //每次循环用时ms
        const perMS = 200;
        setInterval(() => {
            let _t = Date.now();


            for (const key in this.targetCountDownTime) {
                let _time = this.targetCountDownTime[key] - _t;

                if (_time <= 0) {
                    _time = 0;
                    delete this.targetCountDownTime[key];
                    //刷新倒计时完成的任务
                    this.ToUpdateTaskState(key as any);
                }
                if (_time % 1000 < perMS) {
                    // console.log('TriggerTaskUpdate', _time / 1000);
                    let _task = this.GetTaskInfo(key as any);
                    if (_task) {
                        _task.period = _time;
                        this.TriggerTaskUpdate(key as any, _task);
                    }
                }

            }
        }, perMS)
    }
    //去更新此任务状态
    ToUpdateTaskState(_type: TaskType, _callBack?: (_success: boolean) => void) {
        let _tasks: TaskType[] = [];
        let _relationTasks = this.GetRelationTasks(_type);
        if (_relationTasks.length > 0) {
            for (const iterator of _relationTasks) {
                _tasks.push(iterator)
            }
        }
        _tasks.push(_type)
        this.UpdateTaskList(_callBack, _tasks);
    }
    //任务已任务更新触发任务更新监听
    private TriggerTaskUpdate(_type: TaskType, _newInfo: TaskInfo) {
        Laya.stage.event(this.TaskUpdateKey + _type, _newInfo);
    }
    /**
     * 监听任务更新
     * @param _type 监听的任务类型
     * @param _caller 监听所在对象
     * @param _callBack 监听回调
     */
    ListenTaskUpdate(_type: TaskType, _caller: any, _callBack: (_newInfo: TaskInfo) => void) {
        Laya.stage.on(this.TaskUpdateKey + _type, _caller, _callBack);
    }


    //-----------------------------------------------获取任务相关信息--------------------------------------//
    /**
     * 获取任务信息
     * @param _type 
     * @returns 
     */
    GetTaskInfo(_type: TaskType) {
        // let _task = this.curTaskInfoArr.find(v => v.detailType == _type);
        let _task = this.curTaskInfoObj[_type];
        return _task;
    }
    GetAllTaskInfo() {
        return this.curTaskInfoArr;
    }
    private relationTasks: { [key: string]: TaskType[] } = {};
    /**
     * 获取关联任务（此任务变更，其他任务也可能变更的任务为关联任务）
     * @param _type 
     * @returns 
     */
    GetRelationTasks(_type: TaskType) {
        if (this.relationTasks[_type]) {
            return this.relationTasks[_type];
        }
        let _taskTypes: TaskType[] = [];
        let _curtask = this.GetTaskInfo(_type);
        if (!_curtask) {
            this.relationTasks[_type] = _taskTypes;
            return _taskTypes;
        }
        for (const iterator of this.GetAllTaskInfo()) {
            if (iterator.giftParams && iterator.giftParams == _type) {
                _taskTypes.push(iterator.detailType);
            }
        }
        this.relationTasks[_type] = _taskTypes;
        return _taskTypes;

    }

    /**
     * 获取指定任务的指定类型奖励数量
     * 没有则返回0
     */
    GetTaskAwardValue(_taskT: TaskType | TaskInfo, _awardType: GCurrencyType) {
        let _task = null as TaskInfo
        if (typeof _taskT == 'object') {
            _task = _taskT;
        }
        else {
            _task = this.GetTaskInfo(_taskT);
        }
        let _award = _task.reward.find(v => v.type == _awardType);
        if (!_award) {
            return 0;
        }
        return _award.value;
    }


    /**
     * 更改任务图标所在路径
     */
    ChangeTaskIconPath(_path: string) {
        this.taskIconPath = _path;
    }
    /**
     * 获取任务图标url
     * 图标路径为基础路径+任务类型+".png"
     * @param _type 
     */
    GetTaskIconUrl(_type: TaskType) {
        return this.taskIconPath + _type + '.png';
    }


}
export let TaskLogic = TaskLogic_c.Instance();
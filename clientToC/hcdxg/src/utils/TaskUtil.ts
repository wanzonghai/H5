// import { Global } from '../config/Global';
// import MainUtil from './MainUitl';
// import PlayDataUtil from '../data/PlayDataUtil';
// import TB from '../platform/TB';
// import { GameLogic } from '../FGUIClass/GameLogic';
// // //任务ID枚举
// // export enum TaskID {

// //     //签到
// //     SingIn = 1,
// //     //关注店铺
// //     Attention = 2,
// //     //会员福利
// //     MemberBenefits = 3,
// //     //商品收藏
// //     Collect = 4,
// //     //浏览商品
// //     Browse = 5,
// //     //加入会员
// //     JoinMember = 6,
// //     //买商品送福利
// //     BuyAward = 7,
// //     //邀请好友
// //     Invite = 8,
// //     //每日礼包
// //     DailyGift = 9,
// // }
// //任务ID枚举
// export enum TaskID {
//     //福袋********新
//     LuckyBag = 1,
//     //邀请好友
//     Invite = 2,
//     //签到
//     SingIn = 3,
//     //加入会员
//     JoinMember = 4,
//     //浏览店铺首页********新
//     BrowseHomePage = 5,
//     //关注店铺
//     Attention = 6,
//     //浏览商品
//     Browse = 7,
//     //浏览新商品
//     BrowseNew = 8,

//     // //会员福利
//     // MemberBenefits = 3,
//     // //商品收藏
//     // Collect = 4,


//     // //买商品送福利
//     // BuyAward = 7,

//     // //每日礼包
//     // DailyGift = 9,
// }
// //任务类型枚举
// export enum TaskType {
//     //倒计时任务，有任务时间间隔
//     TimeLimit = 1,
//     //即时任务,完成超过限额就是已领取
//     Attention = 2,
//     //进度任务，完成任务需要多步
//     Progerss = 3,
//     //状态任务，任务情况和某种状态有关
//     Status = 4,
//     //淘宝控制的任务
//     Taobao = 5,
// }
// //任务状态枚举
// export enum TaskState {
//     //可以领取状态
//     CanGet = 0,
//     //未达到领取条件状态
//     Unmet = 1,
//     //已经领取状态
//     GOT = 2,
// }
// export default class TaskUtil extends Laya.Script {
//     static taskState: any[];
//     static _taskList: any[];        //神兽任务
//     static _tbTaskList: any[];      //淘宝+神兽任务
//     static _TBFinish: { task: string; finish: number; };    //进行中的淘宝任务完成情况
//     static _maxId: number;          //淘宝任务起始id
//     static _tbTaskCount: number;    //淘宝任务数量
//     static _tbTask: any;            //淘宝任务

//     static init() {
//         this._taskList = [];
//         let list = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.taskConfig);
//         console.log('====== Task init ======', list);
//         this._maxId = 0;
//         for (let i = 0; i < list.length; i++) {
//             const task = list[i];
//             // console.log('reward type', task.rewardType_1, task.rewardCount_1);
//             let taskData = {
//                 id: task.id,
//                 type: task.type,//1-每日任务，2-成就任务
//                 tType: task.tType,//1-倒计时，2-即时，3-进度，4-状态，5-淘宝
//                 mType: task.mType,//'normal':正常任务，'more':小任务
//                 task: task.task,
//                 title: task.title,
//                 need: task.need,
//                 limit: task.limit,
//                 sortId: task.sortId,
//                 reward: {//金币
//                     type: 'Coin',
//                     count: task.rewardCount_1,
//                     id: task.rewardId || 1,
//                 },
//                 reward2: {//积分
//                     type: 'Point',
//                     count: task.rewardCount_2,
//                     id: task.rewardId || 1,
//                 },
//                 get: 0,
//                 state: 1, //0-领取，1-前往，2-已领
//                 finish: 0,
//                 rewardType: task.rewardType
//                 // rewardType: []
//             }
//             // taskData.rewardType = JSON.parse(task.rewardType);
//             // console.log('taskData', JSON.parse(task.rewardType));
//             // console.log('taskData22', taskData);
//             // //购买赠送
//             // if (taskData.id == TaskID.BuyAward) {
//             //     Global.ResourceManager.saveExchangeIdx(taskData.reward.count, taskData.reward2.count);
//             // }

//             this._taskList.push(taskData);
//             this._maxId = Math.max(this._maxId, task.id);
//             this._tbTask = [];
//         }

//         // this.getTaskList();
//         this._TBFinish = { task: '', finish: 0 };
//     }

//     //设置当前淘宝任务完成次数
//     static setTBFinish(title, count) {
//         this._TBFinish = { task: title, finish: count }
//     }

//     //获取当前淘宝任务完成次数
//     static getTBFinish() {
//         return this._TBFinish;
//     }

//     //查看是否为淘宝任务ID
//     static isTBTaskId(id) {
//         // console.log('===== id = %s maxId = %s, count = %s ========', id, this._maxId, this._tbTaskCount)
//         if (parseInt(id) >= this._maxId + 1 && parseInt(id) <= this._maxId + this._tbTaskCount) {
//             return true
//         }

//         return false
//     }

//     //查看淘宝是否已提供同类型任务
//     static checkTBTask(id) {
//         // let title = id == 1 ? '签到任务' : id == 4 ? "浏览店铺" : "";
//         // for (let i = 0; i < this._tbTask.length; i++) {
//         //     const task = this._tbTask[i];
//         //     if (title == task.title) {
//         //         return true;
//         //     }
//         // }

//         return false;
//     }

//     // //更新任务状态
//     // static updateState() {
//     //     this.taskState = [];
//     //     for (let i = 0; i < this._taskList.length; i++) {
//     //         let task = this._taskList[i];
//     //         let id = task.id;

//     //         if (task.tType == 1) {//倒计时任务
//     //             let cache = this.getCache(task.id);
//     //             this.taskState[id] = task.get >= task.limit ? 2 : 1;
//     //             if (MainUtil.getTimeSpan(cache, new Date().getTime()) > task.need && task.get < task.limit) {
//     //                 //时间满足条件才可领取
//     //                 this.taskState[id] = 0;
//     //             }

//     //             //会员状态才可领取会员福利
//     //             if (!PlayDataUtil.data.isMember && id == 3) {
//     //                 this.taskState[id] = 1;
//     //             }
//     //         } else if (task.tType == 2) {//即时任务
//     //             this.taskState[id] = task.get >= task.limit ? 2 : 1;//完成超过限额就是已领取
//     //         } else if (task.tType == 3) {//进度任务
//     //             if (task.get >= task.need) {
//     //                 if (id == 12) {//招财喵
//     //                     this.taskState[id] = PlayDataUtil.data.myRoleIDArray.indexOf(12) == -1 ? 0 : 2;
//     //                 } else if (id == 10) {//分享牛气
//     //                     this.taskState[id] = PlayDataUtil.data.myRoleIDArray.indexOf(13) == -1 ? 0 : 2;
//     //                 } else if (id == 11) {//邀请送福娃
//     //                     this.taskState[id] = PlayDataUtil.data.myRoleIDArray.indexOf(5) == -1 ? 0 : 2;
//     //                 } else if (id == 7) {//游戏送好礼
//     //                     this.taskState[id] = 0;
//     //                 }
//     //             } else {
//     //                 this.taskState[id] = 1;
//     //             }
//     //         } else if (task.tType == 4) {//状态任务
//     //             if (task.get >= 1) { //已领奖次数大于1，直接显示已领取
//     //                 this.taskState[id] = 2;
//     //             } else {
//     //                 if (id == 9) { //加入会员
//     //                     this.taskState[id] = PlayDataUtil.data.isMember ? 0 : 1;
//     //                 } else if (id == 8) { //关注店铺
//     //                     this.taskState[id] = PlayDataUtil.data.isVip ? 0 : 1;
//     //                 }
//     //             }
//     //         }

//     //         task.state = this.taskState[id];
//     //     }
//     //     console.log('==== taskState ====', this.taskState);
//     //     PlayDataUtil.setData('taskState', this.taskState)
//     // }

//     //任务描述：opt-任务数据
//     static taskFormat(opt) {
//         let task = opt.task;
//         task = task.replace(/<br>/g, '\n').replace(/#limit#/g, opt.limit).replace(/#rewardCount#/g, opt.reward.count).replace(/#need#/g, opt.need).replace(/#get#/g, opt.finish);
//         return task;
//     }

//     //保存倒计时任务缓存时间
//     static setCache(id) {
//         let time = new Date().getTime();
//         switch (id) {
//             case TaskID.SingIn://每日签到
//                 PlayDataUtil.setData('freeCache', time);
//                 break;
//             // case 9://每日礼包
//             //     PlayDataUtil.setData('openGiftCache', time);
//             //     break;
//             // case 3://会员福利
//             //     PlayDataUtil.setData('memberFreeCache', time);
//             //     break;
//             default:
//                 break;
//         }
//         return time;
//     }

//     //倒计时任务缓存时间
//     static getCache(id) {
//         switch (id) {
//             case TaskID.SingIn://每日签到
//                 return PlayDataUtil.data.freeCache;
//             // case 9://每日礼包
//             //     return PlayDataUtil.data.openGiftCache;
//             // case 3://会员福利
//             //     return PlayDataUtil.data.memberFreeCache;
//             default:
//                 return 0;
//         }
//     }

//     //获取神兽任务列表
//     static getTaskList(cb = () => { }) {
//         console.log('======= getTaskList ===========');
//         if (Laya.Browser.onTBMiniGame) {
//             let reqData = {
//                 activeId: TB._activeId,
//             }
//             let info = { "id": Global.MSG_GET_TASKLIST, "data": reqData };
//             TB.sendMsg(info, (buf) => {
//                 if (buf.code == 0) {
//                     console.log("任务列表获取成功:2002", JSON.stringify(buf));
//                     this.updateTaskList(buf.data, cb);

//                 } else {
//                     console.log("任务列表获取失败:2002");
//                 }
//             });
//         } else {
//             let buf = { "code": 0, "message": "成功", "data": [{ "id": 1, "finish": 0, "state": 1, "get": 0, "need": 180 }, { "id": 2, "finish": 0, "get": 0, "state": 1 }, { "id": 3, "finish": 0, "get": 0, "state": 0, "need": 180 }, { "id": 4, "finish": 0, "get": 0, "state": 0 }, { "id": 5, "finish": 0, "get": 0, "state": 0 }, { "id": 6, "finish": 0, "get": 0, "state": 1 }, { "id": 7, "finish": 0, "get": 0, "state": 1 }, { "id": 8, "finish": 0, "get": 0, "state": 0 }, { "id": 9, "finish": 0, "get": 0, "state": 1 }, { "id": 10, "finish": 0, "get": 0, "state": 0 }, { "id": 11, "finish": 0, "get": 0, "state": 1 }, { "id": 12, "finish": 0, "get": 0, "state": 1 }, { "id": 13, "finish": 0, "get": 0, "state": 1 }] }
//             this.updateTaskList(buf.data, cb);
//         }
//     }

//     //更新神兽任务列表
//     static updateTaskList(list, cb) {
//         console.log('======= updateList ===========', JSON.stringify(this._taskList));
//         GameLogic.haveBrowseNewTask = false;
//         for (let i = 0; i < list.length; i++) {
//             const data = list[i];
//             // console.log('data', data);
//             //判断是否有浏览新商品任务
//             if (data.id == TaskID.BrowseNew) {
//                 GameLogic.haveBrowseNewTask = true;
//                 GameLogic.GetBrowseNewInfo(undefined, true);
//             }
//             for (let j = 0; j < this._taskList.length; j++) {
//                 const task = this._taskList[j];
//                 //console.log('updateList', 0, i, j);
//                 if (data.id == task.id) {
//                     if (data.get != undefined) {
//                         task.get = data.get;
//                     }
//                     if (data.finish != undefined) {
//                         task.finish = data.finish;
//                     }
//                     if (data.state != undefined) {
//                         task.state = data.state;
//                     }
//                     if (data.need != undefined) {
//                         task.need = data.need;
//                     }

//                     if (data.limit != undefined) {
//                         task.limit = data.limit;
//                     }
//                     // if (data.type) task.type = data.type;
//                     //console.log('updateList', 1);
//                     if (data.rewardType != undefined) task.rewardType = data.rewardType;

//                     if (data.rewardCount_1 != undefined) task.reward.count = data.rewardCount_1;
//                     if (data.rewardCount_2 != undefined) task.reward2.count = data.rewardCount_2;
//                     //console.log('updateList', 2);
//                     // if(data.){}

//                     // console.log('==== %s ====', task.title, task);
//                     if (task.tType == TaskType.TimeLimit && task.state != TaskState.GOT) {//倒计时任务
//                         let cache = this.getCache(task.id);
//                         if (MainUtil.getTimeSpan(cache, new Date().getTime()) > task.need && task.get < task.limit) {
//                             //时间满足条件才可领取
//                             task.state = TaskState.CanGet;
//                             console.log('==== 倒计时任务刷新 ====');
//                         }
//                     }
//                     //console.log('updateList', 3);
//                     // //购买赠送
//                     // if (task.id == TaskID.BuyAward) {
//                     //     Global.ResourceManager.saveExchangeIdx(task.reward.count, task.reward2.count);
//                     // }
//                     //console.log('updateList', 4);

//                     break;
//                 }
//             }
//         }
//         //console.log('updateList', 5);

//         this.getTBList(cb);
//     }

//     //请求淘宝相关数据
//     static getTBList(cb?) {
//         console.log('======= getTBList ===========');
//         this._tbTask = [];
//         if (Laya.Browser.onTBMiniGame) {
//             TB.getTaskList((res) => {
//                 if (res.result) {
//                     console.log('==== 获取淘宝任务 =====', JSON.stringify(res));
//                     let list = res.data || [];
//                     this.updateTBList(list, cb);
//                 } else {
//                     console.log('==== 获取淘宝任务失败 =====')
//                     this._tbTaskList = JSON.parse(JSON.stringify(this._taskList));
//                     this.updateTasks(cb);
//                 }
//             })
//         } else {
//             // let data = [{ "actionType": "SIGN", "awardConfig": "1金币", "complete": false, "deliveryTplId": 8279, "finishCount": 0, "fromToken": "dgOn1gaI9naZqRaPIwvIp1zSqUDn1Rk1ojv7Tn", "hidden": false, "implId": "other_0_1_8279_0", "reachLimit": false, "status": "ACCEPTED", "taskCount": 1, "taskOrder": 0, "taskScene": "other", "taskTitle": "签到任务", "taskType": "task_sign" }, { "actionType": "EXCUTE", "actionURL": "https://www.baidu.com", "awardConfig": "1金币", "complete": false, "deliveryTplId": 8926, "finishCount": 0, "fromToken": "eo6e1oaUOAenPde0fgNhOdrU6UZdg7MgV6vlio", "hidden": false, "implId": "live_0_1_8926_0", "reachLimit": false, "status": "ACCEPTED", "taskCount": 1, "taskOrder": 1, "taskScene": "live", "taskTitle": "浏览直播15S", "taskType": "task_browse" }, { "actionType": "EXCUTE", "actionURL": "https://www.baiidu.com", "awardConfig": "1金币", "complete": false, "deliveryTplId": 9345, "finishCount": 0, "fromToken": "oQWd1Q5t0q5EKw5QIknH19jTOUx7kPLkAW26Se", "hidden": false, "implId": "shop_0_1_9345_0", "reachLimit": false, "status": "ACCEPTED", "taskCount": 1, "taskOrder": 2, "taskScene": "shop", "taskTitle": "浏览店铺15秒", "taskType": "task_browse" }];
//             // let list = data;
//             // this.updateTBList(list, cb);
//             this.updateTBList([], cb);
//         }
//     }

//     //更新淘宝任务列表
//     static updateTBList(list, cb) {
//         console.log('======= updateTBList ===========');
//         this._tbTaskCount = list.length;
//         for (let i = 0; i < list.length; i++) {
//             const task = list[i];
//             let awardConf = task.awardConfig;
//             let rewardCount = parseInt(awardConf.replace("金币", ""));
//             let id = this._maxId + 1 + i;
//             let title = task.taskTitle.replace("S", "秒");
//             let state = task.finishCount >= task.taskCount ? TaskState.GOT : title == '签到任务' ? TaskState.CanGet : TaskState.Unmet;
//             let taskData = {
//                 id: id,
//                 type: 1,
//                 tType: 5,
//                 task: title + '可获得' + task.awardConfig,
//                 title: title.replace("15秒", ""),
//                 need: 1,
//                 limit: task.taskCount,
//                 sortId: this.getSortId(title),
//                 reward: {
//                     type: "Coin",
//                     count: rewardCount,
//                     id: 1,
//                 },
//                 finish: task.finishCount,
//                 state: state,
//                 get: 0,
//             }
//             this._tbTask.push(taskData);
//         }

//         this._tbTaskList = this._taskList.concat(this._tbTask);
//         this.updateTasks(cb);
//     }

//     //获取排序
//     static getSortId(title) {
//         let id = title == '签到任务' ? 1 : 4;
//         for (let i = 0; i < this._taskList.length; i++) {
//             const task = this._taskList[i];
//             if (id == task.id) {
//                 return task.sortId;
//             }
//         }

//         return 1;
//     }

//     //更新任务列表
//     static updateTasks(cb) {
//         console.log('======= updateTasks ===========');
//         for (let i = this._tbTaskList.length - 1; i >= 0; i--) {
//             const task = this._tbTaskList[i];
//             if (this.checkTBTask(task.id)) {//有淘宝任务时，替换对应的神兽任务
//                 this._tbTaskList.splice(i, 1);
//             } else {
//                 // if (!PlayDataUtil.data.isVipSystem) {//是否是会员体系（会员体系指商铺是否是会员商铺）
//                 //     //不是会员体系则没有加入会员和会员福利
//                 //     if (task.id == TaskID.MemberBenefits || task.id == TaskID.JoinMember) {
//                 //         this._tbTaskList.splice(i, 1);
//                 //         continue;
//                 //     }
//                 // }
//                 // if (task.id == TaskID.Attention) {
//                 //     console.error('关注店铺状态：', PlayDataUtil.data.isVip == 1, task.state);

//                 // }
//                 if (task.id == TaskID.Attention && task.state == TaskState.Unmet) {
//                     // if (!PlayDataUtil.data.isVipControl || PlayDataUtil.data.isVip == 1) {
//                     if (PlayDataUtil.data.isVip == 1) {
//                         //关注店铺任务，如果已经关注，则状态改为领取
//                         task.state = TaskState.CanGet;
//                         console.error('关注店铺任务 更改为可领取', !PlayDataUtil.data.isVipControl, PlayDataUtil.data.isVip);

//                     }

//                 }
//                 else if (task.id == TaskID.LuckyBag && task.state == TaskState.Unmet) {
//                     // console.error('LuckyBag', GameLogic.canBuyluckybag);

//                     if (!GameLogic.canBuyluckybag) {
//                         //如果福袋已经购买过直接领取奖励
//                         task.state = TaskState.CanGet;
//                     }
//                 }
//                 //如果浏览新品任务没有开启则删除此任务
//                 else if (task.id == TaskID.BrowseNew && !GameLogic.haveBrowseNewTask) {
//                     // console.error('LuckyBag', GameLogic.canBuyluckybag);
//                     this._tbTaskList.splice(i, 1);
//                 }
//             }
//         }
//         this.updateCountDownTask();
//         console.log('======= updateTasks ===========', JSON.stringify(this._tbTaskList));
//         cb && cb();
//     }

//     //获取任务列表
//     static getTasks() {
//         return this._tbTaskList;
//     }

//     //获取任务可领取数量
//     static getTaskGets() {
//         // console.log('===== getTaskGets =====', this._tbTaskList.length);
//         let nums = 0;
//         for (let i = 0; i < this._tbTaskList.length; i++) {
//             let task = this._tbTaskList[i];
//             // console.log('==== %s : %s ====', task.title, task.state)
//             if (task.state == 0) {
//                 nums += 1;
//             }
//         }

//         return nums;
//     }

//     //更新倒计时任务
//     static updateCountDownTask() {
//         for (let i = 0; i < this._tbTaskList.length; i++) {
//             let task = this._tbTaskList[i];
//             // //会员福利
//             // if ((task.id == TaskID.MemberBenefits && !PlayDataUtil.data.isMember)//会员福利，不是会员没能领取
//             //     || (task.id == TaskID.DailyGift && PlayDataUtil.data.isVip == 0)//每日礼包，没有关注店铺不能领取
//             // ) {
//             //     // console.error('updateCountDownTask', task.id, task.state);

//             //     task.state = TaskState.Unmet;

//             // }

//             // else 
//             if (task.tType == TaskType.TimeLimit && task.state != TaskState.GOT) {//倒计时任务
//                 let cache = this.getCache(task.id);
//                 if (MainUtil.getTimeSpan(cache, new Date().getTime()) > task.need && task.get < task.limit) {
//                     //时间满足条件才可领取
//                     task.state = TaskState.CanGet;
//                 }
//             }
//         }
//         // console.error('updateCountDownTask', this._tbTaskList);

//     }

//     //是否有礼包弹框
//     static checkGift() {
//         let result = {
//             isOpen: false,
//             id: -1
//         }

//         // for (let i = 0; i < this._tbTaskList.length; i++) {
//         //     let task = this._tbTaskList[i];
//         //     console.log('aaa每日礼包==== %s :%s : %s ====', task.id, task.title, task.state)
//         //     //每日礼包是否开启
//         //     if (task.id == TaskID.DailyGift) {

//         //         if (task.state == TaskState.CanGet//可以领取

//         //             || (task.state == TaskState.Unmet && PlayDataUtil.data.isVip == 0)) {//因为未关注店铺不可领取
//         //             console.log('==== %s : %s ====', 'aaa每日礼包')
//         //             result.isOpen = true;
//         //             result.id = task.id;
//         //             result.id = task.id;
//         //         }
//         //         break;

//         //     }
//         // }
//         return result;
//     }

// }
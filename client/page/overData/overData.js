const xlsx = require('node-xlsx');

import moment from "moment"


const app = getApp();
const cloud = app.cloud;
let cloudFunction = app.cloudFunction
let imageUrl = app.imageUrl;
let b_appId = app.b_appId;
let article_code = app.article_code;
Page({
    data: {
        allData: [],
        activeList: [], // 全部活动数据
        retainData: {
            register: 0,
            registerRate: 0.0,
            fans: 0,
            fansRate: 0,
            vipNums: 0,
            vipNumsRate: 0,
            consumeNums: 0,
            consumeNumsRate: 0,
            consumeTotal: 0,
            consumeTotalRate: 0.00,
            activeNums: 0,
            activeNumsRate: 0.0,
            joinTime: 0,
            joinTimeRate: 0,
            joinNums: 0,
            joinNumsRate: 0,
            taskDoneNums: 0,
            taskDoneNumsRate: 0,
            enterGamePlayersNums: 0,
            enterGamePlayersRate: 0,
        }, // 全部数据
        days: 1, // 时间间隔天数
        active_time: 0, // 默认 今日数据
        condition: { // 请求条件
            sTime: 0,
            eTime: 0,
            activeId: ''
        },
        rangeDate: { // 时间区间条件
            startDate: 0,
            endDate: 0
        },
        checkTime: [] // 选择后的时间
    },
    async onLoad() {
        
    },
    async onShow() {
        // 设置topy页面pagename
        await my.setStorageSync({
            key: "pageName",
            data: "数据概览"
        })
        // 最大时间
        this.data.rangeDate.startDate = moment().format('YYYY-MM-DD').valueOf();
        this.data.rangeDate.endDate = moment().subtract(30, 'days').format('YYYY-MM-DD').valueOf()
        this.setData({
            rangeDate: this.data.rangeDate
        })

        // 获取全部活动list
        let activeList = await cloud.function.invoke(cloudFunction, {
            data: {}
        }, "B_MSG_3010")
        activeList = JSON.parse(activeList);
        if (activeList.code == 0 && activeList.message == '成功') {
            activeList.data = activeList.data.sort((a, b) => {
                return a.createTime > b.createTime ? -1 : 1
            })
            if (activeList.data.length > 0) {
                for (let i = 0; i < activeList.data.length; i++) {
                    const item = activeList.data[i];
                    this.data.activeList.push({
                        label: item.activeName,
                        value: item.activeId
                    })
                }
                this.setData({
                    activeList: this.data.activeList
                })
                this.data.condition.activeId = activeList.data[0].activeId;
            }
            console.log('---获取全部活动list---', this.data.activeList)
        }
        // 今日数据
        this.data.condition.sTime = moment().startOf('day').format('x').valueOf();
        this.data.condition.eTime = moment().endOf('day').format('x').valueOf();
        let checkTime = [
            moment(parseInt(this.data.condition.sTime)).format('YYYY-MM-DD').valueOf(),
            moment(parseInt(this.data.condition.eTime)).format('YYYY-MM-DD').valueOf(),
        ]
        this.setData({
            condition: this.data.condition,
            checkTime: checkTime
        })

        await this.getRetainData()
    },
    // 请求数据
    async getRetainData() {

        let state = await this.dead_common()
        if (!state) {
            return false;
        }

        console.log('请求条件', this.data.condition);
        // this.data.condition.activeId = "F7WpfsPew81O4uD1TWx3";
        // 获取数据
        let reslut_1 = await cloud.function.invoke(cloudFunction, {
            data: this.data.condition
        }, "B_MSG_4003_1")
        reslut_1 = JSON.parse(reslut_1);
        let reslut_2 = await cloud.function.invoke(cloudFunction, {
            data: this.data.condition
        }, "B_MSG_4003_2")
        reslut_2 = JSON.parse(reslut_2);
        let reslut_3 = await cloud.function.invoke(cloudFunction, {
            data: this.data.condition
        }, "B_MSG_4003_3")
        reslut_3 = JSON.parse(reslut_3);
        let reslut_4 = await cloud.function.invoke(cloudFunction, {
            data: this.data.condition
        }, "B_MSG_4003_4")
        reslut_4 = JSON.parse(reslut_4);
        Object.assign(reslut_1.data, reslut_2.data, reslut_3.data, reslut_4.data);

        let retainData = {
            register: reslut_1.data.register,
            registerRate: reslut_1.data.register > 0 ? (reslut_1.data.register / this.data.days).toFixed(1) : 0.0,

            fans: reslut_1.data.fans,
            fansRate: reslut_1.data.fans > 0 && reslut_1.data.enterGamePlayers > 0 ? (reslut_1.data.fans / reslut_1.data.enterGamePlayers * 100).toFixed(0) : 0,

            vipNums: reslut_1.data.vipNums,
            vipNumsRate: reslut_1.data.vipNums > 0 && reslut_1.data.enterGamePlayers > 0 ? (reslut_1.data.vipNums / reslut_1.data.enterGamePlayers * 100).toFixed(2) : 0,

            consumeNums: reslut_1.data.consumeNums,
            consumeNumsRate: reslut_1.data.consumeNums > 0 && reslut_1.data.activeNums > 0 ? (reslut_1.data.consumeNums / reslut_1.data.activeNums * 100).toFixed(2) : 0,

            consumeTotal: reslut_1.data.consumeTotal,
            consumeTotalRate: reslut_1.data.consumeTotal > 0 && reslut_1.data.consumeNums > 0 ? (reslut_1.data.consumeTotal / reslut_1.data.consumeNums).toFixed(2) : 0.00,

            activeNums: reslut_1.data.activeNums,
            activeNumsRate: reslut_1.data.activeNums > 0 ? (reslut_1.data.activeNums / this.data.days).toFixed(1) : 0.0,

            joinTime: reslut_1.data.joinTime,
            joinTimeRate: reslut_1.data.joinTime > 0 && reslut_1.data.enterGamePlayers > 0 ? (reslut_1.data.joinTime / reslut_1.data.enterGamePlayers).toFixed(0) : 0,

            joinNums: reslut_1.data.joinNums,
            joinNumsRate: reslut_1.data.joinNums > 0 && reslut_1.data.enterGamePlayers > 0 ? (reslut_1.data.joinNums / reslut_1.data.enterGamePlayers).toFixed(1) : 0,

            taskDoneNums: reslut_1.data.taskDoneNums,
            taskDoneNumsRate: reslut_1.data.taskDoneNums > 0 && reslut_1.data.enterGamePlayers > 0 ? (reslut_1.data.taskDoneNums / reslut_1.data.enterGamePlayers).toFixed(1) : 0,

            enterGamePlayersNums: reslut_1.data.enterGamePlayers,
            enterGamePlayersRate: reslut_1.data.enterGamePlayers > 0 && reslut_1.data.activeNums > 0 ? (reslut_1.data.enterGamePlayers / reslut_1.data.activeNums * 100).toFixed(2) : 0.0
        }
        this.setData({
            retainData: retainData
        })
        console.log('--请求数据--', this.data.retainData)

    },

    // 日期选择
    checkRetainData(e) {
        let type = e.currentTarget.dataset.type;
        console.log('--时间区间--', e)
        if (type >= 0) {
            // 天数
            if (type == 0) {
                this.data.condition.sTime = moment().startOf('day').format('x').valueOf();
                this.data.condition.eTime = moment().endOf('day').format('x').valueOf();
            } else if (type == 1) {
                this.data.condition.sTime = moment().subtract(type, 'days').startOf('day').format('x').valueOf();
                this.data.condition.eTime = moment().subtract(type, 'days').endOf('day').format('x').valueOf();
            } else {
                this.data.condition.sTime = moment().subtract(type, 'days').startOf('day').format('x').valueOf();
            }
            let checkTime = [
                moment(parseInt(this.data.condition.sTime)).format('YYYY-MM-DD').valueOf(),
                moment(parseInt(this.data.condition.eTime)).format('YYYY-MM-DD').valueOf(),
            ]
            this.setData({
                active_time: type,
                condition: this.data.condition,
                checkTime: checkTime
            })
        } else if (!type && e.detail && e.detail.value) {
            // 选择活动
            this.data.condition.activeId = e.detail.value;
            this.setData({
                condition: this.data.condition
            })
        } else if (type === 'times') {
            // 时间区间
            this.data.condition.sTime = moment(e.detail.value[0]).format('x').valueOf();
            this.data.condition.eTime = moment(e.detail.value[1]).format('x').valueOf();
            this.setData({
                active_time: -1,
                checkTime: e.detail.value,
                condition: this.data.condition
            })
        }

        let days = Math.floor((this.data.condition.eTime - this.data.condition.sTime) / 1000 / 60 / 60 / 24);
        this.setData({
            days: days <= 0 ? 1 : days
        })

        this.getRetainData();
    },
    // 导出数据
    async download() {
        //2，定义存储数据的
        let alldata = [];
        let row = ['日期', '新增用户总数', '新增用户日均', '新增粉丝总数', '新增粉丝占比', '新增会员总数', '新增会员占比', '消费人数总数', '消费人数消费率', '消费金额总数', '消费金额人均', '活跃用户总数', '活跃用户日均', '游戏时长总数', '游戏时长人均', '游戏总次数', '游戏次数人均', '任务总次数', '任务次数人均']; //表属性
        alldata.push(row);

        my.showLoading({
            content: '数据处理中,请稍后~',
            mask: true
        })

        let state = await this.allDownloadData();

        if (state === true) {
            my.hideLoading({});
            for (let key in this.data.allData) {
                let arr = [];
                arr.push(this.data.allData[key].date);
                arr.push(this.data.allData[key].register);
                arr.push(this.data.allData[key].registerRate);
                arr.push(this.data.allData[key].fans);
                arr.push(this.data.allData[key].fansRate);
                arr.push(this.data.allData[key].vipNums);
                arr.push(this.data.allData[key].vipNumsRate);
                arr.push(this.data.allData[key].consumeNums);
                arr.push(this.data.allData[key].consumeNumsRate);
                arr.push(this.data.allData[key].consumeTotal);
                arr.push(this.data.allData[key].consumeTotalRate);
                arr.push(this.data.allData[key].activeNums);
                arr.push(this.data.allData[key].activeNumsRate);
                arr.push(this.data.allData[key].joinTime);
                arr.push(this.data.allData[key].joinTimeRate);
                arr.push(this.data.allData[key].joinNums);
                arr.push(this.data.allData[key].joinNumsRate);
                arr.push(this.data.allData[key].taskDoneNums);
                arr.push(this.data.allData[key].taskDoneNumsRate);
                alldata.push(arr)
            }
            console.log('alldata', alldata)
            let _dow = await cloud.function.invoke(cloudFunction, {
                data: {
                    excelData: alldata,
                    excelName: 'overData.xlsx'
                }
            }, "DowloadToExcel");
            _dow = JSON.parse(_dow);
            if (_dow.code == 0 && _dow.message == '成功') {
                let url = _dow.data.url;
                url = url.replace('http', 'https');
                my.setClipboard({
                    text: url,
                    success: function() {
                        my.showToast({
                            type: 'success',
                            content: '数据复制成功,请粘贴浏览器地址栏下载数据~'
                        })
                    }
                });
            }
        }
    },
    async dead_common() {
        if (cloud.topApi.options.env === 'test') {
            my.showToast({
               type: 'success',
               content: '当前测试环境：TEST（正式服不提示！！！）'
            })
            return true;
         }
        // 子账户未授权不能登陆
        let _childAccount = my.getStorageSync({
            key: "childAccountError"
        })
        if (_childAccount.data) {
            if (_childAccount.data.state === true) {
                my.alert({
                    title: '温馨提示',
                    content: "请前往账号中心,配置子账号授权该小程序~",
                    buttonText: '马上去',
                    success: () => {
                        my.qn.navigateToWebPage({
                            url: "https://zizhanghao.taobao.com/",
                            success: (res) => {
                                console.log('res', res)
                            },
                            fail: (res) => {
                                console.error('res', res)
                            }
                        });
                    }
                });
                return false;
            }
        }
        
        return true;
    },

    async allDownloadData() {
        let sTime = moment(parseInt(this.data.condition.sTime)).format('YYYY-MM-DD');
        let eTime = moment(parseInt(this.data.condition.eTime)).format('YYYY-MM-DD');
        let day = moment(eTime).diff(sTime, 'days') + 1;

        let _allData = [];
        for (let i = 0; i < day; i++) {
            const _day = i + 1;
            let _sTime = moment().startOf('day').subtract(_day, 'day').valueOf();
            let _eTime = moment(_sTime).endOf('day').valueOf();

            let _condition = {
                sTime: _sTime,
                eTime: _eTime,
                activeId: this.data.condition.activeId,
            };

            // 获取数据
            let reslut_1 = await cloud.function.invoke(cloudFunction, {
                data: _condition
            }, "B_MSG_4003_1")
            reslut_1 = JSON.parse(reslut_1);
            let reslut_2 = await cloud.function.invoke(cloudFunction, {
                data: _condition
            }, "B_MSG_4003_2")
            reslut_2 = JSON.parse(reslut_2);
            let reslut_3 = await cloud.function.invoke(cloudFunction, {
                data: _condition
            }, "B_MSG_4003_3")
            reslut_3 = JSON.parse(reslut_3);
            let reslut_4 = await cloud.function.invoke(cloudFunction, {
                data: _condition
            }, "B_MSG_4003_4")
            reslut_4 = JSON.parse(reslut_4);
            Object.assign(reslut_1.data, reslut_2.data, reslut_3.data, reslut_4.data);

            let retainData = {
                date: moment(_sTime).format('YYYY-MM-DD').valueOf(),

                register: reslut_1.data.register,
                registerRate: reslut_1.data.register > 0 ? (reslut_1.data.register / this.data.days).toFixed(1) : 0.0,

                fans: reslut_1.data.fans,
                fansRate: reslut_1.data.fans > 0 && reslut_1.data.enterGamePlayers > 0 ? (reslut_1.data.fans / reslut_1.data.enterGamePlayers * 100).toFixed(0) : 0,

                vipNums: reslut_1.data.vipNums,
                vipNumsRate: reslut_1.data.vipNums > 0 && reslut_1.data.enterGamePlayers > 0 ? (reslut_1.data.vipNums / reslut_1.data.enterGamePlayers * 100).toFixed(2) : 0,

                consumeNums: reslut_1.data.consumeNums,
                consumeNumsRate: reslut_1.data.consumeNums > 0 && reslut_1.data.activeNums > 0 ? (reslut_1.data.consumeNums / reslut_1.data.activeNums * 100).toFixed(2) : 0,

                consumeTotal: reslut_1.data.consumeTotal,
                consumeTotalRate: reslut_1.data.consumeTotal > 0 && reslut_1.data.consumeNums > 0 ? (reslut_1.data.consumeTotal / reslut_1.data.consumeNums).toFixed(2) : 0.00,

                activeNums: reslut_1.data.activeNums,
                activeNumsRate: reslut_1.data.activeNums > 0 ? (reslut_1.data.activeNums / this.data.days).toFixed(1) : 0.0,

                joinTime: reslut_1.data.joinTime,
                joinTimeRate: reslut_1.data.joinTime > 0 && reslut_1.data.enterGamePlayers > 0 ? (reslut_1.data.joinTime / reslut_1.data.enterGamePlayers).toFixed(0) : 0,

                joinNums: reslut_1.data.joinNums,
                joinNumsRate: reslut_1.data.joinNums > 0 && reslut_1.data.enterGamePlayers > 0 ? (reslut_1.data.joinNums / reslut_1.data.enterGamePlayers).toFixed(1) : 0,

                taskDoneNums: reslut_1.data.taskDoneNums,
                taskDoneNumsRate: reslut_1.data.taskDoneNums > 0 && reslut_1.data.enterGamePlayers > 0 ? (reslut_1.data.taskDoneNums / reslut_1.data.enterGamePlayers).toFixed(1) : 0,

                enterGamePlayersNums: reslut_1.data.enterGamePlayers,
                enterGamePlayersRate: reslut_1.data.enterGamePlayers > 0 && reslut_1.data.activeNums > 0 ? (reslut_1.data.enterGamePlayers / reslut_1.data.activeNums * 100).toFixed(2) : 0.0
            }
            _allData.push(retainData)
        }
        this.setData({
            allData: _allData
        })
        return true
    }


});
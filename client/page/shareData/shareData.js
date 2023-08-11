
import moment from "moment"

const app = getApp();
const cloud = app.cloud;
let cloudFunction = app.cloudFunction;
let b_appId = app.b_appId;
let article_code = app.article_code;
Page({
    data: {
        allData: [],
        activeList: [], // 全部活动数据
        retainData: {
            sharePlayers: 0,
            sharePlayersRate: 0,
            shareNums: 0,
            shareNumsRate: 0,
            shareEnterNums: 0,
            shareEnterNumsRate: 0,
            shareRegisterNums: 0,
            shareRegisterNumsRate: 0,
        }, // 全部数据
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
        ];
        this.setData({
            condition: this.data.condition,
            checkTime: checkTime
        })

        await this.getRetainData()
    },
    async onShow() {
        // 设置topy页面pagename
        await my.setStorageSync({
            key: "pageName",
            data: "分享数据"
        })
        await this.getRetainData()

    },
    // 请求数据
    async getRetainData() {
        console.log('请求条件', this.data.condition);
        // 获取数据
        let reslut = await cloud.function.invoke(cloudFunction, {
            data: this.data.condition
        }, "B_MSG_4005")
        reslut = JSON.parse(reslut);
        console.log('--请求数据--', reslut.data)

        let retainData = {
            sharePlayers: reslut.data.sharePlayers,
            sharePlayersRate: reslut.data.sharePlayers > 0 && reslut.data.enterGamePlayers ? (reslut.data.sharePlayers / reslut.data.enterGamePlayers * 100).toFixed(2) : 0,

            shareNums: reslut.data.shareNums,
            shareNumsRate: reslut.data.shareNums > 0 && reslut.data.enterGamePlayers > 0 ? (reslut.data.shareNums / reslut.data.enterGamePlayers).toFixed(1) : 0,

            shareEnterNums: reslut.data.shareEnterNums,
            shareEnterNumsRate: reslut.data.shareEnterNums > 0 && reslut.data.activeNums ? (reslut.data.shareEnterNums / reslut.data.activeNums * 100).toFixed(2) : 0,

            shareRegisterNums: reslut.data.shareRegisterNums,
            shareRegisterNumsRate: reslut.data.shareRegisterNums > 0 && reslut.data.register ? (reslut.data.shareRegisterNums / reslut.data.register * 100).toFixed(2) : 0,

        }

        this.setData({
            retainData: retainData
        })
        console.log('--请求数据--', this.data.retainData)

    },

    // 日期选择
    async checkRetainData(e) {

        let state = await this.dead_common()
        if (!state) {
            return false;
        }

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
                this.data.condition.eTime = moment().subtract(1, 'days').endOf('day').format('x').valueOf();
            }
            let checkTime = [
                moment(parseInt(this.data.condition.sTime)).format('YYYY-MM-DD').valueOf(),
                moment(parseInt(this.data.condition.eTime)).format('YYYY-MM-DD').valueOf(),
            ];

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
        await this.getRetainData()
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
    // 导出数据
    async download() {
        //2，定义存储数据的
        let alldata = [];
        let row = ['日期', '分享人数总数', '分享率', '分享总次数', '分享人均', '分享活跃总数', '分享活跃占比', '分享新增总数', '分享新增占比']; //表属性
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

                arr.push(this.data.allData[key].sharePlayers);
                arr.push(this.data.allData[key].sharePlayersRate);

                arr.push(this.data.allData[key].shareNums);
                arr.push(this.data.allData[key].shareNumsRate);

                arr.push(this.data.allData[key].shareEnterNums);
                arr.push(this.data.allData[key].shareEnterNumsRate);

                arr.push(this.data.allData[key].shareRegisterNums);
                arr.push(this.data.allData[key].shareRegisterNumsRate);
                alldata.push(arr)
            }

            let _dow = await cloud.function.invoke(cloudFunction, {
                data: {
                    excelData: alldata,
                    excelName: 'shareData.xlsx'
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

            let reslut = await cloud.function.invoke(cloudFunction, {
                data: _condition
            }, "B_MSG_4005")
            reslut = JSON.parse(reslut);
            console.log('--请求数据--', reslut.data)

            let retainData = {
                date: moment(_sTime).format('YYYY-MM-DD').valueOf(),

                sharePlayers: reslut.data.sharePlayers,
                sharePlayersRate: reslut.data.sharePlayers > 0 && reslut.data.enterGamePlayers ? (reslut.data.sharePlayers / reslut.data.enterGamePlayers * 100).toFixed(2) : 0,

                shareNums: reslut.data.shareNums,
                shareNumsRate: reslut.data.shareNums > 0 && reslut.data.enterGamePlayers > 0 ? (reslut.data.shareNums / reslut.data.enterGamePlayers).toFixed(1) : 0,

                shareEnterNums: reslut.data.shareEnterNums,
                shareEnterNumsRate: reslut.data.shareEnterNums > 0 && reslut.data.activeNums ? (reslut.data.shareEnterNums / reslut.data.activeNums * 100).toFixed(2) : 0,

                shareRegisterNums: reslut.data.shareRegisterNums,
                shareRegisterNumsRate: reslut.data.shareRegisterNums > 0 && reslut.data.register ? (reslut.data.shareRegisterNums / reslut.data.register * 100).toFixed(2) : 0,

            }
            _allData.push(retainData)
        }
        this.setData({
            allData: _allData
        })
        return true
    }
});
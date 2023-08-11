
import moment from "moment"

const app = getApp();
const cloud = app.cloud;
let cloudFunction = app.cloudFunction;
let b_appId = app.b_appId;
let article_code = app.article_code;
Page({
    data: {
        activeList: [], // 全部活动数据
        retainData: [], // 全部留存数据
        checkRetainData: [], //选择后的留存数据
        active_time: 7, // 默认 今日数据
        active_retain: 'active', // 默认 活跃数据
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
        // 留存最大时间
        this.data.rangeDate.startDate = moment().subtract(30, 'days').format('YYYY-MM-DD').valueOf()
        this.data.rangeDate.endDate = moment().format('YYYY-MM-DD').valueOf();
        this.setData({
            rangeDate: this.data.rangeDate
        })
        console.log('this.data.rangeDate', this.data.rangeDate)
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
        this.data.condition.sTime = moment().subtract(7, 'days').startOf('day').format('x').valueOf();
        this.data.condition.eTime = moment().subtract(1, 'days').endOf('day').format('x').valueOf();
        let checkTime = [
            moment(parseInt(this.data.condition.sTime)).format('YYYY-MM-DD').valueOf(),
            moment(parseInt(this.data.condition.eTime)).format('YYYY-MM-DD').valueOf(),
        ]
        this.setData({
            condition: this.data.condition,
            checkTime
        })
        await this.getRetainData()
    },
    async onShow() {
        // 设置topy页面pagename
        await my.setStorageSync({
            key: "pageName",
            data: "留存数据"
        })
    },
    // 请求留存数据
    async getRetainData() {
        console.log('请求条件', this.data.condition)
            // 获取留存数据
        let reslut = await cloud.function.invoke(cloudFunction, {
            data: this.data.condition
        }, "B_MSG_4004")
        reslut = JSON.parse(reslut);
        console.log('--请求留存数据--', reslut.data)
        this.setData({
            retainData: reslut.data,
            checkRetainData: reslut.data.active
        })
    },

    // 日期选择
    async checkRetainData(e) {
        let state = await this.dead_common()
        if (!state) {
            return false;
        }

        let type = e.currentTarget.dataset.type;
        console.log('--时间区间--', e)
        if (type === 'active') {
            this.setData({
                active_retain: 'active',
                checkRetainData: this.data.retainData.active
            })
            return;
        } else if (type === 'add') {
            this.setData({
                active_retain: 'add',
                checkRetainData: this.data.retainData.add
            })
            return;
        } else if (type >= 0) {
            if (type == 0) {
                this.data.condition.sTime = moment().startOf('day').format('x').valueOf();
                this.data.condition.eTime = moment().endOf('day').format('x').valueOf();
            } else if (type == 1) {
                this.data.condition.sTime = moment().subtract(type, 'days').startOf('day').format('x').valueOf();
                this.data.condition.eTime = moment().subtract(type, 'days').endOf('day').format('x').valueOf();
            } else {
                this.data.condition.eTime = moment().subtract(1, 'days').endOf('day').format('x').valueOf();
                this.data.condition.sTime = moment().subtract(type, 'days').startOf('day').format('x').valueOf();
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
            this.data.condition.activeId = e.detail.value;
            this.setData({
                condition: this.data.condition
            })
        } else if (type === 'times') {
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
        let row = ['日期', '用户数', '1日', '2日', '3日', '4日', '5日', '6日', '7日']; //表属性
        alldata.push(row);

        let userdata = this.data.checkRetainData;
        console.log('userdata', userdata);
        for (let key in userdata) {
            let arr = [];
            arr.push(userdata[key].time);
            arr.push(userdata[key].retainNum);
            arr.push(userdata[key].retainResult[0] ? userdata[key].retainResult[0].retainNums : 0);
            arr.push(userdata[key].retainResult[1] ? userdata[key].retainResult[1].retainNums : 0);
            arr.push(userdata[key].retainResult[2] ? userdata[key].retainResult[2].retainNums : 0);
            arr.push(userdata[key].retainResult[3] ? userdata[key].retainResult[3].retainNums : 0);
            arr.push(userdata[key].retainResult[4] ? userdata[key].retainResult[4].retainNums : 0);
            arr.push(userdata[key].retainResult[5] ? userdata[key].retainResult[5].retainNums : 0);
            arr.push(userdata[key].retainResult[6] ? userdata[key].retainResult[6].retainNums : 0);
            alldata.push(arr)
        }
        console.log('---alldata--', alldata)

        let _dow = await cloud.function.invoke(cloudFunction, {
            data: {
                excelData: alldata,
                excelName: 'retainData.xlsx'
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
    },


});

import moment from "moment"

const app = getApp();
const cloud = app.cloud;
let cloudFunction = app.cloudFunction;
let b_appId = app.b_appId;
let article_code = app.article_code;
Page({
    data: {
        loading: true,
        download_frame: 'cover_none',
        address_frame: 'cover_none',
        cover: 'cover_none',
        ship_frame: "cover_none",
        reward_frame: "cover_none",
        searchResult: [], // 搜索后的数据
        awardList: [], // 获奖全部数据
        checkAwardList: [],
        orderInfo: {}, // 选择数据
        company_state: "error",
        logisticsId_state: "error",
        successState: true,
        activeList: [], // 全部活动数据
        searchInfo: { // 条件数据
            activeId: '',
            orderId: '',
        },
        skip: 0,
        limit: 10,
        rewardInfo: [],
        isShip: 2,
        total: 0,
    },
    async onLoad() {

        // 获取总数据
        let reslut = await cloud.function.invoke(cloudFunction, {
            data: {
                type: 'total'
            }
        }, 'B_MSG_3006');
        reslut = JSON.parse(reslut);
        console.log('--活动数据总数--', reslut)
        if (reslut.data > 0) {
            this.setData({
                total: reslut.data
            })
        }

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
                this.data.searchInfo.activeId = activeList.data[0].activeId;
                this.setData({
                    activeList: this.data.activeList,
                    searchInfo: this.data.searchInfo
                })
            }
            console.log('---获取全部活动list---', this.data.activeList)
        }
        // 获取获奖用户数据
        cloud.function.invoke(cloudFunction, {
            data: {
                skip: this.data.skip,
                limit: this.data.limit
            }
        }, "B_MSG_3006").then((result) => {
            let res = JSON.parse(result);
            console.log("获取中奖用户list", res)
            if (res.data.length > 0) {
                let awardList = [];
                for (let i = 0; i < res.data.length; i++) {
                    const item = res.data[i];
                    let obj = {
                        activeId: item.activeId,
                        orderId: item.orderId,
                        userOpenId: item.userOpenId,
                        tbName: item.tbName,
                        consignee: item.consignee,
                        phone: item.phone,
                        address: item.address,
                        isShip: item.isShip,
                        rewardTime: moment(item.rewardTime).format('YYYY-MM-DD HH:mm:ss'),
                        shipTime: moment(item.shipTime).format('YYYY-MM-DD HH:mm:ss'),
                        rewardInfo: item.rewardInfo,
                        company: item.company,
                        logisticsId: item.logisticsId,
                    }
                    awardList.push(obj)
                }
                console.log('awardList', awardList);
                this.setData({
                    awardList: awardList,
                })
            }
            this.setData({
                loading: false
            })
        }).catch(err => {
            console.log("获取中奖用户list", err)
        });
    },
    async onShow() {
        // 设置topy页面pagename
        await my.setStorageSync({
            key: "pageName",
            data: "权益发放"
        })
    },
    // 发货弹框
    async shipAction(e) {

        let state = await this.dead_common()
        if (!state) {
            return false;
        }

        let orderInfo = e.currentTarget.dataset.orderInfo;
        console.log('orderInfo', orderInfo)

        this.setData({
            cover: "cover",
            address_frame: 'address_frame',
            orderInfo: orderInfo,
        })

    },
    // 关闭弹窗
    close() {
        this.setData({
            cover: "cover_none",
            ship_frame: 'cover_none',
            address_frame: 'cover_none',
            download_frame: 'cover_none',
            reward_frame: 'cover_none',
        })
    },
    //  提交发货信息
    async submitShip(e) {
        let isShip = parseInt(e.currentTarget.dataset.isShip);
        let dataInfo = e.currentTarget.dataset.orderInfo;

        if (isShip === 0) {
            dataInfo = this.data.orderInfo
        }
        console.log('isShip', isShip)

        let res = await cloud.function.invoke(cloudFunction, {
            data: {
                orderId: dataInfo.orderId,
                userOpenId: dataInfo.userOpenId,
                isShip: isShip,
            }
        }, 'B_MSG_3007')
        res = JSON.parse(res);
        console.log('----发货请求---', res);
        if (res.code == 0 && res.message == '成功') {
            my.showToast({
                type: 'success',
                content: isShip === 1 ? '发货成功~' : '设为未发货~'
            })
            await this.refreshData(dataInfo.orderId, dataInfo.userOpenId, isShip)
            this.close()
        } else {
            my.showToast({
                type: 'fail',
                content: res.message + ',请联系管理员~'
            })
        }

    },
    // 刷新数据
    async refreshData(orderId, userOpenId, isShip) {
        for (let i = 0; i < this.data.awardList.length; i++) {
            const item = this.data.awardList[i];
            if (item.orderId === orderId && item.userOpenId === userOpenId) {
                this.data.awardList[i].isShip = isShip
            }
        }
        this.setData({
            awardList: this.data.awardList
        })
    },
    // 查看奖品
    getRewardInfo(e) {

        let rewardInfo = {
            rewardTime: e.currentTarget.dataset.activeInfo.rewardTime,
            ...e.currentTarget.dataset.activeInfo.rewardInfo
        }
        this.setData({
            reward_frame: 'reward_frame',
            cover: "cover",
            rewardInfo: [rewardInfo]
        })
    },
    // 搜索
    async searchAction(e) {
        console.log('---搜索---', e)
        let type = e.currentTarget.dataset.type;
        if (type === 'checkActiveId') {
            this.data.searchInfo.activeId = e.detail.value;
        }
        if (type === 'checkOrderId') {
            this.data.searchInfo.orderId = e.detail.value;
        }
        if (type == 'ok') {

            let search = await cloud.function.invoke(cloudFunction, {
                data: {
                    type: "search",
                    orderId: this.data.searchInfo.orderId
                }
            }, "B_MSG_3006");
            search = JSON.parse(search);
            console.log('--search---', search)

            if (search.data.length <= 0) {
                my.showToast({
                    type: 'fail',
                    content: '暂无该订单数据,请校验活动名称,订单号~'
                })
            }
            this.setData({
                searchResult: search.data
            })
        }
        this.setData({
            searchInfo: this.data.searchInfo
        })
    },
    // 选择发货状态
    async checkShip(e) {
        let isShip = parseInt(e.detail.value);

        if (isShip === 2) {
            this.setData({
                isShip: isShip
            })
            await this.onLoad();
            return false;
        }

        // 请求接口
        let awardList = await cloud.function.invoke(cloudFunction, {
            data: {
                type: "search",
                isShip: isShip,
                skip: this.data.skip,
                limit: this.data.limit
            }
        }, "B_MSG_3006");
        awardList = JSON.parse(awardList)
        for (let i = 0; i < awardList.data.length; i++) {
            const item = awardList.data[i];
            awardList.data[i].createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss').valueOf();
        }

        // 获取总数据
        let reslut = await cloud.function.invoke(cloudFunction, {
            data: {
                type: 'total',
                isShip: isShip,
            }
        }, 'B_MSG_3006');
        reslut = JSON.parse(reslut);
        console.log('--活动数据总数--', reslut)
        if (reslut.data > 0) {
            this.setData({
                total: reslut.data
            })
        }

        console.log('---awardList----', awardList);
        this.setData({
            awardList: awardList.data,
            isShip: isShip
        })
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
    async onPageChange(e) {

        let skip = e.detail.value;
        this.data.skip = ((skip - 1) * this.data.limit);

        let _data = {
            skip: this.data.skip,
            limit: this.data.limit
        }

        if (this.data.isShip !== 2) {
            _data['type'] = 'search';
            _data['isShip'] = this.data.isShip
        }

        let awardList = await cloud.function.invoke(cloudFunction, {
            data: _data
        }, "B_MSG_3006")
        awardList = JSON.parse(awardList);

        for (let i = 0; i < awardList.data.length; i++) {
            const item = awardList.data[i];
            awardList.data[i].createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss').valueOf();
        }
        this.setData({
            awardList: awardList.data
        })
    },
    // 导出数据
    async download(e) {
        let type = e.currentTarget.dataset.type;
        if (type === 'frame') {
            this.setData({
                cover: "cover",
                download_frame: 'download_frame',
            })

        } else if (type === 'download') {
            this.close()
            let awardList = await cloud.function.invoke(cloudFunction, {
                data: {
                    type: type
                }
            }, "B_MSG_3006")
            awardList = JSON.parse(awardList);
            console.log('awardList', awardList)
                //2，定义存储数据的
            let alldata = [];
            let row = ['淘宝名', '姓名', '手机号', '奖品名称', '价格', 'SKU', '中奖时间', '省份', '市', '区/县', '街道', '具体地址']; //表属性
            alldata.push(row);

            awardList = awardList.data;
            for (let key in awardList) {
                let arr = [];
                arr.push(awardList[key].tbName);
                arr.push(awardList[key].consignee);
                arr.push(awardList[key].phone);
                arr.push(awardList[key].rewardInfo.title);
                arr.push(awardList[key].rewardInfo.price);
                arr.push(awardList[key].rewardInfo.sku ? awardList[key].rewardInfo.sku : '默认');
                arr.push(awardList[key].rewardTime ? moment(awardList[key].rewardTime).format('YYYY-MM-DD HH:mm:ss').valueOf() : '');
                arr.push(awardList[key].province);
                arr.push(awardList[key].city);
                if (!awardList[key].county) {
                    let _shi = awardList[key].address.indexOf('市');
                    let _qu = awardList[key].address.indexOf('区');
                    if (_shi > 0 && _qu > 0) {
                        awardList[key].county = awardList[key].address.substr(_shi + 1, _qu - _shi);
                    }
                }
                arr.push(awardList[key].county);
                arr.push(awardList[key].street);
                arr.push(awardList[key].address);
                alldata.push(arr)
            }

            let _dow = await cloud.function.invoke(cloudFunction, {
                data: {
                    excelData: alldata,
                    excelName: 'orderList.xlsx'
                }
            }, "DowloadToExcel");
            _dow = JSON.parse(_dow);
            if (_dow.code == 0 && _dow.message == '成功') {

                let update = await cloud.function.invoke(cloudFunction, {
                    data: {
                        type: 'update'
                    }
                }, "B_MSG_3006")
                update = JSON.parse(update);
                console.log('update', update)
                await this.onLoad();
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
});
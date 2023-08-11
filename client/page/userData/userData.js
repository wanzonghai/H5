import moment from "moment"

const app = getApp();
const cloud = app.cloud;
let cloudFunction = app.cloudFunction;
let b_appId = app.b_appId;
let article_code = app.article_code;
Page({
    data: {
        sbCoin: '',
        loading: true,
        cover: 'cover_none',
        reward_box_frame: 'cover_none',
        addCoin_box_frame: 'cover_none',
        pushBlack_box_frame: 'cover_none',
        pusbBlackMsg: '加入',
        push: 'cover_none',
        coinSuccess: false,
        activeList: [], // 全部活动数据
        userData: [], // 全部数据
        pageUserData: [],
        checkUserData: [],
        rewardInfoData: [], // 奖品信息
        condition: { // 请求条件
            activeId: '',
            isMember: '',
            memberLv: '',
            isInBackList: '',
            nickName: '',
            skip: 0,
            limit: 10
        },
        total: 0, //用户总数
        isShopVipList: [{
                label: '全部',
                value: ''
            },
            {
                label: '是',
                value: true
            },
            {
                label: '否',
                value: false
            },
        ],
        shopVipLvList: [{
                label: '全部',
                value: ''
            },
            {
                label: '1',
                value: 1
            },
            {
                label: '0',
                value: 0
            },
        ],
        isInBackList: [{
                label: '全部',
                value: ''
            },
            {
                label: '正常',
                value: false
            },
            {
                label: '黑名单',
                value: true
            },
        ],
    },
    async onLoad() {

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
                    // this.data.condition.activeId = activeList.data[0].activeId;
            }
        }
        this.setData({
            condition: this.data.condition
        })

        await this.getuserData()
    },
    async onShow() {
        // 设置topy页面pagename
        await my.setStorageSync({
            key: "pageName",
            data: "用户数据"
        })
        await this.getuserData()

    },
    // 活动数据总数
    async getTotalData() {
        // 获取数据
        let reslut = await cloud.function.invoke(cloudFunction, {
            data: {
                activeId: this.data.condition.activeId,
                type: 'total',
            }
        }, "B_MSG_3008")
        reslut = JSON.parse(reslut);
        console.log('--活动数据总数--', reslut)
        if (reslut.data > 0) {
            this.setData({
                total: reslut.data
            })
        }

    },
    // 请求数据
    async getuserData() {
        console.log('请求条件', this.data.condition)
            // 获取分页总数
        await this.getTotalData()
            // 获取数据
        let reslut = await cloud.function.invoke(cloudFunction, {
            data: this.data.condition
        }, "B_MSG_3008")
        reslut = JSON.parse(reslut);
        console.log('--请求数据--', reslut.data)
        if (reslut.code == '0' && reslut.message == '成功') {
            for (let i = 0; i < reslut.data.length; i++) {
                const item = reslut.data[i];
                reslut.data[i].createTime = moment(item.createTime).format('YYYY-MM-DD hh:mm:ss').valueOf();
            }
            this.setData({
                userData: reslut.data,
                loading: false
            })
        } else {
            my.showToast({
                type: 'fail',
                content: '数据请求失败, 请联系管理员~',
            });
        }

    },

    async checkUserData(e) {
        let type = e.currentTarget.dataset.type;
        if (!type && e.detail && e.detail.value) {
            // 选择活动
            this.data.condition.activeId = e.detail.value;
            this.setData({
                condition: this.data.condition
            })
        }
        await this.getuserData()
    },
    // 关闭弹窗
    close() {
        this.setData({
            cover: "cover_none",
            reward_box_frame: 'cover_none',
            addCoin_box_frame: 'cover_none',
            pushBlack_box_frame: 'cover_none',
        })
    },
    // 操作btn 行为
    async btnAction(e) {
        let type = e.currentTarget.dataset.type;
        let userInfo = e.currentTarget.dataset.userInfo;
        this.data.condition.userOpenId = userInfo.userOpenId;
        this.setData({
            condition: this.data.condition
        })
        console.log('----type----', type)
        if (type == 'getReward') {
            this.setData({
                cover: 'cover',
                reward_box_frame: 'reward_box_frame',
            })
            let rewardResult = await cloud.function.invoke(cloudFunction, {
                data: this.data.condition
            }, "B_MSG_3009")
            rewardResult = JSON.parse(rewardResult);
            if (rewardResult.code == '0' && rewardResult.message == '成功') {
                for (let i = 0; i < rewardResult.data.length; i++) {
                    const element = rewardResult.data[i];
                    rewardResult.data[i].rewardTime = moment(element.rewardTime).format('YYYY-MM-DD hh:mm:ss').valueOf()
                }
                this.setData({
                    rewardInfoData: rewardResult.data
                })
                console.log('rewardInfoData', this.data.rewardInfoData)
            } else {
                my.showToast({
                    type: 'fail',
                    content: '数据请求失败, 请联系管理员~',
                });
            }
        }
        if (type == 'addCoin') {
            this.setData({
                cover: 'cover',
                addCoin_box_frame: 'addCoin_box_frame',
            })
        }
        if (type == 'pushBlack') {
            this.setData({
                cover: 'cover',
                pushBlack_box_frame: 'pushBlack_box_frame',
                pusbBlackMsg: '加入',
            })
        }
        if (type == 'removeBlack') {
            this.setData({
                cover: 'cover',
                pushBlack_box_frame: 'pushBlack_box_frame',
                pusbBlackMsg: '移除',
            })
        }
    },
    // 增加次数
    async addCoin(e) {
        let type = e.currentTarget.dataset.type;
        this.setData({
            sbCoin: e.detail.value
        })
        if (type) {
            if (!this.data.condition.userCoin) {
                my.showToast({
                    type: 'fail',
                    content: '次数必须大于0'
                })
                return false;
            }
            let addCoinResult = await cloud.function.invoke(cloudFunction, {
                data: this.data.condition
            }, "B_MSG_4000")
            addCoinResult = JSON.parse(addCoinResult)
            if (addCoinResult.code == '0' && addCoinResult.message == '成功') {
                my.showToast({
                    type: 'success',
                    content: '增加成功~',
                });
            } else {
                my.showToast({
                    type: 'fail',
                    content: addCoinResult.message + ', 请联系管理员~',
                });
            }
            this.close();
            this.getuserData();
            this.setData({
                sbCoin: ''
            })
        } else {
            if (e.detail && e.detail.value > 0) {
                this.data.condition.userCoin = e.detail.value;
                this.setData({
                    coinSuccess: true
                })
            } else if (e.detail && e.detail.value <= 0) {
                this.data.condition.userCoin = e.detail.value;
                this.setData({
                    coinSuccess: false
                })
            }
            this.setData({
                condition: this.data.condition
            })
        }

    },
    // 拉黑
    async pushBlack(e) {
        let type = e.currentTarget.dataset.type;
        if (type == 'push') {
            let pushBlackResult = await cloud.function.invoke(cloudFunction, {
                data: this.data.condition
            }, "B_MSG_4001")
            pushBlackResult = JSON.parse(pushBlackResult)
            if (pushBlackResult.code == '0' && pushBlackResult.message == '成功') {
                my.showToast({
                    type: 'success',
                    content: '拉黑成功~',
                });
            } else {
                my.showToast({
                    type: 'fail',
                    content: '拉黑失败, 请联系管理员~',
                });
            }
            this.close();
            this.getuserData()
        }
        if (type == 'remove') {
            let removeBlackResult = await cloud.function.invoke(cloudFunction, {
                data: this.data.condition
            }, "B_MSG_4002")
            removeBlackResult = JSON.parse(removeBlackResult)
            if (removeBlackResult.code == '0' && removeBlackResult.message == '成功') {
                my.showToast({
                    type: 'success',
                    content: '移除成功~',
                });
            } else {
                my.showToast({
                    type: 'fail',
                    content: '移除失败, 请联系管理员~',
                });
            }
            this.close();
            this.getuserData()
        }

    },

    async checkTypeAction(e) {
        let state = await this.dead_common()
        if (!state) {
            return false;
        }
        let type = e.currentTarget.dataset.type;
        let value = e.detail.value;
        if (type !== 'ok') {
            this.data.condition[type] = value
            this.setData({
                condition: this.data.condition
            })
        }
        this.data.condition['type'] = 'search';
        let _checkResult = await cloud.function.invoke(cloudFunction, {
            data: this.data.condition
        }, "B_MSG_3008")
        _checkResult = JSON.parse(_checkResult);
        if (_checkResult.code == 0 && _checkResult.message == '成功') {
            for (let i = 0; i < _checkResult.data.length; i++) {
                const item = _checkResult.data[i];
                _checkResult.data[i].createTime = moment(item.createTime).format('YYYY-MM-DD hh:mm:ss').valueOf();
            }
            this.setData({
                userData: _checkResult.data,
            })
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
    async onPageChange(e) {
        let skip = e.detail.value;
        this.data.condition.skip = ((skip - 1) * this.data.condition.limit);

        let userData = await cloud.function.invoke(cloudFunction, {
            data: this.data.condition
        }, "B_MSG_3008")
        userData = JSON.parse(userData);

        for (let i = 0; i < userData.data.length; i++) {
            const item = userData.data[i];
            userData.data[i].createTime = moment(item.createTime).format('YYYY-MM-DD hh:mm:ss').valueOf();
        }
        this.setData({
            userData: userData.data
        })
    },
    // 导出数据
    async download() {
        //2，定义存储数据的
        let alldata = [];
        let row = ['淘宝名','会员等级', '剩余次数', '当前积分', '购买商品数量', '购买商品金额', '分享次数', '邀请新增', '任务次数', '创建时间', '用户状态']; //表属性
        alldata.push(row);

        let userdata = this.data.userData;
        console.log('userdata', userdata);
        for (let key in userdata) {
            let arr = [];
            arr.push(userdata[key].nickName);
            arr.push(userdata[key].memberLv);
            arr.push(userdata[key].userCoin);
            arr.push(userdata[key].point);
            arr.push(userdata[key].buyNum);
            arr.push(userdata[key].buyCost);
            arr.push(userdata[key].shareNum);
            arr.push(userdata[key].count_invitation);
            arr.push(userdata[key].taskDoneCount);
            arr.push(moment(userdata[key].createTime).format('YYYY-MM-DD').valueOf());
            arr.push(userdata[key].isInBackList == true ? '黑名单' : '正常');
            alldata.push(arr)
        }

        let _dow = await cloud.function.invoke(cloudFunction, {
            data: {
                excelData: alldata,
                excelName: 'userData.xlsx'
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
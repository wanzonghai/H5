import moment from 'moment';
import points from '../../utils/points';

const app = getApp();
const cloud = app.cloud;
let cloudFunction = app.cloudFunction;
let template_id = app.template_id;
let clientVersion = app.clientVersion;
let article_code = app.article_code;
Component({
    mixins: [],
    data: {
        clientVersion: clientVersion,
        deadline: '2021-07-01',
        company: '小爱灵动互动娱乐',
        pageName: '',
        initPnums: 0,
        debugNum: 0,
        sqlFrame: 'none',
        deadlineNums: 0,

    },
    props: {
        subPageName: '',
    },
    async didMount() {
        await this.common();
        await this.onShow();
    },
    async didUpdate() {},
    didUnmount() {},
    methods: {
        //打开千牛客服聊天框
        openQianniu() {
            my.qn.openChat({
                nick: "cntaobao" + 'dragon佩恩',
                text: '你好',
            })
        },
        async common() {
            // 获取顶部导航标题
            // 父级
            let pageName = await my.getStorageSync({
                key: 'pageName'
            });
            if (pageName.data) {
                this.setData({
                    pageName: pageName.data
                })
            }
        },
        //打开千牛续费页面
        openQianniuRenew() {
            // 默认 续订 1 年
            my.qn.navigateToWebPage({
                url: "https://fuwu.m.taobao.com/wap/ser/index.htm?serviceCode="+ article_code +"&tracelog=sp#/serviceDetail?serviceCode="+ article_code +"",
                success: (res) => {
                    console.log('res', res);
                },
                fail: (res) => {
                    console.error('res', res);
                }
            });
        },
        // 跳转教程url
        toDocumentaction() {
            my.qn.navigateToWebPage({
                url: "https://www.yuque.com/docs/share/5ecc9bd5-f550-4d0d-86eb-88d54c9b704c?#WBwmc",
                success: res => {},
                fail: res => {}
            });
        },
        async onShow() {
            let _auth = {}
            try {
                // 调起,用户授权弹窗
                _auth = await my.authorize({
                    scopes: '*',
                });

                let _log = {
                    action: 'showMsgWarrant',
                };

                console.log('---数据埋点----' + _log.action, _log);

                points.points.setLog(_log);

            } catch (error) {}
            if (_auth.success == true) {
                console.log('授权成功', _auth)
                let _userInfo = {};
                try {
                    // 获取授权信息
                    _userInfo = await my.getAuthUserInfo();
                } catch (error) {
                    if (error) {
                        my.setStorageSync({
                            key: 'childAccountError',
                            data: {
                                state: true
                            }
                        })
                        my.showToast({
                            type: 'fail',
                            content: '子账号未授权，请联系主账号授权（授权后刷新页面即可正常使用）~'
                        })
                        return false;
                    }
                }
                if (_userInfo) {

                    let _log = {
                        action: 'resultWarrant',
                        result: 1,
                    };

                    console.log('---数据埋点----' + _log.action, _log);

                    points.points.setLog(_log);

                    let nickName = _userInfo.nickName;
                    // debug 模式,test调试模式开启
                    await this._debugUpdateToken();
                    // 写入授权信息如缓存中
                    my.setStorageSync({
                        key: "userInfo",
                        data: _userInfo
                    })
                    my.setStorageSync({
                        key: 'childAccountError',
                        data: {
                            state: false
                        }
                    })

                    // 只有主账号可以操作实例化
                    if (nickName.indexOf(':') >= 0) {
                        // 子用户昵称处理
                        let _nickNameList = nickName.split(':');
                        nickName = _nickNameList[0];
                    }
                    let state = true;
                    let deadline = "2021-07-01";

                    let expired = false;
                    this.setData({
                        deadline: deadline
                    })
                    my.setStorageSync({
                        key: 'deadline',
                        data: deadline
                    })
                    if (deadline === '已过期') {
                        expired = true;
                        state = false;
                    }

                    // 测试服不允许实例化
                    if (cloud.topApi.options.env === 'test') {
                        state = false;
                    }
                    // 实例化
                    // if (state) {
                        // await this.slh(nickName);
                    // }
                }
            }
        },

        async slh(nickName) {
            // 实例化操作
            let _slh = await cloud.function.invoke(cloudFunction, {
                data: {
                    nickName: nickName
                }
            }, "B_MSG_4014")
            _slh = JSON.parse(_slh)
            console.log('获取实例化操作', _slh)
            let _isSlh = my.getStorageSync({
                key: "slh"
            });
            if (_isSlh.data) {
                return
            }

            my.setStorageSync({
                key: "slh",
                data: {
                    state: true
                }
            })

            if (_slh.code == 0 && _slh.data.last_version == '') {
                // 初始化,构建实例应用
                try {
                    let dy_result = await cloud.topApi.invoke({
                        api: 'taobao.miniapp.template.instantiate',
                        data: {
                            'clients': "taobao",
                            'description': '魔性的水果合并，玩法简单上头，品牌商品深度曝光，大大提升用户粘性留存',
                            'ext_json': {
                                "name": "test"
                            },
                            'icon': 'https://oss.ixald.com/BigWatermelon/admin/images/xigua.png',
                            'template_id': template_id,
                            'template_version': _slh.data.prod_version,
                        }
                    });
                    console.log('----初始化,构建实例化应用 ------', dy_result);
                    // 初始化,上线指定应用
                    if (dy_result) {
                        let _prod = await cloud.topApi.invoke({
                            api: 'taobao.miniapp.template.onlineapp',
                            data: {
                                'clients': "taobao",
                                'app_id': dy_result.app_id,
                                'template_id': template_id,
                                'template_version': _slh.data.prod_version,
                                'app_version': dy_result.app_version
                            }
                        })
                        if (_prod) {
                            console.log('----初始化,上线实例化应用 ------', _prod);
                            // 更新版本
                            await cloud.function.invoke(cloudFunction, {
                                data: {
                                    online_url: _prod.app_info.online_url,
                                    app_id: _prod.app_info.app_id,
                                    nickName: nickName
                                }
                            }, 'B_MSG_4015');
                            // 获取实例化后的版本最新版本信息
                            await this.get_template_info(nickName);
                        }
                    }
                } catch (error) {
                    my.showToast({
                        type: 'fail',
                        content: "没有权限实例化当前模板id, 请建立购买操作后再实例化"
                    })
                    return
                }
            } else if (_slh.code == 0 && _slh.data.last_version && (_slh.data.last_version !== _slh.data.prod_version)) {
                // 更新,版本
                let _update = await cloud.topApi.invoke({
                    api: 'taobao.miniapp.template.updateapp',
                    data: {
                        'clients': "taobao",
                        'app_id': _slh.data.app_id,
                        'template_id': template_id,
                        'template_version': _slh.data.prod_version,
                    }
                })
                console.log('----更新实例化应用------', _update);
                //更新版本,上线指定应用
                if (_update) {
                    let _prod = await cloud.topApi.invoke({
                        api: 'taobao.miniapp.template.onlineapp',
                        data: {
                            'clients': "taobao",
                            'app_id': _update.app_id,
                            'template_id': template_id,
                            'template_version': _slh.data.prod_version,
                            'app_version': _update.app_version
                        }
                    })
                    if (_prod) {
                        console.log('----更新版本,上线实例化应用 ------', _prod);
                        // 更新版本
                        await cloud.function.invoke(cloudFunction, {
                            data: {
                                online_url: _prod.app_info.online_url,
                                nickName: nickName
                            }
                        }, 'B_MSG_4015');
                        // 获取实例化后的版本最新版本信息
                        await this.get_template_info(nickName);
                    }
                }
            }
            await this.get_template_info(nickName);
        },
        createActive() {
            my.navigateTo({
                url: '/page/active/active'
            });
            my.qn.switchTabEx({
                id: 'active'
            })
        },
        async _debugUpdateToken() {
            /*正式上线时注释掉这些代码，然后去数据库手动把改debug为false*/
            if (cloud.topApi.options.env === 'test') {
            // if (cloud.topApi.options.env === 'online') {
                try {
                    console.log('-----------------debug-----------------', cloud.function)
                    let _debug = await cloud.function.invoke(cloudFunction, {
                        "debug": true
                    }, "DebugSetting")
                    _debug = JSON.parse(_debug);

                    if (_debug.code == 0 && _debug.data.debug == true) {
                        my.showToast({
                            type: 'fail',
                            content: '调试模式已开启，线上版本请关闭调试！'
                        })
                    }
                } catch (error) {}
            }
        },
        async sqlFrame() {
            this.data.debugNum = this.data.debugNum + 1;
            this.setData({
                debugNum: this.data.debugNum
            })
            if (this.data.debugNum === 15) {
                this.setData({
                    sqlFrame: 'sqlFrame'
                })
            }
        },
        async adminName(e) {
            let adminName = e.detail.value;
            let type = e.currentTarget.dataset.type
            if (type === 'add') {
                if (adminName === '马铭昊') {
                    console.log('this.data.adminName', this.data.adminName)
                    this.setData({
                        adminName: adminName
                    })
                }
            }
            if (type === 'ok') {
                console.log('this.data.adminName', this.data.adminName)
                if (this.data.adminName === '马铭昊') {
                    my.navigateTo({
                        url: '/page/sqlData/sqlData'
                    });
                    this.close()
                } else {
                    my.showToast({
                        type: 'fail',
                        content: '你的操作很危险!!!!'
                    })
                    return false;
                }
            }
        },
        close() {
            this.setData({
                sqlFrame: 'none',
                debugNum: 0
            })
        },
        // 获取模板数据
        async get_template_info(nickName) {
            try {
                let c_config = await cloud.function.invoke(cloudFunction, {
                    data: {
                        nickName: nickName
                    }
                }, "B_MSG_4016");
                c_config = JSON.parse(c_config);
                console.log('---B_MSG_4016---', c_config)
                if (c_config.data) {
                    let tb_url = c_config.data.online_url;
                    let tb_appid = c_config.data.app_id;

                    my.setStorageSync({
                        key: 'templateAppInfo',
                        data: {
                            tb_url: tb_url,
                            tb_appid: tb_appid
                        }
                    })
                }
            } catch (error) {}
        },
        // 增加debu时间
        async debug_dealine() {
            let deadlineNums = this.data.deadlineNums + 1;
            this.setData({
                deadlineNums: deadlineNums
            })
            if (deadlineNums > 10) {
                let deadline = moment().add(1, 'months').format('YYYY-MM-DD').valueOf();
                this.setData({
                    deadline: deadline
                });
                my.setStorageSync({
                    key: "deadline",
                    data: deadline
                })
            }

        },
    },
});
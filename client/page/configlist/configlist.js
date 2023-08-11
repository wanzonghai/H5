
import moment from "moment";
import points from '../../utils/points';
const QR = require('../../utils/qrcode.js')

const app = getApp();
const cloud = app.cloud;
let imageUrl = app.imageUrl;
let cloudFunction = app.cloudFunction;
let c_tb_url = app.c_tb_url;
Page({
    data: {
        promote_frame: 'promote_frame_none',
        cover: 'cover_none',
        imageUrl: imageUrl,
        activeList: [],
        checkActiveList: [],
        link_url: '',
        tb_url: '',
        loading: true,
    },
    async onLoad() {
        // 设置topy页面pagename
        await my.setStorageSync({
            key: "pageName",
            data: "活动列表"
        })
        await this.onShow()
    },
    async onShow() {

        // 获取全部活动list
        let activeList = await cloud.function.invoke(cloudFunction, {
            data: {}
        }, "B_MSG_3010");
        console.log('cloud',cloud)
        activeList = JSON.parse(activeList);
        if (activeList.data.length > 0) {

            let _tmp_1 = [];
            let _tmp_2 = [];
            for (let i = 0; i < activeList.data.length; i++) {
                const _item = activeList.data[i];

                if (_item.state === true) {
                    _tmp_1.push(_item)
                }
                if (_item.state === false) {
                    _tmp_2.push(_item)
                }

            }

            _tmp_1 = _tmp_1.sort(function (a, b) {
                return a.createTime < b.createTime ? 1 : -1
            })

            activeList.data = _tmp_1.concat(_tmp_2);

            let _activeList = [];
            let _checkActiveList = [];
            for (let i = 0; i < activeList.data.length; i++) {
                const item = activeList.data[i];
                let activeUrl = c_tb_url + '&query=' + encodeURI('activeId=' + item.activeId);
                let obj = {
                    activeId: item.activeId,
                    activeName: item.activeName,
                    createTime: moment(item.createTime).format('YYYY-MM-DD').valueOf(),
                    state: item.state,
                    activeQRcode: imageUrl + 'qrcode/active_1.png',
                    activeUrl: activeUrl
                }
                _activeList.push(obj)
                await this.createQrCode(activeUrl, "mycanvas_" + item.activeId, 150, 150);
                if (i <= 4) {
                    _checkActiveList.push(obj)
                }
            }
            this.setData({
                activeList: _activeList,
                checkActiveList: _checkActiveList,
            })

        }

        this.setData({
            loading: false
        });

    },
    // 复制剪切板
    setClipboard(e) {
        let link_url = this.data.link_url
        if (e.currentTarget.dataset.activeUrl) {
            link_url = e.currentTarget.dataset.activeUrl
        }
        my.setClipboard({
            text: link_url,
            success: function () {
                my.showToast({
                    type: 'success',
                    content: '复制成功~'
                })
            }
        });
    },
    // 跳转
    async jump(e) {
        let type = e.currentTarget.dataset.type;

        let state = await this.dead_common()
        if (!state) {
            return false;
        }

        if (type === 'edit') {
            let activeInfo = e.currentTarget.dataset.activeInfo
            my.navigateTo({
                url: '/page/active/active?activeId=' + activeInfo.activeId
            });
            my.qn.switchTabEx({
                id: 'active'
            })
        }
        //  推广
        if (type === 'promote') {
            let activeId = e.currentTarget.dataset.activeInfo.activeId;
            let activeUrl = '';
            for (let i = 0; i < this.data.activeList.length; i++) {
                const item = this.data.activeList[i];
                if (activeId == item.activeId) {
                    console.log('activeId', activeId)
                    activeUrl = item.activeUrl;
                    this.setData({
                        link_url: item.activeUrl,
                    })
                }
            }
            this.setData({
                cover: 'cover',
                promote_frame: 'promote_frame'
            })
            await this.createQrCode(activeUrl, "mycanvasDetail", 120, 120);

        }
        //   关闭弹窗
        if (type === 'close') {
            this.setData({
                cover: 'cover_none',
                promote_frame: 'promote_frame_none'
            })
        }
        // 直播
        if (type === 'video') {
            let _videoUrl = 'https://market.m.taobao.com/app/taefed/shopping-delivery-wapp/index.html#/putin?tabKey=all&appId=';

            let _userInfo = my.getStorageSync({
                key: "userInfo"
            });
            if (_userInfo.data) {
                // 实例化操作
                let _slh = await cloud.function.invoke(cloudFunction, {
                    data: {
                        nickName: _userInfo.data.nickName
                    }
                }, "B_MSG_4008")
                _slh = JSON.parse(_slh);
                console.log('----检测数据库是否存在实例化数据------', _slh)
                let _app_id = '';
                if (_slh.code == 0 && _slh.message == "成功") {
                    _app_id = _slh.data.app_id
                }
                my.qn.navigateToWebPage({
                    url: _videoUrl + _app_id,
                });
            }
        }
        // 直播教程
        if (type === 'video_Tutorials') {
            my.qn.navigateToWebPage({
                url: "https://www.yuque.com/docs/share/5ecc9bd5-f550-4d0d-86eb-88d54c9b704c?#YPfBT",
            });
        }
        // 手淘首页
        if (type === 'taobao_main') {
            my.qn.navigateToWebPage({
                url: "https://www.yuque.com/docs/share/5ecc9bd5-f550-4d0d-86eb-88d54c9b704c?#YPfBT",
            });
        }
        // 手淘详情
        if (type === 'taobao_detail') {
            my.qn.navigateToWebPage({
                url: "https://www.yuque.com/docs/share/5ecc9bd5-f550-4d0d-86eb-88d54c9b704c?#YPfBT",
            });
        }
        // 跳转千牛淘宝旺铺
        if (type === 'taobao_qn') {
            my.qn.navigateToWebPage({
                url: "https://xiangqing.wangpu.taobao.com/index.html?spm=a211b7.9460838.0.0.6ace4aa0WYwCFV",
            });
        }
        // 关闭活动
        if (type === 'closeActive') {
            my.confirm({
                title: '温馨提示',
                content: '活动下架后,将无法再恢复',
                confirmButtonText: "确定",
                cancelButtonText: '取消',
                success: (result) => {
                    if (result.confirm == true) {
                        let activeId = e.currentTarget.dataset.activeInfo.activeId;
                        cloud.function.invoke(cloudFunction, {
                            data: {
                                activeId: activeId
                            }
                        }, 'B_MSG_4006').then((res) => {

                            let _log = {
                                action: 'closeActivity',
                                activeId: activeId,
                            };

                            console.log('---数据埋点----' + _log.action, _log);

                            points.points.setLog(_log);

                            my.showToast({
                                type: 'success',
                                content: '该活动下架成功~'
                            })
                            this.onShow()
                        })
                    }

                },
            })


        }
    },
    //适配不同屏幕大小的canvas
    setCanvasSize: function () {
        var size = {};
        try {
            var res = my.getSystemInfoSync();
            var scale = 750 / 686; //不同屏幕下canvas的适配比例；设计稿是750宽
            var width = res.windowWidth / scale;
            var height = width; //canvas画布为正方形
            size.w = width;
            size.h = height;
        } catch (e) {
            // Do something when catch error
            console.log("获取设备信息失败" + e);
        }
        return size;
    },
    async createQrCode(url, canvasId, cavW, cavH) {
        //调用插件中的draw方法，绘制二维码图片
        console.log('--------------start--------------')
        QR.api.draw(url, canvasId, cavW, cavH, this, this.canvasToTempImage(canvasId));
        console.log('--------------end--------------')

    },
    //获取临时缓存照片路径，存入data中
    async canvasToTempImage(canvasId) {
        // const ctx = my.createCanvasContext(canvasId);
        // let res = await ctx.toTempFilePath({
        //    canvasId: canvasId,
        //    width: 150,
        //    height: 150,
        //    fileType: 'png'
        // });
    },
    async formSubmit(e) {
        let activeId = e.currentTarget.dataset.activeInfo.activeId;
        let activeUrl = e.currentTarget.dataset.activeInfo.activeUrl;
        //绘制二维码
        await this.createQrCode(activeUrl, "mycanvas_" + activeId, 150, 150);
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
    onPageChange(e) {
        let skip = e.detail.value;
        let _checkActiveList = [];
        let _Pskip = 5;
        for (let i = 0; i < this.data.activeList.length; i++) {
            const item = this.data.activeList[i];
            if (i >= (skip - 1) * _Pskip && i < skip * _Pskip) {
                _checkActiveList.push(item)
            }
        }
        this.setData({
            checkActiveList: _checkActiveList
        })
    },
    SortByProps(item1, item2, obj) {
        var props = [];
        if (obj) {
            props.push(obj)
        }
        var cps = [];
        // 存储排序属性比较结果。
        // 如果未指定排序属性(即obj不存在)，则按照全属性升序排序。
        // 记录下两个排序项按照各个排序属性进行比较得到的结果    
        var asc = true;
        if (props.length < 1) {
            for (var p in item1) {
                if (item1[p] > item2[p]) {
                    cps.push(1);
                    break;
                    // 大于时跳出循环。
                } else if (item1[p] === item2[p]) {
                    cps.push(0);
                } else {
                    cps.push(-1);
                    break;
                    // 小于时跳出循环。
                }
            }
        } else {
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                for (var o in prop) {
                    asc = prop[o] === "ascending";
                    if (item1[o] > item2[o]) {
                        cps.push(asc ? 1 : -1);
                        break;
                        // 大于时跳出循环。
                    } else if (item1[o] === item2[o]) {
                        cps.push(0);
                    } else {
                        cps.push(asc ? -1 : 1);
                        break;
                        // 小于时跳出循环。
                    }
                }
            }
        }
        // 根据各排序属性比较结果综合判断得出两个比较项的最终大小关系
        for (var j = 0; j < cps.length; j++) {
            if (cps[j] === 1 || cps[j] === -1) {
                return cps[j];
            }
        }
        return false;
    }

});
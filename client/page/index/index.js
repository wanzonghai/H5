import points from '../../utils/points';

Page({
    data: {},
    async onLoad() {
        // 设置topy页面pagename
        await my.setStorageSync({
            key: "pageName",
            data: "首页"
        })
    },
    async onShow() {},
    // 活动跳转
    jump(e) {
        let type = e.currentTarget.dataset.type;
        if (type === 'config') {
            let _log = {
                action: 'createActivity'
            }
            points.points.setLog(_log)
            console.log('---数据埋点----' + _log.action, _log);

            my.navigateTo({
                url: '/page/active/active'
            });
            my.qn.switchTabEx({
                id: 'active'
            })
        }
        if (type === 'configlist') {
            my.navigateTo({
                url: '/page/configlist/configlist'
            })
            my.qn.switchTabEx({
                id: 'configlist'
            })
        }
        if (type === 'looksetting') {
            my.qn.navigateToWebPage({
                url: "https://www.yuque.com/books/share/c7760311-edb3-4043-a66c-c52431140230?#",
                success: res => {},
                fail: res => {}
            });
        }
    }

});
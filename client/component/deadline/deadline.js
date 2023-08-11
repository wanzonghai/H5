
const app = getApp();
let b_appId = app.b_appId;
let article_code = app.article_code;
Component({
    mixins: [],
    data: {
        deadlineState: false,
        close: false,
    },
    props: {
        subDeadline: '',
    },
    async didMount() {},
    async didUpdate() {},

    didUnmount() {},
    methods: {
        //打开千牛续费页面
        openQianniuRenew() {
            // 默认 续订 1 年
            my.qn.navigateToWebPage({
                url: "https://fuwu.m.taobao.com/wap/ser/index.htm?serviceCode="+ article_code +"&tracelog=sp#/serviceDetail?serviceCode="+ article_code +"",
                success: (res) => {
                    console.log('res',res);
                },
                fail: (res) => {
                    console.error('res',res);
                }
            });
        },
        close() {
            this.setData({
                close: true
            })
        },
    },

});
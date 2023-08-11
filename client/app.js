import cloud from '@tbmp/mp-cloud-sdk';
import points from './utils/points';

// TODO 发布审核改为 online
cloud.init({
  env: 'online', // online || pre || test
});

App({
  clientVersion: '0.0.17',
  cloudFunction: 'BigWatermelon', // 正式服
  // cloudFunction: 'test', // 正式服
  //  oss地址
  shareUrl: 'https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/admin/images/',
  imageUrl: 'https://oss.ixald.com/BigWatermelon/admin/images/',
  // 淘宝网页地址
  tbWebUrl: 'https://item.taobao.com/item.htm?ft=t&id=',
  //  c端模板id  固定配置
  template_id: '3000000041289774',
  // b端id
  b_appId: '3000000041291431',
  // 服务市场配置
  article_code: 'FW_GOODS-1001148308',
  // C端地址
  c_tb_url: "https://m.duanqu.com?_ariver_appid=3000000041289774&nbsv=0.0.13&nbsource=debug&nbsn=TRIAL&_mp_code=tb&transition=present",

  cloud,
  async onLaunch() {
    // 设置topy页面pagename
    await my.setStorageSync({
      key: "pageName",
      data: "首页"
    });
    let _log = {
      action: 'enterHall',
    };

    console.log('---数据埋点----' + _log.action, _log);

    points.points.setLog(_log);


    my.removeStorageSync({
      key: "slh"
    })

  },
  async onShow() {

    if (cloud.topApi.options.env === 'test') {
      my.showToast({
        type: 'success',
        content: '当前测试环境：TEST（正式服不提示！！！）'
      })
      return true;
    }
  },
  onHide() {
    // console.log('关闭千牛');
  },

});
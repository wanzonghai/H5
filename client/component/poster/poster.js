Component({
   mixins: [],
   data: {
      tabs2: [
         // {
         //    title: '直播间互动浮窗',
         //    subTitle: '图片+按钮（678*600px）',
         //    img: [
         //       'https://oss.ixald.com/bigFight/admin/images/678x600.png',
         //       'https://oss.ixald.com/bigFight/admin/images/678x600_new_year.png'
         //    ]
         // },
         // {
         //    title: '直播间互动浮窗',
         //    subTitle: '整张图片（678*642px）',
         //    img: [
         //       'https://oss.ixald.com/bigFight/admin/images/678x642.png',
         //       'https://oss.ixald.com/bigFight/admin/images/678x642_new_year.png'
         //    ]
         // },
         {
            title: '手淘首页Banner',
            subTitle: '整张图片（750*200px）',
            img: [
               'https://oss.ixald.com/BigWatermelon/admin/images/750x200.png',
            ]
         },
         // {
         //    title: '手淘首页/详情海报',
         //    subTitle: '整张图片（750*360px）',
         //    img: 'https://oss.ixald.com/bigFight/admin/images/750x360.png'
         // },
      ],
      activeTab2: 0
   },
   props: {},
   didMount() { },
   didUpdate() { },
   didUnmount() { },
   methods: {
      handleTabClick({ index, tabsName }) {
         console.log('handleTabClick', index, tabsName)
         this.setData({
            [tabsName]: index,
         });
      },
      handleTabChange({ index, tabsName }) {
         console.log('handleTabChange', index, tabsName)
         this.setData({
            [tabsName]: index,
         });
      },
      handlePlusClick() {
         my.alert({
            content: 'plus clicked',
         });
      },
      previewImage(e) {
         my.previewImage({
            enablesavephoto: true,
            enableShowPhotoDownload: true,
            urls: [e.currentTarget.dataset.img],
         });
      },
      saveImage(e) {
         my.saveImage({
            url: e.currentTarget.dataset.img,
            showActionSheet: true,
            success: () => {
               my.alert({
                  title: '保存成功',
               });
            },
         });
      }
   },
});

import UI_ActivityAward from "./activity/UI_ActivityAward";
import ModuleWindow from "../ModuleWindow";
import { ModuleAudio } from "../ModuleTool";




export default class uiActivityAward extends UI_ActivityAward {

    // //用到的FGUI中元件,必须和fgui名字一致
    // element = {
    //     bg: null as fgui.GImage,
    //     closeBtn: null as fgui.GButton,
    //     list: null as fgui.GList,
    // }


    private _winHandler: ModuleWindow;
    protected onConstruct(): void {

        super.onConstruct();


    }
    /**
     * 初始化方法，由于不能多继承，重载基类的这个方法来完成Init，和Init一样正常这个方法也是只会调用一次。
     * 另，这个方法不能传参，暂时由data来传递窗口的handler
     */
    makeFullScreen(): void {

        super.makeFullScreen();	//先处理全屏

        // //对齐全屏下的位置
        // let _anchorX = 0;
        // let _anchorY = 0;
        // if (this.pivotAsAnchor) {
        //     _anchorX = this.pivotX;
        //     _anchorY = this.pivotY;
        // }
        // this.setXY(_anchorX * this.width, _anchorY * this.height);



        // console.log('wh', this.width, this.height);
        // console.log('xy', this.x, this.y);


        //初始化
        this._winHandler = this.data as ModuleWindow;

        this.data = null;

        if (this._winHandler != null) {
            //设置显示监听，用于窗口关闭时的本类数据清理。
            // this._winHandler.SetShowCallBack(this, this.OnShow);
            //设置隐藏监听，用于窗口关闭时的本类数据清理。
            this._winHandler.SetHideCallBack(this, this.onHide);
            this.onStart();
        }


    }

    onStart() {
        this.visible = true;
        this.clickBtn();
        this.listenText();
        this.onShow();
        

    }
    onShow() {
        // for (let index = 0; index < 3; index++) {
        //     // this.m_giftList.addItem();
        //     console.error('giftList');
        //     this.m_giftList.addChild(new GiftItem());

        // }
        // this.m_bg.visible = false;
        // ModuleTool.ActionPopIn(this, () => {
        //     this.m_bg.visible = true;
        // })
        this.RefreshList();
    }
    onHide() {
        // _callBacK && _callBacK();
        this.onEnd();
    }

    onEnd() {
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
    }
    // Hide() {
    //     this.onHide();
    //     this._winHandler.hide();
    // }
    clickBtn() {
        // //开始按钮
        // this.m_closeBtn.onClick(this, () => {
        //     console.log('closeBtn');
        //     this.Close();
        // })

    }

    // Close(_callBacK?: Function) {
    //     if (!this.visible) {
    //         return;
    //     }
    //     this.Hide();
    //     _callBacK && _callBacK();
    // }
    listenText() {
        // this.m_updateTime.text = '' + GameLogic.GetCurScore();
    }
    RefreshList() {

        this.m_list.removeChildrenToPool();
        // let delay = 150;
        // this._winHandler.showModalWait();
        console.error('[uiActivityAward] 未加载数据');

        // ServerAPI.Cloud.Connect('GetRankAllReward', {
        //     callBack: async (succcess: boolean, _getData) => {
        //         this._winHandler.closeModalWait();
        //         if (succcess) {
        //             for (var i: number = 0; i < _getData.length; i++) {
        //                 let _curD = _getData[i];
        //                 let item: ActivityAwardItem = <ActivityAwardItem>this.m_list.addItemFromPool();
        //                 // console.error('item', item);

        //                 item.SetInfo(_curD as any);
        //                 item.Show();
        //                 // item.RunMoveinAction(delay * 2);
        //                 // await TimeUtil.wait(delay);
        //             }
        //         }
        //     }
        // })

        console.error('this._winHandler', this._winHandler);

        Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
    }
}
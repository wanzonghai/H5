import { ModuleGlobal } from './../ModuleGlobal';

import UI_ActivityEndPopup from './activity/UI_ActivityEndPopup';
import { ModuleAudio, ModuleTool } from './../ModuleTool';
import ModuleWindow from '../ModuleWindow';
import ModulePackage from '../ModulePackage';
import { ModulePlatformAPI } from './../ModulePlatformAPI';


export interface ActivityEndPopupInfo {
    haveAward: number,//0有奖品，1未获得奖励，2人数不足
    awardData?: {
        curRank: number,//当前排名
        // rewardType: number,//奖品级别
        title: string, //奖品名称
        // pic_url: string,
        // price: number,
    }
    // delay: number//延迟显示时间
}
export default class uiActivityEndPopup extends UI_ActivityEndPopup {


    // //用到的FGUI中元件,必须和fgui名字一致
    // element = {
    //     bg: null as fgui.GImage,
    //     closeBtn: null as fgui.GButton,
    //     goStoreBtn: null as fgui.GButton,//进入店铺
    //     goAwardBtn: null as fgui.GButton,//进入奖品包
    //     awardRank: null as fgui.GTextField,
    //     awardInfo: null as fgui.GTextField,
    //     // title: null as fgui.GTextField,
    // }

    // private refreshTime = 0;
    // private ctrl: fgui.Controller = null as any;
    myinfo: ActivityEndPopupInfo = null as any;

    private _winHandler: ModuleWindow;

    private static closeCallback?: Function;

    static AutoShowActivityEnd(_showResultCallback?: (_show: boolean) => void, _closeCallback?: () => void) {

        // let _endShowed = false;
        // // const showkey = 'ActivityEndShowed_' + ModulePackage.SERVER_NAME;
        // // _endShowed = ModuleTool.GetLocalItem(showkey); 本地不再进行判断
        // if (_endShowed) {
        //     _showResultCallback && _showResultCallback(false);
        //     return;
        // }
        if (!ModulePackage.Instance.CanUseNetAPI()) {
            _showResultCallback && _showResultCallback(true);
            ModulePackage.Instance.PopWindow("activity", "ActivityEndPopup", {
                px: 0, py: 0, winParamData: {
                    haveAward: 0,
                    awardData: {
                        curRank: 0,//当前排名
                        title: '奖品名', //奖品名
                    },
                }
            });
            return;
        }
        // let _showActivity = false;
        //逻辑判断是否获得优惠券
        ModulePackage.Instance.SendNetMessage("", "/C/rank/lastResult", {
            uid: ModuleGlobal.uid
        }, "post", this, (data) => {

            console.log('/C/rank/lastResult', data);
            let _show = data.code == 0 || data.code == 7007 || data.code == 7008;
            _showResultCallback && _showResultCallback(_show);
            if (_show) {
                this.closeCallback = _closeCallback;
                let _haveAward = 2;
                let _awardData = null as any;
                if (data.code == 0) {
                    _haveAward = 0;
                    if (data.data) {
                        _awardData = {
                            curRank: data.data.rankNo,//当前排名
                            title: data.data.prizeName, //奖品名
                        }
                    }

                }
                else if (data.code == 7008) {//未获奖
                    _haveAward = 1;

                }
                else if (data.code == 7007) {//人数不足
                    _haveAward = 2;

                }
                ModulePackage.Instance.PopWindow("activity", "ActivityEndPopup", {
                    px: 0, py: 0, winParamData: {
                        haveAward: _haveAward,
                        awardData: _awardData,
                    }
                });
                // ModuleTool.SetLocalItem(showkey, true);
                // ModulePackage.Instance.PopWindow("autotriggerAward", "AutotriggerAward", 0, 0, {
                // 	title: '超级优惠券',
                // 	price: 199.99,
                // 	linkId: 0
                // });
            }


        });

    }

    protected onConstruct(): void {

        super.onConstruct();
        this.clickBtn();

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

            this._winHandler.SetHideCallBack(this, this.onHide);
            this.onStart();
            this.SetInfo(this._winHandler.GetParamData());

        }


    }


    onStart() {


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
    }
    onHide() {
        Laya.stage.event('refreshBubble');
        this.onEnd();
        uiActivityEndPopup.closeCallback && uiActivityEndPopup.closeCallback();
    }

    onEnd() {
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
    }
    Hide() {
        this.onHide();
        // this._winHandler.hide();
    }
    clickBtn() {
        // //开始按钮
        // this.m_closeBtn.onClick(this, () => {
        //     console.log('closeBtn');
        //     this.Close();
        // })
        this.m_goAwardBtn.onClick(this, () => {
            console.log('goAwardBtn');
            // console.error('模块间跳转未完成');
            ModulePackage.Instance.Show('baseBag', 0, 0, this);

            ModuleAudio.PlayComonBtnAudio();
            // MyUtils.showLoading();
            // let demo: any = new Bag();
        })
        let _go = false;
        this.m_goStoreBtn.onClick(this, () => {
            if (_go) {
                return;
            }
            ModuleAudio.PlayComonBtnAudio();
            console.log('goStoreBtn');
            ModulePlatformAPI.NavigateToTaobaoPage(() => {
                _go = false;
            })
            // console.error('goStoreBtn 未添加跳转');
            // ModulePackage.Instance.NavigateToTaobaoPage(TB._storeId, () => {
            //     _go = false;
            // }, () => {
            //     _go = false;
            // });
        })

    }

    Close(_callBacK?: Function) {
        // if (!this.visible) {
        //     return;
        // }
        // this.m_bg.visible = false;
        // ModuleTool.ActionPopOut(this, () => {
        //     this.Hide();
        //     _callBacK && _callBacK();

        // })
    }
    listenText() {
        // this.m_updateTime.text = '' + GameLogic.GetCurScore();
    }
    SetInfo(_info: ActivityEndPopupInfo) {
        this.myinfo = _info;
        // console.error('main',this.main);

        // this.ctrl = this.getController('infoCtr');
        this.m_infoCtr.selectedIndex = _info.haveAward;
        if (_info.haveAward == 0 && _info.awardData) {
            this.m_awardRank.setVar('count', '' + _info.awardData.curRank).flushVars();
            this.m_awardInfo.text = _info.awardData.title;
        }
    }

}
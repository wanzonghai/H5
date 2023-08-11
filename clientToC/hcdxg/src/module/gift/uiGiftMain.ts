
import { FailType } from "./uiexchangeFail";
import GiftItem from './uiGiftItem';
import UI_Main from './gift/UI_Main';
import ModuleWindow from "../ModuleWindow";
import uiexchangeConfirm from "./uiexchangeConfirm";
import uiexchangeFail from "./uiexchangeFail";
import uiexchangeSuccess, { ExchangeSuccessInfo } from "./uiexchangeSuccess";
import { ModuleAudio, ModuleTool } from './../ModuleTool';
import ModulePackage from './../ModulePackage';
import { ModuleSkins } from "../ModuleSkins";


export default class uiGiftMain extends UI_Main {


    private _winHandler: ModuleWindow;


    m_exchangeConfirm: uiexchangeConfirm; //确认兑换
    m_exchangeSuccess: uiexchangeSuccess; //兑换成功
    m_exchangeFail: uiexchangeFail; //兑换失败

    m_bubbleBG: fgui.GImage;
    m_bagNText: fgui.GTextField;

    private refreshTime = 0;


    protected onConstruct(): void {

        super.onConstruct();

        console.log('onConstructonConstruct');


        this.onStart();
    }
    /**
     * 初始化方法，由于不能多继承，重载基类的这个方法来完成Init，和Init一样正常这个方法也是只会调用一次。
     * 另，这个方法不能传参，暂时由data来传递窗口的handler
     */
    makeFullScreen(): void {

        super.makeFullScreen();	//先处理全屏
        //对齐全屏下的位置
        let _anchorX = 0;
        let _anchorY = 0;
        if (this.pivotAsAnchor) {
            _anchorX = this.pivotX;
            _anchorY = this.pivotY;
        }
        this.setXY(_anchorX * this.width, _anchorY * this.height);


        //初始化
        this._winHandler = this.data as ModuleWindow;

        this.data = null;

        if (this._winHandler != null) {
            // this.onStart();
            //设置显示监听，用于窗口关闭时的本类数据清理。
            this._winHandler.SetShowCallBack(this, this.onShow);
            //设置隐藏监听，用于窗口关闭时的本类数据清理。
            this._winHandler.SetHideCallBack(this, this.onHide);

            this.SetInfo();
            // this._LoadLastRankData();
        }
    }

    // private _LoadLastRankData(): void {

    //     ModulePackage.Instance.SendNetMessage("", "/C/rank/list", {

    //         // actId: 2,
    //         type: "pre",
    //         // userOpenId: "9872"

    //     }, "post", this, (data) => {

    //         Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);

    //         this._winHandler.closeModalWait();

    //         this._lastRankData = data;

    //         this.OnShow();
    //     });

    //     Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
    // }



    onStart() {
        console.log('onStartonStart');
        this.changeSkin();
        this.m_bubbleBG = this.m_btnMyGift.getChild('bubbleBG').asImage;
        this.m_bagNText = this.m_btnMyGift.getChild('bagNText').asTextField;
        
        this.clickBtn();
        this.listenText();
        Laya.stage.on('exchangePopup', this, this.ShowExchangePopup);
        Laya.stage.on('exchangeSuccess', this, this.ShowExchangeSuccess);
        Laya.stage.on('exchangeFail', this, this.ShowExchangeFail);
        Laya.stage.on('gotoBag', this, () => {
            console.log('gotoBag');

            ModulePackage.Instance.Show('baseBag', 0, 0, this);
            // this.CloseSelf();
            // MyUtils.showLoading();
            // let demo: any = new Bag();
        });

    }
    changeSkin() {
		ModuleSkins.ChangeFguiICON(this.m_btnMyGift, 'myPrize');
	}
    onShow() {
        // //MainUtil.analysis('clickExchange');
        // this.m_bg.visible = false;
        // ModuleTool.ActionPopIn(this, () => {
        //     this.m_bg.visible = true;
        // });


    }
    Show() {
        this.visible = true;
        this.onShow();
    }
    Hide() {
        this.onHide();
        this._winHandler.hide();
    }
    onHide() {
        this.onEnd();
    }

    onEnd() {
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
    }
    SetInfo() {
        this.refreshTime = 0;
        Laya.timer.loop(500, this, this.timeUpdate);
        this.refreshBubbleUI();
        this.RefreshList();

        Laya.stage.event('refreshBubble');
    }
    // CloseSelf() {
    //     this.m_bg.visible = false;
    //     ModuleTool.ActionPopOut(this, () => {
    //         this.Hide();
    //     })
    // }
    clickBtn() {
        console.log('clickBtnclickBtn');

        // //开始按钮
        // this.m_closeBtn.onClick(this, () => {

        //     console.log('closeBtn');
        //     this.CloseSelf();
        // })
        //我的奖品按钮
        this.m_btnMyGift.onClick(this, () => {

            console.log('btnMyGift');
            Laya.stage.event('gotoBag');
            ModuleAudio.PlayComonBtnAudio();
        })

    }
    listenText() {
        // this.m_updateTime.text = '' + GameLogic.GetCurScore();
    }
    RefreshList() {
        Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
        // this._winHandler.showModalWait();
        this.m_giftList.removeChildrenToPool();
        this.GetScoreShopList((_dataList) => {
            // console.error('_dataList', _dataList);

            Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);
            this._winHandler.closeModalWait();
            this.m_updateTime.visible = _dataList && _dataList.resetConfig.state;
            this.m_updateTimeTitle.visible = this.m_updateTime.visible;
            if (!_dataList) {
                return;
            }
            if (_dataList.resetConfig.state) {
                let _date = new Date();
                let _now = _date.getTime();//得到当前时间戳
                var year = _date.getFullYear(); //得到年份
                var month = _date.getMonth() + 1;//得到月份
                var date = _date.getDate();//得到日期
                let _todayT = `${year}/${(month < 10 ? '0' : '') + month}/${(date < 10 ? '0' : '') + date} ${_dataList.resetConfig.time}`;
                console.log('_todayT', _todayT);
                let _refreshT = new Date(_todayT).getTime();
                if (_refreshT <= _now) {
                    //更新时间<当前时间则日期+1
                    _refreshT += 24 * 60 * 60 * 1000;
                }
                this.refreshTime = _refreshT;
                console.log('refreshTime', this.refreshTime);
            }
            this.m_giftList.removeChildrenToPool();
            for (let index = 0; index < _dataList.rewardList.length; index++) {
                let _elemete = this.m_giftList.addItemFromPool() as GiftItem;
                // let _elemete = this.m_giftList.getChildAt(index) as GiftItem;
                // console.error('this.m_giftList',);
                _elemete.SetInfo(_dataList.rewardList[index])
            }
        })
    }
    timeUpdate() {
        if (this.refreshTime > 0) {
            let _dif = this.refreshTime - Date.now();
            // console.log('_dif', _dif);
            if (_dif < 0) {
                this.RefreshList();
                return;
            }
            _dif = (_dif / 1000) | 0;
            //获取s,m,h
            let _strs = ['', '', ''];
            for (let index = 0; index < 3; index++) {
                let _s = _dif;
                if (index < 2) {
                    _s = _dif % 60;
                }
                _strs[index] = (_s < 10 ? '0' : '') + _s;
                _dif = (_dif / 60) | 0;
            }
            // console.log('_strs', _strs);
            this.m_updateTime.text = `${_strs[2]}:${_strs[1]}:${_strs[0]}`;
        }

    }
    ShowExchangePopup(_data: any) {
        // console.error('ShowExchangePopup', _data);

        this.m_exchangeConfirm.SetInfo(_data, this._winHandler);
    }
    ShowExchangeSuccess(_data: ExchangeSuccessInfo) {
        // console.log('m_exchangeSuccess', this.m_exchangeSuccess);

        this.m_exchangeSuccess.SetInfo(_data);
        Laya.stage.event('GiftItemsubLeft' + _data.id);
        Laya.stage.event('refreshBubble');
    }
    ShowExchangeFail(_failType: FailType) {
        console.log('ShowExchangeFail', _failType);

        this.m_exchangeFail.SetInfo(_failType);
    }

    refreshBubbleUI() {
        let _refresh = (_data) => {
            // console.log('_refresh');
            // this.countDownTask = [];
            // this.taskPointN = 0;
            //返回数据 data:{bag_num:1,task_num:2}
            console.log('refreshBubbleUI _data', _data);
            let _bagN = _data.bag_num;
            // this.taskPointN = _data.task_num;
            // let _bagN = _data.bag_num;
            let _havebag = _bagN > 0;
            this.m_bubbleBG.visible = _havebag;
            this.m_bagNText.visible = _havebag;
            if (_havebag) {
                this.m_bagNText.text = '' + _bagN;
            }
        }
        Laya.stage.on('refreshBubbleUI', this, _refresh);


    }

    //--------------------------兑换商品接口---------------------//
    //获取兑换列表
    GetScoreShopList(_callBack: (_dataList: {
        rewardList: [
            {
                // exchangeConfig: any,//商品兑换限制 配置
                price: number,//兑换价格
                // total: number,//总库存数
                leftN: number,//剩余库存数
                // name: "goods" | "coupon",//奖品种类（"goods": 真实商品  “coupon”: 优惠券）
                // type: number,//奖品级别（唯一）（对应1，2，3等奖。。。）
                pic_url: string,//商品url链接
                title: string,//商品名字
                num_iid: string,//商品id
                getN: number,//已获得数量
                limitN: number,//可兑换限制数量
            }
        ], // B端配置的奖品列表
        resetConfig: {
            state: boolean,//(true: 设置开启重置时间  false: 未设置)
            time: string,//每日重置或刷新库存的时间点
        }
    }) => void) {
        //模拟数据
        let _fakedata = [{
            // prizeId: '111',//商品id
            Id: '111',//商品id
            prize: '奖品名',
            price: 1.01,//商品价格
            alreadyExchange: 0,//已兑换次数
            number: 10,//剩余库存数量
            integral: 10,//兑换所需积分
            icon: '',//商品图片url
            // remarks: '商品描述信息',
            exchangeType: 5,//兑换次数限制，-1表示不限制
            state: 'normal' as 'finish' | 'normal' | 'outOfStock',//兑换状态 finish：已兑换 normal：可兑换 outOfStock：库存不足
        },
        {
            // prizeId: '123',//商品id
            Id: '123',//商品id
            prize: '奖品名2',
            price: 1.01,//商品价格
            alreadyExchange: 1,//已兑换次数
            number: 10,//剩余库存数量
            integral: 10,//兑换所需积分
            icon: '',//商品图片url
            // remarks: '商品描述信息2',
            exchangeType: 5,//兑换次数限制，-1表示不限制
            state: 'normal' as 'finish' | 'normal' | 'outOfStock',//兑换状态 finish：已兑换 normal：可兑换 outOfStock：库存不足
        }];

        let _getInfo = (_data: typeof _fakedata) => {
            // console.error('_data', _data);

            let _dataList = {
                rewardList: [],
                resetConfig: {
                    state: false,//(true: 设置开启重置时间  false: 未设置)
                    time: '0',//每日重置或刷新库存的时间点
                }
            }
            for (const reward of _data) {
                let _dd = {
                    // exchangeConfig: any,//商品兑换限制 配置
                    price: this.ChangeToNumber(reward.integral),//兑换需要积分
                    // total: number,//总库存数
                    leftN: this.ChangeToNumber(reward.number),//剩余库存数
                    // name: "goods" | "coupon",//奖品种类（"goods": 真实商品  “coupon”: 优惠券）
                    // type: this.ChangeToNumber(reward.price),//奖品级别
                    pic_url: '' + reward.icon,//商品url链接
                    title: '' + reward.prize,//商品名字
                    num_iid: '' + reward.Id,//商品id
                    getN: this.ChangeToNumber(reward.alreadyExchange),//已获得数量
                    limitN: this.ChangeToNumber(reward.exchangeType),//可兑换限制数量
                }
                // if(){

                // }
                _dataList.rewardList.push(_dd);
            }
            console.log('_getInfo _dataList', _dataList);
            _callBack(_dataList as any);
        }
        if (ModulePackage.Instance.CanUseNetAPI()) {

            //从服务端获取真实数据
            ModulePackage.Instance.SendNetMessage("", "/C/integral/integralList", { pageNumber: 1, pageSize: 999 }, "post", this,
                (data) => {

                    console.log("integralList", data);
                    if (data.code != 0) {
                        return;
                    }
                    //检测数据是否吻合
                    ModuleTool.DetectType('integralList', data.data.pageData, _fakedata);

                    //获得数据
                    _getInfo(data.data.pageData);

                });

        }
        // if (Laya.Browser.onTBMiniGame) {
        //     // console.error('【GetScoreShopList】淘宝数据接口未接入');


        //     // let reqData = {
        //     //     activeId: TB._activeId,
        //     // }
        //     // let info = { "id": Global.MSG_GET_SCORESHOP_LIST, "data": reqData };
        //     // TB.sendMsg(info, (buf) => {
        //     //     if (buf.code == 0) {
        //     //         console.log('获取兑换列表成功', buf.data)
        //     //         _getInfo(buf.data);

        //     //     } else {
        //     //         console.error('获取兑换列表失败', buf.message)
        //     //         _callBack(null);
        //     //     }
        //     // });
        // }
        else {

            _getInfo(_fakedata)

        }
    }
    ChangeToNumber(_v: any) {
        if (typeof _v == 'number') {
            return _v;
        } else if (typeof _v == 'string') {
            return Number(_v);
        }
        console.error('ChangeToNumber错误类型：', _v);
        return 0;
    }



}
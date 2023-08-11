import ModulePackage from "../ModulePackage";
import ModuleWindow from "../ModuleWindow";
import UI_Main from "./baseBag/UI_Main";
import UI_prizeItem from "./baseBag/UI_prizeItem";
import { ModulePlatformAPI } from './../ModulePlatformAPI';
import { ModuleAudio, ModuleTool } from "../ModuleTool";
import { AddressInfoType } from "./uiInputRewardAdress";


export default class uiBaseBagMain extends UI_Main {

	private _winHandler: ModuleWindow;

	private _winParamData: {};

	private _bDataIsReady = false;

	private _bIsShown = false;

	/**
	 * 背包数据
	 */
	private _bagData = {
		"code": 0,
		"msg": '',
		"data": {
			"total": 1,
			"totalPage": 1,
			"currentPage": 1,
			"pageData": [
				{
					"orderId": "202104261003039887",
					"icon": "https://www.cico.vip/images/upload/sed.png",
					"updateTime": 1619431383393,
					"userId": "AAEUJuVuANh0-OdADmy09-ts",
					"prizeNumber": 1,
					"activityId": 1015,
					"prizePrice": 199,
					"createTime": 1619431383393,
					"merchantId": 1007,
					"prizeName": "实物123123123123123",
					"price": 12300,
					"AppKey": "32676443",
					"Id": "60868fd7ef5071b7e224764a",//这是权益id
					"state": 1,
					"prizeType": 1,
				},
				{
					"orderId": "202104261003039887",
					"icon": "https://www.cico.vip/images/upload/sed.png",
					"updateTime": 1619431383393,
					"userId": "AAEUJuVuANh0-OdADmy09-ts",
					"prizeNumber": 1,
					"activityId": 1015,
					"prizePrice": 199,
					"createTime": 1619431383393,
					"merchantId": 1007,
					"prizeName": "特等奖12312312312123123123",
					"price": 12345,
					"AppKey": "32676443",
					"Id": "60868fd7ef5071b7e224764a",//这是权益id
					"state": 1,
					"prizeType": 2,
				}
			]
		}
	};
	private divideData = {
		goods: [],
		coupons: [],
	}

	protected onConstruct(): void {

		super.onConstruct();

		this.m_btnGoods.onClick(this, () => {
			// if (this.m_ctrlType.selectedPage == '实物') {
			// 	return;
			// }
			ModuleAudio.PlayComonBtnAudio();
			this._LoadBagData('goods');
			// console.log('实物实物');
			// this.m_ctrlType.setSelectedPage("实物");

		})
		this.m_btnCoupon.onClick(this, () => {
			// if (this.m_ctrlType.selectedPage == '优惠券') {
			// 	return;
			// }
			ModuleAudio.PlayComonBtnAudio();
			this._LoadBagData('coupons');
			// console.log('优惠券优惠券');
			// this.m_ctrlType.setSelectedPage("优惠券");


		})
		this.m_ctrlType.setSelectedPage("实物");

	}
	/**
	 * 初始化方法，由于不能多继承，重载基类的这个方法来完成Init，和Init一样正常这个方法也是只会调用一次。
	 * 另，这个方法不能传参，暂时由data来传递窗口的handler
	 */
	makeFullScreen(): void {

		super.makeFullScreen();	//先处理全屏

		//初始化
		this._winHandler = this.data as ModuleWindow;

		this.data = null;

		if (this._winHandler != null) {
			//获取弹出窗口是传进来的参数,这里是一个回调函数,用来处理再次进入游戏的逻辑
			this._winParamData = this._winHandler.GetParamData();
			// //设置显示监听，用于窗口打开时的本类数据初始化。
			// this._winHandler.SetShowCallBack(this, this.OnShow);
			//设置隐藏监听，用于窗口关闭时的本类数据清理。
			this._winHandler.SetHideCallBack(this, this.OnHide);

			this.divideData['goods'] = [];
			this.divideData['coupons'] = [];
			let _type: 'goods' | 'coupons' = this.m_ctrlType.selectedPage == '实物' ? 'goods' : 'coupons';
			this._LoadBagData(_type);
			// this._LoadBagData('coupons');
			Laya.stage.on('refreshAdress', this, () => {
				this._LoadBagData('goods', true);
			});
		}
	}

	private _LoadBagData(_type: 'goods' | 'coupons', _refresh = false): void {

		// if (!_refresh && this.divideData[_type] && this.divideData[_type].length > 0) {
		// 	return;
		// }
		this.divideData[_type] = [];


		let _show = (_data) => {
			// console.error('_LoadBagData', this._bagData.data.pageData);

			// for (const iterator of this._bagData.data.pageData) {
			// 	if (iterator.prizeType == 1) {
			// 		this.divideData.goods.push(iterator);
			// 	}
			// 	else if (iterator.prizeType == 2) {
			// 		this.divideData.coupons.push(iterator);
			// 	}
			// }
			// console.error('divideDatadivideDatadivideData', _data);

			this.divideData[_type] = _data;

			// this._bDataIsReady = true;
			this.OnShow(_type);
			// this.OnShow('coupons');
		}
		if (ModulePackage.Instance.CanUseNetAPI()) {
			ModulePackage.Instance.SendNetMessage("", "/C/bag/userBag", {

				pageNumber: 1,	//从1开始
				pageSize: 999,
				prizeState: _type == 'goods' ? 1 : 2
				// userId : "1"

			}, "post", this, (data) => {

				Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);

				this._winHandler.closeModalWait();

				// console.log(data);

				// this._bagData = data;
				_show(data.data.pageData);
			});

			Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
		}
		else {
			_show(this._bagData.data.pageData);
		}


		//this._OnClick(0,null); //test
	}


	/**
	 * 列表点击事件
	 */
	private _OnClick(index: number, evt: Event): void {

		console.log("---------------------------", evt, index);

		ModuleAudio.PlayComonBtnAudio();
		let itemData = this.divideData.goods[index];

		if (itemData.state > 1) return;	//只有未申请过发货的才能申请。

		// // ModulePackage.Instance.PopWindow("baseBag","InputRewardAdress",0,0,{orderId:itemData.Id});
		// ModulePlatformAPI.ChooseAddress(this, (result) => {

		// 	ModulePackage.Instance.PopWindow("baseBag", "InputRewardAdress", {
		// 		px: 0, py: 0, winParamData: {

		// 			"Id": itemData.Id,					//权益Id
		// 			"name": result.name,
		// 			// "nickName": result.name,
		// 			"phone": result.telNumber,
		// 			// "region": result.provinceName + result.cityName + result.countyName,
		// 			// "address": result.streetName + result.detailInfo,
		// 			"address": result.provinceName + result.cityName + result.countyName + result.streetName + result.detailInfo,

		// 			// target: this,
		// 			// callBack: (flag) => { if (flag == "Ok") this._winHandler.hide(); }
		// 		}
		// 	});

		// });

		let _adrinfo: AddressInfoType = {} as any;
		_adrinfo.Id = itemData.Id;
		//传入地址信息
		let _showAddress = () => {
			ModulePlatformAPI.ChooseAddress((_success, _info) => {
				if (!_success) {
					return;
				}
				_adrinfo.name = _info.name;
				_adrinfo.phone = _info.telNumber;
				_adrinfo.province = _info.provinceName;
				_adrinfo.city = _info.cityName;
				_adrinfo.county = _info.countyName;
				_adrinfo.street = _info.streetName;
				_adrinfo.address = _info.detailInfo;

				console.error('_info_info', _adrinfo);

				ModulePackage.Instance.PopWindow("baseBag", "InputRewardAdress", {
					winParamData: _adrinfo
				});
			})
		}
		//获取用户昵称
		ModulePlatformAPI.GetUserInfo((_info) => {
			_info.nickName = _info.nickName;
			_showAddress();
		}, () => {
			_adrinfo.nickName = '未授权';
			_showAddress();
		}
		)
	}
	_OnClickCoupons() {
		ModulePlatformAPI.NavigateToTaobaoPage();
		ModuleAudio.PlayComonBtnAudio();
	}
	private showAddress() {

	}

	/**
	 * 列表项渲染函数
	 * 正确用法，btn.onClick(this._OnClick); 
	 * 错误用法，btn.onClick(()=>{}); 这里不应该使用临时函数
	 * @param index
	 * @param obj
	 */
	private _OnRenderItem(_typeKey: 'goods' | 'coupons', index: number, obj: fgui.GObject): void {

		console.log(index, "================================1", _typeKey);

		var prizeItem = obj as UI_prizeItem;

		let itemData = this.divideData[_typeKey][index];

		// console.log(index, "================================2", itemData, prizeItem);

		if (!!itemData) {

			if (_typeKey == 'goods') {
				prizeItem.m_btnApply.onClick(this, this._OnClick, [index]);
				prizeItem.m_ctrlType.setSelectedPage('实物');
			}
			else {
				prizeItem.m_btnApply2.onClick(this, this._OnClickCoupons);
				prizeItem.m_ctrlType.setSelectedPage('优惠券');
			}

			var name = ModuleTool.getCutString(itemData.prizeName,15)
			prizeItem.m_txtName.text = name;

			//prizePrice 与b端数据不一致，改为元为单位
			prizeItem.m_txtPrice.setVar("money", (itemData.prizePrice).toFixed(2).toString()).flushVars();

			let _date = new Date(itemData.createTime);

			prizeItem.m_txtBeginTime.setVar("time", `${_date.getFullYear()}-${_date.getMonth()+1}-${_date.getDate()}`).flushVars();

			prizeItem.m_txtOrderNo.setVar("orderId", itemData.orderId).flushVars();

			prizeItem.m_loadItemHead.url = itemData.icon;

			// console.log(index, "================================3", itemData, prizeItem);

			//1未申请，2已经申请，3已发货
			if (itemData.state <= 1) {
				prizeItem.m_ctrlSendStatus.setSelectedPage("未申请发货");
			}
			else if (itemData.state == 2) {
				prizeItem.m_ctrlSendStatus.setSelectedPage("已申请发货");
			}
			else if (itemData.state == 3) {
				prizeItem.m_ctrlSendStatus.setSelectedPage("已发货");
			}
		}
	}

	public OnShow(_typeKey: 'goods' | 'coupons'): void {

		if (this._winHandler.visible == false) return;

		// if (this._bDataIsReady == false) return;

		// if (this._bIsShown == true) return;	//防止重复执行

		let len = 0;

		try {

			// console.log("uiBaseBagMain::OnShow1~~~", this.divideData[_typeKey]);

			// this.m_ctrlType.setSelectedPage("实物");

			let _list = _typeKey == 'goods' ? this.m_listGift : this.m_listSale;
			if (!!this.divideData[_typeKey]) {
				len = this.divideData[_typeKey].length;
			}

			// console.log("uiBaseBagMain::OnShow2~~~", len);

			if (len > 0) {
				this.m_ctrlEmptyStatus.setSelectedPage("不为空");
			}
			else {
				this.m_ctrlEmptyStatus.setSelectedPage("空的");
			}

			// console.log("uiBaseBagMain::OnShow5~~~", this);
			//实物列表
			_list.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, [_typeKey], false);

			// console.log("uiBaseBagMain::OnShow6~~~", _list);

			_list.setVirtual();

			_list.numItems = len;


		}
		catch (e) {

			console.log("uiBaseBagMain::OnShow4~~~", e);
		}

		//设置隐藏监听，用于窗口关闭时的本类数据清理。
		this._winHandler.SetHideCallBack(this, this.OnHide);

		// console.log("uiBaseBagMain::OnShow3~~~", len);
	}


	public OnHide(): void {

		console.log("OnHide~~~");
	}



}
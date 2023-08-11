/**
 * 全局使用的基础数据类
 */

import uiAlert from "./GeneralInterface/uiAlert";
import ModulePackage from "./ModulePackage";
import { ModulePlatformAPI } from "./ModulePlatformAPI";
import { ModuleTool } from './ModuleTool';



//商品信息类型
export interface GoodsInfoType {
	goodsId: number,//商品ID

	goodsName: string,//商品名称

	pic: string,//商品图片

	price: string,//商品价格

	sum: string,//商品数量
	isCollected?: boolean//商品是否已被收藏，本地自动检测

}
/**
 * 所有货币
 */
export interface GCurrencyInfo {
	/**次数*/ times: number,
	/**刀片*/ cutter: number,
	/**积分*/ score: number,
	/**大西瓜积分*/ wmScore: number,
	/**金牛币*/ cattleGold: number,
}
/**所有货币类型 */
export enum GCurrencyType {
	/**次数*/ times = 'times',
	/**刀片*/ cutter = 'cutter',
	/**积分*/ score = 'score',
	/**大西瓜积分*/ wmScore = 'wmScore',
	/**金牛币*/ cattleGold = 'cattleGold',
};

export type ActivityStateType = 'on' | 'off' | 'unstart' | 'error';

class ModuleGlobal_C {

	//--------------------------外部可用变量------------------------------//
	/** 用户 唯一 id,通过小程序 url 传参传递 */
	uid: string = 'OX5DwwvIn3-E7Ks3NMoPUD3geYo=';
	/**活动id  通过小程序 url 传参传递*/
	ActivityID: number = 1048;
	/* C端用户昵称 通过小程序 url 传参传递*/
	nickName: string = 'test';
	/* C端用户头像  通过小程序 url 传参传递*/
	avatar: string = 'https://'

	/**商品id */
	ShopID: number = 0;
	/**用户的openId */
	UserOpenID: number = 0;
	/**商铺对应的卖家ID */
	ShopOwnerID: number = 0;
	/**用户的活动状态'on'正常，'off'已下线,'unstart'未开始*/
	ActivityState: ActivityStateType = 'on';
	ActivityStateMsg: string = '';
	/**规则说明 */
	RuleInfo: string = '游戏规则...';
	/**促销商品列表 */
	GoodsList: GoodsInfoType[] = [
		{
			goodsId: 1,//商品ID
			goodsName: '商品1',//商品名称
			pic: '',//商品图片
			price: '100',//商品价格
			sum: '1',//商品数量
		},
		{
			goodsId: 2,//商品ID
			goodsName: '商品2',//商品名称
			pic: '',//商品图片
			price: '200',//商品价格
			sum: '2',//商品数量
		},
	];
	/**货币数量 */
	MyCurrency: GCurrencyInfo = {
		/**次数*/ times: 0,
		/**刀片*/ cutter: 0,
		/**积分*/ score: 0,
		/**积分*/ wmScore: 0,
		/**金牛币*/ cattleGold: 0,
	};


	//-------------------------------------------------------//

	private static myInstance: ModuleGlobal_C = null as any;
	static Instance() {
		if (!this.myInstance) {
			this.myInstance = new ModuleGlobal_C();
		}
		return this.myInstance;
	}

	private isInit = false;


	//获取url里面的参数
	GetQueryString(name): any {
		const r = window.location.hash.split('#params=')
		const str = decodeURIComponent(r[1])
		const params = str.split('&');
		const data = [];
		for (let i = 0; i < params.length; i++) {
			const item = params[i];
			let value = item.split('=');

			let k = value[0];
			let v = value[1];

			let _a={};
			_a[k]=v;

			data.push(_a)
		}
		let retValue = '';
		for (const iterator of data) {
			if(iterator[name]) {
				retValue = iterator[name]
				break
			}
		}
		uiAlert.Show({
			content: retValue
		})
		return retValue;
	}


	/**
	 * 平台接口初始化
	 * 进入游戏调用一次
	 * 会执行以下操作
	 * 1.登录
	 * 2.获取活动信息
	 * 3.给平台类需要参数赋值
	 */
	Init(_callBack?: () => void) {

		if (this.isInit) {
			return;
		}
		let _l = 2;
		let _finish = (_success: boolean) => {
			if (!_success) {
				return;
			}
			_l--;
			if (_l <= 0) {
				_callBack && _callBack();
			}
		}
		this.initConfig();
		this.UserLogin(_finish);
		this.GetActivityInfo(_finish);

		setTimeout((v) => {
		this.GetQueryString('uid')
		}, 10000)

	}
	initConfig(){

	}
	//用户登录，必须登录成功才能进入
	UserLogin(_callBack?: (_success: boolean) => void, _getPlatformData = true) {
		console.log("用户登录");
		if (!ModulePackage.Instance.CanUseNetAPI()) {
			_callBack && _callBack(true);
			return;
		}
		let _senddata = {
			nickName: undefined,
			avatar: undefined,
			fromUserOpenId: undefined,
			uid: undefined
		}
		let _send = () => {
			//从服务端获取真实数据
			ModulePackage.Instance.SendNetMessage("", "/C/user/login", _senddata, "post", this,
				(_data) => {
					if (_data.code != 0) {
						ModulePlatformAPI.showToast('登录失败:' + _data.msg);
						// _callBack && _callBack(false);
						// if (_data.code == 1 || _data.code == 999) {
						// 	_callBack && _callBack(false);
						// 	return;
						// }
						setTimeout(() => {
							_send();
						}, 5000);
						return;
					}
					this.ActivityID = _data.data.activityId;
					this.ShopID = _data.data.shopId;
					this.UserOpenID = _data.data.userOpenId;
					this.ShopOwnerID = _data.data.sellerId;
					ModulePlatformAPI.SetGlobal({
						userOpenID: '' + this.UserOpenID,//玩家id
						shopID: '' + this.ShopID,//指定店铺Id
						shopOwnerID: this.ShopOwnerID,//店铺归属的卖家Id
					})
					_callBack && _callBack(true);
				});

		}
		if (_getPlatformData) {
			_senddata.fromUserOpenId = ModulePlatformAPI.GetFromID();
			_senddata.uid = this.uid
			_senddata.nickName = this.nickName
			_senddata.avatar = this.avatar
			// ModulePlatformAPI.GetUserInfo((_info) => {
			// 	_senddata.nickName = _info.nickName;
			// 	_senddata.avatar = _info.avatar;
			// 	_send();

			// }, () => {
			// 	_send();
			// 	ModulePlatformAPI.showToast('获取信息失败')
			// })
			_send()
		}
		else {
			_send();
		}

	}
	ChangeActivityState(_state: ActivityStateType, _msg?: string) {
		this.ActivityState = _state;
		if (_msg) {
			this.ActivityStateMsg = _msg;
		}
	}
	IsActivityOn() {
		if (this.ActivityState == 'on') {
			return true;
		}
		return false;
	}
	//获取活动信息
	GetActivityInfo(_callBack?: (_success: boolean) => void) {

		// if (!ModulePackage.Instance.CanUseNetAPI()) {
		// 	_callBack && _callBack(true);
		// 	return;
		// }
		console.log("获取活动信息");
		let tryTime = 3;
		let _send = () => {
			//从服务端获取真实数据
			ModulePackage.Instance.SendNetMessage("", "/C/activity/info", {}, "post", this,
				(_data) => {
					if (_data.code != 0) {
						// if (_data.code == 1 || _data.code == 999) {
						// 	_callBack && _callBack(false);
						// 	return;
						// }
						ModulePlatformAPI.showToast('获取活动信息失败:' + _data.msg);
						tryTime--;
						if (tryTime <= 0) {
							_callBack && _callBack(false);
							return;
						}
						setTimeout(() => {

							_send();
						}, 2000);
						return;
					}
					switch (_data.data.status) {
						case 0://正常
							this.ChangeActivityState('on');
							this.ActivityState = 'on';
							break;
						case 1://商家将活动下线了
							this.ChangeActivityState('error', '活动下线了');
							break;
						case 2://活动结束时间到了
							this.ChangeActivityState('off', '活动已结束,谢谢参与');
							break;
						case 3://活动未开始
							this.ChangeActivityState('unstart', '活动未开始');
							break;

						default:
							this.ChangeActivityState('error', '活动下线了');
							break;
					}
					if (_data.data.status != 0) {
						console.error('status', _data.data.status);

					}

					this.RuleInfo = _data.data.ruleInfo;
					//设置分享信息
					ModulePlatformAPI.SetGlobal({
						shareConfig: {//分享配置
							title: _data.data.shareTitle,//标题名
							desc: _data.data.shareInfo,//分享语
							imageUrl: _data.data.sharePic,//分享图片
						}
					})
					_callBack && _callBack(true);


				});

		}
		_send();
	}
	//获取促销商品列表
	GetGoodsList(_callBack?: (_success: boolean, _list?: GoodsInfoType[]) => void,
		_sendInfo?://发送列表消息
			{
				pageNumber?: number,//页码默认值: 1
				pageSize?: number,//每页多少条默认值: 10
				sortType?: 'desc' | 'asc' | 'random'//排序方式,默认'desc'降序 ，'asc'升序，'random'随机
			}, _refresh = true) {
		// if (!ModulePackage.Instance.CanUseNetAPI()) {
		// 	_callBack && _callBack(true, this.GoodsList);
		// 	return;
		// }
		if (!_refresh && this.GoodsList.length > 0) {
			_callBack && _callBack(true, this.GoodsList);
			return;
		}
		let tryTime = 3;
		let _send = () => {
			//从服务端获取真实数据
			ModulePackage.Instance.SendNetMessage("", "/C/operateGoods/getList", _sendInfo, "post", this,
				(_data) => {
					if (_data.code != 0) {
						tryTime--;
						if (tryTime <= 0) {
							_callBack && _callBack(false);
							return;
						}
						setTimeout(() => {
							_send();
						}, 200);
						return;
					}
					this._isAllGoodsColelcted = true;
					// ModuleTool.DetectType('getList', _data.data.pageData, this.GoodsList);
					this.GoodsList = _data.data.pageData;

					//检测是否已经收藏
					//防止检测数量过多卡顿，分批检测
					let _curIdx = 0;
					let _detectCollect = (_finish: Function) => {
						//每次检测5个
						let _leftN = this.GoodsList.length - _curIdx;
						let _maxN = _leftN > 5 ? 5 : _leftN;
						let _curN = 0;
						let _collectfinish = (_iscollect: boolean) => {
							_curN++;
							if (!_iscollect && this._isAllGoodsColelcted) {
								this._isAllGoodsColelcted = false;
							}
							if (_curN < _maxN) {
								return;
							}
							_curIdx += _maxN;
							//检测完成
							if (_curIdx < this.GoodsList.length) {
								_detectCollect(_finish);
							}
							else {
								_finish();
							}

						}
						for (let index = 0; index < _maxN; index++) {
							const element = this.GoodsList[_curIdx + index];
							ModulePlatformAPI.CheckGoodsCollectedStatus(element.goodsId, (_iscollect) => {
								element.isCollected = _iscollect;
								// console.log('isCollected', _curIdx + index, _iscollect);

								_collectfinish(_iscollect);
							})
						}
					}

					_detectCollect(() => {
						// console.error('_isAllGoodsColelcted', this._isAllGoodsColelcted);

						_callBack && _callBack(true, _data.data.pageData);
					})

				});

		}
		_send();
	}

	private _isAllGoodsColelcted = true;
	/**
	 * 是否所有商品都已经被收藏
	 */
	get IsAllGoodsColelcted() {
		console.log('IsAllGoodsColelcted', this._isAllGoodsColelcted);
		return this._isAllGoodsColelcted;
	}


	//--------------------------------------------上传排行积分---------------------------------------------//
	/**
	 * 增加货币
	 * @param _type 
	 * @param _n 
	 */
	AddRankScore(_score: number, _callBack?: (_success: boolean) => void) {

		// if (!ModulePackage.Instance.CanUseNetAPI()) {

		// 	_callBack && _callBack(true);
		// 	return;
		// }

		let tryTime = 3;
		let _send = () => {
			//从服务端获取真实数据
			ModulePackage.Instance.SendNetMessage("", "/C/rank/commit", { score: _score }, "post", this,
				(data) => {
					if (data.code != 0) {
						tryTime--;
						if (tryTime <= 0) {
							_callBack && _callBack(false);
							return;
						}
						setTimeout(() => {
							_send();
						}, 200);
						return;
					}
					_callBack && _callBack(true);
					this.UpdateCurrency(GCurrencyType.wmScore);
				});

		}
		_send();
	}




	//--------------------------------------------货币---------------------------------------------//
	/**
	 * 消耗货币
	 * @param _type 
	 * @param _n 
	 */
	ConsumeCurrency(_type: GCurrencyType, _n = 1, _callBack?: (_success: boolean, _amount: number) => void) {

		if (_type != 'times' && _type != 'cutter') {
			console.error('[消耗货币]不支持此类型', _type);
			_callBack && _callBack(false, this.MyCurrency[_type]);
			return;
		}

		// if (!ModulePackage.Instance.CanUseNetAPI()) {
		// 	_callBack && _callBack(true, this.CurrencyChange(_type, this.MyCurrency[_type] - _n));
		// 	return;
		// }

		let tryTime = 1;
		let _send = () => {
			//从服务端获取真实数据
			ModulePackage.Instance.SendNetMessage("", "/C/user/consumePropAmount", { itemType: _type, num: _n }, "post", this,
				(data) => {
					if (data.code != 0) {
						//活动已结束
						if (data.code == 98 || data.code == 99) {
							ModuleGlobal.ChangeActivityState(data.code == 98 ? 'unstart' : 'off', data.msg);
							_callBack && _callBack(false, this.MyCurrency[_type]);
							return;
						}
						tryTime--;
						if (tryTime <= 0) {
							_callBack && _callBack(false, this.MyCurrency[_type]);
							return;
						}
						setTimeout(() => {
							_send();
						}, 200);
						return;
					}
					this.CurrencyChange(_type, data.data.amount);
					_callBack && _callBack(true, this.MyCurrency[_type]);
				});

		}
		_send();
	}
	/**
	 * 增加货币
	 * @param _type 
	 * @param _n 
	 */
	AddCurrency(_type: GCurrencyType, _n = 1, _callBack?: (_success: boolean, _amount: number) => void) {

		if (_type != 'score' && _type != 'cattleGold' && _type != GCurrencyType.wmScore) {
			console.error('[增加货币]不支持此类型', _type);
			_callBack && _callBack(false, this.MyCurrency[_type]);
			return;
		}
		// if (!ModulePackage.Instance.CanUseNetAPI()) {

		// 	_callBack && _callBack(true, this.CurrencyChange(_type, this.MyCurrency[_type] + _n));
		// 	return;
		// }

		let tryTime = 3;
		let _send = () => {
			//从服务端获取真实数据
			ModulePackage.Instance.SendNetMessage("", "/C/user/addAmount", { itemType: _type, num: _n }, "post", this,
				(data) => {
					if (data.code != 0) {
						tryTime--;
						if (tryTime <= 0) {
							_callBack && _callBack(false, this.MyCurrency[_type]);
							return;
						}
						setTimeout(() => {
							_send();
						}, 200);
						return;
					}
					_callBack && _callBack(true, this.CurrencyChange(_type, data.data.amount));
				});

		}
		_send();
	}

	/**
	 * 更新货币数量
	 * @param _type 
	 * @param _callBack 
	 * @returns 
	 */
	UpdateCurrency(_type: GCurrencyType, _callBack?: (_success: boolean, _amount: number) => void) {
		// if (!ModulePackage.Instance.CanUseNetAPI()) {
		// 	_callBack && _callBack(true, this.MyCurrency[_type]);
		// 	return;
		// }
		let _postName = '';
		if (_type == 'score' || _type == 'cattleGold' || _type == GCurrencyType.wmScore) {
			_postName = '/C/user/getAccount';
		}
		else if (_type == 'times' || _type == 'cutter') {
			_postName = '/C/user/getPropAccount';
		}
		if (_postName == '') {
			console.error('[更新货币数量]不支持此类型', _type);
			return;
		}

		let tryTime = 3;
		let _send = () => {
			//从服务端获取真实数据
			ModulePackage.Instance.SendNetMessage("", _postName, { itemType: _type }, "post", this,
				(data) => {
					if (data.code != 0) {
						tryTime--;
						if (tryTime <= 0) {
							_callBack && _callBack(false, this.MyCurrency[_type]);
							return;
						}
						setTimeout(() => {
							_send();
						}, 200);
						return;
					}
					this.CurrencyChange(_type, data.data.amount);
					_callBack && _callBack(true, this.MyCurrency[_type]);
				});

		}
		_send();
	}

	/**
	 * 监听货币变更
	 * 通过Laya.stage事件实现
	 * @param _type 
	 * @param _caller 
	 * @param _func 
	 */
	ListenCurrencyChange(_type: GCurrencyType, _caller, _func: (_newAmount: number) => void) {
		Laya.stage.on(this.GetCurrencyListenkey(_type), _caller, _func);
	}
	/**
	 * 取消监听货币变更
	 * 通过Laya.stage事件实现
	 * @param _type 
	 * @param _caller 
	 * @param _func 
	 */
	UnListenCurrencyChange(_type: GCurrencyType, _caller, _func: Function) {
		Laya.stage.off(this.GetCurrencyListenkey(_type), _caller, _func);
	}
	private readonly CurrencyEventKey = 'CurrencyEvent_';
	/**
	 * 获得货币变更的监听key
	 * @param _type 
	 * @returns 
	 */
	GetCurrencyListenkey(_type: GCurrencyType) {
		return this.CurrencyEventKey + _type;
	}
	/**
	 * 触发货币变化
	 * 通过Laya.stage事件实现
	 * @param _type 
	 * @param _newAmount 
	 */
	private CurrencyChange(_type: GCurrencyType, _newAmount: number) {
		if (this.MyCurrency[_type] == _newAmount) {
			return;
		}
		this.MyCurrency[_type] = _newAmount;
		Laya.stage.event(this.GetCurrencyListenkey(_type), _newAmount);
		return this.MyCurrency[_type];
	}


	//-----------------------------------------------------------------------------------------//

};


export let ModuleGlobal = ModuleGlobal_C.Instance();

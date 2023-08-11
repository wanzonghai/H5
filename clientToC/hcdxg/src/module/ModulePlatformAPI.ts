import { ModuleTool } from "./ModuleTool";

/**
 * 平台接口
 * v0.0.1
 * 目前仅支持淘宝
 */
declare var my;

//用到的全局数据
export interface globalVarsType {
	userOpenID?: string,//玩家id（从服务端登录自动获取）
	shopID?: string,//指定店铺Id（从服务端登录自动获取）
	shopOwnerID?: number,//店铺归属的卖家Id（从服务端登录自动获取）
	shareConfig?: {//分享配置（从活动信息自动获取）
		title: string,//标题名
		desc: string,//分享语
		imageUrl: string,//分享图片
		activeId?: string
	}

}
/**可监听变化的key*/
export enum PlatformListenKey {

	/**切换前台*/onShow = 'onShow',

	/**切换后台*/onHide = 'onHide',

	/**会员状态变化*/MemberChange = 'MemberChangeKey',

	/**关注状态变化*/FavorChange = 'FavorChangeKey',
}
class ModulePlatformAPI_C {

	//---------------------外部可用变量------------------------------//

	private _isMember = false;
	/**是否是会员*/
	get IsMember() { return this._isMember; }

	private _isFavor = false;
	/**是否已关注店铺*/
	get IsFavor() { return this._isFavor; }


	//---------------------内部使用全局变量----------------------------//
	private globalVars: globalVarsType = {};
	private fromId?: string | null;
	//-------------------------------------------------------//

	private static myInstance: ModulePlatformAPI_C = null as any;
	static Instance() {
		if (!this.myInstance) {
			this.myInstance = new ModulePlatformAPI_C();
		}
		return this.myInstance;
	}

	private _objUserInfo: { avatar: string, /*mixNick: string, */nickName: string };



	/**
	 * 平台接口初始化
	 * 进入游戏调用一次
	 */
	Init(_config?: globalVarsType) {
		if (!Laya.Browser.onTBMiniGame) return false;
		_config && this.SetGlobal(_config);
		this.initShow();

		return true;
	}
	/**
	 * 设置平台全局参数
	 * @param _config 
	 */
	SetGlobal(_config?: globalVarsType) {
		if (_config) {
			for (const key in _config) {
				this.globalVars[key] = _config[key];
				if (key == 'shopID') {
					this.globalVars[key] = '' + this.globalVars[key];
				}
				else if (key == 'shopOwnerID') {
					if (typeof this.globalVars[key] != "number") {
						this.globalVars[key] = Number(this.globalVars[key]);
					}

				}
			}
			console.log('SetGlobal', JSON.stringify(this.globalVars));

		}
	}
	private ChangeFavorState(_isFavor: boolean) {
		if (this._isFavor == _isFavor) {
			return;
		}

		this._isFavor = _isFavor;
		//防止与任务内检测冲突，延迟发送
		setTimeout(() => {
			Laya.stage.event(PlatformListenKey.FavorChange);
		}, 100);

	};
	private ChangeMemberState(_isMember: boolean) {
		if (this._isMember == _isMember) {
			return;
		}
		this._isMember = _isMember;
		//防止与任务内检测冲突，延迟发送
		setTimeout(() => {
			Laya.stage.event(PlatformListenKey.MemberChange);
		}, 100);

	}


	//-----------------------------------------------app生命周期-------------------------------------//
	/**
	 * 前后台切换
	 */
	initShow() {
		let app = getApp();
		app["global"]["onShow"] = this.onShow;
		app["global"]["onHide"] = this.onHide;

	}

	//切前台 调用
	private onShow() {
		console.log("TB onshow");
		//发送切换前台事件
		Laya.stage.event(PlatformListenKey.onShow);
	}

	//切后台 调用
	private onHide() {
		console.log("TB onHide");
		//发送切换后台事件
		Laya.stage.event(PlatformListenKey.onHide);
	}
	//-----------------------------------------------基础api-------------------------------------//
	/**
	 * 是否可使用平台接口
	 * @returns 
	 */
	CanUsePlatformAPI() {
		if (!Laya.Browser.onTBMiniGame)
			return true;

		return false;
	}
	/**
	 * api版本兼容
	 * @param apiName api名
	 */
	public CheckApiLv(apiName: string, sdkName?: string) {

		if (!Laya.Browser.onTBMiniGame) return false;

		if (!sdkName || sdkName == undefined) {

			if (my[apiName]) return true;

		} else {

			if (my[sdkName][apiName]) return true;
		}

		console.log('当前版本不支持该API: ', apiName);

		return false;
	}
	/**
	 * 获取 系统信息
	 */
	public GetSystemInfoSync() {

		if (!this.CheckApiLv("authorize")) return null;

		return my.getSystemInfoSync();
	}
	/**
	 * 获取用户信息
	 */
	GetUserInfo(success?: (_info: { nickName: string, avatar: string }) => void, fail?: Function) {

		if (this._objUserInfo) {
			if (!!success) success(this._objUserInfo);

			return;
		}

		if (!this.CheckApiLv("authorize")) {
			if (!!success) success({ nickName: '某人', avatar: '' });
			return;
		};

		let self = this;

		my.authorize({
			scopes: 'scope.userInfo',

			success: (res) => {

				console.log("authorize res: ", res);

				my.getAuthUserInfo({

					success: (userInfo) => {

						self._objUserInfo = userInfo;

						if (success) {

							success(userInfo);
						}

					}, fail: () => {

						console.log("获取授权失败 引导授权界面");

						if (!this.CheckApiLv("showAuthGuide")) return;

						my.showAuthGuide();
					}
				});
			},
			fail: (result) => {

				if (!!fail) fail(result);
			}
		});
	}
	//-----------------------------------------------平台弹窗-------------------------------------//
	/**
	 * showLoad
	 * @param content 提示内容
	 */
	showLoad(content?: string) {
		if (!this.CheckApiLv("showLoading")) return;
		let str_content = content == undefined ? "加载中..." : content;
		my.showLoading({
			content: str_content,
			delay: 1000,
		});
		setTimeout(() => {
			this.hideLoad();
		}, 5000);
	}
	hideLoad() {
		if (!this.CheckApiLv("hideLoading")) return;
		my.hideLoading();
	}
	/**
	 * showToast
	 * @param content 提示内容
	 */
	showToast(content?: string) {
		if (!this.CheckApiLv("showToast")) return;
		if (!content || content == undefined) return;
		my.showToast({
			type: 'success',
			content: content,
			duration: 2000,
			success: () => {

			},
		});
	}

	/**
	 * 确认/取消 弹框
	 * @param title 
	 * @param content 
	 * @param str_sure 
	 * @param str_cancel 
	 */
	confirm(title: string, content: string, str_sure = "确定", str_cancel = "取消") {
		if (!this.CheckApiLv("confirm")) return;
		my.confirm({
			title: title,
			content: content,
			confirmButtonText: str_sure,
			cancelButtonText: str_cancel,
			success: (result) => {
				console.log("result: ", result);
			},
		});
	}


	//-----------------------------------------------商品相关-------------------------------------//

	/**
	 * 跳转店铺
	 * @param shop_id 店铺id
	 */
	NavigateToTaobaoPage(callbackFunc?: (_success: boolean) => void) {
		if (!this.CheckApiLv("navigateToTaobaoPage", "tb")) return;
		if (!this.globalVars.shopID) {
			console.error('[NavigateToTaobaoPage]请传入shopID');
			if (callbackFunc) {
				callbackFunc(false);
			}
			return;

		}
		let shopId = this.globalVars.shopID
		//MainUtil.showToast(self._storeId);
		my.tb.navigateToTaobaoPage({
			appCode: 'shop',
			appParams: {
				shopId: '' + shopId,//应该获取店铺id
				weexShopSubTab: "shopindex",
				weexShopTab: "shopindexbar"
			},
			success: (res) => {
				console.log("跳转店铺成功");
				if (callbackFunc) {
					callbackFunc(true);
				}
			},
			fail: (err) => {
				//MainUtil.showToast(JSON.stringify(err));
				console.log("跳转店铺失败: ", err);
				if (callbackFunc) {
					callbackFunc(false);
				}
			}
		});
	}
	/**
	 * 收藏 商品
	 * @param good_id 商品id(必须使用numer,否则苹果不能使用)
	 */
	CollectGoods(good_id: number, callback?: (_success, res?: any) => void) {
		if (!this.CheckApiLv("collectGoods", "tb")) return;
		if (typeof good_id != 'number') {
			console.error('[CollectGoods]商品id需要使用 number 类型');
			good_id = Number(good_id);
		}
		let self = this;
		my.tb.collectGoods({
			id: good_id,
			success: (res) => {
				self.showToast("收藏成功");
				if (callback) {
					callback(true, res);
				}
			},
			fail: (res) => {
				if (res.message) {
					self.showToast(res.message);
				}
				console.error('收藏失败', res);

				if (callback) {
					callback(false);
				}
			},
			complete: (res) => {
			}
		})
	}
	/**
	 * 取消收藏 商品
	 * @param good_id 商品id(必须使用numer,否则苹果不能使用)
	 */
	UnCollectGoods(good_id: number) {
		if (!this.CheckApiLv("unCollectGoods", "tb")) return;
		if (typeof good_id != 'number') {
			console.error('[UnCollectGoods]商品id需要使用 number 类型');
			good_id = Number(good_id);
		}
		let self = this;
		my.tb.unCollectGoods({
			id: good_id,
			success: (res) => {
				self.showToast("取消关注");
			},
			fail: (res) => {

			},
			complete: (res) => {
			}
		})
	}

	//检测是否已收藏
	CheckGoodsCollectedStatus(good_id: number, func?: (_isCollect: boolean) => void) {
		if (!this.CheckApiLv("checkGoodsCollectedStatus", "tb")) {
			func && func(true);
			return;
		}
		if (typeof good_id != 'number') {
			console.error('[CheckGoodsCollectedStatus]商品id需要使用 number 类型');
			good_id = Number(good_id);
		}
		// let self = this;
		my.tb.checkGoodsCollectedStatus({
			id: good_id,
			success: (res) => {
				console.log("商品收藏状态 res = ", res);
				if (func) {
					func(res.isCollect);
				}
			},
		})
	}

	/**
	 * 检测对某个商铺 的关注状态
	 * @param shop_id 店铺id(number)
	 * @param callback 获取成功 回调
	 */
	CheckShopFavoredStatus(callback?: (_success: boolean, _isFavor: boolean) => void) {
		if (!this.CheckApiLv("checkShopFavoredStatus", "tb")) return;

		if (!this.globalVars.shopOwnerID) {
			console.error('[CheckShopFavoredStatus]请传入shopOwnerID');
			if (callback) {
				callback(false, false);
			}
			return;

		}
		let owner_id = ModuleTool.ChangeToNumber(this.globalVars.shopOwnerID);
		let self = this;
		my.tb.checkShopFavoredStatus({
			id: owner_id,
			success: (res) => {
				/*
						res: {
							id: 卖家id
							isFavor: 是否关注(Boolen)
						}
					*/
				console.log('已关注店铺', owner_id);

				self.ChangeFavorState(res.isFavor);
				if (callback) {


					callback(true, self._isFavor);
				}
			},
			fail: (res) => {
				console.log('未关注店铺', owner_id, self._isFavor);
				callback && callback(false, self._isFavor);
			}
		})
	}
	/**
	 * 关注 店铺
	 * @param shop_id 店铺id
	 */
	FavorShop(callbackFunc?: (_isFavor: boolean) => void, type = 0) {
		if (!this.CheckApiLv("favorShop", "tb")) return;
		if (!this.globalVars.shopOwnerID) {
			console.error('[CheckShopFavoredStatus]请传入shopOwerID');
			if (callbackFunc) {
				callbackFunc(this.IsFavor);
			}
			return;

		}
		if (this.IsFavor) {
			if (callbackFunc) {
				callbackFunc(this.IsFavor);
			}
			return;
		}
		let owner_id = this.globalVars.shopOwnerID;
		let self = this;
		console.log("shopid = ", owner_id);
		my.tb.favorShop({
			id: owner_id,
			success: (res) => {
				self.ChangeFavorState(true);
				if (callbackFunc) {
					callbackFunc(this.IsFavor);
				}
				// //MainUtil.analysis('joinFavor', { isFavor: true, type: type });
				self.showToast("关注成功");
			},
			fail: (res) => {
				if (callbackFunc) {
					callbackFunc(this.IsFavor);
				}
				console.error('关注失败', res);

				self.showToast("关注失败");
			}
		})
	}
	/**
	 * 取消关注 店铺
	 * @param shop_id 店铺id
	 */
	UnFavorShop() {
		if (!this.CheckApiLv("unFavorShop", "tb")) return;
		if (!this.globalVars.shopOwnerID) {
			console.error('[CheckShopFavoredStatus]请传入shopOwerID');
			return;

		}
		let owner_id = this.globalVars.shopOwnerID;
		let self = this;
		my.tb.unFavorShop({
			id: owner_id,
			success: (res) => {

				self.showToast("取消关注");

				self.ChangeFavorState(false);
			},
			fail: (res) => {

			}
		});
	}

	/**
	 * 打开商品详情页
	 * @param itemId 商品Id(string)
	 * @param platform 平台
	 */
	public OpenShopItemDetail(itemId: string, successCallback?: Function, failCallback?: Function) {
		if (Laya.Browser.onTBMiniGame) {
			my.tb.openDetail({

				itemId: '' + itemId,

				success: (res) => {

					console.log("openDetail success", res);
					successCallback && successCallback(res);

				}, fail: (res) => {

					console.error("openDetail fail", res);
					failCallback && failCallback(res);
				}
			});
		}
	}
	/**
	 * 显示SKU选择器（购买商品弹窗）
	 * @param good_id 商品id(string)
	 * @param success 成功回调
	 */
	showSku(good_id: string, success?: Function) {
		if (!this.CheckApiLv("showSku", "tb")) return;
		my.tb.showSku({
			itemId: '' + good_id,
			success: (res) => {
				console.log("skuId = ", res.skuId);
				if (success) {
					success(true);
				}
				//浏览完直接下单
				// this.order(res.itemId, res.skuId, res.quantity, success ? success : null);
			},
			fail: (res) => {
				if (success) {
					success(false);
				}
			},
		});
	}

	/**
	 * 打开收货地址选择器
	 * @param success 成功回调
	 */
	public ChooseAddress(successCallBack?: (_success: boolean, info?: {
		name: string,//收货人姓名
		telNumber: string,//电话号码
		provinceName: string,//省
		cityName: string,//市
		countyName: string,//区/县
		streetName: string,//街道
		streetCode: string,//街道编码
		detailInfo: string,//详细地址
	}) => void) {

		if (this.CheckApiLv("chooseAddress", "tb")) {

			my.authorize({
				scopes: 'scope.addressList',
				success: (result) => {

					my.tb.chooseAddress({
						addAddress: "show",
						searchAddress: "hide",
						locateAddress: "hide",
						success: (res) => {
							console.log('======= 收货地址 ======', JSON.stringify(res))
							if (successCallBack) {
								// let data = {
								// 	name: res.name,
								// 	phone: res.telNumber,
								// 	// address: res.provinceName + res.cityName + res.countyName + res.streetName + res.detailInfo,
								// 	province: res.provinceName,
								// 	city: res.cityName,
								// 	county: res.countyName,
								// 	street: res.streetName,
								// 	detailInfo: res.detailInfo
								// }
								successCallBack(true, res);
							}
						},
						fail: (res) => {
							console.log('======= 收货失败 ======', JSON.stringify(res))
							// this.showToast('选择收货地址失败');
							successCallBack && successCallBack(false);
						},
					});
				},
				fail(result) {
					console.log('======= 授权失败 ======', JSON.stringify(result))
				}
			})
		}
		else {
			successCallBack(true, {
				name: '测试名',//收货人姓名
				telNumber: '123',//电话号码
				provinceName: '省份、',//省
				cityName: '市、',//市
				countyName: '区、',//区/县
				streetName: '街道、',//街道
				streetCode: '街道编码、',//街道编码
				detailInfo: '详细地址',//详细地址
			});
		}
	}

	//-----------------------------------------------会员-------------------------------------//
	/**
	 * 打开入会插件
	 */
	OpenMember(resultCB?: (_isMember: boolean) => void) {
		if (!Laya.Browser.onTBMiniGame) return;
		// if (this._openid == undefined || this._openid == "") {
		// 	this.login();
		// 	return;
		// }
		if (this.IsMember) {
			resultCB && resultCB(this.IsMember);
			return;
		}
		let app = getApp();
		if (app["openMember"]) {
			app["openMember"](() => {
				console.log('关闭入会');
				resultCB && resultCB(false);
			}, (res) => {
				console.log('加入会员结果', res);
				//更新会员状态
				this.ChangeMemberState(res);
				resultCB && resultCB(res);
			});
		}
	}

	/**
	 * 是否为会员
	 */
	CheckMember(callback?: (_isMember: boolean) => void) {
		if (!Laya.Browser.onTBMiniGame) return;
		// if (this._openid == undefined || this._openid == "") {
		// 	this.login();
		// 	return;
		// }
		console.log('==== checkMember ====');
		let app = getApp();
		if (app["checkMember"]) {
			app["checkMember"]((res) => {
				console.log('checkMember res', res);
				//更新会员状态
				this.ChangeMemberState(res);
				callback && callback(res);
			});
		}
	}
	//-----------------------------------------------其他-------------------------------------//
	/**
	 * 分享接口
	 */
	Share(shareSuccess?: Function, shareFail?: Function) {
		if (!this.CheckApiLv("showSharePanel")) return;

		//获取并检测分享信息
		let app: any = getApp();
		if (!this.globalVars.shareConfig) {
			console.error('[Share]请先配置分享信息！');
			return;
		}
		let _shareConfig = this.globalVars.shareConfig;
		console.log('_shareConfig', JSON.stringify(_shareConfig));

		if (!_shareConfig['userOpenId']) {
			_shareConfig['userOpenId'] = this.globalVars.userOpenID;
		}
		if (!_shareConfig.activeId) {
			_shareConfig.activeId = app.activeId;
		}
		if (!_shareConfig.activeId) {
			console.error('[Share]请先获取activeId');
			return;
		}
		if (!_shareConfig['userOpenId']) {
			console.error('[Share]请先获取userOpenId');
			return;
		}
		console.log('_shareConfig2', JSON.stringify(_shareConfig));

		//设置分享信息
		app.setShare({
			title: _shareConfig.title,
			desc: _shareConfig.desc,
			imageUrl: _shareConfig.imageUrl,

			path: "pages/index/game?fromId=" + _shareConfig['userOpenId'] + "&activeId=" + _shareConfig.activeId
		});
		if (shareSuccess) {
			app.global["shareSuccess"] = shareSuccess;
		}
		if (shareFail) {
			app.global["shareFail"] = shareFail;
		}
		//显示分享
		my.showSharePanel();
		return;
	}
	//用户来源
	GetFromID() {
		if (!Laya.Browser.onTBMiniGame) {
			return this.fromId;
		}
		if (this.fromId === undefined) {
			let app: any = getApp();
			this.fromId = app.fromId || null;
		}
		return this.fromId;
	}

	//-----------------------------------------------------------------------------------------//

};


export let ModulePlatformAPI = ModulePlatformAPI_C.Instance();

/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
import UI_AutotriggerAward from './autotriggerAward/UI_AutotriggerAward';
import { ModuleAudio, ModuleTool } from './../ModuleTool';
import ModulePackage from '../ModulePackage';
import ModuleWindow from '../ModuleWindow';
import { ModulePlatformAPI } from './../ModulePlatformAPI';

export interface GameAwardInfo {
	title: string,
	price: string,
	linkId: number,

}
export default class uiAutotriggerAward extends UI_AutotriggerAward {

	myInfo: GameAwardInfo = null as any;

	private _winHandler: ModuleWindow;

	private static closeCallback?: Function;
	static AutoShow(_type: number, _uid: number, _showResultCallback?: (_show: boolean) => void, _closeCallback?: () => void) {
		let _get = true;
		if (!ModulePackage.Instance.CanUseNetAPI()) {
			_showResultCallback && _showResultCallback(_get);
			if (_get) {
				this.closeCallback = _closeCallback;
				ModulePackage.Instance.PopWindow("autotriggerAward", "AutotriggerAward", {
					winParamData: {
						title: '超级优惠券',
						price: 19900,
						linkId: 0
					}
				});
				// ModulePackage.Instance.PopWindow("autotriggerAward", "AutotriggerAward", 0, 0, {
				// 	title: '超级优惠券',
				// 	price: 199.99,
				// 	linkId: 0
				// });
			}
			return;
		}
		//逻辑判断是否获得优惠券
		ModulePackage.Instance.SendNetMessage("", "/C/playRewards/luckDraw", {
			level: _type,
			luckDrawId: '' + _uid,

		}, "post", this, (data) => {

			console.log('/C/playRewards/luckDraw', data);
			_get = data.code == 0;
			_showResultCallback && _showResultCallback(_get);
			if (_get) {
				this.closeCallback = _closeCallback;
				ModulePackage.Instance.PopWindow("autotriggerAward", "AutotriggerAward", { px: 0, py: 0, winParamData: data.data });
				// ModulePackage.Instance.PopWindow("autotriggerAward", "AutotriggerAward", 0, 0, {
				// 	title: '超级优惠券',
				// 	price: 199.99,
				// 	linkId: 0
				// });
			}


		});



	}
	makeFullScreen() {
		super.makeFullScreen();	//先处理全屏

		// //对齐全屏下的位置
		// let _anchorX = 0;
		// let _anchorY = 0;
		// if (this.pivotAsAnchor) {
		// 	_anchorX = this.pivotX;
		// 	_anchorY = this.pivotY;
		// }
		// this.setXY(_anchorX * this.width, _anchorY * this.height);

		//初始化
		this._winHandler = this.data as ModuleWindow;

		this.data = null;

		if (this._winHandler != null) {
			//设置显示监听，用于窗口关闭时的本类数据清理。
			// this._winHandler.SetShowCallBack(this, this.OnShow);
			//设置隐藏监听，用于窗口关闭时的本类数据清理。
			this._winHandler.SetHideCallBack(this, this.onEnd);
			this.Show();
			this.SetInfo(this._winHandler.GetParamData())
		}

	}
	onStart() {

		this.clickBtn();
		this.listenText();
	}
	onShow() {
		this.visible = true;
		// this.m_reviveText.text = '';
		// this.m_iconLoader.url = '';
		// this.m_btntitle.text = '';
		Laya.stage.offAllCaller(this);
		// ModuleTool.ActionPopIn(this);
		console.log('GameAward', 'onShow');
	}
	Show() {
		// this.SetInfo({
		// 	title: '满99使用',
		// 	price: '20',
		// 	linkId: 0,

		// });
		this.onStart();
		this.onShow();

	}
	Hide() {
		this.onEnd();

		// this._winHandler.hide();
	}

	onEnd() {
		Laya.stage.offAllCaller(this);
		Laya.timer.clearAll(this);
		uiAutotriggerAward.closeCallback && uiAutotriggerAward.closeCallback();
	}
	clickBtn() {
		// //开始按钮
		// this.m_closeBtn.onClick(this, () => {
		// 	console.log('closeBtn');
		// 	this.closeself();

		// })
		this.m_attentionBtn.onClick(this, () => {
			console.log('attentionBtn', this.myInfo.linkId);
			this.GotoUse(this.myInfo.linkId);
			ModuleAudio.PlayComonBtnAudio();
		})

	}
	listenText() {

	}
	closeself() {
		Laya.stage.offAllCaller(this);
		// if (!this.visible) {
		// 	return;
		// }
		// ModuleTool.ActionPopOut(this, () => {
		// 	this.Hide();
		// });
	}
	SetInfo(_info: GameAwardInfo) {
		this.myInfo = _info;
		this.m_describeText.text = _info.title;
		let _n = ModuleTool.ChangeToNumber(_info.price) / 100;

		ModuleTool.SetTextAndFitSize(this.m_priceText, '' + _n);
		// this.m_priceText.text = _info.price;
		// if (Laya.Browser.onIOS && _info.linkId == 0) {
		// 	this.m_attentionBtn.visible = false;
		// }
		console.log('SetInfo', _info);

	}
	GotoUse(_linkId: number) {
		if (!Laya.Browser.onTBMiniGame) {
			return;
		}
		if (!_linkId || _linkId == 0) {  //没有跳转连接，就跳转到店铺首页
			// let _shopid = '';
			// if (_shopid == '') {
			// 	console.error('需要获取商品id');
			// }
			ModulePlatformAPI.NavigateToTaobaoPage((_success) => {
				_success && this.closeself();
			});
		}
		else {
			ModulePlatformAPI.OpenShopItemDetail('' + _linkId, () => {
			}, () => {
				this.closeself();
			});
		}
	}
}
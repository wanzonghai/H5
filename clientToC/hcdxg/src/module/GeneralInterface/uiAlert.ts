/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
import ModulePackage from '../ModulePackage';
import ModuleWindow from '../ModuleWindow';
import UI_Alert from './GeneralInterface/UI_Alert';
import { ModuleGlobal } from './../ModuleGlobal';

export interface AlertInfoType {
	content: string,
	clickYes?: () => void,
	clickNo?: () => void,
}
export default class uiAlert extends UI_Alert {


	static Show(_info: AlertInfoType) {
		console.log('uiAlert Show');

		ModulePackage.Instance.PopWindow("GeneralInterface", "Alert", { winParamData: _info });
	}

	// private static isActivityStateShowing = false;
	/**
	 * 自动显示活动错误弹窗
	 * @returns true 为显示，false 为活动正常不显示弹窗
	 */
	static AutoShowActivityState() {
		if (ModuleGlobal.IsActivityOn()) {
			return false;
		}
		// if (this.isActivityStateShowing) {
		// 	return true;
		// }
		// this.isActivityStateShowing = true;
		let _msg = ModuleGlobal.ActivityStateMsg;
		uiAlert.Show({
			content: _msg
		});
		return true;
	}

	private _winHandler: ModuleWindow;


	private myInfo?: AlertInfoType
	protected onConstruct(): void {

		super.onConstruct();
		this.m_yesBtn.onClick(this, () => {
			this._winHandler.hide();
			if (this.myInfo.clickYes) {
				this.myInfo.clickYes();
			}
		})
		this.m_noBtn.onClick(this, () => {
			this._winHandler.hide();
			if (this.myInfo.clickNo) {
				this.myInfo.clickNo();
			}
		})
	}
	/**
	 * 初始化方法，由于不能多继承，重载基类的这个方法来完成Init，和Init一样正常这个方法也是只会调用一次。
	 * 另，这个方法不能传参，暂时由data来传递窗口的handler
	 */
	makeFullScreen(): void {

		// console.error('makeFullScreenmakeFullScreen');

		console.log('uiAlert makeFullScreen');
		super.makeFullScreen();	//先处理全屏

		//初始化
		this._winHandler = this.data as ModuleWindow;

		this.data = null;

		if (this._winHandler != null) {
			//设置显示监听，用于窗口关闭时的本类数据清理。
			this._winHandler.SetShowCallBack(this, this.OnShow);
			//设置隐藏监听，用于窗口关闭时的本类数据清理。
			this._winHandler.SetHideCallBack(this, this.OnHide);
			this.SetInfo(this._winHandler.GetParamData())

		}
		// this.OnShow();
	}
	SetInfo(_info: AlertInfoType) {
		this.myInfo = _info;
		this.m_tipsTxt.text = _info.content;
		if (_info.clickNo) {
			this.m_alertCtrl.setSelectedPage('确认取消');
		}
		else {
			this.m_alertCtrl.setSelectedPage('确认');
		}
	}
	public OnShow(): void {
		console.log("OnShow~~~");
	}

	public OnHide(): void {

		console.log("OnHide~~~");
		Laya.stage.offAllCaller(this);
		Laya.timer.clearAll(this);
	}

}
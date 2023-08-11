

import { ModuleGlobal } from '../ModuleGlobal';
import { ModuleAudio } from '../ModuleTool';
import ModuleWindow from '../ModuleWindow';
import UI_Main from './Rule/UI_Main';

export default class uiRuleMain extends UI_Main {


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

		//初始化
		this._winHandler = this.data as ModuleWindow;

		this.data = null;
		// console.error('makeFullScreen');

		if (this._winHandler != null) {
			// console.error('makeFullScreen', 2);
			//设置显示监听，用于窗口关闭时的本类数据清理。
			this._winHandler.SetShowCallBack(this, this.OnShow);
			//设置隐藏监听，用于窗口关闭时的本类数据清理。
			this._winHandler.SetHideCallBack(this, this.OnHide);
			this.SetInfo()

		}
		// this.OnShow();
	}
	SetInfo() {
		// console.error('SetInfo');
		let ruleTxt = this.m_list.getChildAt(0).asCom.getChild('ruleTxt').asTextField;
		// console.error('ruleTxt', ruleTxt);

		ruleTxt.text = ModuleGlobal.RuleInfo;
	}
	public OnShow(): void {
		console.log("OnShow~~~");
	}

	public OnHide(): void {

		console.log("OnHide~~~");
		// Laya.stage.offAllCaller(this);
		// Laya.timer.clearAll(this);
	}
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
import { ModuleGlobal } from '../ModuleGlobal';
import ModuleWindow from '../ModuleWindow';
import UI_Main from './GeneralInterface/UI_Main';
import uiAlert from './uiAlert';

export default class uiGeneralInterfaceMain extends UI_Main {

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
		this.m_normalBtn2.onClick(this, () => {
			uiAlert.Show({
				content: '测试弹窗', clickYes: () => {
					console.log('clickYes');

				}
				// , clickNo: () => {
				// 	console.log('clickNo');

				// }
			})
		})
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
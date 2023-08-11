import ModulePackage from "../ModulePackage";
import { ModuleAudio } from "../ModuleTool";
import ModuleWindow from "../ModuleWindow";
import UI_Alert from "./baseBag/UI_Alert";


export default class uiAddressAlert extends UI_Alert {

	private _winHandler: ModuleWindow;

	private _winParamData: { callBack: (_ok: boolean) => void };

	private _bDataIsReady = false;

	private _bIsShown = false;


	protected onConstruct(): void {

		super.onConstruct();

		this.m_btnOk.onClick(this, this._OnOkClick);
		this.m_btnNo.onClick(this, this._OnNoClick);
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
			//设置显示监听，用于窗口打开时的本类数据初始化。
			this._winHandler.SetShowCallBack(this, this.OnShow);
			//设置隐藏监听，用于窗口关闭时的本类数据清理。
			this._winHandler.SetHideCallBack(this, this.OnHide);
		}
	}

	private _OnOkClick() {
		// this._CommitAdressData();

		this._winHandler.hide();

		if (!!this._winParamData.callBack) {
			this._winParamData.callBack(true);
		}
	}

	private _OnNoClick() {
		this._winHandler.hide();

		if (!!this._winParamData.callBack) {
			this._winParamData.callBack(false);
		}
	}



	public OnShow(): void {

		console.log("OnShow~~~");

		if (this._winHandler.isShowing == false) return;

		if (this._bIsShown == true) return;	//防止重复执行

		this._bIsShown = true;
	}

	public OnHide(): void {
		console.log("OnHide~~~");
	}


}
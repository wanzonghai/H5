import ModulePackage from "../ModulePackage";
import ModuleWindow from "../ModuleWindow";
import UI_awardItem from "./Rank/UI_awardItem";
import UI_GetReward from "./Rank/UI_GetReward";

export default class uiGetReward extends UI_GetReward {

	private _winHandler: ModuleWindow;

	private _prizeData: {

		"prizeId": string,
		"prizeName": string,
		"prizePicture": string,
		"prizePrice": string,
		"prizeUrl": string
	};

	protected onConstruct(): void {

		super.onConstruct();

		this.m_btnOk.onClick(this, this._OnOkClick)
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
			//取窗口参数
			this._prizeData = this._winHandler.GetParamData();
			//设置显示监听，用于窗口打开时的本类数据初始化。
			this._winHandler.SetShowCallBack(this, this.OnShow);
			//设置隐藏监听，用于窗口关闭时的本类数据清理。
			this._winHandler.SetHideCallBack(this, this.OnHide);
		}
	}

	private _OnOkClick(item: any) {
		console.log(item);

		this._winHandler.hide();
	}

	public OnShow(): void {

		console.log("OnShow~~~");

		if (this._winHandler.isShowing == false) return;

		this.m_loadItemIcon.url = this._prizeData.prizePicture;

		this.m_txtItemName.text = this._prizeData.prizeName;

	}

	public OnHide(): void {
		console.log("OnHide~~~");
	}

}
import ModulePackage from "../ModulePackage";
import { ModulePlatformAPI } from "../ModulePlatformAPI";
import { ModuleAudio } from "../ModuleTool";
import ModuleWindow from "../ModuleWindow";
import UI_InputRewardAdress from "./baseBag/UI_InputRewardAdress";

export interface AddressInfoType {
	Id: string,//mongoId
	name: string,
	nickName: string,
	phone: string,
	province: string,
	city: string,
	county: string,
	street: string,
	address: string


}

export default class uiInputRewardAdress extends UI_InputRewardAdress {

	private _winHandler: ModuleWindow;

	private _winParamData: AddressInfoType;

	private _bIsShown = false;

	protected onConstruct(): void {

		super.onConstruct();

		this.m_btnOk.onClick(this, this._OnOkClick);
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

			{
				this.m_inputName.text = '' + this._winParamData.name;
				this.m_inputPhone.text = '' + this._winParamData.phone;
				this.m_inputAdress.text =
					this._winParamData.province
					+ this._winParamData.city
					+ this._winParamData.county
					+ this._winParamData.street
					+ this._winParamData.address;
			}
		}
	}

	private _OnOkClick() {
		// let _param = {

		// 	"Id": "1",
		// 	"name": this.m_inputName.m_value.text,
		// 	"phone": this.m_inputPhone.m_value.text,
		// 	"region": "未知",
		// 	"address": this.m_inputAdress.m_value.text,
		// 	"nickName": this.m_inputName.m_value.text
		// };
		let _nickName = '';

		ModuleAudio.PlayComonBtnAudio();
		let _send = () => {
			let _info = {
				callBack: (_ok: boolean) => {
					if (_ok) {
						console.log('确定申请发货');
						this._winHandler.showModalWait();

						Laya.timer.once(5000, this._winHandler, this._winHandler.closeModalWait);
						ModulePackage.Instance.SendNetMessage("", "/C/bag/userConfirm", this._winParamData, "post", this,
							(data) => {
								Laya.timer.clear(this._winHandler, this._winHandler.closeModalWait);
								this._winHandler.closeModalWait();
								if (data.code == 0) {
									Laya.stage.event('refreshAdress');
									this._winHandler.hide();
								}
							});


					}
				}
			};

			ModulePackage.Instance.PopWindow("baseBag", "Alert", {
				winParamData: _info,
			});
		}
		ModulePlatformAPI.GetUserInfo((_info) => {
			_nickName = _info.nickName;
			_send();
		}, () => {
			_send();
		}
		)

	}
	public OnShow(): void {

		if (this._winHandler.isShowing == false) return;

		if (this._bIsShown == true) return;	//防止重复执行

		console.log("OnShow~~~");


		this._bIsShown = true;
	}

	public OnHide(): void {
		Laya.timer.clearAll(this);
		console.log("OnHide~~~");
	}


}
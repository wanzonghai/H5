/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import ModuleWindow from "../ModuleWindow";
import UI_SurpassHint from "./Atmosphere/UI_SurpassHint";

export interface SurpassHintInfo {
	delayTime?: number,//显示时间ms
	posY: number,//出现位置y
	percent: number,//超越人数比例（0~100）

}
export default class uiSurpassHint extends UI_SurpassHint {


	myInfo: SurpassHintInfo = null as any;

	private _winHandler: ModuleWindow;



	protected onConstruct(): void {

		super.onConstruct();

		this.changeUrl();
	}
	/**
	 * 初始化方法，由于不能多继承，重载基类的这个方法来完成Init，和Init一样正常这个方法也是只会调用一次。
	 * 另，这个方法不能传参，暂时由data来传递窗口的handler
	 */
	makeFullScreen(): void {

		// console.error('makeFullScreenmakeFullScreen');

		// super.makeFullScreen();	//先处理全屏

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

	SetInfo(_info: SurpassHintInfo) {
		if (!_info || !_info.percent) {
			return;
		}
		this.myInfo = _info;
		if (!this.myInfo.delayTime) {
			this.myInfo.delayTime = 2000;
		}
		if (!this.myInfo.posY) {
			this.myInfo.posY = 200;
		}
		this.m_surpassText.setVar("count", '' + _info.percent).flushVars();

	}
	changeUrl() {
		const baseUrl = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/bigFight/matchAvatar/tx_";
		for (let i = 0; i < 2; i++) {
			let _headid = 1 + (Math.random() * 2000) | 0;
			let _url = baseUrl + (Array(5).join('0') + _headid).slice(-5) + ".jpg";
			console.log('_url', _url);

			if (i == 0) {
				this.m_photoLoader1.url = _url;
			}
			else {
				this.m_photoLoader2.url = _url;
			}
		}
	}
	public OnShow(): void {
		console.log("OnShow~~~");
		Laya.stage.offAllCaller(this);
		Laya.timer.clearAll(this);


		let _startx = Laya.stage.width + this.width * this.pivotX;
		let _endx = Laya.stage.width - this.width * (1 - this.pivotX);
		this.x = _startx;
		this.y = this.myInfo.posY;
		Laya.Tween.to(this, { x: _endx }, 500, undefined, Laya.Handler.create(this, () => {
			Laya.timer.once(this.myInfo.delayTime, this, () => {
				Laya.Tween.to(this, { x: _startx }, 500, undefined, Laya.Handler.create(this, () => {


					this._winHandler.hide();
				}));
			})
		}));
	}

	public OnHide(): void {

		console.log("OnHide~~~");

		Laya.stage.offAllCaller(this);
		Laya.timer.clearAll(this);

		this.changeUrl();
		// ModulePackage.Instance.PopWindow("rank", "ResultRank", 0, 0, {title: "游戏结束", score: 100, target: this, callBack: () => { 

		// 	console.log("再来一局");
		// } });
	}
}
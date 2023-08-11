/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import ModulePackage from "../ModulePackage";
import ModuleWindow from "../ModuleWindow";
import UI_Main from "./Atmosphere/UI_Main";
import uiSurpassHint from "./uiSurpassHint";



export default class uiAtmosphereMain extends UI_Main {

	public m_SurpassHint: uiSurpassHint;

	private _winHandler: ModuleWindow;

	protected onConstruct(): void {

		super.onConstruct();

		// this.m_inviteBtn.onClick(this, () => {

		// 	ModulePackage.Instance.SendMessage("rank", "task", "show");	//调用任务模块的显示方法
		// });

		// this.m_myPanel.m_ruleBtn.onClick(this, () => {
		// 	//显示奖励详情
		// 	ModulePackage.Instance.PopWindow("rank", "Awards");
		// });

		// this.m_myPanel.m_lastRankBtn.onClick(this, () => {
		// 	//显示上期排行
		// 	ModulePackage.Instance.PopWindow("rank", "LastRank");
		// });

		// this.makeFullScreen();
	}
	/**
	 * 初始化方法，由于不能多继承，重载基类的这个方法来完成Init，和Init一样正常这个方法也是只会调用一次。
	 * 另，这个方法不能传参，暂时由data来传递窗口的handler
	 */
	makeFullScreen(): void {

		super.makeFullScreen();	//先处理全屏

		// //对齐全屏下的位置
		// let _anchorX = 0;
		// let _anchorY = 0;
		// if (this.pivotAsAnchor) {
		// 	_anchorX = this.pivotX;
		// 	_anchorY = this.pivotY;
		// }
		// this.setXY(_anchorX * this.width, _anchorY * this.height);



		// console.log('wh', this.width, this.height);
		// console.log('xy', this.x, this.y);


		//初始化
		this._winHandler = this.data as ModuleWindow;

		this.data = null;

		if (this._winHandler != null) {
			Laya.timer.once(100, this, () => {
				ModulePackage.Instance.PopWindow("Atmosphere", "SurpassHint", {
					px: 0, py: 0, winParamData: {
						delayTime: 1000,
						percent: 10

					}, isModal: false
				});
			})

		}

		this.m_closeBtn.onClick(this, () => {
			this._winHandler.hide();
		})
	}
}
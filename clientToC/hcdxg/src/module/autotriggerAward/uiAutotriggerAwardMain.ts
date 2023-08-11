/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import ModuleWindow from '../ModuleWindow';
import UI_Main from './autotriggerAward/UI_Main';
import uiAutotriggerAward from './uiAutotriggerAward';

export default class uiAutotriggerAwardMain extends UI_Main {

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
			this.m_closeBtn.onClick(this, () => {
				this._winHandler.hide();
			})
			this.m_showAwardBtn.onClick(this, () => {
				uiAutotriggerAward.AutoShow(8,0);
			})

		}


	}

}
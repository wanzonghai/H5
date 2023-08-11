/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_MyGiftButton from "./UI_MyGiftButton";
import UI_exchangeConfirm from "./UI_exchangeConfirm";
import UI_exchangeSuccess from "./UI_exchangeSuccess";
import UI_exchangeFail from "./UI_exchangeFail";

export default class UI_Main extends fgui.GComponent {

	public m_bg:fgui.GGraph;
	public m_frame:fgui.GLabel;
	public m_framebg:fgui.GImage;
	public m_updateTimeTitle:fgui.GTextField;
	public m_updateTime:fgui.GTextField;
	public m_giftList:fgui.GTree;
	public m_btnMyGift:UI_MyGiftButton;
	public m_exchangeConfirm:UI_exchangeConfirm;
	public m_exchangeSuccess:UI_exchangeSuccess;
	public m_exchangeFail:UI_exchangeFail;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://txopsw7as0olb";

	public static createInstance():UI_Main {
		return <UI_Main>(fgui.UIPackage.createObject("gift", "Main"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GGraph>(this.getChildAt(0));
		this.m_frame = <fgui.GLabel>(this.getChildAt(1));
		this.m_framebg = <fgui.GImage>(this.getChildAt(2));
		this.m_updateTimeTitle = <fgui.GTextField>(this.getChildAt(3));
		this.m_updateTime = <fgui.GTextField>(this.getChildAt(4));
		this.m_giftList = <fgui.GTree>(this.getChildAt(5));
		this.m_btnMyGift = <UI_MyGiftButton>(this.getChildAt(6));
		this.m_exchangeConfirm = <UI_exchangeConfirm>(this.getChildAt(7));
		this.m_exchangeSuccess = <UI_exchangeSuccess>(this.getChildAt(8));
		this.m_exchangeFail = <UI_exchangeFail>(this.getChildAt(9));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
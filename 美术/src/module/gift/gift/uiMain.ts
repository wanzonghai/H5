/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import uiMyGiftButton from "./uiMyGiftButton";
import uiexchangeConfirm from "./uiexchangeConfirm";
import uiexchangeSuccess from "./uiexchangeSuccess";
import uiexchangeFail from "./uiexchangeFail";

export default class uiMain extends fgui.GComponent {

	public m_bg:fgui.GGraph;
	public m_frame:fgui.GLabel;
	public m_framebg:fgui.GImage;
	public m_updateTimeTitle:fgui.GTextField;
	public m_updateTime:fgui.GTextField;
	public m_giftList:fgui.GTree;
	public m_btnMyGift:uiMyGiftButton;
	public m_exchangeConfirm:uiexchangeConfirm;
	public m_exchangeSuccess:uiexchangeSuccess;
	public m_exchangeFail:uiexchangeFail;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://txopsw7as0olb";

	public static createInstance():uiMain {
		return <uiMain>(fgui.UIPackage.createObject("gift", "Main"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GGraph>(this.getChildAt(0));
		this.m_frame = <fgui.GLabel>(this.getChildAt(1));
		this.m_framebg = <fgui.GImage>(this.getChildAt(2));
		this.m_updateTimeTitle = <fgui.GTextField>(this.getChildAt(3));
		this.m_updateTime = <fgui.GTextField>(this.getChildAt(4));
		this.m_giftList = <fgui.GTree>(this.getChildAt(5));
		this.m_btnMyGift = <uiMyGiftButton>(this.getChildAt(6));
		this.m_exchangeConfirm = <uiexchangeConfirm>(this.getChildAt(7));
		this.m_exchangeSuccess = <uiexchangeSuccess>(this.getChildAt(8));
		this.m_exchangeFail = <uiexchangeFail>(this.getChildAt(9));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
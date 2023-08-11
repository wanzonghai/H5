/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import uiGiftInfo from "./uiGiftInfo";

export default class uiexchangeSuccess extends fgui.GComponent {

	public m_bg:fgui.GGraph;
	public m_closeBtn:fgui.GButton;
	public m_info:uiGiftInfo;
	public m_goBtn:fgui.GButton;
	public static URL:string = "ui://txopsw7as0ola";

	public static createInstance():uiexchangeSuccess {
		return <uiexchangeSuccess>(fgui.UIPackage.createObject("gift", "exchangeSuccess"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GGraph>(this.getChildAt(0));
		this.m_closeBtn = <fgui.GButton>(this.getChildAt(3));
		this.m_info = <uiGiftInfo>(this.getChildAt(4));
		this.m_goBtn = <fgui.GButton>(this.getChildAt(5));
	}
}
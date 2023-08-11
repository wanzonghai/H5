/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_GiftInfo from "./UI_GiftInfo";

export default class UI_exchangeConfirm extends fgui.GComponent {

	public m_bg:fgui.GGraph;
	public m_closeBtn:fgui.GButton;
	public m_info:UI_GiftInfo;
	public m_exchangeBtn:fgui.GButton;
	public m_needScoreText:fgui.GTextField;
	public static URL:string = "ui://txopsw7as0ol6";

	public static createInstance():UI_exchangeConfirm {
		return <UI_exchangeConfirm>(fgui.UIPackage.createObject("gift", "exchangeConfirm"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GGraph>(this.getChildAt(0));
		this.m_closeBtn = <fgui.GButton>(this.getChildAt(4));
		this.m_info = <UI_GiftInfo>(this.getChildAt(5));
		this.m_exchangeBtn = <fgui.GButton>(this.getChildAt(7));
		this.m_needScoreText = <fgui.GTextField>(this.getChildAt(6));
	}
}
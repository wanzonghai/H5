/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import uiGiftInfo from "./uiGiftInfo";

export default class uiexchangeConfirm extends fgui.GComponent {

	public m_bg:fgui.GGraph;
	public m_closeBtn:fgui.GButton;
	public m_info:uiGiftInfo;
	public m_needScoreText:fgui.GRichTextField;
	public m_exchangeBtn:fgui.GButton;
	public static URL:string = "ui://txopsw7as0ol6";

	public static createInstance():uiexchangeConfirm {
		return <uiexchangeConfirm>(fgui.UIPackage.createObject("gift", "exchangeConfirm"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GGraph>(this.getChildAt(0));
		this.m_closeBtn = <fgui.GButton>(this.getChildAt(4));
		this.m_info = <uiGiftInfo>(this.getChildAt(5));
		this.m_needScoreText = <fgui.GRichTextField>(this.getChildAt(6));
		this.m_exchangeBtn = <fgui.GButton>(this.getChildAt(7));
	}
}
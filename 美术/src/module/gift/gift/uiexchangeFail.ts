/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class uiexchangeFail extends fgui.GComponent {

	public m_bg:fgui.GGraph;
	public m_closeBtn:fgui.GButton;
	public m_okBtn:fgui.GButton;
	public m_failText:fgui.GTextField;
	public static URL:string = "ui://txopsw7as0ol7";

	public static createInstance():uiexchangeFail {
		return <uiexchangeFail>(fgui.UIPackage.createObject("gift", "exchangeFail"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GGraph>(this.getChildAt(0));
		this.m_closeBtn = <fgui.GButton>(this.getChildAt(3));
		this.m_okBtn = <fgui.GButton>(this.getChildAt(4));
		this.m_failText = <fgui.GTextField>(this.getChildAt(6));
	}
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_lastRankBtn extends fgui.GButton {

	public m_isGet:fgui.Controller;
	public static URL:string = "ui://qkteqwfpcowj1h";

	public static createInstance():UI_lastRankBtn {
		return <UI_lastRankBtn>(fgui.UIPackage.createObject("rank", "lastRankBtn"));
	}

	protected onConstruct():void {
		this.m_isGet = this.getControllerAt(1);
	}
}
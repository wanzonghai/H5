/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Main extends fgui.GComponent {

	public m_showAwardBtn:fgui.GButton;
	public m_closeBtn:fgui.GButton;
	public static URL:string = "ui://hmoqxzvjkv200";

	public static createInstance():UI_Main {
		return <UI_Main>(fgui.UIPackage.createObject("autotriggerAward", "Main"));
	}

	protected onConstruct():void {
		this.m_showAwardBtn = <fgui.GButton>(this.getChildAt(0));
		this.m_closeBtn = <fgui.GButton>(this.getChildAt(1));
	}
}
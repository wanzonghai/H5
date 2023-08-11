/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Main extends fgui.GComponent {

	public m_closeBtn:fgui.GButton;
	public static URL:string = "ui://2614tyiclh0h0";

	public static createInstance():UI_Main {
		return <UI_Main>(fgui.UIPackage.createObject("Atmosphere", "Main"));
	}

	protected onConstruct():void {
		this.m_closeBtn = <fgui.GButton>(this.getChildAt(0));
	}
}
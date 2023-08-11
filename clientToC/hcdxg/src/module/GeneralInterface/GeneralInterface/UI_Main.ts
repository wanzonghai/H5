/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Main extends fgui.GComponent {

	public m_frame:fgui.GLabel;
	public m_normalBtn2:fgui.GButton;
	public static URL:string = "ui://c66xycirfn9co3q";

	public static createInstance():UI_Main {
		return <UI_Main>(fgui.UIPackage.createObject("GeneralInterface", "Main"));
	}

	protected onConstruct():void {
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_normalBtn2 = <fgui.GButton>(this.getChildAt(1));
	}
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Main extends fgui.GComponent {

	public m_frame:fgui.GLabel;
	public m_framebg:fgui.GImage;
	public m_list:fgui.GList;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://c5mx7a76n9oc0";

	public static createInstance():UI_Main {
		return <UI_Main>(fgui.UIPackage.createObject("Rule", "Main"));
	}

	protected onConstruct():void {
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_framebg = <fgui.GImage>(this.getChildAt(1));
		this.m_list = <fgui.GList>(this.getChildAt(2));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
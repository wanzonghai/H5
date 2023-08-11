/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Alert extends fgui.GComponent {

	public m_alertCtrl:fgui.Controller;
	public m_frame:fgui.GLabel;
	public m_framebg:fgui.GImage;
	public m_tipsTxt:fgui.GTextField;
	public m_noBtn:fgui.GButton;
	public m_yesBtn:fgui.GButton;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://c66xycir11ndo3p";

	public static createInstance():UI_Alert {
		return <UI_Alert>(fgui.UIPackage.createObject("GeneralInterface", "Alert"));
	}

	protected onConstruct():void {
		this.m_alertCtrl = this.getControllerAt(0);
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_framebg = <fgui.GImage>(this.getChildAt(1));
		this.m_tipsTxt = <fgui.GTextField>(this.getChildAt(2));
		this.m_noBtn = <fgui.GButton>(this.getChildAt(3));
		this.m_yesBtn = <fgui.GButton>(this.getChildAt(4));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
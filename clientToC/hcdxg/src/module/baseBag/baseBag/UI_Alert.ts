/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Alert extends fgui.GComponent {

	public m_frame:fgui.GLabel;
	public m_listPanel:fgui.GImage;
	public m_txtMessage:fgui.GTextField;
	public m_btnOk:fgui.GButton;
	public m_btnNo:fgui.GButton;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://ennunbg0ctsq3h";

	public static createInstance():UI_Alert {
		return <UI_Alert>(fgui.UIPackage.createObject("baseBag", "Alert"));
	}

	protected onConstruct():void {
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_listPanel = <fgui.GImage>(this.getChildAt(1));
		this.m_txtMessage = <fgui.GTextField>(this.getChildAt(2));
		this.m_btnOk = <fgui.GButton>(this.getChildAt(3));
		this.m_btnNo = <fgui.GButton>(this.getChildAt(4));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
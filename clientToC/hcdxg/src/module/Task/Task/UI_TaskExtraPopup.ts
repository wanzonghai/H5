/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_TaskExtraPopup extends fgui.GComponent {

	public m_title:fgui.GImage;
	public m_closeButton:fgui.GButton;
	public m_hintText:fgui.GTextField;
	public m_icon:fgui.GLoader;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://czp63sggdp9714";

	public static createInstance():UI_TaskExtraPopup {
		return <UI_TaskExtraPopup>(fgui.UIPackage.createObject("Task", "TaskExtraPopup"));
	}

	protected onConstruct():void {
		this.m_title = <fgui.GImage>(this.getChildAt(0));
		this.m_closeButton = <fgui.GButton>(this.getChildAt(1));
		this.m_hintText = <fgui.GTextField>(this.getChildAt(2));
		this.m_icon = <fgui.GLoader>(this.getChildAt(3));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
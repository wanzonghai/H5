/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_TaskPrecondition extends fgui.GComponent {

	public m_frame:fgui.GLabel;
	public m_framebg:fgui.GImage;
	public m_okBtn:fgui.GButton;
	public m_icon:fgui.GImage;
	public m_descText:fgui.GTextField;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://czp63sggw7oc1";

	public static createInstance():UI_TaskPrecondition {
		return <UI_TaskPrecondition>(fgui.UIPackage.createObject("Task", "TaskPrecondition"));
	}

	protected onConstruct():void {
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_framebg = <fgui.GImage>(this.getChildAt(1));
		this.m_okBtn = <fgui.GButton>(this.getChildAt(2));
		this.m_icon = <fgui.GImage>(this.getChildAt(3));
		this.m_descText = <fgui.GTextField>(this.getChildAt(4));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_coinCom from "./UI_coinCom";

export default class UI_TaskInvite extends fgui.GComponent {

	public m_isInvite:fgui.Controller;
	public m_frame:fgui.GLabel;
	public m_framebg:fgui.GImage;
	public m_confirmBtn:fgui.GButton;
	public m_avatar:fgui.GLoader;
	public m_tipsTxt:fgui.GTextField;
	public m_coinCom:UI_coinCom;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://czp63sggmxaf3";

	public static createInstance():UI_TaskInvite {
		return <UI_TaskInvite>(fgui.UIPackage.createObject("Task", "TaskInvite"));
	}

	protected onConstruct():void {
		this.m_isInvite = this.getControllerAt(0);
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_framebg = <fgui.GImage>(this.getChildAt(1));
		this.m_confirmBtn = <fgui.GButton>(this.getChildAt(3));
		this.m_avatar = <fgui.GLoader>(this.getChildAt(4));
		this.m_tipsTxt = <fgui.GTextField>(this.getChildAt(5));
		this.m_coinCom = <UI_coinCom>(this.getChildAt(6));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
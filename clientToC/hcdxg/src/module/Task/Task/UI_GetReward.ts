/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_rewardCom from "./UI_rewardCom";

export default class UI_GetReward extends fgui.GComponent {

	public m_count:fgui.Controller;
	public m_type:fgui.Controller;
	public m_frame:fgui.GLabel;
	public m_framebg:fgui.GImage;
	public m_rewardCom1:UI_rewardCom;
	public m_rewardCom2:UI_rewardCom;
	public m_okBtn:fgui.GButton;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://czp63sggrqvv9";

	public static createInstance():UI_GetReward {
		return <UI_GetReward>(fgui.UIPackage.createObject("Task", "GetReward"));
	}

	protected onConstruct():void {
		this.m_count = this.getControllerAt(0);
		this.m_type = this.getControllerAt(1);
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_framebg = <fgui.GImage>(this.getChildAt(1));
		this.m_rewardCom1 = <UI_rewardCom>(this.getChildAt(2));
		this.m_rewardCom2 = <UI_rewardCom>(this.getChildAt(3));
		this.m_okBtn = <fgui.GButton>(this.getChildAt(4));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
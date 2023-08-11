/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_taskItem extends fgui.GComponent {

	public m_state:fgui.Controller;
	public m_iconCtrl:fgui.Controller;
	public m_isTimer:fgui.Controller;
	public m_styleCtrl:fgui.Controller;
	public m_progressState:fgui.Controller;
	public m_iconShowState:fgui.Controller;
	public m_titleTxt:fgui.GTextField;
	public m_taskTxt:fgui.GTextField;
	public m_iconLoader:fgui.GLoader;
	public m_timeTxt:fgui.GTextField;
	public m_yigaunzhu:fgui.GImage;
	public m_getBtn:fgui.GButton;
	public m_goBtn:fgui.GButton;
	public m_gotBtn:fgui.GButton;
	public m_followBtn:fgui.GButton;
	public m_coinIcon:fgui.GImage;
	public m_scoreIcon:fgui.GImage;
	public m_countTxt:fgui.GTextField;
	public m_scorecountTxt:fgui.GTextField;
	public m_slideIn:fgui.Transition;
	public static URL:string = "ui://czp63sgghd9ye";

	public static createInstance():UI_taskItem {
		return <UI_taskItem>(fgui.UIPackage.createObject("Task", "taskItem"));
	}

	protected onConstruct():void {
		this.m_state = this.getControllerAt(0);
		this.m_iconCtrl = this.getControllerAt(1);
		this.m_isTimer = this.getControllerAt(2);
		this.m_styleCtrl = this.getControllerAt(3);
		this.m_progressState = this.getControllerAt(4);
		this.m_iconShowState = this.getControllerAt(5);
		this.m_titleTxt = <fgui.GTextField>(this.getChildAt(2));
		this.m_taskTxt = <fgui.GTextField>(this.getChildAt(3));
		this.m_iconLoader = <fgui.GLoader>(this.getChildAt(4));
		this.m_timeTxt = <fgui.GTextField>(this.getChildAt(5));
		this.m_yigaunzhu = <fgui.GImage>(this.getChildAt(7));
		this.m_getBtn = <fgui.GButton>(this.getChildAt(8));
		this.m_goBtn = <fgui.GButton>(this.getChildAt(9));
		this.m_gotBtn = <fgui.GButton>(this.getChildAt(10));
		this.m_followBtn = <fgui.GButton>(this.getChildAt(11));
		this.m_coinIcon = <fgui.GImage>(this.getChildAt(12));
		this.m_scoreIcon = <fgui.GImage>(this.getChildAt(13));
		this.m_countTxt = <fgui.GTextField>(this.getChildAt(14));
		this.m_scorecountTxt = <fgui.GTextField>(this.getChildAt(15));
		this.m_slideIn = this.getTransitionAt(0);
	}
}
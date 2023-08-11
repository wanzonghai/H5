/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_TaskBrowse extends fgui.GComponent {

	public m_haveGoods:fgui.Controller;
	public m_type:fgui.Controller;
	public m_frame:fgui.GLabel;
	public m_framebg:fgui.GImage;
	public m_list:fgui.GList;
	public m_buyList:fgui.GList;
	public m_collectList:fgui.GList;
	public m_tips:fgui.GTextField;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://czp63sggcb3yg";

	public static createInstance():UI_TaskBrowse {
		return <UI_TaskBrowse>(fgui.UIPackage.createObject("Task", "TaskBrowse"));
	}

	protected onConstruct():void {
		this.m_haveGoods = this.getControllerAt(0);
		this.m_type = this.getControllerAt(1);
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_framebg = <fgui.GImage>(this.getChildAt(1));
		this.m_list = <fgui.GList>(this.getChildAt(2));
		this.m_buyList = <fgui.GList>(this.getChildAt(3));
		this.m_collectList = <fgui.GList>(this.getChildAt(4));
		this.m_tips = <fgui.GTextField>(this.getChildAt(5));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
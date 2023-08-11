/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_ActivityEndPopup extends fgui.GComponent {

	public m_infoCtr:fgui.Controller;
	public m_frame:fgui.GLabel;
	public m_goStoreBtn:fgui.GButton;
	public m_noAward:fgui.GGroup;
	public m_awardRank:fgui.GTextField;
	public m_awardInfo:fgui.GTextField;
	public m_goAwardBtn:fgui.GButton;
	public m_haveAward:fgui.GGroup;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://onlm4vwpsbnb10";

	public static createInstance():UI_ActivityEndPopup {
		return <UI_ActivityEndPopup>(fgui.UIPackage.createObject("activity", "ActivityEndPopup"));
	}

	protected onConstruct():void {
		this.m_infoCtr = this.getControllerAt(0);
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_goStoreBtn = <fgui.GButton>(this.getChildAt(4));
		this.m_noAward = <fgui.GGroup>(this.getChildAt(5));
		this.m_awardRank = <fgui.GTextField>(this.getChildAt(11));
		this.m_awardInfo = <fgui.GTextField>(this.getChildAt(13));
		this.m_goAwardBtn = <fgui.GButton>(this.getChildAt(14));
		this.m_haveAward = <fgui.GGroup>(this.getChildAt(15));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
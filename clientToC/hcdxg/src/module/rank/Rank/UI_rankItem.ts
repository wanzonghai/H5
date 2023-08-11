/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_rankItem extends fgui.GButton {

	public m_ctrlRank:fgui.Controller;
	public m_ctrlHaveAward:fgui.Controller;
	public m_ctrlIsSelf:fgui.Controller;
	public m_nameTxt:fgui.GTextField;
	public m_rankTxt:fgui.GTextField;
	public m_avatarLoader:fgui.GLoader;
	public m_awardBtn:fgui.GButton;
	public m_scoreTxt:fgui.GTextField;
	public m_score:fgui.GGroup;
	public m_slideIn:fgui.Transition;
	public static URL:string = "ui://qkteqwfpc8s24";

	public static createInstance():UI_rankItem {
		return <UI_rankItem>(fgui.UIPackage.createObject("rank", "rankItem"));
	}

	protected onConstruct():void {
		this.m_ctrlRank = this.getControllerAt(1);
		this.m_ctrlHaveAward = this.getControllerAt(2);
		this.m_ctrlIsSelf = this.getControllerAt(3);
		this.m_nameTxt = <fgui.GTextField>(this.getChildAt(1));
		this.m_rankTxt = <fgui.GTextField>(this.getChildAt(2));
		this.m_avatarLoader = <fgui.GLoader>(this.getChildAt(7));
		this.m_awardBtn = <fgui.GButton>(this.getChildAt(8));
		this.m_scoreTxt = <fgui.GTextField>(this.getChildAt(11));
		this.m_score = <fgui.GGroup>(this.getChildAt(12));
		this.m_slideIn = this.getTransitionAt(0);
	}
}
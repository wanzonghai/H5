/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_rankItem2 extends fgui.GButton {

	public m_rank:fgui.Controller;
	public m_isSelf:fgui.Controller;
	public m_nameTxt:fgui.GTextField;
	public m_rankTxt:fgui.GTextField;
	public m_avatarLoader:fgui.GLoader;
	public m_scoreTxt:fgui.GTextField;
	public m_slideIn:fgui.Transition;
	public static URL:string = "ui://qkteqwfpip943k";

	public static createInstance():UI_rankItem2 {
		return <UI_rankItem2>(fgui.UIPackage.createObject("rank", "rankItem2"));
	}

	protected onConstruct():void {
		this.m_rank = this.getControllerAt(1);
		this.m_isSelf = this.getControllerAt(2);
		this.m_nameTxt = <fgui.GTextField>(this.getChildAt(1));
		this.m_rankTxt = <fgui.GTextField>(this.getChildAt(2));
		this.m_avatarLoader = <fgui.GLoader>(this.getChildAt(7));
		this.m_scoreTxt = <fgui.GTextField>(this.getChildAt(10));
		this.m_slideIn = this.getTransitionAt(0);
	}
}
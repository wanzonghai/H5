/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_rankItem from "./UI_rankItem";
import UI_lastRankBtn from "./UI_lastRankBtn";

export default class UI_selfItem extends fgui.GComponent {

	public m_ctrLastRankStatus:fgui.Controller;
	public m_myItem:UI_rankItem;
	public m_lastRankBtn:UI_lastRankBtn;
	public m_ruleBtn:fgui.GButton;
	public static URL:string = "ui://qkteqwfpctsq3b";

	public static createInstance():UI_selfItem {
		return <UI_selfItem>(fgui.UIPackage.createObject("rank", "selfItem"));
	}

	protected onConstruct():void {
		this.m_ctrLastRankStatus = this.getControllerAt(0);
		this.m_myItem = <UI_rankItem>(this.getChildAt(1));
		this.m_lastRankBtn = <UI_lastRankBtn>(this.getChildAt(2));
		this.m_ruleBtn = <fgui.GButton>(this.getChildAt(3));
	}
}
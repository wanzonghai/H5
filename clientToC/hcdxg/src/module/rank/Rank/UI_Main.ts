/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_banner from "./UI_banner";
import UI_selfItem from "./UI_selfItem";

export default class UI_Main extends fgui.GComponent {

	public m_ctrlOkButtonStatus:fgui.Controller;
	public m_frame:fgui.GLabel;
	public m_inviteBtn:fgui.GButton;
	public m_topLoader:UI_banner;
	public m_myPanel:UI_selfItem;
	public m_noneTxt:fgui.GTextField;
	public m_listPanel:fgui.GImage;
	public m_curList:fgui.GList;
	public m_listRank:fgui.GGroup;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://qkteqwfpc8s20";

	public static createInstance():UI_Main {
		return <UI_Main>(fgui.UIPackage.createObject("rank", "Main"));
	}

	protected onConstruct():void {
		this.m_ctrlOkButtonStatus = this.getControllerAt(0);
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_inviteBtn = <fgui.GButton>(this.getChildAt(1));
		this.m_topLoader = <UI_banner>(this.getChildAt(2));
		this.m_myPanel = <UI_selfItem>(this.getChildAt(3));
		this.m_noneTxt = <fgui.GTextField>(this.getChildAt(4));
		this.m_listPanel = <fgui.GImage>(this.getChildAt(5));
		this.m_curList = <fgui.GList>(this.getChildAt(6));
		this.m_listRank = <fgui.GGroup>(this.getChildAt(7));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
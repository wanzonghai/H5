/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_rankItem from "./UI_rankItem";

export default class UI_LastRank extends fgui.GComponent {

	public m_ctrlRewardStatus:fgui.Controller;
	public m_ctrlLastRankStatus:fgui.Controller;
	public m_frame:fgui.GLabel;
	public m_listPanel:fgui.GImage;
	public m_listLastRank:fgui.GList;
	public m_listRank:fgui.GGroup;
	public m_myPanel:fgui.GImage;
	public m_myItem:UI_rankItem;
	public m_selfItem:fgui.GGroup;
	public m_btnGetReward:fgui.GButton;
	public m_txtTips:fgui.GTextField;
	public m_btnGetRewardGray:fgui.GButton;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://qkteqwfpcowj1z";

	public static createInstance():UI_LastRank {
		return <UI_LastRank>(fgui.UIPackage.createObject("rank", "LastRank"));
	}

	protected onConstruct():void {
		this.m_ctrlRewardStatus = this.getControllerAt(0);
		this.m_ctrlLastRankStatus = this.getControllerAt(1);
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_listPanel = <fgui.GImage>(this.getChildAt(1));
		this.m_listLastRank = <fgui.GList>(this.getChildAt(2));
		this.m_listRank = <fgui.GGroup>(this.getChildAt(3));
		this.m_myPanel = <fgui.GImage>(this.getChildAt(4));
		this.m_myItem = <UI_rankItem>(this.getChildAt(5));
		this.m_selfItem = <fgui.GGroup>(this.getChildAt(6));
		this.m_btnGetReward = <fgui.GButton>(this.getChildAt(7));
		this.m_txtTips = <fgui.GTextField>(this.getChildAt(8));
		this.m_btnGetRewardGray = <fgui.GButton>(this.getChildAt(9));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_ResultRank extends fgui.GComponent {

	public m_ctrlFrontStatus:fgui.Controller;
	public m_frame:fgui.GLabel;
	public m_listPanel:fgui.GImage;
	public m_listNewRank:fgui.GList;
	public m_listRank:fgui.GGroup;
	public m_myPanel:fgui.GImage;
	public m_txtFornt:fgui.GTextField;
	public m_itemHead:fgui.GLoader;
	public m_txtItemName:fgui.GTextField;
	public m_txtPrice:fgui.GTextField;
	public m_btnItemInfo:fgui.GButton;
	public m_reward:fgui.GGroup;
	public m_btnOk:fgui.GButton;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://qkteqwfpctsq3d";

	public static createInstance():UI_ResultRank {
		return <UI_ResultRank>(fgui.UIPackage.createObject("rank", "ResultRank"));
	}

	protected onConstruct():void {
		this.m_ctrlFrontStatus = this.getControllerAt(0);
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_listPanel = <fgui.GImage>(this.getChildAt(1));
		this.m_listNewRank = <fgui.GList>(this.getChildAt(2));
		this.m_listRank = <fgui.GGroup>(this.getChildAt(3));
		this.m_myPanel = <fgui.GImage>(this.getChildAt(4));
		this.m_txtFornt = <fgui.GTextField>(this.getChildAt(5));
		this.m_itemHead = <fgui.GLoader>(this.getChildAt(6));
		this.m_txtItemName = <fgui.GTextField>(this.getChildAt(7));
		this.m_txtPrice = <fgui.GTextField>(this.getChildAt(8));
		this.m_btnItemInfo = <fgui.GButton>(this.getChildAt(9));
		this.m_reward = <fgui.GGroup>(this.getChildAt(10));
		this.m_btnOk = <fgui.GButton>(this.getChildAt(11));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
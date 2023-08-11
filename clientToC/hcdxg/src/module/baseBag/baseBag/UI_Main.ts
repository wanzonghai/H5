/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Main extends fgui.GComponent {

	public m_ctrlType:fgui.Controller;
	public m_ctrlEmptyStatus:fgui.Controller;
	public m_frame:fgui.GLabel;
	public m_btnCoupon:fgui.GButton;
	public m_btnGoods:fgui.GButton;
	public m_tab:fgui.GGroup;
	public m_listPanel:fgui.GImage;
	public m_noneTxt:fgui.GTextField;
	public m_listGift:fgui.GList;
	public m_listSale:fgui.GList;
	public m_list:fgui.GGroup;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://ennunbg0r8mh1";

	public static createInstance():UI_Main {
		return <UI_Main>(fgui.UIPackage.createObject("baseBag", "Main"));
	}

	protected onConstruct():void {
		this.m_ctrlType = this.getControllerAt(0);
		this.m_ctrlEmptyStatus = this.getControllerAt(1);
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_btnCoupon = <fgui.GButton>(this.getChildAt(1));
		this.m_btnGoods = <fgui.GButton>(this.getChildAt(2));
		this.m_tab = <fgui.GGroup>(this.getChildAt(3));
		this.m_listPanel = <fgui.GImage>(this.getChildAt(4));
		this.m_noneTxt = <fgui.GTextField>(this.getChildAt(5));
		this.m_listGift = <fgui.GList>(this.getChildAt(6));
		this.m_listSale = <fgui.GList>(this.getChildAt(7));
		this.m_list = <fgui.GGroup>(this.getChildAt(8));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
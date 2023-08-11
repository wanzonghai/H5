/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_prizeItem extends fgui.GComponent {

	public m_ctrlSendStatus:fgui.Controller;
	public m_ctrlType:fgui.Controller;
	public m_loadItemHead:fgui.GLoader;
	public m_btnApply:fgui.GButton;
	public m_btnApply2:fgui.GButton;
	public m_txtName:fgui.GTextField;
	public m_txtPrice:fgui.GTextField;
	public m_txtBeginTime:fgui.GTextField;
	public m_txtOrderNo:fgui.GTextField;
	public static URL:string = "ui://ennunbg0ctsq39";

	public static createInstance():UI_prizeItem {
		return <UI_prizeItem>(fgui.UIPackage.createObject("baseBag", "prizeItem"));
	}

	protected onConstruct():void {
		this.m_ctrlSendStatus = this.getControllerAt(0);
		this.m_ctrlType = this.getControllerAt(1);
		this.m_loadItemHead = <fgui.GLoader>(this.getChildAt(0));
		this.m_btnApply = <fgui.GButton>(this.getChildAt(1));
		this.m_btnApply2 = <fgui.GButton>(this.getChildAt(2));
		this.m_txtName = <fgui.GTextField>(this.getChildAt(3));
		this.m_txtPrice = <fgui.GTextField>(this.getChildAt(4));
		this.m_txtBeginTime = <fgui.GTextField>(this.getChildAt(5));
		this.m_txtOrderNo = <fgui.GTextField>(this.getChildAt(6));
	}
}
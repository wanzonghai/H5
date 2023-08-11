/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_awardItem extends fgui.GComponent {

	public m_styleCtrl:fgui.Controller;
	public m_txtRank:fgui.GTextField;
	public m_loadItemHead:fgui.GLoader;
	public m_txtName:fgui.GTextField;
	public m_txtPrice:fgui.GTextField;
	public static URL:string = "ui://qkteqwfpcowj1n";

	public static createInstance():UI_awardItem {
		return <UI_awardItem>(fgui.UIPackage.createObject("rank", "awardItem"));
	}

	protected onConstruct():void {
		this.m_styleCtrl = this.getControllerAt(0);
		this.m_txtRank = <fgui.GTextField>(this.getChildAt(0));
		this.m_loadItemHead = <fgui.GLoader>(this.getChildAt(2));
		this.m_txtName = <fgui.GTextField>(this.getChildAt(3));
		this.m_txtPrice = <fgui.GTextField>(this.getChildAt(4));
	}
}
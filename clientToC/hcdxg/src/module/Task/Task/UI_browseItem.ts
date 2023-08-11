/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_browseItem extends fgui.GComponent {

	public m_isCan:fgui.Controller;
	public m_goodsImg:fgui.GLoader;
	public m_browseBtn:fgui.GButton;
	public m_priceTxt:fgui.GTextField;
	public m_content:fgui.GTextField;
	public m_slideIn:fgui.Transition;
	public static URL:string = "ui://czp63sggemqnn";

	public static createInstance():UI_browseItem {
		return <UI_browseItem>(fgui.UIPackage.createObject("Task", "browseItem"));
	}

	protected onConstruct():void {
		this.m_isCan = this.getControllerAt(0);
		this.m_goodsImg = <fgui.GLoader>(this.getChildAt(0));
		this.m_browseBtn = <fgui.GButton>(this.getChildAt(1));
		this.m_priceTxt = <fgui.GTextField>(this.getChildAt(2));
		this.m_content = <fgui.GTextField>(this.getChildAt(3));
		this.m_slideIn = this.getTransitionAt(0);
	}
}
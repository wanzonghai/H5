/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_collectItem extends fgui.GComponent {

	public m_isCollected:fgui.Controller;
	public m_goodsImg:fgui.GLoader;
	public m_collectBtn:fgui.GButton;
	public m_priceTxt:fgui.GTextField;
	public m_content:fgui.GTextField;
	public m_slideIn:fgui.Transition;
	public static URL:string = "ui://czp63sgghfek11";

	public static createInstance():UI_collectItem {
		return <UI_collectItem>(fgui.UIPackage.createObject("Task", "collectItem"));
	}

	protected onConstruct():void {
		this.m_isCollected = this.getControllerAt(0);
		this.m_goodsImg = <fgui.GLoader>(this.getChildAt(0));
		this.m_collectBtn = <fgui.GButton>(this.getChildAt(1));
		this.m_priceTxt = <fgui.GTextField>(this.getChildAt(2));
		this.m_content = <fgui.GTextField>(this.getChildAt(3));
		this.m_slideIn = this.getTransitionAt(0);
	}
}
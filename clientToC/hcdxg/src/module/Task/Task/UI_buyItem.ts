/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_award from "./UI_award";

export default class UI_buyItem extends fgui.GComponent {

	public m_isCan:fgui.Controller;
	public m_awardImg:UI_award;
	public m_goodsImg:fgui.GLoader;
	public m_buyBtn:fgui.GButton;
	public m_priceTxt:fgui.GTextField;
	public m_content:fgui.GTextField;
	public m_slideIn:fgui.Transition;
	public static URL:string = "ui://czp63sgg9se0s";

	public static createInstance():UI_buyItem {
		return <UI_buyItem>(fgui.UIPackage.createObject("Task", "buyItem"));
	}

	protected onConstruct():void {
		this.m_isCan = this.getControllerAt(0);
		this.m_awardImg = <UI_award>(this.getChildAt(0));
		this.m_goodsImg = <fgui.GLoader>(this.getChildAt(1));
		this.m_buyBtn = <fgui.GButton>(this.getChildAt(2));
		this.m_priceTxt = <fgui.GTextField>(this.getChildAt(3));
		this.m_content = <fgui.GTextField>(this.getChildAt(4));
		this.m_slideIn = this.getTransitionAt(0);
	}
}
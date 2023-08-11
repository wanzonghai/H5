/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_GiftInfo from "./UI_GiftInfo";
import UI_scoreExchangeBtn from "./UI_scoreExchangeBtn";

export default class UI_GiftItem extends fgui.GComponent {

	public m_leftNText:fgui.GTextField;
	public m_info:UI_GiftInfo;
	public m_exchangeBtn:UI_scoreExchangeBtn;
	public m_exchangeHint1:fgui.GComponent;
	public m_exchangeHint2:fgui.GComponent;
	public static URL:string = "ui://txopsw7as0old";

	public static createInstance():UI_GiftItem {
		return <UI_GiftItem>(fgui.UIPackage.createObject("gift", "GiftItem"));
	}

	protected onConstruct():void {
		this.m_leftNText = <fgui.GTextField>(this.getChildAt(2));
		this.m_info = <UI_GiftInfo>(this.getChildAt(3));
		this.m_exchangeBtn = <UI_scoreExchangeBtn>(this.getChildAt(4));
		this.m_exchangeHint1 = <fgui.GComponent>(this.getChildAt(5));
		this.m_exchangeHint2 = <fgui.GComponent>(this.getChildAt(6));
	}
}
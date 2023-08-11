/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import uiGiftInfo from "./uiGiftInfo";
import uiscoreExchangeBtn from "./uiscoreExchangeBtn";

export default class uiGiftItem extends fgui.GComponent {

	public m_leftNText:fgui.GTextField;
	public m_info:uiGiftInfo;
	public m_exchangeBtn:uiscoreExchangeBtn;
	public m_exchangeHint1:fgui.GComponent;
	public m_exchangeHint2:fgui.GComponent;
	public static URL:string = "ui://txopsw7as0old";

	public static createInstance():uiGiftItem {
		return <uiGiftItem>(fgui.UIPackage.createObject("gift", "GiftItem"));
	}

	protected onConstruct():void {
		this.m_leftNText = <fgui.GTextField>(this.getChildAt(2));
		this.m_info = <uiGiftInfo>(this.getChildAt(3));
		this.m_exchangeBtn = <uiscoreExchangeBtn>(this.getChildAt(4));
		this.m_exchangeHint1 = <fgui.GComponent>(this.getChildAt(5));
		this.m_exchangeHint2 = <fgui.GComponent>(this.getChildAt(6));
	}
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_ActivityAwardItem extends fgui.GComponent {

	public m_rankText:fgui.GTextField;
	public m_imageLoader:fgui.GLoader;
	public m_infoText:fgui.GTextField;
	public m_priceText:fgui.GTextField;
	public static URL:string = "ui://onlm4vwpsbnb13";

	public static createInstance():UI_ActivityAwardItem {
		return <UI_ActivityAwardItem>(fgui.UIPackage.createObject("activity", "ActivityAwardItem"));
	}

	protected onConstruct():void {
		this.m_rankText = <fgui.GTextField>(this.getChildAt(1));
		this.m_imageLoader = <fgui.GLoader>(this.getChildAt(2));
		this.m_infoText = <fgui.GTextField>(this.getChildAt(3));
		this.m_priceText = <fgui.GTextField>(this.getChildAt(4));
	}
}
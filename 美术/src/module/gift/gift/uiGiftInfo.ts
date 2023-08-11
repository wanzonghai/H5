/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class uiGiftInfo extends fgui.GComponent {

	public m_imageLoader:fgui.GLoader;
	public m_describText:fgui.GTextField;
	public static URL:string = "ui://txopsw7as0olc";

	public static createInstance():uiGiftInfo {
		return <uiGiftInfo>(fgui.UIPackage.createObject("gift", "GiftInfo"));
	}

	protected onConstruct():void {
		this.m_imageLoader = <fgui.GLoader>(this.getChildAt(0));
		this.m_describText = <fgui.GTextField>(this.getChildAt(1));
	}
}
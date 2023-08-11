/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_MyGiftButton extends fgui.GButton {

	public m_bubbleBG:fgui.GImage;
	public m_bagNText:fgui.GTextField;
	public static URL:string = "ui://vzezwp8fpywdo2n";

	public static createInstance():UI_MyGiftButton {
		return <UI_MyGiftButton>(fgui.UIPackage.createObject("GameCommon", "MyGiftButton"));
	}

	protected onConstruct():void {
		this.m_bubbleBG = <fgui.GImage>(this.getChildAt(1));
		this.m_bagNText = <fgui.GTextField>(this.getChildAt(2));
	}
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_scoreExchangeBtn extends fgui.GButton {

	public m_jifenText:fgui.GImage;
	public static URL:string = "ui://txopsw7as0oli";

	public static createInstance():UI_scoreExchangeBtn {
		return <UI_scoreExchangeBtn>(fgui.UIPackage.createObject("gift", "scoreExchangeBtn"));
	}

	protected onConstruct():void {
		this.m_jifenText = <fgui.GImage>(this.getChildAt(7));
	}
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_scoreExchangeBtn extends fgui.GButton {

	public m_needScoreNText:fgui.GTextField;
	public m_needScoreicon:fgui.GTextField;
	public static URL:string = "ui://vzezwp8fpraz12";

	public static createInstance():UI_scoreExchangeBtn {
		return <UI_scoreExchangeBtn>(fgui.UIPackage.createObject("GameCommon", "scoreExchangeBtn"));
	}

	protected onConstruct():void {
		this.m_needScoreNText = <fgui.GTextField>(this.getChildAt(7));
		this.m_needScoreicon = <fgui.GTextField>(this.getChildAt(8));
	}
}
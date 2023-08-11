/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_award extends fgui.GComponent {

	public m_awardImg:fgui.GImage;
	public m_coinIcon:fgui.GImage;
	public m_scoreIcon:fgui.GImage;
	public m_awardCount:fgui.GTextField;
	public m_scoreawardCount:fgui.GTextField;
	public m_coinText:fgui.GTextField;
	public m_scoreText:fgui.GTextField;
	public static URL:string = "ui://czp63sgg9se0o";

	public static createInstance():UI_award {
		return <UI_award>(fgui.UIPackage.createObject("Task", "award"));
	}

	protected onConstruct():void {
		this.m_awardImg = <fgui.GImage>(this.getChildAt(1));
		this.m_coinIcon = <fgui.GImage>(this.getChildAt(2));
		this.m_scoreIcon = <fgui.GImage>(this.getChildAt(3));
		this.m_awardCount = <fgui.GTextField>(this.getChildAt(4));
		this.m_scoreawardCount = <fgui.GTextField>(this.getChildAt(5));
		this.m_coinText = <fgui.GTextField>(this.getChildAt(6));
		this.m_scoreText = <fgui.GTextField>(this.getChildAt(7));
	}
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_banner extends fgui.GComponent {

	public m_ctrlActveStatus:fgui.Controller;
	public m_topLoader:fgui.GLoader;
	public m_numBanner:fgui.GImage;
	public m_timeBanner:fgui.GImage;
	public m_txtMaxNum:fgui.GRichTextField;
	public m_numTxt:fgui.GRichTextField;
	public m_timeTxt:fgui.GRichTextField;
	public static URL:string = "ui://qkteqwfpctsq3a";

	public static createInstance():UI_banner {
		return <UI_banner>(fgui.UIPackage.createObject("rank", "banner"));
	}

	protected onConstruct():void {
		this.m_ctrlActveStatus = this.getControllerAt(0);
		this.m_topLoader = <fgui.GLoader>(this.getChildAt(0));
		this.m_numBanner = <fgui.GImage>(this.getChildAt(1));
		this.m_timeBanner = <fgui.GImage>(this.getChildAt(2));
		this.m_txtMaxNum = <fgui.GRichTextField>(this.getChildAt(3));
		this.m_numTxt = <fgui.GRichTextField>(this.getChildAt(4));
		this.m_timeTxt = <fgui.GRichTextField>(this.getChildAt(5));
	}
}
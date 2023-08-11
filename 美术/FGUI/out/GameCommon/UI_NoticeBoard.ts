/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_NoticeBoard extends fgui.GComponent {

	public m_bg:fgui.GGraph;
	public m_noticeLoader:fgui.GLoader;
	public m_luckyImageBtn:fgui.GGraph;
	public m_closeBtn:fgui.GButton;
	public m_hintText:fgui.GTextField;
	public static URL:string = "ui://vzezwp8ftlato26";

	public static createInstance():UI_NoticeBoard {
		return <UI_NoticeBoard>(fgui.UIPackage.createObject("GameCommon", "NoticeBoard"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GGraph>(this.getChildAt(0));
		this.m_noticeLoader = <fgui.GLoader>(this.getChildAt(1));
		this.m_luckyImageBtn = <fgui.GGraph>(this.getChildAt(2));
		this.m_closeBtn = <fgui.GButton>(this.getChildAt(3));
		this.m_hintText = <fgui.GTextField>(this.getChildAt(4));
	}
}
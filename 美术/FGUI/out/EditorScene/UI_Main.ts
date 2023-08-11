/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Main extends fgui.GComponent {

	public m_bg:fgui.GGraph;
	public m_backBtn:fgui.GButton;
	public m_title:fgui.GTextField;
	public m_subjectList:fgui.GList;
	public m_addBtn:fgui.GButton;
	public static URL:string = "ui://k37hdm9nebc90";

	public static createInstance():UI_Main {
		return <UI_Main>(fgui.UIPackage.createObject("EditorScene", "Main"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GGraph>(this.getChildAt(0));
		this.m_backBtn = <fgui.GButton>(this.getChildAt(1));
		this.m_title = <fgui.GTextField>(this.getChildAt(2));
		this.m_subjectList = <fgui.GList>(this.getChildAt(3));
		this.m_addBtn = <fgui.GButton>(this.getChildAt(8));
	}
}
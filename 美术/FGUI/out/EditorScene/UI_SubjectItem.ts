/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_SubjectItem extends fgui.GComponent {

	public m_bg:fgui.GGraph;
	public m_deleteButton:fgui.GButton;
	public m_subjecEditBox:fgui.GTextInput;
	public m_toggle1:fgui.GButton;
	public m_toggle2:fgui.GButton;
	public m_toggleContainer:fgui.GGroup;
	public static URL:string = "ui://k37hdm9nebc93";

	public static createInstance():UI_SubjectItem {
		return <UI_SubjectItem>(fgui.UIPackage.createObject("EditorScene", "SubjectItem"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GGraph>(this.getChildAt(0));
		this.m_deleteButton = <fgui.GButton>(this.getChildAt(1));
		this.m_subjecEditBox = <fgui.GTextInput>(this.getChildAt(2));
		this.m_toggle1 = <fgui.GButton>(this.getChildAt(3));
		this.m_toggle2 = <fgui.GButton>(this.getChildAt(4));
		this.m_toggleContainer = <fgui.GGroup>(this.getChildAt(5));
	}
}
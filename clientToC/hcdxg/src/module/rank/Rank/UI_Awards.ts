/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_Awards extends fgui.GComponent {

	public m_frame:fgui.GLabel;
	public m_listPanel:fgui.GImage;
	public m_listAwards:fgui.GList;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://qkteqwfpcowj1s";

	public static createInstance():UI_Awards {
		return <UI_Awards>(fgui.UIPackage.createObject("rank", "Awards"));
	}

	protected onConstruct():void {
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_listPanel = <fgui.GImage>(this.getChildAt(1));
		this.m_listAwards = <fgui.GList>(this.getChildAt(2));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
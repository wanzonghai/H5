/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_ActivityAward extends fgui.GComponent {

	public m_frame:fgui.GLabel;
	public m_list:fgui.GList;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://onlm4vwpsbnb11";

	public static createInstance():UI_ActivityAward {
		return <UI_ActivityAward>(fgui.UIPackage.createObject("activity", "ActivityAward"));
	}

	protected onConstruct():void {
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_list = <fgui.GList>(this.getChildAt(2));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
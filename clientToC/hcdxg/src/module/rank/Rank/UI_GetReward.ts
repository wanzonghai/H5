/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_GetReward extends fgui.GComponent {

	public m_frame:fgui.GLabel;
	public m_loadItemIcon:fgui.GLoader;
	public m_txtItemName:fgui.GTextField;
	public m_btnOk:fgui.GButton;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://qkteqwfpip943j";

	public static createInstance():UI_GetReward {
		return <UI_GetReward>(fgui.UIPackage.createObject("rank", "GetReward"));
	}

	protected onConstruct():void {
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_loadItemIcon = <fgui.GLoader>(this.getChildAt(2));
		this.m_txtItemName = <fgui.GTextField>(this.getChildAt(3));
		this.m_btnOk = <fgui.GButton>(this.getChildAt(4));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_AutotriggerAward extends fgui.GComponent {

	public m_frame:fgui.GLabel;
	public m_iconLoader:fgui.GLoader;
	public m_tText:fgui.GTextField;
	public m_attentionBtn:fgui.GButton;
	public m_priceText:fgui.GTextField;
	public m_describeText:fgui.GTextField;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://hmoqxzvjkv205";

	public static createInstance():UI_AutotriggerAward {
		return <UI_AutotriggerAward>(fgui.UIPackage.createObject("autotriggerAward", "AutotriggerAward"));
	}

	protected onConstruct():void {
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_iconLoader = <fgui.GLoader>(this.getChildAt(2));
		this.m_tText = <fgui.GTextField>(this.getChildAt(3));
		this.m_attentionBtn = <fgui.GButton>(this.getChildAt(4));
		this.m_priceText = <fgui.GTextField>(this.getChildAt(5));
		this.m_describeText = <fgui.GTextField>(this.getChildAt(6));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_txtCom extends fgui.GComponent {

	public m_ruleTxt:fgui.GTextField;
	public static URL:string = "ui://c5mx7a76n9oc4";

	public static createInstance():UI_txtCom {
		return <UI_txtCom>(fgui.UIPackage.createObject("Rule", "txtCom"));
	}

	protected onConstruct():void {
		this.m_ruleTxt = <fgui.GTextField>(this.getChildAt(0));
	}
}
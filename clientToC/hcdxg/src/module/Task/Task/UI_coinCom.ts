/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_coinCom extends fgui.GComponent {

	public m_countTxt:fgui.GTextField;
	public static URL:string = "ui://czp63sggmxaf4";

	public static createInstance():UI_coinCom {
		return <UI_coinCom>(fgui.UIPackage.createObject("Task", "coinCom"));
	}

	protected onConstruct():void {
		this.m_countTxt = <fgui.GTextField>(this.getChildAt(1));
	}
}
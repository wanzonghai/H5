/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_textInput extends fgui.GComponent {

	public m_value:fgui.GTextInput;
	public static URL:string = "ui://ennunbg0ctsq3e";

	public static createInstance():UI_textInput {
		return <UI_textInput>(fgui.UIPackage.createObject("baseBag", "textInput"));
	}

	protected onConstruct():void {
		this.m_value = <fgui.GTextInput>(this.getChildAt(1));
	}
}
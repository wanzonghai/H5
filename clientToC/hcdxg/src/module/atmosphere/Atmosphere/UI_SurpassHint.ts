/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_SurpassHint extends fgui.GComponent {

	public m_bg:fgui.GImage;
	public m_surpassText:fgui.GTextField;
	public m_photoLoader1:fgui.GLoader;
	public m_photoLoader2:fgui.GLoader;
	public static URL:string = "ui://2614tyiclh0h2";

	public static createInstance():UI_SurpassHint {
		return <UI_SurpassHint>(fgui.UIPackage.createObject("Atmosphere", "SurpassHint"));
	}

	protected onConstruct():void {
		this.m_bg = <fgui.GImage>(this.getChildAt(0));
		this.m_surpassText = <fgui.GTextField>(this.getChildAt(1));
		this.m_photoLoader1 = <fgui.GLoader>(this.getChildAt(2));
		this.m_photoLoader2 = <fgui.GLoader>(this.getChildAt(3));
	}
}
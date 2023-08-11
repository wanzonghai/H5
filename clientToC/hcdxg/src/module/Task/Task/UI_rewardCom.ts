/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_rewardCom extends fgui.GComponent {

	public m_type:fgui.Controller;
	public m_rewardLoader:fgui.GLoader;
	public m_rewardTxt:fgui.GTextField;
	public static URL:string = "ui://czp63sggmsmcz";

	public static createInstance():UI_rewardCom {
		return <UI_rewardCom>(fgui.UIPackage.createObject("Task", "rewardCom"));
	}

	protected onConstruct():void {
		this.m_type = this.getControllerAt(0);
		this.m_rewardLoader = <fgui.GLoader>(this.getChildAt(0));
		this.m_rewardTxt = <fgui.GTextField>(this.getChildAt(1));
	}
}
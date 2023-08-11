/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class UI_InputRewardAdress extends fgui.GComponent {

	public m_frame:fgui.GLabel;
	public m_listPanel:fgui.GImage;
	public m_btnOk:fgui.GButton;
	public m_pannelName:fgui.GImage;
	public m_inputName:fgui.GTextField;
	public m_pannelPhone:fgui.GImage;
	public m_inputPhone:fgui.GTextField;
	public m_pannelAdress:fgui.GImage;
	public m_inputAdress:fgui.GTextField;
	public m_popUp:fgui.Transition;
	public m_packUp:fgui.Transition;
	public static URL:string = "ui://ennunbg0ctsq3i";

	public static createInstance():UI_InputRewardAdress {
		return <UI_InputRewardAdress>(fgui.UIPackage.createObject("baseBag", "InputRewardAdress"));
	}

	protected onConstruct():void {
		this.m_frame = <fgui.GLabel>(this.getChildAt(0));
		this.m_listPanel = <fgui.GImage>(this.getChildAt(1));
		this.m_btnOk = <fgui.GButton>(this.getChildAt(3));
		this.m_pannelName = <fgui.GImage>(this.getChildAt(7));
		this.m_inputName = <fgui.GTextField>(this.getChildAt(8));
		this.m_pannelPhone = <fgui.GImage>(this.getChildAt(9));
		this.m_inputPhone = <fgui.GTextField>(this.getChildAt(10));
		this.m_pannelAdress = <fgui.GImage>(this.getChildAt(11));
		this.m_inputAdress = <fgui.GTextField>(this.getChildAt(12));
		this.m_popUp = this.getTransitionAt(0);
		this.m_packUp = this.getTransitionAt(1);
	}
}
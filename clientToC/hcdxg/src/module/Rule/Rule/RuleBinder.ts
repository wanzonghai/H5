/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_Main from "./UI_Main";
import UI_txtCom from "./UI_txtCom";

export default class RuleBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_Main.URL, UI_Main);
		fgui.UIObjectFactory.setExtension(UI_txtCom.URL, UI_txtCom);
	}
}
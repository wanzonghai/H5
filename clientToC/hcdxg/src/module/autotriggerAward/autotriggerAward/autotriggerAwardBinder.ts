/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_Main from "./UI_Main";
import UI_AutotriggerAward from "./UI_AutotriggerAward";

export default class autotriggerAwardBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_Main.URL, UI_Main);
		fgui.UIObjectFactory.setExtension(UI_AutotriggerAward.URL, UI_AutotriggerAward);
	}
}
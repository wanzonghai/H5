/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_Main from "./UI_Main";
import UI_SurpassHint from "./UI_SurpassHint";

export default class AtmosphereBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_Main.URL, UI_Main);
		fgui.UIObjectFactory.setExtension(UI_SurpassHint.URL, UI_SurpassHint);
	}
}
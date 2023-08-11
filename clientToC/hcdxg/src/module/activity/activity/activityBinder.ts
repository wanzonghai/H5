/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_Main from "./UI_Main";
import UI_ActivityEndPopup from "./UI_ActivityEndPopup";
import UI_ActivityAward from "./UI_ActivityAward";
import UI_ActivityAwardItem from "./UI_ActivityAwardItem";

export default class activityBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_Main.URL, UI_Main);
		fgui.UIObjectFactory.setExtension(UI_ActivityEndPopup.URL, UI_ActivityEndPopup);
		fgui.UIObjectFactory.setExtension(UI_ActivityAward.URL, UI_ActivityAward);
		fgui.UIObjectFactory.setExtension(UI_ActivityAwardItem.URL, UI_ActivityAwardItem);
	}
}
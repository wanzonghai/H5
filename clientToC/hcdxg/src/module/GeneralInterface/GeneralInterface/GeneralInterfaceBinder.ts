/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_Alert from "./UI_Alert";
import UI_Main from "./UI_Main";

export default class GeneralInterfaceBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_Alert.URL, UI_Alert);
		fgui.UIObjectFactory.setExtension(UI_Main.URL, UI_Main);
	}
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_prizeItem from "./UI_prizeItem";
import UI_Alert from "./UI_Alert";
import UI_InputRewardAdress from "./UI_InputRewardAdress";
import UI_Main from "./UI_Main";

export default class baseBagBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_prizeItem.URL, UI_prizeItem);
		fgui.UIObjectFactory.setExtension(UI_Alert.URL, UI_Alert);
		fgui.UIObjectFactory.setExtension(UI_InputRewardAdress.URL, UI_InputRewardAdress);
		fgui.UIObjectFactory.setExtension(UI_Main.URL, UI_Main);
	}
}
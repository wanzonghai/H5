/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import uiAutotriggerAward from "./uiAutotriggerAward";
import uiAutotriggerAwardMain from './uiAutotriggerAwardMain';

export default class autotriggerAwardBinder {
	public static bindAll(): void {
		fgui.UIObjectFactory.setExtension(uiAutotriggerAwardMain.URL, uiAutotriggerAwardMain);
		fgui.UIObjectFactory.setExtension(uiAutotriggerAward.URL, uiAutotriggerAward);
	}
}
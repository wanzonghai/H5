/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_Main from "./UI_Main";
import UI_SubjectItem from "./UI_SubjectItem";

export default class EditorSceneBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_Main.URL, UI_Main);
		fgui.UIObjectFactory.setExtension(UI_SubjectItem.URL, UI_SubjectItem);
	}
}
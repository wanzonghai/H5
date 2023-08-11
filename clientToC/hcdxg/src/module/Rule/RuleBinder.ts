/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_txtCom from "./Rule/UI_txtCom";
import uiRuleMain from "./uiRuleMain";

export default class RuleBinder {
	public static bindAll(): void {
		fgui.UIObjectFactory.setExtension(uiRuleMain.URL, uiRuleMain);
		fgui.UIObjectFactory.setExtension(UI_txtCom.URL, UI_txtCom);
	}
}
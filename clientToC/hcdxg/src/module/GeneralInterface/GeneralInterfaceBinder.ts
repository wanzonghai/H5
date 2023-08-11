/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import uiAlert from "./uiAlert";
import uiGeneralInterfaceMain from './uiGeneralInterfaceMain';

export default class GeneralInterfaceBinder {
	public static bindAll(): void {
		fgui.UIObjectFactory.setExtension(uiAlert.URL, uiAlert);
		fgui.UIObjectFactory.setExtension(uiGeneralInterfaceMain.URL, uiGeneralInterfaceMain);
	}
}
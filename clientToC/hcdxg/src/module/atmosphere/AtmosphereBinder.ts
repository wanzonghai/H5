/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
import uiAtmosphereMain from './uiAtmosphereMain';
import uiSurpassHint from './uiSurpassHint';


export default class AtmosphereBinder {
	public static bindAll(): void {
		fgui.UIObjectFactory.setExtension(uiAtmosphereMain.URL, uiAtmosphereMain);
		fgui.UIObjectFactory.setExtension(uiSurpassHint.URL, uiSurpassHint);
	}
}
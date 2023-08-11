/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
import uiActivityAward from './uiActivityAward';
import uiActivityAwardItem from './uiActivityAwardItem';
import uiActivityEndPopup from './uiActivityEndPopup';
import uiActivityMain from './uiActivityMain';



export default class activityBinder {
	public static bindAll(): void {
		fgui.UIObjectFactory.setExtension(uiActivityMain.URL, uiActivityMain);
		fgui.UIObjectFactory.setExtension(uiActivityEndPopup.URL, uiActivityEndPopup);
		fgui.UIObjectFactory.setExtension(uiActivityAward.URL, uiActivityAward);
		fgui.UIObjectFactory.setExtension(uiActivityAwardItem.URL, uiActivityAwardItem);
	}
}
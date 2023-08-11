/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_scoreExchangeBtn from "./UI_scoreExchangeBtn";
import UI_MyGiftButton from "./UI_MyGiftButton";
import UI_NoticeBoard from "./UI_NoticeBoard";

export default class GameCommonBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_scoreExchangeBtn.URL, UI_scoreExchangeBtn);
		fgui.UIObjectFactory.setExtension(UI_MyGiftButton.URL, UI_MyGiftButton);
		fgui.UIObjectFactory.setExtension(UI_NoticeBoard.URL, UI_NoticeBoard);
	}
}
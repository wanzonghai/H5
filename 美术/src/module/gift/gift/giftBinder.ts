/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import uiexchangeConfirm from "./uiexchangeConfirm";
import uiexchangeFail from "./uiexchangeFail";
import uiexchangeSuccess from "./uiexchangeSuccess";
import uiMain from "./uiMain";
import uiGiftInfo from "./uiGiftInfo";
import uiGiftItem from "./uiGiftItem";
import uiMyGiftButton from "./uiMyGiftButton";
import uiscoreExchangeBtn from "./uiscoreExchangeBtn";

export default class giftBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(uiexchangeConfirm.URL, uiexchangeConfirm);
		fgui.UIObjectFactory.setExtension(uiexchangeFail.URL, uiexchangeFail);
		fgui.UIObjectFactory.setExtension(uiexchangeSuccess.URL, uiexchangeSuccess);
		fgui.UIObjectFactory.setExtension(uiMain.URL, uiMain);
		fgui.UIObjectFactory.setExtension(uiGiftInfo.URL, uiGiftInfo);
		fgui.UIObjectFactory.setExtension(uiGiftItem.URL, uiGiftItem);
		fgui.UIObjectFactory.setExtension(uiMyGiftButton.URL, uiMyGiftButton);
		fgui.UIObjectFactory.setExtension(uiscoreExchangeBtn.URL, uiscoreExchangeBtn);
	}
}
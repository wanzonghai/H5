/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_exchangeConfirm from "./UI_exchangeConfirm";
import UI_exchangeFail from "./UI_exchangeFail";
import UI_exchangeSuccess from "./UI_exchangeSuccess";
import UI_Main from "./UI_Main";
import UI_GiftInfo from "./UI_GiftInfo";
import UI_GiftItem from "./UI_GiftItem";
import UI_MyGiftButton from "./UI_MyGiftButton";
import UI_scoreExchangeBtn from "./UI_scoreExchangeBtn";

export default class giftBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_exchangeConfirm.URL, UI_exchangeConfirm);
		fgui.UIObjectFactory.setExtension(UI_exchangeFail.URL, UI_exchangeFail);
		fgui.UIObjectFactory.setExtension(UI_exchangeSuccess.URL, UI_exchangeSuccess);
		fgui.UIObjectFactory.setExtension(UI_Main.URL, UI_Main);
		fgui.UIObjectFactory.setExtension(UI_GiftInfo.URL, UI_GiftInfo);
		fgui.UIObjectFactory.setExtension(UI_GiftItem.URL, UI_GiftItem);
		fgui.UIObjectFactory.setExtension(UI_MyGiftButton.URL, UI_MyGiftButton);
		fgui.UIObjectFactory.setExtension(UI_scoreExchangeBtn.URL, UI_scoreExchangeBtn);
	}
}
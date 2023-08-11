import UI_MyGiftButton from "./gift/UI_MyGiftButton";
import UI_scoreExchangeBtn from "./gift/UI_scoreExchangeBtn";
import uiexchangeConfirm from "./uiexchangeConfirm";
import uiexchangeFail from "./uiexchangeFail";
import uiexchangeSuccess from "./uiexchangeSuccess";
import uiGiftInfo from "./uiGiftInfo";
import uiGiftItem from "./uiGiftItem";
import uiGiftMain from "./uiGiftMain";



export default class giftBinder {
	public static bindAll(): void {
		fgui.UIObjectFactory.setExtension(uiexchangeConfirm.URL, uiexchangeConfirm);
		fgui.UIObjectFactory.setExtension(uiexchangeFail.URL, uiexchangeFail);
		fgui.UIObjectFactory.setExtension(uiexchangeSuccess.URL, uiexchangeSuccess);
		fgui.UIObjectFactory.setExtension(uiGiftMain.URL, uiGiftMain);
		fgui.UIObjectFactory.setExtension(uiGiftInfo.URL, uiGiftInfo);
		fgui.UIObjectFactory.setExtension(uiGiftItem.URL, uiGiftItem);
		fgui.UIObjectFactory.setExtension(UI_MyGiftButton.URL, UI_MyGiftButton);
		fgui.UIObjectFactory.setExtension(UI_scoreExchangeBtn.URL, UI_scoreExchangeBtn);
	}
}
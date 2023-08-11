
import UI_prizeItem from "./baseBag/UI_prizeItem";
import UI_textInput from "./baseBag/UI_textInput";
import uiAddressAlert from "./uiAddressAlert";
import uiBaseBagMain from "./uiBaseBagMain";
import uiInputRewardAdress from "./uiInputRewardAdress";

export default class baseBagBinder {

	public static bindAll(): void {

		//////////////////////////////////////////////////////////////////////////////////////
		//手动导入
		//////////////////////////////////////////////////////////////////////////////////////
		fgui.UIObjectFactory.setExtension(uiBaseBagMain.URL, uiBaseBagMain);
		fgui.UIObjectFactory.setExtension(uiAddressAlert.URL, uiAddressAlert);
		fgui.UIObjectFactory.setExtension(uiInputRewardAdress.URL, uiInputRewardAdress);
		//////////////////////////////////////////////////////////////////////////////////////
		//自动生成的部分，需手动拷贝过来
		//////////////////////////////////////////////////////////////////////////////////////
		fgui.UIObjectFactory.setExtension(UI_textInput.URL, UI_textInput);
		fgui.UIObjectFactory.setExtension(UI_prizeItem.URL, UI_prizeItem);
	}
}
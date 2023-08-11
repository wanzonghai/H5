/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_Main from "./UI_Main";
import UI_rankItem from "./UI_rankItem";
import UI_lastRankBtn from "./UI_lastRankBtn";
import UI_awardItem from "./UI_awardItem";
import UI_Awards from "./UI_Awards";
import UI_LastRank from "./UI_LastRank";
import UI_banner from "./UI_banner";
import UI_selfItem from "./UI_selfItem";
import UI_ResultRank from "./UI_ResultRank";
import UI_GetReward from "./UI_GetReward";
import UI_rankItem2 from "./UI_rankItem2";

export default class rankBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_Main.URL, UI_Main);
		fgui.UIObjectFactory.setExtension(UI_rankItem.URL, UI_rankItem);
		fgui.UIObjectFactory.setExtension(UI_lastRankBtn.URL, UI_lastRankBtn);
		fgui.UIObjectFactory.setExtension(UI_awardItem.URL, UI_awardItem);
		fgui.UIObjectFactory.setExtension(UI_Awards.URL, UI_Awards);
		fgui.UIObjectFactory.setExtension(UI_LastRank.URL, UI_LastRank);
		fgui.UIObjectFactory.setExtension(UI_banner.URL, UI_banner);
		fgui.UIObjectFactory.setExtension(UI_selfItem.URL, UI_selfItem);
		fgui.UIObjectFactory.setExtension(UI_ResultRank.URL, UI_ResultRank);
		fgui.UIObjectFactory.setExtension(UI_GetReward.URL, UI_GetReward);
		fgui.UIObjectFactory.setExtension(UI_rankItem2.URL, UI_rankItem2);
	}
}
import UI_awardItem from "./Rank/UI_awardItem";
import UI_banner from "./Rank/UI_banner";
import UI_GetReward from "./Rank/UI_GetReward";
import UI_LastRank from "./Rank/UI_LastRank";
import UI_lastRankBtn from "./Rank/UI_lastRankBtn";
import UI_rankItem from "./Rank/UI_rankItem";
import UI_rankItem2 from "./Rank/UI_rankItem2";
import UI_ResultRank from "./Rank/UI_ResultRank";
import UI_selfItem from "./Rank/UI_selfItem";
import uiAwards from "./uiAwards";
import uiGetReward from "./uiGetReward";
import uiLastRank from "./uiLastRank";
import uiRankMain from "./uiRankMain";
import uiResultRank from "./uiResultRank";

export default class RankBinder {

	public static bindAll():void {

        //////////////////////////////////////////////////////////////////////////////////////
        //手动导入
        //////////////////////////////////////////////////////////////////////////////////////
		fgui.UIObjectFactory.setExtension(uiRankMain.URL, uiRankMain);         
		fgui.UIObjectFactory.setExtension(uiAwards.URL, uiAwards);
		fgui.UIObjectFactory.setExtension(UI_ResultRank.URL, uiResultRank);
		fgui.UIObjectFactory.setExtension(UI_LastRank.URL, uiLastRank);
		fgui.UIObjectFactory.setExtension(UI_GetReward.URL, uiGetReward);

        //////////////////////////////////////////////////////////////////////////////////////
        //自动生成的部分，需手动拷贝过来
        //////////////////////////////////////////////////////////////////////////////////////
		fgui.UIObjectFactory.setExtension(UI_rankItem.URL, UI_rankItem);
		fgui.UIObjectFactory.setExtension(UI_lastRankBtn.URL, UI_lastRankBtn);
		fgui.UIObjectFactory.setExtension(UI_awardItem.URL, UI_awardItem);
		fgui.UIObjectFactory.setExtension(UI_banner.URL, UI_banner);
		fgui.UIObjectFactory.setExtension(UI_selfItem.URL, UI_selfItem);
		fgui.UIObjectFactory.setExtension(UI_rankItem2.URL, UI_rankItem2);
	}
}
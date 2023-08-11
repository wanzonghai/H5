/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_award from "./UI_award";
import UI_buyItem from "./UI_buyItem";
import UI_TaskBrowse from "./UI_TaskBrowse";
import UI_TaskExtraPopup from "./UI_TaskExtraPopup";
import UI_browseItem from "./UI_browseItem";
import UI_taskItem from "./UI_taskItem";
import UI_collectItem from "./UI_collectItem";
import UI_rewardCom from "./UI_rewardCom";
import UI_TaskInvite from "./UI_TaskInvite";
import UI_coinCom from "./UI_coinCom";
import UI_GetReward from "./UI_GetReward";
import UI_Main from "./UI_Main";
import UI_TaskPrecondition from "./UI_TaskPrecondition";

export default class TaskBinder {
	public static bindAll():void {
		fgui.UIObjectFactory.setExtension(UI_award.URL, UI_award);
		fgui.UIObjectFactory.setExtension(UI_buyItem.URL, UI_buyItem);
		fgui.UIObjectFactory.setExtension(UI_TaskBrowse.URL, UI_TaskBrowse);
		fgui.UIObjectFactory.setExtension(UI_TaskExtraPopup.URL, UI_TaskExtraPopup);
		fgui.UIObjectFactory.setExtension(UI_browseItem.URL, UI_browseItem);
		fgui.UIObjectFactory.setExtension(UI_taskItem.URL, UI_taskItem);
		fgui.UIObjectFactory.setExtension(UI_collectItem.URL, UI_collectItem);
		fgui.UIObjectFactory.setExtension(UI_rewardCom.URL, UI_rewardCom);
		fgui.UIObjectFactory.setExtension(UI_TaskInvite.URL, UI_TaskInvite);
		fgui.UIObjectFactory.setExtension(UI_coinCom.URL, UI_coinCom);
		fgui.UIObjectFactory.setExtension(UI_GetReward.URL, UI_GetReward);
		fgui.UIObjectFactory.setExtension(UI_Main.URL, UI_Main);
		fgui.UIObjectFactory.setExtension(UI_TaskPrecondition.URL, UI_TaskPrecondition);
	}
}
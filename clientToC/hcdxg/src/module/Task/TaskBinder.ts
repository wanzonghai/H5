/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import uiaward from "./uiaward";
import uibrowseItem from "./uibrowseItem";
import uibuyItem from "./uibuyItem";
import uicoinCom from "./uicoinCom";
import uicollectItem from "./uicollectItem";
import uiGetReward from "./uiGetReward";
import uirewardCom from "./uirewardCom";
import uiTaskBrowse from "./uiTaskBrowse";
import uiTaskExtraPopup from "./uiTaskExtraPopup";
import uiTaskInvite from "./uiTaskInvite";
import uitaskItem from "./uitaskItem";
import uiTaskMain from "./uiTaskMain";
import uiTaskPrecondition from "./uiTaskPrecondition";


export default class TaskBinder {
	public static bindAll(): void {
		fgui.UIObjectFactory.setExtension(uiaward.URL, uiaward);
		fgui.UIObjectFactory.setExtension(uibuyItem.URL, uibuyItem);
		fgui.UIObjectFactory.setExtension(uiTaskBrowse.URL, uiTaskBrowse);
		fgui.UIObjectFactory.setExtension(uiTaskExtraPopup.URL, uiTaskExtraPopup);
		fgui.UIObjectFactory.setExtension(uibrowseItem.URL, uibrowseItem);
		fgui.UIObjectFactory.setExtension(uitaskItem.URL, uitaskItem);
		fgui.UIObjectFactory.setExtension(uicollectItem.URL, uicollectItem);
		fgui.UIObjectFactory.setExtension(uirewardCom.URL, uirewardCom);
		fgui.UIObjectFactory.setExtension(uiTaskInvite.URL, uiTaskInvite);
		fgui.UIObjectFactory.setExtension(uicoinCom.URL, uicoinCom);
		fgui.UIObjectFactory.setExtension(uiGetReward.URL, uiGetReward);
		fgui.UIObjectFactory.setExtension(uiTaskMain.URL, uiTaskMain);
		fgui.UIObjectFactory.setExtension(uiTaskPrecondition.URL, uiTaskPrecondition);
	}
}
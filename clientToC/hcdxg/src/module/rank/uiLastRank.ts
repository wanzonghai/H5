import { ModuleGlobal } from "../ModuleGlobal";
import ModulePackage from "../ModulePackage";
import ModuleWindow from "../ModuleWindow";
import UI_LastRank from "./Rank/UI_LastRank";
import UI_rankItem from "./Rank/UI_rankItem";

export default class uiLastRank extends UI_LastRank {

	private _winHandler: ModuleWindow;

	private _lastRankData: {

		"code": number,
		"msg": string,
		"data": {
			"rankInfo": {
				"users": number,
				"lotteryEndTime": number,
				"lotteryUsers": number
			},
			"userRankList": [
				{
					"rankNo": number,
					"userOpenId": string,
					"nickName": string,
					"avatar": string,
					"score": number,
					"prizeInfo": {
						"prizeId": string,
						"prizeName": string,
						"prizePicture": string,
						"prizePrice": string,
						"prizeUrl": string
					}
				}
			],
			"userRankInfo": {
				"rankNo": number,
				"score": number,
				"prizePicture": string,
				"status": number,
				"prizeId": string
			},
			"rankStatus": number
		}
	};

	protected onConstruct(): void {

		super.onConstruct();

		this.m_btnGetReward.onClick(this, this._OnGetRewardClick);
		this.m_btnGetRewardGray.onClick(this, this._OnGetRewardGrayClick);
	}
	/**
	 * 初始化方法，由于不能多继承，重载基类的这个方法来完成Init，和Init一样正常这个方法也是只会调用一次。
	 * 另，这个方法不能传参，暂时由data来传递窗口的handler
	 */
	makeFullScreen(): void {

		super.makeFullScreen();	//先处理全屏

		//初始化
		this._winHandler = this.data as ModuleWindow;

		this.data = null;

		if (this._winHandler != null) {

			this._LoadLastRankData();
		}
	}

	private _LoadLastRankData(): void {

		ModulePackage.Instance.SendNetMessage("", "/C/rank/list", {
			activityId: ModuleGlobal.ActivityID,
			// actId: 2,
			type: "pre",
			// userOpenId: "9872"

		}, "post", this, (data) => {

			Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);

			this._winHandler.closeModalWait();

			this._lastRankData = data;

			this.OnShow();
		});

		Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
	}

	private _OnGetRewardClick(item: any) {
		if (!this._lastRankData.data.userRankInfo) return;

		let index = this._lastRankData.data.userRankInfo.rankNo - 1;

		let selfData = this._lastRankData.data.userRankList[index];

		console.log(selfData);

		ModulePackage.Instance.PopWindow("rank", "GetReward", { px: 0, py: 0, winParamData: selfData.prizeInfo });
	}

	private _OnGetRewardGrayClick(item: any) {
		console.log(item);

		this._winHandler.hide();
	}
	/**
	 * 列表项渲染函数
	 * 正确用法，btn.onClick(this._OnClick); 
	 * 错误用法，btn.onClick(()=>{}); 这里不应该使用临时函数
	 * @param index
	 * @param obj
	 */
	private _OnRenderItem(index: number, obj: fgui.GObject): void {

		console.log("-------------------:" + index);

		var rankItem = obj as UI_rankItem;

		let itemData = this._lastRankData.data.userRankList[index];

		if (!!itemData) {

			if (index == 0) {

				rankItem.m_ctrlRank.setSelectedPage("第一");

			} else if (index == 1) {

				rankItem.m_ctrlRank.setSelectedPage("第二");

			} else if (index == 2) {

				rankItem.m_ctrlRank.setSelectedPage("第三");

			} else {

				rankItem.m_ctrlRank.setSelectedPage("其他");
			}

			rankItem.m_rankTxt.text = itemData.rankNo.toString();

			rankItem.m_nameTxt.text = itemData.nickName;

			rankItem.m_scoreTxt.text = itemData.score.toString();

			rankItem.m_avatarLoader.url = itemData.avatar;

			if (itemData.prizeInfo != null) {
				rankItem.m_ctrlHaveAward.setSelectedPage("有奖励");
				rankItem.m_awardBtn.icon = itemData.prizeInfo.prizePicture;
			}
			else {
				rankItem.m_ctrlHaveAward.setSelectedPage("没有奖励");
			}
		}
	}

	public OnShow(): void {

		console.log("_InitView~~~");

		if (this._winHandler.isShowing == false) return;

		try {

			//排行榜列表
			this.m_listLastRank.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, null, false);

			this.m_listLastRank.setVirtual();

			this.m_listLastRank.numItems = this._lastRankData.data.userRankList.length;

			if (this.m_listLastRank.numItems > 0) //有排行榜
			{
				this.m_ctrlLastRankStatus.setSelectedPage("有排行");
			}
			else {
				this.m_ctrlLastRankStatus.setSelectedPage("没有排行");
			}

			//领奖按钮状态设置
			if (this._lastRankData.data.rankStatus == 1)	//已颁奖
			{
				console.log(this._lastRankData.data.rankStatus, "~~~~~~~~~~~~~~~~~~~~~~~~~~1");
			}
			else if (this._lastRankData.data.rankStatus == 2) {
				console.log(this._lastRankData.data.rankStatus, "~~~~~~~~~~~~~~~~~~~~~~~~~~2");
				this.m_ctrlRewardStatus.setSelectedPage("有奖励人数不足");
			}
			else {
				this.m_ctrlRewardStatus.setSelectedPage("无奖励");
				console.log(this._lastRankData.data.rankStatus, "~~~~~~~~~~~~~~~~~~~~~~~~~~0");
			}

			//设置隐藏监听，用于窗口关闭时的本类数据清理。
			this._winHandler.SetHideCallBack(this, this.OnHide);

			//若无排行信息说明上期没参加
			if (!this._lastRankData.data.userRankInfo) {

				this.m_ctrlLastRankStatus.setSelectedPage("有排行但无自己排行");
				return;
			}

			if (this._lastRankData.data.userRankInfo.status == 0) //未领取时
			{
				this.m_ctrlRewardStatus.setSelectedPage("可领奖");
			}
			else {
				this.m_ctrlRewardStatus.setSelectedPage("已领奖");
			}

			let index = this._lastRankData.data.userRankInfo.rankNo - 1;

			let selfData = this._lastRankData.data.userRankList[index];

			//自己的排行设置
			this.m_myItem.m_rankTxt.text = selfData.rankNo.toString();

			if (index == 0) {

				this.m_myItem.m_ctrlRank.setSelectedPage("第一");

			} else if (index == 1) {

				this.m_myItem.m_ctrlRank.setSelectedPage("第二");

			} else if (index == 2) {

				this.m_myItem.m_ctrlRank.setSelectedPage("第三");

			} else {

				this.m_myItem.m_ctrlRank.setSelectedPage("其他");
			}

			this.m_myItem.m_rankTxt.text = selfData.rankNo.toString();

			this.m_myItem.m_nameTxt.text = selfData.nickName;

			this.m_myItem.m_scoreTxt.text = selfData.score.toString();

			this.m_myItem.m_avatarLoader.url = selfData.avatar;

			if (selfData.prizeInfo != null) {
				this.m_myItem.m_ctrlHaveAward.setSelectedPage("有奖励");
				this.m_myItem.m_awardBtn.icon = selfData.prizeInfo.prizePicture;
			}
			else {
				this.m_myItem.m_ctrlHaveAward.setSelectedPage("没有奖励");
			}


		}
		catch (e) {
			console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", e);
		}
	}

	public OnHide(): void {
		console.log("OnHide~~~");
	}

}
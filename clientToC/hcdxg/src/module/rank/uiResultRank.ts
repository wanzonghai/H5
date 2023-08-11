import { ModuleGlobal } from './../ModuleGlobal';
import ModulePackage from "../ModulePackage";
import { ModulePlatformAPI } from "../ModulePlatformAPI";
import ModuleWindow from "../ModuleWindow";
import UI_rankItem2 from "./Rank/UI_rankItem2";
import UI_ResultRank from "./Rank/UI_ResultRank";


export default class uiResultRank extends UI_ResultRank {

	private _winHandler: ModuleWindow;

	private _winParamData: { title: string, score: number, target: any, callBack: Function };

	private _bDataIsReady = false;

	private _bIsShown = false;

	private _bIsReStart = false;
	/**
	 * 最新排行榜数据
	 */
	private _newRankData: {

		"code": number,
		"msg": string,
		"data": {
			"rankNo": number,
			"score": number
		}
	};

	/**
	 * 排行榜数据
	 */
	private _rankData: {

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

		this.m_btnOk.onClick(this, () => {

			this._bIsReStart = true;

			this._winHandler.hide();
		});
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
			//获取弹出窗口是传进来的参数,这里是一个回调函数,用来处理再次进入游戏的逻辑
			this._winParamData = this._winHandler.GetParamData();
			//设置显示监听，用于窗口打开时的本类数据初始化。
			this._winHandler.SetShowCallBack(this, this.OnShow);
			//设置隐藏监听，用于窗口关闭时的本类数据清理。
			this._winHandler.SetHideCallBack(this, this.OnHide);

			this.m_frame.title = this._winParamData.title;

			this._CommitRankScore();
		}
	}

	private _CommitRankScore(): void {

		ModulePackage.Instance.SendNetMessage("", "/C/rank/commit", {

			// actId: 2,
			score: this._winParamData.score,
			// userOpenId: "9872"

		}, "post", this, (data) => {

			this._newRankData = data;

			ModulePackage.Instance.SendNetMessage("", "/C/rank/list", {
				activityId: ModuleGlobal.ActivityID,
				// actId: 2,
				type: "now",
				// userOpenId: "9872"

			}, "post", this, (data) => {

				Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);

				this._winHandler.closeModalWait();

				this._rankData = data;

				this._bDataIsReady = true;

				this.OnShow();
			});
		});

		Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
	}

	/**
	 * 点击物品详情事件
	 */
	private _OnItemInfoClick(evt: Event, itemUrl: string): void {

		console.log(evt, itemUrl);

		ModulePlatformAPI.OpenShopItemDetail("641416140869");
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

		var rankItem = obj as UI_rankItem2;

		let itemData = this._rankData.data.userRankList[index];

		if (!!itemData) {

			if (index == 0) {

				rankItem.m_rank.setSelectedPage("第一");

			} else if (index == 1) {

				rankItem.m_rank.setSelectedPage("第二");

			} else if (index == 2) {

				rankItem.m_rank.setSelectedPage("第三");

			} else {

				rankItem.m_rank.setSelectedPage("其他");
			}

			let currRankIndex = this._rankData.data.userRankInfo.rankNo - 1;

			if (currRankIndex == index) {
				rankItem.m_isSelf.setSelectedPage("自己排行");
			}
			else {
				rankItem.m_isSelf.setSelectedPage("其他人");
			}

			rankItem.m_rankTxt.text = itemData.rankNo.toString();

			rankItem.m_nameTxt.text = itemData.nickName;

			rankItem.m_scoreTxt.text = itemData.score.toString();

			rankItem.m_avatarLoader.url = itemData.avatar;
		}
	}

	/**
	 * 计算下一个奖励的名次
	 */
	private _GetNextGiftNum(): number {
		let currRankIndex = this._rankData.data.userRankInfo.rankNo - 1;

		let nextRankIndex = 0;
		//查找自己排名的前方是否还有奖励
		for (let i = currRankIndex - 1; i > 0; i--) {
			let itemData = this._rankData.data.userRankList[i];

			if (itemData.prizeInfo != null) {
				nextRankIndex = i;
				break;
			}
		}

		return currRankIndex - nextRankIndex;
	}

	public OnShow(): void {

		if (this._winHandler.isShowing == false) return;

		if (this._bDataIsReady == false) return;

		if (this._bIsShown == true) return;

		console.log("OnShow~~~");

		let num = this._GetNextGiftNum();

		if (num == 0) {
			this.m_ctrlFrontStatus.setSelectedPage("保持");
			this.m_txtFornt.setVar("num", this._rankData.data.userRankInfo.rankNo.toString()).flushVars();
		}
		else {
			this.m_ctrlFrontStatus.setSelectedPage("前进");
			this.m_txtFornt.setVar("num", num.toString()).flushVars();
		}

		let currRankIndex = this._rankData.data.userRankInfo.rankNo - 1;

		let itemData = this._rankData.data.userRankList[currRankIndex - num];

		console.log("-----------------------------------------------1", itemData);

		try {

			this.m_txtItemName.text = itemData.prizeInfo.prizeName;
			console.log("-----------------------------------------------2");
			this.m_txtPrice.setVar("money", itemData.prizeInfo.prizePrice.toString()).flushVars();
			console.log("-----------------------------------------------3");
			this.m_itemHead.url = itemData.prizeInfo.prizePicture;
			console.log("-----------------------------------------------4");
			this.m_btnItemInfo.onClick(this, this._OnItemInfoClick, [itemData.prizeInfo.prizeUrl]);

			console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~1");

			//排行榜列表
			this.m_listNewRank.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, null, false);

			console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~2");
			this.m_listNewRank.setVirtual();

			console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~3");
			this.m_listNewRank.numItems = this._rankData.data.userRankList.length;

			console.log(this.m_listNewRank.numItems, "~~~~~~~~~~~~4", this.m_listNewRank);

			// let index = this._rankData.data.userRankInfo.rankNo - 1;

			// let selfData = this._rankData.data.userRankList[index];
		}
		catch (e) {
			console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~5", e);
		}

		this._bIsShown = true;
	}


	public OnHide(): void {

		console.log("OnHide~~~");

		if (!!this._winParamData && !!this._winParamData.target && !!this._winParamData.callBack) {
			this._winParamData.callBack.call(this._winParamData.target, this._bIsReStart);
		}
	}

}
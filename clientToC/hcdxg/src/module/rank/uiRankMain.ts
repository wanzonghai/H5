import ModulePackage from "../ModulePackage";
import ModuleWindow from "../ModuleWindow";
import UI_Main from "./Rank/UI_Main";
import UI_rankItem from "./Rank/UI_rankItem";
import { ModuleAudio, ModuleTool } from './../ModuleTool';
import { ModuleGlobal } from "../ModuleGlobal";
import { ModulePlatformAPI } from './../ModulePlatformAPI';
import { ModuleSkins } from "../ModuleSkins";

export default class uiRankMain extends UI_Main {

	private _winHandler: ModuleWindow;

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

		this.m_inviteBtn.onClick(this, () => {

			ModuleAudio.PlayComonBtnAudio();
			ModulePackage.Instance.SendMessage("rank", "task", "show");	//调用任务模块的显示方法
		});

		this.m_myPanel.m_ruleBtn.onClick(this, () => {
			//显示奖励详情
			ModulePackage.Instance.PopWindow("rank", "Awards");
			ModuleAudio.PlayComonBtnAudio();
		});

		this.m_myPanel.m_lastRankBtn.onClick(this, () => {
			//显示上期排行
			ModulePackage.Instance.PopWindow("rank", "LastRank");
			ModuleAudio.PlayComonBtnAudio();
		});
		this.changeSkin();
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

			this._LoadRankData();
			//设置隐藏监听，用于窗口关闭时的本类数据清理。
			this._winHandler.SetHideCallBack(this, this.OnHide);
		}
	}
	changeSkin() {
		ModuleSkins.ChangeSkin(this.m_topLoader.m_topLoader, 'rankingBanner');
		ModuleSkins.ChangeFguiICON(this.m_myPanel.m_ruleBtn, 'prizeIcon');
	}


	private _LoadRankData(): void {


		this.m_curList.visible = false;
		this.m_topLoader.m_timeTxt.visible = false;
		let _getdata = (_data) => {
			console.log('_getdata', _data);

			this._rankData = _data;

			this.OnShow();
		}
		// console.error('_LoadRankData');

		if (ModulePackage.Instance.CanUseNetAPI()) {
			ModulePackage.Instance.SendNetMessage("", "/C/rank/list", {
				activityId: ModuleGlobal.ActivityID,
				// activityId: 2,
				type: "now",
				// userOpenId: "9872"
			}, "post", this, (data) => {

				// console.log("data111111111111111111111111111111111111111111111111111", data);

				Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);

				this._winHandler.closeModalWait();
				_getdata(data)

			});

			Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
		}
		else {
			_getdata({

				"code": 0,
				"msg": '',
				"data": {
					"rankInfo": {
						"users": 123,
						// "lotteryEndTime": 162233280000,
						"lotteryUsers": 30
					},
					"userRankList": [{
						"rankNo": 1,
						"userOpenId": 'string',
						"nickName": '第一名',
						"avatar": '',
						"score": 100,
						// "prizeInfo": {
						// 	"prizeId": string,
						// 	"prizeName": string,
						// 	"prizePicture": string,
						// 	"prizePrice": string,
						// 	"prizeUrl": string
						// }
					},
					{
						"rankNo": 2,
						"userOpenId": 'string',
						"nickName": '第2名',
						"avatar": '',
						"score": 90,
						// "prizeInfo": {
						// 	"prizeId": string,
						// 	"prizeName": string,
						// 	"prizePicture": string,
						// 	"prizePrice": string,
						// 	"prizeUrl": string
						// }
					},
					{
						"rankNo": 1,
						"userOpenId": 'string',
						"nickName": '第3名',
						"avatar": '',
						"score": 80,
						// "prizeInfo": {
						// 	"prizeId": string,
						// 	"prizeName": string,
						// 	"prizePicture": string,
						// 	"prizePrice": string,
						// 	"prizeUrl": string
						// }
					},
					],
					"userRankInfo": {
						"rankNo": 0,
						"score": 0,
					},
					// "rankStatus": number
				}
			});
		}

	}

	private static curRenderID = 0;
	/**
	 * 列表项渲染函数
	 * 正确用法，btn.onClick(this._OnClick); 
	 * 错误用法，btn.onClick(()=>{}); 这里不应该使用临时函数
	 * @param index
	 * @param item
	 */
	private _OnRenderItem(_id: number, index: number, item: fgui.GObject): void {

		console.log("------------_OnRenderItem-------:" + index);

		if (item['isInited'] && item['isInited'] == index + 1) {
			//重复绘制不再更新信息
			return;
		}
		console.log("_OnRenderItem:---22", index);
		item['isInited'] = index + 1;

		var rankItem = item as UI_rankItem;

		let itemData = this._rankData.data.userRankList[index];

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

			let _avatar = 'ui://qkteqwfpctsq32'
			if (itemData.avatar && itemData.avatar.indexOf('http') >= 0) {
				_avatar = itemData.avatar;
			}
			rankItem.m_avatarLoader.url = _avatar;

			if (itemData.prizeInfo != null) {
				rankItem.m_ctrlHaveAward.setSelectedPage("有奖励");
				rankItem.m_awardBtn.icon = itemData.prizeInfo.prizePicture;
			}
			else {
				rankItem.m_ctrlHaveAward.setSelectedPage("没有奖励");
			}
		}


		//执行进入动画
		let _action = uiRankMain.curRenderID == _id;
		item.visible = !_action;
		if (_action) {
			Laya.timer.once(index * 150, this, () => {
				// if(uiTaskMain.curRenderID != _id){
				//     return;
				// }
				item.visible = true;
				item.x = item.width;
				Laya.Tween.to(item, { x: 0 }, 200);
			})
		}
	}

	public OnShow(): void {
		console.log("OnShow~~~");

		if (!this._winHandler || this._winHandler.visible == false) return;

		console.log("_InitView~~~");

		this.m_curList.visible = true;
		this.m_myPanel.m_ctrLastRankStatus.setSelectedPage('不显示');

		if (this._rankData.data.rankInfo.lotteryEndTime && this._rankData.data.rankInfo.lotteryEndTime > 0) {
			this.m_topLoader.m_timeTxt.visible = true;
			//活动信息
			let surviveTime = this._rankData.data.rankInfo.lotteryEndTime - new Date().getTime();
			if (surviveTime <= 0) {
				this.m_topLoader.m_timeTxt.text = '已经开奖喽~';
			}
			else {
				this.m_topLoader.m_timeTxt.setVar("time", ModuleTool.SurviveTimeToString(surviveTime / 1000)).flushVars();
				Laya.timer.loop(1000, this, this._UpdateSurviveTime);
			}

		}

		// console.log("----------------------------------------------------------------");
		// console.log(ModuleTool.TimestampToString(new Date().getTime()));
		// console.log(ModuleTool.TimestampToString(this._rankData.data.rankInfo.lotteryEndTime));
		// console.log("----------------------------------------------------------------");


		this.m_topLoader.m_numTxt.setVar("num", this._rankData.data.rankInfo.users.toString()).flushVars();
		this.m_topLoader.m_txtMaxNum.setVar("num", this._rankData.data.rankInfo.lotteryUsers.toString()).flushVars();

		uiRankMain.curRenderID++;
		//排行榜列表
		this.m_curList.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, [uiRankMain.curRenderID], false);

		this.m_curList.setVirtual();

		this.m_curList.numItems = !!this._rankData.data.userRankList ? this._rankData.data.userRankList.length : 0;

		uiRankMain.curRenderID++;
		if (this._rankData.data.userRankInfo && this._rankData.data.userRankInfo.rankNo > 0
			&& this._rankData.data.userRankInfo.rankNo <= this._rankData.data.userRankList.length) {
			let index = this._rankData.data.userRankInfo.rankNo - 1;

			let selfData = this._rankData.data.userRankList[index];

			this.m_myPanel.m_myItem.m_rankTxt.setScale(1, 1);
			//自己的排行
			this.m_myPanel.m_myItem.m_rankTxt.text = selfData.rankNo.toString();

			if (selfData.nickName) {
				this.m_myPanel.m_myItem.m_nameTxt.text = selfData.nickName;
			}
			else {
				ModulePlatformAPI.GetUserInfo((_info) => {
					this.m_myPanel.m_myItem.m_nameTxt.text = _info.nickName;

					this.m_myPanel.m_myItem.m_avatarLoader.url = _info.avatar;
				}, () => {
					this.m_myPanel.m_myItem.m_avatarLoader.url = 'ui://qkteqwfpctsq32';
					this.m_myPanel.m_myItem.m_nameTxt.text = '自己';
				})
			}


			this.m_myPanel.m_myItem.m_scoreTxt.text = selfData.score.toString();

			let _avatar = 'ui://qkteqwfpctsq32'
			if (selfData.avatar && selfData.avatar.indexOf('http') >= 0) {
				_avatar = selfData.avatar;
			}
			this.m_myPanel.m_myItem.m_avatarLoader.url = _avatar;
		}
		else {
			this.m_myPanel.m_myItem.m_rankTxt.setScale(0.7, 0.7);
			this.m_myPanel.m_myItem.m_rankTxt.text = '未上榜';


			this.m_myPanel.m_myItem.m_scoreTxt.text = '' + ModuleGlobal.MyCurrency.wmScore;

			ModulePlatformAPI.GetUserInfo((_info) => {
				this.m_myPanel.m_myItem.m_nameTxt.text = _info.nickName;

				this.m_myPanel.m_myItem.m_avatarLoader.url = _info.avatar;
			}, () => {
				this.m_myPanel.m_myItem.m_avatarLoader.url = 'ui://qkteqwfpctsq32';
			})

		}



	}

	private _UpdateSurviveTime() {

		let surviveTime = this._rankData.data.rankInfo.lotteryEndTime - new Date().getTime();

		this.m_topLoader.m_timeTxt.setVar("time", ModuleTool.SurviveTimeToString(surviveTime / 1000)).flushVars();
	}

	public OnHide(): void {

		console.log("OnHide~~~");

		Laya.stage.offAllCaller(this)
		Laya.timer.clearAll(this);
		Laya.Tween.clearAll(this);

		// Laya.timer.clear(this, this._UpdateSurviveTime);

		// ModulePackage.Instance.PopWindow("rank", "ResultRank", 0, 0, {title: "游戏结束", score: 100, target: this, callBack: () => { 

		// 	console.log("再来一局");
		// } });
	}
}
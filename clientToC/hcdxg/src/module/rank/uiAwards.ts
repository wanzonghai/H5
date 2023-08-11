import ModulePackage from "../ModulePackage";
import { ModulePlatformAPI } from "../ModulePlatformAPI";
import { ModuleAudio, ModuleTool } from "../ModuleTool";
import ModuleWindow from "../ModuleWindow";
import UI_awardItem from "./Rank/UI_awardItem";
import UI_Awards from "./Rank/UI_Awards";

interface rankAwardType {
	"code": number,
	"msg": string,
	"data": [
		{
			rankBegin: number,
			rankEnd: number,
			prizeId: string,
			prizeName: string,
			// prizePicture: string,
			prizePrice: number,
			prizePicture: string,
			prizeUrl?: string
		}

	]
}

export default class uiAwards extends UI_Awards {

	private _winHandler: ModuleWindow;


	private _awardData?: rankAwardType;

	private static cacheData?: rankAwardType;

	protected onConstruct(): void {

		super.onConstruct();
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

			this._LoadAwardData();
		}
	}




	static GetRankData(_callback?: (_data: rankAwardType) => void) {


		if (uiAwards.cacheData) {
			_callback && _callback(uiAwards.cacheData)
			return;
		}

		if (ModulePackage.Instance.CanUseNetAPI()) {
			ModulePackage.Instance.SendNetMessage("", "/C/rank/prize", {

				// actId: 2,

			}, "post", this, (data) => {
				if (data.data && data.data.length > 0) {
					uiAwards.cacheData = data;
				}
				_callback && _callback(data);

			});

		}
		else {
			_callback && _callback({

				"code": 0,
				"msg": '',
				"data": [
					// {
					// 	rankBegin: 1,
					// 	rankEnd: 2,
					// 	prizeId: '111',
					// 	prizeName: '奖品名',
					// 	prizePicture: '',
					// 	prizePrice: 100,
					// 	prizeUrl: ''
					// }
					{
						prizeId: "643091706250",
						prizeName: "王者荣耀卡通手办-公孙离",
						prizePicture: "https://img.alicdn.com/bao/uploaded/i4/2210005895332/O1CN01n5jrMq1pG6UrJzzSC_!!2210005895332.jpg",
						prizePrice: 0.01,
						rankBegin: 1,
						rankEnd: 5
					}

				]
			});
		}
	}
	private _LoadAwardData(): void {
		uiAwards.GetRankData((_data) => {
			this._awardData = _data;
			this.OnShow();
		})
	}

	private _OnItemClick(item: any, index: number) {
		console.log(index);

		let itemData = this._awardData.data[index];

		console.log(itemData);

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

		// console.log("-------------------:" + index);

		var rankItem = obj as UI_awardItem;

		let itemData = this._awardData.data[index];

		// console.log("-------------------:" + itemData);
		// console.log("-------------------:", rankItem);

		if (!!itemData) {

			// //不显示查看奖品按钮
			// rankItem.m_ctrAwardBtn.setSelectedPage('不显示');

			if (itemData.rankBegin == itemData.rankEnd) {

				rankItem.m_txtRank.setVar("rank", itemData.rankBegin.toString()).flushVars();

			} else {

				rankItem.m_txtRank.setVar("rank", itemData.rankBegin + '-' + itemData.rankEnd).flushVars();
			}

			// console.log("-------------------1");
			rankItem.m_txtName.text = ModuleTool.getCutString(itemData.prizeName, 21);
			// console.log("-------------------2");
			rankItem.m_txtPrice.text = '价值：' + itemData.prizePrice.toString() + '元';
			// console.log("-------------------3");
			// rankItem.m_loadItemHead.url = itemData.prizePicture;
			rankItem.m_loadItemHead.url = itemData.prizePicture;
			// console.log("-------------------4");
			// rankItem.m_btnLookInfo.onClick(this, this._OnItemClick, [index]);
		}
	}

	public OnShow(): void {

		if (this._winHandler.visible == false) return;

		console.log("OnShow~~~");
		//排行榜列表
		this.m_listAwards.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, null, false);

		this.m_listAwards.setVirtual();

		// console.log("-----------------------------", this._awardData.data);

		this.m_listAwards.numItems = this._awardData.data.length;

		//设置隐藏监听，用于窗口关闭时的本类数据清理。
		this._winHandler.SetHideCallBack(this, this.OnHide);
	}

	public OnHide(): void {
		console.log("OnHide~~~");
	}


}
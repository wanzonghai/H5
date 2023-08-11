
import { GoodsInfoType, ModuleGlobal } from '../ModuleGlobal';
import ModulePackage from '../ModulePackage';
import { ModulePlatformAPI } from '../ModulePlatformAPI';
import { ModuleAudio } from '../ModuleTool';
import ModuleWindow from '../ModuleWindow';
import UI_TaskBrowse from './Task/UI_TaskBrowse';

export default class uiTaskBrowse extends UI_TaskBrowse {

	private static curBrowse?: uiTaskBrowse;
	//返回选择的 _goodsId
	private static SelectCallBack?: (_goodsId: number) => void
	static curType?: 'browse' | 'buy' | 'collect';
	static Show(_type: 'browse' | 'buy' | 'collect', _selectcallBack?: (_goodsId: number) => void) {
		this.curType = _type;
		this.SelectCallBack = _selectcallBack;
		ModulePackage.Instance.PopWindow("Task", "TaskBrowse");
	}
	static Hide() {
		if (!this.curBrowse) {
			return;
		}
		this.curBrowse._winHandler.hide();
	}


	private _winHandler: ModuleWindow;



	protected onConstruct(): void {

		super.onConstruct();
	}
	/**
	 * 初始化方法，由于不能多继承，重载基类的这个方法来完成Init，和Init一样正常这个方法也是只会调用一次。
	 * 另，这个方法不能传参，暂时由data来传递窗口的handler
	 */
	makeFullScreen(): void {

		// console.error('makeFullScreenmakeFullScreen');

		super.makeFullScreen();	//先处理全屏

		//初始化
		this._winHandler = this.data as ModuleWindow;

		this.data = null;

		if (this._winHandler != null) {

			//设置显示监听，用于窗口关闭时的本类数据清理。
			this._winHandler.SetShowCallBack(this, this.OnShow);
			//设置隐藏监听，用于窗口关闭时的本类数据清理。
			this._winHandler.SetHideCallBack(this, this.OnHide);
			this.SetInfo();

		}
		// this.OnShow();
	}
	SetInfo() {
		Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
		ModuleGlobal.GetGoodsList((_success, _list) => {
			Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);
			this._winHandler.closeModalWait();
			let _text = '有商品'
			if (!_success || _list.length <= 0) {
				_text = '没有商品';
			}
			else {
				let _showList = this.m_list;
				let _typeText = '浏览';
				switch (uiTaskBrowse.curType) {
					case 'browse':
						_typeText = '浏览';
						_showList = this.m_list;
						break;
					case 'buy':
						_typeText = '购买';
						_showList = this.m_buyList;
						break;
					case 'collect':
						_typeText = '收藏';
						_showList = this.m_collectList;
						break;

					default:
						break;
				}
				this.curGoodsList = _list as any;

				this.m_type.setSelectedPage(_typeText);
				let _showp = () => {
					//显示排行榜列表
					_showList.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, null, false);

					_showList.setVirtual();

					_showList.numItems = this.curGoodsList.length;
				}
				if (uiTaskBrowse.curType == 'collect') {
					//排序收藏的商品
					if (this.curGoodsList.length > 0) {
						let _sort = () => {
							this.curGoodsList = this.curGoodsList.sort((a, b) => a.isCollected ? 1 : -1);
							_showp();
						}
						_sort();

					}
				}
				else {
					_showp();
				}



			}
			this.m_haveGoods.setSelectedPage(_text);
		}, undefined, false)
	}
	public OnShow(): void {
		console.log("OnShow~~~");
		uiTaskBrowse.curBrowse = this;
	}

	public OnHide(): void {
		uiTaskBrowse.curBrowse = undefined;
		uiTaskBrowse.curType = undefined;
		console.log("OnHide~~~");
		for (let index = 0; index < this.m_list._children.length; index++) {
			const element = this.m_list.getChildAt(index) as any;
			if (element && element.clearAll) element.clearAll();
		}
		for (let index = 0; index < this.m_buyList._children.length; index++) {
			const element = this.m_buyList.getChildAt(index) as any;
			if (element && element.clearAll) element.clearAll();
		}
		for (let index = 0; index < this.m_collectList._children.length; index++) {
			const element = this.m_collectList.getChildAt(index) as any;
			if (element && element.clearAll) element.clearAll();
		}
		Laya.stage.offAllCaller(this);
		Laya.timer.clearAll(this);
		//隐藏界面触发一次列表更新
		ModuleGlobal.GetGoodsList(undefined, { pageSize: 30, sortType: 'random' });
	}
	private curGoodsList: (GoodsInfoType)[] = [];
	_OnRenderItem(index: number, item: any) {
		// console.log("_OnRenderItem:---", uiTaskBrowse.curType, index);
		item.SetInfo(this.curGoodsList[index], uiTaskBrowse.SelectCallBack);
	}


}
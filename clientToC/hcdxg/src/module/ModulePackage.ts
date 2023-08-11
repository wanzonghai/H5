/**
 * 由服务器生成，禁止手动修改
 */
import AtmosphereBinder from "./atmosphere/AtmosphereBinder";
import baseBagBinder from "./baseBag/baseBagBinder";
import ModuleWindow from "./ModuleWindow";
import rankBinder from "./rank/rankBinder";
import giftBinder from './gift/giftBinder';
import activityBinder from './activity/activityBinder';
import autotriggerAwardBinder from './autotriggerAward/autotriggerAwardBinder';
import TaskBinder from './Task/TaskBinder';
import RuleBinder from './Rule/RuleBinder';
import GeneralInterfaceBinder from './GeneralInterface/GeneralInterfaceBinder';
import { ModuleGlobal } from "./ModuleGlobal";

declare var my;

export default class ModulePackage extends Laya.EventDispatcher {

	public static readonly MODULE_INIT_COMPLETE = "module_init_complete";
	/**
	 * 服务器所在域名，H5时使用
	 */
	public static readonly SERVER_HOST = "https://jd.eroswift.com";//test-service.eroswift.com"
	// public static readonly SERVER_HOST = "http://localhost:3000";//test-service.eroswift.com"
	/**
	 * 服务器云函数名称，淘宝时使用
	 */
	public static readonly SERVER_NAME = "WaterMelonServer"; //ServerBo


	private readonly normalCDNPath = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/normal/C_client/v16/res/module/";

	private static _inst: ModulePackage;


	private _listView: fgui.GComponent;

	private _bIsInited: boolean;

	private _mapNonModules = {};
	private _configData = {

		maxNum: 3,

		modules: [
			{
				name: "common",
				version: "0.0.1",
				description: "基础资源包",
				// resource: "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/taobao/common/", 
				resource: this.normalCDNPath,
				notView: false,
				codePackage: "https://xxxx/common-0.0.1.tgz",
				dependencies: []
			},
			{
				name: "rank",
				version: "0.0.1",
				description: "冲榜模块",
				// resource: "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/taobao/rank/",
				resource: this.normalCDNPath,

				notView: false,
				codePackage: "https://xxxx/rank-0.0.1.tgz",
				dependencies: ["baseBag"]
			},
			{
				name: "baseBag",
				version: "0.0.1",
				description: "奖品包",
				// resource: "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/taobao/baseBag/",
				resource: this.normalCDNPath,
				notView: false,
				codePackage: "https://xxxx/baseBag-0.0.1.tgz",
				dependencies: []
			},
			{
				name: "Atmosphere",
				version: "0.0.1",
				description: "氛围模块",
				// resource: "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/taobao/Atmosphere/",
				resource: this.normalCDNPath,
				notView: false,
				codePackage: "https://xxxx/baseBag-0.0.1.tgz",
				dependencies: []
			},
			{
				name: "gift",
				version: "0.0.1",
				description: "兑换好礼模块",
				// resource: "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/taobao/gift/",
				resource: this.normalCDNPath,
				notView: false,
				codePackage: "https://xxxx/baseBag-0.0.1.tgz",
				dependencies: []
			},
			{
				name: "activity",
				version: "0.0.1",
				description: "活动结束模块",
				// resource: "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/taobao/activity/",
				resource: this.normalCDNPath,
				notView: false,
				codePackage: "https://xxxx/baseBag-0.0.1.tgz",
				dependencies: []
			},
			{
				name: "autotriggerAward",
				version: "0.0.1",
				description: "自动触发奖励模块",
				// resource: "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/taobao/autotriggerAward/",
				resource: this.normalCDNPath,
				notView: false,
				codePackage: "https://xxxx/baseBag-0.0.1.tgz",
				dependencies: []
			},
			{
				name: "Task",
				version: "0.0.1",
				description: "任务模块",
				// resource: "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/taobao/autotriggerAward/",
				resource: this.normalCDNPath,
				notView: false,
				codePackage: "https://xxxx/baseBag-0.0.1.tgz",
				dependencies: []
			},
			{
				name: "Rule",
				version: "0.0.1",
				description: "规则模块",
				// resource: "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/taobao/autotriggerAward/",
				resource: this.normalCDNPath,
				notView: false,
				codePackage: "https://xxxx/baseBag-0.0.1.tgz",
				dependencies: []
			},
			{
				name: "GeneralInterface",
				version: "0.0.1",
				description: "通用ui模块",
				// resource: "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/taobao/autotriggerAward/",
				resource: this.normalCDNPath,
				notView: false,
				codePackage: "https://xxxx/baseBag-0.0.1.tgz",
				dependencies: []
			},
		]
	};

	constructor() {

		super();

		rankBinder.bindAll();

		baseBagBinder.bindAll();

		AtmosphereBinder.bindAll();

		giftBinder.bindAll();

		activityBinder.bindAll();

		autotriggerAwardBinder.bindAll();

		TaskBinder.bindAll();

		RuleBinder.bindAll();

		GeneralInterfaceBinder.bindAll();

		//设置window背景色
		fgui.UIConfig.modalLayerColor = "rgba(00,00,00,0.7)";
		//设置等待旋转图
		fgui.UIConfig.windowModalWaiting = "ui://qwv197ctu2823i";
		fgui.UIConfig.globalModalWaiting = "ui://qwv197ctu2823i";
	}

	public static get Instance(): ModulePackage {

		if (this._inst == null) {
			this._inst = new ModulePackage();

		}

		return this._inst;
	}

	public PreloadResources() {

		let resList: { url: string, type: string }[] = [];

		this._configData.modules.forEach(resModel => {

			if (Laya.Browser.onTBMiniGame) {

				if (resModel.notView) {
					return; //过滤掉没有界面资源的纯代码模块
				}

				resList.push({ url: resModel.resource + resModel.name + ".txt", type: Laya.Loader.BUFFER });
				resList.push({ url: resModel.resource + resModel.name + "_atlas0.png", type: Laya.Loader.IMAGE });

			}
			else {

				if (resModel.notView) {
					return; //过滤掉没有界面资源的纯代码模块
				}

				resList.push({ url: "res/module/" + resModel.name + ".txt", type: Laya.Loader.BUFFER });
				resList.push({ url: "res/module/" + resModel.name + "_atlas0.png", type: Laya.Loader.IMAGE });

			}

		});


		if (resList.length > 0) //加载模块资源
		{
			Laya.loader.load(resList,

				Laya.Handler.create(this, (param) => {     //加载完成

					console.log("完成：", param);

					if (param == true) {

						console.log("开始初始化:", resList);

						//加载FGUI资源
						resList.forEach(element => {

							let extLength = element.url.length - 4;

							if (element.url.substring(extLength) == ".txt") {

								let resPath = element.url.substring(0, extLength);

								// console.log("UIPackage.addPackage:", resPath, fgui);

								fgui.UIPackage.addPackage(resPath);
							}
						});

						//初始化模块
						this.Init();

					} else {

						throw new Error("模块资源加载失败，请检查！")
					}

				}),

				Laya.Handler.create(this, (param) => {     //加载进度

					console.log("进度" + param);
				}, undefined, false)
			);
		}

	}

	public Init(): void {

		console.log("_configData:", this._configData);

		//再循环把模块的【描述和Icon】放到list里面.
		this._configData.modules.forEach(element => {

			console.log("element", element);

			if (element.name == "common") {
				//先初始化一个list。
				this._listView = fgui.UIPackage.createObject("common", "BaseList") as fgui.GComponent;
				return;
			}

			let listModule = this._listView.getChild("listModule") as fgui.GList;

			let labItem = fgui.UIPackage.createObject("common", "BaseListItem") as fgui.GLabel;
			labItem.title = element.description;
			labItem.icon = fgui.UIPackage.getItemURL(element.name, "Icon");
			labItem.onClick(this, this._OnClick, [element.name]);
			listModule.addChild(labItem);
		});

		this._bIsInited = true;

		this.event(ModulePackage.MODULE_INIT_COMPLETE);
	}

	private _OnClick(moduleName: string) {
		console.log(moduleName);

		this.Show(moduleName);
	}

	public IsInitComplete() {
		return this._bIsInited;
	}

	/**
	 * 模块间消息互通的方法
	 * @param srcModuleName 从哪个模块发来的消息
	 * @param callModuleName 要发给哪个模块
	 * @param functionName 要发给哪个模块的哪个方法
	 * @param functionParams 发给这个方法的参数列表
	 */
	public SendMessage(srcModuleName: string, callModuleName: string, functionName: string = "show", functionParams: any[] = null): void {
		let bFlag = false;

		if (srcModuleName == "client") //C端直接调用模块的情况
		{
			bFlag = true;
		}
		else //模块调用模块的情况
		{
			this._configData.modules.forEach(element => {

				if (element.name == srcModuleName) {

					element.dependencies.forEach(element2 => {

						if (element2 == callModuleName) {

							bFlag = true;
						}
					})
				}
			});
		}

		if (bFlag) {
			if (functionName == "show") {
				this.Show(callModuleName);
			}
			else {
				if (!!this._mapNonModules[callModuleName]) {
					this._mapNonModules[callModuleName][functionName](...functionParams);
				}
				else {
					throw new Error(callModuleName + "模块没有找到，不允许调用。");
				}
			}
		}
		else {
			throw new Error(srcModuleName + "模块没有依赖" + callModuleName + "模块，不允许调用。");
		}
	}

	public Show(moduleName: string = "base", positionX: number = 0, positionY: number = 0, parent: fgui.GComponent = null): void {

		if (moduleName == "base") //基础模块
		{
			if (this._listView != null) {

				this._listView.setXY(positionX, positionY);

				this._listView.makeFullScreen();

				if (parent != null) {

					parent.addChild(this._listView);

				} else {

					fgui.GRoot.inst.addChild(this._listView);
				}
			}

		} else {

			this.PopWindow(moduleName, "Main", { px: positionX, py: positionY });
		}
	}

	/**
	 * 弹出一个modal窗口
	 * @param moduleName 弹窗所在模块的
	 * @param windowName 弹窗名字
	 * @param positionX 弹窗x位置
	 * @param positionY 弹窗y位置
	 * @param isModal 是否是模态框(模态框会遮挡点击事件)
	 * @returns void
	 */
	public PopWindow(moduleName: string, windowName: string,
		_config?: {
			px?: number,
			py?: number,
			winParamData?: any,
			isModal?: boolean,
			parent?: fgui.GComponent,
		}
	): void {

		let component = fgui.UIPackage.createObject(moduleName, windowName) as fgui.GComponent;

		if (component == null) return;
		if (!_config) {
			_config = {};
		}

		let winPanel = new ModuleWindow(_config.winParamData);


		winPanel.makeFullScreen(); 		//窗口对象全屏

		winPanel.contentPane = component;


		component.data = winPanel;			//用这个方法传递窗口指针给component


		component.makeFullScreen();		//子组件全屏



		component.setXY(_config.px || 0, _config.py || 0);


		winPanel.modal = _config.isModal === false ? false : true;


		if (_config.parent) {
			_config.parent.addChild(winPanel);

		}
		else {
			winPanel.show();
		}


	}
	/**
	 * 是否可使用网络接口
	 * @returns 
	 */
	public CanUseNetAPI() {
		if (Laya.Browser.onTBMiniGame) {
			return true;
		}
		return true;
	}
	/**
	 * 网络消息发送的方法
	 * @param hostName 要发给哪个服务器【淘宝时需填云函数名称】
	 * @param routeName 要发给云函数的哪个路由【淘宝时会自动转换为云函数handler名字】
	 * @param functionParams (default = null)发给这个云函数的参数列表
	 * @param method (default = "get")用于请求的 HTTP 方法。值包括 "get"、"post"。
	 * @param thisObj  (default = null) 回调函数的this对象
	 * @param callback (default = null) 回调函数
	 */
	public SendNetMessage(hostName: string, routeName: string, functionParams: any = null, method: string = "get", thisObj: any = null, callback: Function = null): void {

		// if (!!callback) callback('');
		// return;
		if (Laya.Browser.onTBMiniGame)//淘宝小游戏时调用淘宝云函数
		{
			// console.log("1111111111111111111111111111111111111111111111");

			let app = getApp();

			console.log(1, app);

			let sendServer = app["sendServer"] as Function;

			if (!!sendServer) {
				console.log(2, sendServer);

				let handulerName = routeName.replace(/\//g, '_');

				if (handulerName[0] == '_') {
					handulerName = handulerName.substring(1);
				}

				console.log(3, handulerName);

				sendServer.call(app, ModulePackage.SERVER_NAME, handulerName, functionParams, thisObj, callback);
			}

			// console.log("22222222222222222222222222222222222222222222222222");
			return;
		}
		console.log('routeName', routeName)
		functionParams = functionParams || {}
		functionParams.activityId=ModuleGlobal.ActivityID;
		console.log("---Request:【" + routeName + "】", functionParams);

		let url = ModulePackage.SERVER_HOST + routeName;

		if (!!hostName && hostName.length > 0)//hostName存在说明需要加一段
		{
			url = ModulePackage.SERVER_HOST + hostName + "/" + routeName;
		}

		if (method == "get") {
			url += "?";

			for (const key in functionParams) {

				if (Object.prototype.hasOwnProperty.call(functionParams, key)) {
					url += key + "=" + functionParams[key] + "&";
				}
			}
		}

		let xhr = new Laya.HttpRequest();

		xhr.http.timeout = 10000;//设置超时时间；

		xhr.once(Laya.Event.COMPLETE, this, (data: any) => {

			console.log("---Response:【" + routeName + "】", data);

			if (!!callback) callback.call(thisObj, JSON.parse(data))
		});

		xhr.once(Laya.Event.ERROR, this, (data: any) => { console.log(data); });

		xhr.on(Laya.Event.PROGRESS, this, (data: any) => { console.log(data); });

		xhr.send(url, method == "get" ? null : functionParams, method, "text/json", null);
	}

};

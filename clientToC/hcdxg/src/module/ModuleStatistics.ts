/**
 * 全局使用的基础数据类
 */

import ModulePackage from "./ModulePackage";
import { ModulePlatformAPI, PlatformListenKey } from './ModulePlatformAPI';


export type GameStateType = 'beforeGame' | 'game' | 'afterGame';
export type ExposureType = 'browse' | 'collect' | 'buy';


/**
 * 支持获取的游戏接口
 * 填入自己游戏对应的GameInfo 字段即可支持
 */
const StatisticsSend = {
	/**打开App*/
	openApp: //
	{
		// type: 'taobao',
		fromUserId: '',//来源
	},
	/**开始加载资源*/
	loadingRes:
		{},
	// /**登录成功*/
	// enterHall:
	// 	{},
	/**退出游戏*/
	exit:
	{
		type: 'default' as 'default',
		playTime: 1
	},
	/**在线时长*/
	activeTime:
	{
		playTime: 1
	},
	/**点击分享按钮*/
	clickShare:
	{
		type: 'beforeGame' as GameStateType
	},
	/**点击分享成功*/
	shareSuccess:
	{
		type: 'default' as 'default',
	},
	// /**完成任务*/
	// task:
	// {
	// 	from: 'beforeGame' as GameStateType,
	// 	type: '1'
	// },
	/**打开任务界面*/
	task:
	{
		from: 'beforeGame' as GameStateType,
		type: '',
	},
	/**点击开始游戏按钮*/
	clickGame:
		{},
	/**曝光*/
	exposure:
	{
		type: 'browse' as ExposureType,
		goodsId: '',
		goodsName: '',
		price: '',
	},
	/**消费记录(当前只是做任务消费记录)*/
	pay:
	{
		type: 'default' as 'default',
		record: {},//消费详情
		nickName: '',//用户名（用户的淘宝名）
		payNum: '',//消费金额,会向上取整
		rewardNum: '',//获得金币数
		timesNum: '',//获得次数
	},

}
//现在支持的游戏种类
export type StatisticActionType = keyof typeof StatisticsSend;

/**
 * 数据上报发送接口
 */
interface StatisticsNetPort {
	clientVersion: string,//应用版本号
	action: StatisticActionType,//事件名称
	from?: GameStateType,//来源，如完成任务的来源：beforeGame,game,afterGame
	type?: string,//来源
	fromUserOpenId?: string,//分享进入来源
	goodsId?: string,//商品id
	goodsName?: string,//商品名称
	price?: string,//价格
	record?: Object,//订单记录
	nickName?: string,//应用版本号
	payNum?: string,
	rewardNum?: string,
	playTime?: number,//应用版本号
	getTime?: string,//应用版本号
	orderNum?: string//应用版本号
}
class ModuleStatistics_C {

	private version: string = '0';//版本号

	// private readonly clockName = 'StatisticsClock';
	//切花到前台时间
	private showTime = 0;
	//上次 activeTime
	private lastActiveTime = 0;

	private curGameState: GameStateType = 'beforeGame';

	//-------------------------------------------------------//

	private static myInstance: ModuleStatistics_C = null as any;
	static Instance() {
		if (!this.myInstance) {
			this.myInstance = new ModuleStatistics_C();
		}
		return this.myInstance;
	}

	private isInit = false;
	/**
	 * 打点接口初始化
	 * 初始化后才开始记录在线时长，所以此方法需尽早调用
	 */
	Init(_version: string, _callBack?: () => void) {
		if (this.isInit) {
			return;
		}
		this.version = _version;

		this.showTime = Date.now();
		this.lastActiveTime = this.showTime;
		//打开App
		this.Dot('openApp', { fromUserId: ModulePlatformAPI.GetFromID() });

		//发送切换前台事件
		Laya.stage.on(PlatformListenKey.onShow, this, this.onShow);
		Laya.stage.on(PlatformListenKey.onHide, this, this.onHide);

		//在线时长更新
		this.activeTimeUpdate();
		this.isInit = true;


	}
	/**
	 * 更改游戏状态
	 * @param _state 
	 * @returns 
	 */
	ChangeCurGameState(_state: GameStateType) {
		if (this.curGameState == _state) {
			return;
		}
		this.curGameState = _state;
	}
	//切前台 调用
	private onShow() {
		console.log("ModuleStatistics onshow");
		this.showTime = Date.now();
		this.lastActiveTime = this.showTime;
		this.activeTimeUpdate();

	}

	//切后台 调用
	private onHide() {
		console.log("ModuleStatistics onHide");
		this.exitGame();
		this.reportActiveTime();
	}

	//--------------------------------------外部调用接口-------------------------------------------------//
	/**
	 * 开始加载资源
	 */
	StartLoadRes() {
		this.Dot('loadingRes');
	}
	// /**
	//  * 登录成功过
	//  */
	// LoginSuccess() {
	// 	this.Dot('loadingRes');
	// }
	/**
	 * 点击分享按钮
	 */
	ClickShare() {
		this.Dot('clickShare', { type: this.curGameState });
	}
	/**
	 * 分享成功
	 */
	ShareSuccess() {
		this.Dot('shareSuccess', { type: 'default' });
	}
	/**
	 * 点击分享按钮
	 */
	ClickGameBtn() {
		this.Dot('clickGame');
	}
	// /**
	//  * 分享成功
	//  */
	// CompleteTask(_taskType: string) {
	// 	this.Dot('task', { from: this.curGameState, type: _taskType });
	// }
	/**
	 * 完成任务
	 */
	CompleteTask(_taskType: string) {
		this.Dot('task', { from: this.curGameState, type: _taskType });
	}
	/**
	 * 完成任务
	 */
	TaskExposure(_taskType: ExposureType, _goodsId: string, _goodsName: string, _price: string,) {
		this.Dot('exposure', { type: _taskType, goodsId: _goodsId, goodsName: _goodsName, price: _price });
	}
	/**
	 * 任务支付
	 */
	TaskPay(_record: Object, _payNum: string, _rewardNum: string, _timesNum: string) {
		ModulePlatformAPI.GetUserInfo((_info) => {
			this.Dot('pay', { type: 'default', nickName: _info.nickName, record: _record, payNum: _payNum, rewardNum: _rewardNum, timesNum: _timesNum });
		})

	}
	//--------------------------------------内部调用接口(内部自己实现逻辑调用)-------------------------------------------------//
	/**
	 * 退出游戏
	 */
	private exitGame() {
		let _time = ((Date.now() - this.showTime) / 1000) | 0;
		this.Dot('exit', { type: 'default', playTime: _time });
	}
	/**
	 * 持续上报在线时长
	 */
	private reportActiveTime() {
		let _ct = Date.now()
		let _time = ((_ct - this.lastActiveTime) / 1000) | 0;
		this.Dot('activeTime', { playTime: _time });
		this.lastActiveTime = _ct;
		this.activeTimeUpdate();
	}
	private activeTimeID = null as any;
	private activeTimeUpdate() {
		if (this.activeTimeID) {
			clearTimeout(this.activeTimeID);
			this.activeTimeID = null;
		}
		this.activeTimeID = setTimeout(() => {
			this.activeTimeID = null;
			this.reportActiveTime();

		}, 5 * 60 * 1000);//5分钟上报一次打点
	}

	//--------------------------------------基础接口-------------------------------------------------//
	/**
	 * 打点统计
	 * @param _action 行为
	 * @param _port 需要的参数
	 */
	private Dot<T extends StatisticActionType>(_action: T, _port?: typeof StatisticsSend[T]) {
		_port = _port ? _port : {} as any;
		_port['clientVersion'] = this.version;
		_port['action'] = _action;
		this.reportNet(_port as any)
	}

	//打点统计基础网络接口
	private reportNet(_port: StatisticsNetPort) {
		// if (!ModulePackage.Instance.CanUseNetAPI()) {
		// 	return;
		// }
		const _postName = '/C/data/userReport';
		let tryTime = 3;
		console.log('上传打点事件：', JSON.stringify(_port));

		let _send = () => {
			//从服务端获取真实数据
			ModulePackage.Instance.SendNetMessage("", _postName, _port, "post", this,
				(data) => {
					if (data.code != 0) {
						tryTime--;
						if (tryTime <= 0) {
							// _callBack && _callBack(false, null);
							return;
						}
						setTimeout(() => {
							_send();
						}, 200);
						return;
					}
					// ModuleTool.DetectType(_postName, data.data, GameInfo[_type]['getData']);
					// _callBack && _callBack(true, data.data);
				});

		}
		_send();
	}
	//-----------------------------------------------------------------------------------------//

};


export let ModuleStatistics = ModuleStatistics_C.Instance();

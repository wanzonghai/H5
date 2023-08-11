/**
 * 全局使用的基础数据类
 */

import ModulePackage from "./ModulePackage";
import { ModuleTool } from './ModuleTool';

/**
 * 支持获取的游戏接口
 * 填入自己游戏对应的 GameInfo 字段即可支持
 */
const GameInfo = {
	watermelong: //游戏名（自定义）
	{
		post: '/C/watermelon/info',//发送请求的地址
		getData://获取的数据
		{
			demoUrl: "xxxxxx",//url地址
			gameName: "游戏名称",//游戏名
			iconList: [
				// [
				// 	{
				// 		"opt": true,
				// 		"name": "xxx图片名称",
				// 		"url": "xxx图片地址",
				// 		"custom": false,
				// 	}
				// ]
			]
		}
	}
}
//现在支持的游戏种类
export type GameKind = keyof typeof GameInfo;


class ModuleGameInfo_C {

	//-------------------------------------------------------//

	private static myInstance: ModuleGameInfo_C = null as any;
	static Instance() {
		if (!this.myInstance) {
			this.myInstance = new ModuleGameInfo_C();
		}
		return this.myInstance;
	}

	private isInit = false;
	/**
	 * 平台接口初始化
	 * 进入游戏调用一次
	 * 会执行以下操作
	 * 1.登录
	 * 2.获取活动信息
	 * 3.给平台类需要参数赋值
	 */
	Init(_callBack?: () => void) {
		if (this.isInit) {
			return;
		}
		
	}
	//--------------------------------------------游戏专属数据---------------------------------------------//
	GetGameInfo<T extends GameKind>(_type: T, _callBack?: (_success: boolean, _info?: typeof GameInfo[T]['getData']) => void) {
		// if (!ModulePackage.Instance.CanUseNetAPI()) {
		// 	_callBack && _callBack(true, GameInfo[_type]['getData']);
		// 	return;
		// }
		let _postName = GameInfo[_type].post;
		let tryTime = 3;
		let _send = () => {
			//从服务端获取真实数据
			ModulePackage.Instance.SendNetMessage("", _postName, {}, "post", this,
				(data) => {
					if (data.code != 0) {
						tryTime--;
						if (tryTime <= 0) {
							_callBack && _callBack(false, null);
							return;
						}
						setTimeout(() => {
							_send();
						}, 200);
						return;
					}
					ModuleTool.DetectType(_postName, data.data, GameInfo[_type]['getData']);
					_callBack && _callBack(true, data.data);
				});

		}
		_send();
	}
	//-----------------------------------------------------------------------------------------//

};


export let ModuleGameInfo = ModuleGameInfo_C.Instance();

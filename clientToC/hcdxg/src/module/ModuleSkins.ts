/**
 * 更换皮肤类
 */

/**
 * 支持获取的游戏接口
 * 填入自己游戏对应的GameInfo 字段即可支持
 */
const SkinsConfig = {
	//首页
	/**启动页品牌图片*/beginLogo: { url: '', },
	/**首页背景图片*/bgImage: { url: '', },
	/**积分icon*/integralIcon: { url: '', },
	/**首页品牌图片*/logo: { url: '', },
	/**活动规则icon*/ruleIcon: { url: '', },
	/**排行榜icon*/rankingIcon: { url: '', },
	/**赚次数icon*/numberIcon: { url: '', },
	/**开始游戏icon*/StartIcon: { url: '', },

	//排行榜
	/**排行榜banner*/rankingBanner: { url: '', },
	/**奖品预览icon*/prizeIcon: { url: '', },

	//游戏内
	/**游戏背景*/gameBgImage: { url: '', },
	/**小蜜蜂*/honeybeeIcon: { url: '', },

	//积分兑换
	/**我的奖品icon*/myPrize: { url: '', },

}
const skinJsonConfig = {
	path: 'https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/normal/configs/skinConfig.json',
	version: 'normal',
}

let jsonPath = 'CustomConfig/CustomData.json';
//现在支持的游戏种类
export type SkinKind = keyof typeof SkinsConfig;


class ModuleSkins_C {

	//-------------------------------------------------------//

	private static myInstance: ModuleSkins_C = null as any;
	static Instance() {
		if (!this.myInstance) {
			this.myInstance = new ModuleSkins_C();
		}
		return this.myInstance;
	}

	private isInit = false;


	/**
	 * 初始化更换皮肤
	 * @param _callBack 
	 * @returns 
	 */
	Init(_callBack?: () => void) {
		if (this.isInit) {
			return;
		}
		this.getJsonPath(() => {
			this.getServerConfig(() => {
				this.preloadAllSkin(_callBack);
			})
		})



	}
	//-------------------------------------外部方法---------------------------------------------//

	/**
	 * 换肤
	 * @param _image 要换肤的loader
	 * @param _kind 皮肤
	 */
	ChangeSkin<T extends SkinKind>(_image: fgui.GLoader | Laya.Sprite | Laya.Image, _kind: T) {
		let _url = this.getUrl(_kind);
		if (!_url) {
			return;
		}
		if (_image instanceof fgui.GLoader) {
			//fgui 的 Loader 类型
			_image.url = _url
		}
		else if (_image instanceof Laya.Image) {
			_image.skin = _url;
		}
		else if (_image instanceof Laya.Sprite) {
			//laya 的 Image类型
			// _image.texture.url = this.getUrl(_kind);
			_image.texture = Laya.loader.getRes(_url);
		}
		else {
			console.error('未处理的皮肤类型：', _image);

		}

	}
	/**
	 * 替换fgui中的icon
	 * （比如按钮中的icon）
	 */
	ChangeFguiICON<T extends SkinKind>(_item: fgui.GComponent, _kind: T) {
		let _url = this.getUrl(_kind);
		if (!_url) {
			return;
		}
		_item.icon = _url;
	}
	//-------------------------------------内部方法---------------------------------------------//
	//获取最新的配置路径
	getJsonPath(_callback: Function) {
		let _tryTime = 3;
		//加载customData.json
		let _toload = () => {
			let _p = skinJsonConfig.path + '?r=' + Date.now();
			Laya.loader.load(_p, Laya.Handler.create(this, (info) => {
				if (info) {
					console.log('getJsonPath', _p, info);
					let _data = info[skinJsonConfig.version];
					if (_data && _data != '') {
						jsonPath = _data;
					}
					_callback();
				} else {
					if (_tryTime <= 0) {
						_callback();
						return;
					}
					_tryTime--;
					_toload();
				}
			}));
		}
		_toload();
	}
	//获取配置信息
	getServerConfig(_finish?: () => void) {
		//加载customData.json
		let _p = jsonPath + '?r=' + Date.now();
		let _toload = () => {
			Laya.loader.load(_p, Laya.Handler.create(this, (info) => {
				if (info) {
					this.parseJson(info);
					_finish && _finish();
				} else {
					setTimeout(() => {
						_toload();
					}, 200);

				}
			}));
		}
		_toload();
	}
	parseJson(_json: any[]) {
		//解析customData.json
		for (const pageInfo of _json) {//每页信息
			let _custom = pageInfo['custom'];//获取数据数组信息
			if (!_custom) {
				console.error('未发现数据信息', pageInfo.key, pageInfo.name);
				continue;
			}
			console.log(`--------------数据页[${pageInfo.key}:${pageInfo.name}]----------------`);

			for (const itemInfo of _custom) {//具体信息
				if (itemInfo.type != 'uploadImage') {//不关心非更改类图片
					continue;
				}
				let _imageinfo = itemInfo['uploadImage_name'];//获取图片信息
				if (!_imageinfo) {
					console.error('没有图片信息', itemInfo.uuid, itemInfo.title);
					continue;
				}
				if (!SkinsConfig[itemInfo.uuid]) {
					console.error('代码中没有响应此图片', itemInfo.uuid, itemInfo.title);
					continue;
				}
				console.log('获得皮肤: ', itemInfo.title);
				SkinsConfig[itemInfo.uuid].url = _imageinfo.value;
			}
			console.log(`--------------数据页(结束)----------------`);

		}
	}
	//预加载皮肤资源
	preloadAllSkin(_finish?: () => void) {
		console.log('preloadAllSkin', SkinsConfig);

		let _resarr: string[] = [];
		for (const key in SkinsConfig) {
			if (SkinsConfig[key].url == '') {
				continue;
			}
			_resarr.push(SkinsConfig[key].url);
		}
		console.log('preloadAllSkin _resarr', _resarr);

		let _toload = () => {
			Laya.loader.load(_resarr, Laya.Handler.create(this, (isSuccess) => {
				if (isSuccess) {
					console.log('预加载皮肤[完成]');

					_finish && _finish();
				} else {
					_toload();
				}
			}));
		}
		_toload();
	}
	getUrl(_kind: SkinKind) {
		if (!(_kind in SkinsConfig)) {
			return null;
		}
		let _url = SkinsConfig[_kind].url;
		if (!_url) {
			return null;
		}
		return _url;
	}
	//-----------------------------------------------------------------------------------------//

};


export let ModuleSkins = ModuleSkins_C.Instance();

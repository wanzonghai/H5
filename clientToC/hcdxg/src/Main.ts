import GameConfig from "./GameConfig";
import { Global } from './config/Global';
import { ModuleStatistics } from "./module/ModuleStatistics";
class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError(true);

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
		
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded(): void {
		
		Global.SetupEngine();

		//加载网络资源
        // let _cdn: string = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/bigFight/taobao/index/";
        // Laya.loader.load([
        //     { url: _cdn + "loadingRes/bg.jpg" , type: Laya.Loader.IMAGE},
        //     { url: _cdn + "loadingRes/logo.png" , type: Laya.Loader.IMAGE},
        //     { url: _cdn + "res/atlas/loadingRes.atlas" , type: Laya.Loader.ATLAS},
		// 	{ url: _cdn + "res/atlas/loadingRes.png" , type: Laya.Loader.IMAGE},
        // ],Laya.Handler.create(this,()=>{
        //     this.changeScene();
        // }));

		ModuleStatistics.Init(Global.hallConfig._version);
		//加载IDE指定的场景
		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		fairygui.UIConfig.packageFileExtension = "txt";
	}

	changeScene(){
		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
	}

}
//激活启动类
new Main();

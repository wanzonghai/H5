import Alert from "../../../fgui/Alert";
import { FGUIConfig, PkgNameType } from "../../FGUIConfig";
import FGUIBase from "./FGUIBase";
import FGUIMount from "./FGUIMount";
import FGUIScene from './FGUIScene';

/**
 * fgui工具类
 */
class FGUIUtil_C {

    private loadedPakages: PkgNameType[] = [];

    private static instance: FGUIUtil_C = null as any;
    static INS() {
        if (!this.instance) {
            this.instance = new FGUIUtil_C();
        }
        return this.instance;
    }

    //fgui 初始配置
    private isinit = false;
    Init() {
        if (this.isinit) {
            return;
        }
        fairygui.UIConfig.packageFileExtension = FGUIConfig.FileExtension;
        Laya.stage.addChild(fgui.GRoot.inst.displayObject);
        fgui.GRoot.inst.displayObject.zOrder = 2;
        this.loadedPakages = [];
        this.isinit = true;
    }
    //-------------------------------------------------------资源预加载------------------------------------------------//
    /**
     * 预加载资源
     * @param _pakageInfo 资源包信息
     */
    async PreLoadResouce(_pakageInfo: PkgNameType | PkgNameType[] | 'All' = 'All', callBack?: Function) {
        let _arr = this.getUnloadPkgs(_pakageInfo);
        // console.log('PreLoadResouce _arr', _arr);

        if (_arr.length <= 0) {
            return true;
        }
        return new Promise<boolean>(rs => {
            let _allresN = _arr.length;
            let _result = true;
            let _loaded = () => {
                _allresN--;
                if (_allresN <= 0) {
                    callBack && callBack();
                    rs(_result);
                }

            }
            for (const _pkg of _arr) {
                // let _pkgInfo = FGUIConfig.Pakages[_pkg];
                // console.log('PreLoadResouce _pkgInfo', _pkgInfo);
                // if (!_pkgInfo.isCDN) {
                //     this.loadedPakages.push(_pkg);
                //     _loaded();
                //     continue;
                // }
                let _resArr = this.getPkgAllRes(_pkg);
                Laya.loader.load(_resArr, Laya.Handler.create(this, (result, result2) => {
                    if (result) {
                        let _package = fgui.UIPackage.addPackage(this.getPackageBasePath(_pkg) + _pkg);
                        this.loadedPakages.push(_pkg);
                        // console.log('[PreLoadResouce] ' + _pkg, '加载成功');
                        console.log('[PreLoadResouce] ' + _pkg, '加载成功', _package);
                    }
                    else {
                        _result = false;
                        console.error('[PreLoadResouce] ' + _pkg, '加载失败');
                    }
                    _loaded();

                }), Laya.Handler.create(this, (result, result2) => {
                    // console.error('[loadloadloadload] ', result, result2);

                }, undefined, false));
            }



        })
    }
    /**
     * 加载fgui包
     * @param _pakage 
     * @param _caller 
     * @param _callback 
     */
    async loadPackage(_pakage: PkgNameType, _caller: any, _callback: Function) {

        let _r = await this.PreLoadResouce(_pakage);
        // console.log('loadPackage000', _pakage, _r);
        if (!_r) {
            return _r;
        }
        // console.log('loadPackage', _pakage);


        fgui.UIPackage.loadPackage(this.getPackageBasePath(_pakage) + _pakage, Laya.Handler.create(_caller, _callback));
        return _r;
        // fgui.UIPackage.addPackage( _path);
        // _callback();
        // fgui.UIPackage.loadPackage(this.CDNBasePath + _path, Laya.Handler.create(_caller, _callback));

    }
    //-------------------------------------------------------公用动画------------------------------------------------//
    //弹入动画
    ActionPopIn(_node: any, _endcallbacK?: Function) {
        _node.setScale(0.3, 0.3);
        Laya.Tween.to(_node, { scaleX: 1.15, scaleY: 1.15, }, 150, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
            // Laya.Tween.to(_node, { scaleX: 1.1, scaleY: 1.1 }, 200, undefined, Laya.Handler.create(this, () => {
            Laya.Tween.to(_node, { scaleX: 1, scaleY: 1 }, 400, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
                _endcallbacK && _endcallbacK();
            }));
            // }));
        }));
    }
    //弹出动画
    ActionPopOut(_node: any, _endcallbacK?: Function) {
        Laya.Tween.to(_node, { scaleX: 1.1, scaleY: 1.1, }, 200, Laya.Ease.linearOut, Laya.Handler.create(this, () => {
            Laya.Tween.to(_node, { scaleX: 0, scaleY: 0 }, 200, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                _endcallbacK && _endcallbacK();
            }));
        }));
    }
    //-------------------------------------------------------FGUI场景------------------------------------------------//
    private curFGUI: FGUIScene | null = null;
    /**
     * 显示FGUI 同一时间只会出现一个
     * Scene类型
     * @param UIClass 类名
     */
    async ShowScene<T extends (typeof FGUIScene)>(_class: T, _callBack?: Function) {
        this.Init();
        return new Promise<void>((rs) => {
            let _lastScene = this.curFGUI;
            // console.error('_lastScene', _lastScene);
            this.curFGUI = new (_class as any)();
            // console.error('curFGUI', this.curFGUI);
            if (!this.curFGUI.AddScene(() => {
                this.CloseScene(_lastScene);
                _callBack && _callBack(this.curFGUI);
                rs && rs();
            })) {
                this.curFGUI = null;
            }

        })


    }
    //已持有未销毁类
    private freeScene = {};
    /**
     * 显示自由FGUI场景 
     * 需要 调用 closeScene手动控制销毁
     * 不销毁再次调用不会重复创建
     * Scene类型
     * @param UIClass 类名
     */
    ShowFreeScene<T extends (typeof FGUIScene)>(_class: T, _callBack?: (_class: any) => void) {

        //因为淘宝预览中不能识别_class.name，所以需要根据类中信息制作唯一key
        //（原因可能是压缩混淆运行环境下方法名相同）
        let _soleKey = this.getFGUISceneSoloKey(_class);
        // console.error('_name', _soleKey);
        this.Init();
        let _freeScene: FGUIScene = null as any;
        if (_soleKey in this.freeScene) {
            _freeScene = this.freeScene[_soleKey];
            // new Alert("已存在类：" + _class.name);
            // console.error('已存在类：', _soleKey);
        }
        if (!_freeScene) {
            _freeScene = new (_class as any)();
        }
        // console.error('ShowFreeScene _class', _class.name);

        // console.error('curFGUI', this.curFGUI);
        if (!_freeScene.AddScene(() => {
            // _freeScene.main.sortingOrder = 2;
            this.freeScene[_soleKey] = _freeScene;
            // new Alert("_freeScene：" + JSON.stringify(_freeScene.mainName), () => { }, () => { });
            _callBack && _callBack(_freeScene as any);
        })) {
            this.curFGUI = null;
        }
        return _freeScene;

        // new Alert(" _class" + (typeof _class));



    }
    /**
     * 关闭所有
     */
    CloseScene(_fguiScene: FGUIScene) {
        // console.error('_fguiScene', _fguiScene);

        // if (!_fguiScene) {
        //     _fguiScene = this.curFGUI;
        //     console.error('this.curFGUI', this.curFGUI);
        //     this.curFGUI = null;
        // }
        // console.error('closeScene', _fguiScene.constructor.name);

        if (_fguiScene) {
            _fguiScene.RemoveSelf && _fguiScene.RemoveSelf();
            let _soleKey = this.getFGUISceneSoloKey(_fguiScene.constructor);
            // let _name = _fguiScene.constructor.name;
            // console.error('CloseScene _soleKey', _soleKey);

            if (_soleKey in this.freeScene) {
                // console.error('销毁类：', _soleKey);

                delete this.freeScene[_soleKey];
            }
            // this.curFGUI.destroy && this.curFGUI.destroy();
        }


    }

    //-------------------------------------------------------预制体------------------------------------------------//
    /**
     * 创建预制体
     */
    async CreatePrefab(_parent: fgui.GComponent, _pkgName: PkgNameType, _compName: string, _class: new () => FGUIMount, _usePool = true) {
        return new Promise<FGUIMount>(rs => {
            this.loadPackage(_pkgName, this, () => {
                // console.error('CreatePrefab000', _pkgName, _compName);

                fgui.UIObjectFactory.setExtension(fgui.UIPackage.getItemURL(_pkgName, _compName), _class);
                // console.error('CreatePrefab111', _pkgName, _compName);
                // this.curFGUI = _fgui;
                //获取Main组件，并添加到当前界面
                let _createFun = () => {
                    return fgui.UIPackage.createObject(_pkgName, _compName, _class);
                }
                let _main: any = null;
                if (_usePool) {
                    let _poolName = _pkgName + _compName;
                    _main = Laya.Pool.getItemByCreateFun(_poolName, _createFun, this);
                    _main.poolName = _poolName;
                }
                else {
                    _main = _createFun();
                    _main.poolName = '';
                }
                _main.usePool = _usePool;
                // let _main = fgui.UIPackage.createObject(_pkgName, _compName, _class) as any;
                _main.addRelation(_parent, fgui.RelationType.Size);
                _parent.addChild(_main);
                // console.error('_main', 'Init');
                // _main.Init();
                rs(_main);
            });
        })
    }
    RecyclePrefab(_obj: FGUIMount) {
        if (_obj.poolName != '') {
            Laya.Pool.recover(_obj.poolName, _obj);
        }
        _obj.removeFromParent();

    }

    //-------------------------------------------------------内部方法------------------------------------------------//
    //生成FGUIScene的唯一key
    private getFGUISceneSoloKey(_sceneFunction: Function) {
        let _str = _sceneFunction.toString();
        let _soleKey = ''
        //根据类中此属性生成
        const nameKs = ['pkgName', 'mainName'];
        for (const Key of nameKs) {
            let _idx = _str.indexOf(Key);
            if (_idx < 0) {
                continue;
            }
            _soleKey += _str.slice(_idx, _idx + 30);
        }
        return _soleKey;
    }
    /**
     * 获取当前包的基础资源路径
     * @param _pakage 
     */
    private getPackageBasePath(_pakage: PkgNameType) {
        let _pkg = FGUIConfig.Pakages[_pakage];
        let _path = (_pkg.isCDN ? FGUIConfig.CDNBasePath : '') + FGUIConfig.resBase;
        return _path;
    }
    /**
     * 获取未被加载的资源包
     * 已加载过会被忽略
     * @param _pakageInfo 
     */
    private getUnloadPkgs(_pakageInfo: PkgNameType | PkgNameType[] | 'All' = 'All') {
        let _arr: PkgNameType[] = [];
        if ('All' == _pakageInfo) {
            for (const key of (Object.keys(FGUIConfig.Pakages) as PkgNameType[])) {
                if (this.loadedPakages.indexOf(key) < 0) {
                    _arr.push(key)
                }
            }
        }
        else if (typeof _pakageInfo == 'string') {
            if (this.loadedPakages.indexOf(_pakageInfo) < 0) {
                _arr.push(_pakageInfo)
            }

        }
        else {
            for (const key of _pakageInfo) {
                if (this.loadedPakages.indexOf(key) < 0) {
                    _arr.push(key)
                }
            }
        }
        return _arr;
    }
    /**
     * 获取当前包的所有资源信息
     * @param _pkg 
     */
    private getPkgAllRes(_pkg: PkgNameType) {
        let _pkgInfo = FGUIConfig.Pakages[_pkg];
        let _path = this.getPackageBasePath(_pkg);
        let _resArr: any[] = [];
        //包资源
        _resArr.push({ url: _path + _pkg + '.' + FGUIConfig.FileExtension, type: Laya.Loader.BUFFER })
        //图片资源 .png格式
        if (_pkgInfo['ImageN']) {
            for (let index = 0; index < _pkgInfo['ImageN']; index++) {
                let _extStr = '';
                if (index > 0) {
                    _extStr = '_' + index;
                }
                _resArr.push({ url: _path + _pkg + `_atlas0${_extStr}.png`, type: Laya.Loader.IMAGE })
            }
        }
        //其他图片资源
        let _aloneImages: string[] = _pkgInfo['aloneImages'];
        if (_aloneImages && _aloneImages.length > 0) {
            for (const imag of _aloneImages) {
                _resArr.push({ url: _path + imag, type: Laya.Loader.IMAGE })
            }
        }
        return _resArr;
    }
}
export default FGUIUtil_C.INS();
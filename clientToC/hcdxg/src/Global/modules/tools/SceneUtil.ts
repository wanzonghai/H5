import TimeUtil from "./TimeUtil";
import { Platform } from './../Platform/Platform';
import { SceneName, SceneParamsMap } from "../../MyAssest";
import TimeMonitor from "../Debug/TimeMonitor";
/**
 * 切换场景
 * 加入预加载和加载场景重试，记录，防止重复点击
 */
export default class SceneUtil {

    private static lastSceneName: SceneName | null = null;
    private static retryTime = 5;
    /**
     * 
     * @param scene 
     * @param _retryTime 重试次数：<0 无线重试 >0限定重试次数（默认重试5次）
     * @param params 
     * @param transfer 转场特效（转场Promise resolve后才会实际发生场景跳转）
     * @param _forceTry 强制切换（主动调用不填此值，只有递归时改变此值）
     */
    static loadScene<T extends SceneName>(scene: T, _retryTime = 5, _forceTry = false) {
        if (!_forceTry) {
            this.retryTime = _retryTime;
            if (SceneUtil.lockLoadScene(true, 3000)) {
                return;
            }
        }
        if (0 == this.retryTime) {
            Platform.ShowModal({ title: '网络不好', content: '切换场景失败', confirmText: '重试', cancelText: '取消' }).then(v => {
                if (v) {
                    SceneUtil.loadScene(scene, _retryTime);
                }
            })
            return;
        }
        else if (this.retryTime > 0) {
            this.retryTime--;
        }
        // TimeMonitor.dot('loadScene', '开始111');
        let _lastScene = null as any;
        if (!_forceTry) {

            // console.error('_lastScene', _lastScene);
        }
        // TimeMonitor.dot('loadScene', '开始222');
        try {
            console.log('loadScene', scene);
            // Global.submitAction(`切换场景: ${scene}`, params);
            //切换新场景
            let _loadsc = async (asset?: any) => {
                // TimeMonitor.dot('loadScene', '_loadsc');
                // CommonBackground.Show(false);
                let _trytime = 3;
                let _tryLoad = async () => {
                    // console.log('调用loadScene', scene);
                    // if (SceneParamsMap[scene].isBundle) {
                    //     let _scene = this.loadedBundleScene[scene];
                    //     if (!_scene) {
                    //         //应该不会执行（执行时应该是代码逻辑错误）
                    //         throw new Error("Bundle中没有此场景");
                    //     }
                    //     console.log('调用loadScene', _scene);
                    //     cc.director.runScene(_scene);
                    //     // this.loadedBundleScene = {};
                    //     // let _i = SceneUtil.loadedList.indexOf(scene);
                    //     // SceneUtil.loadedList.splice(_i, 1);
                    // }
                    // else 
                    {
                        Laya.Scene.open(scene + '.scene', true, undefined, Laya.Handler.create(this, (asset) => {
                            // if (_lastScene) {
                            //     this.lastSceneName = _lastScene;
                            // }
                            _trytime = -1;
                            SceneUtil.lockLoadScene(false);

                        }));
                    }

                }
                //等待3秒不能切换新场景则重试（此时已经预加载完成）
                _tryLoad();
            }
            console.log('loadScene-已加载场景：', scene, JSON.stringify(SceneUtil.loadedList), SceneUtil.loadedList.indexOf(scene));
            // console.log('loadScene-已加载场景222：', typeof scene, SceneUtil.loadedList.length, SceneUtil.loadedList.indexOf(scene));

            if (SceneUtil.loadedList.indexOf(scene) >= 0) {
                _loadsc();
                return;
            }
            //预加载回调
            let preloadHandler = async (err: Error | null) => {
                TimeMonitor.dot('loadScene', '预加载完成');
                // 开始切换场景
                Platform.HideLoading();
                if (err) {// 加载失败
                    if (this.retryTime == 0) {
                        return;
                    }
                    Platform.ShowLoading({ title: '努力重试中..' });
                    // 1秒后重新加载
                    // Global.submitAction(`场景加载失败: ${scene}`, {
                    //     timeSec: Math.round((Date.now() - startTime) / 1000)
                    // });
                    setTimeout(() => {
                        Platform.HideLoading();
                        SceneUtil.loadScene(scene as any, _retryTime, true);
                    }, 500);
                    return;
                }
                _loadsc();
            }
            // TimeMonitor.dot('loadScene', '进入预加载');
            //预加载场景
            SceneUtil.preloadScene([scene], true, undefined, undefined, preloadHandler);
        }
        catch (e) {
            // Global.submitAction(`场景加载失败: ${scene}`, {
            //     timeSec: Math.round((Date.now() - startTime) / 1000)
            // });
            console.error('加载场景失败', scene);
            // 1秒后自动重试
            setTimeout(() => {
                SceneUtil.loadScene(scene as any, _retryTime, true);
            }, 500);
        }

    }
    static CloseScene<T extends SceneName>(scene: T) {
        Laya.Scene.close(scene + '.scene');
    }
    private static inLoadScene = false;
    private static lockTimeOut: any = null;
    /**
     * 防止多次重复点击加载场景
     * @param _lock 更改锁子状态
     * @param _delaytime 自动解锁时间
     */
    private static lockLoadScene(_lock = true, _delaytime = 3000) {
        if (_lock) {
            let _cur = SceneUtil.inLoadScene;
            if (!SceneUtil.inLoadScene) {
                SceneUtil.inLoadScene = _lock;
                SceneUtil.lockTimeOut = setTimeout(() => {
                    if (!SceneUtil.inLoadScene) {
                        return;
                    }
                    SceneUtil.lockLoadScene(false);
                }, _delaytime);
            }
            return _cur;
        }
        else {
            let _cur = SceneUtil.inLoadScene;
            SceneUtil.inLoadScene = _lock;
            if (SceneUtil.lockTimeOut) {
                clearTimeout(SceneUtil.lockTimeOut);
            }
            return _cur;
        }

    }
    private static loadedList: (SceneName)[] = [];
    private static preloadQueue: (SceneName)[] = [];
    private static preloadCallBack: {
        [name: string]: {
            loadSuccessCallBack?: (_sceneName: string) => void,
            onProgress?: (completedCount: number, totalCount: number, item: any) => void,
            onLoaded?: (error: Error) => void
        }
    } = {};
    // private static loadedBundleScene: { [key: string]: cc.SceneAsset } = {};
    // private static sceneAsset: cc.SceneAsset = null as any;
    private static inPreLoad = false;
    //预加载失败重试等待时间
    private static preLoadRetryWaitTime = { wait: 1000, add: 1000, max: 10000 };
    /**
     * 预加载场景
     * @param sceneNames 要预加载的场景名
     * @param _precedence 是否需要优先加载此批场景
     * @param _loadSuccessCallBack 是否预加载成功
     */
    static async preloadScene<T extends SceneName>(sceneNames: T[], _precedence = true, _loadSuccessCallBack?: (_sceneName: string) => void, onProgress?: (completedCount: number, totalCount: number, item: any) => void, onLoaded?: (error: Error) => void) {

        if (!sceneNames || sceneNames.length == 0) {
            return;
        }
        for (let index = 0; index < sceneNames.length; index++) {
            //从后向前遍历
            const element = sceneNames[sceneNames.length - index - 1];
            if (SceneUtil.loadedList.indexOf(element) >= 0) {
                continue;
            }
            let _idx = SceneUtil.preloadQueue.indexOf(element);
            if (_idx < 0) {
                SceneUtil.preloadQueue.push(element);
            }
            else if (_precedence && _idx < SceneUtil.preloadQueue.length - 1) {
                SceneUtil.preloadQueue.splice(_idx, 1);
                SceneUtil.preloadQueue.push(element);
            }
            if (!(element in SceneUtil.preloadCallBack)) {
                SceneUtil.preloadCallBack[element] = {};
            }
            //记录回调
            if (_loadSuccessCallBack) {
                SceneUtil.preloadCallBack[element].loadSuccessCallBack = _loadSuccessCallBack;
            }
            if (onProgress) {
                SceneUtil.preloadCallBack[element].onProgress = onProgress;
            }
            if (onLoaded) {
                SceneUtil.preloadCallBack[element].onLoaded = onLoaded;
            }
        }
        if (SceneUtil.inPreLoad || SceneUtil.preloadQueue.length <= 0) {
            return;
        }
        SceneUtil.inPreLoad = true;
        let _curScene = SceneUtil.preloadQueue[SceneUtil.preloadQueue.length - 1];
        console.log('preloadQueue', SceneUtil.preloadQueue);
        console.log('_curScene', _curScene);

        let _callBack: any = undefined;
        if (_curScene in SceneUtil.preloadCallBack) {
            _callBack = SceneUtil.preloadCallBack[_curScene];
        }
        return new Promise<void>(async (rs) => {
            let _loadCompelte = async (err: any) => {
                SceneUtil.inPreLoad = false;
                // console.log('loadScene 预加载结束', _curScene);
                if (!err) {
                    SceneUtil.preLoadRetryWaitTime.wait = SceneUtil.preLoadRetryWaitTime.add;
                    //成功则从对象中移除回调
                    if (_curScene in SceneUtil.preloadCallBack) {
                        delete SceneUtil.preloadCallBack[_curScene];
                    }

                    //预加载成功
                    SceneUtil.loadedList.push(_curScene);
                    let _idx = SceneUtil.preloadQueue.indexOf(_curScene);
                    if (_idx > -1) {
                        SceneUtil.preloadQueue.splice(_idx, 1);
                    }
                    _callBack && _callBack.loadSuccessCallBack && _callBack.loadSuccessCallBack(_curScene);
                    // console.log('loadScene 预加载成功', JSON.stringify(SceneUtil.loadedList));//, asset
                }
                _callBack && _callBack.onLoaded && _callBack.onLoaded(err);

                if (err) {
                    //加载失败等待1秒再加载
                    await TimeUtil.wait(SceneUtil.preLoadRetryWaitTime.wait);
                    if (SceneUtil.preLoadRetryWaitTime.wait < SceneUtil.preLoadRetryWaitTime.max) {
                        SceneUtil.preLoadRetryWaitTime.wait += SceneUtil.preLoadRetryWaitTime.add;
                    }
                }
                // else {
                //     await TimeUtil.wait(500);
                // }
                if (SceneUtil.preloadQueue.length > 0) {
                    SceneUtil.preloadScene([SceneUtil.preloadQueue[SceneUtil.preloadQueue.length - 1]], false);
                }
                else {
                    rs();
                }
            }
            // if (SceneParamsMap[_curScene].isBundle) {
            //     let _bundle = await BundleUtil.LoadBundle(_curScene);
            //     if (_bundle) {
            //         // _bundle.preloadScene(_curScene, (err, scene) => {
            //         //     _loadCompelte(err, scene)
            //         // });
            //         // // _loadCompelte(null);
            //     }
            //     else {
            //         _loadCompelte('load Bundle Fail!');
            //         return;
            //     }
            // }
            Laya.Scene.load(_curScene + '.scene', Laya.Handler.create(this, (asset: Scene) => {
                // console.error('load asset stage', Laya.stage.width, Laya.stage.height);
                // console.error('load asset', _curScene, asset.width, asset.height);
                asset.size(Laya.stage.width, Laya.stage.height);
                // console.error('load asset222', _curScene, asset.width, asset.height);

                _loadCompelte(null);

            }));
            // else {

            // }

        })

    }
    // /** 使用默认过场进行场景切换 */
    // static lastTransferTime: number = 0;

    static GetLastScene() {
        return this.lastSceneName;
    }
    /**
     * 返回场景
     */
    static GoBack() {

        if (!this.lastSceneName) {
            return false;
        }
        this.loadScene(this.lastSceneName);
        return true;
    }
}
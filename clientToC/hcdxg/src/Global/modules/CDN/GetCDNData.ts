
/** 
 * cdn配置类
 * 使用方法：
 * 1.调用 GetCDNData.Init() 初始化信息并获取本地版本号
 * 2.调用 GetCDNData.GetInfoInOrder() 按FetchOrder中顺序拉取相应配置信息
 */
import { CDNConfig, FetchOrder, GetCDNUrl } from "../../CDNConfig";
import TimeUtil from "../tools/TimeUtil";

//-----------------------------------------------------------------//
export default class GetCDNData {
    static url = '';
    static CDNDateResult: { [key: string]: boolean } = {};
    /**
     * 初始化
     */
    static Init() {
        this.url = GetCDNUrl();
        console.log('this.url', this.url);

        GetCDNData.InitConfigVersion();
        //读取本地版本号
        GetCDNData.GetLocalConfigVersion();
    }
    /**
     * 按顺序获取配置信息
     * @param _completeOrder 当前已获取完成的顺序编号
     */
    static async GetInfoInOrder(_completeOrder?: (order: number) => void) {
        for (let index = 0; index < FetchOrder.length; index++) {
            const iterator: any[] = FetchOrder[index];
            let _funs: Function[] = [];
            iterator.forEach(element => {
                // console.log('配置 forEach000', element);
                _funs.push(async () => {
                    // console.log('配置 forEach111', element);
                    await this.getConfigByRemote(element);
                })
            });
            // console.log('配置 wait000', index);
            await this.WaitAllComplete(_funs);
            // console.log('配置 wait111', index);
            _completeOrder && _completeOrder(index);
        }
    }
    /**
     * 从cdn获取其他信息
     * @param _keyName 配置键名
     * @param _force 是否强制获取
     * @param onlyLocal 是否只获取本地缓存中的
     */
    static async getConfigByRemote(_keyName: string, _force = true, onlyLocal = false) {
        console.log('开始获取配置', _keyName);

        let fullUrl = this.url + `${_keyName}.json`;
        let _congfig = null as any;
        let _r = await this.downloadDetector(fullUrl, _force, _keyName, onlyLocal);
        console.log('获取配置结果', _keyName, _r);
        //此时不需要加载
        if ('skip' === _r) {
            return;
        }
        if (_r) {
            _congfig = _r;
        }
        else {
            return;
        }
        if (!_congfig) {
            console.error(`[${_keyName}]获取配置失败`);
        }
        else {
            (CDNConfig as any)[_keyName] = _congfig;
            console.log(`[${_keyName}]获取配置成功`, (CDNConfig as any)[_keyName]);
        }
    }

    //--------------------------------------------------------------------------------------------------------------------------//
    private static async downloadDetector(fullUrl: string, _force: boolean, _key: string, onlyLocal = false): Promise<any | 'skip'> {
        let _congfig = null as any;
        let inCotrol = false;
        console.log('CDN服务端版本号', JSON.stringify(CDNConfig.switches.CDNConfigVersion));
        console.log('CDN代码中版本号', JSON.stringify(GetCDNData.allCDNConfigVersion[0]));
        console.log('CDN本地存储中版本号', JSON.stringify(GetCDNData.allCDNConfigVersion[1]));

        if (CDNConfig.switches.CDNConfigVersion && _key in GetCDNData.allCDNConfigVersion[0] && _key in CDNConfig.switches.CDNConfigVersion) {
            inCotrol = true;
            let _remoteV = (CDNConfig.switches.CDNConfigVersion as any)[_key];
            let _chachV = GetCDNData.allCDNConfigVersion[0][_key];
            let _storeV = GetCDNData.allCDNConfigVersion[1][_key];
            GetCDNData.CDNDateResult[_key] = false;
            if (_chachV >= _remoteV && _chachV >= _storeV) {
                GetCDNData.CDNDateResult[_key] = true;
                return 'skip';
            }
            if (_storeV >= _remoteV) {
                _congfig = GetCDNData.getLocalConfig(_key);
                if (_congfig) {
                    GetCDNData.ChangeConfigVersion(0, _key, 'set');
                    GetCDNData.CDNDateResult[_key] = true;
                    return _congfig;
                }
            }
            //只获取本地数据则返回
            if (onlyLocal) {
                return 'skip';
            }
        }
        let _retry = 3;
        // _key = 'CDN' + _key;
        // console.log('downloadDetector', fullUrl, title);
        if (!_force && !inCotrol) {
            if (_key in GetCDNData.CDNDateResult && GetCDNData.CDNDateResult[_key]) {
                return 'skip';
            }
        }
        while (_retry > 0) {
            try {
                let _addPar = '?add=' + Math.floor(Math.random() * 10000);
                // _congfig = (await this.loadRemote(fullUrl + _addPar)).json;
                _congfig = await this.loadRemote(fullUrl + _addPar);
                _retry = 0;
            } catch (error) {
                console.error(`[downloadDetector-${_key}]获取配置失败`, fullUrl, error);
            }
            if (_retry > 1) {
                await TimeUtil.wait(500);
            }
            _retry--;
        }
        if (_congfig) {
            GetCDNData.CDNDateResult[_key] = true;
            this.storetLocalConfig(_key, _congfig);
        }
        else {
            GetCDNData.CDNDateResult[_key] = false;
        }
        return _congfig;
    }

    //是否所有信息获取成功
    static IsGetAllDate() {
        let _result = true;
        for (const key in GetCDNData.CDNDateResult) {
            if (GetCDNData.CDNDateResult.hasOwnProperty(key)) {
                if (!GetCDNData.CDNDateResult[key]) {
                    _result = false;
                    break;
                }
            }
        }
        return _result;
    }

    //本地存储与校验
    private static allCDNConfigVersion: { [key: string]: number }[] = [];
    //初始化版本号
    static InitConfigVersion() {
        GetCDNData.allCDNConfigVersion = [];
        for (let index = 0; index < 2; index++) {
            GetCDNData.allCDNConfigVersion[index] = {};
            if (CDNConfig.switches.CDNConfigVersion)
                for (const key in CDNConfig.switches.CDNConfigVersion) {
                    if (CDNConfig.switches.CDNConfigVersion.hasOwnProperty(key)) {
                        GetCDNData.allCDNConfigVersion[index][key] = 0;
                    }
                }
            console.log('InitConfigVersion', JSON.stringify(GetCDNData.allCDNConfigVersion[index]));
        }

    }
    //获取本地存储的版本号
    private static localVerName = 'CDNLocalConfigVersion';
    static GetLocalConfigVersion() {
        if (GetCDNData.allCDNConfigVersion.length != 2) {
            GetCDNData.InitConfigVersion();
        }
        console.log('存储到本地的版本00', 'GetLocalConfigVersion');

        let _v: any = Laya.LocalStorage.getItem(GetCDNData.localVerName);
        if (_v) {
            _v = JSON.parse(_v)
            for (const key in _v) {
                GetCDNData.ChangeConfigVersion(1, key, _v[key]);
                console.log('存储到本地的版本001', key, _v[key]);
            }
        }
    }
    private static storeLocalConfigVersion() {
        if (GetCDNData.allCDNConfigVersion.length < 2) {
            return;
        }
        Laya.LocalStorage.setItem(GetCDNData.localVerName, JSON.stringify(GetCDNData.allCDNConfigVersion[1]));
    }
    //更改版本号
    static ChangeConfigVersion(_type: 0 | 1, _key: string, _handle: 'clear' | 'set' | number) {
        if (GetCDNData.allCDNConfigVersion.length < 2) {
            console.error('ChangeConfigVersion 错误');
            return;
        }
        if (CDNConfig.switches.CDNConfigVersion && _key in CDNConfig.switches.CDNConfigVersion && _key in GetCDNData.allCDNConfigVersion[_type]) {
            if (_handle == 'clear') {
                GetCDNData.allCDNConfigVersion[_type][_key] = 0;
            }
            else if (_handle == 'set') {
                GetCDNData.allCDNConfigVersion[_type][_key] = (CDNConfig.switches.CDNConfigVersion as any)[_key];
            }
            else {
                GetCDNData.allCDNConfigVersion[_type][_key] = _handle;
            }
        }
    }
    static storeCVname = 'CDNstoreConfig';
    private static getLocalConfig(_key: string) {
        let _r = null as any;
        try {
            _r = Laya.LocalStorage.getItem(GetCDNData.storeCVname + _key);
            if (_r) {
                _r = JSON.parse(_r);
            }
        } catch (error) {
            console.error('getLocalConfig出错: ', _key, error);
        }
        return _r;
    }
    static storetLocalConfig(_key: string, _data: any) {
        console.log('storetLocalConfig', _key, _data);
        // console.log('storetLocalConfig', CDNConfig.switches.CDNConfigVersion, GetCDNData.allCDNConfigVersion[1]);

        if (CDNConfig.switches.CDNConfigVersion && _key in CDNConfig.switches.CDNConfigVersion && _key in GetCDNData.allCDNConfigVersion[1]) {
            // console.log('storetLocalConfig1111', _key, _data);
            try {
                Laya.LocalStorage.setItem(GetCDNData.storeCVname + _key, JSON.stringify(_data));
            } catch (error) {
                console.error('storetLocalConfig出错: ', _key, error);
                return;
            }

            GetCDNData.ChangeConfigVersion(1, _key, 'set');
            GetCDNData.storeLocalConfigVersion();
            // console.log('存储到本地的版本：', _key, GetCDNData.allCDNConfigVersion[1][_key]);
        }
        else if ('switches' != _key) {
            // console.log('storetLocalConfig', CDNConfig.switches.CDNConfigVersion, GetCDNData.allCDNConfigVersion[1]);
            console.error('storetLocalConfig：', _key, '未能存储到本地');
        }

    }
    /**
     * 清理FetchOrder内本地存储
     */
    static ClearLocalStoreByOrder() {
        this.ClearLocalConfigVersion();
        this.Init();
        // for (const orders of FetchOrder) {
        //     for (const config of orders) {
        //         console.error('ClearLocalStoreByOrder config', config);
        //         if ('switches' == config) {
        //             this.ClearLocalConfigVersion();
        //         }
        //         else {
        //             if (config && config in CDNConfig.switches.CDNConfigVersion) {
        //                 GetCDNData.allCDNConfigVersion[0][config] = 0;
        //                 GetCDNData.allCDNConfigVersion[1][config] = 0;
        //                 console.error('ClearLocalStoreByOrder allCDNConfigVersion 1', config, GetCDNData.allCDNConfigVersion[1][config]);
        //                 (CDNConfig.switches.CDNConfigVersion as any)[config] = 0;
        //                 this.ClearLocalConfig(config);
        //             }
        //         }
        //     }
        // }
        // console.error('ClearLocalStoreByOrder', JSON.stringify(GetCDNData.allCDNConfigVersion));

    }
    static ClearLocalConfigVersion() {
        Laya.LocalStorage.removeItem(GetCDNData.localVerName);
    }
    static ClearLocalConfig(_key: string) {
        Laya.LocalStorage.removeItem(GetCDNData.storeCVname + _key);
    }
    private static getVersionNumber(versionStr: string) {
        return versionStr.split('.').reduce((o, v, i) => {
            return o += parseInt(v) * Math.pow(10, (2 - i) * 2);
        }, 0);
    }
    static async loadRemote(url: string): Promise<any> {
        return new Promise((rs, rj) => {
            Laya.loader.load(url, Laya.Handler.create(this, (res) => {
                if (!res) {
                    console.error('loadRemote err', res);
                    rs(null);
                }
                else {
                    rs(res);
                }
            }), null, Laya.Loader.JSON);
            // cc.assetManager.loadRemote(url, function (err: Error | null, res: any) {
            //     if (err) {
            //         console.error('loadRemote err', err, res);
            //         rj(err);
            //     }
            //     else {
            //         rs(res);
            //     }
            // });
        })
    }
    static async WaitAllComplete(_funs: Function[]) {
        return new Promise((_rs: any) => {
            let _rn = _funs.length;
            // console.log('WaitAllComplete', _funs);

            _funs.forEach(async (element: any) => {
                // console.log('WaitAllComplete element', element);
                await element();
                _rn--;
                if (_rn == 0) {
                    _rs();
                }
            });
            // _rs();
        })
    }
}

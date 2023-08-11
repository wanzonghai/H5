import { AllDataKey, DataConfig, AllDataType } from '../../DataConfig';
import { Platform } from './../Platform/Platform';
import MyGlobal from '../../Global';
import TimeUtil from './../tools/TimeUtil';

const storeKeyName = 'dataA_';
const localSimpleKey = storeKeyName + 'ls_key';
//简单类型
const simpleType = ['number', 'boolean', 'string']
/**
 * 数据的存取管理
 */
export class DataAccess {

    private localSimpleData = null as any;
    private waitStoreServerData: { key: AllDataKey, value: any }[] = [];
    private dataStoreType: { [key: string]: (keyof typeof DataConfig) } = {} as any;
    private static instance: DataAccess = null as any;
    static INS() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new DataAccess();
        return this.instance;
    }
    /**
     * 获取本地存储的值
     * @param _data 要更改的对象
     */
    GetLocalData(_usedata: AllDataType) {
        if (!this.localSimpleData) {
            let _data = Platform.LocalStorageGetItem(localSimpleKey);
            console.log('[DataAccess]GetLocalData', _data);

            if (_data) {
                this.localSimpleData = _data;
            }
            else {
                this.localSimpleData = {};
            }
        }
        let _usedata2: any = _usedata;
        let getData = [DataConfig.localData, DataConfig.ser_localData];
        getData.forEach(config => {
            for (const key in config) {
                // console.log('[DataAccess]GetLocalData key', key);

                //判断是否为简单类型
                if (simpleType.indexOf(typeof _usedata2[key]) > -1) {
                    if (key in this.localSimpleData) {
                        _usedata2[key] = this.localSimpleData[key];
                    }
                }
                else {
                    let _data = Platform.LocalStorageGetItem(storeKeyName + key);
                    // console.log('[DataAccess]GetLocalData _data', storeKeyName + key, _data);
                    if (_data) {
                        _usedata2[key] = _data;
                    }
                }
            }
        });

    }
    /**
     * 获取数据的存储类型
     * @param _key 数据键
     * @param _type 类型
     */
    InitStoreType(_key: string, _type: keyof typeof DataConfig) {
        this.dataStoreType[_key] = _type;
    }
    /**
     * 存储数据
     * @param _key 数据键
     * @param _value 值
     */
    async StoreData(_key: AllDataKey, _value: any) {
        switch (this.dataStoreType[_key]) {
            case 'tempData':
                break;
            case 'localData':
                this.localStore(_key, _value);
                break;
            case 'ser_localData':
                this.localStore(_key, _value);
                let _idx = this.waitStoreServerData.findIndex(v => v.key == _key);
                if (_idx < 0) {
                    this.waitStoreServerData.push({ key: _key, value: _value });
                } else {
                    this.waitStoreServerData[_idx].value = _value;
                }

                this.continueUpload();
                break;
            case 'serverData':
                return await this.ServerStore([{ key: _key, value: _value }]);
            default:
                console.error('DataAccess', '未处理的数据类型', _key);
                break;
        }
        return true;
    }

    /**
     * 本地存储方法
     * @param _key 数据键
     * @param _value 值
     */
    private localStore(_key: AllDataKey, _value: any) {
        //对存储进行分类，简单数值存到一个键中，方便读取
        console.log('[DataAccess] localStore type', _key, typeof _value);
        if (simpleType.indexOf(typeof _value) > -1) {
            this.localSimpleData[_key] = _value;
            Platform.LocalStorageSetItem(localSimpleKey, this.localSimpleData);
        }
        else {
            Platform.LocalStorageSetItem(storeKeyName + _key, _value);
        }

    }

    /**
     * 服务端存储方法
     * @param _key 数据键
     * @param _value 值
     */
    async ServerStore(_data: { key: AllDataKey, value: any }[], trytime = 3) {
        if (!MyGlobal.hhgame) {
            console.error('[ServerStore] hhgame 不存在');
            return false;
        }
        //对存储进行分类，简单数值存到一个键中，方便读取
        console.log('[DataAccess] ServerStore', _data);
        // 开始同步
        for (let index = 0; index < trytime; index++) {
            try {
                await MyGlobal.hhgame.kv.setMany(_data);
                console.log('[DataAccess] ServerStore 存储成功', _data);
                return true;
            }
            catch (e) {
                console.error('[DataAccess] ServerStore 存储失败', e);
                await TimeUtil.wait(100);
            }
        }
        return false;


    }
    /**
     * 服务端读取方法
     * @param _key 数据键
     * @param _value 值
     */
    async ServerFetch(_keys: AllDataKey[], trytime = 3) {
        if (!MyGlobal.hhgame) {
            console.error('[ServerStore] hhgame 不存在');
            return null;
        }
        //对存储进行分类，简单数值存到一个键中，方便读取
        console.log('[DataAccess] ServerFetch', _keys);
        // 开始同步
        for (let index = 0; index < trytime; index++) {
            try {
                return await MyGlobal.hhgame.kv.getMany(_keys);
            }
            catch (e) {
                console.error('[DataAccess] ServerFetch 失败', _keys, e);
                await TimeUtil.wait(100);
            }
        }
        return null;
    }
    //持续上传
    private timeID = null as any;
    private inContinueUpload = false;
    private async continueUpload(_delayTime = 5) {
        if (this.inContinueUpload) {
            return;
        }
        if (!this.waitStoreServerData || this.waitStoreServerData.length <= 0) {
            return;
        }
        //有等待上传任务则继续等待
        if (this.timeID) {
            // clearTimeout(this.timeID);
            // this.timeID = null;
            return;
        }
        console.log('continueUpload 000', MyGlobal.IsLogin(), Platform.IsNetConnected());
        //有网络才上传
        if (MyGlobal.IsLogin() && Platform.IsNetConnected()) {
            this.inContinueUpload = true;
            let _curData = this.waitStoreServerData;
            this.waitStoreServerData = [];
            console.log('continueUpload _curData', _curData);

            let _result = await this.ServerStore(_curData);
            // console.log('continueUpload _curData22222', _curData);
            this.inContinueUpload = false;
            if (_result) {
                //上传成功检测是否还有需要上传的
                // this.continueUpload(_delayTime);
                // return;
                //上传成功 _delayTime 秒后继续检测上传
            }
            else {
                //上传失败,重新整理数据,_delayTime秒后重试
                this.waitStoreServerData.forEach(element => {
                    let _idx = _curData.findIndex(v => v.key == element.key)
                    if (_idx >= 0) {
                        _curData[_idx] = element;
                        return;
                    }
                    _curData.push(element);
                });
                this.waitStoreServerData = _curData;
            }

        }
        this.timeID = setTimeout(() => {
            this.timeID = null;
            this.continueUpload(_delayTime);
        }, _delayTime * 1000);

    }

}
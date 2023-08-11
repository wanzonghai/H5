
import { DataAccess } from './DataAccess';
import { AllDataType, DataConfig, ServerDataKey, ServerDataType, NormalDataKey, NormalDataType, AllDataKey } from '../../DataConfig';
import { Platform } from './../Platform/Platform';


const listenKey = 'Listen_';
// type T = keyof(typeof DataConfig)
/**
 * 数据管理
 */
class DataManager_C {
    private useData: AllDataType = {} as any;
    private listenID = 0;

    private isInit = false;
    private listener: any = {};
    private static instance: DataManager_C = null as any;
    static INS() {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new DataManager_C();
        this.instance.isInit = false;
        return this.instance;
    }
    /**
     * 初始化
     * _versionChecking 版本校验（当不同版本数据格式有更改时在此处处理）
     */
    async Init(_versionChecking?: Function) {
        if (this.isInit) {
            return;
        }
        this.listenID = 0;
        for (const k in DataConfig) {

            for (const key in (DataConfig as any)[k]) {
                if (key in this.useData) {
                    throw new Error('[DataManager]重复的数据名:' + key)
                }
                if (k == 'serverData') {
                    //不对服务端数据进行初始化
                    continue;
                }
                (this.useData as any)[key] = (DataConfig as any)[k][key];
                DataAccess.INS().InitStoreType(key, k as any);
            }
        }
        //获取本地存储的值
        DataAccess.INS().GetLocalData(this.useData);
        console.log('useData', this.useData);
        _versionChecking && _versionChecking();
        //从服务端拉取 ser_localData 的数据
        this.isInit = true;


    }
    async InitLocalServer() {
        let _ser_local: AllDataKey[] = [];
        for (const key in DataConfig.ser_localData) {
            _ser_local.push(key as any);
        }
        if (_ser_local.length <= 0) {
            return true;
        }
        while (1) {
            let _data = await DataAccess.INS().ServerFetch(_ser_local);
            if (_data) {
                console.log('InitLocalServer _data', _data);
                //服务端数据赋值
                _data.forEach(element => {
                    if (this.correlationData(element.key, element.value)) {
                        // this.useData[element.key] = element.value;
                        this.Set(element.key as any, element.value)
                    }
                });
                break;
            }
            if (!await Platform.ShowModal({ title: '拉取失败', content: "服务端数据拉取失败,是否重试？", confirmText: '重试', cancelText: '取消' })) {
                break;
            }
        }
    }
    //本地和服务端数据对比
    private correlationData(_key: string, _value: any) {
        let _type = typeof _value;
        let _useData: any = (this.useData as any)[_key]
        if (_type == 'object') {
            if (this.IsObjectEquality(_useData, _value)) {
                return false;
            }
        }
        else if (_useData == _value) {
            return false;
        }
        switch (_type) {
            case 'number':
                if (_value > _useData) {
                    return true;
                }
                return false;
            case 'string':
                if (_value.length > _useData.length) {
                    return true;
                }
                return false;
            case 'object':
                if (Array.isArray(_value)) {
                    if (_value.length > _useData.length) {
                        return true;
                    }
                }
                else if (Object.keys(_value).length > Object.keys(_useData).length) {
                    return true;
                }
                return false;
            default:
                break;
        }
        return false;
    }
    /**
     * 设置服务端数据
     * @param _key 数据键
     * @param _value 数据值
     */
    async SetServer<T extends ServerDataKey>(_data: { key: T, value: ServerDataType[T] }[]) {
        let _changedata: { key: T, value: ServerDataType[T] }[] = [];
        for (let index = 0; index < _data.length; index++) {
            const element = _data[index];
            if (!(element.key in this.useData)) {
                //数据未拉取
                throw new Error('SetServer key 未被初始化，请先调用 InitLocalServer 进行初始化');

            }
            if (element.value == this.useData[element.key]) {
                continue;
            }
            _changedata.push(element);
        }
        if (_changedata.length <= 0) {
            return true;
        }
        console.log('[DataManager]SetServer:', _data);
        //数据存储
        if (await DataAccess.INS().ServerStore(_changedata)) {
            _changedata.forEach(v => {
                //监听变更
                if (this.listener[v.key]) {
                    (this.listener[v.key] as any[]).forEach(l => {
                        l.call({ key: v.key, value: v.value, oldV: this.useData[v.key] });
                    });
                }
                this.useData[v.key] = v.value;
            });
            return true;
        }

        return false;
    }
    /**
     * 从服务端初始化数据(服务端数据需要先调用此方法拉取数据确保数据真实)
     * @param _key 数据键
     */
    async InitByServer<T extends ServerDataKey>(_keys: T[]) {
        let _needkeys: any[] = [];
        _keys.forEach(key => {
            if (!(key in this.useData)) {
                _needkeys.push(key);
            }
        });
        if (_needkeys.length <= 0) {
            return true;
        }
        let _data = await DataAccess.INS().ServerFetch(_needkeys);
        if (_data) {
            console.log('InitByServer _data', _data);

            //初始化数据（防止服务端没有此数据）
            _needkeys.forEach(key => {
                (this.useData as any)[key] = (DataConfig.serverData as any)[key];
            });
            //服务端数据赋值
            _data.forEach(element => {
                (this.useData as any)[element.key] = element.value;
            });
            _needkeys.forEach(key => {
                console.log('InitByServer useData', key, (this.useData as any)[key]);
            });

            return true;
        }
        return false;
    }
    /**
     * 服务端数据增长
     * （目前只支持 number和 string 类型）
     * @param _key 数据键
     * @param _addvalue 在元数据基础上增长的值
     */
    async AddServer<T extends ServerDataKey>(_key: T, _addvalue: ServerDataType[T]) {
        let _oldv: any = this.useData[_key];
        switch (typeof this.useData[_key]) {
            case 'number':
            case 'string':
                // console.log('Add', _key, _oldv + _addvalue);
                return await this.SetServer([{ key: _key, value: _oldv + (_addvalue as any) }]);
                break;
            default:
                console.error('[DataManager]Add:', '未处理的数据类型', _key, typeof this.useData[_key]);
                break;
        }
        return false;
    }
    /**
     * 设置数据
     * @param _key 数据键
     * @param _value 数据值
     * @param _store 是否存储数据，某些不需要存储的情况可以主动要求不存储
     */
    Set<T extends NormalDataKey>(_key: T, _value: NormalDataType[T], _store = true) {
        if (typeof this.useData[_key] == 'object') {
            // if (this.IsObjectEquality(this.useData[_key] as object, _value as object)) {
            //     return;
            // }
        }
        else if (_value == this.useData[_key]) {
            return;
        }
        let _old = this.useData[_key];

        this.useData[_key] = _value as any;

        // 监听变更
        if (this.listener[_key]) {
            (this.listener[_key] as any[]).forEach(l => {
                l.call({ key: _key, value: this.useData[_key], oldV: _old });
            });
        }
        // cc.director.emit(listenKey + _key, _value);
        // console.log('[DataManager]Set:', _key, _value);
        //数据存储
        _store && DataAccess.INS().StoreData(_key, _value);
    }
    /**
     * 获取数据
     * @param _key 数据键
     */
    Get<T extends AllDataKey>(_key: T) {
        if (!(_key in this.useData)) {
            //数据未拉取
            throw new Error(`[DataManager]Get ${_key} 未被初始`);
        }
        // console.log('[DataManager]Get', _key, this.useData[_key]);

        return this.useData[_key];
    }
    /**
     * 数据增长
     * （目前只支持 number和 string 类型）
     * @param _key 数据键
     * @param _addvalue 在元数据基础上增长的值
     */
    Add<T extends NormalDataKey>(_key: T, _addvalue: NormalDataType[T]) {
        let _oldv: any = this.useData[_key];
        switch (typeof this.useData[_key]) {
            case 'number':
            case 'string':
                // console.log('Add', _key, _oldv + _addvalue);
                this.Set(_key, _oldv + _addvalue)
                break;
            default:
                console.error('[DataManager]Add:', '未处理的数据类型', _key, typeof this.useData[_key]);
                break;
        }
    }
    /**
     * 监听数据
     * @param _key 数据键
     * @param callBack 数据键
     */
    Listen<T extends AllDataKey>(_keys: T[], callBack: (_v: { key: T, value: AllDataType[T], oldV?: AllDataType[T] }) => void) {
        this.listenID++;
        for (const _key of _keys) {
            if (!this.listener[_key]) {
                this.listener[_key] = [];
            }
            // else {
            //     let _idx = this.listener[_key].indexOf(callBack);
            //     if (_idx >= 0) {
            //         continue;
            //     }
            // }
            this.listener[_key].push({ id: this.listenID, call: callBack });
            callBack({ key: _key, value: this.useData[_key], oldV: this.useData[_key] })
        }
        return this.listenID;
    }
    /**
     * 取消监听
     * @param _key 数据键
     * @param callBack 数据键
     */
    UnListen<T extends AllDataKey>(_keys: T[], id: number) {
        for (const _key of _keys) {
            if (!this.listener[_key]) {
                continue;
            }
            let _idx = (this.listener[_key] as any[]).findIndex(v => v.id == id);
            if (_idx < 0) {
                continue;
            }
            this.listener[_key].splice(_idx, 1);
            if (this.listener[_key].length == 0) {
                this.listener[_key] = null;
            }
        }


    }
    //对象是否相等
    private IsObjectEquality(obj1: object, obj2: object) {
        let _obj1: any = obj1;
        let _obj2: any = obj2;
        if (Object.keys(obj1).length != Object.keys(obj2).length) {
            return false;
        }
        for (const key in obj1) {
            let _type1 = typeof _obj1[key];
            let _type2 = typeof _obj2[key];
            if (_type1 != _type2) {
                return false;
            }
            if (_type1 == 'object') {
                if (!this.IsObjectEquality(_obj1[key], _obj2[key])) {
                    return false;
                }
            }
            if (_obj1[key] != _obj2[key]) {
                return false;
            }
        }
        return true;
    }
}
export const DataManager = DataManager_C.INS();

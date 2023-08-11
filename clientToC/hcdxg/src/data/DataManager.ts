
var LocalStorage = Laya.LocalStorage;
declare var my;
/**
 * 所有的玩家游戏数据，增删改查，都通过此类实现
 * 热数据 -> 实时同步到LocalStorage -> 按策略同步到远端
 */
export default class DataManager<T extends { [key: string]: any }> {

    protected _defaultData: T;
    protected _data: any;
    _dataKey: string;

    constructor(defaultData: T, dataKey, hhKvTag: string) {
        this._defaultData = defaultData;
        this._data = defaultData;
        this._dataKey = dataKey;
    }
    isInited = false;
    
    init() {
        if (this.isInited) {
            return;
        }
        let isNoKey = false;  //是否有新的key
        if(Laya.Browser.onTBMiniGame){
            let data = my.getStorageSync({key: this._dataKey});
            //console.log("data: ",data);

            if (data && data["data"]) {
                let keys = Object.keys(this._defaultData);
                for(let i = 0; i < keys.length ; i++){
                    let key = keys[i];
                    if(data["data"][key] == undefined) continue;
                    isNoKey = true;
                    this._data[key] = data["data"][key];
                }
            }else{
                this._data = this._defaultData;
            }

            if(isNoKey){
                my.setStorage({
                    key: this._dataKey,
                    data: this._data,
                    success: function() {
                    //console.log("写入成功");
                    }
                });
            }
        }else{
            let data = LocalStorage.getItem(this._dataKey);
            //console.log("data: ",data);

            if(data) {
                let keys = Object.keys(this._defaultData);
                for(let i = 0; i < keys.length ; i++){
                    let key = keys[i];
                    if(JSON.parse(data)[key] == undefined) continue;
                    isNoKey = true;
                    this._data[key] = JSON.parse(data)[key];
                }
            }

            LocalStorage.setItem(this._dataKey, JSON.stringify(this._data));
        }

        this.isInited = true;
    }

    /** 设置（KEY VALUE
     * @param key ReadKey
     * @param value Value
     */
    setData(key, value, isSave = true, isPush = false) {
        this._data[key] = value;

        if (isPush) {
            try {
                //开启推送会同步到服务器
                // Global.hhgame.kv.set(key, value);
            } catch (error) {
                console.error('setData', error);
            }
        }

        if (isSave) {
            this.saveDataToStorage();
        }

        //监听数据
        let listeners = this._changeHandlers[key as string];
        if (listeners) {
            listeners.forEach(v => {
                v(value);
            })
        }
    }

    get data(): T {
        if (!this._data) {
            throw new Error('DataManager尚未初始化');
        }
        return this._data;
    }

    /**
  * 保存到存储地
  * @param flushData 立即刷新到存储池（非本地存储）
  */
    saveDataToStorage() {
        if(Laya.Browser.onTBMiniGame){
            // my.setStorageSync({key: this._dataKey,data: this._data});
            my.setStorage({
                key: this._dataKey,
                data: this._data,
                success: function() {
                    //console.log("写入成功");
                }
            });
        }else{
            LocalStorage.setItem(this._dataKey, JSON.stringify(this._data));
        }
    }

    cleanData(options: {
        clearLocalStorage?: boolean,
        clearRemote?: boolean
    } = {}) {
        this._data = this._defaultData;
        
        if (options.clearLocalStorage) {
            let keys = Object.keys(this._defaultData);
            keys.forEach(v => {
                LocalStorage.removeItem(v);
            });
        }
    }

//     /**
//   * 从服务端获取数据
//   * @param _keyArr:string[] 
//   */
//     async GetDataFromServer(_keyArr) {
//         let remoteData: { key: string, value: any }[] | undefined;
//         // 限制重试次数
//         for (let i = 0; i < RETRY_TIME; ++i) {
//             try {
//                 remoteData = await Global.hhgame.kv.getMany(_keyArr);
//                 break;
//             }
//             catch (e) {
//                 console.error('DataStorageManager._pullDataFromRemote getByTags failed', e);
//                 await TimeUtil.wait(1000);
//             }
//         }

//         if (!remoteData) {
//             throw new Error('获取游戏数据失败');
//         }

//         for (let item of remoteData) {
//             this._data[item.key] = item.value;
//         }
//         this.saveDataToStorage();
//     }

    /** 数值变化监听 */
    private _changeHandlers: {
        [key: string]: ((newValue: any) => void)[] | undefined
    } = {};

    /** 增加数值变化时的事件监听 */
    listen<K extends keyof T>(key: K, handler: (newValue: T[K]) => void) {
        let listeners = this._changeHandlers[key as string];
        if (listeners) {
            // 已经存在该Listener
            if (listeners.indexOf(handler) > -1) {
                return;
            }
        }
        else {
            listeners = this._changeHandlers[key as string] = [];
        }
        listeners.push(handler);
    }

    /** 增加数值变化时的事件监听 */
    unlisten(key: string, handler?: Function) {
        if (!handler) {
            delete this._changeHandlers[key];
            return;
        }

        if (this._changeHandlers[key]) {
            delete this._changeHandlers[key];
        }
    }

    //保存登录下发的数据
    savePlayerData(playerData){
        this.setData('userOpenId', playerData.userOpenId, false);
        this.setData('name', playerData.nickName, false);
        this.setData('avatar', playerData.headUrl, false);
        this.setData('coin', playerData.userCoin, false);
        this.setData('integral', playerData.integral, false);
        this.setData('lianshengCount', playerData.lianshengCount, false);
        this.setData('isVip', playerData.isVip, false);
        this.setData('isMember', playerData.isMember, false);  //是否是会员
        this.setData('curSeason', playerData.curSeason, false);
        this.setData('point', playerData.point, false);
        this.setData('bestPoint', playerData.bestPoint, false);  //最好成绩
        this.setData('bestRank', playerData.bestRank, false);
        this.setData('bestSeason', playerData.bestSeason, false);
        this.setData('bestWin', playerData.bestWin, false);
        this.setData('allWin', playerData.allWin, false);
        this.setData('rewardTimes_free', playerData.rewardTimes_free, false);
        this.setData('rewardTimes_challenge', playerData.rewardTimes_challenge, false);
        this.setData('rewardTimes_share', playerData.rewardTimes_share, false);
        this.setData('rewardTimes_live', playerData.rewardTimes_live, false);
        this.setData('rewardTimes_lookGoods', playerData.rewardTimes_lookGoods, false);
        this.setData('rewardTimes_member', playerData.rewardTimes_member, false);//会员领奖次数
        this.setData('rewardTimes_favor', playerData.rewardTimes_favor, false);
        this.setData('rewardTimes_kgold', playerData.rewardTimes_kgold, false);
        this.setData('rewardTimes_invitation', playerData.rewardTimes_invitation, false);
        this.setData('rewardTimes_buy', playerData.rewardTimes_buy, false);
        this.setData('rewardTimes_memberFree', playerData.rewardTimes_memberFree, false);
        this.setData('rewardTimes_collectGoods', playerData.rewardTimes_collectGoods, false);
        this.setData('rewardTimes_dayReward', playerData.rewardTimes_dayReward, false);
        
        this.setData('challenge', playerData.count_challenge, false);
        this.setData('share', playerData.count_share, false);
        this.setData('browse', playerData.count_look, false);
        this.setData('order', playerData.count_kgold, false);
        this.setData('invite', playerData.count_invitation, true);

    }
}
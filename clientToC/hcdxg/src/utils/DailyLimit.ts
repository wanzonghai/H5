import MainUtil from './MainUitl';
declare var my;
// localstorage存储 Key的统一前缀
const LS_KEY_PREFIX = 'DailyLimit_';

// 每日次数限制
export let LIMIT = {
    // 每日免费
    DAILYFREE: {
        key: 'dailyfree',
        limit: 3
    },
    CHALLENGE: {
        key: 'challenge',
        limit: 1
    },
    INVITE: {
        key: 'invite',
        limit: 1
    },
    LIVE: {
        key: 'live',
        limit: 1
    },
    BROWSE: {
        key: 'browse',
        limit: 1
    }
}

export interface DailyLimitConf {
    key: string,
    limit: number
}

/**
 * 每次次数上限限制
 * 使用localstorage存储
 */
export default class DailyLimit {
    /**
     * 使用今天的次数
     * 增加成功返回true，
     * 如果增加失败（今日次数已经用完），返回false
     * @param key 
     * @param addNum 
     * @param limit 
     */
    static use(conf: DailyLimitConf, useNum: number): boolean {
        let countData: any = this._setIfNull(conf.key, conf.limit);
        let resetNum = countData.count - useNum;
        if (resetNum < 0) {
            return false;
        } else {
            countData.count = resetNum;
            if(Laya.Browser.onTBMiniGame){
                my.setStorage({
                    key: LS_KEY_PREFIX + conf.key,
                    data: countData,
                    success: function() {
                        console.log("写入成功");
                    }
                });
            }else{
                Laya.LocalStorage.setJSON(LS_KEY_PREFIX + conf.key, countData);
            }
        }
        return true;
    }

    /**
     * 获取今日剩余次数
     * @param key 
     * @param limit 
     */
    static getLeftNum(conf: DailyLimitConf): number {
        let countData: any = this._setIfNull(conf.key, conf.limit);
        return countData.count;
    }

    /**
     * 今日奖励次数是否已经用完
     * 小于等于0返回true
     * @param key 
     * @param limit 
     */
    static isUsedUp(conf: DailyLimitConf): boolean {
        let countData: any = this._setIfNull(conf.key, conf.limit);
        return countData.count <= 0;
    }

    private static _setIfNull(key: string, limit: number) {
        // let countData: any = Laya.LocalStorage.getJSON(LS_KEY_PREFIX + key);
        let countData = null;
        if(Laya.Browser.onTBMiniGame){
            countData = my.getStorageSync({
                key: LS_KEY_PREFIX + key
            });
            if (!countData || countData.date != MainUtil.getDate()) {
                countData = {};
                countData.count = limit;
                countData.date = MainUtil.getDate();
                my.setStorage({
                    key: LS_KEY_PREFIX + key,
                    data: countData,
                    success: function() {
                        console.log("写入成功");
                    }
                });
            }
        }else{
            countData = Laya.LocalStorage.getJSON(LS_KEY_PREFIX + key);
            if (!countData || countData.date != MainUtil.getDate()) {
                countData = {};
                countData.count = limit;
                countData.date = MainUtil.getDate();
                Laya.LocalStorage.setJSON(LS_KEY_PREFIX + key, countData);
            }
        }
        
        return countData;
    }
}
import { DailyLimitConfig, DailyLimitType } from "../../DailyLimitConfig";
import MathUtil from "./MathUtil";

// LocalStorage存储 Key的统一前缀
const LS_KEY_PREFIX = 'DailyLimit_';

/**
 * 每次次数上限限制
 * 使用LocalStorage存储
 */
export default class DailylLimit {
    private static limitData: any = {};
    /**
     * 使用今天的次数
     * 增加成功返回true，
     * 如果增加失败（今日次数已经用完），返回false
     * @param key 
     * @param addNum 
     * @param limit 
     */
    static use(conf: DailyLimitType, useNum: number): boolean {
        let _data = this._setIfNull(conf);
        let resetNum = _data.count - useNum;
        if (resetNum < 0) {
            return false;
        }
        else {
            _data.count = resetNum;
            Laya.LocalStorage.setItem(LS_KEY_PREFIX + conf, JSON.stringify(_data));
        }
        return true;
    }

    /**
     * 获取今日剩余次数
     * @param key 
     * @param limit 
     */
    static getRemainedNum(conf: DailyLimitType): number {
        let _data = this._setIfNull(conf);
        return _data.count;
    }


    /**
     * 今日奖励次数是否已经用完
     * 小于等于0返回true
     * @param key 
     * @param limit 
     */
    static isUsedUp(conf: DailyLimitType): boolean {
        let _data = this._setIfNull(conf);
        return _data.count <= 0;
    }

    private static _setIfNull(key: DailyLimitType): { count: number, date: string } {
        let countData: any = this.limitData[key];
        let _date = MathUtil.dateFormat(new Date(), "yyyy-MM-dd");
        // let _date = (new Date()).format("yyyy-MM-dd");
        if (countData && _date == countData.date) {
            return countData;
        }
        if (!countData) {
            countData = Laya.LocalStorage.getItem(LS_KEY_PREFIX + key);
            if (countData) {
                countData = JSON.parse(countData);
            }
        }

        if (!countData || countData.date !== _date) {

            countData = {};
            countData.count = DailyLimitConfig[key];
            countData.date = _date;
            Laya.LocalStorage.setItem(LS_KEY_PREFIX + key, JSON.stringify(countData));
        }
        this.limitData[key] = countData
        return countData;
    }
}
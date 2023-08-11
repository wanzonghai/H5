import { PlayData } from '../data/PlayData';
import PlayDataUtil from '../data/PlayDataUtil';
import { Global } from "../config/Global";
import Loading from '../fgui/Loading';

export default class Utils {
    constructor() { }

    //通过权重获取元素
    public static getItemByRate(itemArray, rateArray) {
        let r = Math.floor(Math.random() * 100);
        let num = 0;
        let item = itemArray[0];
        for (let i in rateArray) {
            num += rateArray[i];
            if (r <= num) {
                item = itemArray[i];
                break;
            }
        }
        return item;
    }

    //修改积分数并保存
    public static changeIntegral(addCount) {
        let curIntegral = this.getIntegral();
        curIntegral += addCount;
        PlayDataUtil.setData("integral", curIntegral);
    }

    //获取积分数量
    public static getIntegral() {
        let curIntegral = PlayDataUtil.data.integral;
        return curIntegral;
    }

    //是否是第一次进入
    public static isFirstEnter() {
        let isFirst = PlayDataUtil.data.isFirstEnter;
        return isFirst;
    }

    //设置已经进入过游戏进入
    public static setIsEnter() {
        PlayDataUtil.setData("isFirstEnter", 0);
    }

    //修改连胜次数
    public static changeLianshengCount(count) {
        PlayDataUtil.setData("lianshengCount", count);
    }

    //获取连胜次数
    public static getLianshengCount() {
        let count = PlayDataUtil.data.lianshengCount;
        return count;
    }

    //修改第一名次数并保存
    public static changeFirstCount(addCount) {
        let curCount = PlayDataUtil.data.heroFirstCount;
        curCount += addCount;
        PlayDataUtil.setData("heroFirstCount", curCount);
    }

    //获取第一名次数
    public static getFirstCount() {
        let count = PlayDataUtil.data.heroFirstCount;
        return count;
    }

    //保存当前选中的角色ID
    public static saveCurRoleID(id) {
        PlayDataUtil.setData("curRoleID", id);
    }

    //获取当前角色ID
    public static getCurRoleID() {
        let count = PlayDataUtil.data.curRoleID;
        return count;
    }

    //保存自己拥有的角色
    public static saveMyRoleIDArray(id) {
        id = parseInt(id);
        let arr = Utils.getMyRoleIDArray();

        let isHave = false;
        for (let i of arr) {
            if (i == id) {
                isHave = true;
            }
        }
        if (!isHave) {
            arr.push(id);
        }
        PlayDataUtil.setData("myRoleIDArray", arr);
    }

    //获取自己已拥有的角色
    public static getMyRoleIDArray() {
        let arr = PlayDataUtil.data.myRoleIDArray;
        return arr;
    }

    //获取当前段位的名称
    public static getRankName(curIntegral) {//下一个积分的段位
        let name = "";
        // let levelInfo = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.levelConfig);

        // for (let idx in levelInfo) {
        //     let integral = levelInfo[idx].integral;
        //     if (curIntegral < integral) {
        //         name = levelInfo[idx].level;
        //         break;
        //     }
        // }
        return name;
    }

    //获取当前段位序号
    public static getDuanweiId(curIntegral) {
        let id = 0;
        // let levelInfo = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.levelConfig);

        // for (let idx in levelInfo) {
        //     let integral = levelInfo[idx].integral;
        //     if (curIntegral < integral) {
        //         id = levelInfo[idx].id;
        //         break;
        //     }
        // }
        return id;
    }

    //获取当前段位
    public static getDuanweiIdx(curIntegral) {
        let levelIdx = 0;
        // let levelInfo = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.levelConfig);

        // for(let idx in levelInfo){
        //     let integral = levelInfo[idx].integral;
        //     if(curIntegral < integral){
        //         levelIdx = levelInfo[idx].duanwei;
        //         break;
        //     }
        // }
        return levelIdx;
    }

    //获取当前段位的最小积分
    public static getMinIntegral(curIntegral) {
        let minNum = 0;
        // let levelInfo = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.levelConfig);

        // for(let idx = levelInfo.length - 1; idx >= 0; idx--){
        //     let integral = levelInfo[idx].integral;
        //     if(curIntegral >= integral){
        //         minNum = levelInfo[idx].integral;
        //         break;
        //     }
        // }
        return minNum;
    }

    //获取当前最大的积分
    public static getMaxIntegral(curIntegral) {
        let maxNum = 0
        // let levelInfo = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.levelConfig);
        // maxNum = levelInfo[levelInfo.length - 1].integral;
        // for (let idx in levelInfo) {
        //     let integral = levelInfo[idx].integral;
        //     if (curIntegral < integral) {
        //         maxNum = levelInfo[idx].integral;
        //         break;
        //     }
        // }
        return maxNum;
    }

    //创建loading界面
    static _loadingLayer: Loading;
    public static showLoading() {
        if (this._loadingLayer == null) {
            this._loadingLayer = new Loading();
        }
    }

    //关闭loading界面
    public static closeLoading() {
        if (this._loadingLayer) {
            this._loadingLayer.close();
            this._loadingLayer = null;
        }
    }

    //截取指定长度的字符串，省略部分补...
    public static getCutString(str, length) {
        let newStr = "";
        for (let i = 0; i < str.length; i++) {
            if (i < length) {
                var reg1 = new RegExp(/^[0-9]*$/);
                if (reg1.test(str[i])) {
                    newStr += " " + str[i];
                }
                else {
                    newStr += str[i];
                }
            }
            else if (i == length) {
                newStr += "...";
            }
            else {
                break;
            }
        }
        return newStr;
    }

    //字符串截取
    //str 需要截断的字符串
    //maxChars 保留的汉字长度（汉子占2位）
    //suffix 添加的后缀 （注意，如果后缀不为null或者'' ，则要占用一个汉字的位置)
    static strClamp(str: string, maxChars: number, suffix: string): string {
        var toCodePoint = function (unicodeSurrogates) {
            var r = [], c = 0, p = 0, i = 0;
            while (i < unicodeSurrogates.length) {
                var pos = i;
                c = unicodeSurrogates.charCodeAt(i++);//返回位置的字符的 Unicode 编码 
                if (c == 0xfe0f) {
                    continue;
                }
                if (p) {
                    var value = (0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00));
                    r.push({
                        v: value,
                        pos: pos,
                    }); //计算4字节的unicode
                    p = 0;
                } else if (0xD800 <= c && c <= 0xDBFF) {
                    p = c; //如果unicode编码在oxD800-0xDBff之间，则需要与后一个字符放在一起
                } else {
                    r.push({
                        v: c,
                        pos: pos
                    }); //如果是2字节，直接将码点转为对应的十六进制形式
                }
            }
            return r;
        }

        suffix = suffix == null ? '...' : suffix;
        maxChars *= 2;

        var codeArr = toCodePoint(str);
        var numChar = 0;
        var index = 0;
        for (var i = 0; i < codeArr.length; ++i) {
            var code = codeArr[i].v;
            var add = 1;
            if (code >= 128) {
                add = 2;
            }

            //如果超过了限制，则按上一个为准
            if (numChar + add > maxChars) {
                break;
            }

            index = i;

            //累加
            numChar += add;
        }

        if (codeArr.length - 1 == index) {
            return str;
        }

        var more = suffix ? 1 : 0;

        return str.substring(0, codeArr[index - more].pos + 1) + suffix;
    }
}
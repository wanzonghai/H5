import { PlayData } from '../data/PlayData';
import PlayDataUtil from '../data/PlayDataUtil';
import { Global } from "../config/Global";
import Loading from '../fgui/Loading';

export default class MyUtils {
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
        let arr = MyUtils.getMyRoleIDArray();

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
        // let levelInfo = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.levelConfig);
        let name = "";
        // for(let idx in levelInfo){
        //     let integral = levelInfo[idx].integral;
        //     if(curIntegral < integral){
        //         name = levelInfo[idx].level;
        //         break;
        //     }
        // }
        return name;
    }

    //获取当前段位序号
    public static getDuanweiId(curIntegral) {
        // let levelInfo = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.levelConfig);
        let id = 0;
        // for(let idx in levelInfo){
        //     let integral = levelInfo[idx].integral;
        //     if(curIntegral < integral){
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

        let maxNum = 0;
        // let levelInfo = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.levelConfig);
        // maxNum = levelInfo[levelInfo.length - 1].integral;
        // for(let idx in levelInfo){
        //     let integral = levelInfo[idx].integral;
        //     if(curIntegral < integral){
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
        let lastStr = "";
        var regNum = new RegExp(/^[0-9]*$/);
        var regStr = new RegExp(/(?!.*?_$)[a-zA-Z0-9_]+$/);
        for (let i = 0; i < str.length; i++) {
            if (i < length) {
                // if (reg1.test(str[i])) {
                //     newStr += " "+ str[i];
                // }
                // else{
                //     newStr += str[i];
                // }
                //newStr += str[i];
                if ((regNum.test(lastStr) && !regStr.test(str[i])) || (!regStr.test(lastStr) && regNum.test(str[i]))) {
                    newStr += " " + str[i];
                }
                else {
                    newStr += str[i];
                }
                lastStr = str[i];
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

    //截取指定长度的字符串，省略部分补...
    public static getCutString2(str, length) {
        let newStr = "";
        for (let i = 0; i < str.length; i++) {
            if (i < length) {
                var reg1 = new RegExp(/^[0-9]*$/);
                if (reg1.test(str[i])) {
                    newStr += "" + str[i];
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

    //阿拉伯数字转中文数字
    static NumToChinese(num) {
        if (!/^\d*(\.\d*)?$/.test(num)) {
            alert("Number is wrong!");
            return "Number is wrong!";
        }

        var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
        var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
        var a = ("" + num).replace(/(^0*)/g, "").split("."),
            k = 0,
            re = "";
        for (var i = a[0].length - 1; i >= 0; i--) {
            switch (k) {
                case 0:
                    re = BB[7] + re;
                    break;
                case 4:
                    if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                        re = BB[4] + re;
                    break;
                case 8:
                    re = BB[5] + re;
                    BB[7] = BB[5];
                    k = 0;
                    break;
            }
            if (k % 4 == 2 && parseInt(a[0].charAt(i + 2)) != 0 && parseInt(a[0].charAt(i + 1)) == 0) re = AA[0] + re;
            if (parseInt(a[0].charAt(i)) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
            k++;
        }

        if (a.length > 1) { //加上小数部分(如果有小数部分) 
            re += BB[6];
            for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
        }

        if (num >= 10 && num < 20) {//10~19特殊处理
            re = re.replace("一十", "十");
        }
        return re;
    };
}
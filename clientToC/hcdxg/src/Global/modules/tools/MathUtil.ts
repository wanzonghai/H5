

//数字计算结果的精度值取6位
export const NumberAccuracy = 6;
export default class MathUtil {
    // //获取线段角度
    // static GetLineAngle(_p1: cc.Vec2, _p2: cc.Vec2) {
    //     let dirVec = _p2.sub(_p1);//获得从startPos指向endPos的方向向量
    //     let comVec = new cc.Vec2(1, 0);//计算夹角的参考方向，这里选择x轴正方向
    //     let radian = dirVec.signAngle(comVec);//获得带方向的夹角弧度值(参考方向顺时针为正值，逆时针为负值)
    //     let degree = - cc.misc.radiansToDegrees(radian) //-Math.floor(cc.misc.radiansToDegrees(radian));
    //     // console.log("x角度：" + degree)
    //     return degree;
    // }
    // /**
    //  * 获取圆和线段的交点
    //  */
    // static GetCircleAndLinePoints(_line: { p1: cc.Vec2, p2: cc.Vec2 }, circle: { p: cc.Vec2, r: number }) {
    //     //先求直线和圆的交点
    //     let _points = this.getInsertPointBetweenCircleAndLine(_line, circle);
    //     if (_points.length == 0) {
    //         return _points;
    //     }
    //     // console.log('GetCircleAndLinePoints _points', _points);

    //     //判断交点是否在线段上
    //     let _pA: cc.Vec2[] = [];
    //     _points.forEach(_p => {
    //         if (this.point_on_line(_p, _line.p1, _line.p2) <= 0) {
    //             _pA.push(_p);
    //         }
    //     });
    //     return _pA;
    // }
    // /**
    //  * 求圆和直线之间的交点
    //  * 直线方程：y = kx + b
    //  * 圆的方程：(x - m)² + (x - n)² = r²
    //  * x1, y1 = 线坐标1, x2, y2 = 线坐标2, m, n = 圆坐标, r = 半径
    //  */
    // static getInsertPointBetweenCircleAndLine(_line: { p1: cc.Vec2, p2: cc.Vec2 }, circle: { p: cc.Vec2, r: number }) {
    //     // console.log(_line.p1.x, _line.p1.y, x2, y2, m, n, r)

    //     let kbArr = this.BinaryEquationGetKB(_line)
    //     if (!kbArr) {
    //         // console.log('_line.p1 == _line.p2', _line.p1);
    //         let _m = this.NumberFixed(circle.r * circle.r - (_line.p1.x - circle.p.x) * (_line.p1.x - circle.p.x), NumberAccuracy);
    //         if (_m < 0) {
    //             // console.log('CircleAndLine [0]', _m);

    //             return [];
    //         }
    //         let _sqrt = this.NumberFixed(Math.sqrt(_m), NumberAccuracy);
    //         if (_sqrt <= 0) {
    //             // console.log('CircleAndLine [1]', [cc.v2(_line.p1.x, circle.p.y)]);
    //             return [cc.v2(_line.p1.x, circle.p.y)];
    //         }
    //         let _y1 = this.NumberFixed(_sqrt + circle.p.y, NumberAccuracy);
    //         let _y2 = this.NumberFixed(-_sqrt + circle.p.y, NumberAccuracy);
    //         // console.log('CircleAndLine [2]', [cc.v2(_line.p1.x, _y1), cc.v2(_line.p1.x, _y2)]);
    //         return [cc.v2(_line.p1.x, _y1), cc.v2(_line.p1.x, _y2)];
    //     }
    //     // console.log('kbArr', JSON.stringify(_line));


    //     let k = kbArr[0]
    //     let b = kbArr[1]

    //     let aX = 1 + k * k
    //     let bX = 2 * k * (b - circle.p.y) - 2 * circle.p.x
    //     let cX = circle.p.x * circle.p.x + (b - circle.p.y) * (b - circle.p.y) - circle.r * circle.r

    //     let insertPoints: cc.Vec2[] = [];
    //     let xArr = this.quadEquationGetX(aX, bX, cX)
    //     // console.log('xArr', xArr);
    //     xArr.forEach(x => {
    //         // console.log('xArr', x);

    //         let y = k * x + b
    //         insertPoints.push(cc.v2(x, y))
    //     })
    //     // console.log('insertPoints', insertPoints);
    //     return insertPoints;
    // }
    // /**
    //  * 求二元一次方程的系数
    //  * y1 = k * x1 + b => k = (y1 - b) / x1
    //  * y2 = k * x2 + b => y2 = ((y1 - b) / x1) * x2 + b
    //  */
    // static BinaryEquationGetKB(_line: { p1: cc.Vec2, p2: cc.Vec2 }) {
    //     if (this.NumberEqual(_line.p1.x, _line.p2.x)) {
    //         return null;
    //     }
    //     let k = this.NumberFixed((_line.p1.y - _line.p2.y) / (_line.p1.x - _line.p2.x), NumberAccuracy)
    //     let b = this.NumberFixed((_line.p1.x * _line.p2.y - _line.p2.x * _line.p1.y) / (_line.p1.x - _line.p2.x), NumberAccuracy)
    //     return [k, b]
    // }
    // /**
    //  * 一元二次方程求根
    //  * ax² + bx + c = 0
    //  */
    // private static saveCircleabc: { key: string, v: number[] }[] = [];
    // private static quadEquationGetX(a: number, b: number, c: number) {
    //     let _keyName = `k_${a}_${b}_${c}`;
    //     let _idx = this.saveCircleabc.findIndex(v => v.key == _keyName);
    //     if (_idx >= 0) {
    //         return this.saveCircleabc[_idx].v;
    //     }

    //     let xArr: number[] = []
    //     let result = this.NumberFixed(Math.pow(b, 2) - 4 * a * c, NumberAccuracy)
    //     if (this.NumberEqual(result, 0)) {
    //         xArr.push(this.NumberFixed(-b / (2 * a), NumberAccuracy))
    //     }
    //     else if (result > 0) {
    //         xArr.push(this.NumberFixed((-b + Math.sqrt(result)) / (2 * a), NumberAccuracy))
    //         xArr.push(this.NumberFixed((-b - Math.sqrt(result)) / (2 * a), NumberAccuracy))
    //     }

    //     this.saveCircleabc.unshift({ key: _keyName, v: xArr });
    //     if (this.saveCircleabc.length > 3) {
    //         this.saveCircleabc.pop();
    //     }
    //     return xArr
    // }
    // //求a点是不是在线段上，>0不在，=0与端点重合，<0在。
    // public static point_on_line(a:cc.Vec2, p1:cc.Vec2, p2:cc.Vec2) {
    //     return this.dblcmp(this.dot(p1.x - a.x, p1.y - a.y, p2.x - a.x, p2.y - a.y), 0);
    // }
    // private static ab_cross_ac(a:cc.Vec2, b:cc.Vec2, c:cc.Vec2) //ab与ac的叉积
    // {
    //     return this.cross(b.x - a.x, b.y - a.y, c.x - a.x, c.y - a.y);
    // }
    // private static dot(x1:number, y1:number, x2:number, y2:number) {
    //     return this.NumberFixed(x1 * x2 + y1 * y2, NumberAccuracy);
    // }
    // private static cross(x1:number, y1:number, x2:number, y2:number) {
    //     return this.NumberFixed(x1 * y2 - x2 * y1, NumberAccuracy);
    // }
    // private static dblcmp(a: number, b: number) {
    //     if (this.NumberEqual(Math.abs(a - b), 0)) return 0;
    //     if (a > b) return 1;
    //     else return -1;
    // }
    // /**
    //  * 数字取精度
    //  * @param _n 数字
    //  * @param _fixed 精度值
    //  */
    // static NumberFixed(_n: number, _fixed = 0) {
    //     let _fixedN = 1;
    //     for (let index = 0; index < _fixed; index++) {
    //         _fixedN *= 10;
    //     }
    //     return Math.round(_n * _fixedN) / _fixedN;
    // }
    // static NumberEqual(_n1: number, _n2: number) {
    //     return Math.abs(_n1 - _n2) < 0.000000002
    // }
    // static PointEquals(_p1: cc.Vec2, _p2: cc.Vec2) {
    //     if (!this.NumberEqual(_p1.x, _p2.x)) {
    //         return false;
    //     }
    //     if (!this.NumberEqual(_p1.y, _p2.y)) {
    //         return false;
    //     }
    //     return true;
    // }
    /** 
    * 对日期进行格式化， 和C#大致一致 默认yyyy-MM-dd HH:mm:ss
    * 可不带参数 一个日期参数 或一个格式化参数
    * @param date 要格式化的日期 
    * @param format 进行格式化的模式字符串
    *     支持的模式字母有： 
    *     y:年, 
    *     M:年中的月份(1-12), 
    *     d:月份中的天(1-31), 
    *     H:小时(0-23), 
    *     h:小时(0-11), 
    *     m:分(0-59), 
    *     s:秒(0-59), 
    *     f:毫秒(0-999),
    *     q:季度(1-4)
    * @return String
    * @author adswads@gmail.com
    */
    public static dateFormat(date?: any, format?: string): string {
        //无参数
        if (date == undefined && format == undefined) {
            date = new Date();
            format = "yyyy-MM-dd HH:mm:ss";
        }
        //无日期
        else if (typeof (date) == "string") {
            format = date;
            date = new Date();
        }
        //无格式化参数
        else if (format === undefined) {
            format = "yyyy-MM-dd HH:mm:ss";
        }
        else { }
        //没有分隔符的特殊处理

        var map = {
            "y": date.getFullYear() + "",//年份
            "M": date.getMonth() + 1 + "", //月份 
            "d": date.getDate() + "", //日 
            "H": date.getHours(), //小时 24
            "m": date.getMinutes() + "", //分 
            "s": date.getSeconds() + "", //秒 
            "q": Math.floor((date.getMonth() + 3) / 3) + "", //季度 
            "f": date.getMilliseconds() + "" //毫秒 
        };
        //小时 12
        if (map["H"] > 12) { map["h"] = map["H"] - 12 + ""; }
        else { map["h"] = map["H"] + ""; }
        map["H"] += "";

        var reg = "yMdHhmsqf";
        var all = "", str = "";
        for (var i = 0, n = 0; i < reg.length; i++) {
            n = format.indexOf(reg[i]);
            if (n < 0) { continue; }
            all = "";
            for (; n < format.length; n++) {
                if (format[n] != reg[i]) {
                    break;
                }
                all += reg[i];
            }
            if (all.length > 0) {
                if (all.length == map[reg[i]].length) {
                    str = map[reg[i]];
                }
                else if (all.length > map[reg[i]].length) {
                    if (reg[i] == "f") {
                        str = map[reg[i]] + this.charString("0", all.length - map[reg[i]].length);
                    }
                    else {
                        str = this.charString("0", all.length - map[reg[i]].length) + map[reg[i]];
                    }
                }
                else {
                    switch (reg[i]) {
                        case "y": str = map[reg[i]].substr(map[reg[i]].length - all.length); break;
                        case "f": str = map[reg[i]].substr(0, all.length); break;
                        default: str = map[reg[i]]; break;
                    }
                }
                format = format.replace(all, str);
            }
        }
        return format;
    }
    public static charString(char: string, count: number): string {
        var str: string = "";
        while (count--) {
            str += char;
        }
        return str;
    }
}
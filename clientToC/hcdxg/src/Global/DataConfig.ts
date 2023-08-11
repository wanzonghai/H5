/**
 * 全局的数据
 */
/**
 * 所有变量名不可重复
 */
export let DataConfig = {
    //临时数据，不存储，每次进入游戏会按此处附初值
    tempData: {

        // //当前得分
        curScore: 0,
        // //当前得分
        // targetScore: 0,
        // //地图大小
        // mapSize: cc.v2(0, 0),
        // //地图块大小
        // tileItemSize: 0,
        // //地图块图片大小
        // tileSpriteSize: 0,

        // //总关卡数量
        // maxLevel: 0,
        // //当前关卡(从0开始)
        // curLevel: 0,
        // levelLockInfo: {
        //     passedLevel: 0,//已过关数量
        //     unlockTime: 0,//解锁时间
        //     showVideo: 0,//播放广告次数
        // }
    },
    //本地存储数据，每次从本地存储中读取
    localData: {
        lastPlayTime: 0,
        addressInfo: {
            name: '',
            address: '',
            phone: '',
        }
        // //玩到的最大关卡(从0开始)
        // hardLevel: 0,
        // //已存储的得分
        // storeScore: 0,
        // showPropHelpTime: 0,
        // //下一个显示超越分享的关卡
        // nextExceedLevel: 0,
        // animalsHearts: {
        //     P1: 0,//点形
        //     P2: 0,//2点形
        //     P3: 0,//3点形
        //     square: 0,//方块形
        //     strip: 0,//长条形
        //     T: 0,//T形
        //     LL: 0,//左L块形
        //     LR: 0,//右L块形
        //     ZL: 0,//左Z块形
        //     ZR: 0,//右Z块形
        //     H3: 0,//横向3点形
        //     corner: 0,//大L型
        //     cross: 0,//十字型
        // },
        // lastAnimalsHeartDay: 0,//上次登录心动值减少日期
        // collectHintShowed: false,
        // ZoomName: '',
        // zoomHintN: 0,

        //玩到的最高关卡(从0开始)
        // topHigh: 0,
        //体力值
        // power: { value: 0, time: 0 },
    },
    //服务端数据，必须从服务端拉取,存和取都要立刻检测成功或失败
    serverData: {
        //地址
        // AddressInfo: {
        //     name: '',
        //     address: '',
        //     phoneNumber: '',
        // }
        // serverd: 'serverData__'
    },
    //本地和服务端都有的数据，按优先级选择数据
    ser_localData: {
        //玩到的最大关卡(从0开始)
        // topLevel: 0,
    }
}
export interface Props {
    bomb1: number,//炸掉1格
    bombCross: number,//炸掉十字
    bombScope: number,//炸掉三行范围
    // supperCut: number,
}
export interface AddressType {
    name: string,//
    address: string,//
    phoneNumber: string,//
}
// export interface PowerInfo {
//     value: number,
//     time: number,
// }
export type PropType = keyof Props;


//类型定义
export type NormalDataType = typeof DataConfig.tempData & typeof DataConfig.localData
    & typeof DataConfig.ser_localData;
export type NormalDataKey = keyof NormalDataType;
export type ServerDataType = typeof DataConfig.serverData;
export type ServerDataKey = keyof ServerDataType;
export type AllDataType = NormalDataType & ServerDataType;
export type AllDataKey = keyof AllDataType;


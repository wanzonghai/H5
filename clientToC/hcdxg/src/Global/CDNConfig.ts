import PlatformBase from "./modules/Platform/PlatformBase";
import { MiniPlatformE } from "./modules/Platform/Children/Platform_mini";
import { MyPlatform, PlateformE, Platform } from "./modules/Platform/Platform";

//cdn配置文件路径
export const CDNRoot = {
    baseUrl: 'https://oss.ixald.com/',//项目url地址
    platform: {//项目平台路径
        wx: 'game2/config/wx/',
        tt: 'game2/config/tt/',
    },
    // platform: 'InciseMe/wx/',//项目平台路径
    edition: { //测试和正式版区分
        debug: 'debug/',
        // release: 'gameConfig/'
        release: 'release/'
    },
}
/**
 * 获取动态配置的cdn地址
 */
export function GetCDNUrl() {
    let _platform = CDNRoot.platform.wx;
    // let _editon = CC_DEBUG ? CDNRoot.edition.debug : CDNRoot.edition.release;
    let _editon = CDNRoot.edition.debug;
    if (PlateformE.Mini == MyPlatform) {
        //根据不同平台切换不同路径
        switch (PlatformBase.curPlatform) {
            case MiniPlatformE.tt:
                _platform = CDNRoot.platform.tt;
                break;
            default:
                break;
        }
    }
    else {
        let _plat = Platform.LocalStorageGetItem('EditorPlatformKey');
        let _pltconfg = CDNRoot.platform as any;
        if (_plat) {
            let _json: { paltform: string, release: boolean } = JSON.parse(_plat);
            if (_json.paltform in _pltconfg) {
                _platform = _pltconfg[_json.paltform]
            }
            _editon = _json.release ? CDNRoot.edition.release : CDNRoot.edition.debug;

        }
    }

    return CDNRoot.baseUrl + _platform + _editon;
}
//拉取顺序
//同一数组内同时拉取，不同数组会等待上一数组拉取完成再拉取
export const FetchOrder = [
    ['switches'],//必须有switches，否则不能对比版本号
    ['subjectConfig'],
]
//从cdn下载的配置信息
export let CDNConfig = {
    //开关
    switches: {
        //配置文件版本控制(要求键名要与json名一致)
        CDNConfigVersion: {
            //基础数据信息
            baseConfig: 0,
            subjectConfig: 0,
        },

    },
    //----------------------------初始数据-------------------------//
    baseConfig: {
        // //体力
        // game: {
        //     continueTime: 3,
        //     levelUnlockCD: 900,//关卡解锁cd
        //     levelPassN: 5,//可连续过关数量
        //     unlockLevelVideo: 1,//解锁看视频次数
        // },
        // power: {
        //     initV: 8, //初始体力数量
        //     lExpend: 1, //每关消耗,0为不消耗体力
        //     recoverMax: 8, //体力恢复上限
        //     recoverCD: 600, //体力恢复间隔
        //     award: 3,//奖励体力值
        // },
        // //金币
        // coin: {
        //     initV: 200, //初始金币数量
        // },
        // other: {
        //     //视频增加回合数
        //     addStep: 3
        // }
    },
    //----------------------------关卡数据-------------------------//
    subjectConfig: [
        { subject: "第一题xxxxxxxxxx 是", answer: true },
        { subject: "第二题xxxxxxxxxx 否", answer: false },
        // { subject: "第三题xxxxxxxxxx", answer: false },
        // { subject: "第4题xxxxxxxxxx", answer: true },
        // { subject: "第5题xxxxxxxxxx", answer: true },
        // { subject: "第6题xxxxxxxxxx", answer: false },
        // { subject: "第一题xxxxxxxxxx", answer: true },
        // { subject: "第二题xxxxxxxxxx", answer: false },
        // { subject: "第三题xxxxxxxxxx", answer: false },
        // { subject: "第4题xxxxxxxxxx", answer: true },
        // { subject: "第5题xxxxxxxxxx", answer: true },
        // { subject: "第6题xxxxxxxxxx", answer: false },
        // { subject: "第一题xxxxxxxxxx", answer: true },
        // { subject: "第二题xxxxxxxxxx", answer: false },
        // { subject: "第三题xxxxxxxxxx", answer: false },
        // { subject: "第4题xxxxxxxxxx", answer: true },
        // { subject: "第5题xxxxxxxxxx", answer: true },
        // { subject: "第6题xxxxxxxxxx", answer: false },
        // { subject: "第一题xxxxxxxxxx", answer: true },
        // { subject: "第二题xxxxxxxxxx", answer: false },
        // { subject: "第三题xxxxxxxxxx", answer: false },
        // { subject: "第4题xxxxxxxxxx", answer: true },
        // { subject: "第5题xxxxxxxxxx", answer: true },
        // { subject: "第6题xxxxxxxxxx", answer: false },
        // {//关卡：1
        //     //过关分数
        //     score: 150,
        //     //地图大小
        //     map: [6, 6],
        //     //地形信息
        //     tra: {
        //         //空地形
        //         mV: [[0, 0]],
        //         //地图块
        //         mT: [{ id: 'P1', p: [1, 1] }],
        //         //障碍
        //         // mB: [{ id: 1, p: [2, 2] }],
        //     },
        //     //方块权重
        //     wgt: {
        //         P1: { t: 1, r: { r0: 1, r90: 0, r180: 1, r270: 0 } },
        //         P2: { t: 5, r: { r0: 1, r90: 0, r180: 0, r270: 0 } },
        //         P3: { t: 3 },
        //         square: { t: 2 },
        //         LL: { t: 0 },
        //         LR: { t: 0 },
        //         ZL: { t: 0 },
        //         ZR: { t: 0 },
        //         T: { t: 0 },
        //         strip: { t: 0 },
        //     }
        // },


    ]
    //------------------------------------------------------------//	
}


import Global from '../../Global';
import { Props } from '../../DataConfig';
import { DataManager } from '../Data/DataManager';
import { Config } from '../../Config';

//游戏结果
export enum StatisticsResult {
    goChapter = -3,//选择关卡
    restart = -2,//选择关卡
    lose = -1,//选择关卡
    noStamp = 0,//无星星
    getStamp = 1,//获得星星

}
interface StatisticsType {
    gameOver: {
        stage_type: 0,//当前场景
        stage: number,//当前关卡
        stage_from: number,//闯关来源
        pay_time: number,//用时
        //步数
        cut_used: number,//使用步数
        cut_design: number,//设计步数
        cut_remainder: number,//剩余步数
        //切割面积
        area_max: number[],//切割的最大面积百分比（前三）
        all_area: number,//切割的总面积百分比（前三）
        design_area: number,//设计的过关百分比
        //道具
        use_tool: Props,//本局使用道具数量
        all_tool: Props,//总道具数量
        energy_num: number,//体力数
        role_type: number,//玩家使用的忍者id
        result: StatisticsResult,//最后结果
    },
    //广告
    ad: {
        ad_type: 0 | 1 | 2,//广告类型，0 = 视频广告，1 = 插屏广告，2 = banner广告
        ad_sub: number,//广告子类型。视频广告：1=闯关失败；2=领取体力；
        stage: number | null,//记录进入的是第几关，非关卡中显示null
        reward_type: string,//获得的资源类型。
        reward_num: number,//获得奖励数量
        result: number,//观看结果；0=失败；1=成功；
    },
    //分享
    share: {
        share_type: 0 | 1,//分享类型，0 = 链接分享；1 = 录屏分享。
        share_sub: number,//分享的子类型。链接分享：0=无奖励自发分享；1=闯关失败；2=领取体力；
        stage: number | null,
        reward_type: string,
        reward_num: number,
        result: number,
    },
}
/**
 * 打点统计管理系统
 */
class StatisticManager_C {
    // private isInit = false;
    // private static instance: StatisticManager_C = null as any;
    // static INS() {
    //     if (this.instance) {
    //         return this.instance;
    //     }
    //     this.instance = new StatisticManager_C();
    //     this.instance.isInit = false;
    //     return this.instance;
    // }
    // /**
    //  * 初始化
    //  */
    // Init() {
    //     if (this.isInit) {
    //         return;
    //     }
    //     this.isInit = true;

    // }
    // private submit(action: string, data?: any) {
    //     Global.hhgame.options.clientVersion = Config.version;
    //     Global.hhgame.stat.submitAction(action, data || {});
    // }
    // private gameData: StatisticsType["gameOver"] = null as any;
    // //登录成功
    // LoginSuccess() {
    //     this.submit('[登录成功]');
    // }
    // //切换场景
    // ChangeScene() { }
    // //-----------------------------------------游戏内数据打点------------------------------//
    // //游戏开始
    // private lastLeftArea = 0;
    // private intervalID = null as any;
    // /**
    //  * _from:本次闯关的来源。0=正常闯关；1=重新挑战；2=失败后继续游戏
    //  */
    // GameStart(_from: 0 | 1 | 2) {
    //     this.gameData = {
    //         stage_type: 0,
    //         stage: DataManager.Get('curLevel') + 1,
    //         stage_from: _from,
    //         pay_time: 0,
    //         cut_used: 0,
    //         cut_design: GameLogic.GetResidueStep(),
    //         cut_remainder: GameLogic.GetResidueStep(),
    //         area_max: [0, 0, 0],
    //         all_area: 0,
    //         design_area: 100 - GameLogic.GetPassPCT(),
    //         use_tool: {} as any,
    //         all_tool: {} as any,
    //         energy_num: Power.GetPower(),
    //         role_type: 0,
    //         result: StatisticsResult.goChapter,
    //     }
    //     let _prop = DataManager.Get('prop');
    //     for (const key in _prop) {
    //         this.gameData.use_tool[key] = 0;
    //         this.gameData.all_tool[key] = _prop[key];
    //     }
    //     this.lastLeftArea = GameLogic.GetResiduePCT();
    //     this.gameData.pay_time = 0;
    //     this.ClearInterval();
    //     this.intervalID = setInterval(() => {
    //         this.gameData.pay_time++;
    //     }, 1000);
    // }
    // //游戏结束
    // GameOver(_result: StatisticsResult) {
    //     if (!this.gameData) {
    //         console.error('[Statistic] GameOver gameData不存在');
    //         return;
    //     }
    //     this.gameData.result = _result;
    //     this.gameData.energy_num = Power.GetPower();
    //     this.gameData.all_area = 100 - GameLogic.GetResiduePCT();
    //     this.gameData.cut_remainder = GameLogic.GetResidueStep();
    //     this.gameData.cut_used = this.gameData.cut_design - this.gameData.cut_remainder;
    //     // this.gameData.pay_time = ((Date.now() - this.gameData.pay_time) / 1000) | 0;
    //     // console.log('submit gameData', JSON.stringify(this.gameData));

    //     this.submit('stage', this.gameData);
    // }
    // //切割板子
    // Cut() {
    //     if (!this.gameData) {
    //         console.error('[Statistic] Cut gameData不存在');
    //         return;
    //     }
    //     let _leftarea = GameLogic.GetResiduePCT();
    //     let _area = (((this.lastLeftArea - _leftarea) * 10) | 0) / 10;


    //     this.lastLeftArea = _leftarea;
    //     // console.error('Cut', this.lastLeftArea, _leftarea, _area, this.gameData.area_max);
    //     if (_area > this.gameData.area_max[2]) {
    //         this.gameData.area_max[this.gameData.area_max.length - 1] = _area;
    //         for (let index = this.gameData.area_max.length - 1; index > 0; index--) {
    //             const element = this.gameData.area_max[index];
    //             if (element <= this.gameData.area_max[index - 1]) {
    //                 break;
    //             }
    //             this.gameData.area_max[index] = this.gameData.area_max[index - 1];
    //             this.gameData.area_max[index - 1] = element;
    //         }
    //     }
    // }
    // //使用道具
    // UseProp(_prop: keyof Props) {
    //     if (!this.gameData) {
    //         console.error('[Statistic] UseProp gameData不存在');
    //         return;
    //     }
    //     this.gameData.use_tool[_prop]++;
    // }
    // ClearInterval() {
    //     if (this.intervalID) {
    //         clearInterval(this.intervalID);
    //         this.intervalID = 0;
    //     }
    // }

    // //------------------------------------------广告打点-----------------------------------//
    // ShowADs(_config: StatisticsType["ad"]) {
    //     this.submit('ad', _config);
    // }
    // //------------------------------------------分享打点-----------------------------------//
    // Share(_config: StatisticsType["share"]) {
    //     this.submit('share', _config);
    // }
    // //------------------------------------------------------------------------------------//


}
// export const Statistic = StatisticManager_C.INS();
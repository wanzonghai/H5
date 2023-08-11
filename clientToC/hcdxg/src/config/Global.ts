import EventManager from "../manager/EventManager";
import ResourceManager from "../manager/ResourceManager";
import hallConfig from "./hallConfig"
import UIManager from "../manager/UIManager";

export class Global {
    //场景名称
    public static startSceneName: any = "startScene.scene";
    public static gameSceneName: any = "gameScene.scene";
    public static loadSceneName: any = "loadingScene.scene";

    public static hallConfig: hallConfig;
    public static EventManager: EventManager;
    public static ResourceManager: ResourceManager;
    public static UIManager: UIManager;

    public static SetupEngine() {
        Global.hallConfig = new hallConfig();
        Global.EventManager = new EventManager();
        Global.ResourceManager = new ResourceManager();
        Global.UIManager = new UIManager();
    }

    //消息ID///////////////////////////////////////////////////////////////
    public static MSG_GET_TRADES_SOLD = "GetTradesSold";   //验证是否付款成功
    public static MSG_LOGIN = 1001;                 //获取玩家基本信息1
    public static MSG_MEMBER_STATE = 1009;          //上报会员状态
    public static MSG_UPLOAD_VIPSTATE = 1011;       //上报vip(关注)状态
    public static MSG_UPLOAD_POINT = 1012;          //上报奖杯(积分)数量
    public static MSG_GET_TASK = 1018;              //上报领取任务
    //public static MSG_OPEN_REDBAG = 1019;           //上报开礼包结果
    public static MSG_UP_FIGHT_RESULT = 1021;       //上报战斗结果
    public static MSG_CUR_RANK = 1014;              //获取排行榜本期数据1
    public static MSG_RANKING = 1015;               //获取排行榜名次是否变化1
    public static MSG_TASK = 1016;                  //获取任务信息
    public static MSG_COIN_ADD = 1022;              //增加金币1
    public static MSG_COIN_COST = 1023;             //消耗金币1
    public static MSG_SHARE_INFO = 1024;             //邀请信息
    public static MSG_GET_BAG = 1031;               //获取奖品池奖励
    public static MSG_RECEIVING_INFO = 1032;        //上报收货人信息
    public static MSG_TASK_PROGRESS = 2001;         //任务进度

    public static MSG_GET_TASKLIST = 2002;         //获取任务列表
    public static MSG_GET_TASK_PROGRESS = 2003;    //请求当前任务进度
    public static MSG_GET_TASK_REWARD = 2004;      //请求当前任务奖励

    //public static MSG_AWARD_CONFIG = 3001;          //获取奖品配置
    public static MSG_REQ_OPEN_REGBAG = 3002;       //请求开礼包结果
    public static MSG_AWARD_COUNT_CONFIG = 3003;    //请求开奖个数
    public static MSG_RESULT_RANK = 3004;           //获取结算排行数据
    public static MSG_LAST_RANK = 3005;             //获取排行榜上期数据1
    public static MSG_RANK_GETREWARD = 3006;        //获取排行榜结算奖励
    public static MSG_MY_ROLE = 3007;               //上报自己获得的角色

    public static MSG_BUY_DATA = 4001;              //上报购买数据
    public static MSG_ANALYSIS = 5001;              //上报埋点分析
    public static MSG_STATE_CHANGE = 5002;          //红点变化
    public static MSG_CHECK_TRADES_SOLD = 6001;     //补发奖励
    public static MSG_NOTICE = 6002;                //公告

    //待加入
    public static MSG_GET_SCORESHOP_LIST = 7001;     //获取积分兑换列表数据
    public static MSG_SCORE_EXHANGE = 7002;          //积分兑换奖品
    public static MSG_GAME_MERGEAWARD = 7003;          //游戏内合成奖励

}
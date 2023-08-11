/**
 * 游戏基础配置和版本号
 */
export const Config = {
    version: '0.0.2',
    hhConfig: {
        appid: 'Brains',
        // appid: 'mengdan',
        // url: CC_DEBUG ? 'https://test-game.ixald.com' : 'https://game.ixald.com'
        // url: CC_DEBUG ? 'https://test-game.ixald.com' : 'https://test-game.ixald.com'
        url: 'https://game.ixald.com'
        // url: CC_DEBUG ? 'http://10.154.6.138:3000' : 'https://game.ixald.com'
    },
    // remoteSvrRoot: CC_DEV ? 'https://cdn.honghegame.cn/EggStar/' : 'https://xacdn.k8w.io/EggStar/',
};
//功能模块开启情况控制
export const ModuleControl =
{
    EnableScoreRank: true,//积分排行榜模块

    EnableTask: true,//任务模块

    EnableGift: true,//兑换好礼模块

    EnableBag: true,//奖品包模块

    EnableNotice: true,//公告模块
}
//游戏玩法配置
export const GameConfig = {

}
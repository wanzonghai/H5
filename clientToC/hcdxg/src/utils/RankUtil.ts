import { Global } from '../config/Global';
import PlayDataUtil from '../data/PlayDataUtil';
export default class RankUtil extends Laya.Script {
    static rank: number;
    static defualtList: { name: string; score: number; avatar: string; }[];
    static ranklist: { name: string; score: number; avatar: string; }[];
    static _awardList: any[];
    static _rankAwardList: any[];

    static _curRankList: any[];  //本期榜数据
    static _myCurRank = 999;     //我自己的本期榜排名
    static _lastRankList: any[];   //上期榜数据
    static _myLastRank = 999;      //我自己的上期榜排名
    static _myLastPoint: number = 0;
    static _myCurPoint: number = 0;
    static _lastRankAwardList: any;

    static init() {
        this.ranklist = [];
        this.defualtList = [];
        let rankConf = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.rankConfig);
        for (let i = 0; i < 50; i++) {
            let player = {
                name: rankConf[i].name,
                avatar: 'hallRes/common/tx_player.png',
                score: rankConf[i].score || 0,
            }
            this.defualtList.push(player);
        }

        this.updateRank();
        this.initAward();
    }

    static updateRank() {
        this.ranklist = JSON.parse(JSON.stringify(this.defualtList));
        let myPlayer = this.getMyPlayer();
        this.rank = 999;
        for (let i = 0; i < 50; i++) {
            if (myPlayer.score > this.ranklist[i].score) {
                this.rank = i;
                break;
            }
        }

        if (this.rank <= 50) {
            this.ranklist.splice(this.rank, 0, myPlayer);
        }
    }

    static initAward() {
        //初始化排行榜奖励
        let conf = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.awardConfig);
        this._awardList = [];
        for (let i = 0; i < conf.length; i++) {
            const awards = conf[i];
            let award = {
                type: i + 1,
                rankMin: awards.rank1,
                rankMax: awards.rank2,
                rewards: []
            }

            let rewards = [];
            for (let j = 1; j <= 2; j++) {
                if (awards['rewardType' + j]) {
                    let reward = {
                        type: awards['rewardType' + j],
                        count: awards['rewardCount' + j],
                        id: awards['rewardId' + j] || 1
                    }
                    rewards.push(reward);
                }
            }
            award.rewards = rewards;
            this._awardList.push(award);
        }
    }

    static getList() {
        return this.ranklist;
    }

    static getMyPlayer() {
        let myPlayer = {
            name: PlayDataUtil.data.name,
            avatar: PlayDataUtil.data.avatar,
            score: PlayDataUtil.data.point || 0
        }

        return myPlayer;
    }

    static getMyRank() {
        return this.rank + 1;
    }

    //保存本期数据
    static saveCurRankData(list, myRank, myPoint) {
        this._curRankList = list;
        this._myCurRank = myRank;
        this._myCurPoint = myPoint;
    }

    static getCurRankData() {
        return this._curRankList;
    }

    static getMyCurRank() {
        return this._myCurRank;
    }

    static getMyCurPoint() {
        return this._myCurPoint;
    }

    //保存上期数据
    static saveLastRankData(list, myRank, myPoint) {
        this._lastRankList = list;
        this._myLastRank = myRank;
        this._myLastPoint = myPoint;
    }

    static getLastRankData() {
        return this._lastRankList;
    }

    static getMyLastRank() {
        return this._myLastRank;
    }
    static getMyLastPoint() {
        return this._myLastPoint;
    }

    //刷新服务器排行榜奖励
    static updateAwards(list) {
        let conf = JSON.parse(JSON.stringify(this._awardList));
        this._rankAwardList = [];
        for (let i = 0; i < list.length; i++) {
            let award = {
                type: i + 1,
                rankMin: list[i].rankNums[0],
                rankMax: list[i].rankNums[1],
                rewards: []
            }
            let rewards = [];
            let rewardB = {//商家配置奖品
                type: list[i].name || 'goods',     //奖品类型：goods-商品 coupon-优惠券
                count: list[i].num,                //奖品数量
                name: list[i].title,               //奖品名称
                url: list[i].pic_url,              //奖品图片url
                price: list[i].price
            }
            rewards.push(rewardB);

            //游戏配置奖品
            if (i < conf.length) {
                rewards.push(conf[i].rewards[0]);
            }

            award.rewards = rewards;
            this._rankAwardList.push(award);
        }
        console.log('====== 最新奖励列表 ======', this._rankAwardList)
    }

    //获取服务器排行榜对应奖励
    static getRankAwards(rank) {
        for (let i = 0; i < this._rankAwardList.length; i++) {
            const awards = this._rankAwardList[i];
            if (rank > 0 && rank <= awards.rankMax) {
                return awards;
            }
        }
        return null;
    }

    //获取服务器排行榜奖励列表
    static getRankAwardList() {
        return this._rankAwardList;
    }

    //刷新服务器上期排行榜奖励
    static updateLastAwards(list) {
        let conf = JSON.parse(JSON.stringify(this._awardList));
        this._lastRankAwardList = [];
        for (let i = 0; i < list.length; i++) {
            let award = {
                type: i + 1,
                rankMin: list[i].rankNums[0],
                rankMax: list[i].rankNums[1],
                rewards: []
            }
            let rewards = [];
            let rewardB = {//商家配置奖品
                type: list[i].name || 'goods',     //奖品类型：goods-商品 coupon-优惠券
                count: list[i].num,                //奖品数量
                name: list[i].title,               //奖品名称
                url: list[i].pic_url,              //奖品图片url
                price: list[i].price
            }
            rewards.push(rewardB);

            //游戏配置奖品
            if (i < conf.length) {
                rewards.push(conf[i].rewards[0]);
            }

            award.rewards = rewards;
            this._lastRankAwardList.push(award);
        }
    }

    //获取服务器上期排行榜对应奖励
    static getLastRankAwards(rank) {
        for (let i = 0; i < this._lastRankAwardList.length; i++) {
            const awards = this._lastRankAwardList[i];
            if (rank > 0 && rank <= awards.rankMax) {
                return awards;
            }
        }
        return null;
    }

    //获取服务器上期排行榜奖励列表
    static getLastRankAwardList() {
        return this._lastRankAwardList;
    }

    //获取上期奖励
    static getMyAward(type) {
        for (let i = 0; i < this._lastRankAwardList.length; i++) {
            const awards = this._lastRankAwardList[i];
            if (type == awards.type) {
                return awards;
            }
        }
        return null;
    }
}
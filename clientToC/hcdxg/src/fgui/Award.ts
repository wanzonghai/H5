import AwardItem from "./AwardItem"
import RankUtil from '../utils/RankUtil';
import SoundPlayer from "../common/SoundPlayer";
import { Global } from "../config/Global";
import HHAudio from "../Global/modules/Audio/HHAudio";

//排行榜奖励列表
export default class Award {
    private _main: fgui.GComponent;
    private _view: fgui.GComponent;
    private _list: fgui.GList;
    private _trans: fgui.Transition;
    private _isBack: boolean;
    private _isCur: any;

    constructor(isCur = 1) {
        this.onUILoaded(isCur);
    }

    onUILoaded(isCur) {
        this._isCur = isCur;
        fgui.UIObjectFactory.setExtension("ui://Rank/awardItem", AwardItem);
        this._main = fgui.UIPackage.createObject("Rank", "Awards").asCom;
        this._main.makeFullScreen();
        this._main.addRelation(fgui.GRoot.inst, fgui.RelationType.Size)
        this._trans = this._main.getTransition('packUp');
        fgui.GRoot.inst.addChild(this._main);

        this._view = this._main.getChild('awardList').asCom;
        this._view.getChild("backBtn").onClick(this, this.onBack);
        this._list = this._view.getChild("list").asList;
        this._isBack = true;
        this.createListItem();
    }

    //创建列表
    private createListItem() {
        let list = this._isCur ? RankUtil.getRankAwardList() : RankUtil.getLastRankAwardList();
        for (var i: number = 0; i < list.length; i++) {
            var item: AwardItem = <AwardItem>this._list.addItemFromPool();
            let opt = list[i];
            item.setOptions(opt);
        }
        this._list.ensureBoundsCorrect();
    }

    onBack() {
        if (this._isBack) {
            this._isBack = false;
            HHAudio.PlayEffect('btn');
            var callback = Laya.Handler.create(this, function () {
                this._main.dispose();
            })
            this._trans.play(callback);
        }
        
    }
}


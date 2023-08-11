import { Global } from '../config/Global';
import AwardCom from './AwardCom';
import MainUtil from '../utils/MainUitl';

export default class AwardItem extends fgui.GComponent {

    private _rankText: fgui.GTextField;
    private _list: fairygui.GList;

    public constructor() {
        super();
    }

    protected onConstruct(): void {
        fgui.UIObjectFactory.setExtension("ui://Rank/awardCom", AwardCom);
        this._rankText = this.getChild("rankTxt").asTextField;
        this._list = this.getChild("list").asList;
        this.getController('styleCtrl').selectedIndex = MainUtil.getStyle();
    }

    public setOptions(opt: any) {
        let rankStr = opt.rankMin == opt.rankMax ? ''+opt.rankMin : opt.rankMin + '-' + opt.rankMax;
        this._rankText.setVar("rank", rankStr).flushVars();

        let list = opt.rewards;
        for (var i: number = 0; i < list.length; i++) {
            var item: AwardCom = <AwardCom>this._list.addItemFromPool();
            let opt = list[i];
            item.setOptions(opt);
        }
        this._list.ensureBoundsCorrect();
    }

}

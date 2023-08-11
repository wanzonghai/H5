import { PkgNameType } from "../../Global/FGUIConfig";
import FGUIMount from "../../Global/modules/FGUI/FGUIMount";
import FGUIUtil from "../../Global/modules/FGUI/FGUIUtil";
import { GameLogic } from "../GameLogic";


export interface GetScoreInfo {
    score: number,
    pos: [number, number], //所在位置
}

export default class GetScore extends FGUIMount {

    private static myPkg: PkgNameType = 'GameScene';
    private static myComp = 'GetScore';
    element = {
        getScoreLabel: null as fgui.GTextField,
    }

    // @property
    // text: string = 'hello';
    curInfo?: GetScoreInfo;
    // LIFE-CYCLE CALLBACKS:
    //ai智力范围
    private static myParent: any = null as any;
    static allObj: GetScore[] = [];
    static SetParent(_parent: any) {
        this.myParent = _parent;
    }
    static async Create(_info: GetScoreInfo) {
        if (!this.myParent) {
            console.error('[Create]请先设置父节点');
            return null;
        }
        let _obj = await FGUIUtil.CreatePrefab(this.myParent, this.myPkg, this.myComp, GetScore) as GetScore;
        this.allObj.push(_obj);
        _obj.Show();
        _obj.init(_info);
        return _obj;
    }
    static RemoveAll() {
        while (this.allObj.length > 0) {
            // console.error('RemoveAllRemoveAll');
            let _obj = this.allObj.pop();
            _obj && _obj.removeSelf();
        }
    }
    removeSelf() {
        try {
            this.visible = false;
            FGUIUtil.RecyclePrefab(this);
        } catch (error) {
            // console.error('GetScore removeSelf', error);
        }
    }
    removeInAllObj() {
        let _idx = GetScore.allObj.findIndex(v => v.id == this.id);
        if (_idx > -1) {
            // console.log('removeInAllObj GetScore');
            GetScore.allObj.splice(_idx, 1);
        }
    }
    init(_info: GetScoreInfo) {
        // console.error('init GetScore', _info);
        // console.error('this', this);
        this.curInfo = _info;
        this.touchable = false;
        this.setXY(_info.pos[0], _info.pos[1]);
        this.element.getScoreLabel.text = '' + _info.score;
        this.runMyAction();
    }
    onEnd() {
        Laya.Tween.clearAll(this);
        Laya.timer.clearAll(this);
    }
    runMyAction() {
        this.setScale(0, 0);
        this.alpha = 1;

        let _py = this.curInfo.pos[1] - 50;
        Laya.Tween.to(this, { scaleX: 1.1, scaleY: 1.1, y: _py }, 300, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
            Laya.Tween.to(this, { scaleX: 0.9, scaleY: 0.9 }, 200, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                    Laya.Tween.to(this, { alpha: 0, y: _py - 200 }, 1000, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                        this.removeSelf();
                    }));
                }));
            }));
        }));
        this.setScale(0, 0);
    }
    // onLoad () {}
}

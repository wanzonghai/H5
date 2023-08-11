import { AudioKey } from "../../Global/AudioConfig";
import { PkgNameType } from "../../Global/FGUIConfig";
import HHAudio from "../../Global/modules/Audio/HHAudio";
import FGUIMount from "../../Global/modules/FGUI/FGUIMount";
import FGUIUtil from "../../Global/modules/FGUI/FGUIUtil";
import { GameLogic } from "../GameLogic";


export interface ComboEffectInfo {
    comboN: number,
    pos: [number, number], //所在位置
}

export default class ComboEffect extends FGUIMount {

    private static myPkg: PkgNameType = 'GameScene';
    private static myComp = 'ComboEffect';
    element = {
        comboText: null as fgui.GTextField,
    }

    // @property
    // text: string = 'hello';
    curInfo?: ComboEffectInfo;
    // LIFE-CYCLE CALLBACKS:
    //ai智力范围
    private static myParent: any = null as any;
    static allObj: ComboEffect[] = [];
    static SetParent(_parent: any) {
        this.myParent = _parent;
    }
    static async Create(_info: ComboEffectInfo) {
        if (!this.myParent) {
            console.error('[Create]请先设置父节点');
            return null;
        }
        let _obj = await FGUIUtil.CreatePrefab(this.myParent, this.myPkg, this.myComp, ComboEffect) as ComboEffect;
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
            // console.error('ComboEffect removeSelf', error);
        }
    }
    removeInAllObj() {
        let _idx = ComboEffect.allObj.findIndex(v => v.id == this.id);
        if (_idx > -1) {
            // console.log('removeInAllObj ComboEffect');
            ComboEffect.allObj.splice(_idx, 1);
        }
    }
    init(_info: ComboEffectInfo) {
        // console.error('init ComboEffect', _info);
        // console.error('this', this);
        this.curInfo = _info;
        this.setXY(_info.pos[0], _info.pos[1]);
        this.element.comboText.text = '' + _info.comboN;
        this.runMyAction();
        this.touchable = false;
    }
    onEnd() {
        Laya.Tween.clearAll(this);
        Laya.timer.clearAll(this);
    }

    runMyAction() {
        this.setScale(0, 0);
        this.alpha = 1;

        //[2,3][5][6][7,9]
        let _audio: AudioKey | null = null;
        switch (this.curInfo.comboN) {
            case 2:
                // case 3:
                _audio = 'combo1';
                break;
            case 4:
                _audio = 'combo2';
                break;
            // case 6:
            //     _audio = 'combo3';
            //     break;
            case 5:
            case 7:
                _audio = 'combo4';
                break;

            default:
                break;
        }
        if (_audio) {
            HHAudio.PlayEffect(_audio);
        }
        let _py = this.curInfo.pos[1] - 100;
        Laya.Tween.to(this, { scaleX: 1.2, scaleY: 1.2, y: _py }, 300, Laya.Ease.linearNone, Laya.Handler.create(this, () => {

            Laya.Tween.to(this, { scaleX: 0.9, scaleY: 0.9 }, 200, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                Laya.Tween.to(this, { scaleX: 1.1, scaleY: 1.1 }, 200, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                    Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 200, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                        Laya.Tween.to(this, {}, 500, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                            Laya.Tween.to(this, { alpha: 0, y: _py - 200 }, 500, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                                this.removeSelf();
                            }));
                        }));
                    }));
                }));
            }));
        }));
        this.setScale(0, 0);
    }
    // onLoad () {}
}

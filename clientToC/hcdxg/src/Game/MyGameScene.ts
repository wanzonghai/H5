
import { GameLogic } from '../FGUIClass/GameLogic';
import Fruit from './Fruit';
import Juice from './Juice';
import HHAudio from './../Global/modules/Audio/HHAudio';
import FGUIUtil from '../Global/modules/FGUI/FGUIUtil';
import GameScene from '../FGUIClass/GameScene';
import GetScore from './../FGUIClass/FGUIPrefab/GetScore';
import { ModuleSkins } from '../module/ModuleSkins';
export default class MyGameScene extends Laya.Script {

    /** @prop {name:fruitParent, tips:"水果父节点", type:Node}*/
    fruitParent: Laya.Node = null as any;
    /** @prop {name:fruitPrefab, tips:"水果预制体", type:Prefab}*/
    fruitPrefab: Laya.Prefab = null as any;

    /** @prop {name:juiceParent, tips:"果汁父节点", type:Node}*/
    juiceParent: Laya.Node = null as any;
    /** @prop {name:juicePrefab, tips:"果汁预制体", type:Prefab}*/
    juicePrefab: Laya.Prefab = null as any;
    /** @prop {name:topLine, tips:"失败线", type:Node}*/
    topLine: Laya.Box = null as any;
    /** @prop {name:bottomLine, tips:"最低线", type:Node}*/
    bottomLine: Laya.Box = null as any;

    /** @prop {name:bgImage, tips:"背景图", type:Node}*/
    bgImage: Laya.Image = null as any;

    private fruitCount = 0;
    private curTouchX = -1;
    constructor() { super(); }

    onEnable(): void {
        // console.log('onEnableonEnable');
        this.changeSkin();
        Fruit.SetPrefab(this.fruitPrefab, this.fruitParent);
        Juice.SetPrefab(this.juicePrefab, this.juiceParent);
        Laya.stage.on("sameContact", this, this.onSameFruitContact);
        GameLogic.myGameScene = this;
        FGUIUtil.ShowScene(GameScene);
        // let _node = this.owner as Laya.Scene;
        // console.error('MyGameScene', _node.width, _node.height);
        // console.error('stage', Laya.stage.width, Laya.stage.height);

        // Laya.stage.on(Laya.Event.MOUSE_DOWN, this, (e: any) => {
        //     console.log('MOUSE_DOWN', e);
        //     this.onStageMouseDown1(e);

        // })
        // Laya.stage.on(Laya.Event.MOUSE_MOVE, this, (e: any) => {
        //     // console.log('MOUSE_MOVE', e);
        //     this.onStageMouseMove1(e);

        // })
        // Laya.stage.on(Laya.Event.MOUSE_UP, this, (e: any) => {
        //     console.log('MOUSE_UP', e);
        //     this.onStageMouseUp1(e);

        // })
        // Laya.stage.on(Laya.Event.MOUSE_OUT, this, (e: any) => {
        //     console.log('MOUSE_OUT', e);
        //     this.onStageMouseUp(e);
        // })


    }
    onDisable(): void {
        Laya.stage.offAllCaller(this);
        this.clearAll();
        GameLogic.myGameScene = null;
    }
    changeSkin() {
        ModuleSkins.ChangeSkin(this.bgImage, 'gameBgImage');
    }
    clearAll() {
        this.fruitCount = 0;
        Laya.timer.clearAll(this);
        Fruit.DestoryAll();
        Juice.DestoryAll();
    }
    GameStart() {
        this.touchID = -1;
        this.curTopY = 0;
        this.clearAll();
        console.log('MyGameScene GameStart');
        Laya.timer.once(300, this, this.ShowFruit);
        Laya.timer.loop(2000, this, this.fruitUpdate);
        this.curDetectFruitId = -1;
        Laya.timer.frameLoop(1, this, this.fruitTopUpdate);
        if (this.topLine.visible) {
            Laya.Tween.clearAll(this.topLine);
            this.topLine.visible = false;
            this.topLine.alpha = 1;
        }
        GameLogic.gameFruitValidY.bottom = this.bottomLine.y;
        GameLogic.gameFruitValidY.top = this.topLine.y;
        // Laya.Physics.I.start();

    }
    GameRevive() {
        this.touchID = -1;
        this.curTopY = 0;
        Laya.timer.loop(2000, this, this.fruitUpdate);
        this.curDetectFruitId = -1;
        Laya.timer.frameLoop(1, this, this.fruitTopUpdate);
        console.log('MyGameScene GameRevive');
        let _removeFruit: Fruit[] = [];
        for (const fruit of Fruit.allItems) {
            if (fruit.node.y < 600 && fruit.collisionState) {
                _removeFruit.push(fruit);
            }
        }
        while (_removeFruit.length > 0) {
            let fruit = _removeFruit.pop();
            fruit.RemoveSelf();
        }
        Laya.timer.once(300, this, this.ShowFruit);
        // Laya.Physics.I.start();
    }
    GameOver() {
        // Laya.Physics.I.stop();
        Laya.timer.clear(this, this.fruitUpdate);
        Laya.timer.clear(this, this.fruitTopUpdate);
    }
    fruitUpdate() {
        // console.log('fruitUpdate fruitTopY', GameLogic.fruitTopY);
        //更新最终判断的最高位置
        if (this.curTopY > 0) {
            // console.error('fruitUpdate', GameLogic.fruitTopY, this.curTopY);
            GameLogic.fruitTopY = this.curTopY;
            this.curTopY = 0;
        }
        if (GameLogic.fruitTopY <= this.topLine.y) {
            GameLogic.GameOver();
            return;
        }
        // if (GameLogic.fruitTopY < 1500) {
        if (GameLogic.fruitTopY < 550) {
            if (!this.topLine.visible) {
                this.topLine.visible = true;
                this.topLine.alpha = 1;
                let _fadeOut = () => {
                    Laya.Tween.to(this.topLine, { alpha: 0 }, 1000, undefined, Laya.Handler.create(this, () => {
                        Laya.Tween.to(this.topLine, {}, 500, undefined, Laya.Handler.create(this, () => {
                            Laya.Tween.to(this.topLine, { alpha: 1 }, 1000, undefined, Laya.Handler.create(this, _fadeOut));
                        }));
                    }));
                }
                _fadeOut();
            }
        }
        else {
            if (this.topLine.visible) {
                Laya.Tween.clearAll(this.topLine);
                this.topLine.visible = false;
                this.topLine.alpha = 1;
            }
        }
    }
    private curDetectFruitId = -1;
    private loopTopY = 2000;
    // private lastTopY = 2000;
    private curTopY = 0;
    fruitTopUpdate() {
        if (Fruit.allItems.length <= 0) {
            return;
        }
        let _detect = () => {
            if (this.curDetectFruitId < 0 || this.curDetectFruitId >= Fruit.allItems.length) {
                if (this.curDetectFruitId >= 0) {
                    //每次检测一次循环后更新最小最高位置为当前最高位置
                    if (this.curTopY < this.loopTopY) {
                        // console.error('this.curTopY', this.curTopY);
                        this.curTopY = this.loopTopY;
                    }
                }
                this.curDetectFruitId = 0;
                this.loopTopY = 2000;
            }
            let _fruit = Fruit.allItems[this.curDetectFruitId];
            if (!_fruit.collisionState || !_fruit.isContacted) {
                return;
            }
            //获得水果最大高度
            let _y = _fruit.GetTopY();
            if (this.loopTopY > _y) {
                this.loopTopY = _y;
            }

            this.curDetectFruitId++;
        }
        //每次循环检测水果
        let _time = Fruit.allItems.length > 10 ? 1 : 3;
        while (_time > 0) {
            _detect();
            _time--;
        }

    }
    private touchID = -1;
    onStageMouseDown(e: any) {
        // if (this.touchID != -1 && e.touchId > 0) {
        //     return;
        // }

        //为了防止ui点击事件影响游戏，延迟一帧判断游戏逻辑
        Laya.timer.frameOnce(1, this, () => {

            this.touchID = e.touchId;
            // console.error('onStageMouseDown e', e);
            this.onStageMouseMove(e);
        })

    }



    onStageMouseMove(e: any) {
        // console.log('onStageMouseMove e', e);
        // if (e.touchId != this.touchID) {
        //     return;
        // }
        //为了防止ui点击事件影响游戏，延迟一帧判断游戏逻辑
        Laya.timer.frameOnce(1, this, () => {

            if (!GameLogic.IsGameTouchEnable()) {
                return;
            }
            if (GameLogic.gameState != 2 || e.stageY < 150 || GameLogic.isPause) {
                return;
            }
            if (e && e.stageX < 10 || e.stageX > Laya.stage.width - 10) {
                return;
            }
            this.curTouchX = e.stageX;
            if (this.curFruit) {
                this.curFruit.SetMoveTarget(e.stageX);
            }
        })

        // console.error('onStageMouseMove', this.curFruit);
    }
    onStageMouseUp(e: any) {

        //为了防止ui点击事件影响游戏，延迟一帧判断游戏逻辑
        Laya.timer.frameOnce(1, this, () => {

            // if (e.touchId != this.touchID) {
            //     return;
            // }
            this.touchID = -1;
            if (!GameLogic.IsGameTouchEnable()) {
                return;
            }
            // console.log('onStageMouseUp e', e);
            if (GameLogic.gameState != 2 || e.stageY < 150 || GameLogic.isPause) {
                return;
            }
            this.curTouchX = -1;
            // console.log('onStageMouseUp', e.stageX, e.stageY);
            if (this.curFruit) {
                let _fruit = this.curFruit;
                this.curFruit.StartDown(e.stageX, () => {
                    GameLogic.comboTime = 0;
                    _fruit.EnableCollision(true);
                    // HHAudio.PlayEffect('meet', false, 100);
                    Laya.timer.once(1000, this, this.ShowFruit);
                });
                GameLogic.ShowStartHint(false);


                this.curFruit = null;

            }
            // console.error('onStageMouseUp', this.curFruit);
        })



    }
    // onMouseOut1(e: any) {
    //     // console.error('onMouseOut', e);
    //     this.onStageMouseUp(e);
    // }
    private curFruit: Fruit | null = null;
    ShowFruit() {
        if (this.curFruit) {
            return;
        }
        // this.curFruit = Fruit.Create({ x: 375, y: 1000, kind: this.getNextFruitId() });
        this.curFruit = Fruit.Create({ x: 375, y: 150, kind: this.getNextFruitId() });
        this.curFruit.EnableCollision(false);
        // console.error('ShowFruit', this.curFruit);
        //重置预定水果
        this.bookNextFruit = 0;

        this.fruitCount++;
    }
    onSameFruitContact(_data: { self: Fruit, other: Fruit }) {
        if (GameLogic.gameState != 2) {
            return;
        }
        // let _x = (_data.self.node.x + _data.other.node.x) / 2;
        // let _y = (_data.self.node.y + _data.other.node.y) / 2;
        let _getcurkind = -1;
        if (typeof _data.self.myInfo.kind == 'number') {
            _getcurkind = _data.self.myInfo.kind;
        }
        else if (typeof _data.other.myInfo.kind == 'number') {
            _getcurkind = _data.other.myInfo.kind;
        }
        if (_getcurkind <= 0) {
            console.error('没有获取到可以合并的水果');
            return;

        }
        let _kind = _getcurkind + 1;
        if (_kind <= GameLogic.maxFruitKind) {


            let _moveFruit = _data.other;
            let _standFruit = _data.self;
            //向id小的移动
            if (_standFruit.myid > _moveFruit.myid) {
                let _mf = _moveFruit;
                _moveFruit = _standFruit;
                _standFruit = _mf;
            }
            _moveFruit.EnableCollision(false);
            // _data.other.EnableCollision(false);
            // console.error('_moveFruit', _moveFruit.myid);
            // console.error('_standFruit', _standFruit.myid);
            const time = 200;


            let _x = _standFruit.node.x;
            let _y = _standFruit.node.y;

            //播放合成音效
            let _audio: any = 'mergeNew';
            if (_kind <= GameLogic.curTopKind) {
                _audio = Math.random() > 0.5 ? 'merge' : 'merge2';
            }
            HHAudio.PlayEffect(_audio);
            Laya.Tween.to(_moveFruit.node, { scaleX: 0.2, scaleY: 0.2, x: _x, y: _y }, time, Laya.Ease.sineIn, Laya.Handler.create(this, function () {
                //移除碰撞的水果
                _moveFruit.RemoveSelf();
                _standFruit.RemoveSelf();
                //增加分数
                let _addscore = GameLogic.AddScoreByKind(_kind);
                //获取优惠券
                // GameLogic.GetGameAward(_kind, (_data) => {
                //     if (_data.get) {
                //         console.log('获取优惠券');

                //         GameLogic.PauseGame(true);
                //         // GameLogic.ShowMergeAward(_data);
                //     }
                // })
                GameLogic.GetGameAward(_kind);

                GameLogic.ShowGetScoreEffect({ score: _addscore, pos: [_x + 50, _y - 30] });
                //创建新水果
                let _fruit = Fruit.Create({ x: _x, y: _y, kind: _kind });
                _fruit.EnableCollision(true);
                _fruit.scaleAction();
                Juice.Create({ x: _x, y: _y, kind: _kind - 1, width: _fruit.node.width });
                GameLogic.comboTime++;
                if (GameLogic.comboTime > 1) {

                    GameLogic.ShowComboEffect(GameLogic.comboTime);
                    GameLogic.AddCurScore(GameLogic.comboTime);
                }


            }));
        }

        // _data.self.RemoveSelf();
        // _data.other.RemoveSelf();
    }

    //预定下一个水果种类
    private bookNextFruit: string | number = 0;
    // 获取下一个水果的id
    getNextFruitId() {
        if (this.bookNextFruit) {
            return this.bookNextFruit;
        }
        let _frs = [];
        if (this.fruitCount < 3) {
            return 1
        } else if (this.fruitCount === 3) {
            return 2
        } else {
            // // 随机返回前5个
            // if (GameLogic.curTopKind < 5) {
            //     _frs = [25, 45, 25, 5];
            // }
            // else if (GameLogic.curTopKind < 9) {
            //     _frs = [5, 20, 35, 30, 10];
            // }
            // else {
            //     _frs = [5, 5, 40, 30, 15, 5];
            // }
            // 随机返回前5个
            if (GameLogic.curTopKind < 5) {
                _frs = [25, 45, 25, 5];
            }
            else if (GameLogic.curTopKind < 9) {
                _frs = [5, 30, 35, 20, 10];
            }
            else {
                _frs = [3, 10, 52, 25, 10];
            }
        }
        let _max = 0;
        for (const _r of _frs) {
            _max += _r;
        }
        let _rn = Math.random() * _max;
        let _idx = 0;
        for (const _r of _frs) {
            if (_rn < _r) {
                break;
            }
            _rn -= _r;
            _idx++;
        }
        return _idx + 1;
    }
    //--------------------------------任务道具------------------------------------//
    //移除 低于此等级的水果
    removeFruitBelowLevel(_level: number) {
        let _removeFruits = Fruit.allItems.filter(v => {
            if (!v.collisionState) {
                return false;
            }
            let _r = typeof v.myInfo.kind == 'number' && v.myInfo.kind < _level
            return _r;
        });
        // for (const item of Fruit.allItems) {
        //     if (typeof item.myInfo.kind != 'number') {
        //         continue;
        //     }
        //     if (item.myInfo.kind < _level) {
        //         _removeFruits.push(item);
        //     }
        // }
        this.clearTagetFruit(_removeFruits);
        /*while (_removeFruits.length > 0) {
            let _f = _removeFruits.pop();
            _f.RemoveSelf();
        }*/
    }

    clearTagetFruit(_removeFruits:Fruit[]){
        let i = 0;
        let doRemoveFruit = function(index){
            if(index >= _removeFruits.length){
                return;
            }
            let fruit = _removeFruits[index];
            HHAudio.PlayEffect("propClear");
            fruit.EnableCollision(false);
            Juice.Create({ x: fruit.node.x, y: fruit.node.y, kind: fruit.myInfo.kind as number, width: fruit.node.width });
            Laya.Tween.to(fruit.node, { scaleX: 0, scaleY: 0 }, 100, Laya.Ease.sineIn, Laya.Handler.create(this,()=>{
                fruit.RemoveSelf();
                doRemoveFruit(++i);
            }))
        };
        doRemoveFruit(i);
    }
    //移除 低于此高度的水果
    clearFruitYExceed(_y: number) {
        let _removeFruits = Fruit.allItems.filter(v => {
            if (!v.collisionState) {
                return false;
            }
            console.log('clearFruitYExceed', v.GetTopY(), _y);

            let _r = v.GetTopY() > _y;
            return _r;
        });
        this.clearTagetFruit(_removeFruits);
        /*while (_removeFruits.length > 0) {
            let _f = _removeFruits.pop();
            _f.RemoveSelf();
        }*/
    }
    //获得超级水果
    GetASupperFruit() {
        if (this.curFruit) {
            this.curFruit.ResetFruitKind('supper');
        }
        else {
            this.bookNextFruit = 'supper';
        }

    }
}
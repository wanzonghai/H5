import { GameLogic } from "../FGUIClass/GameLogic";
import HHAudio from "../Global/modules/Audio/HHAudio";
import MemPool from "../Global/modules/tools/MemPool";

//图片大小
// const imagesW = [50, 78, 106, 117, 150, 180, 185, 256, 300, 306, 400];
//总共11个级别

// const imagesW = [70, 98, 126, 137, 170, 200, 210, 280, 310, 360, 410];
// //目前测试超过8个点会报错
// const colliderInfo = [
//     { scale: 1.4, w: 64, h: 161, points: [41, 2, 61, 27, 60, 134, 38, 157, 12, 152, 3, 128, 4, 23, 21, 4] },
//     { scale: 1.5, w: 133, h: 161, points: [9, 2, 119, 1, 128, 11, 129, 147, 117, 158, 11, 158, 1, 147, 2, 14] },
//     { scale: 1.4, w: 160, h: 155, points: [65, 1, 20, 34, 0, 108, 28, 142, 80, 155, 147, 134, 159, 81, 121, 12] },
//     { scale: 1.3, w: 158, h: 231, points: [4, 14, 2, 11, 78, 0, 150, 0, 152, 228, 88, 223, 70, 232, 1, 217] },
//     { scale: 1.5, w: 158, h: 232, points: [45, 5, 2, 112, 46, 225, 112, 226, 155, 118, 110, 9] },
//     { scale: 1.4, w: 161, h: 256, points: [5, 26, 5, 24, 85, 5, 91, 35, 153, 58, 151, 254, 73, 226, 5, 220] },
//     { scale: 1.4, w: 199, h: 235, points: [10, 0, 185, -1, 200, 18, 200, 223, 186, 234, 8, 234, 0, 220, 0, 9] },
//     { scale: 1.4, w: 224, h: 276, points: [14, 3, 207, 0, 221, 15, 222, 259, 205, 273, 17, 274, 3, 256, 3, 16] },
//     { scale: 1.4, w: 294, h: 330, points: [47, 60, 145, -3, 243, 59, 294, 71, 282, 326, 5, 325, -2, 142, 1, 66] }
// ]

//
export interface FruitInfo {
    kind: number | string
    x: number,
    y: number,
}
export default class Fruit extends Laya.Script {
    static ImageBaseUrl = '';
    myInfo: FruitInfo
    node: Laya.Box;
    myid: number = -1;

    //是否和其他水果有过碰撞
    isContacted = false;


    // mask: Laya.Sprite = null as any;
    private lastPos: [number, number] = [-2000, -2000];

    private myCollider: Laya.CircleCollider;
    // private myCollider: Laya.PolygonCollider;
    private myRigidBody: Laya.RigidBody;
    static showingID = 0;
    private static poolName = 'FruitPool';

    static allItems: Fruit[] = [];
    private static myPrefab?: Laya.Prefab;
    private static parent?: Laya.Node;
    static SetPrefab(_prefab: Laya.Prefab, _parent: Laya.Node) {
        this.myPrefab = _prefab;
        this.parent = _parent;
    }
    static Create(_info: FruitInfo) {
        // console.log('Create', this.poolName, this.myPrefab);

        let _node = MemPool.getInstance().GetObjByPool(this.poolName, this.myPrefab);
        if (!_node) {
            return null;
        }
        // _node.active = false;
        // _node.getComponent(Laya.RigidBody).enabled = false;
        let _item: Fruit = _node.getComponent(Fruit);

        if (!_item) {
            return null;
        }
        Fruit.parent.addChild(_node);
        Fruit.allItems.push(_item);
        _item.init(_info);
        return _item;
    }
    //销毁所有节点
    static DestoryAll(_destoryPool = false) {
        // MemPool.getInstance().RecycleObjByTag(this.poolName);
        // if (_destoryPool) {
        //     MemPool.getInstance().DestroyObjPool(this.poolName);
        // }
        // console.error('DestoryAllDestoryAll', Fruit.allItems.length);

        while (Fruit.allItems.length > 0) {
            // console.log('allItems', Fruit.allItems.length);

            Fruit.allItems[0].RemoveSelf();
        }
    }
    RemoveSelf() {
        if (this.node.mask) {
            this.node.mask.graphics.clear();
            this.node.mask = null;
        }

        this.EnableCollision(false);
        this.node.pos(-500, -500);
        this.node.visible = false;
        this.node.removeSelf();
        MemPool.getInstance().PoolRecycleObj(Fruit.poolName, this.node, Fruit.poolName);
        let _idx = Fruit.allItems.findIndex(v => v.myid == this.myid);
        if (_idx >= 0) {
            Fruit.allItems.splice(_idx, 1);
        }
    }

    constructor() { super(); }

    private init(_info: FruitInfo) {
        Fruit.showingID++;

        this.isContacted = false;
        this.myid = Fruit.showingID;
        // console.error('init myid', this.myid);
        this.contactIDS = [];
        this.node = this.owner as any;

        this.myInfo = _info;


        this.myRigidBody = this.owner.getComponent(Laya.RigidBody);
        this.ResetFruitKind(_info.kind);

        this.EnableCollision(false);
        this.node.visible = true;
        Laya.timer.frameOnce(1, this, () => {
            this.node.pos(_info.x, _info.y);
            this.lastPos[0] = _info.x;
            this.lastPos[1] = _info.y;
        });
        this.startDownCallBack = undefined;



        this.inMoving = false;


        //console.log('init', 6);

    }
    //重置水果种类
    ResetFruitKind(_kind: string | number) {
        this.myInfo.kind = _kind;
        let _image = this.owner as Laya.Image;
        // _image.skin = Fruit.ImageBaseUrl + `img/fruits/fruit_${_info.kind}.png`;
        let _finfo = GameLogic.GetFruitUrlInfo(_kind);
        let _fConfig = GameLogic.GetFruitConfig(_kind);


        //console.log('init', 1, _info.kind);

        // this.myCollider = this.owner.getComponent(Laya.PolygonCollider);
        this.myCollider = this.owner.getComponent(Laya.CircleCollider);



        this.node.rotation = 0;
        this.targetX = 0;

        let _w = _fConfig.imagesW;
        let _r = _w / 2;

        //图片额外增加大小
        const _exterW = 0;

        _image.size(_w + _exterW, _w + _exterW)
        let _circle = this.node.getChildByName('circle') as Laya.Image;
        _circle.visible = _finfo.custom;
        if (_circle.visible) {
            _circle.skin = `img/fruits/q${_kind}.png`;
        }
        if (this.node.mask) {
            this.node.mask.graphics.clear();
            if (!_finfo.custom) {
                this.node.mask = null;
            }
            // this.node.mask.visible = _finfo.custom;
        }
        if (_finfo.custom) {
            if (!this.node.mask) {
                this.node.mask = new Laya.Sprite();
            }
            let _cr = _r + _exterW / 2
            this.node.mask.graphics.drawCircle(_cr, _cr, _cr, "#ff0000");
            _circle.size(_cr * 2, _cr * 2);
        }
        _image.skin = _finfo.url;
        console.log('_finfo.url', _finfo.url);


        // let _cInfo = colliderInfo[_info.kind - 1];
        // let _w = _cInfo.w * _cInfo.scale;
        // let _h = _cInfo.h * _cInfo.scale;
        // _image.size(_w, _h);

        // let _ps = '';
        // for (let i = 0; i < _cInfo.points.length; i++) {
        //     if (i != 0) {
        //         _ps += ',';
        //     }
        //     const _p = _cInfo.points[i];
        //     _ps += (_p * _cInfo.scale);
        // }
        // //console.log('init', 3);
        // this.myCollider.points = _ps;

        //console.log('init', 4);

        // this.node.rotation = (Math.random() * 360) | 0

        // 圆形所在的位置坐标

        this.myCollider.radius = _r;
        this.myCollider.y = this.myCollider.x = _exterW / 2;
        this.myCollider.refresh();

        this.node.active = true;
        this.node.scale(1, 1);
        //console.log('init', 5);
    }
    targetX = 0;
    private inMoving = false;
    private startDownCallBack?: Function
    StartDown(_x: number, _finish?: Function) {
        if (this.inMoving == true) {
            return;
        }
        this.inMoving = true;
        this.startDownCallBack = _finish;
        this.SetMoveTarget(_x);

        // let _minX = this.node.width / 2;
        // let _maxX = (this.owner.parent as Laya.Box).width - this.node.width / 2;
        // if (_x < _minX) {
        //     _x = _minX
        // }
        // else if (_x > _maxX) {
        //     _x = _maxX
        // }
        // this.targetX = _x;

        // if (!_time) {
        //     _time = Math.abs(_x - this.node.x);
        //     if (_time > 500) {
        //         _time = 500;
        //     }
        //     else if (_time < 100) {
        //         _time = 100;
        //     }
        // }
        // Laya.timer.frameOnce(2, this, () => {
        //     if (_y == undefined) {
        //         _y = this.node.y;
        //     }
        //     Laya.Tween.to(this.node, { x: _x, y: _y }, _time, undefined, Laya.Handler.create(this, () => {
        //         _finish && _finish()
        //         this.inMoving = false;
        //     }));
        // })

    }
    SetMoveTarget(_x: number) {
        // console.error('SetMoveTarget node', this.node);
        // console.error('SetMoveTarget parent', this.owner.parent);

        if (!this.node || !this.owner.parent) {
            return;
        }
        let _minX = this.node.width / 2;
        let _maxX = (this.owner.parent as Laya.Box).width - this.node.width / 2;
        if (_x < _minX) {
            _x = _minX
        }
        else if (_x > _maxX) {
            _x = _maxX;
        }
        // if (this.targetX == 0) {
        //     Laya.timer.frameLoop(1, this, this.moveXUpdate);
        // }
        this.targetX = _x;
        this.moveXUpdate();
        // this.node.pos(_x, this.node.y);
    }
    moveXUpdate() {
        // console.log('moveXUpdate');
        if (this.collisionState || this.targetX <= 0) {
            return;
        }
        // const moveL = 500;
        // let _dif = this.targetX - this.node.x;
        // if (Math.abs(_dif) <= moveL) 
        {
            this.node.pos(this.targetX, this.node.y);
            // this.node.x = this.targetX;
            if (this.inMoving && this.startDownCallBack) {
                this.inMoving = false;

                // Laya.timer.clear(this, this.moveXUpdate);
                this.startDownCallBack();
            }
            return;
        }
        // this.node.pos(this.node.x + (_dif < 0 ? -moveL : moveL), this.node.y);

    }
    private EnablePhysic(_enable: boolean) {
        // Laya.timer.clear(this, this.moveXUpdate);
        if (!this.myCollider.enabled && _enable) {
            //启动物理后记录普通水果
            if (typeof this.myInfo.kind == 'number') {
                GameLogic.NewFruit(this.myInfo.kind);
            }
        }
        this.myRigidBody.enabled = _enable;
        this.myCollider.enabled = _enable;

    }
    collisionState = true;
    EnableCollision(_enable: boolean) {
        this.collisionState = _enable;
        this.EnablePhysic(_enable);
    }
    scaleAction() {
        this.EnablePhysic(false);
        this.node.scale(0.2, 0.2);
        Laya.Tween.clearAll(this.node);
        Laya.Tween.to(this.node, { scaleX: 1, scaleY: 1 }, 300, Laya.Ease.sineIn, Laya.Handler.create(this, function () {
            this.EnablePhysic(true);
        }));
    }
    GetTopY() {
        return this.node.y - this.node.width / 2;
    }

    onEnable(): void {
        // Laya.timer.loop(700, this, () => {
        //     if (!this.collisionState || !this.myRigidBody.enabled) {
        //         return;
        //     }
        //     let _equal = (_n1: number, _n2: number) => {
        //         if (Math.abs(_n1 - _n2) < 1) {
        //             return true;
        //         }
        //         return false;
        //     }
        //     //0.5秒位置没有变动则更新最高位置
        //     if (_equal(this.node.x, this.lastPos[0]) && _equal(this.node.y, this.lastPos[1])) {
        //         this.stableY = this.node.y - this.node.width / 2;
        //         console.log('stableY', this.stableY, GameLogic.fruitTopY);
        //         if (GameLogic.fruitTopY - this.stableY > 0.5) {
        //             GameLogic.fruitTopY = this.stableY;
        //             console.log('fruitTopY', GameLogic.fruitTopY);

        //         }
        //     }
        //     else {
        //         this.lastPos[0] = this.node.x;
        //         this.lastPos[1] = this.node.y;
        //     }
        // })
    }

    onDisable(): void {
        // console.error('onDisable');

        this.node.scale(1, 1);
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this.node);
    }
    private contactIDS: number[] = [];
    onTriggerEnter(other: any, self: any, contact: any): void {
        if (!this.collisionState || !this.myRigidBody.enabled) {
            return;
        }
        // console.log('onTriggerEnter', self);

        // console.error('contact', contact);

        let _selfFruit: Fruit = self.owner.getComponent(Fruit);
        let _otherFruit: Fruit = other.owner.getComponent(Fruit);

        if (!_selfFruit || !_otherFruit) {
            return;
        }
        // if (this.contactIDS.indexOf(other.id) < 0) {
        //     this.contactIDS.push(other.id);
        //     let _audio: any = Math.random() > 0.5 ? 'meet' : 'meet2';
        //     HHAudio.PlayEffect(_audio, false, 100);
        // }

        let _merge = false;
        do {//判断是否合并
            if (_selfFruit.myInfo.kind === _otherFruit.myInfo.kind) {
                if (typeof _selfFruit.myInfo.kind == 'number') {
                    _merge = true;
                    break;

                }
            }
            else {
                if ((_selfFruit.myInfo.kind == 'supper') || (_otherFruit.myInfo.kind == 'supper')) {
                    _merge = true;
                    break;
                }
            }
        } while (0);

        if (_merge) {
            Laya.stage.event("sameContact", { self: _selfFruit, other: _otherFruit });
        }
        else {
            this.isContacted = true;
        }
        // else {
        //     let _y = this.node.y - this.node.width / 2;
        //     if (_y < GameLogic.fruitTopY) {
        //         GameLogic.fruitTopY = _y;
        //     }

        // }


    }

}
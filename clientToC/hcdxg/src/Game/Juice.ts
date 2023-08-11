import MemPool from "../Global/modules/tools/MemPool";

export interface JuiceInfo {
    kind: number
    x: number,
    y: number,
    width: number,
}
export default class Juice extends Laya.Script {
    myInfo: JuiceInfo
    node: Laya.Box;
    myid: number = -1;
    static showingID = 0;
    private static poolName = 'JuicePool';

    private static allItems: Juice[] = [];
    private static myPrefab?: Laya.Prefab;
    private static parent?: Laya.Node;
    static SetPrefab(_prefab: Laya.Prefab, _parent: Laya.Node) {
        this.myPrefab = _prefab;
        this.parent = _parent;
    }
    static Create(_info: JuiceInfo) {
        console.log('Create', this.poolName, this.myPrefab);

        let _node = MemPool.getInstance().GetObjByPool(this.poolName, this.myPrefab);
        if (!_node) {
            return null;
        }
        Juice.parent.addChild(_node);
        let _item: Juice = _node.getComponent(Juice);
        if (!_item) {
            return null;
        }
        Juice.allItems.push(_item);
        _item.init(_info);
        return _item;
    }
    //销毁所有节点
    static DestoryAll(_destoryPool = false) {
        // MemPool.getInstance().RecycleObjByTag(this.poolName);
        // if (_destoryPool) {
        //     MemPool.getInstance().DestroyObjPool(this.poolName);
        // }
        // console.error('DestoryAllDestoryAll', Juice.allItems.length);

        while (Juice.allItems.length > 0) {
            // console.log('allItems', Juice.allItems.length);

            Juice.allItems[0].RemoveSelf();
        }
    }
    RemoveSelf() {
        this.node.visible = false;
        this.node.removeSelf();
        MemPool.getInstance().PoolRecycleObj(Juice.poolName, this.node, Juice.poolName);
        let _idx = Juice.allItems.findIndex(v => v.myid == this.myid);
        if (_idx >= 0) {
            Juice.allItems.splice(_idx, 1);
        }
    }

    constructor() { super(); }

    private init(_info: JuiceInfo) {
        //因为更改水果 kind 变化调整

        if (_info.kind >= 1) {
            _info.kind++;
        }
        if (_info.kind >= 7) {
            _info.kind++;
        }


        Juice.showingID++;
        this.myid = Juice.showingID;
        this.node = this.owner as any;
        this.myInfo = _info;
        this.node.pos(_info.x, _info.y);
        this.node.visible = true;
        this.showJuice();

    }
    // 合并时的动画效果
    showJuice() {
        // console.log('showJuiceshowJuice');

        let _image1 = `img/juices/juice_l_${this.myInfo.kind}.png`;
        let _image2 = `img/juices/juice_o_${this.myInfo.kind}.png`;
        let _image3 = `img/juices/juice_q_${this.myInfo.kind}.png`;
        const RandomInteger = function (e, t) {
            return Math.floor(Math.random() * (t - e) + e)
        }
        // console.log('showJuiceshowJuice', 1);
        // 果粒
        for (let i = 0; i < 10; ++i) {
            const node = new Laya.Image(_image1);
            this.node.addChild(node);

            const a = 359 * Math.random(),
                i = 30 * Math.random() + this.myInfo.width / 2,
                x = Math.sin(a * Math.PI / 180) * i,
                y = Math.cos(a * Math.PI / 180) * i,
                scale = .5 * Math.random() + this.myInfo.width / 100;
            node.scale(scale, scale)
            const p = .3 * Math.random();
            node.pos(0, 0);
            node.anchorX = 0.5;
            node.anchorY = 0.5;
            Laya.Tween.to(node, { x: node.x + x, y: node.y + y }, p * 1000)
            Laya.Tween.to(node, { scaleX: 0.3, scaleY: 0.3, rotation: RandomInteger(-360, 360) }, (p + 0.5) * 1000,
                undefined, Laya.Handler.create(this, function () {
                    // console.log('showJuiceshowJuice-----', 1);
                    node.removeSelf();
                    // console.log('showJuiceshowJuice-----', 2);
                }));
        }

        // console.log('showJuiceshowJuice', 2);
        // 水珠
        for (let f = 0; f < 20; f++) {
            const node = new Laya.Image(_image2);
            this.node.addChild(node);

            let a = 359 * Math.random(), i = 30 * Math.random() + this.myInfo.width / 2,
                x = Math.sin(a * Math.PI / 180) * i,
                y = Math.cos(a * Math.PI / 180) * i,
                scale = .5 * Math.random() + this.myInfo.width / 100;
            node.scale(scale, scale)
            let p = .3 * Math.random();
            node.anchorX = 0.5;
            node.anchorY = 0.5;
            // node.pos(this.myInfo.x, this.myInfo.y);
            node.pos(0, 0);
            Laya.Tween.to(node, { x: node.x + x, y: node.y + y }, p * 1000)
            Laya.Tween.to(node, { scaleX: 0.3, scaleY: 0.3, rotation: RandomInteger(-360, 360) }, (p + 0.5) * 1000,
                undefined, Laya.Handler.create(this, function () {
                    // console.log('showJuiceshowJuice-----', 3);
                    node.removeSelf();
                    // console.log('showJuiceshowJuice-----', 4);
                }));
        }
        // console.log('showJuiceshowJuice', 3);
        // 果汁
        const node = new Laya.Image(_image3);
        this.node.addChild(node);

        // node.pos(this.myInfo.x, this.myInfo.y);
        node.pos(0, 0);
        node.scale(0, 0);
        node.anchorX = 0.5;
        node.anchorY = 0.5;
        node.rotation = -RandomInteger(0, 360);
        node.alpha = 1;
        const scale = this.myInfo.width / 150;
        // console.log('showJuiceshowJuice', 4);
        Laya.Tween.to(node, { scaleX: scale, scaleY: scale }, 200,
            undefined, Laya.Handler.create(this, function () {
                // console.log('showJuiceshowJuice-----', 5);
                Laya.Tween.to(node, { alpha: 0 }, 1000,
                    undefined, Laya.Handler.create(this, function () {
                        // console.log('showJuiceshowJuice-----', 7);
                        node.removeSelf();
                        this.RemoveSelf();
                        // console.log('showJuiceshowJuice-----', 8);
                    }));
                // console.log('showJuiceshowJuice-----', 6);
            }));
        // console.log('showJuiceshowJuice', 5);
    }

    onEnable(): void {
    }

    onDisable(): void {
        this.node.removeChildren();
        Laya.Tween.clearAll(this.node);
    }

}
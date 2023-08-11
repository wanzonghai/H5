//内存池类
interface NodeInfo {
    key: string;
    node: any;
}
export default class MemPool {

    //注意，Singleton是要替换成你自己实现的子类 这里没有实际的作用
    private static instance: MemPool | null = null;


    private ObjectPoolMap: { [key: string]: any } = {};
    private PoolPreMap: { [key: string]: any } = {};

    //内存池生成的obj根据tag分组，便于回收
    private ObjSavebyTag: { [tag: string]: NodeInfo[] } = {};
    // update (dt) {}

    public static getInstance(): MemPool {
        if (!this.instance) {
            this.instance = new MemPool();
        }
        return this.instance;
    }
    //********************************************自动回收池****************************************************/
    HavePool(_name: string) {
        return this.ObjectPoolMap.hasOwnProperty(_name);
    }
    //_name创建的对象池名，_pre预制体或Node节点对象,initSize初始大小(与DestroyObjPool要对应调用)
    CreateObjPool(_name: string, _pre: any, initSize = 0): boolean {
        // if (this.ObjectPoolMap.hasOwnProperty(_name)) {
        //     //如果内存池中有此类对象则不再进行创建
        //     // console.log(`Already have ${_name} in Pool!`);
        //     return false;

        // }
        // let objPool:any[] = [];
        // for (let i = 0; i < initSize; ++i) {
        //     // let obj =  cc.instantiate(_pre); // 创建节点
        //     let obj = Laya.Pool.getItemByClass(_name,_pre) as any ; // 创建节点
        //     objPool.push(obj); // 通过 putInPool 接口放入对象池
        // }
        // this.ObjectPoolMap[_name] = objPool;
        // this.PoolPreMap[_name] = _pre;
        // console.log(`-------------------InitObjectPool(${_name})-------------------`);
        return true;

    }
    //从内存池中获取对象
    GetObjByPool(_name: string, type: Laya.Prefab, tag = ''): any | null {
        // if (!(_name in this.ObjectPoolMap)) {
        //     //如果内存池中不存在此类对象则进行创建
        //     let _log = `Error: Can not Get ${_name} in Pool!`
        //     console.error(_log);
        //     // throw new Error(_log);
        //     return null;
        // }
        // let _objPoll = this.ObjectPoolMap[_name];
        // if (!_objPoll) {
        //     console.error("Error: The _objPoll " + _name + " is NULL!");
        //     return null;
        // }
        // let _obj = null;
        // if (_objPoll.length > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
        //     // console.log("this.ObjPool.size() ppppis --- "+this.ObjPool.size());
        //     _obj = _objPoll.pop();
        //     // console.log("this.ObjPool.size() is --- "+this.ObjPool.size());
        // }
        // else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        //     _obj = cc.instantiate(this.PoolPreMap[_name]);
        // }
        // if ('' != tag) {
        //     if (!(tag in this.ObjSavebyTag)) {
        //         this.ObjSavebyTag[tag] = new Array<NodeInfo>();

        //     }
        //     this.ObjSavebyTag[tag].push({ key: _name, node: _obj });
        // }
        // let _obj: Laya.Node = Laya.Pool.getItemByClass(_name, type);
        let _obj: Laya.Node = Laya.Pool.getItemByCreateFun(_name, type.create, type);
        return _obj;
    }
    RecycleObjByTag(tag: string) {
        // if (tag in this.ObjSavebyTag)
        //     while (this.ObjSavebyTag[tag].length > 0) {
        //         const element = this.ObjSavebyTag[tag].pop();
        //         if (!element || element.node.children == null) {
        //             continue;
        //         }
        //         this.ObjectPoolMap[element.key].put(element.node);
        //     }
    }
    //把对象回收到内存池
    PoolRecycleObj(_name: string, obj: any, tag = '') {
        Laya.Pool.recover(_name, obj);
        // if (!this.ObjectPoolMap.hasOwnProperty(_name)) {
        //     //如果内存池中不存在此类对象则进行创建
        //     let _log = `warming: Can not find ${_name} in Pool!`
        //     console.log(_log);
        //     return;
        // }
        // if ('' != tag) {
        //     let _index = this.ObjSavebyTag[tag].findIndex(v => v.node.uuid == obj.uuid);
        //     if (_index >= 0) {
        //         this.ObjSavebyTag[tag].splice(_index, 1);
        //     }
        // }
        // //子节点不是空才是正常的可回收节点
        // if (obj.children)
        //     this.ObjectPoolMap[_name].put(obj); // 通过 putInPool 接口放入对象池
    }
    //销毁内存池
    DestroyObjPool(_name: string) {
        // if (_name in this.ObjectPoolMap) {
        //     this.ObjectPoolMap[_name].clear();
        //     delete this.ObjectPoolMap[_name];
        // }
        // if (_name in this.PoolPreMap) {
        //     delete this.PoolPreMap[_name];
        // }
    }
    //********************************************************************************************************/
}

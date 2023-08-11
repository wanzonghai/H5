import { PkgNameType } from "../../FGUIConfig";
import FGUIBase, { FGUIClassType } from "./FGUIBase";
import FGUIMount from "./FGUIMount";
import FGUIUtil from "./FGUIUtil";

/**
 * FGUI场景基类
 * 继承此基类 构建类后可以构建场景类
 * 场景类同时只能存在一个
 */
export default abstract class FGUIScene extends FGUIBase {

    fguiType: FGUIClassType = FGUIClassType.scene;
    /**
     * 包名
     * 填写之后才可以显示对应包主界面
     */
    abstract pkgName: PkgNameType;
    /*
        此场景内 包 挂载的脚本
        声明用法：
        mountPath = {
            rankItem: {
                classType: RankItem,//自定义类名
                compName: "rankItem"//(组件名)
            }
        }
        */
    mountPath: {
        [key: string]: {
            classType: new () => FGUIMount,
            compName: string
        }
    } = {} as any;
    //主组件名
    // protected mainName = "Main";
    //主组件名
    mainName = "Main";
    mySceneName = '';
    AddScene(_callBack?: Function) {
        if (!this.pkgName) {
            console.error('场景类需要填写 pkgName !');
            return false;
        }
        let _parent = fgui.GRoot.inst;
        // console.error('_parent', _parent.width, _parent.height);
        //拼接获得唯一组件名
        let _myName = `${this.pkgName}_${this.mainName}`;



        // this.curFGUI = _fgui;

        //获取自定义key的值
        const sceneKeyName = 'sceneName';
        let _main = null as any;
        for (const iterator of _parent._children) {
            if (sceneKeyName in iterator && iterator[sceneKeyName] == _myName) {
                _main = iterator;
                break;
            }
        }
        // let _main = _parent.getChild(_myName);
        // console.error('AddScene', _myName, _main);
        //获取Main组件，并添加到当前界面
        if (!_main) {//未找到此节点则创建
            FGUIUtil.loadPackage(this.pkgName, this, () => {
                //给包挂载脚本
                //挂载脚本会被隐藏，原因未知
                for (const key in this.mountPath) {
                    fgui.UIObjectFactory.setExtension(fgui.UIPackage.getItemURL(this.pkgName, this.mountPath[key].compName), this.mountPath[key].classType);
                }
                //创建此组件
                _main = fgui.UIPackage.createObject(this.pkgName, this.mainName).asCom;
                //组件自定义场景名
                _main[sceneKeyName] = _myName;
                //进行适配关联
                _main.makeFullScreen();
                _main.addRelation(_parent, fgui.RelationType.Size);

                //对不同锚点进行适配
                _main.x = _main.pivotX * Laya.stage.width;
                _main.y = _main.pivotY * Laya.stage.height;

                // console.error('_main', _main);

                //添加到父节点
                _parent.addChild(_main);
                //调用初始化并显示
                this.Init(_main);
                _callBack && _callBack();
                // console.error('_main', _main.y);
            });
        }
        else {//已找到此节点直接显示
            // console.error('找到可用场景：', _myName, _main);
            // console.error('_parent', _parent);
            //更新在父节点中的顺序，渲染到同级顶层
            _parent.addChild(_main);
            //显示界面
            this.Show();
            _callBack && _callBack();
        }
        return true;
    }
    // CloseSelf() {
    //     this.Hide();
    //     // FGUIUtil.CloseScene(this)
    // }

}
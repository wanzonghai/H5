import FGUIBase, { FGUIClassType, FGUIElement } from "./FGUIBase";




/**
 * FGUI 挂载脚本
 * 挂载到一个包上可以使用
 * 注意必须是 fgui.GComponent 类型
 * 如果是其他类型可在fgui中放在Component组件中，以便使用
 */
export default abstract class FGUIMount extends fgui.GComponent {

    /**
     * ***注意：挂载类有可能导致组件默认不显示，可调用Show方法显示此组件***
     */

    fguiType: FGUIClassType = FGUIClassType.mount;
    //所在内存池名字
    poolName = '';

    /*
    FGUI中用到的元件
    没有 elementPath 路径时必须和fgui名字一致
    声明用法：
    element = {
        startBtn: null as fgui.GButton,
        subjectBtn: null as fgui.GButton
    }
    */
    element: {
        [key: string]: FGUIElement
    } = {} as any;
    /**
     * 元件路径
     * 直接在主组件下可以不填
     * 路径为组件包名
     */
    protected elementPath: {
        [key: string]: string
        //例如：
        //startBtn:"bg.pkg1.startBtn"
    } = {} as any;
    /**
     * 挂载的类
     * 如果要是用自定义类 在 element 声明之后请在 classType 挂载此类类型
     */
    protected classType: {
        [key: string]: typeof FGUIBase
        //例如：
        //startscene:StartScene
    } = {} as any;
    // element: {
    //     Main: fgui.GComponent;
    // } = {} as any;
    private isStarted = false;
    // //为了解决挂载类会被自动不显示问题
    // private curShowState = false;
    onConstruct() {
        // console.error('FGUIMount onConstruct');
        this.Init();
    }
    private Init() {
        //加载当前类挂载的包
        this.getElementsObj();
        // console.error('InitInitInit visible', this.enabled, this.visible);
        //延迟1秒执行Show方法
        Laya.timer.frameOnce(1, this, () => {
            if (this.visible) {
                this.forceShow = true;
                // this.visible = false;
                this.Show();

            }
        })


    }

    //获取声明的元件实例
    private getElementsObj() {
        let _eleKeys = Object.keys(this.element);
        // console.error('FGUIMount _eleKeys', _eleKeys);
        for (const key of _eleKeys) {
            // console.log('type', typeof this.element[key]);

            let _path = key;
            if (key in this.elementPath) {
                _path = this.elementPath[key];
            }
            // console.log('getChild', _path);
            this.element[key] = this.getChildByPath(_path);
            if (!this.element[key]) {
                console.error(`${this.constructor.name}:"${_path}"未找到,请确认路径正确！`);
                continue;
            }
            // console.log('getElementsObj', key, this.element[key]);
            if (this.classType[key]) {
                let _comp = (this.element[key] as fgui.GObject).asCom;
                if (!_comp) {
                    console.error(`"${key}"不是GComponent类型，不能挂载类！`);
                    continue;
                }
                let _class = this.element[key] = new (this.classType[key])();
                _class.Init(_comp);

            }
            else {

            }
            // console.log('element', key, this.element[key]);
        }
    }
    removeFromParent() {
        for (const key in this.classType) {
            let _class = this.element[key] as FGUIBase
            if (_class) {
                _class.RemoveSelf();
            }
            this.element[key] = null as any;
        }
        this.Hide();
        this.onEnd();
        super.removeFromParent();
    }
    private forceShow = false;

    Show() {
        if (this.visible && !this.forceShow) {
            return;
        }
        this.forceShow = false;
        this.visible = true;
        if (!this.isStarted) {
            this.onStart();
            this.isStarted = true;
        }
        this.onShow();
    }
    Hide() {
        if (!this.visible) {
            return;
        }
        this.visible = false;
        this.onHide();
    }
    /**
     * fgui包显示完成
     * 重写可进行一些初始化操作
     */
    onStart() { }
    /**
     * fgui包不再显示
     * 重写可进行一些结束操作
     */
    onEnd() { }
    /**
     * fgui包显示完成
     * 重写可进行一些初始化操作
     */
    onShow() { }
    /**
     * fgui包不再显示
     * 重写可进行一些结束操作
     */
    onHide() { }

}


export type FGUIElement = fgui.GObject | FGUIBase;
export enum FGUIClassType {
    element,//元件
    scene,//场景
    mount,//脚本挂件
}
/**
 * FGUI基类
 * 继承此基类 构建类后可以直接显示FUI界面
 * 此类中的main才是目标元件
 */
export default class FGUIBase {

    //主组件对象
    main: fgui.GComponent;
    fguiType: FGUIClassType = FGUIClassType.element;
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

    constructor() {
    }
    SetMain(_main: fgui.GComponent) {
        // console.error('SetMain', _main);
        this.main = _main;
    }
    Init(_main: fgui.GComponent) {
        // console.log('FGUIBase Main', this.Main);
        this.SetMain(_main);
        //加载当前类挂载的包
        this.getElementsObj();
        // console.error('this.main', this.main);
        if (this.main.visible) {
            this.main.visible = false;
            this.onStart();
            this.Show();
        }
    }

    //获取声明的元件实例
    private getElementsObj() {
        let _eleKeys = Object.keys(this.element);
        for (const key of _eleKeys) {
            // console.log('type', typeof this.element[key]);

            let _path = key;
            if (key in this.elementPath) {
                _path = this.elementPath[key];
            }
            // if (key in this.elementPath) {
            //     console.error('elementPath', this.elementPath[key]);

            //     let _patharr = this.elementPath[key].split('.');
            //     let _parent = this.main;
            //     for (let index = 0; index < _patharr.length; index++) {
            //         console.error('path:', _patharr[index]);

            //         _parent = _parent.getChild(_patharr[index]).asCom;
            //         console.error('_parent:', _parent);

            //     }
            //     this.element[key] = _parent;

            // }
            // else {
            //     // _path = this.elementPath[key];
            //     this.element[key] = this.main.getChild(_path);
            // }
            // console.log('getChild', _path);
            this.element[key] = this.main.getChildByPath(_path);
            if (!this.element[key]) {
                console.error(`${this.constructor.name}:"${_path}"未找到,请确认路径正确！`);
                continue;
            }
            if (this.classType[key]) {
                let _comp = (this.element[key] as fgui.GObject).asCom;
                if (!_comp) {
                    console.error(`"${key}"不是GComponent类型，不能挂载类！`);
                    continue;
                }
                let _class = this.element[key] = new (this.classType[key])();
                _class.Init(_comp);
            }
            // console.log('element', key, this.element[key]);
        }
    }
    RemoveSelf() {
        // console.error('RemoveSelf');

        for (const key in this.classType) {
            let _class = this.element[key] as FGUIBase
            if (_class) {
                _class.RemoveSelf();
            }
            this.element[key] = null as any;
        }
        this.Hide();
        this.onEnd();
        this.main.removeFromParent();

    }
    Show() {
        // console.error('Show this.main', this.main);
        if (this.main.visible) {
            return;
        }
        this.main.visible = true;
        this.onShow();
    }
    Hide() {
        if (!this.main.visible) {
            return;
        }
        this.main.visible = false;
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
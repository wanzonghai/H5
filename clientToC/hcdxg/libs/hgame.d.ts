declare module laya.ui {
    import View = Laya.View;
    /**
     * <code>BaseView</code> 是一个基础视图类，添加基本页面管理
     */
    class BaseView extends View {
        constructor();
         /**
         * 更新页面数据
         * @param data
         */
        updateData(data):void;
        /**
         * 注册事件，只管注册，底层负责注销
         * @param eventName 事件名。
         * @param func 方法。
         */
        regEvent(eventName:string, func:Function): void;
        /**
         * 注册点击事件，点击后带按钮音效
         * @param node 节点。
         * @param func 方法。
         * @param once 是否一次调用
         */
        regClick(node:Laya.Node, func:Function, once?:boolean): void;
        /**
         * 是否显示页面遮罩背景
         * @param alpha 透明度，不传默认0.7
         */
        showMaskBg(alpha?:number):void;
        /**
         * 是否显示关闭按钮
         * @param showClose true显示
         */
        showCloseBtn(showClose,posx,posy): void;
        onClickClose():void;
        onClickBg():void;
        /**
         * 延迟两秒显示关闭按钮
         * @param closeBtn 关闭按钮
         */
        delayShowCloseBtn(closeBtn:any,sec?:number):void;
    }
}

declare module Laya {
    class BaseView extends laya.ui.BaseView {
    }
}
/**
 * 全局变量声明
 */
declare let tt: any;
declare let wx: any;
declare let qq: any;
declare let mini: any;
declare let wxDownloader: any;
declare class OpenDataContext {
    /**
     * 开放数据域和主域共享的 sharedCanvas，注意在开放数据域内时getContext只能使用2d模式
     */
    canvas: Canvas;
    /**
     * 向开放数据域发送消息
     * @param message 要发送的消息，message 中及嵌套对象中 key 的 value 只能是 primitive value。即 number、string、boolean、null、undefined。
     */
    postMessage(message: any): void;
}
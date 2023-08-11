import { DebugConfig } from "../../DebugConfig";

/**
 * 画面监视器
 * 检测画面性能
 */
export default class ViewMonitor {
    static init() {
        // setInterval(() => {
        //     this.FPS();
        // }, 16);
        // // console.log('FPS', (cc.director as any));
    }
    static FPS() {
        // console.log('FPS', (cc as any).profiler.getFrameRate());
    }
    static DrawCall() {
    }

}
import TimeUtil from "./TimeUtil";
/**
 * 加载资源
 */
export default class LoadResouce {

    // static async loadRes<T>(url: string, type: { new(): T }, defaultUrlOrRes?: string | T, maxTryTimes = 2): Promise<T> {
    //     let tryedTimes = 0;

    //     let tryLoad = (rs: Function, rj: Function) => {
    //         tryedTimes++;
    //         cc.resources.load(url, type as any, (err, res: any) => {
    //             if (err) {
    //                 // 未达到重试次数,继续重试
    //                 if (tryedTimes < maxTryTimes) {
    //                     tryLoad(rs, rj);
    //                 }
    //                 // 达到重试次数，有默认值，使用默认值
    //                 else if (defaultUrlOrRes) {
    //                     if (typeof defaultUrlOrRes === 'string') {
    //                         rs(this.loadRes(defaultUrlOrRes, type));
    //                     }
    //                     else {
    //                         rs(defaultUrlOrRes);
    //                     }
    //                 }
    //                 // 达到默认次数，没有默认值，抛出异常
    //                 else {
    //                     rj(err)
    //                 }
    //                 return;
    //             }
    //             rs(res);
    //         })
    //     }

    //     return new Promise<T>(tryLoad);
    // }
    // static async loadRemote(url: string): Promise<any> {
    //     return new Promise((rs, rj) => {
    //         cc.assetManager.loadRemote(url, function (err: Error | null, res: any) {
    //             if (err) {
    //                 rj(err);
    //             }
    //             else {
    //                 rs(res);
    //             }
    //         });
    //     })
    // }
    // static async loadPngRemote(url: string): Promise<any> {
    //     return new Promise((rs, rj) => {
    //         cc.assetManager.loadRemote(url, { ext: '.png' }, function (err: Error | null, res: any) {
    //             if (err) {
    //                 rj(err);
    //             }
    //             else {
    //                 rs(res);
    //             }
    //         });
    //     })
    // }

    // static getImage(url: string, onLoad?: (sf: cc.SpriteFrame) => void): cc.SpriteFrame {
    //     let output = new cc.SpriteFrame();
    //     LoadResouce.loadRemote(url).then(tex => {
    //         output.setTexture(tex);
    //         onLoad && onLoad(output);
    //     })
    //     return output;
    // }

    // static getImageInRes(url: string, defaultUrlOrRes?: string | cc.SpriteFrame, onLoad?: (sf: cc.SpriteFrame) => void) {

    //     let output = new cc.SpriteFrame();
    //     let _tryTime = 3;
    //     let _fun = async (v: cc.SpriteFrame) => {
    //         if (!v.textureLoaded()) {
    //             if (_tryTime <= 0) {
    //                 throw new Error(`texture 加载失败:${url}`);
    //             }
    //             v.ensureLoadTexture();
    //             await TimeUtil.waitFrame();
    //             _fun(v);
    //         }
    //         else {
    //             this.copySpriteFrame(output, v);
    //             onLoad && onLoad(output)
    //         }
    //     }
    //     LoadResouce.loadRes(url, cc.SpriteFrame, defaultUrlOrRes, _tryTime).then(
    //         _fun
    //     ).catch(e => {
    //         console.error('getImageInRes 图片加载失败', e);
    //     });

    //     // let output = new cc.SpriteFrame();
    //     // CCUtil.loadRes(url, cc.SpriteFrame, defaultUrlOrRes).then(v => {
    //     //     this.copySpriteFrame(output, v);
    //     //     onLoad && onLoad(output)
    //     // }).catch(e => {
    //     //     console.error('getImageInRes 图片加载失败', e);
    //     // });

    //     return output;
    // }

    // static ensureTextureLoaded(node: cc.Node): Promise<void[]> {
    //     let promises: Promise<any>[] = [];
    //     for (let child of node.children) {
    //         let sprite = child.getComponent(cc.Sprite);
    //         if (sprite) {
    //             if (!sprite.spriteFrame.textureLoaded()) {
    //                 promises.push(new Promise(rs => {
    //                     sprite.spriteFrame.on('load', () => { rs(null); });
    //                     sprite.spriteFrame.ensureLoadTexture();
    //                 }))
    //             }
    //         }
    //         if (child.children.length) {
    //             promises.push(this.ensureTextureLoaded(child))
    //         }
    //     }


    //     return Promise.all(promises);
    // }

    // static copySpriteFrame(target: cc.SpriteFrame, source: cc.SpriteFrame) {
    //     target.setTexture(source.getTexture(), source.getRect(), source.isRotated(), source.getOffset(), source.getOriginalSize());
    // }
}
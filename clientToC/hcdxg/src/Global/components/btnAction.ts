export default class btnAction extends Laya.Button {
    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    constructor() { super(); }

    onEnable(): void {
        this.on(Laya.Event.MOUSE_DOWN, this, () => {
            console.log('touch MOUSE_DOWN');
            // this.scale(0.9, 0.9);
            Laya.Tween.to(this, { scaleX: 1.1, scaleY: 1.1 }, 100);

        })
        this.on(Laya.Event.MOUSE_UP, this, () => {
            console.log('touch MOUSE_UP');
            Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 100);

        })
        this.on(Laya.Event.MOUSE_OUT, this, () => {
            console.log('touch MOUSE_OUT');
            Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 100);

        })
        this.on(Laya.Event.MOUSE_OVER, this, () => {
            console.log('touch MOUSE_OVER');
            Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 100);

        })
    }

    onDisable(): void {
    }

}
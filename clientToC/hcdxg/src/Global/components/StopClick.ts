export default class btnAction extends Laya.Box {

    onEnable(): void {
        this.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
            e.stopPropagation();
        })
        this.on(Laya.Event.MOUSE_DOWN, this, (e: Laya.Event) => {
            // console.log('touch MOUSE_DOWN');
            // this.scale(0.9, 0.9);
            e.stopPropagation();

        })
        this.on(Laya.Event.MOUSE_UP, this, (e: Laya.Event) => {
            e.stopPropagation();


        })
        this.on(Laya.Event.MOUSE_OUT, this, (e: Laya.Event) => {
            e.stopPropagation();

        })
        this.on(Laya.Event.MOUSE_OVER, this, (e: Laya.Event) => {
            e.stopPropagation();

        })
    }

    onDisable(): void {
    }

}
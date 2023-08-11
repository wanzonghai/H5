import { ModuleAudio } from "./ModuleTool";

export default class ModuleWindow extends fgui.Window {

    private _callBackHideTarget: any;

    private _callBackHide: Function;

    private _callBackShowTarget: any;

    private _callBackShow: Function;

    private _winParamData: any;

    constructor(winParamData: any) {

        super();

        this._winParamData = winParamData;
        // console.error('ModuleWindow', this);

    }

    protected doShowAnimation(): void {

        let _trs = this.contentPane.getTransition("popUp");

        if (_trs) {

            _trs.play(Laya.Handler.create(this, () => {
                this.onShown();
            }));

        }
        else {
            this.onShown();
        }

    }

    protected doHideAnimation(): void {

        ModuleAudio.PlayComonBtnAudio();
        let _trs = this.contentPane.getTransition("packUp");

        if (_trs) {

            _trs.play(Laya.Handler.create(this, () => {
                this.hideImmediately();
            }));

        }
        else {
            this.hideImmediately();
        }

    }

    public onHide() {

        if (!!this._callBackHide) this._callBackHide.call(this._callBackHideTarget);

        // console.error('onHide parent', this.parent);

    }

    public onShown() {
        super.onShown();
        if (!!this._callBackShow) this._callBackShow.call(this._callBackShowTarget);

        // console.error('onShown parent', this.parent);
    }


    public SetShowCallBack(thisObj: any, callBackShow: Function) {
        this._callBackShowTarget = thisObj;

        this._callBackShow = callBackShow;
    }

    public SetHideCallBack(thisObj: any, callBackHide: Function) {
        this._callBackHideTarget = thisObj;

        this._callBackHide = callBackHide;
    }

    public GetParamData(): any {
        return this._winParamData;
    }
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
import UI_TaskExtraPopup from './Task/UI_TaskExtraPopup';
import ModulePackage from '../ModulePackage';
import ModuleWindow from '../ModuleWindow';
import { TaskType } from './TaskLogic';
import { ModuleAudio } from '../ModuleTool';

export default class uiTaskExtraPopup extends UI_TaskExtraPopup {

    static Show(_award: {
        parent?: fgui.GComponent,
        info: { type: TaskType },
        callBack?: (_successCallback?: Function) => void
    }) {
        console.log('Show uiTaskExtraPopup', _award.info);

        // this.awardInfo = _award;
        ModulePackage.Instance.PopWindow("Task", "TaskExtraPopup", { winParamData: _award });
    }

    private _winHandler: ModuleWindow;

    private touchCloseBtn = false;

    protected onConstruct(): void {

        super.onConstruct();
        this.m_closeButton.onClick(this, () => {
            this.touchCloseBtn = true;
            this._winHandler.hide();

        });
        this.onClick(this, () => {
            if (this.touchCloseBtn) {
                return;
            }
            this.callback && this.callback(() => {
                this._winHandler.hide();
            });
            ModuleAudio.PlayComonBtnAudio();


        })
    }
    /**
     * 初始化方法，由于不能多继承，重载基类的这个方法来完成Init，和Init一样正常这个方法也是只会调用一次。
     * 另，这个方法不能传参，暂时由data来传递窗口的handler
     */
    makeFullScreen(): void {

        // console.error('makeFullScreenmakeFullScreen');

        super.makeFullScreen();	//先处理全屏

        //初始化
        this._winHandler = this.data as ModuleWindow;

        this.data = null;

        if (this._winHandler != null) {
            //设置显示监听，用于窗口关闭时的本类数据清理。
            this._winHandler.SetShowCallBack(this, this.OnShow);
            //设置隐藏监听，用于窗口关闭时的本类数据清理。
            this._winHandler.SetHideCallBack(this, this.OnHide);
            this.SetInfo(this._winHandler.GetParamData())
            this.touchCloseBtn = false;

        }
        // this.OnShow();
    }
    private callback?: (_successCallback?: Function) => void
    SetInfo(_info: {
        info: { type: TaskType },
        callBack?: (_successCallback?: Function) => void
    }) {
        this.callback = _info.callBack;
    }
    public OnShow(): void {
        console.log("OnShow~~~");
    }

    public OnHide(): void {

        console.log("OnHide~~~");
        Laya.stage.offAllCaller(this);
        Laya.timer.clearAll(this);
    }

}
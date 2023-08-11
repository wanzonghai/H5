/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
import ModulePackage from '../ModulePackage';
import { ModuleAudio } from '../ModuleTool';
import ModuleWindow from '../ModuleWindow';
import UI_TaskPrecondition from './Task/UI_TaskPrecondition';

/**
 * 任务前置条件
 */
export default class uiTaskPrecondition extends UI_TaskPrecondition {

    static Show(_award: {
        info: { title: string },
        callBack?: (_successCallback?: Function) => void
    }) {
        // this.awardInfo = _award;
        ModulePackage.Instance.PopWindow("Task", "TaskPrecondition", { winParamData: _award });
    }

    private _winHandler: ModuleWindow;


    protected onConstruct(): void {

        super.onConstruct();
        this.m_okBtn.onClick(this, () => {
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

        }
        // this.OnShow();
    }
    private callback?: (_successCallback?: Function) => void
    SetInfo(_info: {
        info: { title: string },
        callBack?: (_successCallback?: Function) => void
    }) {
        this.m_descText.text = _info.info.title + '才可以打开礼包哦！';
        this.m_okBtn.title = _info.info.title;
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
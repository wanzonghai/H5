/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import ModulePackage from '../ModulePackage';
import { ModuleAudio } from '../ModuleTool';
import ModuleWindow from '../ModuleWindow';
import UI_TaskInvite from './Task/UI_TaskInvite';
import uiGetReward from './uiGetReward';

export default class uiTaskInvite extends UI_TaskInvite {

    static Show(_award: {
        type: 'invit' | 'beInvit',
        info: { avatar: string, nickName: string }[]
        callBack?: Function
    }) {
        // this.awardInfo = _award;
        ModulePackage.Instance.PopWindow("Task", "TaskInvite", { winParamData: _award });
    }

    private _winHandler: ModuleWindow;


    protected onConstruct(): void {

        super.onConstruct();
        this.m_confirmBtn.onClick(this, () => {
            this._winHandler.hide();
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
    private callBackFun?: Function
    SetInfo(_info: {
        type: 'invit' | 'beInvit',
        info: { avatar: string, nickName: string }[],
        callBack?: Function
    }) {
        this.m_isInvite.selectedIndex = _info.type == 'invit' ? 1 : 0;
        this.m_avatar.url = _info.info[0].avatar;
        this.m_tipsTxt.setVar('name', _info.info[0].nickName).flushVars();
        this.callBackFun = _info.callBack;
    }
    public OnShow(): void {
        console.log("OnShow~~~");
    }

    public OnHide(): void {

        this.callBackFun && this.callBackFun();
        console.log("OnHide~~~");
        Laya.stage.offAllCaller(this);
        Laya.timer.clearAll(this);
    }
}
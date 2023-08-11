/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import UI_GetReward from './Task/UI_GetReward';
import ModuleWindow from "../ModuleWindow";
import { TaskAwardInfo } from './TaskLogic';
import ModulePackage from '../ModulePackage';
import { ModuleAudio } from '../ModuleTool';

export default class uiGetReward extends UI_GetReward {

    private static awardInfo: TaskAwardInfo[] = [];
    static Show(_award: TaskAwardInfo[]) {
        this.awardInfo = _award;
        ModulePackage.Instance.PopWindow("Task", "GetReward");
    }

    private _winHandler: ModuleWindow;


    protected onConstruct(): void {

        super.onConstruct();
        this.m_okBtn.onClick(this, () => {
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
            this.SetInfo()

        }
        // this.OnShow();
    }
    SetInfo() {
        this.m_count.selectedIndex = uiGetReward.awardInfo.length == 1 ? 1 : 0;
        // console.error('uiGetReward selectedIndex', this.m_count.selectedIndex);
        let _comArr = [this.m_rewardCom1, this.m_rewardCom2];
        //icon的资源
        const iconUrl = {
            times: 'ui://czp63sggqqee17',
            wmScore: 'ui://czp63sggqqee16',
        }
        for (let index = 0; index < uiGetReward.awardInfo.length; index++) {
            const element = uiGetReward.awardInfo[index];
            _comArr[index].m_rewardTxt.text = 'x' + element.value;
            let _url = iconUrl[element.type];
            if (_url) {
                _comArr[index].m_rewardLoader.url = _url;
            }


        }
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
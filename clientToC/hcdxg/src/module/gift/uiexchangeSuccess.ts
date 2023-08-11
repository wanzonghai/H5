

import GiftInfo from './uiGiftInfo';
import UI_exchangeSuccess from './gift/UI_exchangeSuccess';
import { ModuleAudio, ModuleTool } from './../ModuleTool';
import uiGiftInfo from './uiGiftInfo';

export interface ExchangeSuccessInfo {
    // type: number,//类型（唯一）
    id: string,//商品id
    title: string,
    url: string,
}

export default class uiexchangeSuccess extends UI_exchangeSuccess {



    m_info: uiGiftInfo;


    onConstruct() {
        super.onConstruct();
        this.clickBtn();
    }
    Show() {

        this.listenText();
        this.visible = true;
        this.m_bg.visible = false;
        ModuleTool.ActionPopIn(this, () => {
            this.m_bg.visible = true;
        });
    }
    Hide() {
        this.visible = false;
        this.onEnd();
    }

    onEnd() {
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
    }
    close(_callBack?: Function) {
        if (!this.visible) {
            return;
        }
        this.m_bg.visible = false;
        ModuleTool.ActionPopOut(this, () => {
            _callBack && _callBack();
            this.Hide();
        })
    }
    clickBtn() {
        // //模块显示设置
        // {
        //     this.m_goBtn.visible = ModuleControl.EnableBag;
        // }
        //开始按钮
        this.m_closeBtn.onClick(this, () => {
            this.close();
            ModuleAudio.PlayComonBtnAudio();

        })
        this.m_goBtn.onClick(this, () => {
            this.close(() => {
                Laya.stage.event('gotoBag');
            });
            ModuleAudio.PlayComonBtnAudio();


        })

    }
    listenText() {
        // this.m_updateTime.text = '' + GameLogic.GetCurScore();
    }
    myInfo: ExchangeSuccessInfo
    SetInfo(_info: ExchangeSuccessInfo) {
        console.log('uiexchangeSuccess _info', _info);
        console.log('uiexchangeSuccess m_info', this.m_info);
        this.myInfo = _info;
        this.m_info.SetInfo(_info.title, _info.url);
        this.Show();

    }



}
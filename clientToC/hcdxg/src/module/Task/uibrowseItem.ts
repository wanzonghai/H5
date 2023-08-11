/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
import { GoodsInfoType } from '../ModuleGlobal';
import { ModulePlatformAPI } from '../ModulePlatformAPI';
import { ModuleStatistics } from '../ModuleStatistics';
import { ModuleAudio } from '../ModuleTool';
import UI_browseItem from './Task/UI_browseItem';

export default class uibrowseItem extends UI_browseItem {



    onConstruct() {
        super.onConstruct();
        this.m_browseBtn.onClick(this, () => {
            this.selectCallBack && this.selectCallBack(this.myGoodInfo.goodsId);
            ModuleAudio.PlayComonBtnAudio();
            ModuleStatistics.TaskExposure('browse', '' + this.myGoodInfo.goodsId, '' + this.myGoodInfo.goodsName, '' + this.myGoodInfo.price);
        })
    }


    myGoodInfo: GoodsInfoType;
    private selectCallBack?: (_goodsId: number) => void;
    SetInfo(_info: GoodsInfoType, _selectCallBack?: (_goodsId: number) => void) {
        this.myGoodInfo = _info;
        this.selectCallBack = _selectCallBack;
        this.m_goodsImg.url = '' + _info.pic;
        this.m_content.text = '' + _info.goodsName;
        // this.m_priceTxt.text = '价值：' + _info.price;
        this.m_priceTxt.text = '￥' + _info.price;
        // this.m_priceTxt.visible = false;

    }
    clearAll() {
        Laya.stage.offAllCaller(this);
        Laya.timer.clearAll(this);
    }

}
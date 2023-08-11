/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
import { GoodsInfoType } from '../ModuleGlobal';
import { ModulePlatformAPI } from '../ModulePlatformAPI';
import { ModuleStatistics } from '../ModuleStatistics';
import { ModuleAudio } from '../ModuleTool';
import UI_collectItem from './Task/UI_collectItem';

export default class uicollectItem extends UI_collectItem {

    onConstruct() {
        super.onConstruct();
        this.m_collectBtn.onClick(this, () => {
            console.error('m_collectBtn ', this.myGoodInfo.goodsId);

            this.selectCallBack && this.selectCallBack(this.myGoodInfo.goodsId);
            ModuleAudio.PlayComonBtnAudio();
            ModuleStatistics.TaskExposure('collect', '' + this.myGoodInfo.goodsId, '' + this.myGoodInfo.goodsName, '' + this.myGoodInfo.price);
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
        // this.m_priceTxt.visible = false;
        this.m_priceTxt.text = '￥' + _info.price;
        this.m_isCollected.setSelectedPage(_info.isCollected ? '已收藏' : '未收藏');

        //更改收藏状态
        ModulePlatformAPI.CheckGoodsCollectedStatus(_info.goodsId, (_iscollect) => {
            if (_iscollect != _info.isCollected) {
                //收藏状态不一致(一般不会执行这里)
                this.m_isCollected.setSelectedPage(_iscollect ? '已收藏' : '未收藏');
                console.error('收藏状态不一致', _info.goodsId, _iscollect, _info.isCollected);
            }

        })
    }
    clearAll() {
        Laya.stage.offAllCaller(this);
        Laya.timer.clearAll(this);
    }

}
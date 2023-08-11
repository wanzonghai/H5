/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { GCurrencyType, GoodsInfoType } from '../ModuleGlobal';
import UI_buyItem from './Task/UI_buyItem';
import uiaward from './uiaward';
import { TaskInfo, TaskLogic, TaskType } from './TaskLogic';
import { ModuleAudio, ModuleTool } from './../ModuleTool';
import { ModuleStatistics } from '../ModuleStatistics';

export default class uibuyItem extends UI_buyItem {

    m_awardImg: uiaward;

    onConstruct() {
        super.onConstruct();
        this.m_buyBtn.onClick(this, () => {

            this.selectCallBack && this.selectCallBack(this.myGoodInfo.goodsId);
            ModuleAudio.PlayComonBtnAudio();
            ModuleStatistics.TaskExposure('buy', '' + this.myGoodInfo.goodsId, '' + this.myGoodInfo.goodsName, '' + this.myGoodInfo.price);
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

        let _countAward = (_mult: number) => {
            //根据倍数计算真实奖励值(向上取整)
            let _n = Math.ceil(_mult * ModuleTool.ChangeToNumber(_info.price));
            // if (_n < 1) {
            //     _n = 1;
            // }
            return _n;
        }
        let _award = {
            coinN: _countAward(TaskLogic.GetTaskAwardValue(TaskType.spend, GCurrencyType.times)),
            scoreN: _countAward(TaskLogic.GetTaskAwardValue(TaskType.spend, GCurrencyType.wmScore)),
        }

        this.m_awardImg.SetInfo(_award);
    }
    clearAll() {
        Laya.stage.offAllCaller(this);
        Laya.timer.clearAll(this);
    }

}
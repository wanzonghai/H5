

import uiAlert from '../GeneralInterface/uiAlert';
import { ModuleGlobal } from '../ModuleGlobal';
import { ModuleAudio } from '../ModuleTool';
import UI_GiftItem from './gift/UI_GiftItem';
import uiGiftInfo from './uiGiftInfo';

export interface GiftItemInfo {
    // exchangeConfig: any,//商品兑换限制 配置
    price: number,//兑换价格
    // total: number,//B端最早配置的库存数
    leftN: number,//剩余库存数
    // name: "goods" | "coupon",//奖品种类（"goods": 真实商品  “coupon”: 优惠券）
    // type: number,//奖品级别（唯一）（对应1，2，3等奖。。。）
    pic_url: string,//商品url链接
    title: string,//商品名字
    num_iid: string,//商品id
    getN: number,//已获得数量
    limitN: number,//可兑换限制数量
}

export default class uiGiftItem extends UI_GiftItem {

    myInfo: GiftItemInfo = null as any;


    m_info: uiGiftInfo;

    //组件声明周期开始
    onConstruct() {
        super.onConstruct();

        this.clickBtn();
        this.listenText();
    }
    //组件生命周期结束
    removeFromParent() {
        this.onEnd();
        super.removeFromParent();
    }


    onEnd() {
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
    }
    SetInfo(_info: GiftItemInfo) {
        this.myInfo = _info;
        this.ChangeLeft(0, _info.leftN);
        this.visible = true;
        this.m_info.SetInfo(_info.title, _info.pic_url);
        this.m_exchangeBtn.title = '' + _info.price;
        // this.m_needScoreNText.text = '' + _info.price;
        Laya.stage.on('GiftItemsubLeft' + _info.num_iid, this, () => {
            this.ChangeLeft(-1);
        })

    }
    clickBtn() {
        //开始按钮
        this.m_exchangeBtn.onClick(this, () => {
            ModuleAudio.PlayComonBtnAudio();
            console.log('exchangeBtn');
            if(uiAlert.AutoShowActivityState()){
                return;
            }
            // if(ModuleGlobal.ActivityState =='off'){
            //     uiAlert.Show({content:"活动已下线,下次再来吧~"});
            //     return;
            // }
            let _itemData = {
                id: this.myInfo.num_iid,
                // type: this.myInfo.type,
                title: this.myInfo.title,
                url: this.myInfo.pic_url,
                price: this.myInfo.price,
            };

            Laya.stage.event('exchangePopup', _itemData)
        })
    }
    listenText() {
        // this.m_updateTime.text = '' + GameLogic.GetCurScore();
    }
    //修改剩余数量
    ChangeLeft(_add: number, _set?: number) {
        if (!this.myInfo) {
            console.error('未初始化数据信息-myInfo');
            return;
        }

        if (_set != undefined) {
            this.myInfo.leftN = _set;
        }
        else {
            this.myInfo.leftN += _add;
            this.myInfo.getN -= _add;
        }
        this.m_leftNText.setVar('count', '' + this.myInfo.leftN).flushVars();
        // this.m_leftNText.text = '' + this.myInfo.leftN;
        let _haveLeft = this.myInfo.leftN > 0;
        let _canget = this.myInfo.limitN <= 0 || this.myInfo.getN < this.myInfo.limitN;
        this.m_exchangeHint2.visible = !_haveLeft;
        this.m_exchangeHint1.visible = _haveLeft && !_canget;
        this.m_exchangeBtn.enabled = _haveLeft && _canget;

    }



}
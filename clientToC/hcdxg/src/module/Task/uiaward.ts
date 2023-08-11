/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
import UI_award from './Task/UI_award';

interface buyAwardInfoType {
    coinN: number,
    scoreN: number
}

export default class uiaward extends UI_award {

    // myInfo: buyAwardInfoType;
    // private selectCallBack?: (_goodsId: string) => void;
    SetInfo(_info: buyAwardInfoType) {

        this.m_awardCount.text = '' + _info.coinN;
        this.m_scoreawardCount.text = '' + _info.scoreN;
    }
}
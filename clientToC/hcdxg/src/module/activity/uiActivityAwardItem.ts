
import UI_ActivityAwardItem from './activity/UI_ActivityAwardItem';


export interface ActivityAwardItemInfo {
    price: number,//价格
    rankNums: number[],//排名范围
    pic_url: string,
    title: string
    // delay: number//延迟显示时间
}

export default class uiActivityAwardItem extends UI_ActivityAwardItem {

    myInfo: ActivityAwardItemInfo = null as any;

    onStart() {
        this.clickBtn();
        this.listenText();
    }

    onShow() {
        this.onStart();
    }
    onHide() {
        this.onEnd();
    }

    onEnd() {
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
    }
    Show() {
        this.visible = true;
        this.onShow();
    }
    Hide() {
        this.visible = false;
        this.onHide();
    }
    SetInfo(_info: ActivityAwardItemInfo) {
        this.myInfo = _info;
        //名次
        let _rankt = '';
        if (_info.rankNums.length > 0) {
            if (_info.rankNums.length == 2) {

                _rankt = `${_info.rankNums[0]}-${_info.rankNums[1]}`;

            }
            else {
                _rankt = '' + _info.rankNums[0];
            }
        }

        this.m_rankText.setVar('count', _rankt).flushVars();
        //信息
        if (_info.title) {
            this.m_infoText.text = _info.title;
        }
        // console.error('_info.price', _info.price);

        //价格
        if (typeof _info.price == 'number') {
            this.m_priceText.text = `价值：${_info.price}元`;
        }
        else {
            this.m_priceText.text = '' + _info.price;
        }



        //图片
        if (!_info.pic_url || _info.pic_url == '' || _info.pic_url.indexOf('http') < 0) {
            this.m_imageLoader.url = 'ui://vzezwp8fpraz11';
        }
        else {
            this.m_imageLoader.url = '' + _info.pic_url;
        }

        // this.Show();

    }
    RunMoveinAction(_t: number) {
        this.x = this.width;
        this.Show();
        Laya.Tween.to(this, { x: 0 }, _t);
    }
    clickBtn() {
        // //开始按钮
        // this.m_exchangeBtn.onClick(this, () => {
        //     HHAudio.PlayEffect('btn');
        // })
    }
    listenText() {
        // this.m_updateTime.text = '' + GameLogic.GetCurScore();
    }



}
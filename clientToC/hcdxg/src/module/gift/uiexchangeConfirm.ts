

import { FailType } from './uiexchangeFail';
import uiGiftInfo from './uiGiftInfo';
import UI_exchangeConfirm from './gift/UI_exchangeConfirm';
import { ModuleAudio, ModuleTool } from './../ModuleTool';
import ModuleWindow from './../ModuleWindow';
import ModulePackage from '../ModulePackage';
import { GCurrencyType, ModuleGlobal } from '../ModuleGlobal';

export interface ExchangeConfirmInfo {
    // type: number,
    id: string,//商品id
    title: string,
    url: string,
    price: number,
}

export default class exchangeConfirm extends UI_exchangeConfirm {


    m_info: uiGiftInfo;

    onConstruct() {
        super.onConstruct();
        this.onStart();
    }
    removeFromParent() {
        this.onEnd();
        super.removeFromParent();
    }


    onStart() {

        this.clickBtn();
        this.listenText();


    }
    Show() {
        this.visible = true;
        this.m_bg.visible = false;
        ModuleTool.ActionPopIn(this, () => {
            this.m_bg.visible = true;
        });
    }
    Hide() {
        this.visible = false;
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
        //开始按钮
        this.m_closeBtn.onClick(this, () => {
            ModuleAudio.PlayComonBtnAudio();
            this.close();

        })
        this.m_exchangeBtn.onClick(this, () => {

            ModuleAudio.PlayComonBtnAudio();
            // console.error('m_exchangeBtn 未完成兑换数据接入');
            let _winHandler = (this.parent as any)._winHandler;
            if (_winHandler) {
                _winHandler.showModalWait();
            }
            // MyUtils.showLoading();
            this.ExchangeAward((_code: number) => {
                console.log('exchangeBtn', _code);
                if (_winHandler) {
                    _winHandler.closeModalWait();
                }
                // MyUtils.closeLoading();
                this.close(() => {
                    if (_code == 0) {
                        console.log('exchangeSuccess myInfo', this.myInfo);

                        Laya.stage.event('exchangeSuccess', this.myInfo);
                        // //MainUtil.analysis('exchange', { goodsId: this.myInfo.id, goodsName: this.myInfo.title, price: this.myInfo.price });
                    }
                    else {
                        //传入的失败码和提示失败类型的映射关系
                        const code2Type = [
                            [[-1, -2], [FailType.noData]],
                            [[-5], [FailType.noScore]],
                            [[-6], [FailType.noRepertory]],
                            [[-7], [FailType.noTime]],
                            [[98], [FailType.activityUnstart]],
                            [[99], [FailType.activityEnd]],
                        ]

                        let _failType = FailType.unKnow;
                        //获取映射到的失败类型
                        for (const info of code2Type) {
                            for (const code of info[0]) {
                                // console.log('查找映射', _code, code, info[1]);
                                if (code == _code) {
                                    _failType = info[1] as any;
                                    break;
                                }
                            }
                            if (_failType != FailType.unKnow) {
                                break;
                            }
                        }
                        Laya.stage.event('exchangeFail', _failType);
                    }
                });


            })
        })

    }
    listenText() {
        // this.m_updateTime.text = '' + GameLogic.GetCurScore();
    }
    private parentWinHandler?: ModuleWindow;
    myInfo: ExchangeConfirmInfo
    SetInfo(_info: ExchangeConfirmInfo, _parentWinHandler?: ModuleWindow) {
        console.log('exchangeConfirm SetInfo', _info);
        this.myInfo = _info;
        this.m_needScoreText.setVar("const",""+_info.price).flushVars();
        this.parentWinHandler = _parentWinHandler;
        this.m_info.SetInfo(_info.title, _info.url);
        this.Show();
    }

    /**
     * 积分兑换奖品
     * @param _type 商品类型
     * @param _callback  _code 0：成功 -5：积分不足 -6：库存不足 -7：兑换次数限制
     */
    ExchangeAward(_callback: (_code: number) => void) {


        if (Laya.Browser.onTBMiniGame) {
            this.parentWinHandler.showModalWait();
            let _closeModalWait = () => {
                Laya.timer.clear(this, _closeModalWait);
                this.parentWinHandler.closeModalWait();
            }
            Laya.timer.once(10000, this, _closeModalWait);
            //从服务端获取真实数据
            ModulePackage.Instance.SendNetMessage("", "/C/integral/swap", {
                Id: this.myInfo.id,
                number: 1,
                itemType: GCurrencyType.wmScore
            }, "post", this,
                (data) => {
                    _closeModalWait();
                    console.log("getTaskList", data);
                    if (data.code != 0) {
                        let _code = -5;
                        
                        if(data.code == 98 && data.code == 99){
                            _code = data.code;
                            ModuleGlobal.ChangeActivityState(data.code == 98 ? 'unstart' : 'off', data.msg);
                        }
                        _callback && _callback(_code);
                        return;
                    }
                    _callback && _callback(0);
                    ModuleGlobal.UpdateCurrency(GCurrencyType.wmScore);

                });
            // let reqData = {
            //     activeId: TB._activeId,
            //     type: _type
            // }
            // let info = { "id": Global.MSG_SCORE_EXHANGE, "data": reqData };
            // TB.sendMsg(info, (buf) => {
            //     if (buf.code == 0) {
            //         console.log('7002兑换成功', buf.data);
            //         PlayDataUtil.setData('point', buf.data.point);
            //         Laya.stage.event("updateValue");
            //         // this.ChangeScore(0, buf.data.point);
            //         // MainUtil.sendChangePoint();
            //     } else {
            //         console.error('7002兑换失败', buf.message);
            //     }
            //     _callback(buf.code);
            // });
        } else {
            _callback(0);
        }

    }



}
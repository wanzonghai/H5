import UI_exchangeFail from "./gift/UI_exchangeFail";
import { ModuleAudio, ModuleTool } from './../ModuleTool';


//失败的类型
export enum FailType {
    unKnow,//未知原因
    noData,//数据查询失败
    noScore,//积分不足
    noRepertory,//库存不足
    noTime,//兑换已达上限
    activityEnd,//活动结束
    activityUnstart,//活动未开始
}
//失败的文字描述
const failText = [
    '兑换失败',//未知原因
    '数据查询失败',
    '积分不足',
    '库存不足',
    '兑换已达上限',
    '活动已结束',
    '活动未开始',
];
export default class uiexchangeFail extends UI_exchangeFail {


    onConstruct() {
        super.onConstruct();
        this.clickBtn();
        this.listenText();
    }
    removeFromParent() {
        this.onEnd();
        super.removeFromParent();
    }
    Show() {
        this.visible = true;
        this.m_bg.visible = false;
        ModuleTool.ActionPopIn(this, () => {
            this.m_bg.visible = true;
        });
    }

    onEnd() {
        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
    }
    Hide() {
        if (!this.visible) {
            return;
        }
        this.m_bg.visible = false;
        ModuleTool.ActionPopOut(this, () => {
            this.visible = false;

        })
    }
    clickBtn() {
        let _closeBtn = () => {
            this.Hide();
            ModuleAudio.PlayComonBtnAudio();
        }
        //开始按钮
        this.m_closeBtn.onClick(this, _closeBtn)
        this.m_okBtn.onClick(this, _closeBtn)

    }
    listenText() {
        // this.m_updateTime.text = '' + GameLogic.GetCurScore();
    }
    SetInfo(_type: FailType) {

        if (_type >= failText.length) {
            console.error('[exchangeFail]没有此提示文本', _type);
            return;
        }
        console.log('exchangeFail SetInfo', _type, failText[_type]);

        this.m_failText.text = failText[_type];
        this.Show();
    }



}
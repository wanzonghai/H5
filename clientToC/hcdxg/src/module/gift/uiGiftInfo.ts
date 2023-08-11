
import UI_GiftInfo from './gift/UI_GiftInfo';
import { ModuleTool } from './../ModuleTool';


export default class uiGiftInfo extends UI_GiftInfo {

    SetInfo(_title: string, _url: string) {
        // this.element.describText.text = _title;
        this.m_describText.text = ModuleTool.getCutString(_title, 18);
        this.m_imageLoader.url = _url;
        // this.Show();
        this.visible = true;
    }



}
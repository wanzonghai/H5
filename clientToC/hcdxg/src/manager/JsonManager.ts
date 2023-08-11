/**
 * 事件管理 on off event
 */
export default class JsonManager{
    static _data = {};
	constructor() {
    }

    static getData(name: string){
        return this._data[name];
    }
    
    static addJson(name: string,data: any){
        this._data[name] = data;
    }
}
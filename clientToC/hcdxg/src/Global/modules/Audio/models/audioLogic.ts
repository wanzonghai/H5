export default class audioLogic {

    private storeName = "hhAudio"
    private backMusicID: string | null = null;
    AudioState = [true, true];

    private static instance: audioLogic | null = null;
    public static getInstance(): audioLogic {
        if (!this.instance) {
            this.instance = new audioLogic();
        }
        return this.instance;
    }
    init() {
        //获取声音状态(本地存储)
        for (let i = 0; i < 2; i++) {
            this.readAudioState(i);
        }
    }
    //0为背景音乐，1为音效
    readAudioState(_kind: number) {
        let _open = 1;
        let _v = Laya.LocalStorage.getItem(this.storeName + _kind.toString());
        if (_v) {
            _open = parseInt(_v);
        }
        if (0 == _open) {
            this.AudioState[_kind] = false;
        }
        else {
            this.AudioState[_kind] = true;
        }

    }
    //0为背景音乐，1为音效
    storeAudioState(_kind: number) {
        let _open = 1;
        if (!this.AudioState[_kind]) {
            _open = 0;
        }
        Laya.LocalStorage.setItem(this.storeName + _kind.toString(), '' + _open);
    }
    //设置和获取背景音乐id
    GetMusicID(): string | null {
        return this.backMusicID;
    }
    SetMusicID(_id: string): boolean {
        if (_id == this.backMusicID) {
            return false;
        }
        this.backMusicID = _id;
        return true;
    }
    //更改音乐状态，_state不填时默认更改为另一个状态，返回是否更改了状态
    ChangeAudioState(_kind: number, _state: boolean | undefined = undefined): boolean {
        if (undefined == _state) {
            _state = !this.AudioState[_kind];
        }
        if (_state == this.AudioState[_kind]) {
            return false;
        }
        this.AudioState[_kind] = _state;
        this.storeAudioState(_kind);
        return true;
    }
}
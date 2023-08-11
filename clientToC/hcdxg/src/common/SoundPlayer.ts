import PlayDataUtil from '../data/PlayDataUtil';
import { Global } from '../config/Global';
import { AudioCDNPath, AudioPath } from '../Global/AudioConfig';
declare var my;

// var Sound = {
//     bg: "sound/bg.mp3",
//     bad: "sound/bad.mp3",
//     bomb: "sound/bomb.mp3",
//     happy: "sound/happy.mp3",
//     jump: "sound/jump.mp3",
//     lose: "sound/lose.mp3",
//     over: "sound/over.mp3",
//     restTime: "sound/restTime.mp3",
//     win: "sound/win.mp3",
//     click: "sound/click.mp3",
//     hallBg: "sound/hallBg.mp3",
// }

class SoundPlayer {

    public static _instance: SoundPlayer = null;
    public static getInstance(): SoundPlayer {
        this._instance = this._instance || new SoundPlayer();
        return this._instance;
    }

    _musicRes: any = {};
    _effectRes: any = {};
    isMusic: boolean = true;
    isEffect: boolean = true;

    _isPlay: boolean = true;
    _isPause: boolean = false;   //是否暂停

    public init() {
        if (PlayDataUtil.data.musicState == 0) {
            // Laya.SoundManager.setMusicVolume(1);
            this.isMusic = true;
        }
        else {
            // Laya.SoundManager.setMusicVolume(0);
            this.isMusic = false;
        }
        if (PlayDataUtil.data.effectState == 0) {
            // Laya.SoundManager.setSoundVolume(1);
            this.isEffect = true;
        }
        else {
            // Laya.SoundManager.setSoundVolume(0);
            this.isEffect = false;
        }
        console.log("SoundPlayer init: ", this.isMusic, this.isEffect);
    }

    // _dafaultMusicPath: string = "hallBg";
    // _curMusicPath: string = "";
    // public playBgMusic(path,isResume?: boolean){
    //     console.log("playBgMusic=====",path,this.isMusic);
    //     // path = "bg";
    //     if(!this.isMusic) return;
    //     if(Laya.Browser.onTBMiniGame){
    //         //先暂停 其他音乐
    //         // if(this._curMusicPath != "" && this._curMusicPath != path){
    //         //     this.stopMusic();
    //         // }
    //         // if(this._curMusicPath == path) return;

    //         if(this._curMusicPath != path){
    //             if(this._musicRes[this._curMusicPath]){
    //                 this._musicRes[this._curMusicPath].stop();
    //             }
    //         }
    //         this._curMusicPath = path;
    //         this._dafaultMusicPath = path;
    //         //清理 当前音乐
    //         if(this._musicRes[path]){
    //             console.log("清理当前 背景音乐");
    //             this._musicRes[path].destroy();
    //             this._musicRes[path] = null;
    //         }
    //         console.log("创建新背景音乐");
    //         const innerAudioContext = this.createTBMusic(path);
    //         innerAudioContext.play();
    //         innerAudioContext.onEnded(() =>{
    //             console.log('====背景音乐  播放结束===',this._curMusicPath)
    //             // this.clearMusic();
    //             this.clearEffect();
    //             this._curMusicPath = "";
    //             this.resumeMusic();
    //         })
    //         innerAudioContext.onPlay(() =>{
    //             console.log("音乐加载成功，可以播放了");
    //             console.log("PlayDataUtil.data.musicState = ", PlayDataUtil.data.musicState);
    //             if(PlayDataUtil.data.musicState == 1){ //音乐已经关闭了
    //                 innerAudioContext.stop();
    //             }
    //         })
    //         this._musicRes[path] = innerAudioContext;

    //     }else{
    //         console.log("播放音乐");
    //         Laya.SoundManager.playMusic(Sound[path],0);
    //     }
    //     // Laya.SoundManager.playMusic(Sound[path],0);
    // }

    // createTBMusic(path){
    //     const innerAudioContext = my.createInnerAudioContext();
    //     innerAudioContext.autoplay = false;
    //     innerAudioContext.loop = false;
    //     innerAudioContext.src = Global.hallConfig._cdn + Sound[path];
    //     return innerAudioContext;
    // }

    // public playEffect(path){
    //     console.log("playEffect: ",path);
    //     //触发 首次背景音乐
    //     this.firstResumeMusic();
    //     if(!this.isEffect) return;
    //     if(Laya.Browser.onTBMiniGame){
    //         if(Laya.Browser.onIOS){
    //             if(this._effectRes[path]){
    //                 console.log("111");
    //                 this._effectRes[path].play();
    //             }else{
    //                 console.log("222");
    //                 const innerAudioContext = my.createInnerAudioContext()
    //                 innerAudioContext.autoplay = true;
    //                 innerAudioContext.loop = false;
    //                 innerAudioContext.src = Global.hallConfig._cdn + Sound[path];
    //                 this._effectRes[path] = innerAudioContext;
    //             }
    //         }
    //         else{
    //             console.log("222");
    //             const innerAudioContext = my.createInnerAudioContext()
    //             innerAudioContext.autoplay = true;
    //             innerAudioContext.loop = false;
    //             innerAudioContext.src = Global.hallConfig._cdn + Sound[path];
    //             innerAudioContext.onEnded(()=>{
    //                 innerAudioContext.destroy();
    //             });
    //         }
    //     }else{
    //         Laya.SoundManager.playSound(Sound[path],1);
    //     }
    //     // Laya.SoundManager.playSound(Sound[path],1);
    // }

    // public stopMusic(path?: string){
    //     console.log("stopMusic: ",path);
    //     if(Laya.Browser.onTBMiniGame){
    //         this.isMusic = false;
    //         if(path){
    //             if(this._musicRes[path]){
    //                 this._musicRes[path].stop();
    //             }else{
    //                 return;
    //             }
    //         }else{
    //             //全部停止
    //             let keys = Object.keys(this._musicRes);
    //             for(let i = 0; i < keys.length; i++){
    //                 let key = keys[i];
    //                 if(this._musicRes[key]){
    //                     this._musicRes[key].stop();
    //                 }
    //             }
    //         }
    //     }else{
    //         this.isMusic = false;
    //         Laya.SoundManager.stopMusic();
    //     }
    //     // Laya.SoundManager.stopMusic();
    // }
    // _isFirstResume: boolean = true;
    // public firstResumeMusic(){
    //     return;
    //     console.log("firstResumeMusic: ",this._isFirstResume);
    //     if(!this._isFirstResume) return;
    //     this._isFirstResume = false;
    //     // if(this.isMusic){
    //     //     this.resumeMusic();
    //     // }
    //     this.resumeMusic(this.isMusic);
    // }

    // public resumeMusic(isBool = true){
    //     console.log("resumeMusic: ",isBool);
    //     if(isBool){
    //         this.isMusic = true;
    //         // Laya.SoundManager.setMusicVolume(1);
    //     }else{
    //         // Laya.SoundManager.setMusicVolume(0);
    //     }
    //     //设置界面 播放bg
    //     if(this._curMusicPath == "" || !this._curMusicPath){
    //         this._curMusicPath = this._dafaultMusicPath;

    //     }
    //     this.playBgMusic(this._curMusicPath);
    // }

    // public stopEffset(){
    //     this.isEffect = false;
    //     // Laya.SoundManager.setSoundVolume(0);
    // }

    // public resumeEffset(){
    //     this.isEffect = true;
    // }

    // public clearMusic(){
    //     console.log("clearMusic");
    //     for(let i in this._musicRes){
    //         console.log("i: ",i);
    //         if(this._musicRes[i]){
    //             this._musicRes[i].destroy();
    //             this._musicRes[i] = null;
    //         }
    //     }
    //     this._curMusicPath = "";
    // }

    // public clearEffect(){
    //     console.log("clearEffect");
    //     for(let i in this._effectRes){
    //         console.log("i: ",i);
    //         if(this._effectRes[i]){
    //             this._effectRes[i].destroy();
    //             this._effectRes[i] = null;
    //         }
    //     }
    // }

    /////////////////////////////////////////////////////////
    //播放声音
    openSound() {
        if (Laya.Browser.onTBMiniGame) {
            if (this.musicContext) {
                //this.musicContext.volume = 1;
                this._isPlay = true;
                this.musicContext.play();
            }
        }
        else {
            Laya.SoundManager.setSoundVolume(1);
            Laya.SoundManager.setMusicVolume(1);
        }
    }

    //停止声音
    closeSound() {
        if (Laya.Browser.onTBMiniGame) {
            if (this.musicContext) {
                //this.musicContext.volume = 0;
                this._isPlay = false;
                this.musicContext.stop();
            }
        }
        else {
            Laya.SoundManager.setSoundVolume(0);
            Laya.SoundManager.setMusicVolume(0);
        }
    }

    //暂停播放
    pauseSound() {
        this._isPause = true;
        if (Laya.Browser.onTBMiniGame) {
            if (this.musicContext) {
                this.musicContext.stop();
            }
        }
        else {
            Laya.SoundManager.setSoundVolume(0);
            Laya.SoundManager.setMusicVolume(0);
        }
    }

    //继续播放
    resumeSound() {
        this._isPause = false;
        if (Laya.Browser.onTBMiniGame) {
            if (this.musicContext && this._isPlay) {
                this.musicContext.play();
            }
        }
        else {
            Laya.SoundManager.setSoundVolume(1);
            Laya.SoundManager.setMusicVolume(1);
        }
    }

    //播放音乐
    musicContext = null;
    _curMusicPathStr = "";
    playMusic(path) {
        //音乐关闭，直接跳过
        if (PlayDataUtil.data.musicCtrl == 0) {
            return;
        }
        if (Laya.Browser.onTBMiniGame) {
            if (this.musicContext) {
                this.musicContext.stop();
                this.musicContext.destroy();
            }
            // this._curMusicPathStr = path;
            // this.musicContext = my.createInnerAudioContext()
            // this.musicContext.autoplay = true;
            // this.musicContext.loop = true;
            // this.musicContext.src = Global.hallConfig._cdn + path;
            // this.musicContext.onEnded(() => {
            //     if (this._isPlay && !this._isPause) {
            //         //console.log('====背景音乐  播放结束===',this._curMusicPathStr);
            //         this.playMusic(this._curMusicPathStr);
            //     }
            // });

            // if (PlayDataUtil.data.musicCtrl == 0) {
            //     this.musicContext.stop();
            //     //this.musicContext.volume = 0;
            // }
        }
        else {
            Laya.loader.load(path, Laya.Handler.create(this, () => {
                Laya.SoundManager.playMusic(path, 0);
            }), null, Laya.Loader.SOUND);
        }
    }
    private effectContext = {};
    preloadSound(path, isDXG = false) {
        //功能刚完成vivo版本暂时屏蔽
        // return;
        if (Laya.Browser.onTBMiniGame) {
            // if (path in this.effectContext) {
            //     console.log('已创建音效：', path);
            //     return this.effectContext[path];
            // }
            let _self = this;
            let _url = '';
            if (isDXG) {
                _url = path;
            }
            else {
                const soundBase = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/C_client/"
                _url = soundBase + path;
            }
            let effectContext = my.createInnerAudioContext()
            effectContext.autoplay = false;
            effectContext.loop = false;
            effectContext.src = _url;
            this.effectContext[path] = effectContext;

            effectContext.onSeeked((res) => {
                console.log('onSeeked', res)
            })
            effectContext.onSeeking((res) => {
                console.log('onSeeking', res)
            })
            effectContext.onSeeked((res) => {
                console.log('onSeeked', res)
            })
            effectContext.onCanPlay((res) => {
                console.log('onCanPlay', res)
            })
            effectContext.onPlay((res) => {
                console.log('开始播放', res);
                effectContext['isplaying'] = true;
            })
            effectContext.onError((res) => {
                _self.ResetSound();
                console.error('音效错误', path, res);
                effectContext.destroy();
                if (_self.effectContext[path]) {
                    delete _self.effectContext[path];
                }
            })
            effectContext.onStop((res) => {
                _self.ResetSound();
                console.log('====onStop===', res);
                effectContext['isplaying'] = false;
            })
            effectContext.onTimeUpdate((res) => {
                console.log('====onTimeUpdate===', res);
            })

            effectContext.onEnded((res) => {
                _self.ResetSound();
                console.log('====onEnded===', res);
                _self.effectContext[path]['isplaying'] = false;
                effectContext.stop();
                // effectContext.destroy();
                // effectContext = null;

                // if (PlayDataUtil.data.musicCtrl == 1 && this.musicContext) {
                //     //console.log('====音效播放结束,继续播放音乐===');
                //     this.musicContext.play();
                // }
            });
            console.log('初次创建音效：', path);
            return _self.effectContext[path];
        }
        return null;
    }
    // playEffect2(path, isDXG = false) {
    //     if (Laya.Browser.onTBMiniGame) {
    //         if (!this.effectContext[path]) {
    //             console.error('未加载的音效', path);
    //             return;
    //         }
    //         this.effectContext[path].play();
    //     }
    // }

    //播放音效
    playEffect(path, isDXG = false, _level = 0) {
        //功能刚完成vivo版本暂时屏蔽
        // return;
        // return;
        // if (Laya.Browser.onIOS) {
        //     return;
        // }
        //音乐关闭，直接跳过
        if (PlayDataUtil.data.musicCtrl == 0) {
            return;
        }

        let _url = '';
        if (isDXG) {
            _url = path;
        }
        else {
            const soundBase = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/C_client/"
            _url = soundBase + path;
        }
        // console.log('playEffect _url', _url);

        if (Laya.Browser.onTBMiniGame) {
            console.log('音效等级', _level, this.curLevel);
            if (_level < this.curLevel) {
                this.toResetSoundLevel();
                console.log('不播放低等级音效');
                return;
            }
            if (this.curSoundpath) {
                if (this.effectContext[this.curSoundpath] && this.effectContext[this.curSoundpath]['isplaying']) {
                    this.effectContext[this.curSoundpath].stop();
                    this.curSoundpath = null;
                }
            }
            if (!this.effectContext[path]) {
                this.preloadSound(path, isDXG);
            }
            if (this.effectContext[path]['isplaying']) {
                this.effectContext[path].stop();
            }
            this.curLevel = _level;
            this.effectContext[path].play();
            this.curSoundpath = path;
            // let effectContext = my.createInnerAudioContext()
            // effectContext.autoplay = true;
            // effectContext.loop = false;
            // effectContext.src = _url;

            // effectContext.onEnded(() => {
            //     //console.log('====音效播放结束===');
            //     effectContext.destroy();
            //     effectContext = null;

            //     if (PlayDataUtil.data.musicCtrl == 1 && this.musicContext) {
            //         //console.log('====音效播放结束,继续播放音乐===');
            //         this.musicContext.play();
            //     }
            // });
        }
        else {
            Laya.loader.load(_url, Laya.Handler.create(this, () => {
                Laya.SoundManager.playSound(_url, 1);
            }), null, Laya.Loader.SOUND);
        }
    }

    private curSoundpath = null as any;
    private curLevel = 0;
    // getCurSounsLevel() {
    //     return this.curLevel;
    // }
    ResetSound() {
        this.curSoundpath = null;
        this.curLevel = 0;
        this.stopResetSoundLevel();
    }
    private timeoutid = null as any;
    toResetSoundLevel() {
        this.stopResetSoundLevel();
        this.timeoutid = setTimeout(() => {
            this.ResetSound();
        }, 3000);
    }
    stopResetSoundLevel() {
        if (this.timeoutid) {
            clearTimeout(this.timeoutid);
            this.timeoutid = null;
        }
    }

}

export default SoundPlayer.getInstance();
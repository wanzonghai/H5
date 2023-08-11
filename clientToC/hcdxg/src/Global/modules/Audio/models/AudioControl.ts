// import Global from '../models/Global';
import SoundPlayer from '../../../../common/SoundPlayer';
import { AudioCDNPath, AudioLevel, AudioPath } from '../../../AudioConfig';
import HHAudio from '../HHAudio';
import audioLogic from './audioLogic';

declare var my;
export default class AudioControl {

    // audioClips: { [audioId: string]: (cc.AudioClip | string | null) } = {};
    // private audioIDs: { [audioId: string]: number } = {};
    private isMusicLoop = true;
    private isLoaded = false;
    private loadEnd = false;
    private loadEndPlayMusic: string | null = null;
    // private toPlayMusic = false;

    private static instance: AudioControl | null = null;
    public static getInstance(): AudioControl {
        if (!this.instance) {
            this.instance = new AudioControl();
        }
        return this.instance;
    }
    init() {
        this.isLoaded = false;
        this.loadEnd = false;
        this.loadEndPlayMusic = null;

        //音频自动跟随设备静音
        Laya.SoundManager.useAudioMusic = false;
        //切出游戏后，失去焦点，而失去焦点后，音频也会停止播放
        Laya.SoundManager.autoStopMusic = true;
        // setTimeout(this.LoadAudioClip, 1);
        // this.LoadAudioClip();
    }
    private loadingClip: string[] = [];
    async PreloadAudioClips(_clipsY: string[]) {
        console.error('未实现此功能', 'PreloadAudioClips');

        // let self = this;
        // let _name = 'audio';
        // let _clips: string[] = [];
        // _clipsY.forEach(element => {
        //     if ((element in self.audioClips) || this.loadingClip.indexOf(element) >= 0) {
        //         return;
        //     }
        //     _clips.push(element);
        //     this.loadingClip.push(element);
        // });
        // let _leftN = this.loadingClip.length;
        // if (_leftN <= 0) {
        //     return;
        // }
        // new Promise(async (rs: any) => {
        //     for (let index = 0; index < _clips.length; index++) {
        //         const element = _clips[index];
        //         // console.error('PreloadAudioClips element', element);

        //         cc.resources.load(`${_name}/${element}`, cc.AudioClip, function (err, prefab) {
        //             // console.log('loadRes', element);
        //             let _idx = self.loadingClip.indexOf(element);
        //             if (_idx > -1) {
        //                 self.loadingClip.splice(_idx, 1);
        //             }
        //             if (!err) {
        //                 self.audioClips[element] = prefab as any;
        //                 if (self.loadEndPlayMusic == element) {
        //                     self.playMusic(self.loadEndPlayMusic);
        //                 }
        //                 console.log('loadRes audioClip', element);
        //             }
        //             _leftN--;
        //             if (_leftN <= 0) {
        //                 // for (const key in self.audioClips) {
        //                 //     console.log('loadRes audioClips', key);
        //                 // }
        //                 rs();
        //                 // try {
        //                 //     rs();
        //                 // } catch (error) {
        //                 //     console.error('rs Error:' + error);

        //                 // }

        //             }


        //         });

        //     }
        // })
    }
    //经测试loadres加载资源必须在cocos的load结束之后才能正常加载
    async PreloadAllAudioClip() {
        if (this.isLoaded) {
            return;
        }
        if (AudioCDNPath || AudioCDNPath == '') {
            return;
        }
        this.loadEnd = false;
        this.isLoaded = true;
        // let _name = 'audio';
        // let self = this;
        //通过文件路径加载资源
        new Promise((rs: any) => {
            let _paths: string[] = [];
            for (const key in AudioPath) {
                _paths.push(AudioCDNPath + AudioPath[key]);
            }
            Laya.loader.load(_paths, Laya.Handler.create(this, () => {
                this.loadEnd = true;
                this.isLoaded = false;
                rs();
                this.audioLoadEnd();
            }), null, Laya.Loader.SOUND);


            // var infos = cc.resources.getDirWithPath(_name, cc.AudioClip);
            // let urls = infos.map(function (info) {
            //     return info.path;
            // });
            // cc.resources.loadDir(_name, cc.AudioClip,
            //     function (completedCount: number, totalCount: number, item: any)//加载进度
            //     {
            //         if (completedCount == totalCount)//加载完成
            //         {
            //             // self.audioLoadEnd();
            //             console.log("load res : Complete!! ");
            //         }
            //     },
            //     function (err, assets: any) {
            //         if (err) {
            //             // cc.error(err);
            //             rs();
            //             return;
            //         }
            //         //解析文件名
            //         for (let index = 0; index < urls.length; index++) {
            //             const element = urls[index];
            //             //查分为数组
            //             let arrStr = element.split('/');
            //             //获取最后一个元素名字
            //             let _str = arrStr[arrStr.length - 1];
            //             //删除数组第一个元素，即'audio'
            //             arrStr.shift();
            //             //剩余元素拼接起来
            //             let pathName = arrStr.join('/');


            //             console.log("arrStr : " + element);
            //             self.audioClips[pathName] = (assets[index]);
            //             // if (null != self.audioClips[pathName])
            //             // {
            //             //     self.audioClips[pathName].constructor == string
            //             //     }
            //             let _clip = self.audioClips[pathName];
            //             if (null !== _clip && typeof _clip !== 'string') {
            //                 console.log("load res : " + pathName + ' ' + _clip.name);
            //             }
            //             //判断如果不是在根目录下加入路径寻址
            //             if (_str != pathName) {
            //                 if (self.audioClips[_str] == undefined) {
            //                     self.audioClips[_str] = pathName;
            //                 }
            //                 else if (null == self.audioClips[_str] || typeof self.audioClips[_str] === 'string') {
            //                     //重复的删除寻址
            //                     self.audioClips[_str] = null;
            //                 }

            //             }


            //         }
            //         // console.log("0: " + JSON.stringify(self.audioClips));

            //         // self.audioClips.
            //         for (var index in self.audioClips) {

            //             const element = self.audioClips[index];
            //             // console.log("0: " + element);
            //             if (!element) {
            //                 delete self.audioClips[index];
            //             }
            //         }
            //         // for (var index in self.audioClips) {

            //         //     const element = self.audioClips[index];
            //         //     console.log("1: " + element);
            //         // }
            //         // console.log("1: " + JSON.stringify(self.audioClips));
            //         self.loadEnd = true;
            //         self.audioLoadEnd();
            //         rs();
            //         // setTimeout(self.audioLoadEnd, 0.1);
            //     });
        })

    }

    audioLoadEnd() {
        // let _id = audioLogic.getInstance().GetMusicID();
        if (!this.loadEndPlayMusic) {
            return;
        }
        AudioControl.getInstance().playMusic(this.loadEndPlayMusic, this.isMusicLoop);

    }

    private playEffectDelayID = {};
    /** 播放音效 */
    async playEffect(audioId: string, loop: boolean = false, _palyIntervalTime = 0) {
        // // let _curTime = (new Date()).getTime();
        // // console.log('playEffect', audioId, AudioControl.getInstance().audioClips);

        // // if (!(audioId in AudioControl.getInstance().audioClips)) {
        // //     console.log("音效未加载完成，请稍等...", audioId);
        // //     this.PreloadAudioClips([audioId]);
        // // }
        // // try {
        // //     //音效加载重试1次并且不再播放
        // //     if (!(audioId in AudioControl.getInstance().audioClips)) {
        // //         await this.wait(500);
        // //         this.PreloadAudioClips([audioId]);
        // //         return;
        // //     }
        // //     // //加载用时>1秒不播放此音效
        // //     // if ((new Date()).getTime() - _curTime > 1000) {
        // //     //     return;
        // //     // }
        // //     if (audioLogic.getInstance().AudioState[1]) {
        // //         let _c = this.getClipByName(audioId);
        // //         this.audioIDs[audioId] = cc.audioEngine.playEffect(_c, loop);
        // //     }

        // // } catch (error) {
        // //     console.error(error);
        // // }
        // if (_palyIntervalTime) {
        //     if (this.playEffectDelayID[audioId]) {
        //         // console.error('playEffectDelayID', audioId);
        //         return;
        //     }
        //     this.playEffectDelayID[audioId] = setTimeout(() => {
        //         this.playEffectDelayID[audioId] = null as any;
        //     }, _palyIntervalTime);
        // }
        // HHAudio.PlayEffect('btn');
        // return;
        if (Laya.Browser.onTBMiniGame) {
            SoundPlayer.playEffect(AudioCDNPath + AudioPath[audioId], true,this.getAudioLevel(audioId));
            // if (my) {
            //     let effectContext = my.createInnerAudioContext()
            //     effectContext.autoplay = true;
            //     effectContext.loop = false;
            //     effectContext.src = AudioCDNPath + AudioPath[audioId];
            //     effectContext.onEnded(() => {
            //         console.log('====音效播放结束===');
            //         effectContext.destroy();
            //         effectContext = null;

            //         // if(PlayDataUtil.data.musicCtrl == 1){
            //         //     console.log('====音效播放结束,继续播放音乐===');
            //         //     this.musicContext.play();
            //         // }
            //     });
            // }
            // else {
            //     console.error('AudioContoller "my" 不存在');
            // }

        }
        else {
            Laya.SoundManager.playSound(AudioCDNPath + AudioPath[audioId], loop ? 0 : 1);
        }



    }

    getAudioLevel(audioId: string): number {
        return AudioLevel[audioId] || 0;
    }
    /** 播放音乐 */
    async playMusic(audioId: string, loop: boolean = true) {
        console.log('playMusic', audioId, loop);

        this.isMusicLoop = loop;
        // if (!(audioId in AudioControl.getInstance().audioClips)) {
        //     console.log("背景音乐未加载完成，请稍等...");
        //     this.loadEndPlayMusic = audioId;
        //     await this.PreloadAudioClips([audioId]);
        // }
        // try {
        //     if (!(audioId in AudioControl.getInstance().audioClips)) {
        //         return;
        //     }
        //     let _state = audioLogic.getInstance().AudioState[0];
        //     audioLogic.getInstance().SetMusicID(audioId)
        //     if (_state) {

        //         let _c = this.getClipByName(audioId);
        //         // console.error('playMusic', audioId, _c);
        //         cc.audioEngine.playMusic(_c, loop);
        //     }
        // } catch (error) {
        //     console.error(error);
        // }
        this.loadEndPlayMusic = audioId;
        audioLogic.getInstance().SetMusicID(audioId);
        Laya.SoundManager.playMusic(AudioCDNPath + AudioPath[audioId], loop ? 0 : 1);

    }

    //自动更换背景音乐播放状态
    autioChangeMusicState() {
        let _id = audioLogic.getInstance().GetMusicID();
        if (null == _id) {
            return;
        }
        let _state = audioLogic.getInstance().AudioState[0];
        if (_state) {
            this.playMusic(_id, this.isMusicLoop);
        }
        else {
            Laya.SoundManager.stopMusic();
        }
    }
    /**
     * 暂停声音
     * @param _audio 
     * 'ALL':暂停所有音效和背景音乐
     * 'BGMUSIC':暂停背景音乐
     * 'ALLEFFECT':暂停所有音效
     *  string[]: 暂停指定音效
     */
    PauseAudio(_audio: 'ALL' | 'BGMUSIC' | 'ALLEFFECT' | string[]) {
        console.error('laya没有此功能：[PauseAudio]');

        // if (_audio == 'ALL') {
        //     Laya.SoundManager.
        //     cc.audioEngine.pauseAll();
        // }
        // else if (_audio == 'BGMUSIC') {
        //     cc.audioEngine.pauseMusic();
        // }
        // else if (_audio == 'ALLEFFECT') {
        //     cc.audioEngine.pauseAllEffects();
        // }
        // else {
        //     _audio.forEach(element => {
        //         if (element in this.audioIDs) {
        //             cc.audioEngine.pauseEffect(this.audioIDs[element]);
        //         }
        //     });
        // }
    }

    /**
     * 继续播放声音
     * @param _audio 
     * 'ALL':继续所有音效和背景音乐
     * 'BGMUSIC':继续背景音乐
     * 'ALLEFFECT':继续所有音效
     *  string[]: 继续指定音效
     */
    ResumeAudio(_audio: 'ALL' | 'BGMUSIC' | 'ALLEFFECT' | string[]) {
        console.error('laya没有此功能：[ResumeAudio]');
        // if (_audio == 'ALL') {
        //     cc.audioEngine.resumeAll();
        // }
        // else if (_audio == 'BGMUSIC') {
        //     cc.audioEngine.resumeMusic();
        // }
        // else if (_audio == 'ALLEFFECT') {
        //     cc.audioEngine.resumeAllEffects();
        // }
        // else {
        //     _audio.forEach(element => {
        //         if (element in this.audioIDs) {
        //             cc.audioEngine.resumeEffect(this.audioIDs[element]);
        //         }
        //     });
        // }
    }
    /**
     * 停止播放声音
     * @param _audio 
     * 'ALL':停止所有音效和背景音乐
     * 'BGMUSIC':停止背景音乐
     * 'ALLEFFECT':停止所有音效
     *  string[]: 停止指定音效
     */
    StopAudio(_audio: 'ALL' | 'BGMUSIC' | 'ALLEFFECT' | string[]) {
        if (_audio == 'ALL') {
            Laya.SoundManager.stopAll();
            // cc.audioEngine.stopAll();
        }
        else if (_audio == 'BGMUSIC') {
            audioLogic.getInstance().SetMusicID('')
            Laya.SoundManager.stopMusic();
            // cc.audioEngine.stopMusic();
        }
        else if (_audio == 'ALLEFFECT') {
            // cc.audioEngine.stopAllEffects();
            Laya.SoundManager.stopAllSound();
        }
        else {
            _audio.forEach(element => {
                // if (element in this.audioIDs) {
                //     cc.audioEngine.stopEffect(this.audioIDs[element]);
                // }
                Laya.SoundManager.stopSound(AudioCDNPath + AudioPath[element]);
            });
        }
    }

    // private getClipByName(_name: string) {
    //     let clip = this.audioClips[_name];
    //     if (CC_DEV && !clip) {
    //         throw new Error('播放了不存在的声音: ' + _name);
    //     }
    //     //如果找到的是字符类型，则再次通过字符查找
    //     let _c = typeof clip === 'string' ? this.audioClips[clip] : clip;
    //     if (!_c || typeof _c == 'string') {
    //         throw new Error('播放声音格式错误: ' + _name + ' ' + (typeof _c));
    //     }
    //     return _c;
    // }
    private wait(ms: number) {
        return new Promise(rs => {
            setTimeout(rs, ms);
        })
    }

}

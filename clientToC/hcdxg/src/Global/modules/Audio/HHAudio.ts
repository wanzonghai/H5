
import audioLogic from './models/audioLogic';
import AudioControl from './models/AudioControl';
import { AudioCDNPath, AudioKey, AudioPath } from '../../AudioConfig';
import SoundPlayer from './../../../common/SoundPlayer';
/**
 * 声音管理模块
 * （被称为史上最强声音管理模块）
 * ------------------------------------------------ *
 * 用法：
 * 1.把所有声音文件放在 resources\audio 文件夹下
 * 如果没有自行创建
 * 2.调用 PreloadAudioClip 预加载音效（非必须）
 * 3.调用 PlayMusic 或 PlayEffect 播放
 * ------------------------------------------------ *
 * version: 2.1
 * 2019/12/25
 */
export default class HHAudio {
    private static audioL = audioLogic.getInstance();
    private static audioC = AudioControl.getInstance();

    /**
     * 预加载音乐(推荐使用)
     * 非必要方法,但是不使用预加载而直接播放可能导致第一次播放卡顿
     * @param _clips 'ALL'表示直接预加载全部audio中的音效
     */
    static PreloadAudioClip(_clips: 'ALL' | string[]) {
        HHAudio.audioL.init();
        HHAudio.audioC.init();
        if (Laya.Browser.onTBMiniGame) {
            for (const key in AudioPath) {
                SoundPlayer.preloadSound(AudioCDNPath + AudioPath[key], true);
            }

        } else 
        {
            HHAudio.audioC.PreloadAllAudioClip();
        }

        // if (_clips == 'ALL') {
        //     HHAudio.audioC.PreloadAllAudioClip();
        // }
        // else {
        //     HHAudio.audioC.PreloadAudioClips(_clips);
        // }
    }
    /**
     * 播放背景音乐
     * @param _audioid 音乐id(音乐文件名去掉后缀)
     * @param _loop 是否循环 默认循环
     */
    static PlayMusic(_audioid: AudioKey, _loop: boolean = true) {
        HHAudio.audioC.playMusic(_audioid, _loop);
    }

    /**
     * 播放音效
     * @param _audioid 音效id(音效文件名去掉后缀)
     * @param _loop 是否循环 默认不循环
     * @param _palyIntervalTime 播放间隔时间（间隔时间内不能播放此音效）
     */
    static PlayEffect(_audioid: AudioKey, _loop: boolean = false, _palyIntervalTime = 0) {
        HHAudio.audioC.playEffect(_audioid, _loop, _palyIntervalTime);
    }
    /**
     * 暂停声音
     * @param _audio 
     * 'ALL':暂停所有音效和背景音乐
     * 'BGMUSIC':暂停背景音乐
     * 'ALLEFFECT':暂停所有音效
     *  string[]: 暂停指定音效
     */
    static PauseAudio(_audio: 'ALL' | 'BGMUSIC' | 'ALLEFFECT' | AudioKey[]) {
        HHAudio.audioC.PauseAudio(_audio);
    }
    /**
     * 继续播放声音
     * @param _audio 
     * 'ALL':继续所有音效和背景音乐
     * 'BGMUSIC':继续背景音乐
     * 'ALLEFFECT':继续所有音效
     *  string[]: 继续指定音效
     */
    static ResumeAudio(_audio: 'ALL' | 'BGMUSIC' | 'ALLEFFECT' | AudioKey[]) {
        HHAudio.audioC.ResumeAudio(_audio);
    }
    /**
     * 停止播放声音
     * @param _audio 
     * 'ALL':停止所有音效和背景音乐
     * 'BGMUSIC':停止背景音乐
     * 'ALLEFFECT':停止所有音效
     *  string[]: 停止指定音效
     */
    static StopAudio(_audio: 'ALL' | 'BGMUSIC' | 'ALLEFFECT' | AudioKey[]) {
        HHAudio.audioC.StopAudio(_audio);
    }
    // static ShowAudioUI() {
    //     let _ui = AudioUI.GetInstance();
    //     if (!_ui) {
    //         console.log('can not find audioInstance');
    //         return;
    //     }
    //     _ui.show();
    // }
    static ChangeAudioState(_kind?: 'Music' | 'Effect') {
        let _state = this.GetAudioState(_kind);
        if (!_kind || _kind == 'Music') {
            HHAudio.audioC.autioChangeMusicState();
        }
        if (!_kind || _kind == 'Effect') {
            HHAudio.audioL.ChangeAudioState(1, !_state);
        }
        // console.log('ChangeAudioState', _state);


        return !_state;
    }
    static GetAudioState(_kind?: 'Music' | 'Effect') {
        let _i = _kind == 'Music' ? 0 : 1;
        return HHAudio.audioL.AudioState[_i];
    }

}
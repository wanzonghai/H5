(function () {
    'use strict';

    class EventManager extends Laya.EventDispatcher {
        constructor() {
            super();
        }
    }

    var LocalStorage = Laya.LocalStorage;
    class DataManager {
        constructor(defaultData, dataKey, hhKvTag) {
            this.isInited = false;
            this._changeHandlers = {};
            this._defaultData = defaultData;
            this._data = defaultData;
            this._dataKey = dataKey;
        }
        init() {
            if (this.isInited) {
                return;
            }
            let isNoKey = false;
            if (Laya.Browser.onTBMiniGame) {
                let data = my.getStorageSync({ key: this._dataKey });
                if (data && data["data"]) {
                    let keys = Object.keys(this._defaultData);
                    for (let i = 0; i < keys.length; i++) {
                        let key = keys[i];
                        if (data["data"][key] == undefined)
                            continue;
                        isNoKey = true;
                        this._data[key] = data["data"][key];
                    }
                }
                else {
                    this._data = this._defaultData;
                }
                if (isNoKey) {
                    my.setStorage({
                        key: this._dataKey,
                        data: this._data,
                        success: function () {
                        }
                    });
                }
            }
            else {
                let data = LocalStorage.getItem(this._dataKey);
                if (data) {
                    let keys = Object.keys(this._defaultData);
                    for (let i = 0; i < keys.length; i++) {
                        let key = keys[i];
                        if (JSON.parse(data)[key] == undefined)
                            continue;
                        isNoKey = true;
                        this._data[key] = JSON.parse(data)[key];
                    }
                }
                LocalStorage.setItem(this._dataKey, JSON.stringify(this._data));
            }
            this.isInited = true;
        }
        setData(key, value, isSave = true, isPush = false) {
            this._data[key] = value;
            if (isPush) {
                try {
                }
                catch (error) {
                    console.error('setData', error);
                }
            }
            if (isSave) {
                this.saveDataToStorage();
            }
            let listeners = this._changeHandlers[key];
            if (listeners) {
                listeners.forEach(v => {
                    v(value);
                });
            }
        }
        get data() {
            if (!this._data) {
                throw new Error('DataManager尚未初始化');
            }
            return this._data;
        }
        saveDataToStorage() {
            if (Laya.Browser.onTBMiniGame) {
                my.setStorage({
                    key: this._dataKey,
                    data: this._data,
                    success: function () {
                    }
                });
            }
            else {
                LocalStorage.setItem(this._dataKey, JSON.stringify(this._data));
            }
        }
        cleanData(options = {}) {
            this._data = this._defaultData;
            if (options.clearLocalStorage) {
                let keys = Object.keys(this._defaultData);
                keys.forEach(v => {
                    LocalStorage.removeItem(v);
                });
            }
        }
        listen(key, handler) {
            let listeners = this._changeHandlers[key];
            if (listeners) {
                if (listeners.indexOf(handler) > -1) {
                    return;
                }
            }
            else {
                listeners = this._changeHandlers[key] = [];
            }
            listeners.push(handler);
        }
        unlisten(key, handler) {
            if (!handler) {
                delete this._changeHandlers[key];
                return;
            }
            if (this._changeHandlers[key]) {
                delete this._changeHandlers[key];
            }
        }
        savePlayerData(playerData) {
            this.setData('userOpenId', playerData.userOpenId, false);
            this.setData('name', playerData.nickName, false);
            this.setData('avatar', playerData.headUrl, false);
            this.setData('coin', playerData.userCoin, false);
            this.setData('integral', playerData.integral, false);
            this.setData('lianshengCount', playerData.lianshengCount, false);
            this.setData('isVip', playerData.isVip, false);
            this.setData('isMember', playerData.isMember, false);
            this.setData('curSeason', playerData.curSeason, false);
            this.setData('point', playerData.point, false);
            this.setData('bestPoint', playerData.bestPoint, false);
            this.setData('bestRank', playerData.bestRank, false);
            this.setData('bestSeason', playerData.bestSeason, false);
            this.setData('bestWin', playerData.bestWin, false);
            this.setData('allWin', playerData.allWin, false);
            this.setData('rewardTimes_free', playerData.rewardTimes_free, false);
            this.setData('rewardTimes_challenge', playerData.rewardTimes_challenge, false);
            this.setData('rewardTimes_share', playerData.rewardTimes_share, false);
            this.setData('rewardTimes_live', playerData.rewardTimes_live, false);
            this.setData('rewardTimes_lookGoods', playerData.rewardTimes_lookGoods, false);
            this.setData('rewardTimes_member', playerData.rewardTimes_member, false);
            this.setData('rewardTimes_favor', playerData.rewardTimes_favor, false);
            this.setData('rewardTimes_kgold', playerData.rewardTimes_kgold, false);
            this.setData('rewardTimes_invitation', playerData.rewardTimes_invitation, false);
            this.setData('rewardTimes_buy', playerData.rewardTimes_buy, false);
            this.setData('rewardTimes_memberFree', playerData.rewardTimes_memberFree, false);
            this.setData('rewardTimes_collectGoods', playerData.rewardTimes_collectGoods, false);
            this.setData('rewardTimes_dayReward', playerData.rewardTimes_dayReward, false);
            this.setData('challenge', playerData.count_challenge, false);
            this.setData('share', playerData.count_share, false);
            this.setData('browse', playerData.count_look, false);
            this.setData('order', playerData.count_kgold, false);
            this.setData('invite', playerData.count_invitation, true);
        }
    }

    const defaultPlayData = {
        version: "1.0.0",
        coin: 0,
        level: 1,
        energy: 20,
        diamond: 0,
        point: 3,
        integral: 0,
        energyCache: 0,
        energyTime: 0,
        ranklist: [],
        rankDay: '2020-11-23',
        name: '玩家8573',
        avatar: 'hallRes/common/tx_player.png',
        userOpenId: "",
        openId: "",
        heroOldCoin: 0,
        isFirstEnter: 1,
        isReceivedEight: 0,
        isReceivedSix: 0,
        shareTime: 0,
        startGameTime: 0,
        openGameTime: 0,
        receiveCount: 0,
        lastReceiveTime: 0,
        allPlayCount: 0,
        isShowNotice: true,
        openSignTime: 0,
        signedTimesArray: [],
        tryRoleID: 0,
        myRoleIDArray: [0],
        curRoleID: 0,
        lianshengCount: 0,
        isPlayFirstAni: 0,
        heroFirstCount: 0,
        gameMode: 0,
        musicState: 0,
        effectState: 0,
        musicCtrl: 1,
        isMember: false,
        isVip: 0,
        vipMarkUp: 20,
        curSeason: 1,
        bestPoint: 0,
        bestRank: 0,
        bestSeason: 1,
        bestWin: 0,
        allWin: 0,
        rewardTimes_free: 0,
        rewardTimes_challenge: 0,
        rewardTimes_share: 0,
        rewardTimes_live: 0,
        rewardTimes_lookGoods: 0,
        rewardTimes_member: 0,
        rewardTimes_favor: 0,
        rewardTimes_kgold: 0,
        rewardTimes_invitation: 0,
        rewardTimes_buy: 0,
        rewardTimes_memberFree: 0,
        rewardTimes_collectGoods: 0,
        rewardTimes_dayReward: 0,
        buyTime: 0,
        buyLuckyTime: 0,
        browseTime: 0,
        taskDay: '',
        challenge: 0,
        share: 0,
        live: 0,
        browse: 0,
        shop: 0,
        order: 0,
        invite: 0,
        buy: 0,
        freeCache: 0,
        freeTime: 0,
        memberFreeCache: 0,
        memberFreeTime: 0,
        openGiftCache: 0,
        openGiftTime: 0,
        taskState: [],
        isVipControl: false,
        isVipSystem: false,
        isNewReward: false,
        collectIdArr: [],
        giftTargetCount: 2,
        giftCurCount: 0,
    };

    const PlayDataUtil = new DataManager(defaultPlayData, 'playData', '');
    window.PlayDataUtil = PlayDataUtil;

    class SoundPlayer {
        constructor() {
            this._musicRes = {};
            this._effectRes = {};
            this.isMusic = true;
            this.isEffect = true;
            this._isPlay = true;
            this._isPause = false;
            this.musicContext = null;
            this._curMusicPathStr = "";
            this.effectContext = {};
            this.curSoundpath = null;
            this.curLevel = 0;
            this.timeoutid = null;
        }
        static getInstance() {
            this._instance = this._instance || new SoundPlayer();
            return this._instance;
        }
        init() {
            if (PlayDataUtil.data.musicState == 0) {
                this.isMusic = true;
            }
            else {
                this.isMusic = false;
            }
            if (PlayDataUtil.data.effectState == 0) {
                this.isEffect = true;
            }
            else {
                this.isEffect = false;
            }
            console.log("SoundPlayer init: ", this.isMusic, this.isEffect);
        }
        openSound() {
            if (Laya.Browser.onTBMiniGame) {
                if (this.musicContext) {
                    this._isPlay = true;
                    this.musicContext.play();
                }
            }
            else {
                Laya.SoundManager.setSoundVolume(1);
                Laya.SoundManager.setMusicVolume(1);
            }
        }
        closeSound() {
            if (Laya.Browser.onTBMiniGame) {
                if (this.musicContext) {
                    this._isPlay = false;
                    this.musicContext.stop();
                }
            }
            else {
                Laya.SoundManager.setSoundVolume(0);
                Laya.SoundManager.setMusicVolume(0);
            }
        }
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
        playMusic(path) {
            if (PlayDataUtil.data.musicCtrl == 0) {
                return;
            }
            if (Laya.Browser.onTBMiniGame) {
                if (this.musicContext) {
                    this.musicContext.stop();
                    this.musicContext.destroy();
                }
            }
            else {
                Laya.loader.load(path, Laya.Handler.create(this, () => {
                    Laya.SoundManager.playMusic(path, 0);
                }), null, Laya.Loader.SOUND);
            }
        }
        preloadSound(path, isDXG = false) {
            if (Laya.Browser.onTBMiniGame) {
                let _self = this;
                let _url = '';
                if (isDXG) {
                    _url = path;
                }
                else {
                    const soundBase = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/C_client/";
                    _url = soundBase + path;
                }
                let effectContext = my.createInnerAudioContext();
                effectContext.autoplay = false;
                effectContext.loop = false;
                effectContext.src = _url;
                this.effectContext[path] = effectContext;
                effectContext.onSeeked((res) => {
                    console.log('onSeeked', res);
                });
                effectContext.onSeeking((res) => {
                    console.log('onSeeking', res);
                });
                effectContext.onSeeked((res) => {
                    console.log('onSeeked', res);
                });
                effectContext.onCanPlay((res) => {
                    console.log('onCanPlay', res);
                });
                effectContext.onPlay((res) => {
                    console.log('开始播放', res);
                    effectContext['isplaying'] = true;
                });
                effectContext.onError((res) => {
                    _self.ResetSound();
                    console.error('音效错误', path, res);
                    effectContext.destroy();
                    if (_self.effectContext[path]) {
                        delete _self.effectContext[path];
                    }
                });
                effectContext.onStop((res) => {
                    _self.ResetSound();
                    console.log('====onStop===', res);
                    effectContext['isplaying'] = false;
                });
                effectContext.onTimeUpdate((res) => {
                    console.log('====onTimeUpdate===', res);
                });
                effectContext.onEnded((res) => {
                    _self.ResetSound();
                    console.log('====onEnded===', res);
                    _self.effectContext[path]['isplaying'] = false;
                    effectContext.stop();
                });
                console.log('初次创建音效：', path);
                return _self.effectContext[path];
            }
            return null;
        }
        playEffect(path, isDXG = false, _level = 0) {
            if (PlayDataUtil.data.musicCtrl == 0) {
                return;
            }
            let _url = '';
            if (isDXG) {
                _url = path;
            }
            else {
                const soundBase = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/C_client/";
                _url = soundBase + path;
            }
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
            }
            else {
                Laya.loader.load(_url, Laya.Handler.create(this, () => {
                    Laya.SoundManager.playSound(_url, 1);
                }), null, Laya.Loader.SOUND);
            }
        }
        ResetSound() {
            this.curSoundpath = null;
            this.curLevel = 0;
            this.stopResetSoundLevel();
        }
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
    SoundPlayer._instance = null;
    var SoundPlayer$1 = SoundPlayer.getInstance();

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    var FGUIClassType;
    (function (FGUIClassType) {
        FGUIClassType[FGUIClassType["element"] = 0] = "element";
        FGUIClassType[FGUIClassType["scene"] = 1] = "scene";
        FGUIClassType[FGUIClassType["mount"] = 2] = "mount";
    })(FGUIClassType || (FGUIClassType = {}));
    class FGUIBase {
        constructor() {
            this.fguiType = FGUIClassType.element;
            this.element = {};
            this.elementPath = {};
            this.classType = {};
        }
        SetMain(_main) {
            this.main = _main;
        }
        Init(_main) {
            this.SetMain(_main);
            this.getElementsObj();
            if (this.main.visible) {
                this.main.visible = false;
                this.onStart();
                this.Show();
            }
        }
        getElementsObj() {
            let _eleKeys = Object.keys(this.element);
            for (const key of _eleKeys) {
                let _path = key;
                if (key in this.elementPath) {
                    _path = this.elementPath[key];
                }
                this.element[key] = this.main.getChildByPath(_path);
                if (!this.element[key]) {
                    console.error(`${this.constructor.name}:"${_path}"未找到,请确认路径正确！`);
                    continue;
                }
                if (this.classType[key]) {
                    let _comp = this.element[key].asCom;
                    if (!_comp) {
                        console.error(`"${key}"不是GComponent类型，不能挂载类！`);
                        continue;
                    }
                    let _class = this.element[key] = new (this.classType[key])();
                    _class.Init(_comp);
                }
            }
        }
        RemoveSelf() {
            for (const key in this.classType) {
                let _class = this.element[key];
                if (_class) {
                    _class.RemoveSelf();
                }
                this.element[key] = null;
            }
            this.Hide();
            this.onEnd();
            this.main.removeFromParent();
        }
        Show() {
            if (this.main.visible) {
                return;
            }
            this.main.visible = true;
            this.onShow();
        }
        Hide() {
            if (!this.main.visible) {
                return;
            }
            this.main.visible = false;
            this.onHide();
        }
        onStart() { }
        onEnd() { }
        onShow() { }
        onHide() { }
    }

    class FGUIMount extends fgui.GComponent {
        constructor() {
            super(...arguments);
            this.fguiType = FGUIClassType.mount;
            this.poolName = '';
            this.element = {};
            this.elementPath = {};
            this.classType = {};
            this.isStarted = false;
            this.forceShow = false;
        }
        onConstruct() {
            this.Init();
        }
        Init() {
            this.getElementsObj();
            Laya.timer.frameOnce(1, this, () => {
                if (this.visible) {
                    this.forceShow = true;
                    this.Show();
                }
            });
        }
        getElementsObj() {
            let _eleKeys = Object.keys(this.element);
            for (const key of _eleKeys) {
                let _path = key;
                if (key in this.elementPath) {
                    _path = this.elementPath[key];
                }
                this.element[key] = this.getChildByPath(_path);
                if (!this.element[key]) {
                    console.error(`${this.constructor.name}:"${_path}"未找到,请确认路径正确！`);
                    continue;
                }
                if (this.classType[key]) {
                    let _comp = this.element[key].asCom;
                    if (!_comp) {
                        console.error(`"${key}"不是GComponent类型，不能挂载类！`);
                        continue;
                    }
                    let _class = this.element[key] = new (this.classType[key])();
                    _class.Init(_comp);
                }
                else {
                }
            }
        }
        removeFromParent() {
            for (const key in this.classType) {
                let _class = this.element[key];
                if (_class) {
                    _class.RemoveSelf();
                }
                this.element[key] = null;
            }
            this.Hide();
            this.onEnd();
            super.removeFromParent();
        }
        Show() {
            if (this.visible && !this.forceShow) {
                return;
            }
            this.forceShow = false;
            this.visible = true;
            if (!this.isStarted) {
                this.onStart();
                this.isStarted = true;
            }
            this.onShow();
        }
        Hide() {
            if (!this.visible) {
                return;
            }
            this.visible = false;
            this.onHide();
        }
        onStart() { }
        onEnd() { }
        onShow() { }
        onHide() { }
    }

    const IsCDN = true;
    const FGUIConfig = {
        CDNBasePath: "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/normal/C_client/" + 'v16/',
        resBase: 'res/FGUI/',
        FileExtension: 'txt',
        Pakages: {
            GameCommon: { isCDN: IsCDN, ImageN: 2 },
            StartScene: { isCDN: IsCDN, ImageN: 1, aloneImages: ['StartScene_atlas_9ffy16.png'] },
            GameScene: { isCDN: IsCDN, ImageN: 2 },
        },
    };

    class FGUIUtil_C {
        constructor() {
            this.loadedPakages = [];
            this.isinit = false;
            this.curFGUI = null;
            this.freeScene = {};
        }
        static INS() {
            if (!this.instance) {
                this.instance = new FGUIUtil_C();
            }
            return this.instance;
        }
        Init() {
            if (this.isinit) {
                return;
            }
            fairygui.UIConfig.packageFileExtension = FGUIConfig.FileExtension;
            Laya.stage.addChild(fgui.GRoot.inst.displayObject);
            fgui.GRoot.inst.displayObject.zOrder = 2;
            this.loadedPakages = [];
            this.isinit = true;
        }
        PreLoadResouce(_pakageInfo = 'All', callBack) {
            return __awaiter(this, void 0, void 0, function* () {
                let _arr = this.getUnloadPkgs(_pakageInfo);
                if (_arr.length <= 0) {
                    return true;
                }
                return new Promise(rs => {
                    let _allresN = _arr.length;
                    let _result = true;
                    let _loaded = () => {
                        _allresN--;
                        if (_allresN <= 0) {
                            callBack && callBack();
                            rs(_result);
                        }
                    };
                    for (const _pkg of _arr) {
                        let _resArr = this.getPkgAllRes(_pkg);
                        Laya.loader.load(_resArr, Laya.Handler.create(this, (result, result2) => {
                            if (result) {
                                let _package = fgui.UIPackage.addPackage(this.getPackageBasePath(_pkg) + _pkg);
                                this.loadedPakages.push(_pkg);
                                console.log('[PreLoadResouce] ' + _pkg, '加载成功', _package);
                            }
                            else {
                                _result = false;
                                console.error('[PreLoadResouce] ' + _pkg, '加载失败');
                            }
                            _loaded();
                        }), Laya.Handler.create(this, (result, result2) => {
                        }, undefined, false));
                    }
                });
            });
        }
        loadPackage(_pakage, _caller, _callback) {
            return __awaiter(this, void 0, void 0, function* () {
                let _r = yield this.PreLoadResouce(_pakage);
                if (!_r) {
                    return _r;
                }
                fgui.UIPackage.loadPackage(this.getPackageBasePath(_pakage) + _pakage, Laya.Handler.create(_caller, _callback));
                return _r;
            });
        }
        ActionPopIn(_node, _endcallbacK) {
            _node.setScale(0.3, 0.3);
            Laya.Tween.to(_node, { scaleX: 1.15, scaleY: 1.15, }, 150, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(_node, { scaleX: 1, scaleY: 1 }, 400, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
                    _endcallbacK && _endcallbacK();
                }));
            }));
        }
        ActionPopOut(_node, _endcallbacK) {
            Laya.Tween.to(_node, { scaleX: 1.1, scaleY: 1.1, }, 200, Laya.Ease.linearOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(_node, { scaleX: 0, scaleY: 0 }, 200, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                    _endcallbacK && _endcallbacK();
                }));
            }));
        }
        ShowScene(_class, _callBack) {
            return __awaiter(this, void 0, void 0, function* () {
                this.Init();
                return new Promise((rs) => {
                    let _lastScene = this.curFGUI;
                    this.curFGUI = new _class();
                    if (!this.curFGUI.AddScene(() => {
                        this.CloseScene(_lastScene);
                        _callBack && _callBack(this.curFGUI);
                        rs && rs();
                    })) {
                        this.curFGUI = null;
                    }
                });
            });
        }
        ShowFreeScene(_class, _callBack) {
            let _soleKey = this.getFGUISceneSoloKey(_class);
            this.Init();
            let _freeScene = null;
            if (_soleKey in this.freeScene) {
                _freeScene = this.freeScene[_soleKey];
            }
            if (!_freeScene) {
                _freeScene = new _class();
            }
            if (!_freeScene.AddScene(() => {
                this.freeScene[_soleKey] = _freeScene;
                _callBack && _callBack(_freeScene);
            })) {
                this.curFGUI = null;
            }
            return _freeScene;
        }
        CloseScene(_fguiScene) {
            if (_fguiScene) {
                _fguiScene.RemoveSelf && _fguiScene.RemoveSelf();
                let _soleKey = this.getFGUISceneSoloKey(_fguiScene.constructor);
                if (_soleKey in this.freeScene) {
                    delete this.freeScene[_soleKey];
                }
            }
        }
        CreatePrefab(_parent, _pkgName, _compName, _class, _usePool = true) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise(rs => {
                    this.loadPackage(_pkgName, this, () => {
                        fgui.UIObjectFactory.setExtension(fgui.UIPackage.getItemURL(_pkgName, _compName), _class);
                        let _createFun = () => {
                            return fgui.UIPackage.createObject(_pkgName, _compName, _class);
                        };
                        let _main = null;
                        if (_usePool) {
                            let _poolName = _pkgName + _compName;
                            _main = Laya.Pool.getItemByCreateFun(_poolName, _createFun, this);
                            _main.poolName = _poolName;
                        }
                        else {
                            _main = _createFun();
                            _main.poolName = '';
                        }
                        _main.usePool = _usePool;
                        _main.addRelation(_parent, fgui.RelationType.Size);
                        _parent.addChild(_main);
                        rs(_main);
                    });
                });
            });
        }
        RecyclePrefab(_obj) {
            if (_obj.poolName != '') {
                Laya.Pool.recover(_obj.poolName, _obj);
            }
            _obj.removeFromParent();
        }
        getFGUISceneSoloKey(_sceneFunction) {
            let _str = _sceneFunction.toString();
            let _soleKey = '';
            const nameKs = ['pkgName', 'mainName'];
            for (const Key of nameKs) {
                let _idx = _str.indexOf(Key);
                if (_idx < 0) {
                    continue;
                }
                _soleKey += _str.slice(_idx, _idx + 30);
            }
            return _soleKey;
        }
        getPackageBasePath(_pakage) {
            let _pkg = FGUIConfig.Pakages[_pakage];
            let _path = (_pkg.isCDN ? FGUIConfig.CDNBasePath : '') + FGUIConfig.resBase;
            return _path;
        }
        getUnloadPkgs(_pakageInfo = 'All') {
            let _arr = [];
            if ('All' == _pakageInfo) {
                for (const key of Object.keys(FGUIConfig.Pakages)) {
                    if (this.loadedPakages.indexOf(key) < 0) {
                        _arr.push(key);
                    }
                }
            }
            else if (typeof _pakageInfo == 'string') {
                if (this.loadedPakages.indexOf(_pakageInfo) < 0) {
                    _arr.push(_pakageInfo);
                }
            }
            else {
                for (const key of _pakageInfo) {
                    if (this.loadedPakages.indexOf(key) < 0) {
                        _arr.push(key);
                    }
                }
            }
            return _arr;
        }
        getPkgAllRes(_pkg) {
            let _pkgInfo = FGUIConfig.Pakages[_pkg];
            let _path = this.getPackageBasePath(_pkg);
            let _resArr = [];
            _resArr.push({ url: _path + _pkg + '.' + FGUIConfig.FileExtension, type: Laya.Loader.BUFFER });
            if (_pkgInfo['ImageN']) {
                for (let index = 0; index < _pkgInfo['ImageN']; index++) {
                    let _extStr = '';
                    if (index > 0) {
                        _extStr = '_' + index;
                    }
                    _resArr.push({ url: _path + _pkg + `_atlas0${_extStr}.png`, type: Laya.Loader.IMAGE });
                }
            }
            let _aloneImages = _pkgInfo['aloneImages'];
            if (_aloneImages && _aloneImages.length > 0) {
                for (const imag of _aloneImages) {
                    _resArr.push({ url: _path + imag, type: Laya.Loader.IMAGE });
                }
            }
            return _resArr;
        }
    }
    FGUIUtil_C.instance = null;
    var FGUIUtil = FGUIUtil_C.INS();

    class GetScore extends FGUIMount {
        constructor() {
            super(...arguments);
            this.element = {
                getScoreLabel: null,
            };
        }
        static SetParent(_parent) {
            this.myParent = _parent;
        }
        static Create(_info) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.myParent) {
                    console.error('[Create]请先设置父节点');
                    return null;
                }
                let _obj = yield FGUIUtil.CreatePrefab(this.myParent, this.myPkg, this.myComp, GetScore);
                this.allObj.push(_obj);
                _obj.Show();
                _obj.init(_info);
                return _obj;
            });
        }
        static RemoveAll() {
            while (this.allObj.length > 0) {
                let _obj = this.allObj.pop();
                _obj && _obj.removeSelf();
            }
        }
        removeSelf() {
            try {
                this.visible = false;
                FGUIUtil.RecyclePrefab(this);
            }
            catch (error) {
            }
        }
        removeInAllObj() {
            let _idx = GetScore.allObj.findIndex(v => v.id == this.id);
            if (_idx > -1) {
                GetScore.allObj.splice(_idx, 1);
            }
        }
        init(_info) {
            this.curInfo = _info;
            this.touchable = false;
            this.setXY(_info.pos[0], _info.pos[1]);
            this.element.getScoreLabel.text = '' + _info.score;
            this.runMyAction();
        }
        onEnd() {
            Laya.Tween.clearAll(this);
            Laya.timer.clearAll(this);
        }
        runMyAction() {
            this.setScale(0, 0);
            this.alpha = 1;
            let _py = this.curInfo.pos[1] - 50;
            Laya.Tween.to(this, { scaleX: 1.1, scaleY: 1.1, y: _py }, 300, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                Laya.Tween.to(this, { scaleX: 0.9, scaleY: 0.9 }, 200, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                    Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 100, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                        Laya.Tween.to(this, { alpha: 0, y: _py - 200 }, 1000, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                            this.removeSelf();
                        }));
                    }));
                }));
            }));
            this.setScale(0, 0);
        }
    }
    GetScore.myPkg = 'GameScene';
    GetScore.myComp = 'GetScore';
    GetScore.myParent = null;
    GetScore.allObj = [];

    class audioLogic {
        constructor() {
            this.storeName = "hhAudio";
            this.backMusicID = null;
            this.AudioState = [true, true];
        }
        static getInstance() {
            if (!this.instance) {
                this.instance = new audioLogic();
            }
            return this.instance;
        }
        init() {
            for (let i = 0; i < 2; i++) {
                this.readAudioState(i);
            }
        }
        readAudioState(_kind) {
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
        storeAudioState(_kind) {
            let _open = 1;
            if (!this.AudioState[_kind]) {
                _open = 0;
            }
            Laya.LocalStorage.setItem(this.storeName + _kind.toString(), '' + _open);
        }
        GetMusicID() {
            return this.backMusicID;
        }
        SetMusicID(_id) {
            if (_id == this.backMusicID) {
                return false;
            }
            this.backMusicID = _id;
            return true;
        }
        ChangeAudioState(_kind, _state = undefined) {
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
    audioLogic.instance = null;

    let AudioPath = {
        btn: "Audio/btn.mp3",
        meet: "Audio/meet.mp3",
        meet2: "Audio/meet2.mp3",
        merge: "Audio/merge.mp3",
        merge2: "Audio/merge2.mp3",
        combo1: "Audio/combo1.mp3",
        combo2: "Audio/combo2.mp3",
        combo3: "Audio/combo3.mp3",
        combo4: "Audio/combo4.mp3",
        mergeNew: "Audio/mergeNew.mp3",
        gameOver: "Audio/gameOver.mp3",
        revive: "Audio/revive.mp3",
        mergeTop: "Audio/mergeTop.mp3",
        getCoupon: "Audio/getCoupon.mp3",
        getDoubleScore: "Audio/getDoubleScore.mp3",
        propClear: "Audio/propClear.mp3",
        propScore: "Audio/propScore.mp3",
        propSupperFruit: "Audio/propSupperFruit.mp3",
    };
    let AudioLevel = {
        btn: 1,
        meet: 2,
        meet2: 2,
        merge: 3,
        merge2: 3,
        combo1: 4,
        combo2: 5,
        combo3: 6,
        combo4: 7,
        mergeNew: 3,
        gameOver: 8,
        revive: 14,
        mergeTop: 13,
        getCoupon: 12,
        getDoubleScore: 15,
        propClear: 11,
        propScore: 11,
        propSupperFruit: 11,
    };
    let AudioCDNPath = 'https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/' + 'BigWatermelon/normal/C_client/';

    class AudioControl {
        constructor() {
            this.isMusicLoop = true;
            this.isLoaded = false;
            this.loadEnd = false;
            this.loadEndPlayMusic = null;
            this.loadingClip = [];
            this.playEffectDelayID = {};
        }
        static getInstance() {
            if (!this.instance) {
                this.instance = new AudioControl();
            }
            return this.instance;
        }
        init() {
            this.isLoaded = false;
            this.loadEnd = false;
            this.loadEndPlayMusic = null;
            Laya.SoundManager.useAudioMusic = false;
            Laya.SoundManager.autoStopMusic = true;
        }
        PreloadAudioClips(_clipsY) {
            return __awaiter(this, void 0, void 0, function* () {
                console.error('未实现此功能', 'PreloadAudioClips');
            });
        }
        PreloadAllAudioClip() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.isLoaded) {
                    return;
                }
                if (AudioCDNPath || AudioCDNPath == '') {
                    return;
                }
                this.loadEnd = false;
                this.isLoaded = true;
                new Promise((rs) => {
                    let _paths = [];
                    for (const key in AudioPath) {
                        _paths.push(AudioCDNPath + AudioPath[key]);
                    }
                    Laya.loader.load(_paths, Laya.Handler.create(this, () => {
                        this.loadEnd = true;
                        this.isLoaded = false;
                        rs();
                        this.audioLoadEnd();
                    }), null, Laya.Loader.SOUND);
                });
            });
        }
        audioLoadEnd() {
            if (!this.loadEndPlayMusic) {
                return;
            }
            AudioControl.getInstance().playMusic(this.loadEndPlayMusic, this.isMusicLoop);
        }
        playEffect(audioId, loop = false, _palyIntervalTime = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                if (Laya.Browser.onTBMiniGame) {
                    SoundPlayer$1.playEffect(AudioCDNPath + AudioPath[audioId], true, this.getAudioLevel(audioId));
                }
                else {
                    Laya.SoundManager.playSound(AudioCDNPath + AudioPath[audioId], loop ? 0 : 1);
                }
            });
        }
        getAudioLevel(audioId) {
            return AudioLevel[audioId] || 0;
        }
        playMusic(audioId, loop = true) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('playMusic', audioId, loop);
                this.isMusicLoop = loop;
                this.loadEndPlayMusic = audioId;
                audioLogic.getInstance().SetMusicID(audioId);
                Laya.SoundManager.playMusic(AudioCDNPath + AudioPath[audioId], loop ? 0 : 1);
            });
        }
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
        PauseAudio(_audio) {
            console.error('laya没有此功能：[PauseAudio]');
        }
        ResumeAudio(_audio) {
            console.error('laya没有此功能：[ResumeAudio]');
        }
        StopAudio(_audio) {
            if (_audio == 'ALL') {
                Laya.SoundManager.stopAll();
            }
            else if (_audio == 'BGMUSIC') {
                audioLogic.getInstance().SetMusicID('');
                Laya.SoundManager.stopMusic();
            }
            else if (_audio == 'ALLEFFECT') {
                Laya.SoundManager.stopAllSound();
            }
            else {
                _audio.forEach(element => {
                    Laya.SoundManager.stopSound(AudioCDNPath + AudioPath[element]);
                });
            }
        }
        wait(ms) {
            return new Promise(rs => {
                setTimeout(rs, ms);
            });
        }
    }
    AudioControl.instance = null;

    class HHAudio {
        static PreloadAudioClip(_clips) {
            HHAudio.audioL.init();
            HHAudio.audioC.init();
            if (Laya.Browser.onTBMiniGame) {
                for (const key in AudioPath) {
                    SoundPlayer$1.preloadSound(AudioCDNPath + AudioPath[key], true);
                }
            }
            else {
                HHAudio.audioC.PreloadAllAudioClip();
            }
        }
        static PlayMusic(_audioid, _loop = true) {
            HHAudio.audioC.playMusic(_audioid, _loop);
        }
        static PlayEffect(_audioid, _loop = false, _palyIntervalTime = 0) {
            HHAudio.audioC.playEffect(_audioid, _loop, _palyIntervalTime);
        }
        static PauseAudio(_audio) {
            HHAudio.audioC.PauseAudio(_audio);
        }
        static ResumeAudio(_audio) {
            HHAudio.audioC.ResumeAudio(_audio);
        }
        static StopAudio(_audio) {
            HHAudio.audioC.StopAudio(_audio);
        }
        static ChangeAudioState(_kind) {
            let _state = this.GetAudioState(_kind);
            if (!_kind || _kind == 'Music') {
                HHAudio.audioC.autioChangeMusicState();
            }
            if (!_kind || _kind == 'Effect') {
                HHAudio.audioL.ChangeAudioState(1, !_state);
            }
            return !_state;
        }
        static GetAudioState(_kind) {
            let _i = _kind == 'Music' ? 0 : 1;
            return HHAudio.audioL.AudioState[_i];
        }
    }
    HHAudio.audioL = audioLogic.getInstance();
    HHAudio.audioC = AudioControl.getInstance();

    class ComboEffect extends FGUIMount {
        constructor() {
            super(...arguments);
            this.element = {
                comboText: null,
            };
        }
        static SetParent(_parent) {
            this.myParent = _parent;
        }
        static Create(_info) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.myParent) {
                    console.error('[Create]请先设置父节点');
                    return null;
                }
                let _obj = yield FGUIUtil.CreatePrefab(this.myParent, this.myPkg, this.myComp, ComboEffect);
                this.allObj.push(_obj);
                _obj.Show();
                _obj.init(_info);
                return _obj;
            });
        }
        static RemoveAll() {
            while (this.allObj.length > 0) {
                let _obj = this.allObj.pop();
                _obj && _obj.removeSelf();
            }
        }
        removeSelf() {
            try {
                this.visible = false;
                FGUIUtil.RecyclePrefab(this);
            }
            catch (error) {
            }
        }
        removeInAllObj() {
            let _idx = ComboEffect.allObj.findIndex(v => v.id == this.id);
            if (_idx > -1) {
                ComboEffect.allObj.splice(_idx, 1);
            }
        }
        init(_info) {
            this.curInfo = _info;
            this.setXY(_info.pos[0], _info.pos[1]);
            this.element.comboText.text = '' + _info.comboN;
            this.runMyAction();
            this.touchable = false;
        }
        onEnd() {
            Laya.Tween.clearAll(this);
            Laya.timer.clearAll(this);
        }
        runMyAction() {
            this.setScale(0, 0);
            this.alpha = 1;
            let _audio = null;
            switch (this.curInfo.comboN) {
                case 2:
                    _audio = 'combo1';
                    break;
                case 4:
                    _audio = 'combo2';
                    break;
                case 5:
                case 7:
                    _audio = 'combo4';
                    break;
                default:
                    break;
            }
            if (_audio) {
                HHAudio.PlayEffect(_audio);
            }
            let _py = this.curInfo.pos[1] - 100;
            Laya.Tween.to(this, { scaleX: 1.2, scaleY: 1.2, y: _py }, 300, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                Laya.Tween.to(this, { scaleX: 0.9, scaleY: 0.9 }, 200, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                    Laya.Tween.to(this, { scaleX: 1.1, scaleY: 1.1 }, 200, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                        Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 200, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                            Laya.Tween.to(this, {}, 500, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                                Laya.Tween.to(this, { alpha: 0, y: _py - 200 }, 500, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                                    this.removeSelf();
                                }));
                            }));
                        }));
                    }));
                }));
            }));
            this.setScale(0, 0);
        }
    }
    ComboEffect.myPkg = 'GameScene';
    ComboEffect.myComp = 'ComboEffect';
    ComboEffect.myParent = null;
    ComboEffect.allObj = [];

    const ServerConfig = {
        Http: {
            IP: "https://service.eroswift.com/",
            GetPort: {
                GameInfo: 'customs/game/config',
            },
            PostPort: {
                GamePostInfo: 'customs/game/config',
            },
        },
        Sorcket: {},
        Cloud: {
            EnableDebug: true,
            Message: {
                ScoreRank: {
                    ID: 1014,
                    SendData: undefined,
                    GetData: {
                        curPoint: 0,
                        curRank: 1,
                        list: [
                            { nickName: '昵称昵称昵称昵称昵称1', point: 99999, headUrl: '' },
                            { nickName: '昵称2', point: 20, headUrl: '' },
                            { nickName: '昵称3', point: 30, headUrl: '' },
                            { nickName: '昵称4', point: 40, headUrl: '' },
                            { nickName: '昵称5', point: 50, headUrl: '' },
                            { nickName: '昵称6', point: 60, headUrl: '' },
                        ],
                    },
                },
                Notice: {
                    ID: 6002,
                    SendData: { scene: 'startGame' },
                    GetData: {
                        scene: 'startGame',
                        no: '', yes: '',
                        isBuyLuckyBag: true
                    },
                },
                CheckLuckyBagOrder: {
                    ID: 8001,
                    SendData: undefined,
                    GetData: {
                        price: 0,
                        time: 0,
                        record: {},
                    },
                },
                GetRankReward: {
                    ID: 8002,
                    SendData: undefined,
                    GetData: {
                        curRank: 1,
                        rewardType: 0,
                        title: "IQOO任一手机免单\n（限618期间支付订单）",
                        pic_url: "",
                        price: 0,
                    },
                },
                GetRankAllReward: {
                    ID: 8003,
                    SendData: undefined,
                    GetData: [
                        {
                            price: '随便的价格',
                            count: 0,
                            rankNums: [1],
                            id: 1,
                            type: 1,
                            pic_url: "",
                            title: "IQOO任一手机免单\n（限618期间支付订单）"
                        }, {
                            price: 2,
                            count: 0,
                            rankNums: [2, 3],
                            id: 1,
                            type: 1,
                            pic_url: "",
                            title: "IQOO任一手机免单\n（限000期间支付订单）"
                        }
                    ],
                },
                GetActivityState: {
                    ID: 1002,
                    SendData: undefined,
                    GetData: {
                        state: 1,
                    },
                },
                BrowseNewInfo: {
                    ID: 8004,
                    SendData: undefined,
                    GetData: {
                        time: '2021-01-01 10:01:00',
                        num_iid: '1',
                        title: '商品名',
                        price: '',
                    },
                },
            }
        }
    };

    class HttpUtil_C {
        constructor() {
            this.xhr = null;
        }
        static INS() {
            if (!this.instance) {
                this.instance = new HttpUtil_C();
                this.instance.init();
            }
            return this.instance;
        }
        init() {
            this.xhr = new XMLHttpRequest();
        }
        Connect(_port, reqData, callback) {
            let _port1 = _port;
            if (_port1 in ServerConfig.Http.GetPort) {
                this.Get(ServerConfig.Http.GetPort[_port1], reqData, callback);
            }
            else {
                this.Post(ServerConfig.Http.PostPort[_port1], reqData, callback);
            }
        }
        Get(url, reqData, callback) {
            if (reqData && reqData.length > 0) {
                for (const _data of reqData) {
                    url += '/' + _data;
                }
            }
            this.xhr.onreadystatechange = () => {
                if (this.xhr.readyState == 4) {
                    if (this.xhr.status >= 200 && this.xhr.status < 400) {
                        var response = this.xhr.responseText;
                        if (response) {
                            var responseJson = JSON.parse(response);
                            callback(responseJson);
                        }
                        else {
                            console.log("返回数据不存在");
                            callback(false);
                        }
                    }
                    else {
                        console.log("请求失败");
                        callback(false);
                    }
                }
            };
            this.xhr.open("GET", ServerConfig.Http.IP + url, true);
            this.xhr.send();
        }
        Post(url, reqData, callback) {
            this.xhr.onreadystatechange = () => {
                if (this.xhr.readyState == 4) {
                    if (this.xhr.status >= 200 && this.xhr.status < 400) {
                        var response = this.xhr.responseText;
                        if (response) {
                            var responseJson = JSON.parse(response);
                            callback && callback(responseJson);
                        }
                        else {
                            console.log("返回数据不存在");
                            callback && callback(false);
                        }
                    }
                    else {
                        console.log("请求失败");
                        callback && callback(false);
                    }
                }
            };
            this.xhr.open("POST", ServerConfig.Http.IP + url, true);
            this.xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            this.xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST');
            this.xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type');
            this.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            this.xhr.setRequestHeader('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aGlyZFBhcnR5SWQiOiI1ZjNhMDQzNTM1OTY1NTBiYmZhODdhMGUiLCJpYXQiOjE1OTc3MjE4NDR9.CBPIyQE_AGQbQx8B_PkgMWs1cW0WYdiUuXRCRcNIFDk");
            this.xhr.send(JSON.stringify(reqData));
        }
    }
    HttpUtil_C.instance = null;
    let HttpUtil = HttpUtil_C.INS();

    class CloudUtil_C {
        static INS() {
            if (!this.instance) {
                this.instance = new CloudUtil_C();
                this.instance.init();
            }
            return this.instance;
        }
        init() {
        }
        Connect(_port, _data) {
            let _message = ServerConfig.Cloud.Message[_port];
            if (!_data) {
                _data = {};
            }
            if (!Laya.Browser.onTBMiniGame) {
                _data.callBack && _data.callBack(true, _message.GetData, 0);
                return;
            }
            if (ServerConfig.Cloud.EnableDebug) {
                this.detectType(_port, _data.sendData, _message['SendData'], '发送消息');
            }
            if (!_data.sendData) {
                _data.sendData = {};
            }
            _data.sendData['activeId'] = TB$1._activeId;
            if (ServerConfig.Cloud.EnableDebug) {
                console.log('发送数据', _port, _data.sendData);
            }
            let info = { "id": _message.ID, "data": _data.sendData };
            TB$1.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    if (ServerConfig.Cloud.EnableDebug) {
                        console.log('接收数据', _port, buf);
                        this.detectType(_port, buf.data, _message['GetData'], '接收消息');
                    }
                    _data.callBack && _data.callBack(true, buf.data, buf.code);
                }
                else {
                    console.error(`[云函数]消息{${_port},ID:${_message.ID}}获取失败:`, buf.message);
                    _data.callBack && _data.callBack(false, null, buf.code);
                }
            });
        }
        detectType(_port, _nD, _oD, otherInfo) {
            let _nType = typeof _nD;
            let _oType = typeof _oD;
            if (_nType != _oType) {
                console.error('------------------------------');
                console.error('[云函数]检测到数据类型不符:', _port);
                console.error('模型数据类型:', _oType);
                console.error('实际数据类型:', _nType);
                if (otherInfo) {
                    console.error('其他消息:', otherInfo);
                }
                console.error('------------------------------');
            }
            if (_oType == 'object') {
                let _isoDArray = Array.isArray(_oD);
                let _isnDArray = Array.isArray(_nD);
                if (_isoDArray != _isnDArray) {
                    console.error('------------------------------');
                    console.error('[云函数]检测到数据类型不符:', _port);
                    console.error('模型数据类型是数组:', _isoDArray);
                    console.error('实际数据类型是数组:', _isnDArray);
                    if (otherInfo) {
                        console.error('其他消息:', otherInfo);
                    }
                    console.error('------------------------------');
                    return;
                }
                for (const key in _oD) {
                    if (!Object.prototype.hasOwnProperty.call(_nD, key)) {
                        if (!_isoDArray) {
                            console.error('------------------------------');
                            console.error('[云函数]数据错误:', _port);
                            console.error('实际数据中缺少字段:', key);
                            if (otherInfo) {
                                console.error('其他消息:', otherInfo);
                            }
                            console.error('------------------------------');
                        }
                    }
                    else {
                        this.detectType(_port + '.' + key, _nD[key], _oD[key]);
                    }
                    if (_isoDArray) {
                        console.log('数组类型不再检测');
                    }
                }
            }
        }
    }
    CloudUtil_C.instance = null;
    let CloudUtil = CloudUtil_C.INS();

    class ServerAPI {
    }
    ServerAPI.Http = HttpUtil;
    ServerAPI.Cloud = CloudUtil;

    class Loading {
        constructor() {
            if (Laya.Browser.onTBMiniGame) {
                fgui.UIPackage.addPackage(Global.hallConfig._cdn + MainUtil.getUI(Global.hallConfig.FGui.Loading));
                this.onUILoaded();
            }
            else {
                fgui.UIPackage.addPackage(MainUtil.getUI(Global.hallConfig.FGui.Loading));
                this.onUILoaded();
            }
        }
        onUILoaded() {
            this._main = fgui.UIPackage.createObject("Loading", "Main").asCom;
            this._main.makeFullScreen();
            this._main.addRelation(fgui.GRoot.inst, fgui.RelationType.Size);
            fgui.GRoot.inst.addChild(this._main);
            this._main.sortingOrder = 2;
            Laya.timer.once(10000, this, () => {
                MyUtils.closeLoading();
            });
        }
        close() {
            Laya.timer.clearAll(this);
            this._main.dispose();
        }
        destroy() {
            this._main.dispose();
        }
    }

    class MyUtils {
        constructor() { }
        static getItemByRate(itemArray, rateArray) {
            let r = Math.floor(Math.random() * 100);
            let num = 0;
            let item = itemArray[0];
            for (let i in rateArray) {
                num += rateArray[i];
                if (r <= num) {
                    item = itemArray[i];
                    break;
                }
            }
            return item;
        }
        static changeIntegral(addCount) {
            let curIntegral = this.getIntegral();
            curIntegral += addCount;
            PlayDataUtil.setData("integral", curIntegral);
        }
        static getIntegral() {
            let curIntegral = PlayDataUtil.data.integral;
            return curIntegral;
        }
        static isFirstEnter() {
            let isFirst = PlayDataUtil.data.isFirstEnter;
            return isFirst;
        }
        static setIsEnter() {
            PlayDataUtil.setData("isFirstEnter", 0);
        }
        static changeLianshengCount(count) {
            PlayDataUtil.setData("lianshengCount", count);
        }
        static getLianshengCount() {
            let count = PlayDataUtil.data.lianshengCount;
            return count;
        }
        static changeFirstCount(addCount) {
            let curCount = PlayDataUtil.data.heroFirstCount;
            curCount += addCount;
            PlayDataUtil.setData("heroFirstCount", curCount);
        }
        static getFirstCount() {
            let count = PlayDataUtil.data.heroFirstCount;
            return count;
        }
        static saveCurRoleID(id) {
            PlayDataUtil.setData("curRoleID", id);
        }
        static getCurRoleID() {
            let count = PlayDataUtil.data.curRoleID;
            return count;
        }
        static saveMyRoleIDArray(id) {
            id = parseInt(id);
            let arr = MyUtils.getMyRoleIDArray();
            let isHave = false;
            for (let i of arr) {
                if (i == id) {
                    isHave = true;
                }
            }
            if (!isHave) {
                arr.push(id);
            }
            PlayDataUtil.setData("myRoleIDArray", arr);
        }
        static getMyRoleIDArray() {
            let arr = PlayDataUtil.data.myRoleIDArray;
            return arr;
        }
        static getRankName(curIntegral) {
            let name = "";
            return name;
        }
        static getDuanweiId(curIntegral) {
            let id = 0;
            return id;
        }
        static getDuanweiIdx(curIntegral) {
            let levelIdx = 0;
            return levelIdx;
        }
        static getMinIntegral(curIntegral) {
            let minNum = 0;
            return minNum;
        }
        static getMaxIntegral(curIntegral) {
            let maxNum = 0;
            return maxNum;
        }
        static showLoading() {
            if (this._loadingLayer == null) {
                this._loadingLayer = new Loading();
            }
        }
        static closeLoading() {
            if (this._loadingLayer) {
                this._loadingLayer.close();
                this._loadingLayer = null;
            }
        }
        static getCutString(str, length) {
            let newStr = "";
            let lastStr = "";
            var regNum = new RegExp(/^[0-9]*$/);
            var regStr = new RegExp(/(?!.*?_$)[a-zA-Z0-9_]+$/);
            for (let i = 0; i < str.length; i++) {
                if (i < length) {
                    if ((regNum.test(lastStr) && !regStr.test(str[i])) || (!regStr.test(lastStr) && regNum.test(str[i]))) {
                        newStr += " " + str[i];
                    }
                    else {
                        newStr += str[i];
                    }
                    lastStr = str[i];
                }
                else if (i == length) {
                    newStr += "...";
                }
                else {
                    break;
                }
            }
            return newStr;
        }
        static getCutString2(str, length) {
            let newStr = "";
            for (let i = 0; i < str.length; i++) {
                if (i < length) {
                    var reg1 = new RegExp(/^[0-9]*$/);
                    if (reg1.test(str[i])) {
                        newStr += "" + str[i];
                    }
                    else {
                        newStr += str[i];
                    }
                }
                else if (i == length) {
                    newStr += "...";
                }
                else {
                    break;
                }
            }
            return newStr;
        }
        static strClamp(str, maxChars, suffix) {
            var toCodePoint = function (unicodeSurrogates) {
                var r = [], c = 0, p = 0, i = 0;
                while (i < unicodeSurrogates.length) {
                    var pos = i;
                    c = unicodeSurrogates.charCodeAt(i++);
                    if (c == 0xfe0f) {
                        continue;
                    }
                    if (p) {
                        var value = (0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00));
                        r.push({
                            v: value,
                            pos: pos,
                        });
                        p = 0;
                    }
                    else if (0xD800 <= c && c <= 0xDBFF) {
                        p = c;
                    }
                    else {
                        r.push({
                            v: c,
                            pos: pos
                        });
                    }
                }
                return r;
            };
            suffix = suffix == null ? '...' : suffix;
            maxChars *= 2;
            var codeArr = toCodePoint(str);
            var numChar = 0;
            var index = 0;
            for (var i = 0; i < codeArr.length; ++i) {
                var code = codeArr[i].v;
                var add = 1;
                if (code >= 128) {
                    add = 2;
                }
                if (numChar + add > maxChars) {
                    break;
                }
                index = i;
                numChar += add;
            }
            if (codeArr.length - 1 == index) {
                return str;
            }
            var more = suffix ? 1 : 0;
            return str.substring(0, codeArr[index - more].pos + 1) + suffix;
        }
        static NumToChinese(num) {
            if (!/^\d*(\.\d*)?$/.test(num)) {
                alert("Number is wrong!");
                return "Number is wrong!";
            }
            var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
            var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
            var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = "";
            for (var i = a[0].length - 1; i >= 0; i--) {
                switch (k) {
                    case 0:
                        re = BB[7] + re;
                        break;
                    case 4:
                        if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                            re = BB[4] + re;
                        break;
                    case 8:
                        re = BB[5] + re;
                        BB[7] = BB[5];
                        k = 0;
                        break;
                }
                if (k % 4 == 2 && parseInt(a[0].charAt(i + 2)) != 0 && parseInt(a[0].charAt(i + 1)) == 0)
                    re = AA[0] + re;
                if (parseInt(a[0].charAt(i)) != 0)
                    re = AA[a[0].charAt(i)] + BB[k % 4] + re;
                k++;
            }
            if (a.length > 1) {
                re += BB[6];
                for (var i = 0; i < a[1].length; i++)
                    re += AA[a[1].charAt(i)];
            }
            if (num >= 10 && num < 20) {
                re = re.replace("一十", "十");
            }
            return re;
        }
        ;
    }

    class Invite {
        constructor(opt) {
            if (Laya.Browser.onTBMiniGame) {
                Laya.loader.load([
                    { url: Global.hallConfig._cdn + Global.hallConfig.FGui.invite, type: Laya.Loader.BUFFER },
                    { url: Global.hallConfig._cdn + Global.hallConfig.FGui.invitePng, type: Laya.Loader.IMAGE },
                ], Laya.Handler.create(this, () => {
                    fgui.UIPackage.addPackage(Global.hallConfig._cdn + MainUtil.getUI(Global.hallConfig.FGui.invite));
                    this.onUILoaded(opt);
                }));
            }
            else {
                fgui.UIPackage.loadPackage(MainUtil.getUI(Global.hallConfig.FGui.invite), Laya.Handler.create(this, () => {
                    fgui.UIPackage.addPackage(MainUtil.getUI(Global.hallConfig.FGui.invite));
                    this.onUILoaded(opt);
                }));
            }
        }
        onUILoaded(opt) {
            MyUtils.closeLoading();
            this._isBack = true;
            this._coin = 0;
            this._main = fgui.UIPackage.createObject("Invite", "Main").asCom;
            this._main.makeFullScreen();
            this._main.addRelation(fgui.GRoot.inst, fgui.RelationType.Size);
            fgui.GRoot.inst.addChild(this._main);
            this._trans = this._main.getTransition("packUp");
            this._view = this._main.getChild('invite').asCom;
            this._view.getChild("confirmBtn").onClick(this, this.onBack);
            let inviteCtrl = this._view.getController('isInvite');
            inviteCtrl.selectedIndex = opt.coin ? 1 : 0;
            let tipsTxt = this._view.getChild('tipsTxt').asTextField;
            if (inviteCtrl.selectedIndex == 0) {
                tipsTxt.setVar('name', opt.nickName).flushVars();
            }
            else {
                tipsTxt.setVar('name', opt.nickName).flushVars();
            }
            let avatar = this._view.getChild('avatar').asLoader;
            avatar.url = opt.headUrl;
        }
        onBack() {
            if (this._isBack) {
                this._isBack = false;
                HHAudio.PlayEffect('btn');
                var callback = Laya.Handler.create(this, function () {
                    this._main.dispose();
                    if (this._coin > 0) {
                        MainUtil.sendCoin(this._coin);
                    }
                });
                this._trans.play(callback);
            }
        }
    }

    class TimeUtil {
        static wait(ms) {
            return new Promise(rs => {
                setTimeout(rs, ms);
            });
        }
        static waitFrame(frame = 1) {
            return new Promise(rs => {
                let finished = 0;
                let wait = function () {
                    requestAnimationFrame(() => {
                        if (++finished >= frame) {
                            rs();
                        }
                        else {
                            wait();
                        }
                    });
                };
                wait();
            });
        }
        static ButtonWait(key = 'btn', _time = 300) {
            if (key in TimeUtil._cantouch) {
                return true;
            }
            TimeUtil._cantouch[key] = true;
            setTimeout(() => {
                delete TimeUtil._cantouch[key];
            }, _time);
            return false;
        }
    }
    TimeUtil._cantouch = {};
    class ClockUtil {
        static Start(_tag, _interval = 0.1) {
            this.createClock(_tag, _interval);
        }
        static Reset(_tag) {
            if (!(_tag in this.allClock)) {
                console.error('【Reset】计时器不存在', _tag);
                return false;
            }
            console.log('重置计时器', _tag);
            this.allClock[_tag].time = 0;
            return true;
        }
        static Pause(_tag) {
            if (!(_tag in this.allClock)) {
                console.error('【Pause】计时器不存在', _tag);
                return false;
            }
            console.log('暂停计时器', _tag);
            this.allClock[_tag].resume = false;
        }
        static Resume(_tag) {
            if (!(_tag in this.allClock)) {
                console.error('【Resume】计时器不存在', _tag);
                return false;
            }
            console.log('继续计时器', _tag);
            this.allClock[_tag].resume = true;
        }
        static Stop(_tag) {
            if (!(_tag in this.allClock)) {
                if (this.allClock[_tag]) {
                    clearInterval(this.allClock[_tag].id);
                }
                delete this.allClock[_tag];
                return true;
            }
            console.log('停止计时器', _tag);
            return false;
        }
        static insertEvent(_tag, _event) {
            if (!(_tag in this.allClock)) {
                console.error('【insertEvent】计时器不存在', _tag);
                return false;
            }
            this.allClock[_tag].eventList[_event.tag] = _event;
            _event.interval = _event.interval || 0.1;
            _event.tag = _event.tag || ('tag_' + Object.keys(this.allClock[_tag].eventList).length);
            _event.type = _event.type || 'continue';
            _event['curN'] = 0;
            console.log('计时器插入事件', _tag, JSON.stringify(_event));
            return true;
        }
        static removeEvent(_tag, _eventTag) {
            if (!(_tag in this.allClock)) {
                console.error('【removeEvent】计时器不存在', _tag);
                return false;
            }
            console.log('计时器移除事件', _tag, _eventTag);
            if (_eventTag in this.allClock[_tag].eventList) {
                delete this.allClock[_tag].eventList[_eventTag];
            }
            return true;
        }
        static GetTime(_tag) {
            if (!(_tag in this.allClock)) {
                console.error('【GetTime】计时器不存在', _tag);
                return 0;
            }
            return this.allClock[_tag].time;
        }
        static createClock(_tag, _interval) {
            if (_tag in this.allClock) {
                clearInterval(this.allClock[_tag].id);
            }
            let _clock = { id: 0, time: 0, interval: _interval, eventList: {}, resume: true };
            _clock.id = setInterval(() => {
                if (!_clock.resume) {
                    return;
                }
                _clock.time = Number((_clock.time + _clock.interval).toFixed(3));
                for (const key in _clock.eventList) {
                    let _e = _clock.eventList[key];
                    if (_e.type == 'once') {
                        if (_clock.time >= _e.interval) {
                            _e['curN']++;
                            _e.callBack && _e.callBack(_tag, _e.tag, _e['curN']);
                            delete _clock.eventList[key];
                        }
                    }
                    else if (_e.type == 'continue') {
                        if (((_clock.time * 1000) | 0) % ((_e.interval * 1000) | 0) == 0) {
                            _e['curN']++;
                            _e.callBack && _e.callBack(_tag, _e.tag, _e['curN']);
                        }
                    }
                }
            }, _interval * 1000);
            this.allClock[_tag] = _clock;
            console.log('创建计时器', _clock);
        }
    }
    ClockUtil.allClock = {};

    class UI_AutotriggerAward extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("autotriggerAward", "AutotriggerAward"));
        }
        onConstruct() {
            this.m_frame = (this.getChildAt(0));
            this.m_iconLoader = (this.getChildAt(2));
            this.m_tText = (this.getChildAt(3));
            this.m_attentionBtn = (this.getChildAt(4));
            this.m_priceText = (this.getChildAt(5));
            this.m_describeText = (this.getChildAt(6));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_AutotriggerAward.URL = "ui://hmoqxzvjkv205";

    class ModuleTool {
        static getCutString(str, length) {
            let newStr = "";
            let lastStr = "";
            var regNum = new RegExp(/^[0-9]*$/);
            var regStr = new RegExp(/(?!.*?_$)[a-zA-Z0-9_]+$/);
            for (let i = 0; i < str.length; i++) {
                if (i < length) {
                    if ((regNum.test(lastStr) && !regStr.test(str[i])) || (!regStr.test(lastStr) && regNum.test(str[i]))) {
                        newStr += " " + str[i];
                    }
                    else {
                        newStr += str[i];
                    }
                    lastStr = str[i];
                }
                else if (i == length) {
                    newStr += "...";
                }
                else {
                    break;
                }
            }
            return newStr;
        }
        static SurviveTimeToString(surviveSecond) {
            var str = "";
            if (surviveSecond < 0) {
                str = "00分00秒";
            }
            else if (surviveSecond >= 0 && surviveSecond < 60) {
                var strSecond = surviveSecond < 10 ? "0" + surviveSecond : surviveSecond.toString();
                str = "00分" + strSecond + "秒";
            }
            else {
                var strYuSecond = Math.floor(surviveSecond % 60);
                var strZongMinute = Math.floor(surviveSecond / 60);
                var strYuMinute = strZongMinute % 60;
                var strZongHour = Math.floor(strZongMinute / 60);
                if (strZongHour < 24) {
                    if (strZongHour != 0) {
                        str = (strZongHour < 10 ? "0" + strZongHour : strZongHour) + "时" + (strYuMinute < 10 ? "0" + strYuMinute : strYuMinute) + "分" + (strYuSecond < 10 ? "0" + strYuSecond : strYuSecond) + '秒';
                    }
                    else {
                        str = (strYuMinute < 10 ? "0" + strYuMinute : strYuMinute) + "分" + (strYuSecond < 10 ? "0" + strYuSecond : strYuSecond) + '秒';
                    }
                }
                else if (strZongHour == 24 && strYuMinute == 0 && strYuSecond == 0) {
                    str = "24时00分00秒";
                }
                else {
                    var strZongDay = Math.floor(strZongHour / 24);
                    var strYuHour = strZongHour % 24;
                    str = strZongDay + "天" + (strYuHour < 10 ? "0" + strYuHour : strYuHour) + "时" + (strYuMinute < 10 ? "0" + strYuMinute : strYuMinute) + "分" + (strYuSecond < 10 ? "0" + strYuSecond : strYuSecond) + '秒';
                }
            }
            return str;
        }
        static TimestampToString(timestamp) {
            let time = new Date(timestamp);
            let year = time.getFullYear();
            let month = time.getMonth() + 1;
            let day = time.getDate();
            let hours = time.getHours();
            let minute = time.getMinutes();
            let second = time.getSeconds();
            let strRet = year + '年';
            strRet += ((month < 10) ? '0' + month : month) + '月';
            strRet += ((day < 10) ? '0' + day : day) + '日';
            strRet += ((hours < 10) ? '0' + hours : hours) + '时';
            strRet += ((minute < 10) ? '0' + minute : minute) + '分';
            strRet += ((second < 10) ? '0' + second : second) + '秒';
            return strRet;
        }
        static GetTime(timeMS, format = 'dhms') {
            let ms = timeMS % 1000;
            if (ms) {
                timeMS += 1000 - ms;
            }
            let replacePattern = {
                "d+": { div: 86400000 },
                "h+": { div: 3600000 },
                "m+": { div: 60000 },
                "s+": { div: 1000 }
            };
            for (let key in replacePattern) {
                let toReplace = '';
                format = format.replace(new RegExp(key, 'g'), str => {
                    if (!toReplace) {
                        let pattern = replacePattern[key];
                        let result = timeMS / pattern.div | 0;
                        let resultStr = result + '';
                        timeMS -= result * pattern.div;
                        toReplace = '0'.repeat(Math.max(str.length - resultStr.length, 0)) + resultStr;
                    }
                    return toReplace;
                });
            }
            return format;
        }
        static DetectType(_port, _nD, _oD, otherInfo) {
            let _nType = typeof _nD;
            let _oType = typeof _oD;
            if (_nType != _oType) {
                console.error('------------------------------');
                console.error('[云函数]检测到数据类型不符:', _port);
                console.error('模型数据类型:', _oType);
                console.error('实际数据类型:', _nType);
                if (otherInfo) {
                    console.error('其他消息:', otherInfo);
                }
                console.error('------------------------------');
            }
            if (_oType == 'object') {
                let _isoDArray = Array.isArray(_oD);
                let _isnDArray = Array.isArray(_nD);
                if (_isoDArray != _isnDArray) {
                    console.error('------------------------------');
                    console.error('[云函数]检测到数据类型不符:', _port);
                    console.error('模型数据类型是数组:', _isoDArray);
                    console.error('实际数据类型是数组:', _isnDArray);
                    if (otherInfo) {
                        console.error('其他消息:', otherInfo);
                    }
                    console.error('------------------------------');
                    return;
                }
                for (const key in _oD) {
                    if (!Object.prototype.hasOwnProperty.call(_nD, key)) {
                        if (!_isoDArray) {
                            console.error('------------------------------');
                            console.error('[云函数]数据错误:', _port);
                            console.error('实际数据中缺少字段:', key);
                            if (otherInfo) {
                                console.error('其他消息:', otherInfo);
                            }
                            console.error('------------------------------');
                        }
                    }
                    else {
                        this.DetectType(_port + '.' + key, _nD[key], _oD[key]);
                    }
                    if (_isoDArray) {
                        console.log('数组类型不再检测');
                        break;
                    }
                }
            }
        }
        static ChangeToNumber(_v) {
            if (typeof _v == 'number') {
                return _v;
            }
            else if (typeof _v == 'string') {
                return Number(_v);
            }
            console.error('ChangeToNumber错误类型：', _v);
            return 0;
        }
        static SetTextAndFitSize(fText, txt) {
            fText.text = '' + txt;
            let text = fText.displayObject;
            text.wordWrap = false;
            if (fText.width < text.textWidth) {
                text.fontSize = Math.floor((fText.width / text.textWidth) * fText.fontSize);
            }
        }
        static GetLocalItem(_key) {
            let _getdata = null;
            if (Laya.Browser.onTBMiniGame) {
                let data = my.getStorageSync({ key: _key });
                if (data && data["data"]) {
                    _getdata = data["data"];
                }
            }
            else {
                let data = Laya.LocalStorage.getItem(_key);
                if (data) {
                    _getdata = JSON.parse(data);
                }
            }
            return _getdata;
        }
        static SetLocalItem(_key, _data) {
            if (Laya.Browser.onTBMiniGame) {
                my.setStorage({
                    key: _key,
                    data: _data,
                    success: () => {
                        console.log(_key, "写入成功");
                    }
                });
            }
            else {
                Laya.LocalStorage.setItem(_key, JSON.stringify(_data));
            }
        }
        static ActionPopIn(_node, _endcallbacK) {
            _node.setScale(0.3, 0.3);
            Laya.Tween.to(_node, { scaleX: 1.15, scaleY: 1.15, }, 150, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(_node, { scaleX: 1, scaleY: 1 }, 400, Laya.Ease.sineOut, Laya.Handler.create(this, () => {
                    _endcallbacK && _endcallbacK();
                }));
            }));
        }
        static ActionPopOut(_node, _endcallbacK) {
            Laya.Tween.to(_node, { scaleX: 1.1, scaleY: 1.1, }, 200, Laya.Ease.linearOut, Laya.Handler.create(this, () => {
                Laya.Tween.to(_node, { scaleX: 0, scaleY: 0 }, 200, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                    _endcallbacK && _endcallbacK();
                }));
            }));
        }
    }
    class ModuleAudio {
        static preloadAudio(path) {
            let _url = path;
            if (Laya.Browser.onTBMiniGame) {
                let effectContext = my.createInnerAudioContext();
                effectContext.autoplay = false;
                effectContext.loop = false;
                effectContext.src = _url;
                this.allEffectContext[path] = effectContext;
                effectContext.onSeeked((res) => {
                    console.log('onSeeked', res);
                });
                effectContext.onSeeking((res) => {
                    console.log('onSeeking', res);
                });
                effectContext.onSeeked((res) => {
                    console.log('onSeeked', res);
                });
                effectContext.onCanPlay((res) => {
                    console.log('onCanPlay', res);
                });
                effectContext.onPlay((res) => {
                    console.log('开始播放', res);
                    effectContext['isplaying'] = true;
                });
                effectContext.onError((res) => {
                    console.error('音效错误', path, res);
                    effectContext.destroy();
                    if (this.allEffectContext[path]) {
                        delete this.allEffectContext[path];
                    }
                });
                effectContext.onStop((res) => {
                    console.log('====onStop===', res);
                    effectContext['isplaying'] = false;
                });
                effectContext.onTimeUpdate((res) => {
                    console.log('====onTimeUpdate===', res);
                });
                effectContext.onEnded((res) => {
                    console.log('====onEnded===', res);
                    effectContext['isplaying'] = false;
                    effectContext.stop();
                });
                console.log('初次创建音效：', path);
                return this.allEffectContext[path];
            }
            else {
                Laya.loader.load(_url, Laya.Handler.create(this, () => {
                }), null, Laya.Loader.SOUND);
            }
            return null;
        }
        static playEffect(path) {
            let _url = path;
            if (Laya.Browser.onTBMiniGame) {
                if (!this.allEffectContext[path]) {
                    this.preloadAudio(path);
                }
                if (this.allEffectContext[path]['isplaying']) {
                    this.allEffectContext[path].stop();
                }
                this.allEffectContext[path].play();
            }
            else {
                Laya.SoundManager.playSound(_url, 1);
            }
        }
        static SetComonBtnAudioPath(_path) {
            this._comonBtnAudioPath = _path;
            this.preloadAudio(_path);
        }
        static PlayComonBtnAudio() {
            if (this._comonBtnAudioPath == '') {
                console.error('请先传入通用按钮音效路径');
                return;
            }
            this.playEffect(this._comonBtnAudioPath);
        }
    }
    ModuleAudio.allEffectContext = {};
    ModuleAudio._comonBtnAudioPath = '';
    class ModuleClock {
        static Start(_tag, _interval = 0.1) {
            this.createClock(_tag, _interval);
        }
        static Reset(_tag) {
            if (!(_tag in this.allClock)) {
                console.error('【Reset】计时器不存在', _tag);
                return false;
            }
            console.log('重置计时器', _tag);
            this.allClock[_tag].time = 0;
            return true;
        }
        static Pause(_tag) {
            if (!(_tag in this.allClock)) {
                console.error('【Pause】计时器不存在', _tag);
                return false;
            }
            console.log('暂停计时器', _tag);
            this.allClock[_tag].resume = false;
        }
        static Resume(_tag) {
            if (!(_tag in this.allClock)) {
                console.error('【Resume】计时器不存在', _tag);
                return false;
            }
            console.log('继续计时器', _tag);
            this.allClock[_tag].resume = true;
        }
        static Stop(_tag) {
            if (!(_tag in this.allClock)) {
                if (this.allClock[_tag]) {
                    clearInterval(this.allClock[_tag].id);
                }
                delete this.allClock[_tag];
                return true;
            }
            console.log('停止计时器', _tag);
            return false;
        }
        static insertEvent(_tag, _event) {
            if (!(_tag in this.allClock)) {
                console.error('【insertEvent】计时器不存在', _tag);
                return false;
            }
            this.allClock[_tag].eventList[_event.tag] = _event;
            _event.interval = _event.interval || 0.1;
            _event.tag = _event.tag || ('tag_' + Object.keys(this.allClock[_tag].eventList).length);
            _event.type = _event.type || 'continue';
            _event['curN'] = 0;
            console.log('计时器插入事件', _tag, JSON.stringify(_event));
            return true;
        }
        static removeEvent(_tag, _eventTag) {
            if (!(_tag in this.allClock)) {
                console.error('【removeEvent】计时器不存在', _tag);
                return false;
            }
            console.log('计时器移除事件', _tag, _eventTag);
            if (_eventTag in this.allClock[_tag].eventList) {
                delete this.allClock[_tag].eventList[_eventTag];
            }
            return true;
        }
        static GetTime(_tag) {
            if (!(_tag in this.allClock)) {
                console.error('【GetTime】计时器不存在', _tag);
                return 0;
            }
            return this.allClock[_tag].time;
        }
        static createClock(_tag, _interval) {
            if (_tag in this.allClock) {
                clearInterval(this.allClock[_tag].id);
            }
            let _clock = { id: 0, time: 0, interval: _interval, eventList: {}, resume: true };
            _clock.id = setInterval(() => {
                if (!_clock.resume) {
                    return;
                }
                _clock.time = Number((_clock.time + _clock.interval).toFixed(3));
                for (const key in _clock.eventList) {
                    let _e = _clock.eventList[key];
                    if (_e.type == 'once') {
                        if (_clock.time >= _e.interval) {
                            _e['curN']++;
                            _e.callBack && _e.callBack(_tag, _e.tag, _e['curN']);
                            delete _clock.eventList[key];
                        }
                    }
                    else if (_e.type == 'continue') {
                        if (((_clock.time * 1000) | 0) % ((_e.interval * 1000) | 0) == 0) {
                            _e['curN']++;
                            _e.callBack && _e.callBack(_tag, _e.tag, _e['curN']);
                        }
                    }
                }
            }, _interval * 1000);
            this.allClock[_tag] = _clock;
            console.log('创建计时器', _clock);
        }
    }
    ModuleClock.allClock = {};

    class UI_Main extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Atmosphere", "Main"));
        }
        onConstruct() {
            this.m_closeBtn = (this.getChildAt(0));
        }
    }
    UI_Main.URL = "ui://2614tyiclh0h0";

    class uiAtmosphereMain extends UI_Main {
        onConstruct() {
            super.onConstruct();
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                Laya.timer.once(100, this, () => {
                    ModulePackage.Instance.PopWindow("Atmosphere", "SurpassHint", {
                        px: 0, py: 0, winParamData: {
                            delayTime: 1000,
                            percent: 10
                        }, isModal: false
                    });
                });
            }
            this.m_closeBtn.onClick(this, () => {
                this._winHandler.hide();
            });
        }
    }

    class UI_SurpassHint extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Atmosphere", "SurpassHint"));
        }
        onConstruct() {
            this.m_bg = (this.getChildAt(0));
            this.m_surpassText = (this.getChildAt(1));
            this.m_photoLoader1 = (this.getChildAt(2));
            this.m_photoLoader2 = (this.getChildAt(3));
        }
    }
    UI_SurpassHint.URL = "ui://2614tyiclh0h2";

    class uiSurpassHint extends UI_SurpassHint {
        constructor() {
            super(...arguments);
            this.myInfo = null;
        }
        onConstruct() {
            super.onConstruct();
            this.changeUrl();
        }
        makeFullScreen() {
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winHandler.SetShowCallBack(this, this.OnShow);
                this._winHandler.SetHideCallBack(this, this.OnHide);
                this.SetInfo(this._winHandler.GetParamData());
            }
        }
        SetInfo(_info) {
            if (!_info || !_info.percent) {
                return;
            }
            this.myInfo = _info;
            if (!this.myInfo.delayTime) {
                this.myInfo.delayTime = 2000;
            }
            if (!this.myInfo.posY) {
                this.myInfo.posY = 200;
            }
            this.m_surpassText.setVar("count", '' + _info.percent).flushVars();
        }
        changeUrl() {
            const baseUrl = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/bigFight/matchAvatar/tx_";
            for (let i = 0; i < 2; i++) {
                let _headid = 1 + (Math.random() * 2000) | 0;
                let _url = baseUrl + (Array(5).join('0') + _headid).slice(-5) + ".jpg";
                console.log('_url', _url);
                if (i == 0) {
                    this.m_photoLoader1.url = _url;
                }
                else {
                    this.m_photoLoader2.url = _url;
                }
            }
        }
        OnShow() {
            console.log("OnShow~~~");
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
            let _startx = Laya.stage.width + this.width * this.pivotX;
            let _endx = Laya.stage.width - this.width * (1 - this.pivotX);
            this.x = _startx;
            this.y = this.myInfo.posY;
            Laya.Tween.to(this, { x: _endx }, 500, undefined, Laya.Handler.create(this, () => {
                Laya.timer.once(this.myInfo.delayTime, this, () => {
                    Laya.Tween.to(this, { x: _startx }, 500, undefined, Laya.Handler.create(this, () => {
                        this._winHandler.hide();
                    }));
                });
            }));
        }
        OnHide() {
            console.log("OnHide~~~");
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
            this.changeUrl();
        }
    }

    class AtmosphereBinder {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(uiAtmosphereMain.URL, uiAtmosphereMain);
            fgui.UIObjectFactory.setExtension(uiSurpassHint.URL, uiSurpassHint);
        }
    }

    class UI_prizeItem extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("baseBag", "prizeItem"));
        }
        onConstruct() {
            this.m_ctrlSendStatus = this.getControllerAt(0);
            this.m_ctrlType = this.getControllerAt(1);
            this.m_loadItemHead = (this.getChildAt(0));
            this.m_btnApply = (this.getChildAt(1));
            this.m_btnApply2 = (this.getChildAt(2));
            this.m_txtName = (this.getChildAt(3));
            this.m_txtPrice = (this.getChildAt(4));
            this.m_txtBeginTime = (this.getChildAt(5));
            this.m_txtOrderNo = (this.getChildAt(6));
        }
    }
    UI_prizeItem.URL = "ui://ennunbg0ctsq39";

    class UI_textInput extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("baseBag", "textInput"));
        }
        onConstruct() {
            this.m_value = (this.getChildAt(1));
        }
    }
    UI_textInput.URL = "ui://ennunbg0ctsq3e";

    class UI_Alert extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("baseBag", "Alert"));
        }
        onConstruct() {
            this.m_frame = (this.getChildAt(0));
            this.m_listPanel = (this.getChildAt(1));
            this.m_txtMessage = (this.getChildAt(2));
            this.m_btnOk = (this.getChildAt(3));
            this.m_btnNo = (this.getChildAt(4));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_Alert.URL = "ui://ennunbg0ctsq3h";

    class uiAddressAlert extends UI_Alert {
        constructor() {
            super(...arguments);
            this._bDataIsReady = false;
            this._bIsShown = false;
        }
        onConstruct() {
            super.onConstruct();
            this.m_btnOk.onClick(this, this._OnOkClick);
            this.m_btnNo.onClick(this, this._OnNoClick);
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winParamData = this._winHandler.GetParamData();
                this._winHandler.SetShowCallBack(this, this.OnShow);
                this._winHandler.SetHideCallBack(this, this.OnHide);
            }
        }
        _OnOkClick() {
            this._winHandler.hide();
            if (!!this._winParamData.callBack) {
                this._winParamData.callBack(true);
            }
        }
        _OnNoClick() {
            this._winHandler.hide();
            if (!!this._winParamData.callBack) {
                this._winParamData.callBack(false);
            }
        }
        OnShow() {
            console.log("OnShow~~~");
            if (this._winHandler.isShowing == false)
                return;
            if (this._bIsShown == true)
                return;
            this._bIsShown = true;
        }
        OnHide() {
            console.log("OnHide~~~");
        }
    }

    class UI_Main$1 extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("baseBag", "Main"));
        }
        onConstruct() {
            this.m_ctrlType = this.getControllerAt(0);
            this.m_ctrlEmptyStatus = this.getControllerAt(1);
            this.m_frame = (this.getChildAt(0));
            this.m_btnCoupon = (this.getChildAt(1));
            this.m_btnGoods = (this.getChildAt(2));
            this.m_tab = (this.getChildAt(3));
            this.m_listPanel = (this.getChildAt(4));
            this.m_noneTxt = (this.getChildAt(5));
            this.m_listGift = (this.getChildAt(6));
            this.m_listSale = (this.getChildAt(7));
            this.m_list = (this.getChildAt(8));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_Main$1.URL = "ui://ennunbg0r8mh1";

    var PlatformListenKey;
    (function (PlatformListenKey) {
        PlatformListenKey["onShow"] = "onShow";
        PlatformListenKey["onHide"] = "onHide";
        PlatformListenKey["MemberChange"] = "MemberChangeKey";
        PlatformListenKey["FavorChange"] = "FavorChangeKey";
    })(PlatformListenKey || (PlatformListenKey = {}));
    class ModulePlatformAPI_C {
        constructor() {
            this._isMember = false;
            this._isFavor = false;
            this.globalVars = {};
        }
        get IsMember() { return this._isMember; }
        get IsFavor() { return this._isFavor; }
        static Instance() {
            if (!this.myInstance) {
                this.myInstance = new ModulePlatformAPI_C();
            }
            return this.myInstance;
        }
        Init(_config) {
            if (!Laya.Browser.onTBMiniGame)
                return false;
            _config && this.SetGlobal(_config);
            this.initShow();
            return true;
        }
        SetGlobal(_config) {
            if (_config) {
                for (const key in _config) {
                    this.globalVars[key] = _config[key];
                    if (key == 'shopID') {
                        this.globalVars[key] = '' + this.globalVars[key];
                    }
                    else if (key == 'shopOwnerID') {
                        if (typeof this.globalVars[key] != "number") {
                            this.globalVars[key] = Number(this.globalVars[key]);
                        }
                    }
                }
                console.log('SetGlobal', JSON.stringify(this.globalVars));
            }
        }
        ChangeFavorState(_isFavor) {
            if (this._isFavor == _isFavor) {
                return;
            }
            this._isFavor = _isFavor;
            setTimeout(() => {
                Laya.stage.event(PlatformListenKey.FavorChange);
            }, 100);
        }
        ;
        ChangeMemberState(_isMember) {
            if (this._isMember == _isMember) {
                return;
            }
            this._isMember = _isMember;
            setTimeout(() => {
                Laya.stage.event(PlatformListenKey.MemberChange);
            }, 100);
        }
        initShow() {
            let app = getApp();
            app["global"]["onShow"] = this.onShow;
            app["global"]["onHide"] = this.onHide;
        }
        onShow() {
            console.log("TB onshow");
            Laya.stage.event(PlatformListenKey.onShow);
        }
        onHide() {
            console.log("TB onHide");
            Laya.stage.event(PlatformListenKey.onHide);
        }
        CanUsePlatformAPI() {
            if (!Laya.Browser.onTBMiniGame)
                return true;
            return false;
        }
        CheckApiLv(apiName, sdkName) {
            if (!Laya.Browser.onTBMiniGame)
                return false;
            if (!sdkName || sdkName == undefined) {
                if (my[apiName])
                    return true;
            }
            else {
                if (my[sdkName][apiName])
                    return true;
            }
            console.log('当前版本不支持该API: ', apiName);
            return false;
        }
        GetSystemInfoSync() {
            if (!this.CheckApiLv("authorize"))
                return null;
            return my.getSystemInfoSync();
        }
        GetUserInfo(success, fail) {
            if (this._objUserInfo) {
                if (!!success)
                    success(this._objUserInfo);
                return;
            }
            if (!this.CheckApiLv("authorize")) {
                if (!!success)
                    success({ nickName: '某人', avatar: '' });
                return;
            }
            ;
            let self = this;
            my.authorize({
                scopes: 'scope.userInfo',
                success: (res) => {
                    console.log("authorize res: ", res);
                    my.getAuthUserInfo({
                        success: (userInfo) => {
                            self._objUserInfo = userInfo;
                            if (success) {
                                success(userInfo);
                            }
                        }, fail: () => {
                            console.log("获取授权失败 引导授权界面");
                            if (!this.CheckApiLv("showAuthGuide"))
                                return;
                            my.showAuthGuide();
                        }
                    });
                },
                fail: (result) => {
                    if (!!fail)
                        fail(result);
                }
            });
        }
        showLoad(content) {
            if (!this.CheckApiLv("showLoading"))
                return;
            let str_content = content == undefined ? "加载中..." : content;
            my.showLoading({
                content: str_content,
                delay: 1000,
            });
            setTimeout(() => {
                this.hideLoad();
            }, 5000);
        }
        hideLoad() {
            if (!this.CheckApiLv("hideLoading"))
                return;
            my.hideLoading();
        }
        showToast(content) {
            if (!this.CheckApiLv("showToast"))
                return;
            if (!content || content == undefined)
                return;
            my.showToast({
                type: 'success',
                content: content,
                duration: 2000,
                success: () => {
                },
            });
        }
        confirm(title, content, str_sure = "确定", str_cancel = "取消") {
            if (!this.CheckApiLv("confirm"))
                return;
            my.confirm({
                title: title,
                content: content,
                confirmButtonText: str_sure,
                cancelButtonText: str_cancel,
                success: (result) => {
                    console.log("result: ", result);
                },
            });
        }
        NavigateToTaobaoPage(callbackFunc) {
            if (!this.CheckApiLv("navigateToTaobaoPage", "tb"))
                return;
            if (!this.globalVars.shopID) {
                console.error('[NavigateToTaobaoPage]请传入shopID');
                if (callbackFunc) {
                    callbackFunc(false);
                }
                return;
            }
            let shopId = this.globalVars.shopID;
            my.tb.navigateToTaobaoPage({
                appCode: 'shop',
                appParams: {
                    shopId: '' + shopId,
                    weexShopSubTab: "shopindex",
                    weexShopTab: "shopindexbar"
                },
                success: (res) => {
                    console.log("跳转店铺成功");
                    if (callbackFunc) {
                        callbackFunc(true);
                    }
                },
                fail: (err) => {
                    console.log("跳转店铺失败: ", err);
                    if (callbackFunc) {
                        callbackFunc(false);
                    }
                }
            });
        }
        CollectGoods(good_id, callback) {
            if (!this.CheckApiLv("collectGoods", "tb"))
                return;
            if (typeof good_id != 'number') {
                console.error('[CollectGoods]商品id需要使用 number 类型');
                good_id = Number(good_id);
            }
            let self = this;
            my.tb.collectGoods({
                id: good_id,
                success: (res) => {
                    self.showToast("收藏成功");
                    if (callback) {
                        callback(true, res);
                    }
                },
                fail: (res) => {
                    if (res.message) {
                        self.showToast(res.message);
                    }
                    console.error('收藏失败', res);
                    if (callback) {
                        callback(false);
                    }
                },
                complete: (res) => {
                }
            });
        }
        UnCollectGoods(good_id) {
            if (!this.CheckApiLv("unCollectGoods", "tb"))
                return;
            if (typeof good_id != 'number') {
                console.error('[UnCollectGoods]商品id需要使用 number 类型');
                good_id = Number(good_id);
            }
            let self = this;
            my.tb.unCollectGoods({
                id: good_id,
                success: (res) => {
                    self.showToast("取消关注");
                },
                fail: (res) => {
                },
                complete: (res) => {
                }
            });
        }
        CheckGoodsCollectedStatus(good_id, func) {
            if (!this.CheckApiLv("checkGoodsCollectedStatus", "tb")) {
                func && func(true);
                return;
            }
            if (typeof good_id != 'number') {
                console.error('[CheckGoodsCollectedStatus]商品id需要使用 number 类型');
                good_id = Number(good_id);
            }
            my.tb.checkGoodsCollectedStatus({
                id: good_id,
                success: (res) => {
                    console.log("商品收藏状态 res = ", res);
                    if (func) {
                        func(res.isCollect);
                    }
                },
            });
        }
        CheckShopFavoredStatus(callback) {
            if (!this.CheckApiLv("checkShopFavoredStatus", "tb"))
                return;
            if (!this.globalVars.shopOwnerID) {
                console.error('[CheckShopFavoredStatus]请传入shopOwnerID');
                if (callback) {
                    callback(false, false);
                }
                return;
            }
            let owner_id = ModuleTool.ChangeToNumber(this.globalVars.shopOwnerID);
            let self = this;
            my.tb.checkShopFavoredStatus({
                id: owner_id,
                success: (res) => {
                    console.log('已关注店铺', owner_id);
                    self.ChangeFavorState(res.isFavor);
                    if (callback) {
                        callback(true, self._isFavor);
                    }
                },
                fail: (res) => {
                    console.log('未关注店铺', owner_id, self._isFavor);
                    callback && callback(false, self._isFavor);
                }
            });
        }
        FavorShop(callbackFunc, type = 0) {
            if (!this.CheckApiLv("favorShop", "tb"))
                return;
            if (!this.globalVars.shopOwnerID) {
                console.error('[CheckShopFavoredStatus]请传入shopOwerID');
                if (callbackFunc) {
                    callbackFunc(this.IsFavor);
                }
                return;
            }
            if (this.IsFavor) {
                if (callbackFunc) {
                    callbackFunc(this.IsFavor);
                }
                return;
            }
            let owner_id = this.globalVars.shopOwnerID;
            let self = this;
            console.log("shopid = ", owner_id);
            my.tb.favorShop({
                id: owner_id,
                success: (res) => {
                    self.ChangeFavorState(true);
                    if (callbackFunc) {
                        callbackFunc(this.IsFavor);
                    }
                    self.showToast("关注成功");
                },
                fail: (res) => {
                    if (callbackFunc) {
                        callbackFunc(this.IsFavor);
                    }
                    console.error('关注失败', res);
                    self.showToast("关注失败");
                }
            });
        }
        UnFavorShop() {
            if (!this.CheckApiLv("unFavorShop", "tb"))
                return;
            if (!this.globalVars.shopOwnerID) {
                console.error('[CheckShopFavoredStatus]请传入shopOwerID');
                return;
            }
            let owner_id = this.globalVars.shopOwnerID;
            let self = this;
            my.tb.unFavorShop({
                id: owner_id,
                success: (res) => {
                    self.showToast("取消关注");
                    self.ChangeFavorState(false);
                },
                fail: (res) => {
                }
            });
        }
        OpenShopItemDetail(itemId, successCallback, failCallback) {
            if (Laya.Browser.onTBMiniGame) {
                my.tb.openDetail({
                    itemId: '' + itemId,
                    success: (res) => {
                        console.log("openDetail success", res);
                        successCallback && successCallback(res);
                    }, fail: (res) => {
                        console.error("openDetail fail", res);
                        failCallback && failCallback(res);
                    }
                });
            }
        }
        showSku(good_id, success) {
            if (!this.CheckApiLv("showSku", "tb"))
                return;
            my.tb.showSku({
                itemId: '' + good_id,
                success: (res) => {
                    console.log("skuId = ", res.skuId);
                    if (success) {
                        success(true);
                    }
                },
                fail: (res) => {
                    if (success) {
                        success(false);
                    }
                },
            });
        }
        ChooseAddress(successCallBack) {
            if (this.CheckApiLv("chooseAddress", "tb")) {
                my.authorize({
                    scopes: 'scope.addressList',
                    success: (result) => {
                        my.tb.chooseAddress({
                            addAddress: "show",
                            searchAddress: "hide",
                            locateAddress: "hide",
                            success: (res) => {
                                console.log('======= 收货地址 ======', JSON.stringify(res));
                                if (successCallBack) {
                                    successCallBack(true, res);
                                }
                            },
                            fail: (res) => {
                                console.log('======= 收货失败 ======', JSON.stringify(res));
                                successCallBack && successCallBack(false);
                            },
                        });
                    },
                    fail(result) {
                        console.log('======= 授权失败 ======', JSON.stringify(result));
                    }
                });
            }
            else {
                successCallBack(true, {
                    name: '测试名',
                    telNumber: '123',
                    provinceName: '省份、',
                    cityName: '市、',
                    countyName: '区、',
                    streetName: '街道、',
                    streetCode: '街道编码、',
                    detailInfo: '详细地址',
                });
            }
        }
        OpenMember(resultCB) {
            if (!Laya.Browser.onTBMiniGame)
                return;
            if (this.IsMember) {
                resultCB && resultCB(this.IsMember);
                return;
            }
            let app = getApp();
            if (app["openMember"]) {
                app["openMember"](() => {
                    console.log('关闭入会');
                    resultCB && resultCB(false);
                }, (res) => {
                    console.log('加入会员结果', res);
                    this.ChangeMemberState(res);
                    resultCB && resultCB(res);
                });
            }
        }
        CheckMember(callback) {
            if (!Laya.Browser.onTBMiniGame)
                return;
            console.log('==== checkMember ====');
            let app = getApp();
            if (app["checkMember"]) {
                app["checkMember"]((res) => {
                    console.log('checkMember res', res);
                    this.ChangeMemberState(res);
                    callback && callback(res);
                });
            }
        }
        Share(shareSuccess, shareFail) {
            if (!this.CheckApiLv("showSharePanel"))
                return;
            let app = getApp();
            if (!this.globalVars.shareConfig) {
                console.error('[Share]请先配置分享信息！');
                return;
            }
            let _shareConfig = this.globalVars.shareConfig;
            console.log('_shareConfig', JSON.stringify(_shareConfig));
            if (!_shareConfig['userOpenId']) {
                _shareConfig['userOpenId'] = this.globalVars.userOpenID;
            }
            if (!_shareConfig.activeId) {
                _shareConfig.activeId = app.activeId;
            }
            if (!_shareConfig.activeId) {
                console.error('[Share]请先获取activeId');
                return;
            }
            if (!_shareConfig['userOpenId']) {
                console.error('[Share]请先获取userOpenId');
                return;
            }
            console.log('_shareConfig2', JSON.stringify(_shareConfig));
            app.setShare({
                title: _shareConfig.title,
                desc: _shareConfig.desc,
                imageUrl: _shareConfig.imageUrl,
                path: "pages/index/game?fromId=" + _shareConfig['userOpenId'] + "&activeId=" + _shareConfig.activeId
            });
            if (shareSuccess) {
                app.global["shareSuccess"] = shareSuccess;
            }
            if (shareFail) {
                app.global["shareFail"] = shareFail;
            }
            my.showSharePanel();
            return;
        }
        GetFromID() {
            if (!Laya.Browser.onTBMiniGame) {
                return this.fromId;
            }
            if (this.fromId === undefined) {
                let app = getApp();
                this.fromId = app.fromId || null;
            }
            return this.fromId;
        }
    }
    ModulePlatformAPI_C.myInstance = null;
    ;
    let ModulePlatformAPI = ModulePlatformAPI_C.Instance();

    class uiBaseBagMain extends UI_Main$1 {
        constructor() {
            super(...arguments);
            this._bDataIsReady = false;
            this._bIsShown = false;
            this._bagData = {
                "code": 0,
                "msg": '',
                "data": {
                    "total": 1,
                    "totalPage": 1,
                    "currentPage": 1,
                    "pageData": [
                        {
                            "orderId": "202104261003039887",
                            "icon": "https://www.cico.vip/images/upload/sed.png",
                            "updateTime": 1619431383393,
                            "userId": "AAEUJuVuANh0-OdADmy09-ts",
                            "prizeNumber": 1,
                            "activityId": 1015,
                            "prizePrice": 199,
                            "createTime": 1619431383393,
                            "merchantId": 1007,
                            "prizeName": "实物123123123123123",
                            "price": 12300,
                            "AppKey": "32676443",
                            "Id": "60868fd7ef5071b7e224764a",
                            "state": 1,
                            "prizeType": 1,
                        },
                        {
                            "orderId": "202104261003039887",
                            "icon": "https://www.cico.vip/images/upload/sed.png",
                            "updateTime": 1619431383393,
                            "userId": "AAEUJuVuANh0-OdADmy09-ts",
                            "prizeNumber": 1,
                            "activityId": 1015,
                            "prizePrice": 199,
                            "createTime": 1619431383393,
                            "merchantId": 1007,
                            "prizeName": "特等奖12312312312123123123",
                            "price": 12345,
                            "AppKey": "32676443",
                            "Id": "60868fd7ef5071b7e224764a",
                            "state": 1,
                            "prizeType": 2,
                        }
                    ]
                }
            };
            this.divideData = {
                goods: [],
                coupons: [],
            };
        }
        onConstruct() {
            super.onConstruct();
            this.m_btnGoods.onClick(this, () => {
                ModuleAudio.PlayComonBtnAudio();
                this._LoadBagData('goods');
            });
            this.m_btnCoupon.onClick(this, () => {
                ModuleAudio.PlayComonBtnAudio();
                this._LoadBagData('coupons');
            });
            this.m_ctrlType.setSelectedPage("实物");
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winParamData = this._winHandler.GetParamData();
                this._winHandler.SetHideCallBack(this, this.OnHide);
                this.divideData['goods'] = [];
                this.divideData['coupons'] = [];
                let _type = this.m_ctrlType.selectedPage == '实物' ? 'goods' : 'coupons';
                this._LoadBagData(_type);
                Laya.stage.on('refreshAdress', this, () => {
                    this._LoadBagData('goods', true);
                });
            }
        }
        _LoadBagData(_type, _refresh = false) {
            this.divideData[_type] = [];
            let _show = (_data) => {
                this.divideData[_type] = _data;
                this.OnShow(_type);
            };
            if (ModulePackage.Instance.CanUseNetAPI()) {
                ModulePackage.Instance.SendNetMessage("", "/C/bag/userBag", {
                    pageNumber: 1,
                    pageSize: 999,
                    prizeState: _type == 'goods' ? 1 : 2
                }, "post", this, (data) => {
                    Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);
                    this._winHandler.closeModalWait();
                    _show(data.data.pageData);
                });
                Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
            }
            else {
                _show(this._bagData.data.pageData);
            }
        }
        _OnClick(index, evt) {
            console.log("---------------------------", evt, index);
            ModuleAudio.PlayComonBtnAudio();
            let itemData = this.divideData.goods[index];
            if (itemData.state > 1)
                return;
            let _adrinfo = {};
            _adrinfo.Id = itemData.Id;
            let _showAddress = () => {
                ModulePlatformAPI.ChooseAddress((_success, _info) => {
                    if (!_success) {
                        return;
                    }
                    _adrinfo.name = _info.name;
                    _adrinfo.phone = _info.telNumber;
                    _adrinfo.province = _info.provinceName;
                    _adrinfo.city = _info.cityName;
                    _adrinfo.county = _info.countyName;
                    _adrinfo.street = _info.streetName;
                    _adrinfo.address = _info.detailInfo;
                    console.error('_info_info', _adrinfo);
                    ModulePackage.Instance.PopWindow("baseBag", "InputRewardAdress", {
                        winParamData: _adrinfo
                    });
                });
            };
            ModulePlatformAPI.GetUserInfo((_info) => {
                _info.nickName = _info.nickName;
                _showAddress();
            }, () => {
                _adrinfo.nickName = '未授权';
                _showAddress();
            });
        }
        _OnClickCoupons() {
            ModulePlatformAPI.NavigateToTaobaoPage();
            ModuleAudio.PlayComonBtnAudio();
        }
        showAddress() {
        }
        _OnRenderItem(_typeKey, index, obj) {
            console.log(index, "================================1", _typeKey);
            var prizeItem = obj;
            let itemData = this.divideData[_typeKey][index];
            if (!!itemData) {
                if (_typeKey == 'goods') {
                    prizeItem.m_btnApply.onClick(this, this._OnClick, [index]);
                    prizeItem.m_ctrlType.setSelectedPage('实物');
                }
                else {
                    prizeItem.m_btnApply2.onClick(this, this._OnClickCoupons);
                    prizeItem.m_ctrlType.setSelectedPage('优惠券');
                }
                var name = ModuleTool.getCutString(itemData.prizeName, 15);
                prizeItem.m_txtName.text = name;
                prizeItem.m_txtPrice.setVar("money", (itemData.prizePrice).toFixed(2).toString()).flushVars();
                let _date = new Date(itemData.createTime);
                prizeItem.m_txtBeginTime.setVar("time", `${_date.getFullYear()}-${_date.getMonth() + 1}-${_date.getDate()}`).flushVars();
                prizeItem.m_txtOrderNo.setVar("orderId", itemData.orderId).flushVars();
                prizeItem.m_loadItemHead.url = itemData.icon;
                if (itemData.state <= 1) {
                    prizeItem.m_ctrlSendStatus.setSelectedPage("未申请发货");
                }
                else if (itemData.state == 2) {
                    prizeItem.m_ctrlSendStatus.setSelectedPage("已申请发货");
                }
                else if (itemData.state == 3) {
                    prizeItem.m_ctrlSendStatus.setSelectedPage("已发货");
                }
            }
        }
        OnShow(_typeKey) {
            if (this._winHandler.visible == false)
                return;
            let len = 0;
            try {
                let _list = _typeKey == 'goods' ? this.m_listGift : this.m_listSale;
                if (!!this.divideData[_typeKey]) {
                    len = this.divideData[_typeKey].length;
                }
                if (len > 0) {
                    this.m_ctrlEmptyStatus.setSelectedPage("不为空");
                }
                else {
                    this.m_ctrlEmptyStatus.setSelectedPage("空的");
                }
                _list.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, [_typeKey], false);
                _list.setVirtual();
                _list.numItems = len;
            }
            catch (e) {
                console.log("uiBaseBagMain::OnShow4~~~", e);
            }
            this._winHandler.SetHideCallBack(this, this.OnHide);
        }
        OnHide() {
            console.log("OnHide~~~");
        }
    }

    class UI_InputRewardAdress extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("baseBag", "InputRewardAdress"));
        }
        onConstruct() {
            this.m_frame = (this.getChildAt(0));
            this.m_listPanel = (this.getChildAt(1));
            this.m_btnOk = (this.getChildAt(3));
            this.m_pannelName = (this.getChildAt(7));
            this.m_inputName = (this.getChildAt(8));
            this.m_pannelPhone = (this.getChildAt(9));
            this.m_inputPhone = (this.getChildAt(10));
            this.m_pannelAdress = (this.getChildAt(11));
            this.m_inputAdress = (this.getChildAt(12));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_InputRewardAdress.URL = "ui://ennunbg0ctsq3i";

    class uiInputRewardAdress extends UI_InputRewardAdress {
        constructor() {
            super(...arguments);
            this._bIsShown = false;
        }
        onConstruct() {
            super.onConstruct();
            this.m_btnOk.onClick(this, this._OnOkClick);
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winParamData = this._winHandler.GetParamData();
                this._winHandler.SetShowCallBack(this, this.OnShow);
                this._winHandler.SetHideCallBack(this, this.OnHide);
                {
                    this.m_inputName.text = '' + this._winParamData.name;
                    this.m_inputPhone.text = '' + this._winParamData.phone;
                    this.m_inputAdress.text =
                        this._winParamData.province
                            + this._winParamData.city
                            + this._winParamData.county
                            + this._winParamData.street
                            + this._winParamData.address;
                }
            }
        }
        _OnOkClick() {
            let _nickName = '';
            ModuleAudio.PlayComonBtnAudio();
            let _send = () => {
                let _info = {
                    callBack: (_ok) => {
                        if (_ok) {
                            console.log('确定申请发货');
                            this._winHandler.showModalWait();
                            Laya.timer.once(5000, this._winHandler, this._winHandler.closeModalWait);
                            ModulePackage.Instance.SendNetMessage("", "/C/bag/userConfirm", this._winParamData, "post", this, (data) => {
                                Laya.timer.clear(this._winHandler, this._winHandler.closeModalWait);
                                this._winHandler.closeModalWait();
                                if (data.code == 0) {
                                    Laya.stage.event('refreshAdress');
                                    this._winHandler.hide();
                                }
                            });
                        }
                    }
                };
                ModulePackage.Instance.PopWindow("baseBag", "Alert", {
                    winParamData: _info,
                });
            };
            ModulePlatformAPI.GetUserInfo((_info) => {
                _nickName = _info.nickName;
                _send();
            }, () => {
                _send();
            });
        }
        OnShow() {
            if (this._winHandler.isShowing == false)
                return;
            if (this._bIsShown == true)
                return;
            console.log("OnShow~~~");
            this._bIsShown = true;
        }
        OnHide() {
            Laya.timer.clearAll(this);
            console.log("OnHide~~~");
        }
    }

    class baseBagBinder {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(uiBaseBagMain.URL, uiBaseBagMain);
            fgui.UIObjectFactory.setExtension(uiAddressAlert.URL, uiAddressAlert);
            fgui.UIObjectFactory.setExtension(uiInputRewardAdress.URL, uiInputRewardAdress);
            fgui.UIObjectFactory.setExtension(UI_textInput.URL, UI_textInput);
            fgui.UIObjectFactory.setExtension(UI_prizeItem.URL, UI_prizeItem);
        }
    }

    class ModuleWindow extends fgui.Window {
        constructor(winParamData) {
            super();
            this._winParamData = winParamData;
        }
        doShowAnimation() {
            let _trs = this.contentPane.getTransition("popUp");
            if (_trs) {
                _trs.play(Laya.Handler.create(this, () => {
                    this.onShown();
                }));
            }
            else {
                this.onShown();
            }
        }
        doHideAnimation() {
            ModuleAudio.PlayComonBtnAudio();
            let _trs = this.contentPane.getTransition("packUp");
            if (_trs) {
                _trs.play(Laya.Handler.create(this, () => {
                    this.hideImmediately();
                }));
            }
            else {
                this.hideImmediately();
            }
        }
        onHide() {
            if (!!this._callBackHide)
                this._callBackHide.call(this._callBackHideTarget);
        }
        onShown() {
            super.onShown();
            if (!!this._callBackShow)
                this._callBackShow.call(this._callBackShowTarget);
        }
        SetShowCallBack(thisObj, callBackShow) {
            this._callBackShowTarget = thisObj;
            this._callBackShow = callBackShow;
        }
        SetHideCallBack(thisObj, callBackHide) {
            this._callBackHideTarget = thisObj;
            this._callBackHide = callBackHide;
        }
        GetParamData() {
            return this._winParamData;
        }
    }

    class UI_awardItem extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("rank", "awardItem"));
        }
        onConstruct() {
            this.m_styleCtrl = this.getControllerAt(0);
            this.m_txtRank = (this.getChildAt(0));
            this.m_loadItemHead = (this.getChildAt(2));
            this.m_txtName = (this.getChildAt(3));
            this.m_txtPrice = (this.getChildAt(4));
        }
    }
    UI_awardItem.URL = "ui://qkteqwfpcowj1n";

    class UI_banner extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("rank", "banner"));
        }
        onConstruct() {
            this.m_ctrlActveStatus = this.getControllerAt(0);
            this.m_topLoader = (this.getChildAt(0));
            this.m_numBanner = (this.getChildAt(1));
            this.m_timeBanner = (this.getChildAt(2));
            this.m_txtMaxNum = (this.getChildAt(3));
            this.m_numTxt = (this.getChildAt(4));
            this.m_timeTxt = (this.getChildAt(5));
        }
    }
    UI_banner.URL = "ui://qkteqwfpctsq3a";

    class UI_GetReward extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("rank", "GetReward"));
        }
        onConstruct() {
            this.m_frame = (this.getChildAt(0));
            this.m_loadItemIcon = (this.getChildAt(2));
            this.m_txtItemName = (this.getChildAt(3));
            this.m_btnOk = (this.getChildAt(4));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_GetReward.URL = "ui://qkteqwfpip943j";

    class UI_LastRank extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("rank", "LastRank"));
        }
        onConstruct() {
            this.m_ctrlRewardStatus = this.getControllerAt(0);
            this.m_ctrlLastRankStatus = this.getControllerAt(1);
            this.m_frame = (this.getChildAt(0));
            this.m_listPanel = (this.getChildAt(1));
            this.m_listLastRank = (this.getChildAt(2));
            this.m_listRank = (this.getChildAt(3));
            this.m_myPanel = (this.getChildAt(4));
            this.m_myItem = (this.getChildAt(5));
            this.m_selfItem = (this.getChildAt(6));
            this.m_btnGetReward = (this.getChildAt(7));
            this.m_txtTips = (this.getChildAt(8));
            this.m_btnGetRewardGray = (this.getChildAt(9));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_LastRank.URL = "ui://qkteqwfpcowj1z";

    class UI_lastRankBtn extends fgui.GButton {
        static createInstance() {
            return (fgui.UIPackage.createObject("rank", "lastRankBtn"));
        }
        onConstruct() {
            this.m_isGet = this.getControllerAt(1);
        }
    }
    UI_lastRankBtn.URL = "ui://qkteqwfpcowj1h";

    class UI_rankItem extends fgui.GButton {
        static createInstance() {
            return (fgui.UIPackage.createObject("rank", "rankItem"));
        }
        onConstruct() {
            this.m_ctrlRank = this.getControllerAt(1);
            this.m_ctrlHaveAward = this.getControllerAt(2);
            this.m_ctrlIsSelf = this.getControllerAt(3);
            this.m_nameTxt = (this.getChildAt(1));
            this.m_rankTxt = (this.getChildAt(2));
            this.m_avatarLoader = (this.getChildAt(7));
            this.m_awardBtn = (this.getChildAt(8));
            this.m_scoreTxt = (this.getChildAt(11));
            this.m_score = (this.getChildAt(12));
            this.m_slideIn = this.getTransitionAt(0);
        }
    }
    UI_rankItem.URL = "ui://qkteqwfpc8s24";

    class UI_rankItem2 extends fgui.GButton {
        static createInstance() {
            return (fgui.UIPackage.createObject("rank", "rankItem2"));
        }
        onConstruct() {
            this.m_rank = this.getControllerAt(1);
            this.m_isSelf = this.getControllerAt(2);
            this.m_nameTxt = (this.getChildAt(1));
            this.m_rankTxt = (this.getChildAt(2));
            this.m_avatarLoader = (this.getChildAt(7));
            this.m_scoreTxt = (this.getChildAt(10));
            this.m_slideIn = this.getTransitionAt(0);
        }
    }
    UI_rankItem2.URL = "ui://qkteqwfpip943k";

    class UI_ResultRank extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("rank", "ResultRank"));
        }
        onConstruct() {
            this.m_ctrlFrontStatus = this.getControllerAt(0);
            this.m_frame = (this.getChildAt(0));
            this.m_listPanel = (this.getChildAt(1));
            this.m_listNewRank = (this.getChildAt(2));
            this.m_listRank = (this.getChildAt(3));
            this.m_myPanel = (this.getChildAt(4));
            this.m_txtFornt = (this.getChildAt(5));
            this.m_itemHead = (this.getChildAt(6));
            this.m_txtItemName = (this.getChildAt(7));
            this.m_txtPrice = (this.getChildAt(8));
            this.m_btnItemInfo = (this.getChildAt(9));
            this.m_reward = (this.getChildAt(10));
            this.m_btnOk = (this.getChildAt(11));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_ResultRank.URL = "ui://qkteqwfpctsq3d";

    class UI_selfItem extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("rank", "selfItem"));
        }
        onConstruct() {
            this.m_ctrLastRankStatus = this.getControllerAt(0);
            this.m_myItem = (this.getChildAt(1));
            this.m_lastRankBtn = (this.getChildAt(2));
            this.m_ruleBtn = (this.getChildAt(3));
        }
    }
    UI_selfItem.URL = "ui://qkteqwfpctsq3b";

    class UI_Awards extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("rank", "Awards"));
        }
        onConstruct() {
            this.m_frame = (this.getChildAt(0));
            this.m_listPanel = (this.getChildAt(1));
            this.m_listAwards = (this.getChildAt(2));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_Awards.URL = "ui://qkteqwfpcowj1s";

    class uiAwards extends UI_Awards {
        onConstruct() {
            super.onConstruct();
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._LoadAwardData();
            }
        }
        static GetRankData(_callback) {
            if (uiAwards.cacheData) {
                _callback && _callback(uiAwards.cacheData);
                return;
            }
            if (ModulePackage.Instance.CanUseNetAPI()) {
                ModulePackage.Instance.SendNetMessage("", "/C/rank/prize", {}, "post", this, (data) => {
                    if (data.data && data.data.length > 0) {
                        uiAwards.cacheData = data;
                    }
                    _callback && _callback(data);
                });
            }
            else {
                _callback && _callback({
                    "code": 0,
                    "msg": '',
                    "data": [
                        {
                            prizeId: "643091706250",
                            prizeName: "王者荣耀卡通手办-公孙离",
                            prizePicture: "https://img.alicdn.com/bao/uploaded/i4/2210005895332/O1CN01n5jrMq1pG6UrJzzSC_!!2210005895332.jpg",
                            prizePrice: 0.01,
                            rankBegin: 1,
                            rankEnd: 5
                        }
                    ]
                });
            }
        }
        _LoadAwardData() {
            uiAwards.GetRankData((_data) => {
                this._awardData = _data;
                this.OnShow();
            });
        }
        _OnItemClick(item, index) {
            console.log(index);
            let itemData = this._awardData.data[index];
            console.log(itemData);
            ModulePlatformAPI.OpenShopItemDetail("641416140869");
        }
        _OnRenderItem(index, obj) {
            var rankItem = obj;
            let itemData = this._awardData.data[index];
            if (!!itemData) {
                if (itemData.rankBegin == itemData.rankEnd) {
                    rankItem.m_txtRank.setVar("rank", itemData.rankBegin.toString()).flushVars();
                }
                else {
                    rankItem.m_txtRank.setVar("rank", itemData.rankBegin + '-' + itemData.rankEnd).flushVars();
                }
                rankItem.m_txtName.text = ModuleTool.getCutString(itemData.prizeName, 21);
                rankItem.m_txtPrice.text = '价值：' + itemData.prizePrice.toString() + '元';
                rankItem.m_loadItemHead.url = itemData.prizePicture;
            }
        }
        OnShow() {
            if (this._winHandler.visible == false)
                return;
            console.log("OnShow~~~");
            this.m_listAwards.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, null, false);
            this.m_listAwards.setVirtual();
            this.m_listAwards.numItems = this._awardData.data.length;
            this._winHandler.SetHideCallBack(this, this.OnHide);
        }
        OnHide() {
            console.log("OnHide~~~");
        }
    }

    class uiGetReward extends UI_GetReward {
        onConstruct() {
            super.onConstruct();
            this.m_btnOk.onClick(this, this._OnOkClick);
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._prizeData = this._winHandler.GetParamData();
                this._winHandler.SetShowCallBack(this, this.OnShow);
                this._winHandler.SetHideCallBack(this, this.OnHide);
            }
        }
        _OnOkClick(item) {
            console.log(item);
            this._winHandler.hide();
        }
        OnShow() {
            console.log("OnShow~~~");
            if (this._winHandler.isShowing == false)
                return;
            this.m_loadItemIcon.url = this._prizeData.prizePicture;
            this.m_txtItemName.text = this._prizeData.prizeName;
        }
        OnHide() {
            console.log("OnHide~~~");
        }
    }

    class UI_Alert$1 extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("GeneralInterface", "Alert"));
        }
        onConstruct() {
            this.m_alertCtrl = this.getControllerAt(0);
            this.m_frame = (this.getChildAt(0));
            this.m_framebg = (this.getChildAt(1));
            this.m_tipsTxt = (this.getChildAt(2));
            this.m_noBtn = (this.getChildAt(3));
            this.m_yesBtn = (this.getChildAt(4));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_Alert$1.URL = "ui://c66xycir11ndo3p";

    class uiAlert extends UI_Alert$1 {
        static Show(_info) {
            console.log('uiAlert Show');
            ModulePackage.Instance.PopWindow("GeneralInterface", "Alert", { winParamData: _info });
        }
        static AutoShowActivityState() {
            if (ModuleGlobal.IsActivityOn()) {
                return false;
            }
            let _msg = ModuleGlobal.ActivityStateMsg;
            uiAlert.Show({
                content: _msg
            });
            return true;
        }
        onConstruct() {
            super.onConstruct();
            this.m_yesBtn.onClick(this, () => {
                this._winHandler.hide();
                if (this.myInfo.clickYes) {
                    this.myInfo.clickYes();
                }
            });
            this.m_noBtn.onClick(this, () => {
                this._winHandler.hide();
                if (this.myInfo.clickNo) {
                    this.myInfo.clickNo();
                }
            });
        }
        makeFullScreen() {
            console.log('uiAlert makeFullScreen');
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winHandler.SetShowCallBack(this, this.OnShow);
                this._winHandler.SetHideCallBack(this, this.OnHide);
                this.SetInfo(this._winHandler.GetParamData());
            }
        }
        SetInfo(_info) {
            this.myInfo = _info;
            this.m_tipsTxt.text = _info.content;
            if (_info.clickNo) {
                this.m_alertCtrl.setSelectedPage('确认取消');
            }
            else {
                this.m_alertCtrl.setSelectedPage('确认');
            }
        }
        OnShow() {
            console.log("OnShow~~~");
        }
        OnHide() {
            console.log("OnHide~~~");
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
    }

    var GCurrencyType;
    (function (GCurrencyType) {
        GCurrencyType["times"] = "times";
        GCurrencyType["cutter"] = "cutter";
        GCurrencyType["score"] = "score";
        GCurrencyType["wmScore"] = "wmScore";
        GCurrencyType["cattleGold"] = "cattleGold";
    })(GCurrencyType || (GCurrencyType = {}));
    ;
    class ModuleGlobal_C {
        constructor() {
            this.uid = 'OX5DwwvIn3-E7Ks3NMoPUD3geYo=';
            this.ActivityID = 1048;
            this.nickName = 'test';
            this.avatar = 'https://';
            this.ShopID = 0;
            this.UserOpenID = 0;
            this.ShopOwnerID = 0;
            this.ActivityState = 'on';
            this.ActivityStateMsg = '';
            this.RuleInfo = '游戏规则...';
            this.GoodsList = [
                {
                    goodsId: 1,
                    goodsName: '商品1',
                    pic: '',
                    price: '100',
                    sum: '1',
                },
                {
                    goodsId: 2,
                    goodsName: '商品2',
                    pic: '',
                    price: '200',
                    sum: '2',
                },
            ];
            this.MyCurrency = {
                times: 0,
                cutter: 0,
                score: 0,
                wmScore: 0,
                cattleGold: 0,
            };
            this.isInit = false;
            this._isAllGoodsColelcted = true;
            this.CurrencyEventKey = 'CurrencyEvent_';
        }
        static Instance() {
            if (!this.myInstance) {
                this.myInstance = new ModuleGlobal_C();
            }
            return this.myInstance;
        }
        GetQueryString(name) {
            const r = window.location.hash.split('#params=');
            const str = decodeURIComponent(r[1]);
            const params = str.split('&');
            const data = [];
            for (let i = 0; i < params.length; i++) {
                const item = params[i];
                let value = item.split('=');
                let k = value[0];
                let v = value[1];
                let _a = {};
                _a[k] = v;
                data.push(_a);
            }
            let retValue = '';
            for (const iterator of data) {
                if (iterator[name]) {
                    retValue = iterator[name];
                    break;
                }
            }
            uiAlert.Show({
                content: retValue
            });
            return retValue;
        }
        Init(_callBack) {
            if (this.isInit) {
                return;
            }
            let _l = 2;
            let _finish = (_success) => {
                if (!_success) {
                    return;
                }
                _l--;
                if (_l <= 0) {
                    _callBack && _callBack();
                }
            };
            this.initConfig();
            this.UserLogin(_finish);
            this.GetActivityInfo(_finish);
            setTimeout((v) => {
                this.GetQueryString('uid');
            }, 10000);
        }
        initConfig() {
        }
        UserLogin(_callBack, _getPlatformData = true) {
            console.log("用户登录");
            if (!ModulePackage.Instance.CanUseNetAPI()) {
                _callBack && _callBack(true);
                return;
            }
            let _senddata = {
                nickName: undefined,
                avatar: undefined,
                fromUserOpenId: undefined,
                uid: undefined
            };
            let _send = () => {
                ModulePackage.Instance.SendNetMessage("", "/C/user/login", _senddata, "post", this, (_data) => {
                    if (_data.code != 0) {
                        ModulePlatformAPI.showToast('登录失败:' + _data.msg);
                        setTimeout(() => {
                            _send();
                        }, 5000);
                        return;
                    }
                    this.ActivityID = _data.data.activityId;
                    this.ShopID = _data.data.shopId;
                    this.UserOpenID = _data.data.userOpenId;
                    this.ShopOwnerID = _data.data.sellerId;
                    ModulePlatformAPI.SetGlobal({
                        userOpenID: '' + this.UserOpenID,
                        shopID: '' + this.ShopID,
                        shopOwnerID: this.ShopOwnerID,
                    });
                    _callBack && _callBack(true);
                });
            };
            if (_getPlatformData) {
                _senddata.fromUserOpenId = ModulePlatformAPI.GetFromID();
                _senddata.uid = this.uid;
                _senddata.nickName = this.nickName;
                _senddata.avatar = this.avatar;
                _send();
            }
            else {
                _send();
            }
        }
        ChangeActivityState(_state, _msg) {
            this.ActivityState = _state;
            if (_msg) {
                this.ActivityStateMsg = _msg;
            }
        }
        IsActivityOn() {
            if (this.ActivityState == 'on') {
                return true;
            }
            return false;
        }
        GetActivityInfo(_callBack) {
            console.log("获取活动信息");
            let tryTime = 3;
            let _send = () => {
                ModulePackage.Instance.SendNetMessage("", "/C/activity/info", {}, "post", this, (_data) => {
                    if (_data.code != 0) {
                        ModulePlatformAPI.showToast('获取活动信息失败:' + _data.msg);
                        tryTime--;
                        if (tryTime <= 0) {
                            _callBack && _callBack(false);
                            return;
                        }
                        setTimeout(() => {
                            _send();
                        }, 2000);
                        return;
                    }
                    switch (_data.data.status) {
                        case 0:
                            this.ChangeActivityState('on');
                            this.ActivityState = 'on';
                            break;
                        case 1:
                            this.ChangeActivityState('error', '活动下线了');
                            break;
                        case 2:
                            this.ChangeActivityState('off', '活动已结束,谢谢参与');
                            break;
                        case 3:
                            this.ChangeActivityState('unstart', '活动未开始');
                            break;
                        default:
                            this.ChangeActivityState('error', '活动下线了');
                            break;
                    }
                    if (_data.data.status != 0) {
                        console.error('status', _data.data.status);
                    }
                    this.RuleInfo = _data.data.ruleInfo;
                    ModulePlatformAPI.SetGlobal({
                        shareConfig: {
                            title: _data.data.shareTitle,
                            desc: _data.data.shareInfo,
                            imageUrl: _data.data.sharePic,
                        }
                    });
                    _callBack && _callBack(true);
                });
            };
            _send();
        }
        GetGoodsList(_callBack, _sendInfo, _refresh = true) {
            if (!_refresh && this.GoodsList.length > 0) {
                _callBack && _callBack(true, this.GoodsList);
                return;
            }
            let tryTime = 3;
            let _send = () => {
                ModulePackage.Instance.SendNetMessage("", "/C/operateGoods/getList", _sendInfo, "post", this, (_data) => {
                    if (_data.code != 0) {
                        tryTime--;
                        if (tryTime <= 0) {
                            _callBack && _callBack(false);
                            return;
                        }
                        setTimeout(() => {
                            _send();
                        }, 200);
                        return;
                    }
                    this._isAllGoodsColelcted = true;
                    this.GoodsList = _data.data.pageData;
                    let _curIdx = 0;
                    let _detectCollect = (_finish) => {
                        let _leftN = this.GoodsList.length - _curIdx;
                        let _maxN = _leftN > 5 ? 5 : _leftN;
                        let _curN = 0;
                        let _collectfinish = (_iscollect) => {
                            _curN++;
                            if (!_iscollect && this._isAllGoodsColelcted) {
                                this._isAllGoodsColelcted = false;
                            }
                            if (_curN < _maxN) {
                                return;
                            }
                            _curIdx += _maxN;
                            if (_curIdx < this.GoodsList.length) {
                                _detectCollect(_finish);
                            }
                            else {
                                _finish();
                            }
                        };
                        for (let index = 0; index < _maxN; index++) {
                            const element = this.GoodsList[_curIdx + index];
                            ModulePlatformAPI.CheckGoodsCollectedStatus(element.goodsId, (_iscollect) => {
                                element.isCollected = _iscollect;
                                _collectfinish(_iscollect);
                            });
                        }
                    };
                    _detectCollect(() => {
                        _callBack && _callBack(true, _data.data.pageData);
                    });
                });
            };
            _send();
        }
        get IsAllGoodsColelcted() {
            console.log('IsAllGoodsColelcted', this._isAllGoodsColelcted);
            return this._isAllGoodsColelcted;
        }
        AddRankScore(_score, _callBack) {
            let tryTime = 3;
            let _send = () => {
                ModulePackage.Instance.SendNetMessage("", "/C/rank/commit", { score: _score }, "post", this, (data) => {
                    if (data.code != 0) {
                        tryTime--;
                        if (tryTime <= 0) {
                            _callBack && _callBack(false);
                            return;
                        }
                        setTimeout(() => {
                            _send();
                        }, 200);
                        return;
                    }
                    _callBack && _callBack(true);
                    this.UpdateCurrency(GCurrencyType.wmScore);
                });
            };
            _send();
        }
        ConsumeCurrency(_type, _n = 1, _callBack) {
            if (_type != 'times' && _type != 'cutter') {
                console.error('[消耗货币]不支持此类型', _type);
                _callBack && _callBack(false, this.MyCurrency[_type]);
                return;
            }
            let tryTime = 1;
            let _send = () => {
                ModulePackage.Instance.SendNetMessage("", "/C/user/consumePropAmount", { itemType: _type, num: _n }, "post", this, (data) => {
                    if (data.code != 0) {
                        if (data.code == 98 || data.code == 99) {
                            ModuleGlobal.ChangeActivityState(data.code == 98 ? 'unstart' : 'off', data.msg);
                            _callBack && _callBack(false, this.MyCurrency[_type]);
                            return;
                        }
                        tryTime--;
                        if (tryTime <= 0) {
                            _callBack && _callBack(false, this.MyCurrency[_type]);
                            return;
                        }
                        setTimeout(() => {
                            _send();
                        }, 200);
                        return;
                    }
                    this.CurrencyChange(_type, data.data.amount);
                    _callBack && _callBack(true, this.MyCurrency[_type]);
                });
            };
            _send();
        }
        AddCurrency(_type, _n = 1, _callBack) {
            if (_type != 'score' && _type != 'cattleGold' && _type != GCurrencyType.wmScore) {
                console.error('[增加货币]不支持此类型', _type);
                _callBack && _callBack(false, this.MyCurrency[_type]);
                return;
            }
            let tryTime = 3;
            let _send = () => {
                ModulePackage.Instance.SendNetMessage("", "/C/user/addAmount", { itemType: _type, num: _n }, "post", this, (data) => {
                    if (data.code != 0) {
                        tryTime--;
                        if (tryTime <= 0) {
                            _callBack && _callBack(false, this.MyCurrency[_type]);
                            return;
                        }
                        setTimeout(() => {
                            _send();
                        }, 200);
                        return;
                    }
                    _callBack && _callBack(true, this.CurrencyChange(_type, data.data.amount));
                });
            };
            _send();
        }
        UpdateCurrency(_type, _callBack) {
            let _postName = '';
            if (_type == 'score' || _type == 'cattleGold' || _type == GCurrencyType.wmScore) {
                _postName = '/C/user/getAccount';
            }
            else if (_type == 'times' || _type == 'cutter') {
                _postName = '/C/user/getPropAccount';
            }
            if (_postName == '') {
                console.error('[更新货币数量]不支持此类型', _type);
                return;
            }
            let tryTime = 3;
            let _send = () => {
                ModulePackage.Instance.SendNetMessage("", _postName, { itemType: _type }, "post", this, (data) => {
                    if (data.code != 0) {
                        tryTime--;
                        if (tryTime <= 0) {
                            _callBack && _callBack(false, this.MyCurrency[_type]);
                            return;
                        }
                        setTimeout(() => {
                            _send();
                        }, 200);
                        return;
                    }
                    this.CurrencyChange(_type, data.data.amount);
                    _callBack && _callBack(true, this.MyCurrency[_type]);
                });
            };
            _send();
        }
        ListenCurrencyChange(_type, _caller, _func) {
            Laya.stage.on(this.GetCurrencyListenkey(_type), _caller, _func);
        }
        UnListenCurrencyChange(_type, _caller, _func) {
            Laya.stage.off(this.GetCurrencyListenkey(_type), _caller, _func);
        }
        GetCurrencyListenkey(_type) {
            return this.CurrencyEventKey + _type;
        }
        CurrencyChange(_type, _newAmount) {
            if (this.MyCurrency[_type] == _newAmount) {
                return;
            }
            this.MyCurrency[_type] = _newAmount;
            Laya.stage.event(this.GetCurrencyListenkey(_type), _newAmount);
            return this.MyCurrency[_type];
        }
    }
    ModuleGlobal_C.myInstance = null;
    ;
    let ModuleGlobal = ModuleGlobal_C.Instance();

    class uiLastRank extends UI_LastRank {
        onConstruct() {
            super.onConstruct();
            this.m_btnGetReward.onClick(this, this._OnGetRewardClick);
            this.m_btnGetRewardGray.onClick(this, this._OnGetRewardGrayClick);
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._LoadLastRankData();
            }
        }
        _LoadLastRankData() {
            ModulePackage.Instance.SendNetMessage("", "/C/rank/list", {
                activityId: ModuleGlobal.ActivityID,
                type: "pre",
            }, "post", this, (data) => {
                Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);
                this._winHandler.closeModalWait();
                this._lastRankData = data;
                this.OnShow();
            });
            Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
        }
        _OnGetRewardClick(item) {
            if (!this._lastRankData.data.userRankInfo)
                return;
            let index = this._lastRankData.data.userRankInfo.rankNo - 1;
            let selfData = this._lastRankData.data.userRankList[index];
            console.log(selfData);
            ModulePackage.Instance.PopWindow("rank", "GetReward", { px: 0, py: 0, winParamData: selfData.prizeInfo });
        }
        _OnGetRewardGrayClick(item) {
            console.log(item);
            this._winHandler.hide();
        }
        _OnRenderItem(index, obj) {
            console.log("-------------------:" + index);
            var rankItem = obj;
            let itemData = this._lastRankData.data.userRankList[index];
            if (!!itemData) {
                if (index == 0) {
                    rankItem.m_ctrlRank.setSelectedPage("第一");
                }
                else if (index == 1) {
                    rankItem.m_ctrlRank.setSelectedPage("第二");
                }
                else if (index == 2) {
                    rankItem.m_ctrlRank.setSelectedPage("第三");
                }
                else {
                    rankItem.m_ctrlRank.setSelectedPage("其他");
                }
                rankItem.m_rankTxt.text = itemData.rankNo.toString();
                rankItem.m_nameTxt.text = itemData.nickName;
                rankItem.m_scoreTxt.text = itemData.score.toString();
                rankItem.m_avatarLoader.url = itemData.avatar;
                if (itemData.prizeInfo != null) {
                    rankItem.m_ctrlHaveAward.setSelectedPage("有奖励");
                    rankItem.m_awardBtn.icon = itemData.prizeInfo.prizePicture;
                }
                else {
                    rankItem.m_ctrlHaveAward.setSelectedPage("没有奖励");
                }
            }
        }
        OnShow() {
            console.log("_InitView~~~");
            if (this._winHandler.isShowing == false)
                return;
            try {
                this.m_listLastRank.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, null, false);
                this.m_listLastRank.setVirtual();
                this.m_listLastRank.numItems = this._lastRankData.data.userRankList.length;
                if (this.m_listLastRank.numItems > 0) {
                    this.m_ctrlLastRankStatus.setSelectedPage("有排行");
                }
                else {
                    this.m_ctrlLastRankStatus.setSelectedPage("没有排行");
                }
                if (this._lastRankData.data.rankStatus == 1) {
                    console.log(this._lastRankData.data.rankStatus, "~~~~~~~~~~~~~~~~~~~~~~~~~~1");
                }
                else if (this._lastRankData.data.rankStatus == 2) {
                    console.log(this._lastRankData.data.rankStatus, "~~~~~~~~~~~~~~~~~~~~~~~~~~2");
                    this.m_ctrlRewardStatus.setSelectedPage("有奖励人数不足");
                }
                else {
                    this.m_ctrlRewardStatus.setSelectedPage("无奖励");
                    console.log(this._lastRankData.data.rankStatus, "~~~~~~~~~~~~~~~~~~~~~~~~~~0");
                }
                this._winHandler.SetHideCallBack(this, this.OnHide);
                if (!this._lastRankData.data.userRankInfo) {
                    this.m_ctrlLastRankStatus.setSelectedPage("有排行但无自己排行");
                    return;
                }
                if (this._lastRankData.data.userRankInfo.status == 0) {
                    this.m_ctrlRewardStatus.setSelectedPage("可领奖");
                }
                else {
                    this.m_ctrlRewardStatus.setSelectedPage("已领奖");
                }
                let index = this._lastRankData.data.userRankInfo.rankNo - 1;
                let selfData = this._lastRankData.data.userRankList[index];
                this.m_myItem.m_rankTxt.text = selfData.rankNo.toString();
                if (index == 0) {
                    this.m_myItem.m_ctrlRank.setSelectedPage("第一");
                }
                else if (index == 1) {
                    this.m_myItem.m_ctrlRank.setSelectedPage("第二");
                }
                else if (index == 2) {
                    this.m_myItem.m_ctrlRank.setSelectedPage("第三");
                }
                else {
                    this.m_myItem.m_ctrlRank.setSelectedPage("其他");
                }
                this.m_myItem.m_rankTxt.text = selfData.rankNo.toString();
                this.m_myItem.m_nameTxt.text = selfData.nickName;
                this.m_myItem.m_scoreTxt.text = selfData.score.toString();
                this.m_myItem.m_avatarLoader.url = selfData.avatar;
                if (selfData.prizeInfo != null) {
                    this.m_myItem.m_ctrlHaveAward.setSelectedPage("有奖励");
                    this.m_myItem.m_awardBtn.icon = selfData.prizeInfo.prizePicture;
                }
                else {
                    this.m_myItem.m_ctrlHaveAward.setSelectedPage("没有奖励");
                }
            }
            catch (e) {
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", e);
            }
        }
        OnHide() {
            console.log("OnHide~~~");
        }
    }

    class UI_Main$2 extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("rank", "Main"));
        }
        onConstruct() {
            this.m_ctrlOkButtonStatus = this.getControllerAt(0);
            this.m_frame = (this.getChildAt(0));
            this.m_inviteBtn = (this.getChildAt(1));
            this.m_topLoader = (this.getChildAt(2));
            this.m_myPanel = (this.getChildAt(3));
            this.m_noneTxt = (this.getChildAt(4));
            this.m_listPanel = (this.getChildAt(5));
            this.m_curList = (this.getChildAt(6));
            this.m_listRank = (this.getChildAt(7));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_Main$2.URL = "ui://qkteqwfpc8s20";

    const SkinsConfig = {
        beginLogo: { url: '', },
        bgImage: { url: '', },
        integralIcon: { url: '', },
        logo: { url: '', },
        ruleIcon: { url: '', },
        rankingIcon: { url: '', },
        numberIcon: { url: '', },
        StartIcon: { url: '', },
        rankingBanner: { url: '', },
        prizeIcon: { url: '', },
        gameBgImage: { url: '', },
        honeybeeIcon: { url: '', },
        myPrize: { url: '', },
    };
    const skinJsonConfig = {
        path: 'https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/normal/configs/skinConfig.json',
        version: 'normal',
    };
    let jsonPath = 'CustomConfig/CustomData.json';
    class ModuleSkins_C {
        constructor() {
            this.isInit = false;
        }
        static Instance() {
            if (!this.myInstance) {
                this.myInstance = new ModuleSkins_C();
            }
            return this.myInstance;
        }
        Init(_callBack) {
            if (this.isInit) {
                return;
            }
            this.getJsonPath(() => {
                this.getServerConfig(() => {
                    this.preloadAllSkin(_callBack);
                });
            });
        }
        ChangeSkin(_image, _kind) {
            let _url = this.getUrl(_kind);
            if (!_url) {
                return;
            }
            if (_image instanceof fgui.GLoader) {
                _image.url = _url;
            }
            else if (_image instanceof Laya.Image) {
                _image.skin = _url;
            }
            else if (_image instanceof Laya.Sprite) {
                _image.texture = Laya.loader.getRes(_url);
            }
            else {
                console.error('未处理的皮肤类型：', _image);
            }
        }
        ChangeFguiICON(_item, _kind) {
            let _url = this.getUrl(_kind);
            if (!_url) {
                return;
            }
            _item.icon = _url;
        }
        getJsonPath(_callback) {
            let _tryTime = 3;
            let _toload = () => {
                let _p = skinJsonConfig.path + '?r=' + Date.now();
                Laya.loader.load(_p, Laya.Handler.create(this, (info) => {
                    if (info) {
                        console.log('getJsonPath', _p, info);
                        let _data = info[skinJsonConfig.version];
                        if (_data && _data != '') {
                            jsonPath = _data;
                        }
                        _callback();
                    }
                    else {
                        if (_tryTime <= 0) {
                            _callback();
                            return;
                        }
                        _tryTime--;
                        _toload();
                    }
                }));
            };
            _toload();
        }
        getServerConfig(_finish) {
            let _p = jsonPath + '?r=' + Date.now();
            let _toload = () => {
                Laya.loader.load(_p, Laya.Handler.create(this, (info) => {
                    if (info) {
                        this.parseJson(info);
                        _finish && _finish();
                    }
                    else {
                        setTimeout(() => {
                            _toload();
                        }, 200);
                    }
                }));
            };
            _toload();
        }
        parseJson(_json) {
            for (const pageInfo of _json) {
                let _custom = pageInfo['custom'];
                if (!_custom) {
                    console.error('未发现数据信息', pageInfo.key, pageInfo.name);
                    continue;
                }
                console.log(`--------------数据页[${pageInfo.key}:${pageInfo.name}]----------------`);
                for (const itemInfo of _custom) {
                    if (itemInfo.type != 'uploadImage') {
                        continue;
                    }
                    let _imageinfo = itemInfo['uploadImage_name'];
                    if (!_imageinfo) {
                        console.error('没有图片信息', itemInfo.uuid, itemInfo.title);
                        continue;
                    }
                    if (!SkinsConfig[itemInfo.uuid]) {
                        console.error('代码中没有响应此图片', itemInfo.uuid, itemInfo.title);
                        continue;
                    }
                    console.log('获得皮肤: ', itemInfo.title);
                    SkinsConfig[itemInfo.uuid].url = _imageinfo.value;
                }
                console.log(`--------------数据页(结束)----------------`);
            }
        }
        preloadAllSkin(_finish) {
            console.log('preloadAllSkin', SkinsConfig);
            let _resarr = [];
            for (const key in SkinsConfig) {
                if (SkinsConfig[key].url == '') {
                    continue;
                }
                _resarr.push(SkinsConfig[key].url);
            }
            console.log('preloadAllSkin _resarr', _resarr);
            let _toload = () => {
                Laya.loader.load(_resarr, Laya.Handler.create(this, (isSuccess) => {
                    if (isSuccess) {
                        console.log('预加载皮肤[完成]');
                        _finish && _finish();
                    }
                    else {
                        _toload();
                    }
                }));
            };
            _toload();
        }
        getUrl(_kind) {
            if (!(_kind in SkinsConfig)) {
                return null;
            }
            let _url = SkinsConfig[_kind].url;
            if (!_url) {
                return null;
            }
            return _url;
        }
    }
    ModuleSkins_C.myInstance = null;
    ;
    let ModuleSkins = ModuleSkins_C.Instance();

    class uiRankMain extends UI_Main$2 {
        onConstruct() {
            super.onConstruct();
            this.m_inviteBtn.onClick(this, () => {
                ModuleAudio.PlayComonBtnAudio();
                ModulePackage.Instance.SendMessage("rank", "task", "show");
            });
            this.m_myPanel.m_ruleBtn.onClick(this, () => {
                ModulePackage.Instance.PopWindow("rank", "Awards");
                ModuleAudio.PlayComonBtnAudio();
            });
            this.m_myPanel.m_lastRankBtn.onClick(this, () => {
                ModulePackage.Instance.PopWindow("rank", "LastRank");
                ModuleAudio.PlayComonBtnAudio();
            });
            this.changeSkin();
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._LoadRankData();
                this._winHandler.SetHideCallBack(this, this.OnHide);
            }
        }
        changeSkin() {
            ModuleSkins.ChangeSkin(this.m_topLoader.m_topLoader, 'rankingBanner');
            ModuleSkins.ChangeFguiICON(this.m_myPanel.m_ruleBtn, 'prizeIcon');
        }
        _LoadRankData() {
            this.m_curList.visible = false;
            this.m_topLoader.m_timeTxt.visible = false;
            let _getdata = (_data) => {
                console.log('_getdata', _data);
                this._rankData = _data;
                this.OnShow();
            };
            if (ModulePackage.Instance.CanUseNetAPI()) {
                ModulePackage.Instance.SendNetMessage("", "/C/rank/list", {
                    activityId: ModuleGlobal.ActivityID,
                    type: "now",
                }, "post", this, (data) => {
                    Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);
                    this._winHandler.closeModalWait();
                    _getdata(data);
                });
                Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
            }
            else {
                _getdata({
                    "code": 0,
                    "msg": '',
                    "data": {
                        "rankInfo": {
                            "users": 123,
                            "lotteryUsers": 30
                        },
                        "userRankList": [{
                                "rankNo": 1,
                                "userOpenId": 'string',
                                "nickName": '第一名',
                                "avatar": '',
                                "score": 100,
                            },
                            {
                                "rankNo": 2,
                                "userOpenId": 'string',
                                "nickName": '第2名',
                                "avatar": '',
                                "score": 90,
                            },
                            {
                                "rankNo": 1,
                                "userOpenId": 'string',
                                "nickName": '第3名',
                                "avatar": '',
                                "score": 80,
                            },
                        ],
                        "userRankInfo": {
                            "rankNo": 0,
                            "score": 0,
                        },
                    }
                });
            }
        }
        _OnRenderItem(_id, index, item) {
            console.log("------------_OnRenderItem-------:" + index);
            if (item['isInited'] && item['isInited'] == index + 1) {
                return;
            }
            console.log("_OnRenderItem:---22", index);
            item['isInited'] = index + 1;
            var rankItem = item;
            let itemData = this._rankData.data.userRankList[index];
            if (!!itemData) {
                if (index == 0) {
                    rankItem.m_ctrlRank.setSelectedPage("第一");
                }
                else if (index == 1) {
                    rankItem.m_ctrlRank.setSelectedPage("第二");
                }
                else if (index == 2) {
                    rankItem.m_ctrlRank.setSelectedPage("第三");
                }
                else {
                    rankItem.m_ctrlRank.setSelectedPage("其他");
                }
                rankItem.m_rankTxt.text = itemData.rankNo.toString();
                rankItem.m_nameTxt.text = itemData.nickName;
                rankItem.m_scoreTxt.text = itemData.score.toString();
                let _avatar = 'ui://qkteqwfpctsq32';
                if (itemData.avatar && itemData.avatar.indexOf('http') >= 0) {
                    _avatar = itemData.avatar;
                }
                rankItem.m_avatarLoader.url = _avatar;
                if (itemData.prizeInfo != null) {
                    rankItem.m_ctrlHaveAward.setSelectedPage("有奖励");
                    rankItem.m_awardBtn.icon = itemData.prizeInfo.prizePicture;
                }
                else {
                    rankItem.m_ctrlHaveAward.setSelectedPage("没有奖励");
                }
            }
            let _action = uiRankMain.curRenderID == _id;
            item.visible = !_action;
            if (_action) {
                Laya.timer.once(index * 150, this, () => {
                    item.visible = true;
                    item.x = item.width;
                    Laya.Tween.to(item, { x: 0 }, 200);
                });
            }
        }
        OnShow() {
            console.log("OnShow~~~");
            if (!this._winHandler || this._winHandler.visible == false)
                return;
            console.log("_InitView~~~");
            this.m_curList.visible = true;
            this.m_myPanel.m_ctrLastRankStatus.setSelectedPage('不显示');
            if (this._rankData.data.rankInfo.lotteryEndTime && this._rankData.data.rankInfo.lotteryEndTime > 0) {
                this.m_topLoader.m_timeTxt.visible = true;
                let surviveTime = this._rankData.data.rankInfo.lotteryEndTime - new Date().getTime();
                if (surviveTime <= 0) {
                    this.m_topLoader.m_timeTxt.text = '已经开奖喽~';
                }
                else {
                    this.m_topLoader.m_timeTxt.setVar("time", ModuleTool.SurviveTimeToString(surviveTime / 1000)).flushVars();
                    Laya.timer.loop(1000, this, this._UpdateSurviveTime);
                }
            }
            this.m_topLoader.m_numTxt.setVar("num", this._rankData.data.rankInfo.users.toString()).flushVars();
            this.m_topLoader.m_txtMaxNum.setVar("num", this._rankData.data.rankInfo.lotteryUsers.toString()).flushVars();
            uiRankMain.curRenderID++;
            this.m_curList.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, [uiRankMain.curRenderID], false);
            this.m_curList.setVirtual();
            this.m_curList.numItems = !!this._rankData.data.userRankList ? this._rankData.data.userRankList.length : 0;
            uiRankMain.curRenderID++;
            if (this._rankData.data.userRankInfo && this._rankData.data.userRankInfo.rankNo > 0
                && this._rankData.data.userRankInfo.rankNo <= this._rankData.data.userRankList.length) {
                let index = this._rankData.data.userRankInfo.rankNo - 1;
                let selfData = this._rankData.data.userRankList[index];
                this.m_myPanel.m_myItem.m_rankTxt.setScale(1, 1);
                this.m_myPanel.m_myItem.m_rankTxt.text = selfData.rankNo.toString();
                if (selfData.nickName) {
                    this.m_myPanel.m_myItem.m_nameTxt.text = selfData.nickName;
                }
                else {
                    ModulePlatformAPI.GetUserInfo((_info) => {
                        this.m_myPanel.m_myItem.m_nameTxt.text = _info.nickName;
                        this.m_myPanel.m_myItem.m_avatarLoader.url = _info.avatar;
                    }, () => {
                        this.m_myPanel.m_myItem.m_avatarLoader.url = 'ui://qkteqwfpctsq32';
                        this.m_myPanel.m_myItem.m_nameTxt.text = '自己';
                    });
                }
                this.m_myPanel.m_myItem.m_scoreTxt.text = selfData.score.toString();
                let _avatar = 'ui://qkteqwfpctsq32';
                if (selfData.avatar && selfData.avatar.indexOf('http') >= 0) {
                    _avatar = selfData.avatar;
                }
                this.m_myPanel.m_myItem.m_avatarLoader.url = _avatar;
            }
            else {
                this.m_myPanel.m_myItem.m_rankTxt.setScale(0.7, 0.7);
                this.m_myPanel.m_myItem.m_rankTxt.text = '未上榜';
                this.m_myPanel.m_myItem.m_scoreTxt.text = '' + ModuleGlobal.MyCurrency.wmScore;
                ModulePlatformAPI.GetUserInfo((_info) => {
                    this.m_myPanel.m_myItem.m_nameTxt.text = _info.nickName;
                    this.m_myPanel.m_myItem.m_avatarLoader.url = _info.avatar;
                }, () => {
                    this.m_myPanel.m_myItem.m_avatarLoader.url = 'ui://qkteqwfpctsq32';
                });
            }
        }
        _UpdateSurviveTime() {
            let surviveTime = this._rankData.data.rankInfo.lotteryEndTime - new Date().getTime();
            this.m_topLoader.m_timeTxt.setVar("time", ModuleTool.SurviveTimeToString(surviveTime / 1000)).flushVars();
        }
        OnHide() {
            console.log("OnHide~~~");
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
            Laya.Tween.clearAll(this);
        }
    }
    uiRankMain.curRenderID = 0;

    class uiResultRank extends UI_ResultRank {
        constructor() {
            super(...arguments);
            this._bDataIsReady = false;
            this._bIsShown = false;
            this._bIsReStart = false;
        }
        onConstruct() {
            super.onConstruct();
            this.m_btnOk.onClick(this, () => {
                this._bIsReStart = true;
                this._winHandler.hide();
            });
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winParamData = this._winHandler.GetParamData();
                this._winHandler.SetShowCallBack(this, this.OnShow);
                this._winHandler.SetHideCallBack(this, this.OnHide);
                this.m_frame.title = this._winParamData.title;
                this._CommitRankScore();
            }
        }
        _CommitRankScore() {
            ModulePackage.Instance.SendNetMessage("", "/C/rank/commit", {
                score: this._winParamData.score,
            }, "post", this, (data) => {
                this._newRankData = data;
                ModulePackage.Instance.SendNetMessage("", "/C/rank/list", {
                    activityId: ModuleGlobal.ActivityID,
                    type: "now",
                }, "post", this, (data) => {
                    Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);
                    this._winHandler.closeModalWait();
                    this._rankData = data;
                    this._bDataIsReady = true;
                    this.OnShow();
                });
            });
            Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
        }
        _OnItemInfoClick(evt, itemUrl) {
            console.log(evt, itemUrl);
            ModulePlatformAPI.OpenShopItemDetail("641416140869");
        }
        _OnRenderItem(index, obj) {
            console.log("-------------------:" + index);
            var rankItem = obj;
            let itemData = this._rankData.data.userRankList[index];
            if (!!itemData) {
                if (index == 0) {
                    rankItem.m_rank.setSelectedPage("第一");
                }
                else if (index == 1) {
                    rankItem.m_rank.setSelectedPage("第二");
                }
                else if (index == 2) {
                    rankItem.m_rank.setSelectedPage("第三");
                }
                else {
                    rankItem.m_rank.setSelectedPage("其他");
                }
                let currRankIndex = this._rankData.data.userRankInfo.rankNo - 1;
                if (currRankIndex == index) {
                    rankItem.m_isSelf.setSelectedPage("自己排行");
                }
                else {
                    rankItem.m_isSelf.setSelectedPage("其他人");
                }
                rankItem.m_rankTxt.text = itemData.rankNo.toString();
                rankItem.m_nameTxt.text = itemData.nickName;
                rankItem.m_scoreTxt.text = itemData.score.toString();
                rankItem.m_avatarLoader.url = itemData.avatar;
            }
        }
        _GetNextGiftNum() {
            let currRankIndex = this._rankData.data.userRankInfo.rankNo - 1;
            let nextRankIndex = 0;
            for (let i = currRankIndex - 1; i > 0; i--) {
                let itemData = this._rankData.data.userRankList[i];
                if (itemData.prizeInfo != null) {
                    nextRankIndex = i;
                    break;
                }
            }
            return currRankIndex - nextRankIndex;
        }
        OnShow() {
            if (this._winHandler.isShowing == false)
                return;
            if (this._bDataIsReady == false)
                return;
            if (this._bIsShown == true)
                return;
            console.log("OnShow~~~");
            let num = this._GetNextGiftNum();
            if (num == 0) {
                this.m_ctrlFrontStatus.setSelectedPage("保持");
                this.m_txtFornt.setVar("num", this._rankData.data.userRankInfo.rankNo.toString()).flushVars();
            }
            else {
                this.m_ctrlFrontStatus.setSelectedPage("前进");
                this.m_txtFornt.setVar("num", num.toString()).flushVars();
            }
            let currRankIndex = this._rankData.data.userRankInfo.rankNo - 1;
            let itemData = this._rankData.data.userRankList[currRankIndex - num];
            console.log("-----------------------------------------------1", itemData);
            try {
                this.m_txtItemName.text = itemData.prizeInfo.prizeName;
                console.log("-----------------------------------------------2");
                this.m_txtPrice.setVar("money", itemData.prizeInfo.prizePrice.toString()).flushVars();
                console.log("-----------------------------------------------3");
                this.m_itemHead.url = itemData.prizeInfo.prizePicture;
                console.log("-----------------------------------------------4");
                this.m_btnItemInfo.onClick(this, this._OnItemInfoClick, [itemData.prizeInfo.prizeUrl]);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~1");
                this.m_listNewRank.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, null, false);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~2");
                this.m_listNewRank.setVirtual();
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~3");
                this.m_listNewRank.numItems = this._rankData.data.userRankList.length;
                console.log(this.m_listNewRank.numItems, "~~~~~~~~~~~~4", this.m_listNewRank);
            }
            catch (e) {
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~5", e);
            }
            this._bIsShown = true;
        }
        OnHide() {
            console.log("OnHide~~~");
            if (!!this._winParamData && !!this._winParamData.target && !!this._winParamData.callBack) {
                this._winParamData.callBack.call(this._winParamData.target, this._bIsReStart);
            }
        }
    }

    class RankBinder {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(uiRankMain.URL, uiRankMain);
            fgui.UIObjectFactory.setExtension(uiAwards.URL, uiAwards);
            fgui.UIObjectFactory.setExtension(UI_ResultRank.URL, uiResultRank);
            fgui.UIObjectFactory.setExtension(UI_LastRank.URL, uiLastRank);
            fgui.UIObjectFactory.setExtension(UI_GetReward.URL, uiGetReward);
            fgui.UIObjectFactory.setExtension(UI_rankItem.URL, UI_rankItem);
            fgui.UIObjectFactory.setExtension(UI_lastRankBtn.URL, UI_lastRankBtn);
            fgui.UIObjectFactory.setExtension(UI_awardItem.URL, UI_awardItem);
            fgui.UIObjectFactory.setExtension(UI_banner.URL, UI_banner);
            fgui.UIObjectFactory.setExtension(UI_selfItem.URL, UI_selfItem);
            fgui.UIObjectFactory.setExtension(UI_rankItem2.URL, UI_rankItem2);
        }
    }

    class UI_MyGiftButton extends fgui.GButton {
        static createInstance() {
            return (fgui.UIPackage.createObject("gift", "MyGiftButton"));
        }
        onConstruct() {
            this.m_bubbleBG = (this.getChildAt(1));
            this.m_bagNText = (this.getChildAt(2));
        }
    }
    UI_MyGiftButton.URL = "ui://txopsw7as0olf";

    class UI_scoreExchangeBtn extends fgui.GButton {
        static createInstance() {
            return (fgui.UIPackage.createObject("gift", "scoreExchangeBtn"));
        }
        onConstruct() {
            this.m_jifenText = (this.getChildAt(7));
        }
    }
    UI_scoreExchangeBtn.URL = "ui://txopsw7as0oli";

    class UI_exchangeFail extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("gift", "exchangeFail"));
        }
        onConstruct() {
            this.m_bg = (this.getChildAt(0));
            this.m_closeBtn = (this.getChildAt(3));
            this.m_okBtn = (this.getChildAt(4));
            this.m_failText = (this.getChildAt(6));
        }
    }
    UI_exchangeFail.URL = "ui://txopsw7as0ol7";

    var FailType;
    (function (FailType) {
        FailType[FailType["unKnow"] = 0] = "unKnow";
        FailType[FailType["noData"] = 1] = "noData";
        FailType[FailType["noScore"] = 2] = "noScore";
        FailType[FailType["noRepertory"] = 3] = "noRepertory";
        FailType[FailType["noTime"] = 4] = "noTime";
        FailType[FailType["activityEnd"] = 5] = "activityEnd";
        FailType[FailType["activityUnstart"] = 6] = "activityUnstart";
    })(FailType || (FailType = {}));
    const failText = [
        '兑换失败',
        '数据查询失败',
        '积分不足',
        '库存不足',
        '兑换已达上限',
        '活动已结束',
        '活动未开始',
    ];
    class uiexchangeFail extends UI_exchangeFail {
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
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        Hide() {
            if (!this.visible) {
                return;
            }
            this.m_bg.visible = false;
            ModuleTool.ActionPopOut(this, () => {
                this.visible = false;
            });
        }
        clickBtn() {
            let _closeBtn = () => {
                this.Hide();
                ModuleAudio.PlayComonBtnAudio();
            };
            this.m_closeBtn.onClick(this, _closeBtn);
            this.m_okBtn.onClick(this, _closeBtn);
        }
        listenText() {
        }
        SetInfo(_type) {
            if (_type >= failText.length) {
                console.error('[exchangeFail]没有此提示文本', _type);
                return;
            }
            console.log('exchangeFail SetInfo', _type, failText[_type]);
            this.m_failText.text = failText[_type];
            this.Show();
        }
    }

    class UI_exchangeConfirm extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("gift", "exchangeConfirm"));
        }
        onConstruct() {
            this.m_bg = (this.getChildAt(0));
            this.m_closeBtn = (this.getChildAt(4));
            this.m_info = (this.getChildAt(5));
            this.m_exchangeBtn = (this.getChildAt(7));
            this.m_needScoreText = (this.getChildAt(6));
        }
    }
    UI_exchangeConfirm.URL = "ui://txopsw7as0ol6";

    class exchangeConfirm extends UI_exchangeConfirm {
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
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        close(_callBack) {
            if (!this.visible) {
                return;
            }
            this.m_bg.visible = false;
            ModuleTool.ActionPopOut(this, () => {
                _callBack && _callBack();
                this.Hide();
            });
        }
        clickBtn() {
            this.m_closeBtn.onClick(this, () => {
                ModuleAudio.PlayComonBtnAudio();
                this.close();
            });
            this.m_exchangeBtn.onClick(this, () => {
                ModuleAudio.PlayComonBtnAudio();
                let _winHandler = this.parent._winHandler;
                if (_winHandler) {
                    _winHandler.showModalWait();
                }
                this.ExchangeAward((_code) => {
                    console.log('exchangeBtn', _code);
                    if (_winHandler) {
                        _winHandler.closeModalWait();
                    }
                    this.close(() => {
                        if (_code == 0) {
                            console.log('exchangeSuccess myInfo', this.myInfo);
                            Laya.stage.event('exchangeSuccess', this.myInfo);
                        }
                        else {
                            const code2Type = [
                                [[-1, -2], [FailType.noData]],
                                [[-5], [FailType.noScore]],
                                [[-6], [FailType.noRepertory]],
                                [[-7], [FailType.noTime]],
                                [[98], [FailType.activityUnstart]],
                                [[99], [FailType.activityEnd]],
                            ];
                            let _failType = FailType.unKnow;
                            for (const info of code2Type) {
                                for (const code of info[0]) {
                                    if (code == _code) {
                                        _failType = info[1];
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
                });
            });
        }
        listenText() {
        }
        SetInfo(_info, _parentWinHandler) {
            console.log('exchangeConfirm SetInfo', _info);
            this.myInfo = _info;
            this.m_needScoreText.setVar("const", "" + _info.price).flushVars();
            this.parentWinHandler = _parentWinHandler;
            this.m_info.SetInfo(_info.title, _info.url);
            this.Show();
        }
        ExchangeAward(_callback) {
            if (Laya.Browser.onTBMiniGame) {
                this.parentWinHandler.showModalWait();
                let _closeModalWait = () => {
                    Laya.timer.clear(this, _closeModalWait);
                    this.parentWinHandler.closeModalWait();
                };
                Laya.timer.once(10000, this, _closeModalWait);
                ModulePackage.Instance.SendNetMessage("", "/C/integral/swap", {
                    Id: this.myInfo.id,
                    number: 1,
                    itemType: GCurrencyType.wmScore
                }, "post", this, (data) => {
                    _closeModalWait();
                    console.log("getTaskList", data);
                    if (data.code != 0) {
                        let _code = -5;
                        if (data.code == 98 && data.code == 99) {
                            _code = data.code;
                            ModuleGlobal.ChangeActivityState(data.code == 98 ? 'unstart' : 'off', data.msg);
                        }
                        _callback && _callback(_code);
                        return;
                    }
                    _callback && _callback(0);
                    ModuleGlobal.UpdateCurrency(GCurrencyType.wmScore);
                });
            }
            else {
                _callback(0);
            }
        }
    }

    class UI_exchangeSuccess extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("gift", "exchangeSuccess"));
        }
        onConstruct() {
            this.m_bg = (this.getChildAt(0));
            this.m_closeBtn = (this.getChildAt(3));
            this.m_info = (this.getChildAt(4));
            this.m_goBtn = (this.getChildAt(5));
        }
    }
    UI_exchangeSuccess.URL = "ui://txopsw7as0ola";

    class uiexchangeSuccess extends UI_exchangeSuccess {
        onConstruct() {
            super.onConstruct();
            this.clickBtn();
        }
        Show() {
            this.listenText();
            this.visible = true;
            this.m_bg.visible = false;
            ModuleTool.ActionPopIn(this, () => {
                this.m_bg.visible = true;
            });
        }
        Hide() {
            this.visible = false;
            this.onEnd();
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        close(_callBack) {
            if (!this.visible) {
                return;
            }
            this.m_bg.visible = false;
            ModuleTool.ActionPopOut(this, () => {
                _callBack && _callBack();
                this.Hide();
            });
        }
        clickBtn() {
            this.m_closeBtn.onClick(this, () => {
                this.close();
                ModuleAudio.PlayComonBtnAudio();
            });
            this.m_goBtn.onClick(this, () => {
                this.close(() => {
                    Laya.stage.event('gotoBag');
                });
                ModuleAudio.PlayComonBtnAudio();
            });
        }
        listenText() {
        }
        SetInfo(_info) {
            console.log('uiexchangeSuccess _info', _info);
            console.log('uiexchangeSuccess m_info', this.m_info);
            this.myInfo = _info;
            this.m_info.SetInfo(_info.title, _info.url);
            this.Show();
        }
    }

    class UI_GiftInfo extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("gift", "GiftInfo"));
        }
        onConstruct() {
            this.m_imageLoader = (this.getChildAt(0));
            this.m_describText = (this.getChildAt(1));
        }
    }
    UI_GiftInfo.URL = "ui://txopsw7as0olc";

    class uiGiftInfo extends UI_GiftInfo {
        SetInfo(_title, _url) {
            this.m_describText.text = ModuleTool.getCutString(_title, 18);
            this.m_imageLoader.url = _url;
            this.visible = true;
        }
    }

    class UI_GiftItem extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("gift", "GiftItem"));
        }
        onConstruct() {
            this.m_leftNText = (this.getChildAt(2));
            this.m_info = (this.getChildAt(3));
            this.m_exchangeBtn = (this.getChildAt(4));
            this.m_exchangeHint1 = (this.getChildAt(5));
            this.m_exchangeHint2 = (this.getChildAt(6));
        }
    }
    UI_GiftItem.URL = "ui://txopsw7as0old";

    class uiGiftItem extends UI_GiftItem {
        constructor() {
            super(...arguments);
            this.myInfo = null;
        }
        onConstruct() {
            super.onConstruct();
            this.clickBtn();
            this.listenText();
        }
        removeFromParent() {
            this.onEnd();
            super.removeFromParent();
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        SetInfo(_info) {
            this.myInfo = _info;
            this.ChangeLeft(0, _info.leftN);
            this.visible = true;
            this.m_info.SetInfo(_info.title, _info.pic_url);
            this.m_exchangeBtn.title = '' + _info.price;
            Laya.stage.on('GiftItemsubLeft' + _info.num_iid, this, () => {
                this.ChangeLeft(-1);
            });
        }
        clickBtn() {
            this.m_exchangeBtn.onClick(this, () => {
                ModuleAudio.PlayComonBtnAudio();
                console.log('exchangeBtn');
                if (uiAlert.AutoShowActivityState()) {
                    return;
                }
                let _itemData = {
                    id: this.myInfo.num_iid,
                    title: this.myInfo.title,
                    url: this.myInfo.pic_url,
                    price: this.myInfo.price,
                };
                Laya.stage.event('exchangePopup', _itemData);
            });
        }
        listenText() {
        }
        ChangeLeft(_add, _set) {
            if (!this.myInfo) {
                console.error('未初始化数据信息-myInfo');
                return;
            }
            if (_set != undefined) {
                this.myInfo.leftN = _set;
            }
            else {
                this.myInfo.leftN += _add;
                this.myInfo.getN -= _add;
            }
            this.m_leftNText.setVar('count', '' + this.myInfo.leftN).flushVars();
            let _haveLeft = this.myInfo.leftN > 0;
            let _canget = this.myInfo.limitN <= 0 || this.myInfo.getN < this.myInfo.limitN;
            this.m_exchangeHint2.visible = !_haveLeft;
            this.m_exchangeHint1.visible = _haveLeft && !_canget;
            this.m_exchangeBtn.enabled = _haveLeft && _canget;
        }
    }

    class UI_Main$3 extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("gift", "Main"));
        }
        onConstruct() {
            this.m_bg = (this.getChildAt(0));
            this.m_frame = (this.getChildAt(1));
            this.m_framebg = (this.getChildAt(2));
            this.m_updateTimeTitle = (this.getChildAt(3));
            this.m_updateTime = (this.getChildAt(4));
            this.m_giftList = (this.getChildAt(5));
            this.m_btnMyGift = (this.getChildAt(6));
            this.m_exchangeConfirm = (this.getChildAt(7));
            this.m_exchangeSuccess = (this.getChildAt(8));
            this.m_exchangeFail = (this.getChildAt(9));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_Main$3.URL = "ui://txopsw7as0olb";

    class uiGiftMain extends UI_Main$3 {
        constructor() {
            super(...arguments);
            this.refreshTime = 0;
        }
        onConstruct() {
            super.onConstruct();
            console.log('onConstructonConstruct');
            this.onStart();
        }
        makeFullScreen() {
            super.makeFullScreen();
            let _anchorX = 0;
            let _anchorY = 0;
            if (this.pivotAsAnchor) {
                _anchorX = this.pivotX;
                _anchorY = this.pivotY;
            }
            this.setXY(_anchorX * this.width, _anchorY * this.height);
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winHandler.SetShowCallBack(this, this.onShow);
                this._winHandler.SetHideCallBack(this, this.onHide);
                this.SetInfo();
            }
        }
        onStart() {
            console.log('onStartonStart');
            this.changeSkin();
            this.m_bubbleBG = this.m_btnMyGift.getChild('bubbleBG').asImage;
            this.m_bagNText = this.m_btnMyGift.getChild('bagNText').asTextField;
            this.clickBtn();
            this.listenText();
            Laya.stage.on('exchangePopup', this, this.ShowExchangePopup);
            Laya.stage.on('exchangeSuccess', this, this.ShowExchangeSuccess);
            Laya.stage.on('exchangeFail', this, this.ShowExchangeFail);
            Laya.stage.on('gotoBag', this, () => {
                console.log('gotoBag');
                ModulePackage.Instance.Show('baseBag', 0, 0, this);
            });
        }
        changeSkin() {
            ModuleSkins.ChangeFguiICON(this.m_btnMyGift, 'myPrize');
        }
        onShow() {
        }
        Show() {
            this.visible = true;
            this.onShow();
        }
        Hide() {
            this.onHide();
            this._winHandler.hide();
        }
        onHide() {
            this.onEnd();
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        SetInfo() {
            this.refreshTime = 0;
            Laya.timer.loop(500, this, this.timeUpdate);
            this.refreshBubbleUI();
            this.RefreshList();
            Laya.stage.event('refreshBubble');
        }
        clickBtn() {
            console.log('clickBtnclickBtn');
            this.m_btnMyGift.onClick(this, () => {
                console.log('btnMyGift');
                Laya.stage.event('gotoBag');
                ModuleAudio.PlayComonBtnAudio();
            });
        }
        listenText() {
        }
        RefreshList() {
            Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
            this.m_giftList.removeChildrenToPool();
            this.GetScoreShopList((_dataList) => {
                Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);
                this._winHandler.closeModalWait();
                this.m_updateTime.visible = _dataList && _dataList.resetConfig.state;
                this.m_updateTimeTitle.visible = this.m_updateTime.visible;
                if (!_dataList) {
                    return;
                }
                if (_dataList.resetConfig.state) {
                    let _date = new Date();
                    let _now = _date.getTime();
                    var year = _date.getFullYear();
                    var month = _date.getMonth() + 1;
                    var date = _date.getDate();
                    let _todayT = `${year}/${(month < 10 ? '0' : '') + month}/${(date < 10 ? '0' : '') + date} ${_dataList.resetConfig.time}`;
                    console.log('_todayT', _todayT);
                    let _refreshT = new Date(_todayT).getTime();
                    if (_refreshT <= _now) {
                        _refreshT += 24 * 60 * 60 * 1000;
                    }
                    this.refreshTime = _refreshT;
                    console.log('refreshTime', this.refreshTime);
                }
                this.m_giftList.removeChildrenToPool();
                for (let index = 0; index < _dataList.rewardList.length; index++) {
                    let _elemete = this.m_giftList.addItemFromPool();
                    _elemete.SetInfo(_dataList.rewardList[index]);
                }
            });
        }
        timeUpdate() {
            if (this.refreshTime > 0) {
                let _dif = this.refreshTime - Date.now();
                if (_dif < 0) {
                    this.RefreshList();
                    return;
                }
                _dif = (_dif / 1000) | 0;
                let _strs = ['', '', ''];
                for (let index = 0; index < 3; index++) {
                    let _s = _dif;
                    if (index < 2) {
                        _s = _dif % 60;
                    }
                    _strs[index] = (_s < 10 ? '0' : '') + _s;
                    _dif = (_dif / 60) | 0;
                }
                this.m_updateTime.text = `${_strs[2]}:${_strs[1]}:${_strs[0]}`;
            }
        }
        ShowExchangePopup(_data) {
            this.m_exchangeConfirm.SetInfo(_data, this._winHandler);
        }
        ShowExchangeSuccess(_data) {
            this.m_exchangeSuccess.SetInfo(_data);
            Laya.stage.event('GiftItemsubLeft' + _data.id);
            Laya.stage.event('refreshBubble');
        }
        ShowExchangeFail(_failType) {
            console.log('ShowExchangeFail', _failType);
            this.m_exchangeFail.SetInfo(_failType);
        }
        refreshBubbleUI() {
            let _refresh = (_data) => {
                console.log('refreshBubbleUI _data', _data);
                let _bagN = _data.bag_num;
                let _havebag = _bagN > 0;
                this.m_bubbleBG.visible = _havebag;
                this.m_bagNText.visible = _havebag;
                if (_havebag) {
                    this.m_bagNText.text = '' + _bagN;
                }
            };
            Laya.stage.on('refreshBubbleUI', this, _refresh);
        }
        GetScoreShopList(_callBack) {
            let _fakedata = [{
                    Id: '111',
                    prize: '奖品名',
                    price: 1.01,
                    alreadyExchange: 0,
                    number: 10,
                    integral: 10,
                    icon: '',
                    exchangeType: 5,
                    state: 'normal',
                },
                {
                    Id: '123',
                    prize: '奖品名2',
                    price: 1.01,
                    alreadyExchange: 1,
                    number: 10,
                    integral: 10,
                    icon: '',
                    exchangeType: 5,
                    state: 'normal',
                }];
            let _getInfo = (_data) => {
                let _dataList = {
                    rewardList: [],
                    resetConfig: {
                        state: false,
                        time: '0',
                    }
                };
                for (const reward of _data) {
                    let _dd = {
                        price: this.ChangeToNumber(reward.integral),
                        leftN: this.ChangeToNumber(reward.number),
                        pic_url: '' + reward.icon,
                        title: '' + reward.prize,
                        num_iid: '' + reward.Id,
                        getN: this.ChangeToNumber(reward.alreadyExchange),
                        limitN: this.ChangeToNumber(reward.exchangeType),
                    };
                    _dataList.rewardList.push(_dd);
                }
                console.log('_getInfo _dataList', _dataList);
                _callBack(_dataList);
            };
            if (ModulePackage.Instance.CanUseNetAPI()) {
                ModulePackage.Instance.SendNetMessage("", "/C/integral/integralList", { pageNumber: 1, pageSize: 999 }, "post", this, (data) => {
                    console.log("integralList", data);
                    if (data.code != 0) {
                        return;
                    }
                    ModuleTool.DetectType('integralList', data.data.pageData, _fakedata);
                    _getInfo(data.data.pageData);
                });
            }
            else {
                _getInfo(_fakedata);
            }
        }
        ChangeToNumber(_v) {
            if (typeof _v == 'number') {
                return _v;
            }
            else if (typeof _v == 'string') {
                return Number(_v);
            }
            console.error('ChangeToNumber错误类型：', _v);
            return 0;
        }
    }

    class giftBinder {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(exchangeConfirm.URL, exchangeConfirm);
            fgui.UIObjectFactory.setExtension(uiexchangeFail.URL, uiexchangeFail);
            fgui.UIObjectFactory.setExtension(uiexchangeSuccess.URL, uiexchangeSuccess);
            fgui.UIObjectFactory.setExtension(uiGiftMain.URL, uiGiftMain);
            fgui.UIObjectFactory.setExtension(uiGiftInfo.URL, uiGiftInfo);
            fgui.UIObjectFactory.setExtension(uiGiftItem.URL, uiGiftItem);
            fgui.UIObjectFactory.setExtension(UI_MyGiftButton.URL, UI_MyGiftButton);
            fgui.UIObjectFactory.setExtension(UI_scoreExchangeBtn.URL, UI_scoreExchangeBtn);
        }
    }

    class UI_ActivityAward extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("activity", "ActivityAward"));
        }
        onConstruct() {
            this.m_frame = (this.getChildAt(0));
            this.m_list = (this.getChildAt(2));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_ActivityAward.URL = "ui://onlm4vwpsbnb11";

    class uiActivityAward extends UI_ActivityAward {
        onConstruct() {
            super.onConstruct();
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winHandler.SetHideCallBack(this, this.onHide);
                this.onStart();
            }
        }
        onStart() {
            this.visible = true;
            this.clickBtn();
            this.listenText();
            this.onShow();
        }
        onShow() {
            this.RefreshList();
        }
        onHide() {
            this.onEnd();
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        clickBtn() {
        }
        listenText() {
        }
        RefreshList() {
            this.m_list.removeChildrenToPool();
            console.error('[uiActivityAward] 未加载数据');
            console.error('this._winHandler', this._winHandler);
            Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
        }
    }

    class UI_ActivityAwardItem extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("activity", "ActivityAwardItem"));
        }
        onConstruct() {
            this.m_rankText = (this.getChildAt(1));
            this.m_imageLoader = (this.getChildAt(2));
            this.m_infoText = (this.getChildAt(3));
            this.m_priceText = (this.getChildAt(4));
        }
    }
    UI_ActivityAwardItem.URL = "ui://onlm4vwpsbnb13";

    class uiActivityAwardItem extends UI_ActivityAwardItem {
        constructor() {
            super(...arguments);
            this.myInfo = null;
        }
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
            Laya.stage.offAllCaller(this);
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
        SetInfo(_info) {
            this.myInfo = _info;
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
            if (_info.title) {
                this.m_infoText.text = _info.title;
            }
            if (typeof _info.price == 'number') {
                this.m_priceText.text = `价值：${_info.price}元`;
            }
            else {
                this.m_priceText.text = '' + _info.price;
            }
            if (!_info.pic_url || _info.pic_url == '' || _info.pic_url.indexOf('http') < 0) {
                this.m_imageLoader.url = 'ui://vzezwp8fpraz11';
            }
            else {
                this.m_imageLoader.url = '' + _info.pic_url;
            }
        }
        RunMoveinAction(_t) {
            this.x = this.width;
            this.Show();
            Laya.Tween.to(this, { x: 0 }, _t);
        }
        clickBtn() {
        }
        listenText() {
        }
    }

    class UI_ActivityEndPopup extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("activity", "ActivityEndPopup"));
        }
        onConstruct() {
            this.m_infoCtr = this.getControllerAt(0);
            this.m_frame = (this.getChildAt(0));
            this.m_goStoreBtn = (this.getChildAt(4));
            this.m_noAward = (this.getChildAt(5));
            this.m_awardRank = (this.getChildAt(11));
            this.m_awardInfo = (this.getChildAt(13));
            this.m_goAwardBtn = (this.getChildAt(14));
            this.m_haveAward = (this.getChildAt(15));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_ActivityEndPopup.URL = "ui://onlm4vwpsbnb10";

    class uiActivityEndPopup extends UI_ActivityEndPopup {
        constructor() {
            super(...arguments);
            this.myinfo = null;
        }
        static AutoShowActivityEnd(_showResultCallback, _closeCallback) {
            if (!ModulePackage.Instance.CanUseNetAPI()) {
                _showResultCallback && _showResultCallback(true);
                ModulePackage.Instance.PopWindow("activity", "ActivityEndPopup", {
                    px: 0, py: 0, winParamData: {
                        haveAward: 0,
                        awardData: {
                            curRank: 0,
                            title: '奖品名',
                        },
                    }
                });
                return;
            }
            ModulePackage.Instance.SendNetMessage("", "/C/rank/lastResult", {
                uid: ModuleGlobal.uid
            }, "post", this, (data) => {
                console.log('/C/rank/lastResult', data);
                let _show = data.code == 0 || data.code == 7007 || data.code == 7008;
                _showResultCallback && _showResultCallback(_show);
                if (_show) {
                    this.closeCallback = _closeCallback;
                    let _haveAward = 2;
                    let _awardData = null;
                    if (data.code == 0) {
                        _haveAward = 0;
                        if (data.data) {
                            _awardData = {
                                curRank: data.data.rankNo,
                                title: data.data.prizeName,
                            };
                        }
                    }
                    else if (data.code == 7008) {
                        _haveAward = 1;
                    }
                    else if (data.code == 7007) {
                        _haveAward = 2;
                    }
                    ModulePackage.Instance.PopWindow("activity", "ActivityEndPopup", {
                        px: 0, py: 0, winParamData: {
                            haveAward: _haveAward,
                            awardData: _awardData,
                        }
                    });
                }
            });
        }
        onConstruct() {
            super.onConstruct();
            this.clickBtn();
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winHandler.SetHideCallBack(this, this.onHide);
                this.onStart();
                this.SetInfo(this._winHandler.GetParamData());
            }
        }
        onStart() {
            this.listenText();
            this.onShow();
        }
        onShow() {
        }
        onHide() {
            Laya.stage.event('refreshBubble');
            this.onEnd();
            uiActivityEndPopup.closeCallback && uiActivityEndPopup.closeCallback();
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        Hide() {
            this.onHide();
        }
        clickBtn() {
            this.m_goAwardBtn.onClick(this, () => {
                console.log('goAwardBtn');
                ModulePackage.Instance.Show('baseBag', 0, 0, this);
                ModuleAudio.PlayComonBtnAudio();
            });
            let _go = false;
            this.m_goStoreBtn.onClick(this, () => {
                if (_go) {
                    return;
                }
                ModuleAudio.PlayComonBtnAudio();
                console.log('goStoreBtn');
                ModulePlatformAPI.NavigateToTaobaoPage(() => {
                    _go = false;
                });
            });
        }
        Close(_callBacK) {
        }
        listenText() {
        }
        SetInfo(_info) {
            this.myinfo = _info;
            this.m_infoCtr.selectedIndex = _info.haveAward;
            if (_info.haveAward == 0 && _info.awardData) {
                this.m_awardRank.setVar('count', '' + _info.awardData.curRank).flushVars();
                this.m_awardInfo.text = _info.awardData.title;
            }
        }
    }

    class UI_Main$4 extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("activity", "Main"));
        }
        onConstruct() {
            this.m_showAwardBtn = (this.getChildAt(0));
            this.m_showOverBtn = (this.getChildAt(1));
            this.m_closeBtn = (this.getChildAt(2));
        }
    }
    UI_Main$4.URL = "ui://onlm4vwpiyoco2u";

    class uiActivityMain extends UI_Main$4 {
        onConstruct() {
            super.onConstruct();
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this.m_closeBtn.onClick(this, () => {
                    this._winHandler.hide();
                });
                this.m_showAwardBtn.onClick(this, () => {
                    ModulePackage.Instance.PopWindow("activity", "ActivityAward");
                });
                this.m_showOverBtn.onClick(this, () => {
                    ModulePackage.Instance.PopWindow("activity", "ActivityEndPopup");
                });
            }
        }
    }

    class activityBinder {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(uiActivityMain.URL, uiActivityMain);
            fgui.UIObjectFactory.setExtension(uiActivityEndPopup.URL, uiActivityEndPopup);
            fgui.UIObjectFactory.setExtension(uiActivityAward.URL, uiActivityAward);
            fgui.UIObjectFactory.setExtension(uiActivityAwardItem.URL, uiActivityAwardItem);
        }
    }

    class UI_Main$5 extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("autotriggerAward", "Main"));
        }
        onConstruct() {
            this.m_showAwardBtn = (this.getChildAt(0));
            this.m_closeBtn = (this.getChildAt(1));
        }
    }
    UI_Main$5.URL = "ui://hmoqxzvjkv200";

    class uiAutotriggerAwardMain extends UI_Main$5 {
        onConstruct() {
            super.onConstruct();
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this.m_closeBtn.onClick(this, () => {
                    this._winHandler.hide();
                });
                this.m_showAwardBtn.onClick(this, () => {
                    uiAutotriggerAward.AutoShow(8, 0);
                });
            }
        }
    }

    class autotriggerAwardBinder {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(uiAutotriggerAwardMain.URL, uiAutotriggerAwardMain);
            fgui.UIObjectFactory.setExtension(uiAutotriggerAward.URL, uiAutotriggerAward);
        }
    }

    class UI_award extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Task", "award"));
        }
        onConstruct() {
            this.m_awardImg = (this.getChildAt(1));
            this.m_coinIcon = (this.getChildAt(2));
            this.m_scoreIcon = (this.getChildAt(3));
            this.m_awardCount = (this.getChildAt(4));
            this.m_scoreawardCount = (this.getChildAt(5));
            this.m_coinText = (this.getChildAt(6));
            this.m_scoreText = (this.getChildAt(7));
        }
    }
    UI_award.URL = "ui://czp63sgg9se0o";

    class uiaward extends UI_award {
        SetInfo(_info) {
            this.m_awardCount.text = '' + _info.coinN;
            this.m_scoreawardCount.text = '' + _info.scoreN;
        }
    }

    const StatisticsSend = {
        openApp: {
            fromUserId: '',
        },
        loadingRes: {},
        exit: {
            type: 'default',
            playTime: 1
        },
        activeTime: {
            playTime: 1
        },
        clickShare: {
            type: 'beforeGame'
        },
        shareSuccess: {
            type: 'default',
        },
        task: {
            from: 'beforeGame',
            type: '',
        },
        clickGame: {},
        exposure: {
            type: 'browse',
            goodsId: '',
            goodsName: '',
            price: '',
        },
        pay: {
            type: 'default',
            record: {},
            nickName: '',
            payNum: '',
            rewardNum: '',
            timesNum: '',
        },
    };
    class ModuleStatistics_C {
        constructor() {
            this.version = '0';
            this.showTime = 0;
            this.lastActiveTime = 0;
            this.curGameState = 'beforeGame';
            this.isInit = false;
            this.activeTimeID = null;
        }
        static Instance() {
            if (!this.myInstance) {
                this.myInstance = new ModuleStatistics_C();
            }
            return this.myInstance;
        }
        Init(_version, _callBack) {
            if (this.isInit) {
                return;
            }
            this.version = _version;
            this.showTime = Date.now();
            this.lastActiveTime = this.showTime;
            this.Dot('openApp', { fromUserId: ModulePlatformAPI.GetFromID() });
            Laya.stage.on(PlatformListenKey.onShow, this, this.onShow);
            Laya.stage.on(PlatformListenKey.onHide, this, this.onHide);
            this.activeTimeUpdate();
            this.isInit = true;
        }
        ChangeCurGameState(_state) {
            if (this.curGameState == _state) {
                return;
            }
            this.curGameState = _state;
        }
        onShow() {
            console.log("ModuleStatistics onshow");
            this.showTime = Date.now();
            this.lastActiveTime = this.showTime;
            this.activeTimeUpdate();
        }
        onHide() {
            console.log("ModuleStatistics onHide");
            this.exitGame();
            this.reportActiveTime();
        }
        StartLoadRes() {
            this.Dot('loadingRes');
        }
        ClickShare() {
            this.Dot('clickShare', { type: this.curGameState });
        }
        ShareSuccess() {
            this.Dot('shareSuccess', { type: 'default' });
        }
        ClickGameBtn() {
            this.Dot('clickGame');
        }
        CompleteTask(_taskType) {
            this.Dot('task', { from: this.curGameState, type: _taskType });
        }
        TaskExposure(_taskType, _goodsId, _goodsName, _price) {
            this.Dot('exposure', { type: _taskType, goodsId: _goodsId, goodsName: _goodsName, price: _price });
        }
        TaskPay(_record, _payNum, _rewardNum, _timesNum) {
            ModulePlatformAPI.GetUserInfo((_info) => {
                this.Dot('pay', { type: 'default', nickName: _info.nickName, record: _record, payNum: _payNum, rewardNum: _rewardNum, timesNum: _timesNum });
            });
        }
        exitGame() {
            let _time = ((Date.now() - this.showTime) / 1000) | 0;
            this.Dot('exit', { type: 'default', playTime: _time });
        }
        reportActiveTime() {
            let _ct = Date.now();
            let _time = ((_ct - this.lastActiveTime) / 1000) | 0;
            this.Dot('activeTime', { playTime: _time });
            this.lastActiveTime = _ct;
            this.activeTimeUpdate();
        }
        activeTimeUpdate() {
            if (this.activeTimeID) {
                clearTimeout(this.activeTimeID);
                this.activeTimeID = null;
            }
            this.activeTimeID = setTimeout(() => {
                this.activeTimeID = null;
                this.reportActiveTime();
            }, 5 * 60 * 1000);
        }
        Dot(_action, _port) {
            _port = _port ? _port : {};
            _port['clientVersion'] = this.version;
            _port['action'] = _action;
            this.reportNet(_port);
        }
        reportNet(_port) {
            const _postName = '/C/data/userReport';
            let tryTime = 3;
            console.log('上传打点事件：', JSON.stringify(_port));
            let _send = () => {
                ModulePackage.Instance.SendNetMessage("", _postName, _port, "post", this, (data) => {
                    if (data.code != 0) {
                        tryTime--;
                        if (tryTime <= 0) {
                            return;
                        }
                        setTimeout(() => {
                            _send();
                        }, 200);
                        return;
                    }
                });
            };
            _send();
        }
    }
    ModuleStatistics_C.myInstance = null;
    ;
    let ModuleStatistics = ModuleStatistics_C.Instance();

    class UI_browseItem extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Task", "browseItem"));
        }
        onConstruct() {
            this.m_isCan = this.getControllerAt(0);
            this.m_goodsImg = (this.getChildAt(0));
            this.m_browseBtn = (this.getChildAt(1));
            this.m_priceTxt = (this.getChildAt(2));
            this.m_content = (this.getChildAt(3));
            this.m_slideIn = this.getTransitionAt(0);
        }
    }
    UI_browseItem.URL = "ui://czp63sggemqnn";

    class uibrowseItem extends UI_browseItem {
        onConstruct() {
            super.onConstruct();
            this.m_browseBtn.onClick(this, () => {
                this.selectCallBack && this.selectCallBack(this.myGoodInfo.goodsId);
                ModuleAudio.PlayComonBtnAudio();
                ModuleStatistics.TaskExposure('browse', '' + this.myGoodInfo.goodsId, '' + this.myGoodInfo.goodsName, '' + this.myGoodInfo.price);
            });
        }
        SetInfo(_info, _selectCallBack) {
            this.myGoodInfo = _info;
            this.selectCallBack = _selectCallBack;
            this.m_goodsImg.url = '' + _info.pic;
            this.m_content.text = '' + _info.goodsName;
            this.m_priceTxt.text = '￥' + _info.price;
        }
        clearAll() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
    }

    class UI_buyItem extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Task", "buyItem"));
        }
        onConstruct() {
            this.m_isCan = this.getControllerAt(0);
            this.m_awardImg = (this.getChildAt(0));
            this.m_goodsImg = (this.getChildAt(1));
            this.m_buyBtn = (this.getChildAt(2));
            this.m_priceTxt = (this.getChildAt(3));
            this.m_content = (this.getChildAt(4));
            this.m_slideIn = this.getTransitionAt(0);
        }
    }
    UI_buyItem.URL = "ui://czp63sgg9se0s";

    class UI_TaskPrecondition extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Task", "TaskPrecondition"));
        }
        onConstruct() {
            this.m_frame = (this.getChildAt(0));
            this.m_framebg = (this.getChildAt(1));
            this.m_okBtn = (this.getChildAt(2));
            this.m_icon = (this.getChildAt(3));
            this.m_descText = (this.getChildAt(4));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_TaskPrecondition.URL = "ui://czp63sggw7oc1";

    class uiTaskPrecondition extends UI_TaskPrecondition {
        static Show(_award) {
            ModulePackage.Instance.PopWindow("Task", "TaskPrecondition", { winParamData: _award });
        }
        onConstruct() {
            super.onConstruct();
            this.m_okBtn.onClick(this, () => {
                this.callback && this.callback(() => {
                    this._winHandler.hide();
                });
                ModuleAudio.PlayComonBtnAudio();
            });
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winHandler.SetShowCallBack(this, this.OnShow);
                this._winHandler.SetHideCallBack(this, this.OnHide);
                this.SetInfo(this._winHandler.GetParamData());
            }
        }
        SetInfo(_info) {
            this.m_descText.text = _info.info.title + '才可以打开礼包哦！';
            this.m_okBtn.title = _info.info.title;
            this.callback = _info.callBack;
        }
        OnShow() {
            console.log("OnShow~~~");
        }
        OnHide() {
            console.log("OnHide~~~");
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
    }

    class UI_TaskExtraPopup extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Task", "TaskExtraPopup"));
        }
        onConstruct() {
            this.m_title = (this.getChildAt(0));
            this.m_closeButton = (this.getChildAt(1));
            this.m_hintText = (this.getChildAt(2));
            this.m_icon = (this.getChildAt(3));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_TaskExtraPopup.URL = "ui://czp63sggdp9714";

    class uiTaskExtraPopup extends UI_TaskExtraPopup {
        constructor() {
            super(...arguments);
            this.touchCloseBtn = false;
        }
        static Show(_award) {
            console.log('Show uiTaskExtraPopup', _award.info);
            ModulePackage.Instance.PopWindow("Task", "TaskExtraPopup", { winParamData: _award });
        }
        onConstruct() {
            super.onConstruct();
            this.m_closeButton.onClick(this, () => {
                this.touchCloseBtn = true;
                this._winHandler.hide();
            });
            this.onClick(this, () => {
                if (this.touchCloseBtn) {
                    return;
                }
                this.callback && this.callback(() => {
                    this._winHandler.hide();
                });
                ModuleAudio.PlayComonBtnAudio();
            });
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winHandler.SetShowCallBack(this, this.OnShow);
                this._winHandler.SetHideCallBack(this, this.OnHide);
                this.SetInfo(this._winHandler.GetParamData());
                this.touchCloseBtn = false;
            }
        }
        SetInfo(_info) {
            this.callback = _info.callBack;
        }
        OnShow() {
            console.log("OnShow~~~");
        }
        OnHide() {
            console.log("OnHide~~~");
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
    }

    class UI_GetReward$1 extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Task", "GetReward"));
        }
        onConstruct() {
            this.m_count = this.getControllerAt(0);
            this.m_type = this.getControllerAt(1);
            this.m_frame = (this.getChildAt(0));
            this.m_framebg = (this.getChildAt(1));
            this.m_rewardCom1 = (this.getChildAt(2));
            this.m_rewardCom2 = (this.getChildAt(3));
            this.m_okBtn = (this.getChildAt(4));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_GetReward$1.URL = "ui://czp63sggrqvv9";

    class uiGetReward$1 extends UI_GetReward$1 {
        static Show(_award) {
            this.awardInfo = _award;
            ModulePackage.Instance.PopWindow("Task", "GetReward");
        }
        onConstruct() {
            super.onConstruct();
            this.m_okBtn.onClick(this, () => {
                this._winHandler.hide();
            });
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winHandler.SetShowCallBack(this, this.OnShow);
                this._winHandler.SetHideCallBack(this, this.OnHide);
                this.SetInfo();
            }
        }
        SetInfo() {
            this.m_count.selectedIndex = uiGetReward$1.awardInfo.length == 1 ? 1 : 0;
            let _comArr = [this.m_rewardCom1, this.m_rewardCom2];
            const iconUrl = {
                times: 'ui://czp63sggqqee17',
                wmScore: 'ui://czp63sggqqee16',
            };
            for (let index = 0; index < uiGetReward$1.awardInfo.length; index++) {
                const element = uiGetReward$1.awardInfo[index];
                _comArr[index].m_rewardTxt.text = 'x' + element.value;
                let _url = iconUrl[element.type];
                if (_url) {
                    _comArr[index].m_rewardLoader.url = _url;
                }
            }
        }
        OnShow() {
            console.log("OnShow~~~");
        }
        OnHide() {
            console.log("OnHide~~~");
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
    }
    uiGetReward$1.awardInfo = [];

    class UI_TaskBrowse extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Task", "TaskBrowse"));
        }
        onConstruct() {
            this.m_haveGoods = this.getControllerAt(0);
            this.m_type = this.getControllerAt(1);
            this.m_frame = (this.getChildAt(0));
            this.m_framebg = (this.getChildAt(1));
            this.m_list = (this.getChildAt(2));
            this.m_buyList = (this.getChildAt(3));
            this.m_collectList = (this.getChildAt(4));
            this.m_tips = (this.getChildAt(5));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_TaskBrowse.URL = "ui://czp63sggcb3yg";

    class uiTaskBrowse extends UI_TaskBrowse {
        constructor() {
            super(...arguments);
            this.curGoodsList = [];
        }
        static Show(_type, _selectcallBack) {
            this.curType = _type;
            this.SelectCallBack = _selectcallBack;
            ModulePackage.Instance.PopWindow("Task", "TaskBrowse");
        }
        static Hide() {
            if (!this.curBrowse) {
                return;
            }
            this.curBrowse._winHandler.hide();
        }
        onConstruct() {
            super.onConstruct();
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winHandler.SetShowCallBack(this, this.OnShow);
                this._winHandler.SetHideCallBack(this, this.OnHide);
                this.SetInfo();
            }
        }
        SetInfo() {
            Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);
            ModuleGlobal.GetGoodsList((_success, _list) => {
                Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);
                this._winHandler.closeModalWait();
                let _text = '有商品';
                if (!_success || _list.length <= 0) {
                    _text = '没有商品';
                }
                else {
                    let _showList = this.m_list;
                    let _typeText = '浏览';
                    switch (uiTaskBrowse.curType) {
                        case 'browse':
                            _typeText = '浏览';
                            _showList = this.m_list;
                            break;
                        case 'buy':
                            _typeText = '购买';
                            _showList = this.m_buyList;
                            break;
                        case 'collect':
                            _typeText = '收藏';
                            _showList = this.m_collectList;
                            break;
                        default:
                            break;
                    }
                    this.curGoodsList = _list;
                    this.m_type.setSelectedPage(_typeText);
                    let _showp = () => {
                        _showList.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, null, false);
                        _showList.setVirtual();
                        _showList.numItems = this.curGoodsList.length;
                    };
                    if (uiTaskBrowse.curType == 'collect') {
                        if (this.curGoodsList.length > 0) {
                            let _sort = () => {
                                this.curGoodsList = this.curGoodsList.sort((a, b) => a.isCollected ? 1 : -1);
                                _showp();
                            };
                            _sort();
                        }
                    }
                    else {
                        _showp();
                    }
                }
                this.m_haveGoods.setSelectedPage(_text);
            }, undefined, false);
        }
        OnShow() {
            console.log("OnShow~~~");
            uiTaskBrowse.curBrowse = this;
        }
        OnHide() {
            uiTaskBrowse.curBrowse = undefined;
            uiTaskBrowse.curType = undefined;
            console.log("OnHide~~~");
            for (let index = 0; index < this.m_list._children.length; index++) {
                const element = this.m_list.getChildAt(index);
                if (element && element.clearAll)
                    element.clearAll();
            }
            for (let index = 0; index < this.m_buyList._children.length; index++) {
                const element = this.m_buyList.getChildAt(index);
                if (element && element.clearAll)
                    element.clearAll();
            }
            for (let index = 0; index < this.m_collectList._children.length; index++) {
                const element = this.m_collectList.getChildAt(index);
                if (element && element.clearAll)
                    element.clearAll();
            }
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
            ModuleGlobal.GetGoodsList(undefined, { pageSize: 30, sortType: 'random' });
        }
        _OnRenderItem(index, item) {
            item.SetInfo(this.curGoodsList[index], uiTaskBrowse.SelectCallBack);
        }
    }

    class UI_TaskInvite extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Task", "TaskInvite"));
        }
        onConstruct() {
            this.m_isInvite = this.getControllerAt(0);
            this.m_frame = (this.getChildAt(0));
            this.m_framebg = (this.getChildAt(1));
            this.m_confirmBtn = (this.getChildAt(3));
            this.m_avatar = (this.getChildAt(4));
            this.m_tipsTxt = (this.getChildAt(5));
            this.m_coinCom = (this.getChildAt(6));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_TaskInvite.URL = "ui://czp63sggmxaf3";

    class uiTaskInvite extends UI_TaskInvite {
        static Show(_award) {
            ModulePackage.Instance.PopWindow("Task", "TaskInvite", { winParamData: _award });
        }
        onConstruct() {
            super.onConstruct();
            this.m_confirmBtn.onClick(this, () => {
                this._winHandler.hide();
            });
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winHandler.SetShowCallBack(this, this.OnShow);
                this._winHandler.SetHideCallBack(this, this.OnHide);
                this.SetInfo(this._winHandler.GetParamData());
            }
        }
        SetInfo(_info) {
            this.m_isInvite.selectedIndex = _info.type == 'invit' ? 1 : 0;
            this.m_avatar.url = _info.info[0].avatar;
            this.m_tipsTxt.setVar('name', _info.info[0].nickName).flushVars();
            this.callBackFun = _info.callBack;
        }
        OnShow() {
            console.log("OnShow~~~");
        }
        OnHide() {
            this.callBackFun && this.callBackFun();
            console.log("OnHide~~~");
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
    }

    var TaskType;
    (function (TaskType) {
        TaskType["dayGift"] = "dayGift";
        TaskType["checkInDay"] = "checkInDay";
        TaskType["memberAward"] = "memberAward";
        TaskType["collectGoods"] = "collectGoods";
        TaskType["scanShop"] = "scanShop";
        TaskType["friendship"] = "friendship";
        TaskType["spend"] = "spend";
        TaskType["subscribeShop"] = "subscribeShop";
        TaskType["joinMember"] = "joinMember";
        TaskType["scanGoods"] = "scanGoods";
    })(TaskType || (TaskType = {}));
    var TaskStatusType;
    (function (TaskStatusType) {
        TaskStatusType["waiting"] = "waiting";
        TaskStatusType["allow"] = "allow";
        TaskStatusType["finish"] = "finish";
    })(TaskStatusType || (TaskStatusType = {}));
    class TaskLogic_c {
        constructor() {
            this.TaskUpdateKey = 'TaskUpdate_';
            this.curTaskInfoArr = [];
            this.curTaskInfoObj = {};
            this.isInit = false;
            this.taskIconPath = 'https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/normal/C_client/taskIcon/';
            this.browseTime = 10000;
            this.targetCountDownTime = {};
            this.goBrowseTime = {
                scanShop: 0,
                scanGoods: 0,
            };
            this.spendStoreKey = 'speedKey';
            this.spendStoreTime = 0;
            this.taskResultCallback = {};
            this.relationTasks = {};
        }
        static Instance() {
            if (!this.myInstance) {
                this.myInstance = new TaskLogic_c();
            }
            return this.myInstance;
        }
        Init(_successcallBack, _waitTaskList = true) {
            if (this.isInit) {
                return;
            }
            this.getLocalStoreInfo();
            this.TaskCountDown();
            Laya.stage.on(PlatformListenKey.onShow, this, () => {
                this.DetectWaitTaskResult(TaskType.scanGoods);
                this.DetectWaitTaskResult(TaskType.scanShop);
                this.DetectWaitTaskResult(TaskType.spend);
                this.DetectWaitTaskResult(TaskType.friendship);
            });
            Laya.stage.on(PlatformListenKey.onHide, this, () => {
            });
            let _getlist = () => {
                this.UpdateTaskList((_success) => {
                    if (_success) {
                        _successcallBack && _successcallBack();
                    }
                    else {
                        if (_waitTaskList) {
                            setTimeout(() => {
                                _getlist();
                            }, 100);
                        }
                    }
                });
            };
            _getlist();
            Laya.stage.on(PlatformListenKey.FavorChange, this, () => {
                if (!ModuleGlobal.IsActivityOn()) {
                    console.error('活动结束不能再做任务');
                    return;
                }
                if (ModulePlatformAPI.IsFavor) {
                    this.ReportTask(TaskType.subscribeShop);
                }
            });
            Laya.stage.on(PlatformListenKey.MemberChange, this, () => {
                if (!ModuleGlobal.IsActivityOn()) {
                    console.error('活动结束不能再做任务');
                    return;
                }
                if (ModulePlatformAPI.IsMember) {
                    this.ReportTask(TaskType.joinMember);
                }
            });
        }
        getLocalStoreInfo() {
            this.spendStoreTime = ModuleTool.GetLocalItem(this.spendStoreKey) || 0;
        }
        UpdateTaskList(_callBack, appointUpdate) {
            let _fakeData = [
                {
                    detailType: TaskType.checkInDay,
                    sortIndex: 1,
                    title: '每日签到',
                    content: '每日签到内容',
                    status: TaskStatusType.allow,
                    rewardTime: 3,
                    reward: [
                        {
                            type: GCurrencyType.wmScore,
                            value: 10,
                        },
                    ],
                    competition: '1/3',
                },
                {
                    detailType: TaskType.dayGift,
                    sortIndex: 1,
                    title: '每日礼包',
                    content: '每日礼包内容',
                    rewardTime: 1,
                    status: TaskStatusType.allow,
                    period: 11235,
                    reward: [
                        {
                            type: GCurrencyType.times,
                            value: 2,
                        }
                    ],
                    competition: '0/1',
                },
                {
                    detailType: TaskType.collectGoods,
                    sortIndex: 1,
                    title: '收藏商品',
                    content: '收藏商品内容',
                    status: TaskStatusType.waiting,
                    rewardTime: 1,
                    period: 0,
                    reward: [
                        {
                            type: GCurrencyType.wmScore,
                            value: 10,
                        },
                        {
                            type: GCurrencyType.times,
                            value: 2,
                        }
                    ],
                    competition: '0/1',
                },
                {
                    detailType: TaskType.scanGoods,
                    sortIndex: 1,
                    title: '浏览商品',
                    content: '浏览商品内容',
                    status: TaskStatusType.waiting,
                    rewardTime: 3,
                    period: 0,
                    reward: [
                        {
                            type: GCurrencyType.wmScore,
                            value: 10,
                        }
                    ],
                    competition: '0/3',
                },
                {
                    detailType: TaskType.joinMember,
                    sortIndex: 1,
                    title: '加入会员',
                    content: '加入会员内容',
                    status: TaskStatusType.waiting,
                    period: 0,
                    reward: [
                        {
                            type: GCurrencyType.wmScore,
                            value: 10,
                        },
                        {
                            type: GCurrencyType.times,
                            value: 2,
                        }
                    ],
                    competition: '0/3',
                },
                {
                    detailType: TaskType.joinMember,
                    sortIndex: 1,
                    title: '加入会员',
                    content: '加入会员内容',
                    status: TaskStatusType.waiting,
                    period: 0,
                    reward: [
                        {
                            type: GCurrencyType.wmScore,
                            value: 10,
                        },
                        {
                            type: GCurrencyType.times,
                            value: 2,
                        }
                    ],
                    competition: '0/3',
                },
                {
                    detailType: TaskType.joinMember,
                    sortIndex: 1,
                    title: '加入会员',
                    content: '加入会员内容',
                    status: TaskStatusType.waiting,
                    period: 0,
                    reward: [
                        {
                            type: GCurrencyType.wmScore,
                            value: 10,
                        },
                        {
                            type: GCurrencyType.times,
                            value: 2,
                        }
                    ],
                    competition: '0/3',
                },
                {
                    detailType: TaskType.joinMember,
                    sortIndex: 1,
                    title: '加入会员',
                    content: '加入会员内容',
                    status: TaskStatusType.waiting,
                    period: 0,
                    reward: [
                        {
                            type: GCurrencyType.wmScore,
                            value: 10,
                        },
                        {
                            type: GCurrencyType.times,
                            value: 2,
                        }
                    ],
                    competition: '0/3',
                },
                {
                    detailType: TaskType.joinMember,
                    sortIndex: 1,
                    title: '加入会员',
                    content: '加入会员内容',
                    status: TaskStatusType.waiting,
                    period: 0,
                    reward: [
                        {
                            type: GCurrencyType.wmScore,
                            value: 10,
                        },
                        {
                            type: GCurrencyType.times,
                            value: 2,
                        }
                    ],
                    competition: '0/3',
                },
            ];
            let getData = (_getData) => {
                if (!this.curTaskInfoArr) {
                    this.curTaskInfoArr = _getData;
                }
                else {
                    let _updateType = null;
                    let _typesArr = [];
                    if (appointUpdate) {
                        if (typeof appointUpdate == 'string') {
                            _typesArr.push(appointUpdate);
                        }
                        else {
                            _typesArr = JSON.parse(JSON.stringify(appointUpdate));
                        }
                    }
                    while (_getData.length > 0) {
                        let _newtask = null;
                        if (_typesArr.length > 0) {
                            _updateType = _typesArr.pop();
                        }
                        else {
                            _updateType = null;
                        }
                        if (_updateType) {
                            _newtask = _getData.find(v => v.detailType == _updateType);
                        }
                        else {
                            _newtask = _getData.pop();
                        }
                        if (!_newtask) {
                            console.error('没有找到任务', _updateType);
                            continue;
                        }
                        let _task = this.GetTaskInfo(_newtask.detailType);
                        let _triggerUpdate = false;
                        if (_task) {
                            for (const key in _task) {
                                if (_task[key] == _newtask[key]) {
                                    continue;
                                }
                                _triggerUpdate = true;
                                _task[key] = _newtask[key];
                            }
                        }
                        else {
                            _triggerUpdate = true;
                            _task = _newtask;
                            this.curTaskInfoArr.push(_task);
                        }
                        if (_triggerUpdate) {
                            this.TriggerTaskUpdate(_newtask.detailType, _task);
                        }
                        if (_updateType && _typesArr.length <= 0) {
                            break;
                        }
                    }
                }
                for (const task of this.curTaskInfoArr) {
                    if (task.status == TaskStatusType.waiting
                        && task.period > 0) {
                        this.targetCountDownTime[task.detailType] = Date.now() + task.period;
                    }
                    this.curTaskInfoObj[task.detailType] = task;
                }
                _callBack && _callBack(true, this.curTaskInfoArr);
                Laya.stage.event('refreshBubble');
            };
            if (ModulePackage.Instance.CanUseNetAPI()) {
                ModulePackage.Instance.SendNetMessage("", "/C/task/getTaskList", {}, "post", this, (data) => {
                    console.log("getTaskList", data);
                    if (data.code != 0) {
                        _callBack && _callBack(false);
                        return;
                    }
                    ModuleTool.DetectType('getTaskList', data.data, _fakeData);
                    getData(JSON.parse(JSON.stringify(data.data)));
                });
            }
            else {
                getData(_fakeData);
            }
        }
        DoTask(_type, _callback, _degree = 0, _showAwardPopup = false) {
            console.log('去做任务:', _type);
            let _doCallback = (_success) => {
                console.log('做任务结果:', _type, _success);
                if (!_success) {
                    _callback && _callback(_success);
                    return;
                }
                switch (_degree) {
                    case 0:
                        _callback && _callback(_success);
                        break;
                    case 1:
                        this.ReportTask(_type, _callback);
                        break;
                    case 2:
                        this.ReportTask(_type, (_success) => {
                            if (!_success) {
                                _callback && _callback(_success);
                                return;
                            }
                            this.ReceiveTaskAward(_type, _callback, _showAwardPopup);
                        }, false);
                        break;
                    default:
                        break;
                }
            };
            let _toComplete = () => {
                let _curTask = this.GetTaskInfo(_type);
                if (_curTask && _curTask.status == TaskStatusType.finish && _degree > 0) {
                    _doCallback(false);
                    return;
                }
                if (_curTask && _curTask.status == TaskStatusType.allow && _degree > 0) {
                    _doCallback(true);
                    return;
                }
                switch (_type) {
                    case TaskType.joinMember:
                        ModulePlatformAPI.OpenMember((_isFavor) => {
                            _doCallback(_isFavor);
                        });
                        break;
                    case TaskType.subscribeShop:
                        ModulePlatformAPI.FavorShop((_isFavor) => {
                            _doCallback(_isFavor);
                        });
                        break;
                    case TaskType.dayGift:
                        break;
                    case TaskType.checkInDay:
                        break;
                    case TaskType.memberAward:
                        break;
                    case TaskType.collectGoods:
                        uiTaskBrowse.Show('collect', (_goodsid) => {
                            console.log('uiTaskBrowse clickok', _type, _goodsid);
                            ModulePlatformAPI.CollectGoods(_goodsid, (_success) => {
                                if (_success) {
                                    uiTaskBrowse.Hide();
                                }
                                _doCallback(_success);
                            });
                        });
                        break;
                    case TaskType.scanShop:
                        this.goBrowseTime[_type] = 0;
                        ModulePlatformAPI.NavigateToTaobaoPage((_navigateSuccess) => {
                            ModulePlatformAPI.showToast('浏览10秒即可获得奖励');
                            if (_navigateSuccess) {
                                let _delayTime = 1000;
                                setTimeout(() => {
                                    this.goBrowseTime[_type] = Date.now() - _delayTime;
                                    this.WaitTaskResult(_type, (_success) => {
                                        _doCallback(_success);
                                        if (_success) {
                                            ModulePlatformAPI.showToast('浏览成功');
                                        }
                                        else {
                                            ModulePlatformAPI.showToast('浏览时长不够');
                                        }
                                    });
                                }, _delayTime);
                            }
                            else {
                                _doCallback(_navigateSuccess);
                            }
                        });
                        break;
                    case TaskType.scanGoods:
                        this.goBrowseTime[_type] = 0;
                        uiTaskBrowse.Show('browse', (_goodsid) => {
                            console.log('uiTaskBrowse clickok', _type, _goodsid);
                            ModulePlatformAPI.showToast('浏览10秒即可获得奖励');
                            ModulePlatformAPI.OpenShopItemDetail('' + _goodsid, (_opensuccess) => {
                                if (_opensuccess) {
                                    this.goBrowseTime[_type] = Date.now();
                                    this.WaitTaskResult(_type, (_success) => {
                                        _doCallback(_success);
                                        if (_success) {
                                            uiTaskBrowse.Hide();
                                            ModulePlatformAPI.showToast('浏览成功');
                                        }
                                        else {
                                            ModulePlatformAPI.showToast('浏览时长不够');
                                        }
                                    });
                                }
                                else {
                                    _doCallback(_opensuccess);
                                }
                            });
                        });
                        break;
                    case TaskType.spend:
                        uiTaskBrowse.Show('buy', (_goodsid) => {
                            console.log('uiTaskBrowse clickok', _type, _goodsid);
                            this.ReportTask(_type, (_success1) => {
                                if (!_success1) {
                                    return;
                                }
                                ModulePlatformAPI.showSku('' + _goodsid, (_success) => {
                                    if (_success) {
                                        this.spendStoreTime = Date.now();
                                        ModuleTool.SetLocalItem(this.spendStoreKey, this.spendStoreTime);
                                        this.WaitTaskResult(_type, (_success, _award) => {
                                            if (_success) {
                                                uiTaskBrowse.Hide();
                                            }
                                            _callback && _callback(_success, _award);
                                            if (_showAwardPopup) {
                                                uiGetReward$1.Show(_award);
                                            }
                                        });
                                    }
                                });
                            });
                        });
                        break;
                    case TaskType.friendship:
                        ModuleStatistics.ClickShare();
                        ModulePlatformAPI.Share(() => {
                            ModuleStatistics.ShareSuccess();
                            if (_degree == 0) {
                                _callback && _callback(true);
                            }
                            else {
                                this.WaitTaskResult(_type, (_success, _award) => {
                                    _callback && _callback(_success, _award);
                                    if (_showAwardPopup && _award) {
                                        uiGetReward$1.Show(_award);
                                    }
                                });
                            }
                        }, () => {
                            _callback && _callback(false);
                        });
                        break;
                    default:
                        console.error('[DoTask]未知任务！', _type);
                        return;
                }
            };
            this.DetectShowPreTask(_type, (_success) => {
                if (!_success) {
                    return;
                }
                _toComplete();
            });
        }
        ReportTask(_type, _callback, _refreshTaskState = true) {
            console.log('上报任务', _type);
            if (!ModulePackage.Instance.CanUseNetAPI()) {
                _callback && _callback(true);
                return;
            }
            let _netPort = '';
            let _sendData = undefined;
            switch (_type) {
                case TaskType.joinMember:
                case TaskType.subscribeShop:
                    _netPort = "/C/task/entranceMember";
                    _sendData = { detailType: _type, outcome: 'success' };
                    break;
                case TaskType.spend:
                    _netPort = "/C/task/spendReport";
                    break;
                case TaskType.scanShop:
                    _netPort = "/C/task/taskReport";
                    _sendData = { detailType: _type };
                    break;
                default:
                    _netPort = "/C/task/taskReport";
                    _sendData = { detailType: _type };
                    _callback && _callback(true);
                    return;
            }
            ModulePackage.Instance.SendNetMessage("", _netPort, _sendData, "post", this, (data) => {
                if (data.code != 0) {
                    if (data.code == 98 || data.code == 99) {
                        ModuleGlobal.ChangeActivityState(data.code == 98 ? 'unstart' : 'off', data.msg);
                        uiAlert.AutoShowActivityState();
                    }
                    console.error('上报失败', _type, data.code, data.msg);
                    _callback && _callback(false);
                    return;
                }
                _refreshTaskState && this.ToUpdateTaskState(_type);
                _callback && _callback(true);
            });
        }
        ReceiveTaskAward(_type, _callback, _showAwardPopup = true) {
            console.log('领取任务奖励', _type);
            let _toReceive = () => {
                let _showReward = (_reward, _userlist) => {
                    if (TaskType.friendship == _type && _userlist && _userlist.length > 0) {
                        uiTaskInvite.Show({
                            type: 'invit',
                            info: _userlist,
                            callBack: () => {
                                console.log('uiGetReward', _type, _reward);
                                uiGetReward$1.Show(_reward);
                            }
                        });
                    }
                    else {
                        uiGetReward$1.Show(_reward);
                    }
                };
                if (!ModulePackage.Instance.CanUseNetAPI()) {
                    let _reward = [
                        {
                            type: GCurrencyType.wmScore,
                            value: 10,
                        },
                        {
                            type: GCurrencyType.times,
                            value: 1,
                        }
                    ];
                    let _result = true;
                    _callback && _callback(_result, _reward);
                    if (_result && _showAwardPopup) {
                        _showReward(_reward, _type == TaskType.friendship ? [{ avatar: '', nickName: '被邀请人' }] : undefined);
                    }
                    return;
                }
                if (!this.GetTaskInfo(_type)) {
                    _callback && _callback(false);
                    return;
                }
                let _netPort = '';
                let _sendData = undefined;
                switch (_type) {
                    case TaskType.joinMember:
                    case TaskType.subscribeShop:
                        _netPort = 'getMemberOrFollowPrize';
                        _sendData = { detailType: _type };
                        break;
                    case TaskType.dayGift:
                        _netPort = 'getDayGift';
                        break;
                    case TaskType.checkInDay:
                    case TaskType.memberAward:
                    case TaskType.collectGoods:
                    case TaskType.scanShop:
                    case TaskType.scanGoods:
                        _netPort = 'getTaskPrize';
                        _sendData = { detailType: _type };
                        break;
                    case TaskType.spend:
                        _netPort = 'getSpendPrize';
                        break;
                    case TaskType.friendship:
                        _netPort = 'getInvitePrize';
                        break;
                    default:
                        console.error('[ReceiveTaskAward]不合法的领取操作！', _type);
                        return;
                }
                ModulePackage.Instance.SendNetMessage("", "/C/task/" + _netPort, _sendData, "post", this, (_data) => {
                    if (_data.code != 0) {
                        if (_data.code == 98 || _data.code == 99) {
                            ModuleGlobal.ChangeActivityState(_data.code == 98 ? 'unstart' : 'off', _data.msg);
                            uiAlert.AutoShowActivityState();
                        }
                        console.error('领取任务奖励失败', _data.code, _type, _data.msg);
                        _callback && _callback(false);
                        return;
                    }
                    let _reward = undefined;
                    let _isArr = Array.isArray(_data.data);
                    if (_isArr) {
                        _reward = _data.data;
                    }
                    else {
                        _reward = _data.data.reward;
                    }
                    if (_reward && _reward.length > 0) {
                        for (let index = _reward.length - 1; index >= 0; index--) {
                            const element = _reward[index];
                            if (!element.value) {
                                _reward.splice(index, 1);
                            }
                        }
                    }
                    _callback && _callback(true, _reward);
                    ModuleStatistics.CompleteTask(_type);
                    if (_type == TaskType.spend) {
                        let _record = _data.data.numIids || {};
                        let _payN = '' + _data.data.totalFee;
                        let _rewardN = '';
                        let _timesN = '';
                        if (_reward) {
                            let _rn = _reward.find(v => v.type == GCurrencyType.wmScore);
                            if (_rn) {
                                _rewardN = '' + _rn.value;
                            }
                            let _tn = _reward.find(v => v.type == GCurrencyType.times);
                            if (_tn) {
                                _timesN = '' + _tn.value;
                            }
                        }
                        ModuleStatistics.TaskPay(_record, _payN, _rewardN, _timesN);
                    }
                    if (_showAwardPopup) {
                        _showReward(_reward, _data.data.userList);
                    }
                    if (_reward) {
                        for (const iterator of _reward) {
                            if (iterator.type) {
                                ModuleGlobal.UpdateCurrency(iterator.type);
                            }
                        }
                    }
                    this.ToUpdateTaskState(_type);
                });
            };
            this.DetectShowPreTask(_type, (_success) => {
                if (!_success) {
                    return;
                }
                _toReceive();
            });
        }
        DetectShowPreTask(_taskT, _completeCallback) {
            let _curTask = null;
            if (typeof _taskT == 'object') {
                _curTask = _taskT;
            }
            else {
                _curTask = this.GetTaskInfo(_taskT);
            }
            if (_curTask && _curTask.giftParams) {
                let _preTask = this.GetTaskInfo(_curTask.giftParams);
                if (!_preTask) {
                    ModulePlatformAPI.showToast("未找到前置任务:" + _curTask.giftParams);
                }
                if (_preTask && _preTask.status == TaskStatusType.waiting) {
                    uiTaskPrecondition.Show({
                        info: { title: _preTask.title }, callBack: (_successCallback) => {
                            this.DoTask(_curTask.giftParams, (_success) => {
                                if (_success) {
                                    _successCallback && _successCallback();
                                    this.ToUpdateTaskState(_curTask.detailType, () => {
                                        _completeCallback && _completeCallback(_success);
                                    });
                                }
                                else {
                                    _completeCallback && _completeCallback(_success);
                                }
                            }, 1);
                        }
                    });
                }
                else {
                    _completeCallback && _completeCallback(true);
                }
            }
            else {
                _completeCallback && _completeCallback(true);
            }
        }
        WaitTaskResult(_type, _callback) {
            this.taskResultCallback[_type] = _callback;
        }
        DetectWaitTaskResult(_type) {
            if (!ModuleGlobal.IsActivityOn()) {
                console.error('活动结束不能再做任务');
                return;
            }
            let fireWaitTaskResult = (_success, _info) => {
                this.taskResultCallback[_type] && this.taskResultCallback[_type](_success, _info);
                this.taskResultCallback[_type] = null;
            };
            switch (_type) {
                case TaskType.scanGoods:
                case TaskType.scanShop:
                    if (this.goBrowseTime[_type] > 0) {
                        if (Date.now() - this.goBrowseTime[_type] >= this.browseTime) {
                            fireWaitTaskResult(true);
                        }
                        else {
                            fireWaitTaskResult(false);
                        }
                        this.goBrowseTime[_type] = 0;
                    }
                    break;
                case TaskType.spend:
                    if (this.spendStoreTime > 0) {
                        let _tryTime = 1;
                        let _detect = () => {
                            _tryTime--;
                            this.ReceiveTaskAward(_type, (_success, _award) => {
                                if (_success) {
                                    this.spendStoreTime = 0;
                                    ModuleTool.SetLocalItem(this.spendStoreKey, this.spendStoreTime);
                                    fireWaitTaskResult(true, _award);
                                }
                                else {
                                    if (_tryTime > 0) {
                                        setTimeout(() => {
                                            _detect();
                                        }, 5000);
                                    }
                                }
                            }, false);
                        };
                        _detect();
                    }
                    break;
                case TaskType.friendship:
                    let _tryTime = 1;
                    let _detect = () => {
                        _tryTime--;
                        this.ReceiveTaskAward(_type, (_success, _award) => {
                            if (_success) {
                                fireWaitTaskResult(true, _award);
                            }
                            else {
                                if (_tryTime > 0) {
                                    setTimeout(() => {
                                        _detect();
                                    }, 5000);
                                }
                            }
                        }, false);
                    };
                    _detect();
                    break;
                default:
                    return;
            }
        }
        AutoShowExtraPopup(_type, _parent, _callback) {
            let _task = this.GetTaskInfo(_type);
            console.log('_task', _task);
            if (_task.status == TaskStatusType.finish
                || (_task.status == TaskStatusType.waiting && _task.period > 0)) {
                _callback && _callback(false);
                return;
            }
            console.log('AutoShowExtraPopup');
            uiTaskExtraPopup.Show({
                info: { type: _type }, callBack: (_successCallback) => {
                    this.DoTask(_type, (_success) => {
                        if (_success) {
                            _successCallback && _successCallback();
                        }
                        _callback && _callback(_success);
                    }, 2, true);
                }
            });
        }
        TaskCountDown() {
            const perMS = 200;
            setInterval(() => {
                let _t = Date.now();
                for (const key in this.targetCountDownTime) {
                    let _time = this.targetCountDownTime[key] - _t;
                    if (_time <= 0) {
                        _time = 0;
                        delete this.targetCountDownTime[key];
                        this.ToUpdateTaskState(key);
                    }
                    if (_time % 1000 < perMS) {
                        let _task = this.GetTaskInfo(key);
                        if (_task) {
                            _task.period = _time;
                            this.TriggerTaskUpdate(key, _task);
                        }
                    }
                }
            }, perMS);
        }
        ToUpdateTaskState(_type, _callBack) {
            let _tasks = [];
            let _relationTasks = this.GetRelationTasks(_type);
            if (_relationTasks.length > 0) {
                for (const iterator of _relationTasks) {
                    _tasks.push(iterator);
                }
            }
            _tasks.push(_type);
            this.UpdateTaskList(_callBack, _tasks);
        }
        TriggerTaskUpdate(_type, _newInfo) {
            Laya.stage.event(this.TaskUpdateKey + _type, _newInfo);
        }
        ListenTaskUpdate(_type, _caller, _callBack) {
            Laya.stage.on(this.TaskUpdateKey + _type, _caller, _callBack);
        }
        GetTaskInfo(_type) {
            let _task = this.curTaskInfoObj[_type];
            return _task;
        }
        GetAllTaskInfo() {
            return this.curTaskInfoArr;
        }
        GetRelationTasks(_type) {
            if (this.relationTasks[_type]) {
                return this.relationTasks[_type];
            }
            let _taskTypes = [];
            let _curtask = this.GetTaskInfo(_type);
            if (!_curtask) {
                this.relationTasks[_type] = _taskTypes;
                return _taskTypes;
            }
            for (const iterator of this.GetAllTaskInfo()) {
                if (iterator.giftParams && iterator.giftParams == _type) {
                    _taskTypes.push(iterator.detailType);
                }
            }
            this.relationTasks[_type] = _taskTypes;
            return _taskTypes;
        }
        GetTaskAwardValue(_taskT, _awardType) {
            let _task = null;
            if (typeof _taskT == 'object') {
                _task = _taskT;
            }
            else {
                _task = this.GetTaskInfo(_taskT);
            }
            let _award = _task.reward.find(v => v.type == _awardType);
            if (!_award) {
                return 0;
            }
            return _award.value;
        }
        ChangeTaskIconPath(_path) {
            this.taskIconPath = _path;
        }
        GetTaskIconUrl(_type) {
            return this.taskIconPath + _type + '.png';
        }
    }
    TaskLogic_c.myInstance = null;
    let TaskLogic = TaskLogic_c.Instance();

    class uibuyItem extends UI_buyItem {
        onConstruct() {
            super.onConstruct();
            this.m_buyBtn.onClick(this, () => {
                this.selectCallBack && this.selectCallBack(this.myGoodInfo.goodsId);
                ModuleAudio.PlayComonBtnAudio();
                ModuleStatistics.TaskExposure('buy', '' + this.myGoodInfo.goodsId, '' + this.myGoodInfo.goodsName, '' + this.myGoodInfo.price);
            });
        }
        SetInfo(_info, _selectCallBack) {
            this.myGoodInfo = _info;
            this.selectCallBack = _selectCallBack;
            this.m_goodsImg.url = '' + _info.pic;
            this.m_content.text = '' + _info.goodsName;
            this.m_priceTxt.text = '￥' + _info.price;
            let _countAward = (_mult) => {
                let _n = Math.ceil(_mult * ModuleTool.ChangeToNumber(_info.price));
                return _n;
            };
            let _award = {
                coinN: _countAward(TaskLogic.GetTaskAwardValue(TaskType.spend, GCurrencyType.times)),
                scoreN: _countAward(TaskLogic.GetTaskAwardValue(TaskType.spend, GCurrencyType.wmScore)),
            };
            this.m_awardImg.SetInfo(_award);
        }
        clearAll() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
    }

    class UI_coinCom extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Task", "coinCom"));
        }
        onConstruct() {
            this.m_countTxt = (this.getChildAt(1));
        }
    }
    UI_coinCom.URL = "ui://czp63sggmxaf4";

    class uicoinCom extends UI_coinCom {
    }

    class UI_collectItem extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Task", "collectItem"));
        }
        onConstruct() {
            this.m_isCollected = this.getControllerAt(0);
            this.m_goodsImg = (this.getChildAt(0));
            this.m_collectBtn = (this.getChildAt(1));
            this.m_priceTxt = (this.getChildAt(2));
            this.m_content = (this.getChildAt(3));
            this.m_slideIn = this.getTransitionAt(0);
        }
    }
    UI_collectItem.URL = "ui://czp63sgghfek11";

    class uicollectItem extends UI_collectItem {
        onConstruct() {
            super.onConstruct();
            this.m_collectBtn.onClick(this, () => {
                console.error('m_collectBtn ', this.myGoodInfo.goodsId);
                this.selectCallBack && this.selectCallBack(this.myGoodInfo.goodsId);
                ModuleAudio.PlayComonBtnAudio();
                ModuleStatistics.TaskExposure('collect', '' + this.myGoodInfo.goodsId, '' + this.myGoodInfo.goodsName, '' + this.myGoodInfo.price);
            });
        }
        SetInfo(_info, _selectCallBack) {
            this.myGoodInfo = _info;
            this.selectCallBack = _selectCallBack;
            this.m_goodsImg.url = '' + _info.pic;
            this.m_content.text = '' + _info.goodsName;
            this.m_priceTxt.text = '￥' + _info.price;
            this.m_isCollected.setSelectedPage(_info.isCollected ? '已收藏' : '未收藏');
            ModulePlatformAPI.CheckGoodsCollectedStatus(_info.goodsId, (_iscollect) => {
                if (_iscollect != _info.isCollected) {
                    this.m_isCollected.setSelectedPage(_iscollect ? '已收藏' : '未收藏');
                    console.error('收藏状态不一致', _info.goodsId, _iscollect, _info.isCollected);
                }
            });
        }
        clearAll() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
    }

    class UI_rewardCom extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Task", "rewardCom"));
        }
        onConstruct() {
            this.m_type = this.getControllerAt(0);
            this.m_rewardLoader = (this.getChildAt(0));
            this.m_rewardTxt = (this.getChildAt(1));
        }
    }
    UI_rewardCom.URL = "ui://czp63sggmsmcz";

    class uirewardCom extends UI_rewardCom {
    }

    class UI_taskItem extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Task", "taskItem"));
        }
        onConstruct() {
            this.m_state = this.getControllerAt(0);
            this.m_iconCtrl = this.getControllerAt(1);
            this.m_isTimer = this.getControllerAt(2);
            this.m_styleCtrl = this.getControllerAt(3);
            this.m_progressState = this.getControllerAt(4);
            this.m_iconShowState = this.getControllerAt(5);
            this.m_titleTxt = (this.getChildAt(2));
            this.m_taskTxt = (this.getChildAt(3));
            this.m_iconLoader = (this.getChildAt(4));
            this.m_timeTxt = (this.getChildAt(5));
            this.m_yigaunzhu = (this.getChildAt(7));
            this.m_getBtn = (this.getChildAt(8));
            this.m_goBtn = (this.getChildAt(9));
            this.m_gotBtn = (this.getChildAt(10));
            this.m_followBtn = (this.getChildAt(11));
            this.m_coinIcon = (this.getChildAt(12));
            this.m_scoreIcon = (this.getChildAt(13));
            this.m_countTxt = (this.getChildAt(14));
            this.m_scorecountTxt = (this.getChildAt(15));
            this.m_slideIn = this.getTransitionAt(0);
        }
    }
    UI_taskItem.URL = "ui://czp63sgghd9ye";

    class uitaskItem extends UI_taskItem {
        constructor() {
            super(...arguments);
            this.myInfo = null;
            this.lastIcon = '';
        }
        onConstruct() {
            super.onConstruct();
            this.clickBtn();
        }
        SetInfo(_info, _parentwinHandler) {
            this.parentWinHandler = _parentwinHandler;
            this.clearAll();
            this.setShow(_info);
            Laya.stage.on(TaskLogic.TaskUpdateKey + this.myInfo.detailType, this, this.setShow);
        }
        setShow(_info) {
            this.myInfo = _info;
            this.ShowBaseInfo();
            this.ShowProgress();
            this.ChangeTaskState(this.myInfo.status);
            this.SetAwardShow();
            if (this.lastIcon != _info.detailType) {
                this.lastIcon = _info.detailType;
                this.m_iconLoader.url = TaskLogic.GetTaskIconUrl(_info.detailType);
            }
        }
        ShowBaseInfo() {
            this.m_titleTxt.text = this.myInfo.title;
        }
        ChangeTaskState(_state) {
            let _text = '前往';
            switch (_state) {
                case TaskStatusType.waiting:
                    _text = '前往';
                    break;
                case TaskStatusType.allow:
                    _text = '可领取';
                    break;
                case TaskStatusType.finish:
                    _text = '已领取';
                    break;
                default:
                    break;
            }
            this.m_state.setSelectedPage(_text);
            this.ChangeTimerState();
        }
        ChangeTimerState() {
            if (this.myInfo.status != TaskStatusType.waiting) {
                return;
            }
            this.m_isTimer.selectedIndex = this.myInfo.period > 0 ? 1 : 0;
            if (this.m_isTimer.selectedIndex == 1) {
                this.m_timeTxt.setVar('time', ModuleTool.GetTime(this.myInfo.period, 'hh:mm:ss')).flushVars();
            }
        }
        SetAwardShow() {
            let _awradTime = 0;
            let _awradScore = 0;
            if (this.myInfo.detailType != TaskType.spend) {
                for (const awrad of this.myInfo.reward) {
                    switch (awrad.type) {
                        case GCurrencyType.times:
                            _awradTime = awrad.value;
                            break;
                        case GCurrencyType.wmScore:
                            _awradScore = awrad.value;
                            break;
                        default:
                            break;
                    }
                }
            }
            let _haveTime = _awradTime > 0;
            let _haveScore = _awradScore > 0;
            if (_haveTime && _haveScore) {
                this.m_iconShowState.setSelectedPage('双奖励');
            }
            else if (_haveTime) {
                this.m_iconShowState.setSelectedPage('奖励1');
            }
            else if (_haveScore) {
                this.m_iconShowState.setSelectedPage('奖励2');
            }
            else {
                this.m_iconShowState.setSelectedPage('无奖励');
            }
            if (_haveTime) {
                this.m_countTxt.setVar('count', '' + _awradTime).flushVars();
            }
            if (_haveScore) {
                this.m_scorecountTxt.setVar('scorecount', '' + _awradScore).flushVars();
            }
        }
        ShowProgress() {
            let _show = true;
            if (this.myInfo.rewardTime && this.myInfo.rewardTime == 1) {
                _show = false;
            }
            this.m_progressState.setSelectedPage(_show ? '显示' : '不显示');
            if (_show) {
                this.m_taskTxt.text = `(${this.myInfo.competition})`;
            }
        }
        clickBtn() {
            this.m_goBtn.onClick(this, () => {
                console.log('m_goBtn');
                ModuleAudio.PlayComonBtnAudio();
                if (uiAlert.AutoShowActivityState()) {
                    return;
                }
                this.doTask();
            });
            this.m_followBtn.onClick(this, () => {
                console.log('m_followBtn');
                ModuleAudio.PlayComonBtnAudio();
                if (uiAlert.AutoShowActivityState()) {
                    return;
                }
                this.doTask();
            });
            this.m_getBtn.onClick(this, () => {
                console.log('m_getBtn');
                ModuleAudio.PlayComonBtnAudio();
                if (uiAlert.AutoShowActivityState()) {
                    return;
                }
                this.getReward();
            });
        }
        doTask() {
            console.log('去做任务');
            TaskLogic.DoTask(this.myInfo.detailType, (_success) => {
                console.log('doTask结果', _success);
            }, 2, true);
        }
        getReward() {
            console.log('领取任务奖励');
            this.parentWinHandler.showModalWait();
            let _closeModalWait = () => {
                Laya.timer.clear(this, _closeModalWait);
                this.parentWinHandler.closeModalWait();
            };
            Laya.timer.once(5000, this, _closeModalWait);
            TaskLogic.ReceiveTaskAward(this.myInfo.detailType, (_success, _rewardData) => {
                console.log('getReward结果', _success, _rewardData);
                _closeModalWait();
            });
        }
        clearAll() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
            Laya.Tween.clearAll(this);
        }
    }

    class UI_Main$6 extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Task", "Main"));
        }
        onConstruct() {
            this.m_frame = (this.getChildAt(0));
            this.m_framebg = (this.getChildAt(1));
            this.m_list = (this.getChildAt(2));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_Main$6.URL = "ui://czp63sggtpcm0";

    class uiTaskMain extends UI_Main$6 {
        constructor() {
            super(...arguments);
            this.curTaskList = [];
        }
        onConstruct() {
            super.onConstruct();
            console.error('uiTaskMain onConstruct', fgui.GRoot.inst);
        }
        makeFullScreen() {
            super.makeFullScreen();
            let _anchorX = 0;
            let _anchorY = 0;
            if (this.pivotAsAnchor) {
                _anchorX = this.pivotX;
                _anchorY = this.pivotY;
            }
            this.setXY(_anchorX * this.width, _anchorY * this.height);
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this.onStart();
                this._winHandler.SetShowCallBack(this, this.onShow);
                this._winHandler.SetHideCallBack(this, this.onHide);
                this.SetInfo();
            }
        }
        onStart() {
            console.log('onStartonStart');
        }
        onShow() {
            console.log('uiTaskMain onShow');
        }
        SetInfo() {
            let _data = TaskLogic.GetAllTaskInfo();
            this.curTaskList = _data;
            this.curTaskList = this.curTaskList.sort((a, b) => {
                if (a.status != b.status) {
                    if (TaskStatusType.allow == a.status) {
                        return -1;
                    }
                    if (TaskStatusType.allow == b.status) {
                        return 1;
                    }
                    if (TaskStatusType.finish == a.status) {
                        return 1;
                    }
                    if (TaskStatusType.finish == b.status) {
                        return -1;
                    }
                }
                return a.sortIndex - b.sortIndex;
            });
            console.error('SetInfo', 1);
            uiTaskMain.curRenderID++;
            this.m_list.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, [uiTaskMain.curRenderID], false);
            this.m_list.setVirtual();
            this.m_list.numItems = this.curTaskList.length;
            uiTaskMain.curRenderID++;
            if (uiTaskMain.curRenderID > 9999) {
                uiTaskMain.curRenderID = 0;
            }
            console.error('SetInfo', 2);
        }
        Show() {
            this.visible = true;
            this.onShow();
        }
        Hide() {
            this.onHide();
            this._winHandler.hide();
        }
        onHide() {
            this.onEnd();
        }
        onEnd() {
            for (let index = 0; index < this.m_list._children.length; index++) {
                const element = this.m_list.getChildAt(index);
                if (element && element.clearAll)
                    element.clearAll();
            }
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
            Laya.Tween.clearAll(this);
        }
        _OnRenderItem(_id, index, item, _other) {
            if (item['isInited'] && item['isInited'] == index + 1) {
                return;
            }
            item['isInited'] = index + 1;
            item.SetInfo(this.curTaskList[index], this._winHandler);
            let _action = uiTaskMain.curRenderID == _id;
            item.visible = !_action;
            if (_action) {
                Laya.timer.once(index * 150, this, () => {
                    item.visible = true;
                    item.x = item.width;
                    Laya.Tween.to(item, { x: 0 }, 200);
                });
            }
        }
    }
    uiTaskMain.curRenderID = 0;

    class TaskBinder {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(uiaward.URL, uiaward);
            fgui.UIObjectFactory.setExtension(uibuyItem.URL, uibuyItem);
            fgui.UIObjectFactory.setExtension(uiTaskBrowse.URL, uiTaskBrowse);
            fgui.UIObjectFactory.setExtension(uiTaskExtraPopup.URL, uiTaskExtraPopup);
            fgui.UIObjectFactory.setExtension(uibrowseItem.URL, uibrowseItem);
            fgui.UIObjectFactory.setExtension(uitaskItem.URL, uitaskItem);
            fgui.UIObjectFactory.setExtension(uicollectItem.URL, uicollectItem);
            fgui.UIObjectFactory.setExtension(uirewardCom.URL, uirewardCom);
            fgui.UIObjectFactory.setExtension(uiTaskInvite.URL, uiTaskInvite);
            fgui.UIObjectFactory.setExtension(uicoinCom.URL, uicoinCom);
            fgui.UIObjectFactory.setExtension(uiGetReward$1.URL, uiGetReward$1);
            fgui.UIObjectFactory.setExtension(uiTaskMain.URL, uiTaskMain);
            fgui.UIObjectFactory.setExtension(uiTaskPrecondition.URL, uiTaskPrecondition);
        }
    }

    class UI_txtCom extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Rule", "txtCom"));
        }
        onConstruct() {
            this.m_ruleTxt = (this.getChildAt(0));
        }
    }
    UI_txtCom.URL = "ui://c5mx7a76n9oc4";

    class UI_Main$7 extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("Rule", "Main"));
        }
        onConstruct() {
            this.m_frame = (this.getChildAt(0));
            this.m_framebg = (this.getChildAt(1));
            this.m_list = (this.getChildAt(2));
            this.m_popUp = this.getTransitionAt(0);
            this.m_packUp = this.getTransitionAt(1);
        }
    }
    UI_Main$7.URL = "ui://c5mx7a76n9oc0";

    class uiRuleMain extends UI_Main$7 {
        onConstruct() {
            super.onConstruct();
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winHandler.SetShowCallBack(this, this.OnShow);
                this._winHandler.SetHideCallBack(this, this.OnHide);
                this.SetInfo();
            }
        }
        SetInfo() {
            let ruleTxt = this.m_list.getChildAt(0).asCom.getChild('ruleTxt').asTextField;
            ruleTxt.text = ModuleGlobal.RuleInfo;
        }
        OnShow() {
            console.log("OnShow~~~");
        }
        OnHide() {
            console.log("OnHide~~~");
        }
    }

    class RuleBinder {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(uiRuleMain.URL, uiRuleMain);
            fgui.UIObjectFactory.setExtension(UI_txtCom.URL, UI_txtCom);
        }
    }

    class UI_Main$8 extends fgui.GComponent {
        static createInstance() {
            return (fgui.UIPackage.createObject("GeneralInterface", "Main"));
        }
        onConstruct() {
            this.m_frame = (this.getChildAt(0));
            this.m_normalBtn2 = (this.getChildAt(1));
        }
    }
    UI_Main$8.URL = "ui://c66xycirfn9co3q";

    class uiGeneralInterfaceMain extends UI_Main$8 {
        onConstruct() {
            super.onConstruct();
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winHandler.SetShowCallBack(this, this.OnShow);
                this._winHandler.SetHideCallBack(this, this.OnHide);
                this.SetInfo();
            }
        }
        SetInfo() {
            this.m_normalBtn2.onClick(this, () => {
                uiAlert.Show({
                    content: '测试弹窗', clickYes: () => {
                        console.log('clickYes');
                    }
                });
            });
        }
        OnShow() {
            console.log("OnShow~~~");
        }
        OnHide() {
            console.log("OnHide~~~");
        }
    }

    class GeneralInterfaceBinder {
        static bindAll() {
            fgui.UIObjectFactory.setExtension(uiAlert.URL, uiAlert);
            fgui.UIObjectFactory.setExtension(uiGeneralInterfaceMain.URL, uiGeneralInterfaceMain);
        }
    }

    class ModulePackage extends Laya.EventDispatcher {
        constructor() {
            super();
            this.normalCDNPath = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/normal/C_client/v16/res/module/";
            this._mapNonModules = {};
            this._configData = {
                maxNum: 3,
                modules: [
                    {
                        name: "common",
                        version: "0.0.1",
                        description: "基础资源包",
                        resource: this.normalCDNPath,
                        notView: false,
                        codePackage: "https://xxxx/common-0.0.1.tgz",
                        dependencies: []
                    },
                    {
                        name: "rank",
                        version: "0.0.1",
                        description: "冲榜模块",
                        resource: this.normalCDNPath,
                        notView: false,
                        codePackage: "https://xxxx/rank-0.0.1.tgz",
                        dependencies: ["baseBag"]
                    },
                    {
                        name: "baseBag",
                        version: "0.0.1",
                        description: "奖品包",
                        resource: this.normalCDNPath,
                        notView: false,
                        codePackage: "https://xxxx/baseBag-0.0.1.tgz",
                        dependencies: []
                    },
                    {
                        name: "Atmosphere",
                        version: "0.0.1",
                        description: "氛围模块",
                        resource: this.normalCDNPath,
                        notView: false,
                        codePackage: "https://xxxx/baseBag-0.0.1.tgz",
                        dependencies: []
                    },
                    {
                        name: "gift",
                        version: "0.0.1",
                        description: "兑换好礼模块",
                        resource: this.normalCDNPath,
                        notView: false,
                        codePackage: "https://xxxx/baseBag-0.0.1.tgz",
                        dependencies: []
                    },
                    {
                        name: "activity",
                        version: "0.0.1",
                        description: "活动结束模块",
                        resource: this.normalCDNPath,
                        notView: false,
                        codePackage: "https://xxxx/baseBag-0.0.1.tgz",
                        dependencies: []
                    },
                    {
                        name: "autotriggerAward",
                        version: "0.0.1",
                        description: "自动触发奖励模块",
                        resource: this.normalCDNPath,
                        notView: false,
                        codePackage: "https://xxxx/baseBag-0.0.1.tgz",
                        dependencies: []
                    },
                    {
                        name: "Task",
                        version: "0.0.1",
                        description: "任务模块",
                        resource: this.normalCDNPath,
                        notView: false,
                        codePackage: "https://xxxx/baseBag-0.0.1.tgz",
                        dependencies: []
                    },
                    {
                        name: "Rule",
                        version: "0.0.1",
                        description: "规则模块",
                        resource: this.normalCDNPath,
                        notView: false,
                        codePackage: "https://xxxx/baseBag-0.0.1.tgz",
                        dependencies: []
                    },
                    {
                        name: "GeneralInterface",
                        version: "0.0.1",
                        description: "通用ui模块",
                        resource: this.normalCDNPath,
                        notView: false,
                        codePackage: "https://xxxx/baseBag-0.0.1.tgz",
                        dependencies: []
                    },
                ]
            };
            RankBinder.bindAll();
            baseBagBinder.bindAll();
            AtmosphereBinder.bindAll();
            giftBinder.bindAll();
            activityBinder.bindAll();
            autotriggerAwardBinder.bindAll();
            TaskBinder.bindAll();
            RuleBinder.bindAll();
            GeneralInterfaceBinder.bindAll();
            fgui.UIConfig.modalLayerColor = "rgba(00,00,00,0.7)";
            fgui.UIConfig.windowModalWaiting = "ui://qwv197ctu2823i";
            fgui.UIConfig.globalModalWaiting = "ui://qwv197ctu2823i";
        }
        static get Instance() {
            if (this._inst == null) {
                this._inst = new ModulePackage();
            }
            return this._inst;
        }
        PreloadResources() {
            let resList = [];
            this._configData.modules.forEach(resModel => {
                if (Laya.Browser.onTBMiniGame) {
                    if (resModel.notView) {
                        return;
                    }
                    resList.push({ url: resModel.resource + resModel.name + ".txt", type: Laya.Loader.BUFFER });
                    resList.push({ url: resModel.resource + resModel.name + "_atlas0.png", type: Laya.Loader.IMAGE });
                }
                else {
                    if (resModel.notView) {
                        return;
                    }
                    resList.push({ url: "res/module/" + resModel.name + ".txt", type: Laya.Loader.BUFFER });
                    resList.push({ url: "res/module/" + resModel.name + "_atlas0.png", type: Laya.Loader.IMAGE });
                }
            });
            if (resList.length > 0) {
                Laya.loader.load(resList, Laya.Handler.create(this, (param) => {
                    console.log("完成：", param);
                    if (param == true) {
                        console.log("开始初始化:", resList);
                        resList.forEach(element => {
                            let extLength = element.url.length - 4;
                            if (element.url.substring(extLength) == ".txt") {
                                let resPath = element.url.substring(0, extLength);
                                fgui.UIPackage.addPackage(resPath);
                            }
                        });
                        this.Init();
                    }
                    else {
                        throw new Error("模块资源加载失败，请检查！");
                    }
                }), Laya.Handler.create(this, (param) => {
                    console.log("进度" + param);
                }, undefined, false));
            }
        }
        Init() {
            console.log("_configData:", this._configData);
            this._configData.modules.forEach(element => {
                console.log("element", element);
                if (element.name == "common") {
                    this._listView = fgui.UIPackage.createObject("common", "BaseList");
                    return;
                }
                let listModule = this._listView.getChild("listModule");
                let labItem = fgui.UIPackage.createObject("common", "BaseListItem");
                labItem.title = element.description;
                labItem.icon = fgui.UIPackage.getItemURL(element.name, "Icon");
                labItem.onClick(this, this._OnClick, [element.name]);
                listModule.addChild(labItem);
            });
            this._bIsInited = true;
            this.event(ModulePackage.MODULE_INIT_COMPLETE);
        }
        _OnClick(moduleName) {
            console.log(moduleName);
            this.Show(moduleName);
        }
        IsInitComplete() {
            return this._bIsInited;
        }
        SendMessage(srcModuleName, callModuleName, functionName = "show", functionParams = null) {
            let bFlag = false;
            if (srcModuleName == "client") {
                bFlag = true;
            }
            else {
                this._configData.modules.forEach(element => {
                    if (element.name == srcModuleName) {
                        element.dependencies.forEach(element2 => {
                            if (element2 == callModuleName) {
                                bFlag = true;
                            }
                        });
                    }
                });
            }
            if (bFlag) {
                if (functionName == "show") {
                    this.Show(callModuleName);
                }
                else {
                    if (!!this._mapNonModules[callModuleName]) {
                        this._mapNonModules[callModuleName][functionName](...functionParams);
                    }
                    else {
                        throw new Error(callModuleName + "模块没有找到，不允许调用。");
                    }
                }
            }
            else {
                throw new Error(srcModuleName + "模块没有依赖" + callModuleName + "模块，不允许调用。");
            }
        }
        Show(moduleName = "base", positionX = 0, positionY = 0, parent = null) {
            if (moduleName == "base") {
                if (this._listView != null) {
                    this._listView.setXY(positionX, positionY);
                    this._listView.makeFullScreen();
                    if (parent != null) {
                        parent.addChild(this._listView);
                    }
                    else {
                        fgui.GRoot.inst.addChild(this._listView);
                    }
                }
            }
            else {
                this.PopWindow(moduleName, "Main", { px: positionX, py: positionY });
            }
        }
        PopWindow(moduleName, windowName, _config) {
            let component = fgui.UIPackage.createObject(moduleName, windowName);
            if (component == null)
                return;
            if (!_config) {
                _config = {};
            }
            let winPanel = new ModuleWindow(_config.winParamData);
            winPanel.makeFullScreen();
            winPanel.contentPane = component;
            component.data = winPanel;
            component.makeFullScreen();
            component.setXY(_config.px || 0, _config.py || 0);
            winPanel.modal = _config.isModal === false ? false : true;
            if (_config.parent) {
                _config.parent.addChild(winPanel);
            }
            else {
                winPanel.show();
            }
        }
        CanUseNetAPI() {
            if (Laya.Browser.onTBMiniGame) {
                return true;
            }
            return true;
        }
        SendNetMessage(hostName, routeName, functionParams = null, method = "get", thisObj = null, callback = null) {
            if (Laya.Browser.onTBMiniGame) {
                let app = getApp();
                console.log(1, app);
                let sendServer = app["sendServer"];
                if (!!sendServer) {
                    console.log(2, sendServer);
                    let handulerName = routeName.replace(/\//g, '_');
                    if (handulerName[0] == '_') {
                        handulerName = handulerName.substring(1);
                    }
                    console.log(3, handulerName);
                    sendServer.call(app, ModulePackage.SERVER_NAME, handulerName, functionParams, thisObj, callback);
                }
                return;
            }
            console.log('routeName', routeName);
            functionParams = functionParams || {};
            functionParams.activityId = ModuleGlobal.ActivityID;
            console.log("---Request:【" + routeName + "】", functionParams);
            let url = ModulePackage.SERVER_HOST + routeName;
            if (!!hostName && hostName.length > 0) {
                url = ModulePackage.SERVER_HOST + hostName + "/" + routeName;
            }
            if (method == "get") {
                url += "?";
                for (const key in functionParams) {
                    if (Object.prototype.hasOwnProperty.call(functionParams, key)) {
                        url += key + "=" + functionParams[key] + "&";
                    }
                }
            }
            let xhr = new Laya.HttpRequest();
            xhr.http.timeout = 10000;
            xhr.once(Laya.Event.COMPLETE, this, (data) => {
                console.log("---Response:【" + routeName + "】", data);
                if (!!callback)
                    callback.call(thisObj, JSON.parse(data));
            });
            xhr.once(Laya.Event.ERROR, this, (data) => { console.log(data); });
            xhr.on(Laya.Event.PROGRESS, this, (data) => { console.log(data); });
            xhr.send(url, method == "get" ? null : functionParams, method, "text/json", null);
        }
    }
    ModulePackage.MODULE_INIT_COMPLETE = "module_init_complete";
    ModulePackage.SERVER_HOST = "https://jd.eroswift.com";
    ModulePackage.SERVER_NAME = "WaterMelonServer";
    ;

    class uiAutotriggerAward extends UI_AutotriggerAward {
        constructor() {
            super(...arguments);
            this.myInfo = null;
        }
        static AutoShow(_type, _uid, _showResultCallback, _closeCallback) {
            let _get = true;
            if (!ModulePackage.Instance.CanUseNetAPI()) {
                _showResultCallback && _showResultCallback(_get);
                if (_get) {
                    this.closeCallback = _closeCallback;
                    ModulePackage.Instance.PopWindow("autotriggerAward", "AutotriggerAward", {
                        winParamData: {
                            title: '超级优惠券',
                            price: 19900,
                            linkId: 0
                        }
                    });
                }
                return;
            }
            ModulePackage.Instance.SendNetMessage("", "/C/playRewards/luckDraw", {
                level: _type,
                luckDrawId: '' + _uid,
            }, "post", this, (data) => {
                console.log('/C/playRewards/luckDraw', data);
                _get = data.code == 0;
                _showResultCallback && _showResultCallback(_get);
                if (_get) {
                    this.closeCallback = _closeCallback;
                    ModulePackage.Instance.PopWindow("autotriggerAward", "AutotriggerAward", { px: 0, py: 0, winParamData: data.data });
                }
            });
        }
        makeFullScreen() {
            super.makeFullScreen();
            this._winHandler = this.data;
            this.data = null;
            if (this._winHandler != null) {
                this._winHandler.SetHideCallBack(this, this.onEnd);
                this.Show();
                this.SetInfo(this._winHandler.GetParamData());
            }
        }
        onStart() {
            this.clickBtn();
            this.listenText();
        }
        onShow() {
            this.visible = true;
            Laya.stage.offAllCaller(this);
            console.log('GameAward', 'onShow');
        }
        Show() {
            this.onStart();
            this.onShow();
        }
        Hide() {
            this.onEnd();
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
            uiAutotriggerAward.closeCallback && uiAutotriggerAward.closeCallback();
        }
        clickBtn() {
            this.m_attentionBtn.onClick(this, () => {
                console.log('attentionBtn', this.myInfo.linkId);
                this.GotoUse(this.myInfo.linkId);
                ModuleAudio.PlayComonBtnAudio();
            });
        }
        listenText() {
        }
        closeself() {
            Laya.stage.offAllCaller(this);
        }
        SetInfo(_info) {
            this.myInfo = _info;
            this.m_describeText.text = _info.title;
            let _n = ModuleTool.ChangeToNumber(_info.price) / 100;
            ModuleTool.SetTextAndFitSize(this.m_priceText, '' + _n);
            console.log('SetInfo', _info);
        }
        GotoUse(_linkId) {
            if (!Laya.Browser.onTBMiniGame) {
                return;
            }
            if (!_linkId || _linkId == 0) {
                ModulePlatformAPI.NavigateToTaobaoPage((_success) => {
                    _success && this.closeself();
                });
            }
            else {
                ModulePlatformAPI.OpenShopItemDetail('' + _linkId, () => {
                }, () => {
                    this.closeself();
                });
            }
        }
    }

    const GameInfo = {
        watermelong: {
            post: '/C/watermelon/info',
            getData: {
                demoUrl: "xxxxxx",
                gameName: "游戏名称",
                iconList: []
            }
        }
    };
    class ModuleGameInfo_C {
        constructor() {
            this.isInit = false;
        }
        static Instance() {
            if (!this.myInstance) {
                this.myInstance = new ModuleGameInfo_C();
            }
            return this.myInstance;
        }
        Init(_callBack) {
            if (this.isInit) {
                return;
            }
        }
        GetGameInfo(_type, _callBack) {
            let _postName = GameInfo[_type].post;
            let tryTime = 3;
            let _send = () => {
                ModulePackage.Instance.SendNetMessage("", _postName, {}, "post", this, (data) => {
                    if (data.code != 0) {
                        tryTime--;
                        if (tryTime <= 0) {
                            _callBack && _callBack(false, null);
                            return;
                        }
                        setTimeout(() => {
                            _send();
                        }, 200);
                        return;
                    }
                    ModuleTool.DetectType(_postName, data.data, GameInfo[_type]['getData']);
                    _callBack && _callBack(true, data.data);
                });
            };
            _send();
        }
    }
    ModuleGameInfo_C.myInstance = null;
    ;
    let ModuleGameInfo = ModuleGameInfo_C.Instance();

    var ActivityState;
    (function (ActivityState) {
        ActivityState[ActivityState["unStart"] = 0] = "unStart";
        ActivityState[ActivityState["open"] = 1] = "open";
        ActivityState[ActivityState["end"] = 2] = "end";
    })(ActivityState || (ActivityState = {}));
    const GameTasksName = {
        joinMember: '加入会员',
        attention: '关注店铺',
        browse: '浏览商品',
        collect: '收藏商品',
        buy: '购买商品',
        share: '分享游戏',
        browseStore: '浏览店铺',
    };
    const GameFlyTaskAwardInfo = {
        clearFruit: {
            title: '水果消除',
            iconPic: 'GameTask_Icon1',
            titlePic: 'GameTask_Title1',
            desc: '消除当前屏幕1/3水果',
            data: 0.3,
        },
        removeFruit: {
            title: '水果清除',
            iconPic: 'GameTask_Icon2',
            titlePic: 'GameTask_Title2',
            desc: '清除当前屏幕等级4以下的水果',
            data: 4,
        },
        supperFruit: {
            title: '万能水果',
            iconPic: 'GameTask_Icon3',
            titlePic: 'GameTask_Title3',
            desc: '可合并任意一个水果',
            data: 1,
        },
        addScore: {
            title: '积分奖励',
            iconPic: 'GameTask_Icon4',
            titlePic: 'GameTask_Title4',
            desc: '积分+50',
            data: 50,
        },
    };
    class GameLogic_c {
        constructor() {
            this.isInGame = false;
            this.gameScene = null;
            this.myGameScene = null;
            this.fruitConfig = [
                {
                    image: 'fruit_2.png',
                    imagesW: 145,
                    score: 0
                },
                {
                    image: 'fruit_3.png',
                    imagesW: 170,
                    score: 1
                },
                {
                    image: 'fruit_4.png',
                    imagesW: 200,
                    score: 2
                },
                {
                    image: 'fruit_5.png',
                    imagesW: 230,
                    score: 3
                },
                {
                    image: 'fruit_6.png',
                    imagesW: 260,
                    score: 4
                },
                {
                    image: 'fruit_8.png',
                    imagesW: 290,
                    score: 5
                },
                {
                    image: 'fruit_9.png',
                    imagesW: 330,
                    score: 6
                },
                {
                    image: 'fruit_10.png',
                    imagesW: 380,
                    score: 7
                },
                {
                    image: 'fruit_11.png',
                    imagesW: 430,
                    score: 8
                },
            ];
            this.propFruitConfig = {
                supper: {
                    image: 'fruit_supper.png',
                    imagesW: 170,
                    score: 0,
                },
            };
            this.maxExtScore = 100;
            this.gameExpendCoin = 1;
            this.curScore = 0;
            this.myCoin = 1;
            this.myScore = 2;
            this.newInBag = 3;
            this.newInCoin = 4;
            this.curTopKind = 0;
            this.maxFruitKind = 11;
            this.fruitTopY = 2000;
            this.comboTime = 0;
            this.lastComboId = -1;
            this.gameFruitValidY = { bottom: 0, top: 0 };
            this.gameState = 0;
            this.isGameFail = false;
            this.reviveLeftTime = 1;
            this.awardMult = 1;
            this.isGotGameAward = false;
            this.isPause = false;
            this.gameClockName = 'GameClock';
            this.gameuid = 0;
            this.restartTimeID = null;
            this.gameTouchEnabled = true;
            this.fruitUrlObj = {};
            this.luckyBagConfig = { price: '0.01', num_iid: '637552722895', title: '福袋' };
            this.canBuyluckybag = true;
            this.LuckyBagEventKey = 'checkLuckyOrder';
            this.refreshNewNumber = -1;
            this.haveBrowseNewTask = false;
            this.curBrowseNewInfo = null;
            this.CurActivityState = ActivityState.unStart;
            this.preDoGameOverTask = null;
            this.curFlyTaskLevel = 0;
            this.lastgetFlyTaskInfo = {
                id: 0,
                awardType: null,
                taskType: null,
            };
        }
        static INS() {
            if (!this.instance) {
                this.instance = new GameLogic_c();
            }
            return this.instance;
        }
        Init() {
            this.gameState = 0;
            this.maxFruitKind = this.fruitConfig.length;
            this.InitCoin();
            this.InitScore();
            ModuleGameInfo.GetGameInfo('watermelong', (_success, _info) => {
                console.log('GetGameInfo', _info);
                if (_success) {
                    let _fs = [];
                    for (let index = 0; index < _info.iconList.length; index++) {
                        const element = _info.iconList[index][0];
                        let _fruit = {
                            id: index + 1,
                            url: element.url,
                            custom: element.custom || false,
                        };
                        _fs.push(_fruit);
                        this.SetAndPreLoadFruit(_fs);
                    }
                    ;
                }
            });
        }
        Restart() {
            ModuleStatistics.ChangeCurGameState('game');
            this.isGameFail = false;
            this.gameState = 1;
            if (this.restartTimeID) {
                clearTimeout(this.restartTimeID);
                this.restartTimeID = 0;
            }
            if (!this.gameScene || !this.myGameScene) {
                this.restartTimeID = setTimeout(() => {
                    this.Restart();
                }, 100);
                return;
            }
            ClockUtil.Start(this.gameClockName);
            ClockUtil.insertEvent(this.gameClockName, {
                interval: 1,
                callBack: (clockTag, tag, _n) => {
                    this.AutoTriggerGameFlyTask();
                }
            });
            this.gameuid = ((Date.now() + Math.random()) * 10000) | 0;
            this.fruitTopY = 2000;
            this.comboTime = 0;
            this.gameScene && this.gameScene.GameStart();
            this.myGameScene && this.myGameScene.GameStart();
            this.gameState = 2;
            this.reviveLeftTime = 1;
            this.awardMult = 1;
            this.isGotGameAward = false;
            this.ResetGameFlyTask();
            this.ResetGameoverTask();
            this.CheckLuckyBagState();
            this.PauseGame(false);
        }
        Revive() {
            this.comboTime = 0;
            this.isGameFail = false;
            this.gameState = 1;
            this.fruitTopY = 2000;
            this.gameScene && this.gameScene.GameRevive();
            this.myGameScene && this.myGameScene.GameRevive();
            this.gameState = 2;
            this.awardMult = 1;
            this.reviveLeftTime--;
            this.PauseGame(false);
            HHAudio.PlayEffect('revive');
        }
        GameOver(_fail = true) {
            this.isGameFail = _fail;
            this.gameState = 3;
            this.PauseGame(true);
            if (!_fail) {
                this.curScore = 0;
            }
            this.gameScene && this.gameScene.GameOver();
            this.myGameScene && this.myGameScene.GameOver();
            if (_fail) {
                HHAudio.PlayEffect('gameOver');
            }
        }
        ShowGameOverPopup(awrdN = 1) {
            this.awardMult = awrdN;
            this.gameScene && this.gameScene.showGameOver(true);
            if (awrdN == 2) {
                HHAudio.PlayEffect('getDoubleScore');
            }
            ModuleStatistics.ChangeCurGameState('afterGame');
        }
        ShowDoubleAward() {
            this.gameScene && this.gameScene.showDoubleAward(true);
        }
        PauseGame(_pause) {
            if (!this.isInGame) {
                return;
            }
            this.isPause = _pause;
            if (_pause) {
                ClockUtil.Pause(this.gameClockName);
            }
            else {
                ClockUtil.Resume(this.gameClockName);
            }
            this.gameScene && this.gameScene.GamePause(_pause);
        }
        InGame() {
            this.isInGame = true;
        }
        OutGame() {
            this.isInGame = false;
            if (this.restartTimeID) {
                clearTimeout(this.restartTimeID);
                this.restartTimeID = 0;
            }
            ClockUtil.Stop(this.gameClockName);
        }
        PreventGameTouch() {
            this.gameTouchEnabled = false;
            Laya.timer.frameOnce(2, this, this.restoreGameTouchState);
        }
        restoreGameTouchState() {
            this.gameTouchEnabled = true;
        }
        IsGameTouchEnable() {
            return this.gameTouchEnabled;
        }
        NewFruit(_kind) {
            if (_kind > this.curTopKind) {
                this.curTopKind = _kind;
            }
        }
        SettleGameScore() {
            let _addscore = ((this.curScore / 1) * this.awardMult + 0.5) | 0;
            this.ChangeScore(_addscore);
            Laya.stage.event('curScore');
        }
        ShowGetScoreEffect(_info) {
            if (!this.gameScene) {
                return;
            }
            GetScore.Create(_info);
        }
        ShowComboEffect(_comboN) {
            if (!this.gameScene) {
                return;
            }
            ComboEffect.Create({ comboN: _comboN, pos: [375, Laya.stage.height / 2] });
        }
        ShowMergeAward(_data) {
            console.log('gameScene.ShowGameAward');
            this.gameScene && this.gameScene.ShowGameAward(_data);
        }
        ShowStartHint(_show) {
            this.gameScene && this.gameScene.ShowStartHint(_show);
        }
        SetAndPreLoadFruit(_fruitinfo) {
            let _urls = [];
            for (let index = 0; index < _fruitinfo.length; index++) {
                const fruit = _fruitinfo[index];
                _urls.push(fruit.url);
                this.fruitUrlObj['id' + fruit.id] = { url: fruit.url, custom: fruit.custom };
            }
            console.log('SetAndPreLoadFruit fruitUrlObj', this.fruitUrlObj);
            console.log('_urls', _urls);
            Laya.loader.load(_urls, Laya.Handler.create(this, (isSuccess) => {
                console.log('水果皮肤加载完毕：', isSuccess);
            }));
        }
        GetFruitUrlInfo(_id) {
            if (typeof _id == 'number') {
                let _info = this.fruitUrlObj['id' + _id];
                if (_info) {
                    return _info;
                }
                return { url: `img/fruits/` + this.fruitConfig[_id - 1].image, custom: false };
            }
            else {
                return { url: `img/fruits/` + this.propFruitConfig[_id].image, custom: false };
            }
        }
        GetFruitConfig(_id) {
            if (typeof _id == 'number') {
                return this.fruitConfig[_id - 1];
            }
            return this.propFruitConfig[_id];
        }
        SetGameExpendCoin(_coin) {
            console.error('不从服务端设置花费次数数量', _coin);
        }
        InitCoin() {
            ModuleGlobal.ListenCurrencyChange(GCurrencyType.times, this, (_n) => {
                this.myCoin = _n;
                Laya.stage.event('coin');
            });
            this.myCoin = ModuleGlobal.MyCurrency.times;
            ModuleGlobal.UpdateCurrency(GCurrencyType.times);
        }
        ChangeCoin(_add, cbSuccess, cbFail, taskId) {
            if (ModulePackage.Instance.CanUseNetAPI()) {
                if (_add == 0) {
                    return;
                }
                if (_add > 0) {
                    console.error('ChangeCoin', '没有add');
                }
                else {
                    ModuleGlobal.ConsumeCurrency(GCurrencyType.times, -_add, (_success) => {
                        if (_success) {
                            cbSuccess && cbSuccess();
                        }
                        else {
                            cbFail && cbFail();
                        }
                    });
                }
            }
            else {
                this.myCoin += _add;
                Laya.stage.event('coin');
                cbSuccess && cbSuccess();
            }
        }
        GetCoin() {
            return this.myCoin;
        }
        InitScore(_score = 0) {
            ModuleGlobal.ListenCurrencyChange(GCurrencyType.wmScore, this, (_n) => {
                this.myScore = _n;
                Laya.stage.event('score');
            });
            this.myScore = ModuleGlobal.MyCurrency.wmScore;
            ModuleGlobal.UpdateCurrency(GCurrencyType.wmScore);
        }
        ChangeScore(_add) {
            ModuleGlobal.AddRankScore(_add);
        }
        GetScore() {
            return this.myScore;
        }
        InitNewInBag(_n = 0) {
            this.newInBag = _n;
            Laya.stage.event('newInBag');
        }
        ChangeNewInBag(_add) {
            this.newInBag += _add;
            Laya.stage.event('newInBag');
        }
        GetNewInBag() {
            return this.newInBag;
        }
        InitNewInCoin(_n = 0) {
            this.newInCoin = _n;
            Laya.stage.event('newInCoin');
        }
        ChangeNewInCoin(_add) {
            this.newInCoin += _add;
            Laya.stage.event('newInCoin');
        }
        GetNewInCoin() {
            return this.newInCoin;
        }
        ResetCurScore() {
            this.curScore = 0;
            Laya.stage.event('curScore');
        }
        AddScoreByKind(_kind) {
            let _addscore = this.fruitConfig[_kind - 1].score;
            if (this.maxFruitKind == _kind) {
                this.gameScene && this.gameScene.ShowMergeExternAward(this.maxExtScore);
                HHAudio.PlayEffect('mergeTop');
            }
            this.AddCurScore(_addscore);
            return _addscore;
        }
        AddCurScore(_addscore) {
            this.curScore += _addscore;
            Laya.stage.event('curScore');
            return this.curScore;
        }
        GetCurScore() {
            return this.curScore;
        }
        InitLuckyBagConfig(_config) {
            for (const key in this.luckyBagConfig) {
                if (!Object.prototype.hasOwnProperty.call(_config, key)) {
                    console.error('[福袋初始化]缺少字段:', key);
                    continue;
                }
                this.luckyBagConfig[key] = _config[key];
            }
        }
        GetLuckyBagConfig() {
            return this.luckyBagConfig;
        }
        checkLogin(cb) {
            if (PlayDataUtil.data.name == "玩家8573" || PlayDataUtil.data.name == "") {
                TB$1.authorize((data) => {
                    console.log("data: ", data);
                    PlayDataUtil.setData('name', data.nickName);
                    PlayDataUtil.setData('avatar', data.avatar);
                    MainUtil.reqUserInfo(data.avatar, data.nickName, () => {
                        cb && cb();
                        this.updateState();
                    });
                });
            }
            else {
                cb && cb();
                this.updateState();
            }
        }
        checkVIP() {
        }
        checkMember() {
        }
        updateState() {
            console.log('====== 更新页面状态 ======');
            MainUtil.reqShare((res) => {
                if (res.code == 0) {
                    if (res.data.invitationInfo.nickName != "") {
                        new Invite(res.data.invitationInfo);
                    }
                    else if (res.data.fromInfo.nickName != "") {
                        new Invite(res.data.fromInfo);
                    }
                }
            });
        }
        GetGameTaskIconUrl(_type) {
            const baseUrl = 'https://oss.ixald.com/' + 'BigWatermelon/C_client/taskIcon/';
            let _ext = '.png';
            let _iconstr = 'meiri';
            switch (_type) {
                case 'attention':
                    _iconstr = 'guanzhu';
                    break;
                case 'joinMember':
                    _iconstr = 'jiaru';
                    break;
                case 'browse':
                    _iconstr = 'liulan';
                    break;
                case 'browseStore':
                    _iconstr = 'liulanshouye';
                    break;
                case 'share':
                    _iconstr = 'yaoqing';
                    break;
                case 'collect':
                    _iconstr = 'shoucang';
                    break;
                case 'buy':
                    _iconstr = 'shangpinfuli';
                    break;
                default:
                    break;
            }
            return baseUrl + _iconstr + _ext;
        }
        ChangeToNumber(_v) {
            if (typeof _v == 'number') {
                return _v;
            }
            else if (typeof _v == 'string') {
                return Number(_v);
            }
            console.error('ChangeToNumber错误类型：', _v);
            return 0;
        }
        ExchangeAward(_type, _callback) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    activeId: TB$1._activeId,
                    type: _type
                };
                let info = { "id": Global.MSG_SCORE_EXHANGE, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    if (buf.code == 0) {
                        console.log('7002兑换成功', buf.data);
                        PlayDataUtil.setData('point', buf.data.point);
                        Laya.stage.event("updateValue");
                    }
                    else {
                        console.error('7002兑换失败', buf.message);
                    }
                    _callback(buf.code);
                });
            }
            else {
                _callback(-10);
            }
        }
        GetGameAward(_kind, _callback) {
            console.log('GetGameAward', _kind);
            if (this.isGotGameAward || _kind < this.maxFruitKind - 1) {
                return;
            }
            let _type = 8;
            if (_kind == this.maxFruitKind) {
                _type = 9;
            }
            {
                uiAutotriggerAward.AutoShow(_type, this.gameuid, (_show) => {
                    if (_show) {
                        this.isGotGameAward = true;
                        this.PauseGame(true);
                        HHAudio.PlayEffect('getCoupon');
                    }
                }, () => {
                    this.PauseGame(false);
                });
            }
        }
        InitLuckyBagState(_isBuy) {
        }
        BuyLuckyBag(_callbackFunc, sceneType = 3) {
        }
        CheckLuckyBagState() {
        }
        ListenLuckyBagState(caller, listener) {
            Laya.stage.on(this.LuckyBagEventKey, caller, listener);
        }
        listenRefreshNewNumber() {
            if (this.refreshNewNumber >= 0) {
                return this.refreshNewNumber;
            }
            let _refresh = () => {
                let _n = 0;
                let _tasks = TaskLogic.GetAllTaskInfo();
                console.log('_refresh');
                for (const task of _tasks) {
                    if (task.status == TaskStatusType.allow) {
                        _n++;
                    }
                }
                this.refreshNewNumber = _n;
                Laya.stage.event('refreshBubbleUI', _n);
            };
            Laya.stage.on('refreshBubble', this, _refresh);
            _refresh();
            return this.refreshNewNumber;
        }
        GetBrowseNewInfo(_successCallback, forceUpdate = false) {
            if (this.curBrowseNewInfo && !forceUpdate) {
                _successCallback && _successCallback(this.curBrowseNewInfo);
                return;
            }
            ServerAPI.Cloud.Connect('BrowseNewInfo', {
                callBack: (_sccess, _data, _code) => {
                    if (_sccess) {
                        this.curBrowseNewInfo = _data;
                        _successCallback && _successCallback(this.curBrowseNewInfo);
                    }
                }
            });
        }
        GetActivityState(_callBacK) {
        }
        WhetherHaveTask(_type) {
            switch (_type) {
                case 'joinMember':
                    if (ModulePlatformAPI.IsMember) {
                        return false;
                    }
                    return !!TaskLogic.GetTaskInfo(TaskType.joinMember);
                    break;
                case 'attention':
                    return !ModulePlatformAPI.IsFavor;
                    break;
                case 'browse':
                    return true;
                    break;
                case 'collect':
                    let _have = !ModuleGlobal.IsAllGoodsColelcted;
                    ModuleGlobal.GetGoodsList(undefined, { pageSize: 30, sortType: 'random' });
                    return _have;
                    break;
                case 'buy':
                    return false;
                    break;
                case 'share':
                    return true;
                case 'browseStore':
                    return true;
                    break;
                default:
                    break;
            }
            return false;
        }
        DoGameTask(_type, _callback) {
            let _taskCallback = (_success, data) => {
                _callback && _callback(_success, data);
                if (_success) {
                    this.ResetGameoverTask();
                    this.ClearFlyTaskLastInfo();
                }
            };
            if (Laya.Browser.onTBMiniGame) {
                let _task = TaskType.scanGoods;
                switch (_type) {
                    case 'attention':
                        _task = TaskType.subscribeShop;
                        break;
                    case 'browse':
                        _task = TaskType.scanGoods;
                        break;
                    case 'browseStore':
                        _task = TaskType.scanShop;
                        break;
                    case 'buy':
                        _task = TaskType.spend;
                        break;
                    case 'collect':
                        _task = TaskType.collectGoods;
                        break;
                    case 'joinMember':
                        _task = TaskType.joinMember;
                        break;
                    case 'share':
                        _task = TaskType.friendship;
                        break;
                    default:
                        break;
                }
                TaskLogic.DoTask(_task, (_success) => {
                    _taskCallback(_success);
                    if (_success) {
                        ModuleStatistics.CompleteTask(_type);
                    }
                }, 0, false);
            }
            else {
                _taskCallback(true);
            }
        }
        ResetGameoverTask() {
            this.preDoGameOverTask = null;
        }
        GetGameOverTask() {
            if (this.preDoGameOverTask !== null) {
                return this.preDoGameOverTask;
            }
            const taskList = ['joinMember', 'attention', ['browse', 'collect']];
            let _gettask = 0;
            for (const task of taskList) {
                if (typeof task == 'string') {
                    if (this.WhetherHaveTask(task)) {
                        _gettask = task;
                        break;
                    }
                }
                else {
                    let _arr = task.sort(v => Math.random() - 0.5);
                    while (_arr.length > 0) {
                        let _ctask = _arr.pop();
                        if (this.WhetherHaveTask(_ctask)) {
                            _gettask = _ctask;
                            break;
                        }
                    }
                    if (_gettask) {
                        break;
                    }
                }
            }
            this.preDoGameOverTask = _gettask;
            return _gettask;
        }
        AutoTriggerGameFlyTask() {
            const teiggerCondition = [
                { time: 30, score: 90 },
                { time: 120, score: 160 },
                { time: 200, score: 200 },
                { time: 300, score: 300 },
            ];
            let _trigger = false;
            for (let index = this.curFlyTaskLevel; index < teiggerCondition.length; index++) {
                const _condition = teiggerCondition[index];
                if (ClockUtil.GetTime(this.gameClockName) <= _condition.time || this.curScore <= _condition.score) {
                    break;
                }
                this.curFlyTaskLevel = index + 1;
                _trigger = true;
            }
            if (_trigger) {
                let _awardType = this.GetCurGameFlyTaskAwardType();
                let _taskType = this.GetGameFlyTaskType(_awardType);
                this.ShowGameFlyTask();
            }
        }
        ShowGameFlyTask() {
            console.log('ShowGameFlyTask');
            this.gameScene && this.gameScene.ShowFlyTask();
        }
        HideGameFlyTask() {
            console.log('HideGameFlyTask');
            this.gameScene && this.gameScene.HideFlyTask();
        }
        ResetGameFlyTask() {
            this.curFlyTaskLevel = 0;
            this.ClearFlyTaskLastInfo();
        }
        ClearFlyTaskLastInfo() {
            this.lastgetFlyTaskInfo = {
                id: 0,
                awardType: null,
                taskType: null,
            };
        }
        GetCurGameFlyTaskAwardType() {
            if (this.curFlyTaskLevel < 1) {
                return null;
            }
            if (this.lastgetFlyTaskInfo.id == this.curFlyTaskLevel && this.lastgetFlyTaskInfo.awardType) {
                return this.lastgetFlyTaskInfo.awardType;
            }
            let _curprob = { clearFruit: 50, removeFruit: 40, supperFruit: 10, addScore: 0 };
            let _hp = (this.fruitTopY - this.gameFruitValidY.bottom) / (this.gameFruitValidY.top - this.gameFruitValidY.bottom) * 100;
            console.log('当前水果最高高度占比', _hp);
            if (this.curFlyTaskLevel < 2 || _hp < 70) {
                const _allprob = [
                    { clearFruit: 20, removeFruit: 20, supperFruit: 50, addScore: 10 },
                    { clearFruit: 10, removeFruit: 40, supperFruit: 30, addScore: 20 },
                    { clearFruit: 40, removeFruit: 20, supperFruit: 30, addScore: 10 },
                    { clearFruit: 10, removeFruit: 20, supperFruit: 20, addScore: 10 },
                ];
                _curprob = _allprob[this.curFlyTaskLevel - 1];
            }
            let _totalprob = 0;
            for (const key in _curprob) {
                _totalprob += _curprob[key];
            }
            let _key = '';
            let _randp = Math.random() * _totalprob;
            for (const key in _curprob) {
                if (_randp < _curprob[key]) {
                    _key = key;
                    break;
                }
                _randp -= _curprob[key];
            }
            if (_key == '') {
                console.error('[GetCurGameFlyTaskAwardType] 数据错误', this.curFlyTaskLevel, _hp);
                return null;
            }
            this.lastgetFlyTaskInfo.id = this.curFlyTaskLevel;
            this.lastgetFlyTaskInfo.awardType = _key;
            return _key;
        }
        GetGameFlyTaskType(_awardType) {
            if (this.lastgetFlyTaskInfo.id == this.curFlyTaskLevel && this.lastgetFlyTaskInfo.taskType) {
                return this.lastgetFlyTaskInfo.taskType;
            }
            const taskProb = {
                clearFruit: { browse: 10, buy: 40, collect: 10, share: 20, browseStore: 20 },
                removeFruit: { browse: 20, buy: 30, collect: 10, share: 30, browseStore: 10 },
                supperFruit: { browse: 30, buy: 10, collect: 20, share: 30, browseStore: 10 },
                addScore: { browse: 20, buy: 10, collect: 20, share: 30, browseStore: 20 }
            };
            let _curprob = taskProb[_awardType];
            let _totalprob = 0;
            for (const key in _curprob) {
                if (_curprob[key] > 0) {
                    if (!this.WhetherHaveTask(key)) {
                        _curprob[key] = 0;
                        continue;
                    }
                }
                console.log("按概率随机任务:", key, _curprob[key]);
                _totalprob += _curprob[key];
            }
            let _key = '';
            let _randp = Math.random() * _totalprob;
            for (const key in _curprob) {
                if (_randp < _curprob[key]) {
                    _key = key;
                    break;
                }
                _randp -= _curprob[key];
            }
            if (_key == '') {
                console.error('[GetGameFlyTaskType] 数据错误', _awardType);
                return null;
            }
            this.lastgetFlyTaskInfo.id = this.curFlyTaskLevel;
            this.lastgetFlyTaskInfo.taskType = _key;
            return _key;
        }
        DoGameFlyTask(_taskType, _awardType, callBack) {
            this.DoGameTask(_taskType, (_success) => {
                if (_success) {
                    console.log('DoGameFlyTask', _awardType, GameFlyTaskAwardInfo[_awardType]);
                    let _awardData = GameFlyTaskAwardInfo[_awardType].data;
                    switch (_awardType) {
                        case 'clearFruit':
                            let _h = Math.abs(this.gameFruitValidY.top - this.gameFruitValidY.bottom) * _awardData;
                            this.myGameScene.clearFruitYExceed(this.gameFruitValidY.bottom - _h);
                            HHAudio.PlayEffect('propClear');
                            break;
                        case 'removeFruit':
                            this.myGameScene.removeFruitBelowLevel(_awardData);
                            HHAudio.PlayEffect('propClear');
                            break;
                        case 'supperFruit':
                            this.myGameScene.GetASupperFruit();
                            HHAudio.PlayEffect('propSupperFruit');
                            break;
                        case 'addScore':
                            this.AddCurScore(_awardData);
                            this.ShowGetScoreEffect({ score: _awardData, pos: [375, 500] });
                            HHAudio.PlayEffect('propScore');
                            break;
                        default:
                            break;
                    }
                    this.HideGameFlyTask();
                }
                callBack && callBack(_success);
            });
        }
        flyTaskTest(_level, _task, _awardTask) {
            this.curFlyTaskLevel = _level;
            this.lastgetFlyTaskInfo = {
                id: _level,
                awardType: _awardTask,
                taskType: _task,
            };
            this.ShowGameFlyTask();
        }
    }
    GameLogic_c.instance = null;
    let GameLogic = GameLogic_c.INS();

    class TB {
        constructor() {
            this._dataQueue = [];
            this._isAuthorize = false;
            this._userInfo = null;
            this.isLogin = false;
            this._socket = null;
            this._openid = "";
            this._shopOpenid = "";
            this._shopId = "";
            this._storeId = "";
            this._activeId = "";
            this._serverData = null;
            this.isNetSuccess = true;
        }
        static getInstance() {
            this._instance = this._instance || new TB();
            return this._instance;
        }
        init() {
            console.log("TB initSuccess");
            if (!Laya.Browser.onTBMiniGame)
                return;
            this.initShow();
            this.initNetState();
            Laya.timer.frameLoop(5, this, () => {
                this.onUpdate();
            });
        }
        checkApiLv(apiName, sdkName) {
            if (!Laya.Browser.onTBMiniGame)
                return false;
            if (!sdkName || sdkName == undefined) {
                if (my[apiName])
                    return true;
            }
            else {
                if (my[sdkName][apiName])
                    return true;
            }
            console.log('当前版本不支持该API: ', apiName);
            return false;
        }
        getSystemInfoSync() {
            if (!this.checkApiLv("authorize"))
                return null;
            return my.getSystemInfoSync();
        }
        authorize(authorizeSuccess, fail) {
            if (!this.checkApiLv("authorize"))
                return;
            let self = this;
            my.authorize({
                scopes: 'scope.userInfo',
                success: (res) => {
                    console.log("authorize res: ", res);
                    self._isAuthorize = true;
                    my.getAuthUserInfo({
                        success: (userInfo) => {
                            self._userInfo = userInfo;
                            if (authorizeSuccess) {
                                authorizeSuccess(self._userInfo);
                            }
                        }, fail: () => {
                            console.log("获取授权失败 引导授权界面");
                            if (!this.checkApiLv("showAuthGuide"))
                                return;
                            my.showAuthGuide();
                        }
                    });
                },
                fail: () => {
                    if (fail) {
                        fail();
                    }
                }
            });
        }
        getAuthUserInfo(callback) {
            if (!this._userInfo) {
                if (!this._isAuthorize) {
                    this.authorize(callback);
                }
                else {
                    let self = this;
                    if (!this.checkApiLv("getAuthUserInfo"))
                        return;
                    my.getAuthUserInfo({
                        success: (userInfo) => {
                            self._userInfo = userInfo;
                            if (callback) {
                                callback(self._userInfo);
                            }
                        }, fail: () => {
                            console.log("获取授权失败 引导授权界面");
                            if (!this.checkApiLv("showAuthGuide"))
                                return;
                            my.showAuthGuide();
                        }
                    });
                }
            }
            else {
                if (callback) {
                    callback(this._userInfo);
                }
            }
        }
        login(loginSuccess, loginFail) {
            if (this.isLogin) {
                if (!this.getServerData()) {
                    this.isLogin = false;
                    if (loginFail) {
                        loginFail();
                    }
                    return;
                }
                if (loginSuccess)
                    loginSuccess(this.getServerData());
                return;
            }
            this.showLoad("拉取配置中");
            let app = getApp();
            app["getServerData"]((res) => {
                console.log("login getServerData: ", res);
                if (res["code"] == 0) {
                    console.log("login成功");
                    this.isLogin = true;
                    this.hideLoad();
                    console.log("res.data: ", res.data);
                    this._openid = res.data.userOpenId;
                    this._shopOpenid = res.data.openid;
                    this._shopId = res.data.shopId;
                    if (res.data.hasOwnProperty("storeId")) {
                        this._storeId = res.data.storeId;
                    }
                    this._activeId = res.data.activeId;
                    console.log("_storeId = ", this._storeId);
                    console.log("this._openid: ", this._openid);
                    console.log("this._shopOpenid: ", res.data.openid);
                    this.setServerData(res.data);
                    if (loginSuccess) {
                        loginSuccess(res.data);
                    }
                }
                else if (res["code"] == -11) {
                    this.showToast("黑名单玩家，暂时无法进入游戏！");
                }
                else {
                    console.log("login失败");
                    this.hideLoad();
                    this.isLogin = false;
                    this.showToast("拉取配置失败");
                    if (loginFail) {
                        loginFail();
                    }
                }
            }, Global.hallConfig._version);
        }
        setServerData(data) {
            this._serverData = data;
        }
        getServerData() {
            return this._serverData;
        }
        sendServer(data, callback) {
            data["clientVersion"] = Global.hallConfig._version;
            console.log("sendServer: ", data);
            if (this._openid == undefined || this._openid == "") {
                this.login();
                return;
            }
            let app = getApp();
            if (app["sendServer"]) {
                app["sendServer"](data, callback);
            }
        }
        sendAnalysis(data, callback) {
            data["clientVersion"] = Global.hallConfig._version;
            console.log("sendServerAnalysis: ", data);
            let app = getApp();
            if (app["sendServer"]) {
                app["sendServer"](data, callback);
            }
        }
        share(shareSuccess, shareFail) {
            if (!this.checkApiLv("showSharePanel"))
                return;
            let app = getApp();
            app.setShare({
                title: Global.ResourceManager.getShareConfig().shareTitle || "合成大作战",
                desc: Global.ResourceManager.getShareConfig().shareDesc || "合成大作战",
                imageUrl: Global.ResourceManager.getShareConfig().shareURL || "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/admin/images/config/skin/tmp_3.png",
                path: "pages/index/game?fromId=" + this._openid + "&activeId=" + app.activeId
            });
            if (shareSuccess) {
                app.global["shareSuccess"] = shareSuccess;
            }
            if (shareFail) {
                app.global["shareFail"] = shareFail;
            }
            my.showSharePanel();
            return;
            my.showSharePanel();
        }
        initNetState() {
            if (!this.checkApiLv("getNetworkType"))
                return;
            let self = this;
            my.getNetworkType({
                success: (res) => {
                    self.isNetSuccess = res.networkAvailable ? true : false;
                }
            });
            my.onNetworkStatusChange((res) => {
                self.isNetSuccess = res.isConnected ? true : false;
            });
        }
        getNetState() {
            return this.isNetSuccess;
        }
        initShow() {
            let app = getApp();
            app["global"]["onShow"] = this.onShow;
            app["global"]["onHide"] = this.onHide;
            MainUtil.initActivityTime();
        }
        onShow() {
            console.log("TB onshow");
            Laya.stage.event("checkOrder");
            Laya.stage.event("checkBrowse");
            Laya.stage.event("TBTaskChange");
            Laya.stage.event("checkShare");
            MainUtil.initActivityTime();
            GameLogic.CheckLuckyBagState();
            SoundPlayer$1.resumeSound();
        }
        onHide() {
            console.log("TB onHide");
            if (MainUtil.getCurScene() == Global.hallConfig.CUR_SCENE.loading) {
                let t = new Date().getTime() - TB.getInstance().getOpenAppTime();
                console.log("openApp->exit time = ", t);
            }
            MainUtil.sendActivityTime();
            SoundPlayer$1.pauseSound();
        }
        showLoad(content) {
            if (!this.checkApiLv("showLoading"))
                return;
            let str_content = content == undefined ? "加载中..." : content;
            my.showLoading({
                content: str_content,
                delay: 1000,
            });
            setTimeout(() => {
                this.hideLoad();
            }, 5000);
        }
        hideLoad() {
            if (!this.checkApiLv("hideLoading"))
                return;
            my.hideLoading();
        }
        showToast(content) {
            if (!this.checkApiLv("showToast"))
                return;
            if (!content || content == undefined)
                return;
            my.showToast({
                type: 'success',
                content: content,
                duration: 2000,
                success: () => {
                },
            });
        }
        confirm(title, content, str_sure = "确定", str_cancel = "取消") {
            if (!this.checkApiLv("confirm"))
                return;
            my.confirm({
                title: title,
                content: content,
                confirmButtonText: str_sure,
                cancelButtonText: str_cancel,
                success: (result) => {
                    console.log("result: ", result);
                },
            });
        }
        task() {
        }
        openDetail(good_id, success, fail) {
            console.log('===== openDetail ====', good_id);
            if (!this.checkApiLv("openDetail", "tb"))
                return;
            my.tb.openDetail({
                itemId: '' + good_id,
                success: (res) => {
                    if (success) {
                        success();
                    }
                },
                fail: (res) => {
                    if (fail) {
                        fail();
                    }
                },
            });
        }
        collectGoods(good_id, success, fail) {
            if (!this.checkApiLv("collectGoods", "tb"))
                return;
            let self = this;
            my.tb.collectGoods({
                id: good_id,
                success: (res) => {
                    self.showToast("收藏成功");
                    if (success) {
                        success(res);
                    }
                },
                fail: (res) => {
                    if (fail) {
                        fail(res);
                    }
                },
                complete: (res) => {
                }
            });
        }
        unCollectGoods(good_id) {
            if (!this.checkApiLv("unCollectGoods", "tb"))
                return;
            let self = this;
            my.tb.unCollectGoods({
                id: '' + good_id,
                success: (res) => {
                    self.showToast("取消关注");
                },
                fail: (res) => {
                },
                complete: (res) => {
                }
            });
        }
        checkGoodsCollectedStatus(good_id, func) {
            if (!this.checkApiLv("checkGoodsCollectedStatus", "tb"))
                return;
            let self = this;
            my.tb.checkGoodsCollectedStatus({
                id: '' + good_id,
                success: (res) => {
                    if (func) {
                        func(res.isCollect);
                    }
                },
            });
        }
        checkShopFavoredStatus(callback, failCallback) {
            if (!this.checkApiLv("checkShopFavoredStatus", "tb"))
                return;
            my.tb.checkShopFavoredStatus({
                id: '' + this._shopId,
                success: (res) => {
                    if (callback) {
                        callback(res);
                    }
                },
                fail: (res) => {
                    failCallback && failCallback(res);
                }
            });
        }
        favorShop(successFunc, failFunc, type = 0) {
            if (!this.checkApiLv("favorShop", "tb"))
                return;
            let self = this;
            console.log("shopid = ", this._shopId);
            my.tb.favorShop({
                id: '' + this._shopId,
                success: (res) => {
                    if (successFunc) {
                        successFunc();
                    }
                    self.showToast("关注成功");
                },
                fail: (res) => {
                    if (failFunc) {
                        failFunc();
                    }
                    self.showToast("关注失败");
                }
            });
        }
        unFavorShop(shop_id) {
            if (!this.checkApiLv("unFavorShop", "tb"))
                return;
            let self = this;
            my.tb.unFavorShop({
                id: '' + shop_id,
                success: (res) => {
                    self.showToast("取消关注");
                },
                fail: (res) => {
                }
            });
        }
        navigateToMiniProgram(app_Id) {
            if (!this.checkApiLv("navigateToMiniProgram"))
                return;
            my.navigateToMiniProgram({
                appId: app_Id,
                extraData: {
                    "data1": "test"
                },
                success: (res) => {
                    console.log(JSON.stringify(res));
                },
                fail: (res) => {
                    console.log(JSON.stringify(res));
                }
            });
        }
        navigateToTaobaoPage(successFunc, failFunc) {
            if (!this.checkApiLv("navigateToTaobaoPage", "tb"))
                return;
            let self = this;
            my.tb.navigateToTaobaoPage({
                appCode: 'shop',
                appParams: {
                    shopId: '' + self._storeId,
                    weexShopSubTab: "shopindex",
                    weexShopTab: "shopindexbar"
                },
                success: (res) => {
                    console.log("跳转店铺成功");
                    if (successFunc) {
                        successFunc();
                    }
                },
                fail: (err) => {
                    console.log("跳转店铺失败: ", err);
                    if (failFunc) {
                        failFunc();
                    }
                }
            });
        }
        reportAnalytics(state, data) {
            if (!this.checkApiLv("reportAnalytics"))
                return;
            my.reportAnalytics(state, data);
        }
        showSku(good_id, success) {
            if (!this.checkApiLv("showSku", "tb"))
                return;
            my.tb.showSku({
                itemId: good_id,
                success: (res) => {
                    console.log("skuId = ", res.skuId);
                    if (success) {
                        success(true);
                    }
                },
                fail: (res) => {
                    if (success) {
                        success(false);
                    }
                },
            });
        }
        order(good_id, sku_id, quantity, success) {
            if (!this.checkApiLv("confirmCustomOrder", "tb"))
                return;
            my.tb.confirmCustomOrder({
                itemId: good_id,
                skuId: sku_id,
                quantity: quantity,
                success: (res) => {
                    if (success) {
                        success();
                    }
                },
                fail: (res) => {
                },
            });
        }
        chooseAddress(success) {
            console.log('chooseAddress', 1);
            if (!this.checkApiLv("chooseAddress", "tb"))
                return;
            console.log('chooseAddress', 2);
            my.authorize({
                scopes: 'scope.addressList',
                success: (result) => {
                    console.log('chooseAddress authorize', result);
                    my.tb.chooseAddress({
                        addAddress: "show",
                        searchAddress: "hide",
                        locateAddress: "hide",
                        success: (res) => {
                            console.log('======= 收货地址 ======', JSON.stringify(res));
                            if (success) {
                                let data = {
                                    name: res.name,
                                    phone: res.telNumber,
                                    address: res.provinceName + res.cityName + res.countyName + res.streetName + res.detailInfo,
                                    province: res.provinceName,
                                    city: res.cityName,
                                    county: res.countyName,
                                    street: res.streetName,
                                    detailInfo: res.detailInfo
                                };
                                success(data);
                            }
                        },
                        fail: (res) => {
                            success && success(null);
                            console.error('======= 收货失败 ======', JSON.stringify(res));
                        },
                    });
                },
            });
        }
        openMember(closeCB, resultCB) {
            if (!Laya.Browser.onTBMiniGame)
                return;
            if (this._openid == undefined || this._openid == "") {
                this.login();
                return;
            }
            let app = getApp();
            if (app["openMember"]) {
                app["openMember"](closeCB, resultCB);
            }
        }
        checkMember(callback) {
            if (!Laya.Browser.onTBMiniGame)
                return;
            if (this._openid == undefined || this._openid == "") {
                this.login();
                return;
            }
            console.log('==== checkMember ====');
            let app = getApp();
            if (app["checkMember"]) {
                app["checkMember"](callback);
            }
        }
        sendMsg(data, callBack, priority) {
            priority = (priority == undefined) ? 2 : priority;
            let msg = { data: data, callBack: callBack, priority: priority };
            for (let i = this._dataQueue.length - 1; i >= 0; i--) {
                let tmp = this._dataQueue[i];
                if (tmp.priority <= priority) {
                    this._dataQueue.splice(i + 1, 0, msg);
                    console.log("this._dataQueue = ", this._dataQueue);
                    return;
                }
            }
            this._dataQueue.splice(0, 0, msg);
        }
        onUpdate() {
            if (this._dataQueue.length > 0) {
                let msg = this._dataQueue.shift();
                if (msg != undefined && msg != null) {
                    this.sendServer(msg.data, msg.callBack);
                    console.log("发送数据成功，消息id = ", msg.data.id);
                }
            }
        }
        phoneVibrate() {
            my.vibrate({
                success: () => {
                }
            });
        }
        setName(name) {
            let app = getApp();
            app.setName(name);
        }
        getRunScene(cb) {
            if (!this.checkApiLv("getRunScene"))
                return;
            my.getRunScene({
                success(result) {
                    cb(result.envVersion);
                },
            });
        }
        getTaskList(cb) {
            let app = getApp();
            app.getTaskList((res) => {
                cb && cb(res);
            });
        }
        triggerItem(title, cb) {
            let app = getApp();
            app.triggerItem(title, (res) => {
                cb && cb(res);
            });
        }
        setBarColor(style) {
            if (!Laya.Browser.onTBMiniGame)
                return;
            let app = getApp();
            app.setBarColor(style);
        }
        getOpenAppTime() {
            let time = 0;
            if (!Laya.Browser.onTBMiniGame)
                return time;
            let app = getApp();
            time = app.getOpenAppTime();
            return time;
        }
    }
    TB._instance = null;
    var TB$1 = TB.getInstance();

    class RankUtil extends Laya.Script {
        static init() {
            this.ranklist = [];
            this.defualtList = [];
            let rankConf = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.rankConfig);
            for (let i = 0; i < 50; i++) {
                let player = {
                    name: rankConf[i].name,
                    avatar: 'hallRes/common/tx_player.png',
                    score: rankConf[i].score || 0,
                };
                this.defualtList.push(player);
            }
            this.updateRank();
            this.initAward();
        }
        static updateRank() {
            this.ranklist = JSON.parse(JSON.stringify(this.defualtList));
            let myPlayer = this.getMyPlayer();
            this.rank = 999;
            for (let i = 0; i < 50; i++) {
                if (myPlayer.score > this.ranklist[i].score) {
                    this.rank = i;
                    break;
                }
            }
            if (this.rank <= 50) {
                this.ranklist.splice(this.rank, 0, myPlayer);
            }
        }
        static initAward() {
            let conf = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.awardConfig);
            this._awardList = [];
            for (let i = 0; i < conf.length; i++) {
                const awards = conf[i];
                let award = {
                    type: i + 1,
                    rankMin: awards.rank1,
                    rankMax: awards.rank2,
                    rewards: []
                };
                let rewards = [];
                for (let j = 1; j <= 2; j++) {
                    if (awards['rewardType' + j]) {
                        let reward = {
                            type: awards['rewardType' + j],
                            count: awards['rewardCount' + j],
                            id: awards['rewardId' + j] || 1
                        };
                        rewards.push(reward);
                    }
                }
                award.rewards = rewards;
                this._awardList.push(award);
            }
        }
        static getList() {
            return this.ranklist;
        }
        static getMyPlayer() {
            let myPlayer = {
                name: PlayDataUtil.data.name,
                avatar: PlayDataUtil.data.avatar,
                score: PlayDataUtil.data.point || 0
            };
            return myPlayer;
        }
        static getMyRank() {
            return this.rank + 1;
        }
        static saveCurRankData(list, myRank, myPoint) {
            this._curRankList = list;
            this._myCurRank = myRank;
            this._myCurPoint = myPoint;
        }
        static getCurRankData() {
            return this._curRankList;
        }
        static getMyCurRank() {
            return this._myCurRank;
        }
        static getMyCurPoint() {
            return this._myCurPoint;
        }
        static saveLastRankData(list, myRank, myPoint) {
            this._lastRankList = list;
            this._myLastRank = myRank;
            this._myLastPoint = myPoint;
        }
        static getLastRankData() {
            return this._lastRankList;
        }
        static getMyLastRank() {
            return this._myLastRank;
        }
        static getMyLastPoint() {
            return this._myLastPoint;
        }
        static updateAwards(list) {
            let conf = JSON.parse(JSON.stringify(this._awardList));
            this._rankAwardList = [];
            for (let i = 0; i < list.length; i++) {
                let award = {
                    type: i + 1,
                    rankMin: list[i].rankNums[0],
                    rankMax: list[i].rankNums[1],
                    rewards: []
                };
                let rewards = [];
                let rewardB = {
                    type: list[i].name || 'goods',
                    count: list[i].num,
                    name: list[i].title,
                    url: list[i].pic_url,
                    price: list[i].price
                };
                rewards.push(rewardB);
                if (i < conf.length) {
                    rewards.push(conf[i].rewards[0]);
                }
                award.rewards = rewards;
                this._rankAwardList.push(award);
            }
            console.log('====== 最新奖励列表 ======', this._rankAwardList);
        }
        static getRankAwards(rank) {
            for (let i = 0; i < this._rankAwardList.length; i++) {
                const awards = this._rankAwardList[i];
                if (rank > 0 && rank <= awards.rankMax) {
                    return awards;
                }
            }
            return null;
        }
        static getRankAwardList() {
            return this._rankAwardList;
        }
        static updateLastAwards(list) {
            let conf = JSON.parse(JSON.stringify(this._awardList));
            this._lastRankAwardList = [];
            for (let i = 0; i < list.length; i++) {
                let award = {
                    type: i + 1,
                    rankMin: list[i].rankNums[0],
                    rankMax: list[i].rankNums[1],
                    rewards: []
                };
                let rewards = [];
                let rewardB = {
                    type: list[i].name || 'goods',
                    count: list[i].num,
                    name: list[i].title,
                    url: list[i].pic_url,
                    price: list[i].price
                };
                rewards.push(rewardB);
                if (i < conf.length) {
                    rewards.push(conf[i].rewards[0]);
                }
                award.rewards = rewards;
                this._lastRankAwardList.push(award);
            }
        }
        static getLastRankAwards(rank) {
            for (let i = 0; i < this._lastRankAwardList.length; i++) {
                const awards = this._lastRankAwardList[i];
                if (rank > 0 && rank <= awards.rankMax) {
                    return awards;
                }
            }
            return null;
        }
        static getLastRankAwardList() {
            return this._lastRankAwardList;
        }
        static getMyAward(type) {
            for (let i = 0; i < this._lastRankAwardList.length; i++) {
                const awards = this._lastRankAwardList[i];
                if (type == awards.type) {
                    return awards;
                }
            }
            return null;
        }
    }
    RankUtil._myCurRank = 999;
    RankUtil._myLastRank = 999;
    RankUtil._myLastPoint = 0;
    RankUtil._myCurPoint = 0;

    class Alert {
        constructor(txt, cbConfirm, cbCancel) {
            this._cbConfirm = cbConfirm || null;
            this._cbCancel = cbCancel || null;
            this._main = fgui.UIPackage.createObject("Common", "Alert").asCom;
            this._main.makeFullScreen();
            this._main.addRelation(fgui.GRoot.inst, fgui.RelationType.Size);
            this._trans = this._main.getTransition("packUp");
            fgui.GRoot.inst.addChild(this._main);
            this._view = this._main.getChild('alert').asCom;
            let text = this._view.getChild('tipsTxt').asTextField;
            this._view.getChild("confirmBtn").onClick(this, this._cbConfirm ? this.onConfirm : this.onBack);
            this._view.getChild("cancelBtn").onClick(this, this.onCancel);
            let alertCtrl = this._view.getController('alertCtrl');
            alertCtrl.selectedIndex = cbCancel ? 0 : 1;
            text.text = txt;
            let lText = text.displayObject;
            if (lText.textHeight > lText.fontSize + lText.leading) {
                lText.align = "left";
            }
            if (lText.textHeight < 230) {
                text.autoSize = 0;
                text.height = 230;
            }
        }
        onBack() {
            var callback = Laya.Handler.create(this, function () {
                this._main.dispose();
            });
            this._trans.play(callback);
        }
        onConfirm() {
            HHAudio.PlayEffect('btn');
            this._cbConfirm && this._cbConfirm();
            this.onBack();
        }
        onCancel() {
            HHAudio.PlayEffect('btn');
            this._cbCancel && this._cbCancel();
            this.onBack();
        }
    }

    class MainUtil extends Laya.Script {
        static isSameWeek(old, now) {
            old = new Date(old);
            now = new Date(now);
            var oneDayTime = 1000 * 60 * 60 * 24;
            var old_count = Math.ceil(old.getTime() / oneDayTime);
            var now_other = Math.ceil(now.getTime() / oneDayTime);
            return Math.ceil((old_count + 4) / 7) == Math.ceil((now_other + 4) / 7);
        }
        static dateFormat(fmt, date) {
            let ret;
            const opt = {
                "Y+": date.getFullYear().toString(),
                "m+": (date.getMonth() + 1).toString(),
                "d+": date.getDate().toString(),
                "H+": date.getHours().toString(),
                "M+": date.getMinutes().toString(),
                "S+": date.getSeconds().toString()
            };
            for (let k in opt) {
                ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")));
                }
                ;
            }
            ;
            return fmt;
        }
        static getDate() {
            return this.dateFormat("YYYY-mm-dd", new Date());
        }
        static getCountDown(timeMS) {
            let ms = timeMS % 1000;
            if (ms) {
                timeMS += 1000 - ms;
            }
            let replacePattern = {
                "d+": { div: 86400000, format: "天" },
                "h+": { div: 3600000, format: ":" },
                "m+": { div: 60000, format: ":" },
                "s+": { div: 1000, format: "" }
            };
            let format = "dhhmmss";
            let isHide = true;
            for (let key in replacePattern) {
                let toReplace = '';
                format = format.replace(new RegExp(key, 'g'), str => {
                    if (!toReplace) {
                        let pattern = replacePattern[key];
                        let result = timeMS / pattern.div | 0;
                        timeMS -= result * pattern.div;
                        let resultStr = result + '';
                        if (result == 0 && isHide) {
                            resultStr = '';
                            toReplace = resultStr;
                        }
                        else {
                            isHide = false;
                            toReplace = '0'.repeat(Math.max(str.length - resultStr.length, 0)) + resultStr + pattern.format;
                        }
                    }
                    return toReplace;
                });
            }
            return format;
        }
        static getTime(timeMS, format = 'dhms') {
            let ms = timeMS % 1000;
            if (ms) {
                timeMS += 1000 - ms;
            }
            let replacePattern = {
                "d+": { div: 86400000 },
                "h+": { div: 3600000 },
                "m+": { div: 60000 },
                "s+": { div: 1000 }
            };
            for (let key in replacePattern) {
                let toReplace = '';
                format = format.replace(new RegExp(key, 'g'), str => {
                    if (!toReplace) {
                        let pattern = replacePattern[key];
                        let result = timeMS / pattern.div | 0;
                        let resultStr = result + '';
                        timeMS -= result * pattern.div;
                        toReplace = '0'.repeat(Math.max(str.length - resultStr.length, 0)) + resultStr;
                    }
                    return toReplace;
                });
            }
            return format;
        }
        static formatNum(num, count) {
            let str = num + "";
            if (str.length < count) {
                str = '0'.repeat(Math.max(count - str.length, 0)) + str;
            }
            return str;
        }
        static getTimeSpan(startTime, endTime, type = 'sec') {
            if (type == 'sec') {
                return Math.floor((endTime - startTime) / 1000);
            }
            else if (type == 'min') {
                return Math.floor((endTime - startTime) / 1000 / 60);
            }
            else if (type == 'hour') {
                return Math.floor((endTime - startTime) / 1000 / 60 / 60);
            }
            else if (type == 'day') {
                return Math.floor((endTime - startTime) / 1000 / 60 / 60 / 24);
            }
            return Math.floor((endTime - startTime) / 1000);
        }
        static addReward(rewards, taskId) {
            for (let i = 0; i < rewards.length; i++) {
                const reward = rewards[i];
                if (reward.type == 'Skin') {
                    MainUtil.reqMyRole(parseInt(reward.id), () => {
                        let roleArr = PlayDataUtil.data.myRoleIDArray;
                        if (roleArr.indexOf(parseInt(reward.id)) == -1) {
                            roleArr.push(parseInt(reward.id));
                            PlayDataUtil.setData('myRoleIDArray', roleArr);
                        }
                    });
                }
                else if (reward.type == 'Coin') {
                    this.sendCoin(parseInt(reward.count), taskId);
                }
                else if (reward.type == 'Point') {
                    this.sendChangePoint(parseInt(reward.count), null, null);
                }
            }
        }
        static isChallenge() {
            return 0;
        }
        static getTips() {
            return '尚未开启，敬请期待';
        }
        static sendChangePoint(count, successFun, failFun) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    activeId: TB$1._activeId,
                    changePoint: parseInt(count) | 0,
                };
                let info = { "id": Global.MSG_UPLOAD_POINT, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    if (buf.code == 0) {
                        PlayDataUtil.setData('point', buf.data.point);
                        console.log("上报积分成功", buf.data);
                        Laya.stage.event("updateValue");
                        if (successFun) {
                            successFun();
                        }
                    }
                    else {
                        console.log("上报积分失败");
                        if (failFun) {
                            failFun();
                        }
                    }
                });
            }
            else {
                PlayDataUtil.setData('point', PlayDataUtil.data.point + count);
                if (successFun) {
                    successFun();
                }
                Laya.stage.event("updateValue");
            }
        }
        static sendCoin(addCoin, taskId, cbSuccess) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    activeId: TB$1._activeId,
                    changeCoin: parseInt(addCoin) | 0,
                };
                if (taskId) {
                    reqData["taskId"] = taskId;
                }
                let info = { "id": Global.MSG_COIN_ADD, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    if (buf.code == 0) {
                        PlayDataUtil.setData("coin", buf.data.userCoin);
                        Laya.stage.event("updateValue");
                        console.log("上报分数成功", buf.data);
                        cbSuccess && cbSuccess(buf.data.userCoin);
                    }
                    else {
                        console.log("上报分数失败");
                    }
                });
            }
            else {
                PlayDataUtil.setData('coin', PlayDataUtil.data.coin + addCoin);
            }
        }
        static costCoin(costCoin, cbSuccess, cbFail) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    activeId: TB$1._activeId,
                    changeCoin: parseInt(costCoin) | 0
                };
                let info = { "id": Global.MSG_COIN_COST, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    MyUtils.closeLoading();
                    if (buf.code == 0) {
                        PlayDataUtil.setData('coin', buf.data.userCoin);
                        console.log("上报消耗金币成功", buf.data);
                        cbSuccess && cbSuccess(buf.data.userCoin);
                    }
                    else {
                        cbFail && cbFail(buf.code);
                    }
                });
            }
            else {
                PlayDataUtil.setData('coin', PlayDataUtil.data.coin - costCoin);
            }
        }
        static sendVip(isVip, successFunc, FailFunc) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    activeId: TB$1._activeId,
                    vipState: (isVip == 1) ? true : false,
                };
                let info = { "id": Global.MSG_UPLOAD_VIPSTATE, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    if (buf.code == 0) {
                        PlayDataUtil.setData("isVip", isVip);
                        console.log("获得vip成功:1011", isVip);
                        if (successFunc) {
                            successFunc();
                        }
                    }
                    else {
                        if (FailFunc) {
                            FailFunc();
                        }
                        console.log("获得vip失败:1011", isVip);
                    }
                });
            }
        }
        static sendMember(isMember, successFunc, FailFunc) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    activeId: TB$1._activeId,
                    isMember: isMember,
                };
                let info = { "id": Global.MSG_MEMBER_STATE, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    if (buf.code == 0) {
                        PlayDataUtil.setData("isMember", isMember);
                        console.log("上报会员状态成功:1009", isMember);
                        if (successFunc) {
                            successFunc();
                        }
                    }
                    else {
                        if (FailFunc) {
                            FailFunc();
                        }
                        console.log("上报会员状态失败:1009", isMember);
                    }
                });
            }
        }
        static reqUserInfo(headUrl, name, func) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    headUrl: headUrl,
                    nickName: name,
                    activeId: TB$1._activeId,
                };
                let info = { "id": Global.MSG_LOGIN, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    if (buf.code == 0) {
                        console.log("上报玩家基础信息成功:1001");
                    }
                    else {
                        console.error("上报玩家基础信息失败:1001");
                    }
                    if (func) {
                        func();
                    }
                });
            }
        }
        static reqMyRole(roleId, func) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    roleId: roleId,
                    activeId: TB$1._activeId,
                };
                let info = { "id": Global.MSG_MY_ROLE, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    if (buf.code == 0) {
                        console.log("上报角色成功");
                    }
                    else {
                        console.log("上报角色失败");
                    }
                    if (func) {
                        func();
                    }
                });
            }
            else {
                if (func) {
                    func();
                }
            }
        }
        static showToast(txt) {
            let toast = fgui.UIPackage.createObject("Common", "Toast").asCom;
            toast.getChild('tipsTxt').asTextField.text = txt;
            toast.y = Laya.stage.height / 2;
            let fadeOut = toast.getTransition("fadeOut");
            var callback = Laya.Handler.create(this, function () {
                toast.dispose();
            });
            fadeOut.play(callback);
            fgui.GRoot.inst.addChild(toast);
        }
        static autoSize(fText, txt) {
            fText.text = '' + txt;
            let text = fText.displayObject;
            text.wordWrap = false;
            if (fText.width < text.textWidth) {
                text.fontSize = Math.floor((fText.width / text.textWidth) * fText.fontSize);
            }
        }
        static analysis(action, data) {
        }
        static initActivityTime() {
            this._activityTime = new Date().getTime();
        }
        static sendActivityTime() {
            this.analysis('activeTime', { playTime: this.getTimeSpan(this._activityTime, new Date().getTime(), 'sec') });
        }
        static reqRanking(func, priority) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    activeId: TB$1._activeId,
                };
                let info = { "id": Global.MSG_RANKING, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    if (buf.code == 0) {
                        console.log("排行榜名次获取成功", buf.data.changeRank);
                        if (func) {
                            func(buf.data.changeRank);
                        }
                    }
                    else {
                        console.log("排行榜名次获取失败");
                    }
                });
            }
        }
        static reqCurRank(successFunc, FailFunc) {
            let reqData = {
                activeId: TB$1._activeId,
            };
            let info = { "id": Global.MSG_CUR_RANK, "data": reqData };
            TB$1.sendMsg(info, (buf) => {
                MyUtils.closeLoading();
                if (buf.code == 0) {
                    if (successFunc) {
                        successFunc(buf);
                    }
                }
                else {
                    if (FailFunc) {
                        FailFunc();
                    }
                }
            });
        }
        static reqLastRank(successFunc, FailFunc) {
            let reqData = {
                activeId: TB$1._activeId,
            };
            let info = { "id": Global.MSG_LAST_RANK, "data": reqData };
            TB$1.sendMsg(info, (buf) => {
                MyUtils.closeLoading();
                if (buf.code == 0) {
                    if (successFunc) {
                        successFunc(buf);
                    }
                }
                else {
                    if (FailFunc) {
                        FailFunc();
                    }
                }
            });
        }
        static reqResultRank(oldPoint, newPoint, successFunc, FailFunc) {
            let reqData = {
                activeId: TB$1._activeId,
                oldPoint: oldPoint,
                newPoint: newPoint,
            };
            let info = { "id": Global.MSG_RESULT_RANK, "data": reqData };
            TB$1.sendMsg(info, (buf) => {
                MyUtils.closeLoading();
                if (buf.code == 0) {
                    if (successFunc) {
                        successFunc(buf);
                    }
                }
                else {
                    if (FailFunc) {
                        FailFunc();
                    }
                }
            });
        }
        static reqShare(cb) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    activeId: TB$1._activeId,
                };
                let info = { "id": Global.MSG_SHARE_INFO, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    cb && cb(buf);
                    console.log("获取邀请信息成功");
                });
            }
        }
        static btnClickEvent(btnNode, caller, Func) {
            btnNode.on(Laya.Event.MOUSE_DOWN, caller, () => {
                Laya.Tween.to(btnNode, { scaleX: 0.8, scaleY: 0.8 }, 80, Laya.Ease.backInOut, null);
            });
            btnNode.on(Laya.Event.MOUSE_UP, caller, () => {
                Laya.Tween.to(btnNode, { scaleX: 1, scaleY: 1 }, 40, Laya.Ease.backInOut, null);
                if (Func) {
                    Func();
                }
            });
            btnNode.on(Laya.Event.MOUSE_OUT, caller, () => {
                Laya.Tween.to(btnNode, { scaleX: 1, scaleY: 1 }, 40, Laya.Ease.backInOut, null);
            });
        }
        static reqStateChange(cb) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    activeId: TB$1._activeId,
                };
                console.log('reqStateChange');
                let info = { "id": Global.MSG_STATE_CHANGE, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    cb && cb(buf.data);
                    console.log("获取红点变化成功", buf.data);
                });
            }
            else {
                cb && cb({ bag_num: 1, task_num: 2 });
            }
        }
        static checkCollectState() {
            if (Laya.Browser.onTBMiniGame) {
                let listData = Global.ResourceManager.getGoodsConf();
                let localData = PlayDataUtil.data.collectIdArr;
                for (let i = 0; i < listData.length; i++) {
                    let goodsId = listData[i].num_iid;
                    TB$1.checkGoodsCollectedStatus(goodsId, (res) => {
                        let idx = localData.indexOf(goodsId);
                        if (res) {
                            if (idx == -1) {
                                localData.push(goodsId);
                            }
                        }
                        else {
                            if (idx > -1) {
                                localData.splice(idx, 1);
                            }
                        }
                    });
                }
            }
        }
        static sendGetTask(taskId) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    task_id: taskId,
                    activeId: TB$1._activeId,
                };
                let info = { "id": Global.MSG_GET_TASK, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    if (buf.code == 0) {
                        console.log("领取成功");
                    }
                    else {
                        console.log("该奖励已发放,不能重复领取");
                    }
                });
            }
        }
        static getUI(ui) {
            return ui.replace(".txt", "");
        }
        static getStyle() {
            let idx = Global.ResourceManager.getAtmosphere().style - 1;
            if (Global.ResourceManager.getAtmosphere().style >= 3) {
                idx = 0;
            }
            return idx;
        }
        static checkGetTradesSold() {
            console.log('========= checkGetTradesSold ==========');
            if (PlayDataUtil.data.buyTime == 0) {
                return;
            }
            let func = (price) => {
                Global.EventManager.event(Global.hallConfig.EventEnum.TASK_CHANGE);
                this.uploadOrder(price);
            };
            if (Laya.Browser.onTBMiniGame) {
                console.log('======= 查询付款是否成功 ======');
                let reqData = {
                    activeId: TB$1._activeId,
                };
                let info = { "id": Global.MSG_CHECK_TRADES_SOLD, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    console.log("请求是否付款成功", JSON.stringify(buf));
                    if (buf.code == 0) {
                        console.log("付款成功");
                        PlayDataUtil.setData('buyTime', 0);
                        func(buf.data.price);
                        let nickName = RankUtil.getMyPlayer().name;
                        let awardCoin = (buf.data.price * Global.ResourceManager.getExchangeIdx()[0]) | 0;
                        let awardScore = (buf.data.price * Global.ResourceManager.getExchangeIdx()[1]) | 0;
                    }
                    else {
                        console.log("付款失败");
                    }
                });
            }
        }
        static uploadOrder(price) {
            let reqData = {
                price: parseFloat(price),
                activeId: TB$1._activeId,
            };
            let info = { "id": Global.MSG_BUY_DATA, "data": reqData };
            TB$1.sendMsg(info, (buf) => {
                if (buf.code == 0) {
                    console.log("上报购买数据成功");
                }
                else {
                    console.log("上报购买数据失败");
                }
            });
        }
        static checkNotice() {
        }
        static setCurScene(type) {
            this._curScene = type;
        }
        static getCurScene() {
            return this._curScene;
        }
        static sendGetTradesSold(isBuy, finishFunc = null) {
            Laya.stage.offAll('checkOrder');
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    openDetilTime: PlayDataUtil.data.buyTime,
                    activeId: TB$1._activeId,
                };
                console.log('======= 查询付款是否成功 reqData======', reqData);
                let info = { "id": Global.MSG_GET_TRADES_SOLD, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    console.log("请求是否付款成功", JSON.stringify(buf));
                    if (buf.code == 0) {
                        PlayDataUtil.setData('buyTime', 0);
                        console.log("付款成功");
                        if (finishFunc) {
                            finishFunc(buf.data.price);
                        }
                        let nickName = RankUtil.getMyPlayer().name;
                        let awardCoin = (buf.data.price * Global.ResourceManager.getExchangeIdx()[0]) | 0;
                        let awardScore = (buf.data.price * Global.ResourceManager.getExchangeIdx()[1]) | 0;
                    }
                    else {
                        console.log("付款失败");
                        if (isBuy) {
                            TB$1.showToast('订单核准中，核对后将发放对应奖励');
                            Laya.timer.once(10000, this, MainUtil.checkGetTradesSold);
                        }
                    }
                });
            }
            else {
                if (finishFunc) {
                    finishFunc(1);
                }
            }
        }
        static sendGetTaskList(cb) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    activeId: TB$1._activeId,
                };
                let info = { "id": Global.MSG_GET_TASKLIST, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    if (buf.code == 0) {
                        cb && cb();
                        console.log("获取列表成功");
                    }
                    else {
                        console.log("获取列表失败");
                    }
                });
            }
        }
        static sendGetTaskReward(taskId, cb, taskPlace = 1) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    task_id: taskId,
                    activeId: TB$1._activeId,
                };
                let info = { "id": Global.MSG_GET_TASK_REWARD, "data": reqData };
                MainUtil.analysis('task', { type: GameLogic.isInGame ? 2 : 1, sub: taskId });
                TB$1.sendMsg(info, (buf) => {
                    if (buf.code == 0) {
                        let _rewardData = buf.data.reward;
                        buf.data.reward = {
                            type: 'Coin',
                            count: _rewardData.rewardCount_1,
                            id: 1,
                        };
                        buf.data.reward2 = {
                            type: 'Point',
                            count: _rewardData.rewardCount_2,
                            id: 1,
                        },
                            cb && cb(buf.data);
                        console.log("领取成功:2004", buf.data);
                    }
                    else {
                        console.log("领取奖励失败:2004 code", buf.code);
                        if (buf.code == -10) {
                            new Alert('活动未开始！');
                        }
                        else if (buf.code == -11) {
                            new Alert('活动已结束！');
                        }
                    }
                });
            }
            else {
                cb && cb({
                    finish: 1,
                    state: 2,
                    get: 1,
                    reward: {
                        type: 'Coin',
                        count: 1,
                        id: 1,
                    },
                    reward2: {
                        type: 'Point',
                        count: 2,
                        id: 1,
                    }
                });
            }
        }
        static sendTaskProgress(id, cb) {
            if (Laya.Browser.onTBMiniGame) {
                let reqData = {
                    task_id: id,
                    activeId: TB$1._activeId,
                };
                let info = { "id": Global.MSG_GET_TASK_PROGRESS, "data": reqData };
                TB$1.sendMsg(info, (buf) => {
                    if (buf.code == 0) {
                        console.log("上报任务进度成功:2003");
                        if (cb) {
                            cb(buf.data);
                        }
                    }
                    else {
                        console.log("上报任务进度失败:2003 code", buf.code);
                        if (buf.code == -10) {
                            new Alert('活动未开始！');
                        }
                        else if (buf.code == -11) {
                            new Alert('活动已结束！');
                        }
                    }
                });
            }
            else {
                if (cb) {
                    cb({
                        finish: 1,
                        state: 1,
                        get: 1,
                    });
                }
            }
        }
    }
    MainUtil._curScene = 0;
    MainUtil.TradesSoldInfo = null;
    MainUtil.TradesSoldType = 0;

    class ResourceManager {
        constructor() {
            this._idx = 0;
            this.PreloadRes = [
                { url: Global.hallConfig.Jsons.aiNameConfig, type: Laya.Loader.JSON },
                { url: Global.hallConfig.Jsons.baseConfig, type: Laya.Loader.JSON },
                { url: Global.hallConfig.Jsons.awardConfig, type: Laya.Loader.JSON },
                { url: Global.hallConfig.Jsons.rankConfig, type: Laya.Loader.JSON },
                { url: Global.hallConfig.Jsons.taskConfig, type: Laya.Loader.JSON },
                { url: Global.hallConfig.Jsons.gameConfig, type: Laya.Loader.JSON },
                { url: Global.hallConfig.FGui.main, type: Laya.Loader.BUFFER, isCDN: true },
                { url: Global.hallConfig.FGui.common, type: Laya.Loader.BUFFER, isCDN: true },
                { url: Global.hallConfig.FGui.getReward, type: Laya.Loader.BUFFER, isCDN: true },
                { url: Global.hallConfig.FGui.Loading, type: Laya.Loader.BUFFER, isCDN: true },
                { url: Global.hallConfig.FGui.mainPng, type: Laya.Loader.IMAGE, isCDN: true },
                { url: Global.hallConfig.FGui.commonPng, type: Laya.Loader.IMAGE, isCDN: true },
                { url: Global.hallConfig.FGui.getRewardPng, type: Laya.Loader.IMAGE, isCDN: true },
                { url: Global.hallConfig.FGui.LoadingPng, type: Laya.Loader.IMAGE, isCDN: true },
            ];
            this._taskConf = null;
            this._browseTaskConf = null;
            this._buyTaskConf = null;
            this._goodsConf = null;
            this._prizePoolConf = null;
            this._rankPrizeConf = null;
            this._activeTimeConf = null;
            this._shareConfig = null;
            this._invateNewUserCoin = 0;
            this._invateUserCoin = 0;
            this._exchangeIdx = [0, 0];
            this._lookGoodsCoin = 0;
            this._subCoin = 1;
            this._atmosphereConfig = null;
            this._rankSTime = -1;
            this._rankETime = -1;
            this.setDefaultConf();
        }
        PreloadResources() {
            let _resarr = this.PreloadRes.map(v => {
                if (Laya.Browser.onTBMiniGame && v['isCDN']) {
                    v.url = Global.hallConfig._cdn + v.url;
                }
                return v;
            });
            let _toload = () => {
                Laya.loader.load(_resarr, Laya.Handler.create(this, (isSuccess) => {
                    if (isSuccess) {
                        for (const iterator of _resarr) {
                            if (iterator.isCDN && iterator.type == Laya.Loader.BUFFER) {
                                fgui.UIPackage.addPackage(MainUtil.getUI(iterator.url));
                            }
                        }
                        this.onPreLoadResComplete();
                    }
                    else {
                        _toload();
                    }
                }), Laya.Handler.create(this, (progress) => {
                    this._idx = (progress * 100) | 0;
                    if (this._idx < 100) {
                        console.log('load _idx', this._idx);
                        Global.EventManager.event(Global.hallConfig.EventEnum.Res_Load_Complete);
                    }
                }, null, false));
            };
            _toload();
        }
        onPreLoadResComplete() {
            this._idx = 100;
            console.log('load _idx', this._idx);
            Global.EventManager.event(Global.hallConfig.EventEnum.Res_Load_Complete);
        }
        GetRes(url) {
            var res = Laya.loader.getRes(url);
            if (res == null) {
                console.error("资源未加载/已释放:", url);
            }
            return res;
        }
        initConf(data) {
            this._allConf = data;
        }
        getConf(name) {
            if (!this._allConf)
                return null;
            if (!this._allConf[name]) {
                console.error("配置获取失败");
                return null;
            }
            else
                return this._allConf[name];
        }
        setDefaultConf() {
            let prizeList = [{ "isRewardControl": { "buyPrice": 88, "intiveNums": 15, "type": false }, "rate": "0.0500000000", "price": "708.00", "approve_status": "onsale", "num": 971, "name": "goods", "num_iid": 634413319548, "type": "1", "pic_url": "https://img.alicdn.com/bao/uploaded/i2/2210005895332/O1CN01bYG0fa1pG6TWuQ5rL_!!2210005895332.png", "title": "Dimoo太空系列整盒12款", "openNums": 30, "seller_cids": "-1" }, { "isRewardControl": { "buyPrice": 5, "intiveNums": 8, "type": false }, "rate": "0.5000000000", "price": 1, "approve_status": "", "num": 952, "name": "coupon", "num_iid": "ce72c637187e4716b860419b9ccded4e", "type": "2", "pic_url": "https://oss.ixald.com/bigFight/admin/images/yhj.png", "title": "满25减1", "openNums": 48, "seller_cids": "" }, { "isRewardControl": { "buyPrice": 0, "intiveNums": 0, "type": false }, "rate": "0.5000000000", "price": 10, "approve_status": "", "num": 272, "name": "coupon", "num_iid": "52560b0a6e8e4b7c8166d57b08f74c72", "type": "3", "pic_url": "https://oss.ixald.com/bigFight/admin/images/yhj.png", "title": "董帅优惠券", "openNums": 64, "seller_cids": "" }];
            this._prizePoolConf = prizeList;
        }
        saveGoodsConf(data) {
            this._goodsConf = data;
        }
        getGoodsConf() {
            return this._goodsConf;
        }
        savePrizePoolConf(data) {
            this._prizePoolConf = data;
        }
        getPrizePoolConf() {
            return this._prizePoolConf;
        }
        saveRankPrizeConf(data) {
            this._rankPrizeConf = data;
        }
        getRankPrizeConf() {
            return this._rankPrizeConf;
        }
        getPrizeById(id) {
            if (id >= this._prizePoolConf.length) {
                return null;
            }
            return this._prizePoolConf[id];
        }
        saveTaskConf(data) {
            this._taskConf = data;
        }
        getTaskConf() {
            return this._taskConf;
        }
        refreshTaskConf() {
            let confs = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.taskConfig);
            return confs;
        }
        saveShareConfig(data) {
            this._shareConfig = data;
        }
        getShareConfig() {
            return this._shareConfig;
        }
        saveSubCoin(coin) {
            this._subCoin = coin;
        }
        getSubCoin() {
            return this._subCoin;
        }
        saveExchangeIdx(coinrate, scorerate) {
            this._exchangeIdx = [coinrate, scorerate];
        }
        getExchangeIdx() {
            return this._exchangeIdx;
        }
        saveAtmosphere(data) {
            if (data) {
                this._atmosphereConfig = data;
            }
        }
        getAtmosphere() {
            this._atmosphereConfig = {
                style: 3,
                scene: 2,
            };
            return this._atmosphereConfig;
            if (!this._atmosphereConfig) {
                this._atmosphereConfig = {
                    style: 3,
                    scene: 2,
                };
            }
            return this._atmosphereConfig;
        }
        updateUI() {
            Global.hallConfig._cdn = Global.hallConfig._cdn.replace("index", "" + this.getAtmosphere().style + "/index");
        }
        saveRuleConf(data) {
            this._ruleConf = data;
        }
        getRuleConf() {
            return this._ruleConf;
        }
        saveRankTime(sTime, eTime) {
            this._rankSTime = sTime;
            this._rankETime = eTime;
        }
        getRankSTime() {
            return this._rankSTime;
        }
        getRankETime() {
            return this._rankETime;
        }
    }

    class hallConfig {
        constructor() {
            this.EventEnum = {
                Res_Load_Progress: "Res_Load_Progress",
                Res_Load_Complete: "Res_Load_Complete",
                TASK_CHANGE: "TASK_CHANGE",
                VIP_STATE_CHANGE: "TASK_CHANGE",
            };
            this.GAME_MOVE = {
                BOMB: 0,
                RED_ENVELOPES: 1,
                RED_BOMB: 2,
            };
            this.TASK_CONFIG_ENUM = {
                cuhuo: 0,
                laxin: 1,
                zhuanhua: 2,
            };
            this.SHARE_TYPE_ENUM = {
                shareFriend: 0,
                rank: 1,
                notice: 2,
            };
            this.CUR_SCENE = {
                loading: 0,
                hall: 1,
                game: 2,
            };
            this.UIEnum = {
                SetUI: {
                    id: 0,
                    class: "common/setLayer.ts",
                },
                SignUI: {
                    id: 1,
                    class: "common/signLayer.ts",
                },
                GameScene3d: {
                    id: 2,
                    class: "game/gameScene3d.ts",
                },
            };
            this._version = "0.0.95";
            this._commonCdn = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/normal/C_client/" + 'v16/';
            this._cdn = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/normal/C_client/" + 'v16/';
            this._openGiftCount = 2;
            this.Jsons = {
                aiNameConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/aiNameConfig.json" : this._commonCdn + "res/jsons/aiNameConfig.json",
                baseConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/baseConfig.json" : this._commonCdn + "res/jsons/baseConfig.json",
                awardConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/awardConfig.json" : this._commonCdn + "res/jsons/awardConfig.json",
                rankConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/rankConfig.json" : this._commonCdn + "res/jsons/rankConfig.json",
                taskConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/taskConfig.json" : this._commonCdn + "res/jsons/taskConfig.json",
                gameConfig: Laya.Browser.onTBMiniGame ? this._commonCdn + "res/jsons/gameConfig.json" : this._commonCdn + "res/jsons/gameConfig.json",
            };
            this.Prefabs = {};
            this.FGui = {
                main: "res/UI/Main.txt",
                rank: "res/UI/Rank.txt",
                shop: "res/UI/Shop.txt",
                task: "res/UI/Task.txt",
                common: "res/UI/Common.txt",
                getReward: "res/UI/GetReward.txt",
                invite: "res/UI/Invite.txt",
                userInfo: "res/UI/UserInfo.txt",
                Loading: "res/UI/Loading.txt",
                TaskBrowse: "res/UI/TaskBrowse.txt",
                Rule: "res/UI/Rule.txt",
                Bag: "res/UI/Bag.txt",
                TryRole: "res/UI/TryRole.txt",
                Notice: "res/UI/Notice.txt",
                OpenGift: "res/UI/openGift.txt",
                Vip: "res/UI/Vip.txt",
                PrizePool: "res/UI/PrizePool.txt",
                mainPng: "res/UI/Main_atlas0.png",
                rankPng: "res/UI/Rank_atlas0.png",
                shopPng: "res/UI/Shop_atlas0.png",
                taskPng: "res/UI/Task_atlas0.png",
                commonPng: "res/UI/Common_atlas0.png",
                getRewardPng: "res/UI/GetReward_atlas0.png",
                invitePng: "res/UI/Invite_atlas0.png",
                userInfoPng: "res/UI/UserInfo_atlas0.png",
                LoadingPng: "res/UI/Loading_atlas0.png",
                TaskBrowsePng: "res/UI/TaskBrowse_atlas0.png",
                RulePng: "res/UI/Rule_atlas0.png",
                BagPng: "res/UI/Bag_atlas0.png",
                TryRolePng: "res/UI/TryRole_atlas0.png",
                NoticePng: "res/UI/Notice_atlas0.png",
                OpenGiftPng: "res/UI/openGift_atlas0.png",
                VipPng: "res/UI/Vip_atlas0.png",
                PrizePoolPng: "res/UI/PrizePool_atlas0.png",
            };
            this.Sound = {
                gameBg1: "sound/bg1.mp3",
                gameBg2: "sound/bg2.mp3",
                bad: "sound/bad.mp3",
                bomb: "sound/bomb.mp3",
                happy: "sound/happy.mp3",
                jump: "sound/jump.mp3",
                lose: "sound/lose.mp3",
                over: "sound/over.mp3",
                restTime: "sound/restTime.mp3",
                win: "sound/win.mp3",
                click: "sound/click.mp3",
                bg1: "sound/hallBg1.mp3",
                bg2: "sound/hallBg2.mp3",
            };
        }
    }

    class UIManager {
        constructor() {
            this._zOrder = 1000;
            this._tipsZOrder = 100000;
            this._uiArray = [];
            this._bannerFlag = true;
        }
        toUI(uiconfig, data = null) {
            if (uiconfig == undefined || uiconfig == null)
                return;
            for (let i = this._uiArray.length - 1; i >= 0; i--) {
                let ui = this._uiArray[i];
                this.onUIClose(ui, null);
            }
            this._uiArray.length = 0;
            this.openUI(uiconfig, data, true);
        }
        closeUI(uiconfig, handle = null) {
            if (uiconfig == undefined || uiconfig == null)
                return;
            let ui;
            for (let i = this._uiArray.length - 1; i >= 0; i--) {
                ui = this._uiArray[i];
                if (ui.uiconfig == uiconfig) {
                    this.onUIClose(ui, handle);
                    this._uiArray.splice(i, 1);
                    break;
                }
            }
            this.checkBanner(ui, false);
        }
        openUI(uiconfig, data = null, visible = true) {
            if (uiconfig == undefined || uiconfig == null)
                return;
            if (uiconfig.res && uiconfig.res.length > 0) {
                Laya.loader.load(uiconfig.res, Laya.Handler.create(this, function () {
                    this.createUI(uiconfig, data, visible);
                }));
            }
            else {
                this.createUI(uiconfig, data, visible);
            }
        }
        openUniqueUI(uiconfig, data = null, visible = true) {
            if (uiconfig == undefined || uiconfig == null)
                return;
            let ui = this.findUI(uiconfig);
            if (ui) {
                if (data != null) {
                    ui.updateData(data);
                }
                ui.visible = visible;
                return;
            }
            this.openUI(uiconfig, data, visible);
        }
        createUI(uiconfig, data = null, visible = true) {
            if (uiconfig == undefined || uiconfig == null)
                return;
            let cls = Laya.ClassUtils.getRegClass(uiconfig.class);
            if (cls == null) {
                console.error("openUI error", uiconfig);
                return;
            }
            let ui = new cls(uiconfig);
            ui.uiconfig = uiconfig;
            if (data != null) {
                ui.updateData(data);
            }
            ui.zOrder = this._zOrder++;
            ui.visible = visible;
            Laya.stage.addChild(ui);
            this._uiArray.push(ui);
            if (ui.visible) {
                this.checkBanner(ui, true);
                if (uiconfig.tween) {
                    console.log("11111111111");
                    Laya.Tween.from(ui, { scaleX: 0.8, scaleY: 0.8 }, 200, Laya.Ease.backOut);
                    ui.uitween = uiconfig.tween;
                }
            }
        }
        onUIClose(ui, handler) {
            if (ui.uitween) {
                Laya.Tween.to(ui, { scaleX: 0.8, scaleY: 0.8 }, 200, Laya.Ease.backIn, Laya.Handler.create(this, function () {
                    this.destroyUI(ui);
                    if (handler)
                        handler.method();
                }));
            }
            else {
                this.destroyUI(ui);
                if (handler)
                    handler.method();
            }
        }
        destroyUI(ui) {
            this.checkBanner(ui, false);
            if (ui._aniList) {
                let ani;
                for (let i = 0; i < ui._aniList.length; i++) {
                    ani = ui._aniList[i];
                    if (ani && ani.clear) {
                        ani.clear();
                    }
                }
            }
            Laya.timer.clearAll(ui);
            Laya.stage.removeChild(ui);
            ui.close();
            ui.destroy();
        }
        findUI(uiconfig) {
            if (uiconfig == undefined || uiconfig == null)
                return;
            for (let i = this._uiArray.length - 1; i >= 0; i--) {
                let ui = this._uiArray[i];
                if (ui.uiconfig == uiconfig) {
                    return ui;
                }
            }
            return null;
        }
        setUIVisible(uiconfig, visible) {
            if (uiconfig == undefined || uiconfig == null)
                return;
            let ui = this.findUI(uiconfig);
            if (ui) {
                ui.visible = visible;
                if (visible) {
                    ui.zOrder = this._zOrder++;
                }
                this.checkBanner(ui, visible);
            }
        }
        setTop(uiconfig) {
            if (uiconfig == undefined || uiconfig == null)
                return;
            let ui = this.findUI(uiconfig);
            if (ui) {
                ui.zOrder = this._zOrder++;
            }
        }
        showTips(msg) {
            let tips = this._arrTips;
            let txt;
            if (tips == null) {
                tips = [];
                let box = new Laya.Box();
                Laya.stage.addChild(box);
                box.zOrder = this._tipsZOrder;
                for (let i = 0; i < 3; i++) {
                    let subBox = new Laya.Box();
                    subBox.anchorX = subBox.anchorY = 0.5;
                    subBox.centerX = 0;
                    let img = new Laya.Image("game/messageBG.png");
                    subBox.addChild(img);
                    img.width = 800;
                    img.height = 80;
                    txt = new Laya.Text();
                    subBox.addChild(txt);
                    txt.fontSize = 36;
                    txt.color = "#FFFFFF";
                    txt.width = 800;
                    txt.height = 50;
                    txt.y = 15;
                    txt.align = "center";
                    txt.valign = "middle";
                    txt.centerX = 0;
                    tips.push(txt);
                    box.addChild(subBox);
                    subBox.visible = false;
                }
                this._arrTips = tips;
                box.width = 600;
                box.centerX = 0;
                box.centerY = -100;
            }
            if (tips.length == 0)
                return;
            txt = tips.shift();
            txt.text = msg;
            let flipMS = 2000;
            txt.color = "#FFFFFF";
            let box = txt.parent;
            box.visible = true;
            box.scale(0.8, 0.8);
            box.alpha = 1;
            Laya.Tween.to(box, { scaleX: 1, scaleY: 1 }, 200, Laya.Ease.backOut, Laya.Handler.create(this, function (obj) {
                Laya.timer.once(flipMS - 600, this, function () {
                    Laya.Tween.to(box, { alpha: 0 }, 400, null, Laya.Handler.create(this, function () {
                        obj.parent.visible = false;
                        tips.push(obj);
                    }));
                });
            }, [txt]));
        }
        checkBanner(ui, isOpen) {
        }
        createBannercallbackHandle(code) {
        }
    }

    class Global {
        static SetupEngine() {
            Global.hallConfig = new hallConfig();
            Global.EventManager = new EventManager();
            Global.ResourceManager = new ResourceManager();
            Global.UIManager = new UIManager();
        }
    }
    Global.startSceneName = "startScene.scene";
    Global.gameSceneName = "gameScene.scene";
    Global.loadSceneName = "loadingScene.scene";
    Global.MSG_GET_TRADES_SOLD = "GetTradesSold";
    Global.MSG_LOGIN = 1001;
    Global.MSG_MEMBER_STATE = 1009;
    Global.MSG_UPLOAD_VIPSTATE = 1011;
    Global.MSG_UPLOAD_POINT = 1012;
    Global.MSG_GET_TASK = 1018;
    Global.MSG_UP_FIGHT_RESULT = 1021;
    Global.MSG_CUR_RANK = 1014;
    Global.MSG_RANKING = 1015;
    Global.MSG_TASK = 1016;
    Global.MSG_COIN_ADD = 1022;
    Global.MSG_COIN_COST = 1023;
    Global.MSG_SHARE_INFO = 1024;
    Global.MSG_GET_BAG = 1031;
    Global.MSG_RECEIVING_INFO = 1032;
    Global.MSG_TASK_PROGRESS = 2001;
    Global.MSG_GET_TASKLIST = 2002;
    Global.MSG_GET_TASK_PROGRESS = 2003;
    Global.MSG_GET_TASK_REWARD = 2004;
    Global.MSG_REQ_OPEN_REGBAG = 3002;
    Global.MSG_AWARD_COUNT_CONFIG = 3003;
    Global.MSG_RESULT_RANK = 3004;
    Global.MSG_LAST_RANK = 3005;
    Global.MSG_RANK_GETREWARD = 3006;
    Global.MSG_MY_ROLE = 3007;
    Global.MSG_BUY_DATA = 4001;
    Global.MSG_ANALYSIS = 5001;
    Global.MSG_STATE_CHANGE = 5002;
    Global.MSG_CHECK_TRADES_SOLD = 6001;
    Global.MSG_NOTICE = 6002;
    Global.MSG_GET_SCORESHOP_LIST = 7001;
    Global.MSG_SCORE_EXHANGE = 7002;
    Global.MSG_GAME_MERGEAWARD = 7003;

    class PlatformBase {
        constructor() {
            this.isBannerLoaded = false;
            this.isInterstitialAdLoaded = false;
            this.isVideoAdLoaded = false;
            this.isInitComplete = false;
            this.isBannerShow = false;
            this.isGameloadCompleted = false;
            this.isInitComplete = false;
            this.isGameloadCompleted = false;
        }
        delayInit() {
            return __awaiter(this, void 0, void 0, function* () {
                this.isInitComplete = true;
            });
        }
        SetGameloadCompleted() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('游戏数据加载完成');
                this.isGameloadCompleted = true;
                yield this.delayInit();
            });
        }
        setLoadingProgress(_pro) {
            console.log('[PlatformBase]', 'loading', _pro);
        }
        LocalStorageRemoveItem(_str) {
            console.log('[PlatformBase]', 'StorageRemoveItem');
            Laya.LocalStorage.removeItem(_str);
        }
        LocalStorageGetItem(_str) {
            console.log('[PlatformBase]', 'StorageGetItem', _str);
            let userData = Laya.LocalStorage.getItem(_str);
            if (userData) {
                userData = JSON.parse(userData);
            }
            return userData;
        }
        LocalStorageSetItem(_str, _data) {
            console.log('[PlatformBase]', 'StorageSetItem', _str);
            Laya.LocalStorage.setItem(_str, JSON.stringify(_data));
        }
        SubmitAction(action, data = {}) {
            console.log('[PlatformBase]', 'SubmitAction', action);
        }
        IsExistStage() {
            console.log('[PlatformBase]', 'IsExistStage');
            return false;
        }
        Stage_onStart(_info) {
            console.log('[PlatformBase]', 'Stage_onStart');
        }
        Stage_onEnd(_info) {
            console.log('[PlatformBase]', 'Stage_onEnd');
        }
        IsExistGetSystemInfoSync() {
            console.log('[PlatformBase]', 'IsExistGetSystemInfoSync');
            return false;
        }
        GetSystemInfoSync() {
            console.log('[PlatformBase]', 'GetSystemInfoSync');
            return undefined;
        }
        GetMenuButtonRect(_dynamic = false) {
            return undefined;
        }
        IsExistGameClub() {
            return false;
        }
        CreateGameClubButton(_option) {
            return null;
        }
        ExitGame() {
            console.log('[PlatformBase]', 'ExitGame');
        }
        OnShow(callback, _enable = false) {
            console.log('[PlatformBase]', 'OnShow');
        }
        OnHide(callback, _enable = false) {
            console.log('[PlatformBase]', 'OnHide');
        }
        CleanOldAssets() {
            console.log('[PlatformBase]', 'CleanOldAssets');
        }
        ShowLoading(_data) {
            console.log('[PlatformBase]', 'ShowLoading', _data);
        }
        HideLoading() {
            console.log('[PlatformBase]', 'HideLoading');
        }
        ShowToast(_data) {
            console.log('[PlatformBase]', 'ShowToast', _data);
            return alert(_data.title);
        }
        ShowModal(_data) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('[PlatformBase]', 'ShowConfirm', _data);
                return confirm(`${_data.title}\n${_data.content}`);
            });
        }
        APPLogin(_isForce = true) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('[PlatformBase]', 'APPLogin', _isForce);
                return true;
            });
        }
        OnListenNetChange(_listener) {
            console.log('[PlatformBase]', 'OnListenNetChange');
        }
        IsNetConnected() {
            console.log('[PlatformBase]', 'IsNetConnected');
            return true;
        }
        CheckForUpdate() {
            console.log('[PlatformBase]', 'OnCheckForUpdate');
        }
        IsExistGetLaunchOptions() {
            console.log('[PlatformBase]', 'IsExistGetLaunchOptions');
            return false;
        }
        GetLaunchOptions() {
            console.log('[PlatformBase]', 'GetLaunchOptions');
            return undefined;
        }
        VibrateShort() {
            console.log('[PlatformBase]', 'VibrateShort');
        }
        VibrateLong() {
            console.log('[PlatformBase]', 'VibrateLong');
        }
        IsExistNavigateToMiniProgram() {
            return false;
        }
        NavigateToMiniProgram(_info) {
            console.log('[PlatformBase]', 'VibrateLong');
        }
        UserAuthorize(_scope) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('[PlatformBase]', 'UserAuthorize');
                return true;
            });
        }
        OpenSetting() {
            console.log('[PlatformBase]', 'OpenSetting');
        }
        GetSetting(_scope) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('[PlatformBase]', 'GetSetting');
                return false;
            });
        }
        IsExistPreviewImage() {
            return false;
        }
        PreviewImage(urls) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('[PlatformBase]', 'PreviewImage');
                return false;
            });
        }
        IsExistCreateImage() {
            return false;
        }
        CreateImage() {
            console.log('[PlatformBase]', 'CreateImage');
        }
        IsExistShare() {
            return false;
        }
        UpdateShareMenu(_data) {
            console.log('[PlatformBase]', 'UpdateShareMenu');
        }
        ShowShareMenu() {
            console.log('[PlatformBase]', 'ShowShareMenu');
        }
        HideShareMenu() {
            console.log('[PlatformBase]', 'HideShareMenu');
        }
        OnShareAppMessage(callFun) {
            console.log('[PlatformBase]', 'onShareAppMessage');
        }
        ShareAppMessage(title, imageUrl, query) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('[PlatformBase]', 'ShareAppMessage');
                return true;
            });
        }
        IsExistOpenContext() {
            console.log('[PlatformBase]', 'IsExistOpenContext');
            return false;
        }
        SetUserCloudStorage(_data, success, fail) {
            console.error('[PlatformBase]', 'SetUserCloudStorage', '不存在开放域功能');
        }
        GetOpenDataContext() {
            console.error('[PlatformBase]', 'GetOpenDataContext', '不存在开放域功能');
            return null;
        }
        GetAdsID(_ads) {
            return null;
        }
        CreateADs(_adsID) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('[PlatformBase]', 'CreateADs');
            });
        }
        CreateBanner(_bannerid) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('[PlatformBase]', 'CreateBanner');
            });
        }
        ShowBanner() {
            this.isBannerShow = true;
            console.log('[PlatformBase]', 'ShowBanner');
        }
        HideBanner() {
            this.isBannerShow = false;
            console.log('[PlatformBase]', 'HideBanner');
        }
        CreateInterstitialAd(_interstitialid) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('[PlatformBase]', 'CreateScreen');
            });
        }
        ShowInterstitialAd() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = {
                    isOpened: false,
                    isEnd: false
                };
                console.log('[PlatformBase]', 'ShowScreen');
                return result;
            });
        }
        HideInterstitialAd() {
            console.log('[PlatformBase]', 'HideScreen');
        }
        CreateVideoAd(_videoid) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('[PlatformBase]', 'CreateVideoAd');
            });
        }
        ShowVideoAd() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = {
                    isOpened: true,
                    isEnd: true
                };
                console.log('[PlatformBase]', 'ShowVideoAd');
                return result;
            });
        }
        getInterstitialAdState() {
            return this.isInterstitialAdLoaded;
        }
        getVideoAdState() {
            return this.isVideoAdLoaded;
        }
        IsExistRecoder() {
            return false;
        }
        RecoderStart() {
        }
        RecoderEnd(_shareIt = false) {
            return __awaiter(this, void 0, void 0, function* () {
                return false;
            });
        }
        ShareRecoder() {
            return __awaiter(this, void 0, void 0, function* () {
                return false;
            });
        }
        ListenRecorder(_listen) { }
        UnListenRecorder() { }
        IsRecoderShared() {
            return true;
        }
        InRecording() {
            return false;
        }
        HaveRecoderVideo() {
            return false;
        }
    }
    PlatformBase.curPlatform = undefined;

    const ShareBathPath = 'https://oss.ixald.com/Cattle/share/';
    const ShareConfig = {
        Image: {
            normal: [
                { title: '奔跑吧~金牛飞奔贺新春！', image: 'share_normal1.png' }
            ],
        },
        Video: {
            normal: { title: '我常来这里消解压力', topics: ['拼个动物园'], query: `from=videoShare` },
        },
    };

    var MiniPlatformE;
    (function (MiniPlatformE) {
        MiniPlatformE[MiniPlatformE["unknow"] = 0] = "unknow";
        MiniPlatformE[MiniPlatformE["wx"] = 1] = "wx";
        MiniPlatformE[MiniPlatformE["qq"] = 2] = "qq";
        MiniPlatformE[MiniPlatformE["tt"] = 3] = "tt";
    })(MiniPlatformE || (MiniPlatformE = {}));
    ;
    class Platform_mini extends PlatformBase {
        constructor() {
            super();
            this.menuRect = undefined;
            this.isConnected = true;
            this.shareTime = 0;
            this.bannerAd = null;
            this.bannerLoaded = false;
            this.interstitialAd = null;
            this.isInterstitialShow = false;
            this.videoAd = null;
            this.gameRecorder = null;
            this.recording = false;
            this.videoPath = null;
            this.videoCliped = false;
            this.videoShared = false;
            this.recodeTime = { start: 0, end: 0 };
            this.init();
        }
        init() {
            if (this.isInitComplete) {
                return;
            }
        }
        delayInit() {
            const _super = Object.create(null, {
                delayInit: { get: () => super.delayInit }
            });
            return __awaiter(this, void 0, void 0, function* () {
                this.initListenNet();
                if (this.IsExistRecoder()) {
                    this.initRecoder();
                }
                _super.delayInit.call(this);
            });
        }
        SubmitAction(action, data = {}) {
            if (!mini || !mini.aldSendEvent) {
                console.error('未找到阿拉丁');
                return;
            }
            mini.aldSendEvent(action, data);
            console.log('[Platform_mini]', 'SubmitAction', action);
        }
        IsExistStage() {
            if (PlatformBase.curPlatform && mini["aldStage"])
                return true;
            return false;
        }
        Stage_onStart(_info) {
            if (!this.IsExistStage()) {
                console.error('IsExistStage', '不存在！');
                return;
            }
            mini.aldStage.onStart(_info);
        }
        Stage_onEnd(_info) {
            if (!this.IsExistStage()) {
                console.error('IsExistStage', '不存在！');
                return;
            }
            mini.aldStage.onEnd(_info);
        }
        IsExistGetSystemInfoSync() {
            if (PlatformBase.curPlatform && mini.getSystemInfoSync) {
                return true;
            }
            return false;
        }
        GetSystemInfoSync() {
            return mini.getSystemInfoSync();
        }
        GetMenuButtonRect(_dynamic = false) {
            if (!_dynamic && this.menuRect) {
                return this.menuRect;
            }
            let _menuRect = null;
            let _info = this.GetSystemInfoSync();
            let _scale = Laya.stage.width / _info.screenWidth;
            let _rect = null;
            try {
                if (MiniPlatformE.tt == PlatformBase.curPlatform) {
                    _rect = mini.getMenuButtonLayout();
                }
                else {
                    _rect = mini.getMenuButtonBoundingClientRect();
                }
            }
            catch (e) {
                console.error('GetMenuButtonRect获取失败' + e);
            }
            if (_rect) {
                console.log('GetMenuButtonRect _rect', _scale, _rect);
                _menuRect = {
                    top: (_info.screenHeight - _rect.top) * _scale,
                    bottom: (_info.screenHeight - _rect.bottom) * _scale,
                    left: (_rect.left) * _scale,
                    right: (_rect.right) * _scale,
                    width: _rect.width * _scale,
                    height: _rect.height * _scale
                };
            }
            if (!_dynamic) {
                this.menuRect = _dynamic;
            }
            return _menuRect;
        }
        IsExistGameClub() {
            if (!mini.createGameClubButton) {
                return false;
            }
            return true;
        }
        CreateGameClubButton(_option) {
            if (!this.IsExistGameClub()) {
                return null;
            }
            return mini.createGameClubButton({
                type: _option.iconType,
                text: _option.text,
                image: _option.image,
                icon: _option.icon,
                style: _option.style
            });
        }
        getTTHost() {
            if (MiniPlatformE.tt != PlatformBase.curPlatform) {
                return null;
            }
            return this.GetSystemInfoSync().appName;
        }
        ExitGame() {
            mini.exitMiniProgram && mini.exitMiniProgram();
            console.log('[Platform_mini]', 'ExitGame');
        }
        OnShow(callback, _enable = true) {
            if (_enable) {
                mini.onShow(callback);
            }
            else {
                mini.offShow(callback);
            }
            console.log('[Platform_mini]', 'OnShow', _enable);
        }
        OnHide(callback, _enable = true) {
            if (_enable) {
                mini.onHide(callback);
            }
            else {
                mini.offHide(callback);
            }
            console.log('[Platform_mini]', 'OnHide', _enable);
        }
        CleanOldAssets() {
            if (PlatformBase.curPlatform == MiniPlatformE.wx) {
                wxDownloader.cleanOldAssets();
            }
        }
        ShowLoading(_data) {
            mini.showLoading(_data);
        }
        HideLoading() {
            mini.hideLoading();
        }
        ShowToast(_data) {
            mini.showToast(_data);
        }
        ShowModal(_data) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise(rs => {
                    _data.showCancel = !!_data.cancelText;
                    _data.success = (res) => {
                        if (res.confirm) {
                            rs(true);
                        }
                        else {
                            rs(false);
                        }
                    };
                    mini.showModal(_data);
                });
            });
        }
        APPLogin(_isForce = false) {
            return __awaiter(this, void 0, void 0, function* () {
                if (PlatformBase.curPlatform != MiniPlatformE.tt) {
                    return true;
                }
                return new Promise((rs) => {
                    mini.login({
                        force: _isForce,
                        success(res) {
                            console.error('Login-success-res = ' + JSON.stringify(res));
                            rs(res.isLogin);
                        },
                        fail(res) {
                            console.error('Login-fail-res =' + JSON.stringify(res));
                            rs(false);
                        }
                    });
                });
            });
        }
        initListenNet() {
            if (!mini.getNetworkType) {
                console.error('监听网络状态失败！');
                return false;
            }
            mini.getNetworkType({
                success: (_res) => {
                    console.log('网络变更', _res);
                    let _connect = (_res != 'none');
                    if (_connect != this.isConnected) {
                        this.isConnected = _connect;
                        this.netChangelistener && this.netChangelistener(this.isConnected);
                    }
                }
            });
            mini.onNetworkStatusChange((res) => {
                console.log('网络变更监听', res.networkType);
                if (res.isConnected != this.isConnected) {
                    this.isConnected = res.isConnected;
                    this.netChangelistener && this.netChangelistener(this.isConnected);
                }
            });
            return true;
        }
        OnListenNetChange(_listener) {
            this.netChangelistener = _listener;
        }
        IsNetConnected() {
            return this.isConnected;
        }
        CheckForUpdate() {
            if (!PlatformBase.curPlatform || !mini.getUpdateManager) {
                return;
            }
            const updateManager = mini.getUpdateManager();
            updateManager.onUpdateReady(() => __awaiter(this, void 0, void 0, function* () {
                let _r = yield this.ShowModal({
                    title: '版本升级',
                    content: '新版本已经准备好，即将切换到新版~'
                });
                updateManager.applyUpdate();
            }));
        }
        IsExistGetLaunchOptions() {
            if (PlatformBase.curPlatform && mini.getLaunchOptionsSync) {
                return true;
            }
            return false;
        }
        GetLaunchOptions() {
            return mini.getLaunchOptionsSync();
        }
        VibrateShort() {
            mini.vibrateShort && mini.vibrateShort({});
        }
        VibrateLong() {
            mini.vibrateLong && mini.vibrateLong();
        }
        IsExistNavigateToMiniProgram() {
            if (PlatformBase.curPlatform == MiniPlatformE.wx) {
                return true;
            }
            return false;
        }
        NavigateToMiniProgram(_info) {
            mini.navigateToMiniProgram(_info);
        }
        UserAuthorize(_scope) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((rs) => {
                    mini.authorize({
                        scope: _scope,
                        success() {
                            rs(true);
                        },
                        fail(e) {
                            console.error('_authorize 授权失败', e);
                            rs(false);
                        }
                    });
                });
            });
        }
        OpenSetting() {
            return __awaiter(this, void 0, void 0, function* () {
                if (mini.openSetting) {
                    return new Promise((rs) => {
                        mini.openSetting({
                            success() {
                                console.log(`openSetting 打开成功`);
                                rs(true);
                            },
                            fail(res) {
                                console.log(`openSetting 失败`);
                                rs(false);
                            }
                        });
                    });
                }
                return false;
            });
        }
        GetSetting(_scope) {
            return __awaiter(this, void 0, void 0, function* () {
                if (mini.openSetting) {
                    return new Promise((rs) => {
                        mini.getSetting({
                            success(res) {
                                console.log(`getSetting 调用成功 ${JSON.stringify(res)}`);
                                if (res.authSetting && _scope in res.authSetting) {
                                    rs(res.authSetting[_scope]);
                                }
                                else {
                                    rs(false);
                                }
                            },
                            fail(res) {
                                console.log(`getSetting 调用失败`);
                                rs(false);
                            }
                        });
                    });
                }
                return false;
            });
        }
        IsExistPreviewImage() {
            if (PlatformBase.curPlatform && mini.previewImage) {
                return true;
            }
            return false;
        }
        PreviewImage(_imgPath) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((re) => {
                    mini.previewImage({
                        urls: _imgPath,
                        success: (res) => {
                            re(true);
                        },
                        fail: (error) => {
                            console.error('PreviewImage:' + error);
                            re(false);
                        },
                    });
                });
            });
        }
        IsExistCreateImage() {
            if (PlatformBase.curPlatform && mini.createImage) {
                return true;
            }
            return false;
        }
        CreateImage() {
            return mini.createImage();
        }
        IsExistShare() {
            if (typeof (mini) !== 'undefined') {
                return true;
            }
            return false;
        }
        UpdateShareMenu(_data) {
            mini.updateShareMenu(_data);
        }
        ShowShareMenu() {
            mini.showShareMenu();
        }
        HideShareMenu() {
            mini.hideShareMenu();
        }
        OnShareAppMessage(callFun) {
            let _fun = mini.aldOnShareAppMessage ? mini.aldOnShareAppMessage : mini.onShareAppMessage;
            _fun(function () {
                let _data = callFun();
                return {
                    title: _data.title,
                    imageUrl: _data.imageUrl,
                    query: _data.query
                };
            });
        }
        ShareAppMessage(title, imageUrl, query) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((res) => {
                    if (!this.shareTime) {
                        this.OnShow(this.listenShareBack.bind(this));
                    }
                    this.shareTime = Date.now();
                    this.shareBackFunc = res;
                    let _fun = mini.aldShareAppMessage ? mini.aldShareAppMessage : mini.shareAppMessage;
                    _fun({
                        title: title,
                        imageUrl: imageUrl || '',
                        query: query || {},
                    });
                });
            });
        }
        listenShareBack() {
            if (this.shareBackFunc) {
                let _dif = Date.now() - this.shareTime;
                let _success = _dif > 2000;
                this.shareBackFunc(_success);
                console.log('listenShareBack time', _dif, _success);
                this.shareBackFunc = undefined;
            }
        }
        IsExistOpenContext() {
            if (MiniPlatformE.qq == PlatformBase.curPlatform || MiniPlatformE.wx == PlatformBase.curPlatform) {
                return true;
            }
            return false;
        }
        SetUserCloudStorage(_data, success, fail) {
            if (!this.IsExistOpenContext()) {
                console.error('[Platform_mini]', 'SetUserCloudStorage', '不存在开放域功能');
                return;
            }
            mini.setUserCloudStorage({
                KVDataList: _data,
                success: success,
                fail: fail
            });
        }
        GetOpenDataContext() {
            if (!this.IsExistOpenContext()) {
                console.error('[Platform_mini]', 'GetOpenDataContext', '不存在开放域功能');
                return null;
            }
            return mini.getOpenDataContext();
        }
        GetAdsID(_ad) {
            let _get = null;
            switch (PlatformBase.curPlatform) {
                case MiniPlatformE.wx:
                    if (_ad.wx) {
                        _get = _ad.wx;
                    }
                    break;
                case MiniPlatformE.qq:
                    if (_ad.qq) {
                        _get = _ad.qq;
                    }
                    break;
                case MiniPlatformE.tt:
                    if (_ad.tt) {
                        _get = _ad.tt;
                    }
                    break;
                default:
                    break;
            }
            if (_get == '') {
                _get = null;
            }
            if (!_get) {
                console.log('未找到正确的广告id:', _ad);
            }
            return _get;
        }
        CreateADs(_adsID) {
            return __awaiter(this, void 0, void 0, function* () {
                let _complete = 3;
                return new Promise(rs => {
                    let _completeOne = () => {
                        _complete--;
                        if (_complete <= 0) {
                            rs();
                        }
                    };
                    (() => __awaiter(this, void 0, void 0, function* () {
                        if (_adsID.banner) {
                            let _id = this.GetAdsID(_adsID.banner);
                            _id && (yield this.CreateBanner(_id));
                        }
                        _completeOne();
                    }))();
                    (() => __awaiter(this, void 0, void 0, function* () {
                        if (_adsID.video) {
                            let _id = this.GetAdsID(_adsID.video);
                            _id && (yield this.CreateVideoAd(_id));
                        }
                        _completeOne();
                    }))();
                    (() => __awaiter(this, void 0, void 0, function* () {
                        if (_adsID.interstitial) {
                            let _id = this.GetAdsID(_adsID.interstitial);
                            _id && (yield this.CreateInterstitialAd(_id));
                        }
                        _completeOne();
                    }))();
                });
            });
        }
        CreateBanner(_bannerid) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!mini.createBannerAd || typeof mini.createBannerAd != 'function') {
                    console.error('[Platform_mini]', '不支持banner广告');
                    return;
                }
                let _sys = this.GetSystemInfoSync();
                let _safeArea = _sys.safeArea;
                let _width = MiniPlatformE.tt == PlatformBase.curPlatform ? 208 : _safeArea.width;
                let _height = (_width / 16) * 9 | 0;
                this.bannerLoaded = false;
                return new Promise(rs => {
                    this.bannerAd = mini.createBannerAd({
                        adUnitId: _bannerid,
                        style: {
                            top: _safeArea.bottom - _height,
                            width: _width,
                        }
                    });
                    console.log('CreateBanner bannerAd', this.bannerAd);
                    this.bannerAd.onLoad(() => {
                        console.log('banner 广告加载成功');
                        this.bannerLoaded = true;
                        if (this.isBannerShow) {
                            this.ShowBanner();
                        }
                        rs && rs();
                    });
                    this.bannerAd.onError((err) => {
                        console.error('banner 广告加载失败', err);
                        rs && rs();
                        try {
                            this.bannerAd.destroy();
                            console.log('加载失败，销毁当前banner');
                        }
                        catch (e) {
                            console.error('当前banner销毁失败');
                        }
                        this.bannerLoaded = false;
                        this.bannerAd = null;
                        setTimeout(() => {
                            console.log('重新拉取banner');
                            this.CreateBanner(_bannerid);
                        }, 3000);
                    });
                    this.bannerAd.onResize((res) => {
                        console.log('onResize ' + res.width + res.height);
                        this.bannerAd.style.top = _safeArea.bottom - res.height;
                        this.bannerAd.style.left = (_safeArea.width - res.width) / 2;
                    });
                });
            });
        }
        ShowBanner() {
            this.isBannerShow = true;
            console.log('ShowBanner this.bannerAd', this.bannerAd);
            if (!this.bannerAd) {
                console.error('[Platform_mini] bannerAd 不存在', this.bannerAd);
                return;
            }
            if (this.bannerLoaded) {
                try {
                    this.bannerAd.show().then(() => {
                        console.log("广告显示成功");
                    }).catch((err) => {
                        console.error("广告组件出现问题", err);
                    });
                }
                catch (e) {
                    console.error('ShowBanner', e);
                }
            }
        }
        HideBanner() {
            this.isBannerShow = false;
            if (!this.bannerAd) {
                return;
            }
            console.log('[Platform_mini]', 'HideBanner');
            this.bannerAd.hide();
        }
        CreateInterstitialAd(_interstitialid) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!mini.createInterstitialAd || typeof mini.createInterstitialAd != 'function') {
                    console.error('[Platform_mini] 不支持插屏广告');
                    return;
                }
                if (MiniPlatformE.tt == PlatformBase.curPlatform && 'Douyin' != this.getTTHost()) {
                    console.error('[Platform_mini] 仅抖音平台支持插屏广告', this.getTTHost());
                    return;
                }
                this.isInterstitialAdLoaded = false;
                return new Promise(rs => {
                    this.interstitialAd = mini.createInterstitialAd({
                        adUnitId: _interstitialid
                    });
                    console.log('[Platform_mini] interstitialAd', this.interstitialAd);
                    this.interstitialAd.load().then(() => {
                        rs && rs();
                    }).catch((err) => {
                        rs && rs();
                    });
                    ;
                    this.interstitialAd.onLoad(() => {
                        this.isInterstitialAdLoaded = true;
                        rs && rs();
                        console.log('插屏 广告加载成功');
                    });
                    this.interstitialAd.onError((err) => {
                        this.isInterstitialAdLoaded = false;
                        console.error('插屏 广告加载失败', err);
                    });
                    this.interstitialAd.onClose((res) => {
                        let result = {
                            isOpened: true,
                            isEnd: true
                        };
                        this.interstitialCallBack && this.interstitialCallBack(result);
                        console.log('插屏 广告关闭');
                    });
                });
            });
        }
        ShowInterstitialAd() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = {
                    isOpened: false,
                    isEnd: false
                };
                console.log('ShowInterstitialAd this.interstitialAd', this.interstitialAd);
                if (!this.interstitialAd) {
                    console.error('[Platform_mini] interstitialAd 不存在', this.interstitialAd);
                    return result;
                }
                let _show = () => {
                    if (!this.isInterstitialShow) {
                        return;
                    }
                    console.log('[Platform_mini]  show()');
                    this.interstitialAd.show().catch((err) => {
                        this.interstitialCallBack && this.interstitialCallBack(result);
                        setTimeout(() => {
                            this.interstitialAd.load();
                        }, 1000);
                    });
                };
                this.isInterstitialShow = true;
                console.log('[Platform_mini]  ShowInterstitialAd');
                if (!this.isInterstitialAdLoaded) {
                    yield this.interstitialAd.load().then(() => {
                        _show();
                    }).catch((err) => {
                        this.interstitialCallBack && this.interstitialCallBack(result);
                    });
                }
                else {
                    _show();
                }
                return new Promise((rs) => {
                    this.interstitialCallBack = rs;
                });
            });
        }
        HideInterstitialAd() {
            this.isInterstitialShow = false;
        }
        CreateVideoAd(_videoid) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!mini.createRewardedVideoAd || typeof mini.createRewardedVideoAd != 'function') {
                    console.error('[Platform_mini] 不支持视频广告');
                    return;
                }
                console.log('[Platform_mini] CreateVideoAd', _videoid);
                return new Promise(rs => {
                    this.videoAd = mini.createRewardedVideoAd({ adUnitId: _videoid });
                    this.videoAd.onLoad(() => {
                        this.isVideoAdLoaded = true;
                        console.log('激励视频 广告加载成功');
                        rs && rs();
                    });
                    this.videoAd.onError((err) => {
                        this.isVideoAdLoaded = false;
                        console.error('_video 广告加载失败', err);
                        rs && rs();
                    });
                    this.videoAd.onClose((res) => {
                        let isEnd = true;
                        if (!res || !res.isEnded) {
                            isEnd = res.isEnded;
                        }
                        let result = {
                            isOpened: true,
                            isEnd: isEnd
                        };
                        this.videoCallBack && this.videoCallBack(result);
                    });
                });
            });
        }
        ShowVideoAd() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = {
                    isOpened: false,
                    isEnd: false
                };
                console.log('ShowVideoAd this.videoAd', this.videoAd);
                if (!this.videoAd) {
                    return result;
                }
                console.log('[Platform_mini] ShowVideoAd');
                if (!this.isVideoAdLoaded) {
                    yield this.videoAd.load();
                }
                this.videoAd.show().catch((err) => {
                    this.videoCallBack && this.videoCallBack(result);
                    setTimeout(() => {
                        this.videoAd.load();
                    }, 1000);
                });
                return new Promise((rs) => {
                    this.videoCallBack = rs;
                });
            });
        }
        getInterstitialAdState() {
            return this.isInterstitialAdLoaded;
        }
        getVideoAdState() {
            return this.isVideoAdLoaded;
        }
        IsExistRecoder() {
            if (MiniPlatformE.tt == PlatformBase.curPlatform) {
                if (mini.getGameRecorderManager) {
                    return true;
                }
            }
            return false;
        }
        initRecoder() {
            this.videoShared = false;
            this.recording = false;
            this.gameRecorder = mini.getGameRecorderManager();
            this.gameRecorder.onStart(() => {
                this.recording = true;
                this.recordListener && this.recordListener('start');
                console.log('--录屏开始--');
                this.recodeTime.end = this.recodeTime.start = Date.now();
            });
            this.gameRecorder.onStop((res) => {
                console.log("--录屏结束--", res);
                this.recodeTime.end = Date.now();
                this.recording = false;
                let _timeEnough = this.recodeTime.end - this.recodeTime.start > 4000;
                console.log("录屏时间:", (this.recodeTime.end - this.recodeTime.start) / 1000);
                if (_timeEnough) {
                    this.videoPath = res.videoPath;
                    this.videoShared = false;
                    this.videoCliped = false;
                    this.clipVideo();
                }
                else {
                    console.error('录屏结束-时间不足');
                }
                this.recordListener && this.recordListener('end', _timeEnough);
                this.RecoderEndCallBack && this.RecoderEndCallBack(_timeEnough);
            });
            this.gameRecorder.onError((err) => __awaiter(this, void 0, void 0, function* () {
                this.recording = false;
                console.error('录屏失败', err);
                if (!(yield this.GetSetting('scope.screenRecord'))) {
                    let _r = yield this.ShowModal({ title: '权限请求', content: '请设置允许录屏', confirmText: '去设置', cancelText: '拒绝' });
                    if (_r) {
                        yield this.OpenSetting();
                        setTimeout(() => {
                            this.RecoderStart();
                        }, 500);
                    }
                }
            }));
            this.gameRecorder.onInterruptionBegin((err) => {
                this.recording = false;
                console.error('录屏中断', err);
            });
        }
        clipVideo() {
            if (this.videoCliped || !this.videoPath) {
                return;
            }
            let _self = this;
            const timeRange = [300, 300];
            this.gameRecorder.clipVideo({
                path: this.videoPath,
                timeRange: timeRange,
                success(res) {
                    console.log('视频剪辑成功');
                    _self.videoPath = res.videoPath;
                    _self.videoCliped = true;
                },
                fail(e) {
                    console.error('视频剪辑失败', e);
                },
            });
        }
        RecoderStart() {
            if (this.recording) {
                return;
            }
            console.log('主动开始录屏');
            this.gameRecorder.start({
                duration: 300
            });
        }
        RecoderEnd(_shareIt = false) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('主动结束录屏');
                if (!this.InRecording()) {
                    return false;
                }
                console.log('主动结束录屏111');
                this.gameRecorder.stop();
                console.log('主动结束录屏2222');
                return new Promise((rs) => {
                    this.RecoderEndCallBack = rs;
                    console.log('主动结束录屏3333');
                });
            });
        }
        ShareRecoder(_shareConfig = ShareConfig.Video.normal) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.gameRecorder || !this.videoPath || !mini.shareAppMessage) {
                    return false;
                }
                if (!_shareConfig) {
                    console.error('[ShareRecoder]:_shareConfig不能为空！');
                    return false;
                }
                return new Promise(rs => {
                    mini.shareAppMessage({
                        channel: 'video',
                        title: _shareConfig.topics[0],
                        desc: _shareConfig.title,
                        query: _shareConfig.query,
                        extra: {
                            videoPath: this.videoPath,
                            videoTopics: _shareConfig.topics,
                            hashtag_list: _shareConfig.topics,
                            video_title: _shareConfig.title,
                            createChallenge: true,
                        },
                        success: () => __awaiter(this, void 0, void 0, function* () {
                            console.log(`分享录屏成功！`);
                            this.videoShared = true;
                            rs(true);
                        }),
                        fail(e) {
                            console.error(`分享录屏失败！`, e);
                            rs(false);
                        },
                    });
                });
            });
        }
        ListenRecorder(_listen) {
            this.recordListener = _listen;
        }
        UnListenRecorder() {
            this.recordListener = undefined;
        }
        IsRecoderShared() {
            return this.videoShared;
        }
        InRecording() {
            return this.recording;
        }
        HaveRecoderVideo() {
            return !!this.videoPath;
        }
    }

    let Platform = null;
    var PlateformE;
    (function (PlateformE) {
        PlateformE[PlateformE["unknow"] = 0] = "unknow";
        PlateformE[PlateformE["Mini"] = 1] = "Mini";
        PlateformE[PlateformE["H5"] = 2] = "H5";
        PlateformE[PlateformE["Android"] = 3] = "Android";
        PlateformE[PlateformE["QuickGame"] = 4] = "QuickGame";
    })(PlateformE || (PlateformE = {}));
    ;
    let MyPlatform = PlateformE.Mini;
    class PlatformDiff {
        static INS() {
            if (!this._instance) {
                this._instance = new PlatformDiff();
            }
            return this._instance;
        }
        getPlatForm() {
            switch (MyPlatform) {
                case PlateformE.Mini:
                    this.getPlatFormByMinigame();
                    break;
                case PlateformE.H5:
                    this.getQueryVariable('source');
                    break;
                case PlateformE.Android:
                    this.getPlatFormByAndroid();
                    break;
                case PlateformE.QuickGame:
                    this.getPlatFormByQuickGame();
                    break;
                default:
                    PlatformDiff.source = undefined;
                    break;
            }
        }
        getQueryVariable(variable) {
            PlatformDiff.source = undefined;
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    PlatformDiff.source = pair[1];
                    return pair[1];
                }
            }
            return '';
        }
        getPlatFormByAndroid() {
        }
        getPlatFormByQuickGame() { }
        getPlatFormByMinigame() {
            if (typeof tt != 'undefined') {
                PlatformBase.curPlatform = MiniPlatformE.tt;
                window.mini = tt;
                mini = tt;
                console.log('当前平台:', 'tt');
            }
            else if (typeof qq != 'undefined') {
                PlatformBase.curPlatform = MiniPlatformE.qq;
                window.mini = window.wx = qq;
                mini = qq;
                console.log('当前平台:', 'qq');
            }
            else if (typeof wx != 'undefined') {
                PlatformBase.curPlatform = MiniPlatformE.wx;
                window.mini = wx;
                console.log('当前平台:', 'wx');
            }
            else {
                PlatformBase.curPlatform = MiniPlatformE.unknow;
                MyPlatform = PlateformE.unknow;
            }
        }
        CreateAdsByPlatForm() {
            if (MyPlatform == PlateformE.Mini && PlatformBase.curPlatform) {
                Platform = new Platform_mini();
            }
            else if (MyPlatform == PlateformE.unknow) {
                Platform = new PlatformBase();
            }
            else {
                switch (PlatformDiff.source) {
                    default:
                        Platform = new PlatformBase();
                        break;
                }
            }
        }
    }
    PlatformDiff.source = undefined;
    PlatformDiff._instance = null;

    const CDNRoot = {
        baseUrl: 'https://oss.ixald.com/',
        platform: {
            wx: 'game2/config/wx/',
            tt: 'game2/config/tt/',
        },
        edition: {
            debug: 'debug/',
            release: 'release/'
        },
    };
    function GetCDNUrl() {
        let _platform = CDNRoot.platform.wx;
        let _editon = CDNRoot.edition.debug;
        if (PlateformE.Mini == MyPlatform) {
            switch (PlatformBase.curPlatform) {
                case MiniPlatformE.tt:
                    _platform = CDNRoot.platform.tt;
                    break;
                default:
                    break;
            }
        }
        else {
            let _plat = Platform.LocalStorageGetItem('EditorPlatformKey');
            let _pltconfg = CDNRoot.platform;
            if (_plat) {
                let _json = JSON.parse(_plat);
                if (_json.paltform in _pltconfg) {
                    _platform = _pltconfg[_json.paltform];
                }
                _editon = _json.release ? CDNRoot.edition.release : CDNRoot.edition.debug;
            }
        }
        return CDNRoot.baseUrl + _platform + _editon;
    }
    const FetchOrder = [
        ['switches'],
        ['subjectConfig'],
    ];
    let CDNConfig = {
        switches: {
            CDNConfigVersion: {
                baseConfig: 0,
                subjectConfig: 0,
            },
        },
        baseConfig: {},
        subjectConfig: [
            { subject: "第一题xxxxxxxxxx 是", answer: true },
            { subject: "第二题xxxxxxxxxx 否", answer: false },
        ]
    };

    class GetCDNData {
        static Init() {
            this.url = GetCDNUrl();
            console.log('this.url', this.url);
            GetCDNData.InitConfigVersion();
            GetCDNData.GetLocalConfigVersion();
        }
        static GetInfoInOrder(_completeOrder) {
            return __awaiter(this, void 0, void 0, function* () {
                for (let index = 0; index < FetchOrder.length; index++) {
                    const iterator = FetchOrder[index];
                    let _funs = [];
                    iterator.forEach(element => {
                        _funs.push(() => __awaiter(this, void 0, void 0, function* () {
                            yield this.getConfigByRemote(element);
                        }));
                    });
                    yield this.WaitAllComplete(_funs);
                    _completeOrder && _completeOrder(index);
                }
            });
        }
        static getConfigByRemote(_keyName, _force = true, onlyLocal = false) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('开始获取配置', _keyName);
                let fullUrl = this.url + `${_keyName}.json`;
                let _congfig = null;
                let _r = yield this.downloadDetector(fullUrl, _force, _keyName, onlyLocal);
                console.log('获取配置结果', _keyName, _r);
                if ('skip' === _r) {
                    return;
                }
                if (_r) {
                    _congfig = _r;
                }
                else {
                    return;
                }
                if (!_congfig) {
                    console.error(`[${_keyName}]获取配置失败`);
                }
                else {
                    CDNConfig[_keyName] = _congfig;
                    console.log(`[${_keyName}]获取配置成功`, CDNConfig[_keyName]);
                }
            });
        }
        static downloadDetector(fullUrl, _force, _key, onlyLocal = false) {
            return __awaiter(this, void 0, void 0, function* () {
                let _congfig = null;
                let inCotrol = false;
                console.log('CDN服务端版本号', JSON.stringify(CDNConfig.switches.CDNConfigVersion));
                console.log('CDN代码中版本号', JSON.stringify(GetCDNData.allCDNConfigVersion[0]));
                console.log('CDN本地存储中版本号', JSON.stringify(GetCDNData.allCDNConfigVersion[1]));
                if (CDNConfig.switches.CDNConfigVersion && _key in GetCDNData.allCDNConfigVersion[0] && _key in CDNConfig.switches.CDNConfigVersion) {
                    inCotrol = true;
                    let _remoteV = CDNConfig.switches.CDNConfigVersion[_key];
                    let _chachV = GetCDNData.allCDNConfigVersion[0][_key];
                    let _storeV = GetCDNData.allCDNConfigVersion[1][_key];
                    GetCDNData.CDNDateResult[_key] = false;
                    if (_chachV >= _remoteV && _chachV >= _storeV) {
                        GetCDNData.CDNDateResult[_key] = true;
                        return 'skip';
                    }
                    if (_storeV >= _remoteV) {
                        _congfig = GetCDNData.getLocalConfig(_key);
                        if (_congfig) {
                            GetCDNData.ChangeConfigVersion(0, _key, 'set');
                            GetCDNData.CDNDateResult[_key] = true;
                            return _congfig;
                        }
                    }
                    if (onlyLocal) {
                        return 'skip';
                    }
                }
                let _retry = 3;
                if (!_force && !inCotrol) {
                    if (_key in GetCDNData.CDNDateResult && GetCDNData.CDNDateResult[_key]) {
                        return 'skip';
                    }
                }
                while (_retry > 0) {
                    try {
                        let _addPar = '?add=' + Math.floor(Math.random() * 10000);
                        _congfig = yield this.loadRemote(fullUrl + _addPar);
                        _retry = 0;
                    }
                    catch (error) {
                        console.error(`[downloadDetector-${_key}]获取配置失败`, fullUrl, error);
                    }
                    if (_retry > 1) {
                        yield TimeUtil.wait(500);
                    }
                    _retry--;
                }
                if (_congfig) {
                    GetCDNData.CDNDateResult[_key] = true;
                    this.storetLocalConfig(_key, _congfig);
                }
                else {
                    GetCDNData.CDNDateResult[_key] = false;
                }
                return _congfig;
            });
        }
        static IsGetAllDate() {
            let _result = true;
            for (const key in GetCDNData.CDNDateResult) {
                if (GetCDNData.CDNDateResult.hasOwnProperty(key)) {
                    if (!GetCDNData.CDNDateResult[key]) {
                        _result = false;
                        break;
                    }
                }
            }
            return _result;
        }
        static InitConfigVersion() {
            GetCDNData.allCDNConfigVersion = [];
            for (let index = 0; index < 2; index++) {
                GetCDNData.allCDNConfigVersion[index] = {};
                if (CDNConfig.switches.CDNConfigVersion)
                    for (const key in CDNConfig.switches.CDNConfigVersion) {
                        if (CDNConfig.switches.CDNConfigVersion.hasOwnProperty(key)) {
                            GetCDNData.allCDNConfigVersion[index][key] = 0;
                        }
                    }
                console.log('InitConfigVersion', JSON.stringify(GetCDNData.allCDNConfigVersion[index]));
            }
        }
        static GetLocalConfigVersion() {
            if (GetCDNData.allCDNConfigVersion.length != 2) {
                GetCDNData.InitConfigVersion();
            }
            console.log('存储到本地的版本00', 'GetLocalConfigVersion');
            let _v = Laya.LocalStorage.getItem(GetCDNData.localVerName);
            if (_v) {
                _v = JSON.parse(_v);
                for (const key in _v) {
                    GetCDNData.ChangeConfigVersion(1, key, _v[key]);
                    console.log('存储到本地的版本001', key, _v[key]);
                }
            }
        }
        static storeLocalConfigVersion() {
            if (GetCDNData.allCDNConfigVersion.length < 2) {
                return;
            }
            Laya.LocalStorage.setItem(GetCDNData.localVerName, JSON.stringify(GetCDNData.allCDNConfigVersion[1]));
        }
        static ChangeConfigVersion(_type, _key, _handle) {
            if (GetCDNData.allCDNConfigVersion.length < 2) {
                console.error('ChangeConfigVersion 错误');
                return;
            }
            if (CDNConfig.switches.CDNConfigVersion && _key in CDNConfig.switches.CDNConfigVersion && _key in GetCDNData.allCDNConfigVersion[_type]) {
                if (_handle == 'clear') {
                    GetCDNData.allCDNConfigVersion[_type][_key] = 0;
                }
                else if (_handle == 'set') {
                    GetCDNData.allCDNConfigVersion[_type][_key] = CDNConfig.switches.CDNConfigVersion[_key];
                }
                else {
                    GetCDNData.allCDNConfigVersion[_type][_key] = _handle;
                }
            }
        }
        static getLocalConfig(_key) {
            let _r = null;
            try {
                _r = Laya.LocalStorage.getItem(GetCDNData.storeCVname + _key);
                if (_r) {
                    _r = JSON.parse(_r);
                }
            }
            catch (error) {
                console.error('getLocalConfig出错: ', _key, error);
            }
            return _r;
        }
        static storetLocalConfig(_key, _data) {
            console.log('storetLocalConfig', _key, _data);
            if (CDNConfig.switches.CDNConfigVersion && _key in CDNConfig.switches.CDNConfigVersion && _key in GetCDNData.allCDNConfigVersion[1]) {
                try {
                    Laya.LocalStorage.setItem(GetCDNData.storeCVname + _key, JSON.stringify(_data));
                }
                catch (error) {
                    console.error('storetLocalConfig出错: ', _key, error);
                    return;
                }
                GetCDNData.ChangeConfigVersion(1, _key, 'set');
                GetCDNData.storeLocalConfigVersion();
            }
            else if ('switches' != _key) {
                console.error('storetLocalConfig：', _key, '未能存储到本地');
            }
        }
        static ClearLocalStoreByOrder() {
            this.ClearLocalConfigVersion();
            this.Init();
        }
        static ClearLocalConfigVersion() {
            Laya.LocalStorage.removeItem(GetCDNData.localVerName);
        }
        static ClearLocalConfig(_key) {
            Laya.LocalStorage.removeItem(GetCDNData.storeCVname + _key);
        }
        static getVersionNumber(versionStr) {
            return versionStr.split('.').reduce((o, v, i) => {
                return o += parseInt(v) * Math.pow(10, (2 - i) * 2);
            }, 0);
        }
        static loadRemote(url) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((rs, rj) => {
                    Laya.loader.load(url, Laya.Handler.create(this, (res) => {
                        if (!res) {
                            console.error('loadRemote err', res);
                            rs(null);
                        }
                        else {
                            rs(res);
                        }
                    }), null, Laya.Loader.JSON);
                });
            });
        }
        static WaitAllComplete(_funs) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((_rs) => {
                    let _rn = _funs.length;
                    _funs.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                        yield element();
                        _rn--;
                        if (_rn == 0) {
                            _rs();
                        }
                    }));
                });
            });
        }
    }
    GetCDNData.url = '';
    GetCDNData.CDNDateResult = {};
    GetCDNData.allCDNConfigVersion = [];
    GetCDNData.localVerName = 'CDNLocalConfigVersion';
    GetCDNData.storeCVname = 'CDNstoreConfig';

    let DataConfig = {
        tempData: {
            curScore: 0,
        },
        localData: {
            lastPlayTime: 0,
            addressInfo: {
                name: '',
                address: '',
                phone: '',
            }
        },
        serverData: {},
        ser_localData: {}
    };

    const storeKeyName = 'dataA_';
    const localSimpleKey = storeKeyName + 'ls_key';
    const simpleType = ['number', 'boolean', 'string'];
    class DataAccess {
        constructor() {
            this.localSimpleData = null;
            this.waitStoreServerData = [];
            this.dataStoreType = {};
            this.timeID = null;
            this.inContinueUpload = false;
        }
        static INS() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new DataAccess();
            return this.instance;
        }
        GetLocalData(_usedata) {
            if (!this.localSimpleData) {
                let _data = Platform.LocalStorageGetItem(localSimpleKey);
                console.log('[DataAccess]GetLocalData', _data);
                if (_data) {
                    this.localSimpleData = _data;
                }
                else {
                    this.localSimpleData = {};
                }
            }
            let _usedata2 = _usedata;
            let getData = [DataConfig.localData, DataConfig.ser_localData];
            getData.forEach(config => {
                for (const key in config) {
                    if (simpleType.indexOf(typeof _usedata2[key]) > -1) {
                        if (key in this.localSimpleData) {
                            _usedata2[key] = this.localSimpleData[key];
                        }
                    }
                    else {
                        let _data = Platform.LocalStorageGetItem(storeKeyName + key);
                        if (_data) {
                            _usedata2[key] = _data;
                        }
                    }
                }
            });
        }
        InitStoreType(_key, _type) {
            this.dataStoreType[_key] = _type;
        }
        StoreData(_key, _value) {
            return __awaiter(this, void 0, void 0, function* () {
                switch (this.dataStoreType[_key]) {
                    case 'tempData':
                        break;
                    case 'localData':
                        this.localStore(_key, _value);
                        break;
                    case 'ser_localData':
                        this.localStore(_key, _value);
                        let _idx = this.waitStoreServerData.findIndex(v => v.key == _key);
                        if (_idx < 0) {
                            this.waitStoreServerData.push({ key: _key, value: _value });
                        }
                        else {
                            this.waitStoreServerData[_idx].value = _value;
                        }
                        this.continueUpload();
                        break;
                    case 'serverData':
                        return yield this.ServerStore([{ key: _key, value: _value }]);
                    default:
                        console.error('DataAccess', '未处理的数据类型', _key);
                        break;
                }
                return true;
            });
        }
        localStore(_key, _value) {
            console.log('[DataAccess] localStore type', _key, typeof _value);
            if (simpleType.indexOf(typeof _value) > -1) {
                this.localSimpleData[_key] = _value;
                Platform.LocalStorageSetItem(localSimpleKey, this.localSimpleData);
            }
            else {
                Platform.LocalStorageSetItem(storeKeyName + _key, _value);
            }
        }
        ServerStore(_data, trytime = 3) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!MyGlobal.hhgame) {
                    console.error('[ServerStore] hhgame 不存在');
                    return false;
                }
                console.log('[DataAccess] ServerStore', _data);
                for (let index = 0; index < trytime; index++) {
                    try {
                        yield MyGlobal.hhgame.kv.setMany(_data);
                        console.log('[DataAccess] ServerStore 存储成功', _data);
                        return true;
                    }
                    catch (e) {
                        console.error('[DataAccess] ServerStore 存储失败', e);
                        yield TimeUtil.wait(100);
                    }
                }
                return false;
            });
        }
        ServerFetch(_keys, trytime = 3) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!MyGlobal.hhgame) {
                    console.error('[ServerStore] hhgame 不存在');
                    return null;
                }
                console.log('[DataAccess] ServerFetch', _keys);
                for (let index = 0; index < trytime; index++) {
                    try {
                        return yield MyGlobal.hhgame.kv.getMany(_keys);
                    }
                    catch (e) {
                        console.error('[DataAccess] ServerFetch 失败', _keys, e);
                        yield TimeUtil.wait(100);
                    }
                }
                return null;
            });
        }
        continueUpload(_delayTime = 5) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.inContinueUpload) {
                    return;
                }
                if (!this.waitStoreServerData || this.waitStoreServerData.length <= 0) {
                    return;
                }
                if (this.timeID) {
                    return;
                }
                console.log('continueUpload 000', MyGlobal.IsLogin(), Platform.IsNetConnected());
                if (MyGlobal.IsLogin() && Platform.IsNetConnected()) {
                    this.inContinueUpload = true;
                    let _curData = this.waitStoreServerData;
                    this.waitStoreServerData = [];
                    console.log('continueUpload _curData', _curData);
                    let _result = yield this.ServerStore(_curData);
                    this.inContinueUpload = false;
                    if (_result) {
                    }
                    else {
                        this.waitStoreServerData.forEach(element => {
                            let _idx = _curData.findIndex(v => v.key == element.key);
                            if (_idx >= 0) {
                                _curData[_idx] = element;
                                return;
                            }
                            _curData.push(element);
                        });
                        this.waitStoreServerData = _curData;
                    }
                }
                this.timeID = setTimeout(() => {
                    this.timeID = null;
                    this.continueUpload(_delayTime);
                }, _delayTime * 1000);
            });
        }
    }
    DataAccess.instance = null;

    const listenKey = 'Listen_';
    class DataManager_C {
        constructor() {
            this.useData = {};
            this.listenID = 0;
            this.isInit = false;
            this.listener = {};
        }
        static INS() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new DataManager_C();
            this.instance.isInit = false;
            return this.instance;
        }
        Init(_versionChecking) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.isInit) {
                    return;
                }
                this.listenID = 0;
                for (const k in DataConfig) {
                    for (const key in DataConfig[k]) {
                        if (key in this.useData) {
                            throw new Error('[DataManager]重复的数据名:' + key);
                        }
                        if (k == 'serverData') {
                            continue;
                        }
                        this.useData[key] = DataConfig[k][key];
                        DataAccess.INS().InitStoreType(key, k);
                    }
                }
                DataAccess.INS().GetLocalData(this.useData);
                console.log('useData', this.useData);
                _versionChecking && _versionChecking();
                this.isInit = true;
            });
        }
        InitLocalServer() {
            return __awaiter(this, void 0, void 0, function* () {
                let _ser_local = [];
                for (const key in DataConfig.ser_localData) {
                    _ser_local.push(key);
                }
                if (_ser_local.length <= 0) {
                    return true;
                }
                while (1) {
                    let _data = yield DataAccess.INS().ServerFetch(_ser_local);
                    if (_data) {
                        console.log('InitLocalServer _data', _data);
                        _data.forEach(element => {
                            if (this.correlationData(element.key, element.value)) {
                                this.Set(element.key, element.value);
                            }
                        });
                        break;
                    }
                    if (!(yield Platform.ShowModal({ title: '拉取失败', content: "服务端数据拉取失败,是否重试？", confirmText: '重试', cancelText: '取消' }))) {
                        break;
                    }
                }
            });
        }
        correlationData(_key, _value) {
            let _type = typeof _value;
            let _useData = this.useData[_key];
            if (_type == 'object') {
                if (this.IsObjectEquality(_useData, _value)) {
                    return false;
                }
            }
            else if (_useData == _value) {
                return false;
            }
            switch (_type) {
                case 'number':
                    if (_value > _useData) {
                        return true;
                    }
                    return false;
                case 'string':
                    if (_value.length > _useData.length) {
                        return true;
                    }
                    return false;
                case 'object':
                    if (Array.isArray(_value)) {
                        if (_value.length > _useData.length) {
                            return true;
                        }
                    }
                    else if (Object.keys(_value).length > Object.keys(_useData).length) {
                        return true;
                    }
                    return false;
                default:
                    break;
            }
            return false;
        }
        SetServer(_data) {
            return __awaiter(this, void 0, void 0, function* () {
                let _changedata = [];
                for (let index = 0; index < _data.length; index++) {
                    const element = _data[index];
                    if (!(element.key in this.useData)) {
                        throw new Error('SetServer key 未被初始化，请先调用 InitLocalServer 进行初始化');
                    }
                    if (element.value == this.useData[element.key]) {
                        continue;
                    }
                    _changedata.push(element);
                }
                if (_changedata.length <= 0) {
                    return true;
                }
                console.log('[DataManager]SetServer:', _data);
                if (yield DataAccess.INS().ServerStore(_changedata)) {
                    _changedata.forEach(v => {
                        if (this.listener[v.key]) {
                            this.listener[v.key].forEach(l => {
                                l.call({ key: v.key, value: v.value, oldV: this.useData[v.key] });
                            });
                        }
                        this.useData[v.key] = v.value;
                    });
                    return true;
                }
                return false;
            });
        }
        InitByServer(_keys) {
            return __awaiter(this, void 0, void 0, function* () {
                let _needkeys = [];
                _keys.forEach(key => {
                    if (!(key in this.useData)) {
                        _needkeys.push(key);
                    }
                });
                if (_needkeys.length <= 0) {
                    return true;
                }
                let _data = yield DataAccess.INS().ServerFetch(_needkeys);
                if (_data) {
                    console.log('InitByServer _data', _data);
                    _needkeys.forEach(key => {
                        this.useData[key] = DataConfig.serverData[key];
                    });
                    _data.forEach(element => {
                        this.useData[element.key] = element.value;
                    });
                    _needkeys.forEach(key => {
                        console.log('InitByServer useData', key, this.useData[key]);
                    });
                    return true;
                }
                return false;
            });
        }
        AddServer(_key, _addvalue) {
            return __awaiter(this, void 0, void 0, function* () {
                let _oldv = this.useData[_key];
                switch (typeof this.useData[_key]) {
                    case 'number':
                    case 'string':
                        return yield this.SetServer([{ key: _key, value: _oldv + _addvalue }]);
                        break;
                    default:
                        console.error('[DataManager]Add:', '未处理的数据类型', _key, typeof this.useData[_key]);
                        break;
                }
                return false;
            });
        }
        Set(_key, _value, _store = true) {
            if (typeof this.useData[_key] == 'object') {
            }
            else if (_value == this.useData[_key]) {
                return;
            }
            let _old = this.useData[_key];
            this.useData[_key] = _value;
            if (this.listener[_key]) {
                this.listener[_key].forEach(l => {
                    l.call({ key: _key, value: this.useData[_key], oldV: _old });
                });
            }
            _store && DataAccess.INS().StoreData(_key, _value);
        }
        Get(_key) {
            if (!(_key in this.useData)) {
                throw new Error(`[DataManager]Get ${_key} 未被初始`);
            }
            return this.useData[_key];
        }
        Add(_key, _addvalue) {
            let _oldv = this.useData[_key];
            switch (typeof this.useData[_key]) {
                case 'number':
                case 'string':
                    this.Set(_key, _oldv + _addvalue);
                    break;
                default:
                    console.error('[DataManager]Add:', '未处理的数据类型', _key, typeof this.useData[_key]);
                    break;
            }
        }
        Listen(_keys, callBack) {
            this.listenID++;
            for (const _key of _keys) {
                if (!this.listener[_key]) {
                    this.listener[_key] = [];
                }
                this.listener[_key].push({ id: this.listenID, call: callBack });
                callBack({ key: _key, value: this.useData[_key], oldV: this.useData[_key] });
            }
            return this.listenID;
        }
        UnListen(_keys, id) {
            for (const _key of _keys) {
                if (!this.listener[_key]) {
                    continue;
                }
                let _idx = this.listener[_key].findIndex(v => v.id == id);
                if (_idx < 0) {
                    continue;
                }
                this.listener[_key].splice(_idx, 1);
                if (this.listener[_key].length == 0) {
                    this.listener[_key] = null;
                }
            }
        }
        IsObjectEquality(obj1, obj2) {
            let _obj1 = obj1;
            let _obj2 = obj2;
            if (Object.keys(obj1).length != Object.keys(obj2).length) {
                return false;
            }
            for (const key in obj1) {
                let _type1 = typeof _obj1[key];
                let _type2 = typeof _obj2[key];
                if (_type1 != _type2) {
                    return false;
                }
                if (_type1 == 'object') {
                    if (!this.IsObjectEquality(_obj1[key], _obj2[key])) {
                        return false;
                    }
                }
                if (_obj1[key] != _obj2[key]) {
                    return false;
                }
            }
            return true;
        }
    }
    DataManager_C.instance = null;
    const DataManager$1 = DataManager_C.INS();

    class MyGlobal {
        static Init(_enable) {
            if (this.isInit) {
                return;
            }
            PlatformDiff.INS().getPlatForm();
            PlatformDiff.INS().CreateAdsByPlatForm();
            _enable.checkUpdate && Platform.CheckForUpdate();
            _enable.dataManager && DataManager$1.Init();
            _enable.cdnData && GetCDNData.Init();
            _enable.openFGUI && FGUIUtil.Init();
            if (_enable.loadRetryTime) {
                Laya.loader.retryNum = _enable.loadRetryTime;
            }
            this.isInit = true;
        }
        static InitHHgame() {
        }
        static IsLogin() {
            return false;
        }
        static Login() {
            return __awaiter(this, void 0, void 0, function* () {
                let _r = false;
                return _r;
            });
        }
        static miniGameLogin(retry = 3) {
            return __awaiter(this, void 0, void 0, function* () {
                return false;
            });
        }
        static ShowShareMenu(_callFun) {
            Platform.ShowShareMenu();
            Platform.OnShareAppMessage(() => {
                let _info = this.getShareInfo('normal');
                let _data = { title: _info.title, imageUrl: ShareBathPath + _info.image, query: this.getQueryInfo(_info.image) };
                _callFun && _callFun(_data);
                return _data;
            });
        }
        static ShareImage(_key) {
            return __awaiter(this, void 0, void 0, function* () {
                let _info = this.getShareInfo(_key);
                let _r = yield Platform.ShareAppMessage(_info.title, ShareBathPath + _info.image, this.getQueryInfo(_info.image));
                return _r;
            });
        }
        static ShareVideo(_key) {
            return __awaiter(this, void 0, void 0, function* () {
                let _r = yield Platform.ShareRecoder();
                return _r;
            });
        }
        static getShareType(_key) {
            let _type = 0;
            return _type;
        }
        static getShareInfo(_key) {
            let _info = ShareConfig.Image[_key];
            let _idx = 0;
            if (_info.length > 1) {
                _idx = (Math.random() * _info.length) | 0;
                console.log('getShareInfo _idx', _idx, _info.length);
            }
            return {
                title: _info[_idx].title,
                image: _info[_idx].image
            };
        }
        static getQueryInfo(_cardId) {
            let _shareCardIDStr = 'cardid=' + _cardId;
            let _uid = 'unknow';
            let _qid = '&fromUid=' + _uid;
            return _shareCardIDStr + _qid;
        }
        static ListenBootstrap(_callBack) {
            if (!Platform.IsExistGetLaunchOptions()) {
                return;
            }
            _callBack(Platform.GetLaunchOptions());
            Platform.OnShow(_callBack);
        }
    }
    MyGlobal.IsDataInit = false;
    MyGlobal.isInit = false;
    MyGlobal.hhgame = null;
    window.Global = MyGlobal;

    class FGUIScene extends FGUIBase {
        constructor() {
            super(...arguments);
            this.fguiType = FGUIClassType.scene;
            this.mountPath = {};
            this.mainName = "Main";
            this.mySceneName = '';
        }
        AddScene(_callBack) {
            if (!this.pkgName) {
                console.error('场景类需要填写 pkgName !');
                return false;
            }
            let _parent = fgui.GRoot.inst;
            let _myName = `${this.pkgName}_${this.mainName}`;
            const sceneKeyName = 'sceneName';
            let _main = null;
            for (const iterator of _parent._children) {
                if (sceneKeyName in iterator && iterator[sceneKeyName] == _myName) {
                    _main = iterator;
                    break;
                }
            }
            if (!_main) {
                FGUIUtil.loadPackage(this.pkgName, this, () => {
                    for (const key in this.mountPath) {
                        fgui.UIObjectFactory.setExtension(fgui.UIPackage.getItemURL(this.pkgName, this.mountPath[key].compName), this.mountPath[key].classType);
                    }
                    _main = fgui.UIPackage.createObject(this.pkgName, this.mainName).asCom;
                    _main[sceneKeyName] = _myName;
                    _main.makeFullScreen();
                    _main.addRelation(_parent, fgui.RelationType.Size);
                    _main.x = _main.pivotX * Laya.stage.width;
                    _main.y = _main.pivotY * Laya.stage.height;
                    _parent.addChild(_main);
                    this.Init(_main);
                    _callBack && _callBack();
                });
            }
            else {
                _parent.addChild(_main);
                this.Show();
                _callBack && _callBack();
            }
            return true;
        }
    }

    const DebugConfig = {
        TimeMonitor: {
            enable: true
        }
    };

    class TimeMonitor {
        static start(_key, _useS = true) {
            if (!DebugConfig.TimeMonitor.enable) {
                return;
            }
            this.keyName[_key] = { useS: _useS, time: [] };
            this.keyName[_key].time[0] = (new Date()).getTime();
            if (this.keyName[_key].useS) {
                this.keyName[_key].time[0] /= 1000;
            }
            console.info(`监测-[${_key}]: ${this.keyName[_key].time[0]} 开始`);
        }
        static dot(_key, _tag = '') {
            if (!DebugConfig.TimeMonitor.enable) {
                return null;
            }
            if (!(_key in this.keyName)) {
                this.start(_key);
                return null;
            }
            let _time = (new Date()).getTime();
            if (this.keyName[_key].useS) {
                _time /= 1000;
            }
            console.info(`监测-[${_key} ${_tag}]:`, `本次用时：${_time - this.keyName[_key].time[this.keyName[_key].time.length - 1]}`, `总用时：${_time - this.keyName[_key].time[0]}`, `当前：${_time}`);
            this.keyName[_key].time.push(_time);
            return _time - this.keyName[_key].time[0];
        }
        static reportPerformance(_id) {
            if (window.myLastTime) {
                let _curTime = Date.now();
                let _dif = _curTime - window.myLastTime;
                window.myLastTime = _curTime;
                console.log('监测：', _id, _dif);
            }
        }
    }
    TimeMonitor.keyName = {};

    class SceneUtil {
        static loadScene(scene, _retryTime = 5, _forceTry = false) {
            if (!_forceTry) {
                this.retryTime = _retryTime;
                if (SceneUtil.lockLoadScene(true, 3000)) {
                    return;
                }
            }
            if (0 == this.retryTime) {
                Platform.ShowModal({ title: '网络不好', content: '切换场景失败', confirmText: '重试', cancelText: '取消' }).then(v => {
                    if (v) {
                        SceneUtil.loadScene(scene, _retryTime);
                    }
                });
                return;
            }
            else if (this.retryTime > 0) {
                this.retryTime--;
            }
            let _lastScene = null;
            if (!_forceTry) {
            }
            try {
                console.log('loadScene', scene);
                let _loadsc = (asset) => __awaiter(this, void 0, void 0, function* () {
                    let _trytime = 3;
                    let _tryLoad = () => __awaiter(this, void 0, void 0, function* () {
                        {
                            Laya.Scene.open(scene + '.scene', true, undefined, Laya.Handler.create(this, (asset) => {
                                _trytime = -1;
                                SceneUtil.lockLoadScene(false);
                            }));
                        }
                    });
                    _tryLoad();
                });
                console.log('loadScene-已加载场景：', scene, JSON.stringify(SceneUtil.loadedList), SceneUtil.loadedList.indexOf(scene));
                if (SceneUtil.loadedList.indexOf(scene) >= 0) {
                    _loadsc();
                    return;
                }
                let preloadHandler = (err) => __awaiter(this, void 0, void 0, function* () {
                    TimeMonitor.dot('loadScene', '预加载完成');
                    Platform.HideLoading();
                    if (err) {
                        if (this.retryTime == 0) {
                            return;
                        }
                        Platform.ShowLoading({ title: '努力重试中..' });
                        setTimeout(() => {
                            Platform.HideLoading();
                            SceneUtil.loadScene(scene, _retryTime, true);
                        }, 500);
                        return;
                    }
                    _loadsc();
                });
                SceneUtil.preloadScene([scene], true, undefined, undefined, preloadHandler);
            }
            catch (e) {
                console.error('加载场景失败', scene);
                setTimeout(() => {
                    SceneUtil.loadScene(scene, _retryTime, true);
                }, 500);
            }
        }
        static CloseScene(scene) {
            Laya.Scene.close(scene + '.scene');
        }
        static lockLoadScene(_lock = true, _delaytime = 3000) {
            if (_lock) {
                let _cur = SceneUtil.inLoadScene;
                if (!SceneUtil.inLoadScene) {
                    SceneUtil.inLoadScene = _lock;
                    SceneUtil.lockTimeOut = setTimeout(() => {
                        if (!SceneUtil.inLoadScene) {
                            return;
                        }
                        SceneUtil.lockLoadScene(false);
                    }, _delaytime);
                }
                return _cur;
            }
            else {
                let _cur = SceneUtil.inLoadScene;
                SceneUtil.inLoadScene = _lock;
                if (SceneUtil.lockTimeOut) {
                    clearTimeout(SceneUtil.lockTimeOut);
                }
                return _cur;
            }
        }
        static preloadScene(sceneNames, _precedence = true, _loadSuccessCallBack, onProgress, onLoaded) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!sceneNames || sceneNames.length == 0) {
                    return;
                }
                for (let index = 0; index < sceneNames.length; index++) {
                    const element = sceneNames[sceneNames.length - index - 1];
                    if (SceneUtil.loadedList.indexOf(element) >= 0) {
                        continue;
                    }
                    let _idx = SceneUtil.preloadQueue.indexOf(element);
                    if (_idx < 0) {
                        SceneUtil.preloadQueue.push(element);
                    }
                    else if (_precedence && _idx < SceneUtil.preloadQueue.length - 1) {
                        SceneUtil.preloadQueue.splice(_idx, 1);
                        SceneUtil.preloadQueue.push(element);
                    }
                    if (!(element in SceneUtil.preloadCallBack)) {
                        SceneUtil.preloadCallBack[element] = {};
                    }
                    if (_loadSuccessCallBack) {
                        SceneUtil.preloadCallBack[element].loadSuccessCallBack = _loadSuccessCallBack;
                    }
                    if (onProgress) {
                        SceneUtil.preloadCallBack[element].onProgress = onProgress;
                    }
                    if (onLoaded) {
                        SceneUtil.preloadCallBack[element].onLoaded = onLoaded;
                    }
                }
                if (SceneUtil.inPreLoad || SceneUtil.preloadQueue.length <= 0) {
                    return;
                }
                SceneUtil.inPreLoad = true;
                let _curScene = SceneUtil.preloadQueue[SceneUtil.preloadQueue.length - 1];
                console.log('preloadQueue', SceneUtil.preloadQueue);
                console.log('_curScene', _curScene);
                let _callBack = undefined;
                if (_curScene in SceneUtil.preloadCallBack) {
                    _callBack = SceneUtil.preloadCallBack[_curScene];
                }
                return new Promise((rs) => __awaiter(this, void 0, void 0, function* () {
                    let _loadCompelte = (err) => __awaiter(this, void 0, void 0, function* () {
                        SceneUtil.inPreLoad = false;
                        if (!err) {
                            SceneUtil.preLoadRetryWaitTime.wait = SceneUtil.preLoadRetryWaitTime.add;
                            if (_curScene in SceneUtil.preloadCallBack) {
                                delete SceneUtil.preloadCallBack[_curScene];
                            }
                            SceneUtil.loadedList.push(_curScene);
                            let _idx = SceneUtil.preloadQueue.indexOf(_curScene);
                            if (_idx > -1) {
                                SceneUtil.preloadQueue.splice(_idx, 1);
                            }
                            _callBack && _callBack.loadSuccessCallBack && _callBack.loadSuccessCallBack(_curScene);
                        }
                        _callBack && _callBack.onLoaded && _callBack.onLoaded(err);
                        if (err) {
                            yield TimeUtil.wait(SceneUtil.preLoadRetryWaitTime.wait);
                            if (SceneUtil.preLoadRetryWaitTime.wait < SceneUtil.preLoadRetryWaitTime.max) {
                                SceneUtil.preLoadRetryWaitTime.wait += SceneUtil.preLoadRetryWaitTime.add;
                            }
                        }
                        if (SceneUtil.preloadQueue.length > 0) {
                            SceneUtil.preloadScene([SceneUtil.preloadQueue[SceneUtil.preloadQueue.length - 1]], false);
                        }
                        else {
                            rs();
                        }
                    });
                    Laya.Scene.load(_curScene + '.scene', Laya.Handler.create(this, (asset) => {
                        asset.size(Laya.stage.width, Laya.stage.height);
                        _loadCompelte(null);
                    }));
                }));
            });
        }
        static GetLastScene() {
            return this.lastSceneName;
        }
        static GoBack() {
            if (!this.lastSceneName) {
                return false;
            }
            this.loadScene(this.lastSceneName);
            return true;
        }
    }
    SceneUtil.lastSceneName = null;
    SceneUtil.retryTime = 5;
    SceneUtil.inLoadScene = false;
    SceneUtil.lockTimeOut = null;
    SceneUtil.loadedList = [];
    SceneUtil.preloadQueue = [];
    SceneUtil.preloadCallBack = {};
    SceneUtil.inPreLoad = false;
    SceneUtil.preLoadRetryWaitTime = { wait: 1000, add: 1000, max: 10000 };

    const Config = {
        version: '0.0.2',
        hhConfig: {
            appid: 'Brains',
            url: 'https://game.ixald.com'
        },
    };
    const ModuleControl = {
        EnableScoreRank: true,
        EnableTask: true,
        EnableGift: true,
        EnableBag: true,
        EnableNotice: true,
    };
    const GameConfig = {};

    var UIPackage = fgui.UIPackage;
    class StartScene extends FGUIScene {
        constructor() {
            super(...arguments);
            this.pkgName = 'StartScene';
            this.curScore = 0;
            this.lastScore = 0;
            this.isPlaying = false;
            this.element = {
                startBtn: null,
                getCoinBtn: null,
                rankBtn: null,
                scoreBtn: null,
                ruleBtn: null,
                coinNText: null,
                scoreNText: null,
                getCoinBubble: null,
                getCoinNText: null,
                scoreIcon: null,
                bg: null,
                awardShow: null,
            };
            this.elementPath = {
                coinNText: 'startBtn.coinNText',
                scoreNText: 'scoreBtn.scoreNText',
                getCoinBubble: 'getCoinBtn.bubbleBG',
                getCoinNText: 'getCoinBtn.bagNText',
                scoreIcon: 'scoreBtn.icon',
            };
        }
        onStart() {
            ModuleStatistics.ChangeCurGameState('beforeGame');
            StartScene.INS = this;
            this.changeSkin();
            this.clickBtn();
            this.listenText();
            Laya.Scene.closeAll();
            this.setAwardInfo();
            if (StartScene.isFist) {
                StartScene.isFist = false;
                uiActivityEndPopup.AutoShowActivityEnd((_show) => {
                    if (!_show && StartScene.INS && ModuleGlobal.IsActivityOn()) {
                        TaskLogic.AutoShowExtraPopup(TaskType.dayGift);
                    }
                });
            }
            this.refreshNewNumber();
            Laya.timer.loop(1000, this, this.countDownUpdate);
            if (ModuleGlobal.ActivityState == 'on') {
                TaskLogic.ReceiveTaskAward(TaskType.friendship, () => { }, true);
            }
            this.showCoin();
        }
        setAwardInfo() {
            uiAwards.GetRankData((_getData) => {
                if (!_getData.data || _getData.data.length <= 0) {
                    return;
                }
                let _awardData = _getData.data[0];
                let _awardLoader = this.element.awardShow.getChild('awardLoader');
                let _priceText = this.element.awardShow.getChild('priceText');
                _awardLoader.url = _awardData.prizePicture;
                _priceText.text = '' + _awardData.prizePrice;
            });
        }
        showCoin() {
            this.curScore = GameLogic.GetCurScore();
            this.lastScore = GameLogic.GetScore();
            if (this.curScore <= 0) {
                return;
            }
            this.isPlaying = true;
            let coinNum = 7;
            let index = 0;
            let icon = this.element.scoreBtn.getChild("icon");
            for (let i = 0; i < coinNum; i++) {
                let image = UIPackage.createObject("GameCommon", "gamejifen").asImage;
                image.x = Laya.stage.width / 2;
                image.y = Laya.stage.height / 2;
                this.main.addChild(image);
                Laya.Tween.to(image, { x: image.x + (i < (coinNum / 2) ? -100 : 100), y: image.y + ((1 - 2 * Math.random()) * 100) }, 400, Laya.Ease.backInOut, Laya.Handler.create(this, () => {
                    Laya.Tween.to(image, { x: this.element.scoreBtn.x - this.element.scoreBtn.width / 2, y: this.element.scoreBtn.y }, Math.random() * 500 + 500, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
                        image.removeFromParent();
                        index++;
                        if (index >= coinNum) {
                        }
                        if (index == 1) {
                            Laya.timer.loop(50, this, this.updateScore);
                        }
                    }));
                }));
            }
            if (coinNum > 0) {
                let _scaleLoop = () => {
                    const _sb = 1.15;
                    const _ss = 0.85;
                    const _t = 400;
                    Laya.Tween.to(icon, { scaleX: _sb, scaleY: _sb }, _t, undefined, Laya.Handler.create(this, () => {
                        Laya.Tween.to(icon, { scaleX: _ss, scaleY: _ss }, _t, undefined, Laya.Handler.create(this, _scaleLoop));
                    }));
                };
                _scaleLoop();
            }
        }
        onEnd() {
            StartScene.INS = null;
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        clickBtn() {
            {
                this.element.rankBtn.visible = ModuleControl.EnableScoreRank;
                this.element.getCoinBtn.visible = ModuleControl.EnableTask;
            }
            let _scaleLoop = () => {
                const _sb = 1.05;
                const _ss = 0.95;
                const _t = 800;
                Laya.Tween.to(this.element.startBtn, { scaleX: _sb, scaleY: _sb }, _t, undefined, Laya.Handler.create(this, () => {
                    Laya.Tween.to(this.element.startBtn, { scaleX: _ss, scaleY: _ss }, _t, undefined, Laya.Handler.create(this, _scaleLoop));
                }));
            };
            _scaleLoop();
            this.element.startBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                ModuleStatistics.ClickGameBtn();
                if (uiAlert.AutoShowActivityState()) {
                    return;
                }
                MyUtils.showLoading();
                GameLogic.ChangeCoin(-GameLogic.gameExpendCoin, () => {
                    SceneUtil.loadScene("MyGameScene");
                    MyUtils.closeLoading();
                }, (_code) => {
                    MyUtils.closeLoading();
                    if (uiAlert.AutoShowActivityState()) {
                        return;
                    }
                    new Alert("次数不足，做任务获取更多次数吧~", () => {
                        ModulePackage.Instance.Show('Task', 0, 0, this.main);
                    }, () => {
                    });
                });
                console.log('startBtn111');
            });
            this.element.getCoinBtn.onClick(this, () => {
                console.log('getCoinBtn11');
                HHAudio.PlayEffect('btn');
                ModulePackage.Instance.Show('Task', 0, 0, this.main);
            });
            this.element.ruleBtn.onClick(this, () => {
                console.log('ruleBtn');
                HHAudio.PlayEffect('btn');
                ModulePackage.Instance.Show('Rule', 0, 0, this.main);
            });
            this.element.scoreBtn.onClick(this, () => {
                if (!ModuleControl.EnableGift) {
                    console.log('未开启兑换好礼模块');
                    return;
                }
                HHAudio.PlayEffect('btn');
                console.log('scoreBtn');
                ModulePackage.Instance.Show('gift', 0, 0, this.main);
            });
            this.element.rankBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('rankBtn');
                ModulePackage.Instance.Show('rank', 0, 0, this.main);
            });
        }
        listenText() {
            this.element.coinNText.text = '' + GameLogic.GetCoin();
            this.element.getCoinNText.text = '' + GameLogic.GetNewInCoin();
            Laya.stage.on('coin', this, () => {
                this.element.coinNText.text = '' + GameLogic.GetCoin();
            });
            this.element.scoreNText.text = '' + GameLogic.GetScore();
            Laya.stage.on('score', this, () => {
                if (!this.isPlaying) {
                    this.element.scoreNText.text = '' + GameLogic.GetScore();
                }
            });
            Laya.stage.on('newInCoin', this, () => {
                this.element.getCoinNText.text = '' + GameLogic.GetNewInCoin();
            });
        }
        updateScore() {
            let scoreAdd = Math.max(Math.floor(this.curScore / 40), 1);
            let score = parseInt(this.element.scoreNText.text);
            if (score + scoreAdd >= this.curScore + this.lastScore) {
                scoreAdd = this.curScore + this.lastScore - score;
            }
            if (score < this.curScore + this.lastScore) {
                this.element.scoreNText.text = "" + (score + scoreAdd);
            }
            else {
                this.element.scoreNText.text = '' + GameLogic.GetScore();
                this.isPlaying = false;
                this.curScore = 0;
                this.lastScore = 0;
                let icon = this.element.scoreBtn.getChild("icon");
                Laya.Tween.clearTween(icon);
                Laya.timer.clear(this, this.updateScore);
            }
        }
        changeSkin() {
            ModuleSkins.ChangeSkin(this.element.bg, 'bgImage');
            ModuleSkins.ChangeSkin(this.element.scoreIcon, 'integralIcon');
            ModuleSkins.ChangeFguiICON(this.element.ruleBtn, 'ruleIcon');
            ModuleSkins.ChangeFguiICON(this.element.rankBtn, 'rankingIcon');
            ModuleSkins.ChangeFguiICON(this.element.getCoinBtn, 'numberIcon');
            ModuleSkins.ChangeFguiICON(this.element.startBtn, 'StartIcon');
        }
        countDownUpdate() {
        }
        refreshNewNumber() {
            let _refresh = (_n) => {
                console.log('_refresh');
                this.element.getCoinBubble.visible = _n > 0;
                this.element.getCoinNText.visible = _n > 0;
                if (this.element.getCoinNText.visible) {
                    this.element.getCoinNText.text = '' + _n;
                }
            };
            _refresh(GameLogic.listenRefreshNewNumber());
            Laya.stage.on('refreshBubbleUI', this, _refresh);
        }
        showDailyGift() {
        }
        openUI(UIClass) {
            MyUtils.showLoading();
            let demo = new UIClass();
        }
        NewAlert(_str) {
            new Alert(_str, () => { }, () => { });
        }
    }
    StartScene.INS = null;
    StartScene.isFist = true;

    class LoadingUI extends Laya.View {
        constructor() {
            super();
            this._allValue = 0;
            this._curValue = 0;
            this._isComplete = false;
        }
        onEnable() {
            MainUtil.setCurScene(Global.hallConfig.CUR_SCENE.loading);
            Global.EventManager.on(Global.hallConfig.EventEnum.Res_Load_Complete, this, this.complete);
            this.innerRound();
            PlayDataUtil.init();
            SoundPlayer$1.init();
            this.centerFit();
            PlayDataUtil.setData("version", Global.hallConfig._version);
            for (const key in Global.hallConfig.Sound) {
                SoundPlayer$1.preloadSound(key, false);
            }
            ModulePlatformAPI.Init();
            this.progress.text = '5%';
            ModuleStatistics.StartLoadRes();
            ModuleGlobal.Init(() => {
                this.progress.text = '10%';
                ModuleAudio.SetComonBtnAudioPath(AudioCDNPath + 'Audio/btn.mp3');
                TaskLogic.Init(() => {
                    ModulePlatformAPI.CheckMember();
                    ModulePlatformAPI.CheckShopFavoredStatus();
                    this.progress.text = '20%';
                    console.log('任务初始化成功');
                    Global.ResourceManager.PreloadResources();
                });
                ModuleGlobal.GetGoodsList(undefined, { pageSize: 30, sortType: 'random' });
                uiAwards.GetRankData();
            });
            HHAudio.PreloadAudioClip('ALL');
            console.log('login suc------', 24);
        }
        innerRound() {
            Laya.Tween.to(this.img_load, { rotation: 360 }, 4000, Laya.Ease.linearNone, Laya.Handler.create(this, function () {
                this.img_load.rotation = 0;
                this.innerRound();
            }, null, true));
        }
        onDisable() {
            Global.EventManager.off(Global.hallConfig.EventEnum.Res_Load_Complete, this, this.complete);
        }
        updateBar(value) {
            console.log("updateBar value = ", value);
            if (value > 1) {
                value = 1;
            }
            this.loadingBar.value = value;
        }
        complete(curFrame = 0) {
            this._curValue += 1;
            this.progress.text = (20 + Math.floor(Global.ResourceManager._idx * 0.6)) + '%';
            if (Global.ResourceManager._idx < 100) {
                return;
            }
            if (!this._isComplete) {
                this._isComplete = true;
                console.log("进度条结束加载");
                {
                    let _initComplete = () => {
                        this.progress.text = '95%';
                        FGUIUtil.PreLoadResouce('All', () => {
                            this.changeScene();
                        });
                    };
                    ModulePackage.Instance.PreloadResources();
                    if (ModulePackage.Instance.IsInitComplete()) {
                        _initComplete();
                    }
                    else {
                        let callback = () => {
                            ModulePackage.Instance.off(ModulePackage.MODULE_INIT_COMPLETE, this, callback);
                            _initComplete();
                        };
                        ModulePackage.Instance.on(ModulePackage.MODULE_INIT_COMPLETE, this, callback);
                    }
                }
            }
        }
        changeScene() {
            GameLogic.Init();
            GameLogic.GetActivityState();
            GameLogic.listenRefreshNewNumber();
            MyGlobal.Init({ cdnData: false, dataManager: true, openFGUI: true });
            FGUIUtil.loadPackage('GameCommon', this, () => {
                TB$1.setBarColor(1);
                FGUIUtil.ShowScene(StartScene);
                this.progress.text = '100%';
            });
        }
        centerFit() {
            this.bg.height = 2000;
            this.bg.x = 0;
            this.bg.y = 0;
        }
    }

    class MemPool {
        constructor() {
            this.ObjectPoolMap = {};
            this.PoolPreMap = {};
            this.ObjSavebyTag = {};
        }
        static getInstance() {
            if (!this.instance) {
                this.instance = new MemPool();
            }
            return this.instance;
        }
        HavePool(_name) {
            return this.ObjectPoolMap.hasOwnProperty(_name);
        }
        CreateObjPool(_name, _pre, initSize = 0) {
            return true;
        }
        GetObjByPool(_name, type, tag = '') {
            let _obj = Laya.Pool.getItemByCreateFun(_name, type.create, type);
            return _obj;
        }
        RecycleObjByTag(tag) {
        }
        PoolRecycleObj(_name, obj, tag = '') {
            Laya.Pool.recover(_name, obj);
        }
        DestroyObjPool(_name) {
        }
    }
    MemPool.instance = null;

    class Fruit extends Laya.Script {
        constructor() {
            super();
            this.myid = -1;
            this.isContacted = false;
            this.lastPos = [-2000, -2000];
            this.targetX = 0;
            this.inMoving = false;
            this.collisionState = true;
            this.contactIDS = [];
        }
        static SetPrefab(_prefab, _parent) {
            this.myPrefab = _prefab;
            this.parent = _parent;
        }
        static Create(_info) {
            let _node = MemPool.getInstance().GetObjByPool(this.poolName, this.myPrefab);
            if (!_node) {
                return null;
            }
            let _item = _node.getComponent(Fruit);
            if (!_item) {
                return null;
            }
            Fruit.parent.addChild(_node);
            Fruit.allItems.push(_item);
            _item.init(_info);
            return _item;
        }
        static DestoryAll(_destoryPool = false) {
            while (Fruit.allItems.length > 0) {
                Fruit.allItems[0].RemoveSelf();
            }
        }
        RemoveSelf() {
            if (this.node.mask) {
                this.node.mask.graphics.clear();
                this.node.mask = null;
            }
            this.EnableCollision(false);
            this.node.pos(-500, -500);
            this.node.visible = false;
            this.node.removeSelf();
            MemPool.getInstance().PoolRecycleObj(Fruit.poolName, this.node, Fruit.poolName);
            let _idx = Fruit.allItems.findIndex(v => v.myid == this.myid);
            if (_idx >= 0) {
                Fruit.allItems.splice(_idx, 1);
            }
        }
        init(_info) {
            Fruit.showingID++;
            this.isContacted = false;
            this.myid = Fruit.showingID;
            this.contactIDS = [];
            this.node = this.owner;
            this.myInfo = _info;
            this.myRigidBody = this.owner.getComponent(Laya.RigidBody);
            this.ResetFruitKind(_info.kind);
            this.EnableCollision(false);
            this.node.visible = true;
            Laya.timer.frameOnce(1, this, () => {
                this.node.pos(_info.x, _info.y);
                this.lastPos[0] = _info.x;
                this.lastPos[1] = _info.y;
            });
            this.startDownCallBack = undefined;
            this.inMoving = false;
        }
        ResetFruitKind(_kind) {
            this.myInfo.kind = _kind;
            let _image = this.owner;
            let _finfo = GameLogic.GetFruitUrlInfo(_kind);
            let _fConfig = GameLogic.GetFruitConfig(_kind);
            this.myCollider = this.owner.getComponent(Laya.CircleCollider);
            this.node.rotation = 0;
            this.targetX = 0;
            let _w = _fConfig.imagesW;
            let _r = _w / 2;
            const _exterW = 0;
            _image.size(_w + _exterW, _w + _exterW);
            let _circle = this.node.getChildByName('circle');
            _circle.visible = _finfo.custom;
            if (_circle.visible) {
                _circle.skin = `img/fruits/q${_kind}.png`;
            }
            if (this.node.mask) {
                this.node.mask.graphics.clear();
                if (!_finfo.custom) {
                    this.node.mask = null;
                }
            }
            if (_finfo.custom) {
                if (!this.node.mask) {
                    this.node.mask = new Laya.Sprite();
                }
                let _cr = _r + _exterW / 2;
                this.node.mask.graphics.drawCircle(_cr, _cr, _cr, "#ff0000");
                _circle.size(_cr * 2, _cr * 2);
            }
            _image.skin = _finfo.url;
            console.log('_finfo.url', _finfo.url);
            this.myCollider.radius = _r;
            this.myCollider.y = this.myCollider.x = _exterW / 2;
            this.myCollider.refresh();
            this.node.active = true;
            this.node.scale(1, 1);
        }
        StartDown(_x, _finish) {
            if (this.inMoving == true) {
                return;
            }
            this.inMoving = true;
            this.startDownCallBack = _finish;
            this.SetMoveTarget(_x);
        }
        SetMoveTarget(_x) {
            if (!this.node || !this.owner.parent) {
                return;
            }
            let _minX = this.node.width / 2;
            let _maxX = this.owner.parent.width - this.node.width / 2;
            if (_x < _minX) {
                _x = _minX;
            }
            else if (_x > _maxX) {
                _x = _maxX;
            }
            this.targetX = _x;
            this.moveXUpdate();
        }
        moveXUpdate() {
            if (this.collisionState || this.targetX <= 0) {
                return;
            }
            {
                this.node.pos(this.targetX, this.node.y);
                if (this.inMoving && this.startDownCallBack) {
                    this.inMoving = false;
                    this.startDownCallBack();
                }
                return;
            }
        }
        EnablePhysic(_enable) {
            if (!this.myCollider.enabled && _enable) {
                if (typeof this.myInfo.kind == 'number') {
                    GameLogic.NewFruit(this.myInfo.kind);
                }
            }
            this.myRigidBody.enabled = _enable;
            this.myCollider.enabled = _enable;
        }
        EnableCollision(_enable) {
            this.collisionState = _enable;
            this.EnablePhysic(_enable);
        }
        scaleAction() {
            this.EnablePhysic(false);
            this.node.scale(0.2, 0.2);
            Laya.Tween.clearAll(this.node);
            Laya.Tween.to(this.node, { scaleX: 1, scaleY: 1 }, 300, Laya.Ease.sineIn, Laya.Handler.create(this, function () {
                this.EnablePhysic(true);
            }));
        }
        GetTopY() {
            return this.node.y - this.node.width / 2;
        }
        onEnable() {
        }
        onDisable() {
            this.node.scale(1, 1);
            Laya.timer.clearAll(this);
            Laya.Tween.clearAll(this.node);
        }
        onTriggerEnter(other, self, contact) {
            if (!this.collisionState || !this.myRigidBody.enabled) {
                return;
            }
            let _selfFruit = self.owner.getComponent(Fruit);
            let _otherFruit = other.owner.getComponent(Fruit);
            if (!_selfFruit || !_otherFruit) {
                return;
            }
            let _merge = false;
            do {
                if (_selfFruit.myInfo.kind === _otherFruit.myInfo.kind) {
                    if (typeof _selfFruit.myInfo.kind == 'number') {
                        _merge = true;
                        break;
                    }
                }
                else {
                    if ((_selfFruit.myInfo.kind == 'supper') || (_otherFruit.myInfo.kind == 'supper')) {
                        _merge = true;
                        break;
                    }
                }
            } while (0);
            if (_merge) {
                Laya.stage.event("sameContact", { self: _selfFruit, other: _otherFruit });
            }
            else {
                this.isContacted = true;
            }
        }
    }
    Fruit.ImageBaseUrl = '';
    Fruit.showingID = 0;
    Fruit.poolName = 'FruitPool';
    Fruit.allItems = [];

    class Juice extends Laya.Script {
        constructor() {
            super();
            this.myid = -1;
        }
        static SetPrefab(_prefab, _parent) {
            this.myPrefab = _prefab;
            this.parent = _parent;
        }
        static Create(_info) {
            console.log('Create', this.poolName, this.myPrefab);
            let _node = MemPool.getInstance().GetObjByPool(this.poolName, this.myPrefab);
            if (!_node) {
                return null;
            }
            Juice.parent.addChild(_node);
            let _item = _node.getComponent(Juice);
            if (!_item) {
                return null;
            }
            Juice.allItems.push(_item);
            _item.init(_info);
            return _item;
        }
        static DestoryAll(_destoryPool = false) {
            while (Juice.allItems.length > 0) {
                Juice.allItems[0].RemoveSelf();
            }
        }
        RemoveSelf() {
            this.node.visible = false;
            this.node.removeSelf();
            MemPool.getInstance().PoolRecycleObj(Juice.poolName, this.node, Juice.poolName);
            let _idx = Juice.allItems.findIndex(v => v.myid == this.myid);
            if (_idx >= 0) {
                Juice.allItems.splice(_idx, 1);
            }
        }
        init(_info) {
            if (_info.kind >= 1) {
                _info.kind++;
            }
            if (_info.kind >= 7) {
                _info.kind++;
            }
            Juice.showingID++;
            this.myid = Juice.showingID;
            this.node = this.owner;
            this.myInfo = _info;
            this.node.pos(_info.x, _info.y);
            this.node.visible = true;
            this.showJuice();
        }
        showJuice() {
            let _image1 = `img/juices/juice_l_${this.myInfo.kind}.png`;
            let _image2 = `img/juices/juice_o_${this.myInfo.kind}.png`;
            let _image3 = `img/juices/juice_q_${this.myInfo.kind}.png`;
            const RandomInteger = function (e, t) {
                return Math.floor(Math.random() * (t - e) + e);
            };
            for (let i = 0; i < 10; ++i) {
                const node = new Laya.Image(_image1);
                this.node.addChild(node);
                const a = 359 * Math.random(), i = 30 * Math.random() + this.myInfo.width / 2, x = Math.sin(a * Math.PI / 180) * i, y = Math.cos(a * Math.PI / 180) * i, scale = .5 * Math.random() + this.myInfo.width / 100;
                node.scale(scale, scale);
                const p = .3 * Math.random();
                node.pos(0, 0);
                node.anchorX = 0.5;
                node.anchorY = 0.5;
                Laya.Tween.to(node, { x: node.x + x, y: node.y + y }, p * 1000);
                Laya.Tween.to(node, { scaleX: 0.3, scaleY: 0.3, rotation: RandomInteger(-360, 360) }, (p + 0.5) * 1000, undefined, Laya.Handler.create(this, function () {
                    node.removeSelf();
                }));
            }
            for (let f = 0; f < 20; f++) {
                const node = new Laya.Image(_image2);
                this.node.addChild(node);
                let a = 359 * Math.random(), i = 30 * Math.random() + this.myInfo.width / 2, x = Math.sin(a * Math.PI / 180) * i, y = Math.cos(a * Math.PI / 180) * i, scale = .5 * Math.random() + this.myInfo.width / 100;
                node.scale(scale, scale);
                let p = .3 * Math.random();
                node.anchorX = 0.5;
                node.anchorY = 0.5;
                node.pos(0, 0);
                Laya.Tween.to(node, { x: node.x + x, y: node.y + y }, p * 1000);
                Laya.Tween.to(node, { scaleX: 0.3, scaleY: 0.3, rotation: RandomInteger(-360, 360) }, (p + 0.5) * 1000, undefined, Laya.Handler.create(this, function () {
                    node.removeSelf();
                }));
            }
            const node = new Laya.Image(_image3);
            this.node.addChild(node);
            node.pos(0, 0);
            node.scale(0, 0);
            node.anchorX = 0.5;
            node.anchorY = 0.5;
            node.rotation = -RandomInteger(0, 360);
            node.alpha = 1;
            const scale = this.myInfo.width / 150;
            Laya.Tween.to(node, { scaleX: scale, scaleY: scale }, 200, undefined, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { alpha: 0 }, 1000, undefined, Laya.Handler.create(this, function () {
                    node.removeSelf();
                    this.RemoveSelf();
                }));
            }));
        }
        onEnable() {
        }
        onDisable() {
            this.node.removeChildren();
            Laya.Tween.clearAll(this.node);
        }
    }
    Juice.showingID = 0;
    Juice.poolName = 'JuicePool';
    Juice.allItems = [];

    class GameOver extends FGUIMount {
        constructor() {
            super(...arguments);
            this.element = {
                bg: null,
                restartBtn: null,
                overScoreIcon: null,
                luckBagBtn: null,
                moreAwardBtn: null,
                goHomeBtn: null,
                goHomeBtn2: null,
                curScore: null,
                getAwardIcon: null,
                scorebg: null,
                scoreBtn: null,
                scoreNText: null,
            };
            this.elementPath = {
                scoreNText: 'scoreBtn.scoreNText',
            };
            this.stateCtrl = null;
            this.scoreY = 0;
            this.perAdd = 1;
            this.curScore = 0;
            this.toScore = 0;
        }
        onStart() {
            this.scoreY = this.element.scorebg.y;
            console.log(' this.scoreY', this.scoreY);
            this.stateCtrl = this.getController('statectrl');
            this.changeSkin();
            this.clickBtn();
        }
        onShow() {
            this.element.bg.visible = false;
            this.element.scoreBtn.visible = false;
            FGUIUtil.ActionPopIn(this, () => {
                this.element.bg.visible = true;
                this.element.scoreBtn.visible = true;
            });
            let _idx = 0;
            let _gettask = GameLogic.GetGameOverTask();
            if (GameLogic.awardMult > 1 || !_gettask) {
                _idx = 1;
            }
            console.log('GameOver onShow', _idx, GameLogic.awardMult, _gettask);
            this.stateCtrl.selectedIndex = (_idx);
            this.element.getAwardIcon.visible = GameLogic.awardMult > 1;
            this.listenText();
        }
        onHide() {
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        close(_callBack) {
            if (!this.visible) {
                return;
            }
            this.element.bg.visible = false;
            this.element.scoreBtn.visible = false;
            FGUIUtil.ActionPopOut(this, () => {
                _callBack && _callBack();
                this.Hide();
            });
        }
        changeSkin() {
            ModuleSkins.ChangeFguiICON(this.element.scoreBtn, 'integralIcon');
            ModuleSkins.ChangeSkin(this.element.overScoreIcon, 'integralIcon');
        }
        clickBtn() {
            {
            }
            this.element.moreAwardBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('doubelAwardBtn');
                this.close(() => {
                    GameLogic.ShowDoubleAward();
                });
            });
            this.element.restartBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('restartBtn');
                MyUtils.showLoading();
                GameLogic.ChangeCoin(-GameLogic.gameExpendCoin, () => {
                    MyUtils.closeLoading();
                    GameLogic.SettleGameScore();
                    GameLogic.Restart();
                }, () => {
                    if (uiAlert.AutoShowActivityState()) {
                        return;
                    }
                    new Alert("次数不足，做任务获取更多次数吧~", () => {
                    }, () => {
                    });
                    console.error('次数不足！');
                });
            });
            this.element.luckBagBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('luckBagImageBtn');
                GameLogic.BuyLuckyBag((_success, _price) => {
                    console.log('BuyLuckyBag _callbackFunc', _success, _price);
                }, 5);
            });
            let _gohome = () => {
                HHAudio.PlayEffect('btn');
                GameLogic.SettleGameScore();
                FGUIUtil.ShowScene(StartScene);
            };
            this.element.goHomeBtn.onClick(this, _gohome);
            this.element.goHomeBtn2.onClick(this, _gohome);
            this.element.scoreBtn.onClick(this, () => {
                if (!ModuleControl.EnableGift) {
                    console.log('未开启兑换好礼模块');
                    return;
                }
                HHAudio.PlayEffect('btn');
                console.log('scoreBtn');
                ModulePackage.Instance.Show('gift', 0, 0, this);
            });
        }
        listenText() {
            this.toScore = this.curScore = GameLogic.GetCurScore();
            this.element.curScore.text = '' + this.curScore;
            Laya.timer.clear(this, this.scoreUpdate);
            if (GameLogic.awardMult > 1) {
                let _add = (GameLogic.awardMult - 1) * this.curScore;
                this.toScore = _add + this.curScore;
                this.perAdd = 1;
                if (_add > 120) {
                    this.perAdd = _add / 120;
                }
                Laya.timer.frameLoop(1, this, this.scoreUpdate);
            }
            this.element.scoreNText.text = '' + GameLogic.GetScore();
            Laya.stage.on('score', this, () => {
                this.element.scoreNText.text = '' + GameLogic.GetScore();
            });
        }
        scoreUpdate() {
            this.curScore += this.perAdd;
            if (this.curScore >= this.toScore) {
                this.curScore = this.toScore;
                Laya.timer.clear(this, this.scoreUpdate);
            }
            this.element.curScore.text = '' + (this.curScore | 0);
        }
        GameStart() {
        }
        GameRevive() {
        }
        openUI(UIClass) {
            MyUtils.showLoading();
            let demo = new UIClass();
        }
    }

    class RevivePopup extends FGUIMount {
        constructor() {
            super(...arguments);
            this.element = {
                bg: null,
                closeBtn: null,
                attentionBtn: null,
                iconLoader: null,
                reviveText: null,
                btntitle: null,
            };
            this.elementPath = {
                btntitle: 'attentionBtn.title'
            };
            this.curTaskType = null;
        }
        onStart() {
            this.clickBtn();
            this.listenText();
        }
        onShow() {
            this.element.bg.visible = false;
            FGUIUtil.ActionPopIn(this, () => {
                this.element.bg.visible = true;
            });
        }
        onHide() {
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        close(_callBack) {
            if (!this.visible) {
                return;
            }
            this.element.bg.visible = false;
            FGUIUtil.ActionPopOut(this, () => {
                _callBack && _callBack();
                this.Hide();
            });
        }
        clickBtn() {
            this.element.closeBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('closeBtn');
                GameLogic.PreventGameTouch();
                this.close(() => {
                    GameLogic.ShowGameOverPopup();
                });
            });
            this.element.attentionBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('attentionBtn', this.curTaskType);
                GameLogic.PreventGameTouch();
                GameLogic.DoGameTask(this.curTaskType, (_success) => {
                    if (_success) {
                        GameLogic.PreventGameTouch();
                        this.close();
                        GameLogic.Revive();
                    }
                });
            });
        }
        listenText() {
        }
        SetInfo(_taskType) {
            console.log('DoubleAwardPopup SetInfo', _taskType);
            this.curTaskType = _taskType;
            this.element.reviveText.text = GameTasksName[_taskType] + '可复活';
            this.element.iconLoader.url = GameLogic.GetGameTaskIconUrl(_taskType);
        }
    }

    class ConfirmPopup extends FGUIMount {
        constructor() {
            super(...arguments);
            this.element = {
                bg: null,
                closeBtn: null,
                yesBtn: null,
                noBtn: null,
                hintText: null,
            };
            this.elementPath = {};
        }
        onStart() {
            this.clickBtn();
            this.listenText();
        }
        onShow() {
            this.element.bg.visible = false;
            FGUIUtil.ActionPopIn(this, () => {
                this.element.bg.visible = true;
            });
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        close(_callBack) {
            if (!this.visible) {
                return;
            }
            this.element.bg.visible = false;
            FGUIUtil.ActionPopOut(this, () => {
                _callBack && _callBack();
                this.Hide();
            });
        }
        clickBtn() {
            this.element.closeBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('closeBtn');
                GameLogic.PreventGameTouch();
                this.close();
                GameLogic.PauseGame(false);
            });
            this.element.noBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('noBtn');
                GameLogic.PreventGameTouch();
                this.close();
                GameLogic.PauseGame(false);
            });
            this.element.yesBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('yesBtn');
                GameLogic.PreventGameTouch();
                this.close(() => {
                    GameLogic.GameOver(false);
                });
            });
        }
        listenText() {
        }
    }

    class DoubleAwardPopup extends FGUIMount {
        constructor() {
            super(...arguments);
            this.element = {
                bg: null,
                closeBtn: null,
                attentionBtn: null,
                iconLoader: null,
                reviveText: null,
                btntitle: null,
            };
            this.elementPath = {
                btntitle: 'attentionBtn.title'
            };
            this.curTaskType = null;
        }
        onStart() {
            this.clickBtn();
            this.listenText();
        }
        onShow() {
            this.element.bg.visible = false;
            FGUIUtil.ActionPopIn(this, () => {
                this.element.bg.visible = true;
            });
        }
        onHide() {
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        close(_callBack) {
            if (!this.visible) {
                return;
            }
            this.element.bg.visible = false;
            FGUIUtil.ActionPopOut(this, () => {
                _callBack && _callBack();
                this.Hide();
            });
        }
        clickBtn() {
            this.element.closeBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('closeBtn');
                this.close(() => {
                    GameLogic.ShowGameOverPopup();
                });
            });
            this.element.attentionBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('attentionBtn', this.curTaskType);
                GameLogic.DoGameTask(this.curTaskType, (_success) => {
                    if (_success) {
                        this.close(() => {
                            GameLogic.ShowGameOverPopup(2);
                        });
                    }
                });
            });
        }
        listenText() {
        }
        SetInfo(_taskType) {
            console.log('DoubleAwardPopup SetInfo', _taskType);
            this.curTaskType = _taskType;
            this.element.reviveText.text = GameTasksName[_taskType] + '领取双倍';
            this.element.iconLoader.url = GameLogic.GetGameTaskIconUrl(_taskType);
        }
    }

    class GameAward extends FGUIMount {
        constructor() {
            super(...arguments);
            this.element = {
                bg: null,
                closeBtn: null,
                attentionBtn: null,
                iconLoader: null,
                describeText: null,
                priceText: null,
            };
            this.elementPath = {};
            this.myInfo = null;
        }
        onStart() {
            this.clickBtn();
            this.listenText();
        }
        onShow() {
            Laya.stage.offAllCaller(this);
            FGUIUtil.ActionPopIn(this);
            console.log('GameAward', 'onShow');
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        clickBtn() {
            this.element.closeBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('closeBtn');
                GameLogic.PreventGameTouch();
                this.closeself();
            });
            this.element.attentionBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('attentionBtn', this.myInfo.linkId);
                GameLogic.PreventGameTouch();
                this.GotoUse(this.myInfo.linkId);
            });
        }
        listenText() {
        }
        closeself() {
            Laya.stage.offAllCaller(this);
            if (!this.visible) {
                return;
            }
            FGUIUtil.ActionPopOut(this, () => {
                this.Hide();
                GameLogic.PauseGame(false);
            });
        }
        SetInfo(_info) {
            this.myInfo = _info;
            this.element.describeText.text = _info.title;
            this.element.priceText.text = _info.price;
            if (Laya.Browser.onIOS && _info.linkId == 0) {
                this.element.attentionBtn.visible = false;
            }
            console.log('SetInfo', _info);
        }
        GotoUse(_linkId) {
            if (!Laya.Browser.onTBMiniGame) {
                return;
            }
            if (_linkId == 0) {
                TB$1.navigateToTaobaoPage(() => {
                    this.closeself();
                }, () => {
                });
            }
            else {
                TB$1.openDetail('' + _linkId, () => {
                }, () => {
                    this.closeself();
                });
            }
        }
    }

    class MergeExternAward extends FGUIMount {
        constructor() {
            super(...arguments);
            this.element = {
                closeBtn: null,
                attentionBtn: null,
                scoreText: null,
                bg: null,
            };
            this.elementPath = {};
            this.myInfo = null;
            this.sharestate = 0;
            this.addScore = 0;
        }
        onStart() {
            this.clickBtn();
            this.listenText();
            this.sharestate = 0;
        }
        onShow() {
            this.sharestate = 0;
            this.element.bg.visible = false;
            FGUIUtil.ActionPopIn(this, () => {
                this.element.bg.visible = true;
            });
            console.log('MergeExternAward', 'onShow');
        }
        onHide() {
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        checkShareFun() {
            if (this.sharestate == 1) {
                console.log('获得分享奖励 50积分');
                this.addScore += 50;
                this.sharestate = 2;
                this.closeself();
                GameLogic.AddCurScore(this.addScore);
            }
        }
        clickBtn() {
            this.element.closeBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('closeBtn');
                GameLogic.PreventGameTouch();
                this.closeself();
                GameLogic.AddCurScore(this.addScore);
            });
            this.element.attentionBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('attentionBtn');
                GameLogic.PreventGameTouch();
                ModulePlatformAPI.Share(() => {
                    if (this.sharestate == 0) {
                        this.sharestate = 1;
                    }
                    Laya.timer.once(2000, this, () => {
                        this.checkShareFun();
                    });
                });
            });
        }
        listenText() {
        }
        closeself() {
            Laya.stage.offAllCaller(this);
            if (!this.visible) {
                return;
            }
            this.element.bg.visible = false;
            FGUIUtil.ActionPopOut(this, () => {
                this.Hide();
                GameLogic.PauseGame(false);
            });
        }
        SetInfo(_info) {
            this.addScore = _info.score;
            this.myInfo = _info;
            this.element.scoreText.text = '' + _info.score;
            console.log('SetInfo', _info);
        }
    }

    class SurpassHint extends FGUIMount {
        constructor() {
            super(...arguments);
            this.element = {
                surpassText: null,
                photoLoader1: null,
                photoLoader2: null,
            };
            this.elementPath = {};
            this.myInfo = null;
        }
        onStart() {
            this.clickBtn();
            this.listenText();
            this.changeUrl();
        }
        onShow() {
            console.log('SurpassHint', 'onShow');
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
            let _startx = Laya.stage.width + this.width * this.pivotX;
            let _endx = Laya.stage.width - this.width * (1 - this.pivotX);
            this.x = _startx;
            Laya.Tween.to(this, { x: _endx }, 500, undefined, Laya.Handler.create(this, () => {
                Laya.timer.once(2000, this, () => {
                    Laya.Tween.to(this, { x: _startx }, 500, undefined, Laya.Handler.create(this, () => {
                        this.Hide();
                    }));
                });
            }));
        }
        onHide() {
            this.changeUrl();
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        clickBtn() {
        }
        listenText() {
        }
        closeself() {
            Laya.stage.offAllCaller(this);
            if (!this.visible) {
                return;
            }
            FGUIUtil.ActionPopOut(this, () => {
                this.Hide();
                GameLogic.PauseGame(false);
            });
        }
        SetInfo(_info) {
            this.myInfo = _info;
            this.element.surpassText.setVar("count", '' + _info.percent).flushVars();
        }
        changeUrl() {
            const baseUrl = "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/bigFight/matchAvatar/tx_";
            for (let i = 0; i < 2; i++) {
                let _headid = 1 + (Math.random() * 2000) | 0;
                let _url = baseUrl + (Array(5).join('0') + _headid).slice(-5) + ".jpg";
                if (i == 0) {
                    this.element.photoLoader1.url = _url;
                }
                else {
                    this.element.photoLoader2.url = _url;
                }
            }
        }
    }

    class GameTaskPopup extends FGUIMount {
        constructor() {
            super(...arguments);
            this.element = {
                bg: null,
                closeBtn: null,
                goBtn: null,
                titleLoader: null,
                iconLoader: null,
                descText: null,
            };
            this.elementPath = {};
            this.myInfo = null;
            this._isShare = false;
        }
        onStart() {
            this.clickBtn();
            this.listenText();
        }
        onShow() {
            this.element.bg.visible = false;
            FGUIUtil.ActionPopIn(this, () => {
                this.element.bg.visible = true;
            });
            GameLogic.PauseGame(true);
            let _awardType = GameLogic.GetCurGameFlyTaskAwardType();
            if (!_awardType) {
                return;
            }
            let _taskType = GameLogic.GetGameFlyTaskType(_awardType);
            this.SetInfo({
                awardType: _awardType,
                taskType: _taskType
            });
            this._isShare = false;
            Laya.stage.on("checkShare", this, this.checkShareFun);
        }
        onHide() {
            Laya.stage.off("checkShare", this, this.checkShareFun);
        }
        onEnd() {
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        close(_callBack) {
            if (!this.visible) {
                return;
            }
            this.element.bg.visible = false;
            FGUIUtil.ActionPopOut(this, () => {
                _callBack && _callBack();
                this.Hide();
            });
        }
        clickBtn() {
            this.element.closeBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('closeBtn');
                GameLogic.PreventGameTouch();
                this.close(() => {
                    GameLogic.PauseGame(false);
                });
            });
            this.element.goBtn.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                console.log('goBtn');
                GameLogic.PreventGameTouch();
                GameLogic.DoGameFlyTask(this.myInfo.taskType, this.myInfo.awardType, (_success) => {
                    if (_success) {
                        this.close(() => {
                            GameLogic.PauseGame(false);
                        });
                    }
                });
            });
        }
        checkShareFun() {
            if (this._isShare) {
                this._isShare = false;
            }
        }
        listenText() {
        }
        SetInfo(_info) {
            this.myInfo = _info;
            this.element.descText.text = `${GameTasksName[_info.taskType]}\n${GameFlyTaskAwardInfo[_info.awardType].desc}`;
            this.element.iconLoader.url = this.getUrl('icon', _info.awardType);
            this.element.titleLoader.url = this.getUrl('title', _info.awardType);
        }
        getUrl(_type, _taskType) {
            const pktName = 'GameScene';
            let _name = '';
            switch (_type) {
                case 'icon':
                    _name = GameFlyTaskAwardInfo[_taskType].iconPic;
                    break;
                case 'title':
                    _name = GameFlyTaskAwardInfo[_taskType].titlePic;
                    break;
                default:
                    break;
            }
            return fgui.UIPackage.getItemURL(pktName, _name);
        }
    }

    var answerState;
    (function (answerState) {
        answerState[answerState["during"] = 0] = "during";
        answerState[answerState["wait"] = 1] = "wait";
    })(answerState || (answerState = {}));
    class GameScene extends FGUIScene {
        constructor() {
            super(...arguments);
            this.pkgName = 'GameScene';
            this.element = {
                backButton: null,
                score: null,
                scoreIcon: null,
                GameOver: null,
                ConfirmPopup: null,
                RevivePopup: null,
                DoubleAwardPopup: null,
                GameAward: null,
                MergeExternAward: null,
                gameStartHint: null,
                SurpassHint: null,
                gameFlyTaskBtn: null,
                GameTaskPopup: null,
            };
            this.elementPath = {};
            this.mountPath = {
                GameOver: {
                    classType: GameOver,
                    compName: "GameOver"
                },
                RevivePopup: {
                    classType: RevivePopup,
                    compName: "RevivePopup"
                },
                DoubleAwardPopup: {
                    classType: DoubleAwardPopup,
                    compName: "DoubleAwardPopup"
                },
                ConfirmPopup: {
                    classType: ConfirmPopup,
                    compName: "ConfirmPopup"
                },
                GameAward: {
                    classType: GameAward,
                    compName: "GameAward"
                },
                MergeExternAward: {
                    classType: MergeExternAward,
                    compName: "MergeExternAward"
                },
                SurpassHint: {
                    classType: SurpassHint,
                    compName: "SurpassHint"
                },
                GameTaskPopup: {
                    classType: GameTaskPopup,
                    compName: "GameTaskPopup"
                },
            };
            this.curScore = 0;
            this.scorePerAdd = 1;
            this.surpassLevel = 0;
            this.SurpassLevelInfo = [
                { score: 250, percent: 80 },
                { score: 300, percent: 90 },
                { score: 450, percent: 95 },
                { score: 600, percent: 99 }
            ];
        }
        onStart() {
            return __awaiter(this, void 0, void 0, function* () {
                this.element.RevivePopup.Hide();
                this.element.DoubleAwardPopup.Hide();
                this.changeSkin();
                this.clickBtn();
                GameLogic.InGame();
                GetScore.SetParent(this.main);
                ComboEffect.SetParent(this.main);
                GameLogic.gameScene = this;
                GameLogic.Restart();
                this.listenText();
                this.element.GameAward.Hide();
                this.HideFlyTask();
                this.element.gameFlyTaskBtn.getChildAt(0).asImage;
            });
        }
        onEnd() {
            GameLogic.gameScene = null;
            GameLogic.OutGame();
            Laya.stage.offAllCaller(this);
            Laya.timer.clearAll(this);
        }
        changeSkin() {
            ModuleSkins.ChangeFguiICON(this.element.gameFlyTaskBtn, 'honeybeeIcon');
            ModuleSkins.ChangeSkin(this.element.scoreIcon, 'integralIcon');
        }
        clickBtn() {
            this.element.backButton.onClick(this, () => {
                HHAudio.PlayEffect('btn');
                GameLogic.PreventGameTouch();
                GameLogic.PauseGame(true);
                this.element.ConfirmPopup.Show();
            });
            this.element.gameFlyTaskBtn.onClick(this, () => {
                console.log('gameFlyTaskBtn');
                GameLogic.PreventGameTouch();
                HHAudio.PlayEffect('btn');
                GameLogic.PauseGame(true);
                this.element.GameTaskPopup.Show();
            });
        }
        listenText() {
            this.element.score.text = '' + GameLogic.GetCurScore();
            Laya.stage.on('curScore', this, () => {
                this.scorePerAdd = 1;
                let _dif = GameLogic.GetCurScore() - this.curScore;
                if (_dif > 10) {
                    this.scorePerAdd = _dif / 12;
                }
                this.stopScoreUpdate();
                Laya.Tween.to(this.element.score, { scaleX: 1.3, scaleY: 1.3 }, 100);
                Laya.timer.frameLoop(5, this, this.scoreUpdate);
            });
        }
        GameStart() {
            return __awaiter(this, void 0, void 0, function* () {
                this.surpassLevel = 0;
                this.HideFlyTask();
                this.stopScoreUpdate();
                this.showGameOver(false);
                this.showStart(false);
                this.element.ConfirmPopup.close();
                console.log('Gamestart');
                this.element.GameOver.GameStart();
                this.ShowStartHint(true);
                this.element.MergeExternAward.closeself();
            });
        }
        GameRevive() {
            this.showGameOver(false);
            console.log('GameRevive');
            this.element.GameOver.GameRevive();
        }
        GameOver() {
            console.log('gamescene GameOver');
            this.stopScoreUpdate();
            if (!GameLogic.isGameFail) {
                FGUIUtil.ShowScene(StartScene);
            }
            else {
                let _gettask = GameLogic.GetGameOverTask();
                if (GameLogic.reviveLeftTime > 0 && _gettask) {
                    this.element.RevivePopup.Show();
                    this.element.RevivePopup.SetInfo(_gettask);
                }
                else {
                    GameLogic.ShowGameOverPopup();
                }
            }
        }
        GamePause(_pause) {
            if (this.element.gameFlyTaskBtn.visible) {
                this.main.getTransition("flyTask").setPaused(_pause);
            }
        }
        scoreUpdate() {
            if (GameLogic.GetCurScore() - this.curScore > 1) {
                this.curScore += this.scorePerAdd;
            }
            else {
                this.curScore = GameLogic.GetCurScore();
                this.stopScoreUpdate();
            }
            this.AutoShowSurpassHint(this.curScore);
            this.element.score.text = '' + (this.curScore | 0);
        }
        stopScoreUpdate() {
            this.element.score.text = '' + (GameLogic.GetCurScore() | 0);
            this.element.score.setScale(1, 1);
            Laya.Tween.clearAll(this.element.score);
            Laya.timer.clear(this, this.scoreUpdate);
        }
        showStart(_show) {
            return __awaiter(this, void 0, void 0, function* () {
            });
        }
        showGameOver(_show) {
            if (_show) {
                let _gettask = GameLogic.GetGameOverTask();
                this.element.GameOver.Show();
            }
            else {
                this.element.GameOver.close();
            }
            console.log('showGameOver', _show);
        }
        showDoubleAward(_show) {
            if (_show) {
                let _gettask = GameLogic.GetGameOverTask();
                this.element.DoubleAwardPopup.Show();
                this.element.DoubleAwardPopup.SetInfo(_gettask);
            }
            else {
                this.element.DoubleAwardPopup.close();
            }
            console.log('showDoubleAward', _show);
        }
        ShowGameAward(_data) {
            console.log('ShowGameAward', _data);
            this.element.GameAward.SetInfo(_data);
            this.element.GameAward.Show();
        }
        ShowStartHint(_show) {
            if (_show == this.element.gameStartHint.visible) {
                return;
            }
            this.element.gameStartHint.visible = _show;
        }
        ShowMergeExternAward(_awardScore) {
            GameLogic.PauseGame(true);
            this.element.MergeExternAward.SetInfo({ score: _awardScore });
            this.element.MergeExternAward.Show();
        }
        ShowSurpassHint(_surpassPercent) {
            console.log('显示超越榜', _surpassPercent);
            this.element.SurpassHint.SetInfo({ percent: _surpassPercent });
            this.element.SurpassHint.Show();
        }
        AutoShowSurpassHint(_curscore) {
            let _show = false;
            while (this.surpassLevel < this.SurpassLevelInfo.length) {
                let _info = this.SurpassLevelInfo[this.surpassLevel];
                if (_curscore < _info.score) {
                    break;
                }
                _show = true;
                this.surpassLevel++;
            }
            if (_show) {
                this.element.SurpassHint.SetInfo({ percent: this.SurpassLevelInfo[this.surpassLevel - 1].percent });
                this.element.SurpassHint.Show();
            }
        }
        HideFlyTask() {
            this.element.gameFlyTaskBtn.visible = false;
            this.main.getTransition("flyTask").stop();
        }
        ShowFlyTask() {
            if (this.element.gameFlyTaskBtn.visible) {
                return;
            }
            this.element.gameFlyTaskBtn.visible = true;
            let _fly = this.main.getTransition("flyTask");
            _fly.timeScale = 0.8;
            _fly.play((Laya.Handler.create(this, () => {
                this.HideFlyTask();
            })));
        }
    }

    class MyGameScene extends Laya.Script {
        constructor() {
            super();
            this.fruitParent = null;
            this.fruitPrefab = null;
            this.juiceParent = null;
            this.juicePrefab = null;
            this.topLine = null;
            this.bottomLine = null;
            this.bgImage = null;
            this.fruitCount = 0;
            this.curTouchX = -1;
            this.curDetectFruitId = -1;
            this.loopTopY = 2000;
            this.curTopY = 0;
            this.touchID = -1;
            this.curFruit = null;
            this.bookNextFruit = 0;
        }
        onEnable() {
            this.changeSkin();
            Fruit.SetPrefab(this.fruitPrefab, this.fruitParent);
            Juice.SetPrefab(this.juicePrefab, this.juiceParent);
            Laya.stage.on("sameContact", this, this.onSameFruitContact);
            GameLogic.myGameScene = this;
            FGUIUtil.ShowScene(GameScene);
        }
        onDisable() {
            Laya.stage.offAllCaller(this);
            this.clearAll();
            GameLogic.myGameScene = null;
        }
        changeSkin() {
            ModuleSkins.ChangeSkin(this.bgImage, 'gameBgImage');
        }
        clearAll() {
            this.fruitCount = 0;
            Laya.timer.clearAll(this);
            Fruit.DestoryAll();
            Juice.DestoryAll();
        }
        GameStart() {
            this.touchID = -1;
            this.curTopY = 0;
            this.clearAll();
            console.log('MyGameScene GameStart');
            Laya.timer.once(300, this, this.ShowFruit);
            Laya.timer.loop(2000, this, this.fruitUpdate);
            this.curDetectFruitId = -1;
            Laya.timer.frameLoop(1, this, this.fruitTopUpdate);
            if (this.topLine.visible) {
                Laya.Tween.clearAll(this.topLine);
                this.topLine.visible = false;
                this.topLine.alpha = 1;
            }
            GameLogic.gameFruitValidY.bottom = this.bottomLine.y;
            GameLogic.gameFruitValidY.top = this.topLine.y;
        }
        GameRevive() {
            this.touchID = -1;
            this.curTopY = 0;
            Laya.timer.loop(2000, this, this.fruitUpdate);
            this.curDetectFruitId = -1;
            Laya.timer.frameLoop(1, this, this.fruitTopUpdate);
            console.log('MyGameScene GameRevive');
            let _removeFruit = [];
            for (const fruit of Fruit.allItems) {
                if (fruit.node.y < 600 && fruit.collisionState) {
                    _removeFruit.push(fruit);
                }
            }
            while (_removeFruit.length > 0) {
                let fruit = _removeFruit.pop();
                fruit.RemoveSelf();
            }
            Laya.timer.once(300, this, this.ShowFruit);
        }
        GameOver() {
            Laya.timer.clear(this, this.fruitUpdate);
            Laya.timer.clear(this, this.fruitTopUpdate);
        }
        fruitUpdate() {
            if (this.curTopY > 0) {
                GameLogic.fruitTopY = this.curTopY;
                this.curTopY = 0;
            }
            if (GameLogic.fruitTopY <= this.topLine.y) {
                GameLogic.GameOver();
                return;
            }
            if (GameLogic.fruitTopY < 550) {
                if (!this.topLine.visible) {
                    this.topLine.visible = true;
                    this.topLine.alpha = 1;
                    let _fadeOut = () => {
                        Laya.Tween.to(this.topLine, { alpha: 0 }, 1000, undefined, Laya.Handler.create(this, () => {
                            Laya.Tween.to(this.topLine, {}, 500, undefined, Laya.Handler.create(this, () => {
                                Laya.Tween.to(this.topLine, { alpha: 1 }, 1000, undefined, Laya.Handler.create(this, _fadeOut));
                            }));
                        }));
                    };
                    _fadeOut();
                }
            }
            else {
                if (this.topLine.visible) {
                    Laya.Tween.clearAll(this.topLine);
                    this.topLine.visible = false;
                    this.topLine.alpha = 1;
                }
            }
        }
        fruitTopUpdate() {
            if (Fruit.allItems.length <= 0) {
                return;
            }
            let _detect = () => {
                if (this.curDetectFruitId < 0 || this.curDetectFruitId >= Fruit.allItems.length) {
                    if (this.curDetectFruitId >= 0) {
                        if (this.curTopY < this.loopTopY) {
                            this.curTopY = this.loopTopY;
                        }
                    }
                    this.curDetectFruitId = 0;
                    this.loopTopY = 2000;
                }
                let _fruit = Fruit.allItems[this.curDetectFruitId];
                if (!_fruit.collisionState || !_fruit.isContacted) {
                    return;
                }
                let _y = _fruit.GetTopY();
                if (this.loopTopY > _y) {
                    this.loopTopY = _y;
                }
                this.curDetectFruitId++;
            };
            let _time = Fruit.allItems.length > 10 ? 1 : 3;
            while (_time > 0) {
                _detect();
                _time--;
            }
        }
        onStageMouseDown(e) {
            Laya.timer.frameOnce(1, this, () => {
                this.touchID = e.touchId;
                this.onStageMouseMove(e);
            });
        }
        onStageMouseMove(e) {
            Laya.timer.frameOnce(1, this, () => {
                if (!GameLogic.IsGameTouchEnable()) {
                    return;
                }
                if (GameLogic.gameState != 2 || e.stageY < 150 || GameLogic.isPause) {
                    return;
                }
                if (e && e.stageX < 10 || e.stageX > Laya.stage.width - 10) {
                    return;
                }
                this.curTouchX = e.stageX;
                if (this.curFruit) {
                    this.curFruit.SetMoveTarget(e.stageX);
                }
            });
        }
        onStageMouseUp(e) {
            Laya.timer.frameOnce(1, this, () => {
                this.touchID = -1;
                if (!GameLogic.IsGameTouchEnable()) {
                    return;
                }
                if (GameLogic.gameState != 2 || e.stageY < 150 || GameLogic.isPause) {
                    return;
                }
                this.curTouchX = -1;
                if (this.curFruit) {
                    let _fruit = this.curFruit;
                    this.curFruit.StartDown(e.stageX, () => {
                        GameLogic.comboTime = 0;
                        _fruit.EnableCollision(true);
                        Laya.timer.once(1000, this, this.ShowFruit);
                    });
                    GameLogic.ShowStartHint(false);
                    this.curFruit = null;
                }
            });
        }
        ShowFruit() {
            if (this.curFruit) {
                return;
            }
            this.curFruit = Fruit.Create({ x: 375, y: 150, kind: this.getNextFruitId() });
            this.curFruit.EnableCollision(false);
            this.bookNextFruit = 0;
            this.fruitCount++;
        }
        onSameFruitContact(_data) {
            if (GameLogic.gameState != 2) {
                return;
            }
            let _getcurkind = -1;
            if (typeof _data.self.myInfo.kind == 'number') {
                _getcurkind = _data.self.myInfo.kind;
            }
            else if (typeof _data.other.myInfo.kind == 'number') {
                _getcurkind = _data.other.myInfo.kind;
            }
            if (_getcurkind <= 0) {
                console.error('没有获取到可以合并的水果');
                return;
            }
            let _kind = _getcurkind + 1;
            if (_kind <= GameLogic.maxFruitKind) {
                let _moveFruit = _data.other;
                let _standFruit = _data.self;
                if (_standFruit.myid > _moveFruit.myid) {
                    let _mf = _moveFruit;
                    _moveFruit = _standFruit;
                    _standFruit = _mf;
                }
                _moveFruit.EnableCollision(false);
                const time = 200;
                let _x = _standFruit.node.x;
                let _y = _standFruit.node.y;
                let _audio = 'mergeNew';
                if (_kind <= GameLogic.curTopKind) {
                    _audio = Math.random() > 0.5 ? 'merge' : 'merge2';
                }
                HHAudio.PlayEffect(_audio);
                Laya.Tween.to(_moveFruit.node, { scaleX: 0.2, scaleY: 0.2, x: _x, y: _y }, time, Laya.Ease.sineIn, Laya.Handler.create(this, function () {
                    _moveFruit.RemoveSelf();
                    _standFruit.RemoveSelf();
                    let _addscore = GameLogic.AddScoreByKind(_kind);
                    GameLogic.GetGameAward(_kind);
                    GameLogic.ShowGetScoreEffect({ score: _addscore, pos: [_x + 50, _y - 30] });
                    let _fruit = Fruit.Create({ x: _x, y: _y, kind: _kind });
                    _fruit.EnableCollision(true);
                    _fruit.scaleAction();
                    Juice.Create({ x: _x, y: _y, kind: _kind - 1, width: _fruit.node.width });
                    GameLogic.comboTime++;
                    if (GameLogic.comboTime > 1) {
                        GameLogic.ShowComboEffect(GameLogic.comboTime);
                        GameLogic.AddCurScore(GameLogic.comboTime);
                    }
                }));
            }
        }
        getNextFruitId() {
            if (this.bookNextFruit) {
                return this.bookNextFruit;
            }
            let _frs = [];
            if (this.fruitCount < 3) {
                return 1;
            }
            else if (this.fruitCount === 3) {
                return 2;
            }
            else {
                if (GameLogic.curTopKind < 5) {
                    _frs = [25, 45, 25, 5];
                }
                else if (GameLogic.curTopKind < 9) {
                    _frs = [5, 30, 35, 20, 10];
                }
                else {
                    _frs = [3, 10, 52, 25, 10];
                }
            }
            let _max = 0;
            for (const _r of _frs) {
                _max += _r;
            }
            let _rn = Math.random() * _max;
            let _idx = 0;
            for (const _r of _frs) {
                if (_rn < _r) {
                    break;
                }
                _rn -= _r;
                _idx++;
            }
            return _idx + 1;
        }
        removeFruitBelowLevel(_level) {
            let _removeFruits = Fruit.allItems.filter(v => {
                if (!v.collisionState) {
                    return false;
                }
                let _r = typeof v.myInfo.kind == 'number' && v.myInfo.kind < _level;
                return _r;
            });
            this.clearTagetFruit(_removeFruits);
        }
        clearTagetFruit(_removeFruits) {
            let i = 0;
            let doRemoveFruit = function (index) {
                if (index >= _removeFruits.length) {
                    return;
                }
                let fruit = _removeFruits[index];
                HHAudio.PlayEffect("propClear");
                fruit.EnableCollision(false);
                Juice.Create({ x: fruit.node.x, y: fruit.node.y, kind: fruit.myInfo.kind, width: fruit.node.width });
                Laya.Tween.to(fruit.node, { scaleX: 0, scaleY: 0 }, 100, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
                    fruit.RemoveSelf();
                    doRemoveFruit(++i);
                }));
            };
            doRemoveFruit(i);
        }
        clearFruitYExceed(_y) {
            let _removeFruits = Fruit.allItems.filter(v => {
                if (!v.collisionState) {
                    return false;
                }
                console.log('clearFruitYExceed', v.GetTopY(), _y);
                let _r = v.GetTopY() > _y;
                return _r;
            });
            this.clearTagetFruit(_removeFruits);
        }
        GetASupperFruit() {
            if (this.curFruit) {
                this.curFruit.ResetFruitKind('supper');
            }
            else {
                this.bookNextFruit = 'supper';
            }
        }
    }

    class GameConfig$1 {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("loadingScene.ts", LoadingUI);
            reg("Game/MyGameScene.ts", MyGameScene);
            reg("Game/Fruit.ts", Fruit);
            reg("Game/Juice.ts", Juice);
        }
    }
    GameConfig$1.width = 750;
    GameConfig$1.height = 1334;
    GameConfig$1.scaleMode = "fixedwidth";
    GameConfig$1.screenMode = "vertical";
    GameConfig$1.alignV = "top";
    GameConfig$1.alignH = "left";
    GameConfig$1.startScene = "loadingScene.scene";
    GameConfig$1.sceneRoot = "";
    GameConfig$1.debug = false;
    GameConfig$1.stat = false;
    GameConfig$1.physicsDebug = false;
    GameConfig$1.exportSceneToJson = true;
    GameConfig$1.init();

    class Main {
        constructor() {
            Laya.init(GameConfig$1.width, GameConfig$1.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig$1.scaleMode;
            Laya.stage.screenMode = GameConfig$1.screenMode;
            Laya.stage.alignV = GameConfig$1.alignV;
            Laya.stage.alignH = GameConfig$1.alignH;
            Laya.URL.exportSceneToJson = GameConfig$1.exportSceneToJson;
            if (GameConfig$1.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig$1.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig$1.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            Global.SetupEngine();
            ModuleStatistics.Init(Global.hallConfig._version);
            GameConfig$1.startScene && Laya.Scene.open(GameConfig$1.startScene);
            fairygui.UIConfig.packageFileExtension = "txt";
        }
        changeScene() {
            GameConfig$1.startScene && Laya.Scene.open(GameConfig$1.startScene);
        }
    }
    new Main();

}());


/**
 * 声音配置文件
 * 所有用到的声音列表
 */
export let AudioPath = {
    // bg: "Audio/bg.mp3",
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
}
export let AudioLevel = {
    // bg: "Audio/bg.mp3",
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
}
//cdn路径，放在本地则填 ''
//地址必须使用 'https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/'
//不能使用 'https://oss.ixald.com/'
export let AudioCDNPath = 'https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/' + 'BigWatermelon/normal/C_client/';
// export let AudioCDNPath = '';
export type AudioKey = keyof (typeof AudioPath);


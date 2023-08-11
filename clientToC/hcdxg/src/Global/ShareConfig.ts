/**
import { type } from './DataConfig';
 * 分享配置文件
 */
export const ShareBathPath = 'https://oss.ixald.com/Cattle/share/';
// export const testShareImage = ['share_normal.png', 'share_challenge.png', 'share_exceed.png', 'share_help.png', 'share_taunt.png']
export const ShareConfig = {
    Image: {
        normal: [
            // { title: '这个时代拼什么？拼个动物园！', image: 'share_normal.png' },
            // { title: '这个时代拼什么？拼个动物园！', image: 'share_normal2.png' },
            // { title: '干完饭我就去！！拼个动物园！', image: 'share_normal3.png' }
            { title: '奔跑吧~金牛飞奔贺新春！', image: 'share_normal1.png' }
        ],
        // flaunt: [{ title: '来试试你配做我的对手吗？', image: 'share_exceed2.png' }],
        // help: [
        //     // { title: '需要你的时候到了！', image: 'share_help.png' },
        //     // { title: '该放哪里？快告诉我！', image: 'share_help2.png' },
        //     // { title: '这关太难了，请求火力支援！', image: 'share_help3.png' }
        //     { title: '这关太难了，能帮帮我么？', image: 'share_helpNY.png' }
        // ],
        // prophelp: [
        //     { title: '拼个动物园，消灭你的碎片时间！', image: 'share_helpProp.png' },
        //     { title: '爆炸之后~到底会出现什么？', image: 'share_helpProp2.png' },
        //     { title: '小动物们，等你来拼哦！！', image: 'share_helpProp3.png' }
        //     // { title: '叮咚~~你的圣诞小萌宠已送达', image: 'share_helpPropXmas.png' }
        // ],
        // unlockhelp: [
        //     { title: '大佬来玩啊，一局拼一个动物园！', image: 'share_unlock.png' },
        //     { title: '极度舒适的解压小游戏', image: 'share_unlock2.png' },
        //     { title: '不烧脑爽快过关！', image: 'share_unlock3.png' }
        //     // { title: '里面究竟暗藏着什么秘密??', image: 'share_unlockXmas.png' }
        // ],
    },
    Video: {
        normal: { title: '我常来这里消解压力', topics: ['拼个动物园'], query: `from=videoShare` },
    },
};
export type ShareImageType = keyof typeof ShareConfig.Image;

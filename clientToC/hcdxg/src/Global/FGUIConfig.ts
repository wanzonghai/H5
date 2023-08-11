
export const IsCDN = true;
/**
 * FGUI配置文件
 */
export const FGUIConfig = {
    /*  fgui资源所在cdn的路径,
        实际cdn路径为 CDNBasePath+resBase
        例如："https://oss.ixald.com/Cattle/Laya/bin/res/FFGUI/"
    */
    CDNBasePath: "https://xiaoailingdong.oss-cn-shenzhen.aliyuncs.com/BigWatermelon/normal/C_client/" + 'v16/',

    //本地资源路径 (bin下)
    resBase: 'res/FGUI/',

    //文件后缀格式(默认fui,但是小游戏不支持，所以使用其他自定义格式)
    FileExtension: 'txt',

    /*资源包  
    包名:{
        isCDN是否是cdn远程资源,
        ImageN:包相关图片（包同名图片,png格式）数量,
        aloneImages:单独导出的纹理集名
    }*/
    Pakages: {
        // StartScene: { isCDN: false, ImageN: 1 ,aloneImages:[], class: StartScene},
        GameCommon: { isCDN: IsCDN, ImageN: 2 },

        StartScene: { isCDN: IsCDN, ImageN: 1, aloneImages: ['StartScene_atlas_9ffy16.png'] },

        GameScene: { isCDN: IsCDN, ImageN: 2 },

        // EditorScene: { isCDN: false, ImageN: 1 },
    },
};
export type PkgNameType = keyof typeof FGUIConfig.Pakages;

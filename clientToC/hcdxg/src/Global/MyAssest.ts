/**
 * 可加载场景
 * isBundle 此场景是否是bundle内场景（需要场景名和bundle名一致）（creator用到）
 */
export let SceneParamsMap = {
    // helloworld: { isBundle: false },
    // NewHomeScene: NewHomeSceneParams,
    startScene: { isBundle: false },
    MyGameScene: { isBundle: false },
    // EditorScene: { isBundle: false },
};
export type SceneName = keyof typeof SceneParamsMap;
/**
 * 可自动加载层
 */
enum BundleLayersMap {
}
// let LayersMap = {
//     LayerTest: {}
// }
export type BundleLayerName = keyof typeof BundleLayersMap;
/**
 * 可自动加载预制体内存池
 */
enum BundlePoolsMap {
}
// let LayersMap = {
//     LayerTest: {}
// }
export type BundlePoolName = keyof typeof BundlePoolsMap;

export default class MyAssest {

}
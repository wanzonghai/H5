
/**
 * 每日限制
 */
// export interface DailyLimitType {
//     key: string,
//     limit: number
// }
export const DailyLimitConfig = {
    // //清屏道具
    // PropClear: 5,
    // shareContinue: 1,
}
export type DailyLimitType = keyof typeof DailyLimitConfig;
import TimeUtil from './TimeUtil';
export default class RetryUtil {

    /**
     * 重试，直到成功
     * @param func 
     * @param maxTryTimes 
     * @param options
     * @return 最终成功了吗 
     */
    static async retry(func: () => Promise<any>, maxTryTimes: number, options: {
        onFail?: (e: Error, triedTimes: number) => void | Promise<void>,
        // 间隔时间
        interval?: number
    } = {}) {
        let lastError: Error;
        for (let i = 0; i < maxTryTimes; ++i) {
            try {
                await func();
                return;
            }
            catch (e) {
                lastError = e;
                options.onFail && options.onFail(e, i + 1);
                options.interval && await TimeUtil.wait(options.interval);
            }
        }

        throw lastError!;
    }

}
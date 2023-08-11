import { TaskInfo, TaskType } from "./TaskLogic";

export interface SendNetType {
    netPort: String,
    sendData?: any
}
/**
 * 任务逻辑实现基类
 * 所有的具体任务需要继承此类
 * 暂未实现
 */
export default abstract class DoTask_Base {



    MyType: TaskType = null as any;

    private _myInfo?: TaskInfo;
    constructor(_type: TaskType) {
        this.init(_type);
    }
    /**
     * 初始化
     * 这里获取任务的初始数据做自己的初始操作
     */
    protected init(_type: TaskType) {
        this.MyType = _type;
    }
    //--------------------设置我的数据信息-------------------------//
    set MyInfo(_info: TaskInfo) {
        this._myInfo = _info;
    }
    /**
     * 任务信息
     * 如果没有任务信息说明后端没有配置此任务
     * 此时只能做任务，上报和领取奖励都是失败
     */
    get MyInfo() {
        return this._myInfo;
    }
    //-----------------------做任务----------------------------//
    /**
     * 去做任务
     * @param _callBack 
     */
    DoTask(_callBack: (_success: boolean, otherInfo?: any) => void) {
        console.error('未实现此任务:', this.MyType);
        _callBack(false);

    }

    /**
     * 上报任务进度
     * @returns 
     */
    ReportTask(): {
        netPort: String,
        sendData?: any
    } | boolean {
        //没有任务信息
        if (!this.MyInfo) {
            return false;
        }
        return {
            netPort: '/C/task/taskReport',
            sendData: { detailType: this.MyType }
        };
    }
    /**
     * 获取任务奖励
     * @returns 
     */
    ReceiveTaskAward() {
        //没有任务信息
        if (!this.MyInfo) {
            return false;
        }
        return {
            netPort: '/C/task/getTaskPrize',
            sendData: { detailType: this.MyType }
        }
    }
    /**
     * 获取前置任务
     * @returns 有则返回前置任务类型，否则返回null
     */
    GetPreTask(): TaskType | null {
        if (!this.MyInfo) {
            return null;
        }
        if (this.MyInfo.giftParams) {
            return this.MyInfo.giftParams;
        }
        return null;
    }
    /**
     * 触发等待结果判断
     */
    TriggerWaitResult() {

    }
    /**
     * 监听相关事件
     * @param _type 
     */
    ListenEvent(_type: 'onShow' | 'onHide') {

    }


}
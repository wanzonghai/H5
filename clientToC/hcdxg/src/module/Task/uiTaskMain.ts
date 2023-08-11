/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
import { ModuleAudio } from '../ModuleTool';
import ModuleWindow from '../ModuleWindow';
import UI_Main from './Task/UI_Main';
import { TaskInfo, TaskLogic, TaskStatusType } from './TaskLogic';
import uitaskItem from './uitaskItem';

export default class uiTaskMain extends UI_Main {

    private _winHandler: ModuleWindow;

    private curTaskList: TaskInfo[] = [];
    protected onConstruct(): void {

        super.onConstruct();
        console.error('uiTaskMain onConstruct', fgui.GRoot.inst);

        // console.log('onConstructonConstruct');


        // this.onStart();
    }
    /**
     * 初始化方法，由于不能多继承，重载基类的这个方法来完成Init，和Init一样正常这个方法也是只会调用一次。
     * 另，这个方法不能传参，暂时由data来传递窗口的handler
     */
    makeFullScreen(): void {

        super.makeFullScreen();	//先处理全屏
        //对齐全屏下的位置
        let _anchorX = 0;
        let _anchorY = 0;
        if (this.pivotAsAnchor) {
            _anchorX = this.pivotX;
            _anchorY = this.pivotY;
        }
        this.setXY(_anchorX * this.width, _anchorY * this.height);


        //初始化
        this._winHandler = this.data as ModuleWindow;

        this.data = null;

        if (this._winHandler != null) {
            this.onStart();
            //设置显示监听，用于窗口关闭时的本类数据清理。
            this._winHandler.SetShowCallBack(this, this.onShow);
            //设置隐藏监听，用于窗口关闭时的本类数据清理。
            this._winHandler.SetHideCallBack(this, this.onHide);

            // this._LoadLastRankData();
            this.SetInfo();
        }

    }
    onStart() {
        console.log('onStartonStart');

    }
    onShow() {

        console.log('uiTaskMain onShow');

        // //MainUtil.analysis('clickExchange');
        // this.m_bg.visible = false;
        // ModuleTool.ActionPopIn(this, () => {
        //     this.m_bg.visible = true;
        // });
        // Laya.timer.once(1000, this._winHandler, this._winHandler.showModalWait);


        // TaskLogic.UpdateTaskList((_success, _data) => {
        //     Laya.timer.clear(this._winHandler, this._winHandler.showModalWait);
        //     this._winHandler.closeModalWait();
        //     if (!_success) {
        //         return;
        //     }
        //     //排序
        //     // this.curTaskList = JSON.parse(JSON.stringify(_data));
        //     this.curTaskList = _data;
        //     this.curTaskList = this.curTaskList.sort((a, b) => {
        //         if (a.status != b.status) {
        //             if (TaskStatusType.allow == a.status) {
        //                 return -1;
        //             }
        //             if (TaskStatusType.allow == b.status) {
        //                 return 1;
        //             }
        //             if (TaskStatusType.finish == a.status) {
        //                 return 1;
        //             }
        //             if (TaskStatusType.finish == b.status) {
        //                 return -1;
        //             }
        //         }
        //         return a.sortIndex - b.sortIndex;
        //     });

        //     console.log('uiTaskMain curTaskList', this.curTaskList.length, this.curTaskList);

        //     // this.m_list.numItems = this.curTaskList.length;

        //     //显示排行榜列表
        //     this.m_list.itemRenderer = Laya.Handler.create(this, this._OnRenderItem, null, false);

        //     this.m_list.setVirtual();

        //     this.m_list.numItems = this.curTaskList.length;


        // })

        // Laya.stage.event('refreshBubble');

    }

    SetInfo() {

        //显示排行榜列表



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

        // console.log('uiTaskMain curTaskList', this.curTaskList.length, this.curTaskList);
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
            const element = this.m_list.getChildAt(index) as uitaskItem;
            if (element && element.clearAll)
                element.clearAll();
        }

        Laya.stage.offAllCaller(this)
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);
    }

    private static curRenderID = 0;
    _OnRenderItem(_id: number, index: number, item: uitaskItem, _other: any) {
        // console.log("CreateListItem:---" + index, _id, item.visible, _other);

        if (item['isInited'] && item['isInited'] == index + 1) {
            //重复绘制不再更新信息
            return;
        }
        // console.log("CreateListItem:---22", index);
        item['isInited'] = index + 1;

        item.SetInfo(this.curTaskList[index], this._winHandler);

        //执行进入动画
        let _action = uiTaskMain.curRenderID == _id;
        item.visible = !_action;
        if (_action) {
            Laya.timer.once(index * 150, this, () => {
                // if(uiTaskMain.curRenderID != _id){
                //     return;
                // }
                item.visible = true;
                item.x = item.width;
                Laya.Tween.to(item, { x: 0 }, 200);
            })
        }
    }

}
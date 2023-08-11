

import TB from '../../../platform/TB';
import { CloudMessageType, HttpType, ServerConfig } from '../../ServerConfig';

class CloudUtil_C {

    // private xhr = null as any;
    private static instance: CloudUtil_C = null as any;
    static INS() {
        if (!this.instance) {
            this.instance = new CloudUtil_C();
            this.instance.init();
        }
        return this.instance;
    }
    private init() {
        // this.xhr = new XMLHttpRequest();
    }
    Connect<T extends CloudMessageType>(_port: T, _data: {
        sendData?: typeof ServerConfig.Cloud.Message[T]['SendData'],
        callBack?: (success: boolean, _getData?: typeof ServerConfig.Cloud.Message[T]['GetData'], code?: number) => void
    }) {

        let _message = ServerConfig.Cloud.Message[_port];
        if (!_data) {
            _data = {};
        }

        if (!Laya.Browser.onTBMiniGame) {
            _data.callBack && _data.callBack(true, _message.GetData, 0);
            return;
        }

        //添加 activeId

        if (ServerConfig.Cloud.EnableDebug) {
            this.detectType(_port, _data.sendData, _message['SendData'], '发送消息');
        }
        if (!_data.sendData) {
            _data.sendData = {};
        }
        _data.sendData['activeId'] = TB._activeId;
        if (ServerConfig.Cloud.EnableDebug) {
            console.log('发送数据', _port, _data.sendData);

        }
        // let _port1: string = _port;
        // if (_port1 in ServerConfig.Http.GetPort) {
        //     this.Get(ServerConfig.Http.GetPort[_port1], reqData as any, callback);
        // }
        // else {
        //     this.Post(ServerConfig.Http.PostPort[_port1], reqData, callback);
        // }
        // typeof ServerConfig.Cloud.Message[_port]

        let info = { "id": _message.ID, "data": _data.sendData };
        type _gettype = { code: number, message: string, data: typeof _message.GetData }
        //淘宝云函数暂时基于TB.ts
        TB.sendMsg(info, (buf: _gettype) => {
            if (buf.code == 0) {
                if (ServerConfig.Cloud.EnableDebug) {
                    console.log('接收数据', _port, buf);
                    this.detectType(_port, buf.data, _message['GetData'], '接收消息');
                }
                _data.callBack && _data.callBack(true, buf.data, buf.code);
            } else {
                console.error(`[云函数]消息{${_port},ID:${_message.ID}}获取失败:`, buf.message);
                _data.callBack && _data.callBack(false, null, buf.code);
            }

        });
    }
    /**
     * 检测数据类型
     * @param _port 数据名
     * @param _nD 实际数据
     * @param _oD 模型数据
     */
    private detectType(_port: string, _nD: any, _oD: any, otherInfo?: string) {
        let _nType = typeof _nD;//实际数据
        let _oType = typeof _oD;//模型数据
        if (_nType != _oType) {
            console.error('------------------------------')
            console.error('[云函数]检测到数据类型不符:', _port);
            console.error('模型数据类型:', _oType);
            console.error('实际数据类型:', _nType);
            if (otherInfo) {
                console.error('其他消息:', otherInfo);
            }
            console.error('------------------------------')

        }
        if (_oType == 'object') {
            let _isoDArray = Array.isArray(_oD);
            let _isnDArray = Array.isArray(_nD);
            if (_isoDArray != _isnDArray) {
                console.error('------------------------------')
                console.error('[云函数]检测到数据类型不符:', _port);
                console.error('模型数据类型是数组:', _isoDArray);
                console.error('实际数据类型是数组:', _isnDArray);
                if (otherInfo) {
                    console.error('其他消息:', otherInfo);
                }
                console.error('------------------------------')
                return;

            }
            for (const key in _oD) {

                if (!Object.prototype.hasOwnProperty.call(_nD, key)) {
                    if (!_isoDArray) {
                        console.error('------------------------------')
                        console.error('[云函数]数据错误:', _port);
                        console.error('实际数据中缺少字段:', key);
                        if (otherInfo) {
                            console.error('其他消息:', otherInfo);
                        }
                        console.error('------------------------------')
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
export let CloudUtil = CloudUtil_C.INS();

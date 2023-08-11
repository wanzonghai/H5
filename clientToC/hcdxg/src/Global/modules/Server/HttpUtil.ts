
import { Config } from '../../Config';
import Global from '../../Global';
import { HttpType, ServerConfig } from '../../ServerConfig';
class HttpUtil_C {

    private xhr = null as any;
    private static instance: HttpUtil_C = null as any;
    static INS() {
        if (!this.instance) {
            this.instance = new HttpUtil_C();
            this.instance.init();
        }
        return this.instance;
    }
    private init() {
        this.xhr = new XMLHttpRequest();
    }
    Connect<T extends HttpType>(_port: T, reqData?: string[] | Object, callback?: (_json: any) => void) {
        let _port1: string = _port;
        if (_port1 in ServerConfig.Http.GetPort) {
            this.Get(ServerConfig.Http.GetPort[_port1], reqData as any, callback);
        }
        else {
            this.Post(ServerConfig.Http.PostPort[_port1], reqData, callback);
        }
    }
    /**
     * Get请求
     * 速度快，不安全 
     * @param url 地址
     * @param reqData 请求的信息
     * @param callback 返回字段
     */
    private Get(url: string, reqData?: string[], callback?: (_json: any) => void) {
        // url += "?";
        // for (var item in reqData) {
        //     url += item + "=" + reqData[item] + "&";
        // }
        if (reqData && reqData.length > 0) {
            for (const _data of reqData) {
                url += '/' + _data;
            }
        }
        this.xhr.onreadystatechange = () => {
            if (this.xhr.readyState == 4) {
                if (this.xhr.status >= 200 && this.xhr.status < 400) {
                    var response = this.xhr.responseText;
                    // console.log("response", response)
                    if (response) {
                        var responseJson = JSON.parse(response);
                        callback(responseJson);
                    } else {
                        console.log("返回数据不存在")
                        callback(false);
                    }
                } else {
                    console.log("请求失败")
                    callback(false);
                }
            }
        };
        // console.log('url', ServerConfig.Http.IP + url);

        this.xhr.open("GET", ServerConfig.Http.IP + url, true);
        this.xhr.send();
    }
    /**
     * Post请求
     * 速度相对慢，安全性较好 
     * @param url 地址
     * @param reqData 请求的信息
     * @param callback 返回字段
     */
    private Post(url: string, reqData: Object, callback?: (_json: any) => void) {
        // console.log(url)
        // console.log(reqData)
        //1.拼接请求参数
        // var param = "";
        // for (var item in reqData) {
        //     param += item + "=" + reqData[item] + "&";
        // }
        //2.发起请求
        this.xhr.onreadystatechange = () => {
            if (this.xhr.readyState == 4) {
                if (this.xhr.status >= 200 && this.xhr.status < 400) {
                    var response = this.xhr.responseText;
                    // console.log(response)
                    if (response) {
                        var responseJson = JSON.parse(response);
                        callback && callback(responseJson);
                    } else {
                        console.log("返回数据不存在")
                        callback && callback(false);
                    }
                } else {
                    console.log("请求失败")
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
        // this.xhr.send(JSON.stringify(param));//param为字符串形式： "key=value"
        this.xhr.send(JSON.stringify(reqData));//reqData为json形式： "{key:value}"
        //请用真机或模拟器测试
    }

    // //切后台专用打点
    // static submitAction(action: string, data: any) {
    //     if (!Global.hhgame || !Global.hhgame.currentUser) {
    //         return;
    //     }
    //     let json = {
    //         "action": action,
    //         "data": data,
    //         "uid": Global.hhgame.currentUser._id,
    //         "__appId": Config.hhConfig.appid,
    //     }
    //     HttpUtil.Post("ActionPoint", json);
    // }

}
export let HttpUtil = HttpUtil_C.INS();

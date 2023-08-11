
import { HttpUtil } from './HttpUtil';
import { CloudUtil } from './CloudUtil';

export default class ServerAPI {
    //http接口
    static Http = HttpUtil;
    static Cloud = CloudUtil;
}
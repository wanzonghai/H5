import TB from "../platform/TB";

/**
 * 数据接口配置文件
 */
export const ServerConfig = {

    //------------------------------短链接----------------------------------//
    Http: {
        //服务器ip地址
        IP: "https://service.eroswift.com/",

        //get接口
        GetPort: {
            GameInfo: 'customs/game/config',
        },

        //post连接
        PostPort: {
            GamePostInfo: 'customs/game/config',
        },
    },

    //------------------------------长链接----------------------------------//
    Sorcket: {},

    //------------------------------云函数----------------------------------//
    Cloud: {
        //是否开启调试（开启调试会进行类型检验）
        EnableDebug: true,


        //所有消息实例
        Message:
        {
            //积分排行榜
            ScoreRank:
            {
                ID: 1014,//消息id

                SendData: undefined,//发送消息格式

                GetData://获得的消息格式(其中数据为云函数不生效时的测试数据)
                {
                    curPoint: 0,// 当前积分
                    curRank: 1,//当前排名（-1：未上榜）
                    list:
                        [
                            { nickName: '昵称昵称昵称昵称昵称1', point: 99999, headUrl: '' },
                            { nickName: '昵称2', point: 20, headUrl: '' },
                            { nickName: '昵称3', point: 30, headUrl: '' },
                            { nickName: '昵称4', point: 40, headUrl: '' },
                            { nickName: '昵称5', point: 50, headUrl: '' },
                            { nickName: '昵称6', point: 60, headUrl: '' },
                        ],//前50名玩家数据
                },
            },

            //积分排行榜
            Notice:
            {
                ID: 6002,//消息id

                //scene:场景 （startGame: 首页公告 endGame: 结算页公告）
                SendData: { scene: 'startGame' } as { scene: 'startGame' | 'endGame' },//发送消息格式

                GetData: {
                    scene: 'startGame',//场景
                    no: '', yes: '', //url地址
                    isBuyLuckyBag: true //是否已经购买过福袋
                },//获得的消息格式
            },

            //查询福袋订单状态
            CheckLuckyBagOrder:
            {
                ID: 8001,//消息id

                SendData: undefined,//发送消息格式

                GetData: {
                    price: 0,//场景
                    time: 0,//订单时间
                    record: {}, //订单信息
                },//获得的消息格式
            },

            //活动结束我的排名奖励
            GetRankReward:
            {
                ID: 8002,//消息id

                SendData: undefined,//发送消息格式

                GetData: {
                    curRank: 1,//当前排名
                    rewardType: 0,//奖品级别
                    title: "IQOO任一手机免单\n（限618期间支付订单）", //奖品名称
                    pic_url: "",
                    price: 0,
                },
                //获得的消息格式 code:0：活动结束已经上榜，-3：活动结束未上榜，其他不弹窗
            },

            //查询所有排名奖励
            GetRankAllReward:
            {
                ID: 8003,//消息id

                SendData: undefined,//发送消息格式

                GetData:
                    [
                        //获得的消息格式
                        {
                            price: '随便的价格',//当前排名
                            count: 0,//当前排名
                            rankNums: [1],//当前排名
                            id: 1,
                            type: 1,
                            pic_url: "",
                            title: "IQOO任一手机免单\n（限618期间支付订单）"
                        }, {
                            price: 2,//当前排名
                            count: 0,//当前排名
                            rankNums: [2, 3],//当前排名
                            id: 1,
                            type: 1,
                            pic_url: "",
                            title: "IQOO任一手机免单\n（限000期间支付订单）"
                        }
                    ],
            },

            //查询所有排名奖励
            GetActivityState:
            {
                ID: 1002,//消息id

                SendData: undefined,//发送消息格式

                GetData: {
                    state: 1,//state活动状态 0|1 | 2  ，0活动未开始，1活动进行中，2活动已结束
                },//获得的消息格式
            },

            //获取浏览新品商品信息
            BrowseNewInfo: {
                ID: 8004,//消息id

                SendData: undefined,//发送消息格式

                GetData: {
                    time: '2021-01-01 10:01:00',//活动开始时间
                    num_iid: '1',//商品id
                    title: '商品名',//商品名
                    price: '',//商品价格
                },//获得的消息格式
            },
        }
    }
    //-----------------------------------------------------------------------//

};
//-----------------------------http请求接口----------------------------//
export type GetType = keyof typeof ServerConfig.Http.GetPort;
export type PortType = keyof typeof ServerConfig.Http.PostPort;
export type HttpType = GetType | PortType;

//-----------------------------云函数请求接口----------------------------//
export type CloudMessageType = keyof typeof ServerConfig.Cloud.Message;

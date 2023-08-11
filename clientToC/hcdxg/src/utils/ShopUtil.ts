import { Global } from "../config/Global";
import PlayDataUtil from "../data/PlayDataUtil";

export default class ShopUtil extends Laya.Script {
    static shopList: any[];
    static limitList: any;

    static init() {
        this.shopList = [];
        this.limitList = [];
        //如果有商品的话，先添加商品序列
        //添加商品

        //获取所有角色数据
        let list = Global.ResourceManager.GetRes(Global.hallConfig.Jsons.baseConfig);
        for (let i = 0; i < list.length; i++) {
            const skin = list[i];
            let shop = {
                id: skin.id,
                type: 0,
                name: skin.name,
                speedAdd: skin.move_speed_markUp,
                timeAdd: skin.restTime_markUp,
                price: skin.price,
                getMode: skin.get_mode,
                limitDay: skin.limitDay,
                isTry: skin.isTry,
                order: skin.goods_order
            }
            
            this.shopList.push(shop);

            //限时皮肤列表
            if (skin.limitDay == 7) {
                this.limitList.push(skin.id);
            }
        }
        this.shopList.sort((a, b) => a.order - b.order);
    }

    static getList() {
        return this.shopList;
    }

    static getName(id) {
        let name = '神秘人';
        for (let i = 0; i < this.shopList.length; i++) {
            const role = this.shopList[i];
            if (role.id == id) {
                return role.name;
            }
        }
        return name
    }

    static getSpeed(id) {
        for (let i = 0; i < this.shopList.length; i++) {
            const role = this.shopList[i];
            if (role.id == id) {
                return role.speedAdd;
            }
        }
        return 1;
    }

    //重置限时皮肤
    static resetLimitSkin() {
        let roleArr = PlayDataUtil.data.myRoleIDArray;
        for (let i = 0; i < this.limitList.length; i++) {
            let idx = roleArr.indexOf(parseInt(this.limitList[i]));
            if (idx != -1) {
                if (parseInt(this.limitList[i]) == PlayDataUtil.data.curRoleID) {
                    //当前使用的是限时皮肤时，强制改为初始皮肤
                    PlayDataUtil.setData('curRoleID', 0);
                }
                roleArr.splice(idx, 1);
            }
        }
        PlayDataUtil.setData("myRoleIDArray", roleArr);
    }

    static getLimitDay(id) {
        for (let i = 0; i < this.shopList.length; i++) {
            const role = this.shopList[i];
            if (role.id == id) {
                return role.limitDay;
            }
        }

        return 0
    }

}
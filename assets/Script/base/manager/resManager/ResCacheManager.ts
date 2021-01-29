//记录加载资源的使用情况，在不使用时判断释放
//引擎加载的资源由引擎管理

import { ResItem } from "./ResItem";
const { ccclass } = cc._decorator;

@ccclass("ResCacheManager")
export class ResCacheManager {
  static resCaches = new Map();

  static getResData(url: string): any {
    let resItem = ResCacheManager.resCaches.get(url);
    if (resItem) {
      return resItem.res;
    } else {
      return null;
    }
  }

  /**
   *
   *
   * @param {string} url 路径
   * @param {*} type 类型
   * @param {*} res 加载的资源
   * @memberof ResCacheManager
   */
  static addRes(url: string, res: any) {
    let resItem = ResCacheManager.resCaches.get(url);
    if (resItem) {
      resItem.useCount++;
    } else {
      let resItem = new ResItem(url, res);
      ResCacheManager.resCaches.set(url, resItem);
    }
  }

  static delRes(url: string) {
    let resItem = ResCacheManager.resCaches.get(url);
    if (resItem && resItem.useCount > 0) {
      resItem.useCount--;
      if (resItem.useCount <= 0) {
        ResCacheManager.resCaches.delete(url);
        cc.resources.release(url);
      }
    } else {
      cc.error("ResCacheManager delRes null url=", url);
    }
  }

  static clear() {
    ResCacheManager.resCaches.clear();
  }
}

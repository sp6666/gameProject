/**
 * Prefab的实例对象管理，目标为减少instantiate的次数，复用Node
 *
 * 2020-1-19
 */

import { ResCacheManager } from "./ResCacheManager";

export type NodePoolCallback = (error: Error, nodePool: NodePool) => void;

export class NodePool {
  private _isReady: boolean = false;
  private _waterMark: number = 10;
  private _res: any = null;
  private _nodes: Array<cc.Node> = new Array<cc.Node>();

  public isReady() {
    return this._isReady;
  }

  /**
   * 初始化NodePool，可以传入prefab，或者传入url异步加载
   * 如果使用url来初始化，需要检查isReady，否则获取node会返回null
   * @param prefab
   * @param url
   */
  public init(node);
  public init(url: string, finishCallback: NodePoolCallback);
  public init() {
    let urlOrPrefab = arguments[0];
    var finishCallback = null;
    if (arguments.length == 2 && typeof arguments[1] == "function") {
      finishCallback = arguments[1];
    }

    if (urlOrPrefab instanceof cc.Prefab) {
      this._res = urlOrPrefab;
      ResCacheManager.addRes(urlOrPrefab.nativeUrl, this._res);
      this._isReady = true;
      if (finishCallback) {
        finishCallback(null, this);
      }
      return;
    } else if (typeof urlOrPrefab == "string") {
      cc.resources.load(
        urlOrPrefab,
        cc.Prefab,
        null,
        (error: Error, prefab: cc.Prefab) => {
          if (!error) {
            this._res = prefab;
            this._isReady = true;
            ResCacheManager.addRes(urlOrPrefab, prefab);
          }
          if (finishCallback) {
            finishCallback(error, this);
          }
        }
      );
      return;
    } else {
      this._res = urlOrPrefab;
      this._isReady = true;
      return;
    }
    cc.error(`NodePool init error ${arguments[0]}`);
  }

  /**
   * 获取或创建一个Prefab实例Node
   */
  public getNode(): cc.Node {
    if (!this.isReady) {
      return null;
    }

    for (let node of this._nodes) {
      if (node && cc.isValid(node) && !node.parent) {
        return node;
      }
    }

    let node = cc.instantiate(this._res);
    this._nodes.push(node);
    return node;
  }

  /**
   * 回收Node实例
   * @param node 要回收的Prefab实例,必须是池子里的node
   */
  public freeNode(node: cc.Node) {
    if (!node) {
      return;
    }

    let index = this._nodes.indexOf(node);
    if (index < 0) {
      cc.error("[ERROR] PrefabPool: freePrefab: no pool node");
      node.destroy();
      return;
    }

    if (!(node && cc.isValid(node))) {
      cc.error("[ERROR] PrefabPool: freePrefab: isValid node");
      this._nodes.splice(index, 0);
      return;
    }
    if (this._waterMark < this._nodes.length) {
      this._nodes.splice(index, 0);
      node.destroy();
    } else {
      node.removeFromParent(true);
    }
  }

  /**
   * 回收所有node
   */
  public freeAllNode() {
    let index = 0;
    for (let node of this._nodes) {
      if (!(node && cc.isValid(node))) {
        cc.error("[ERROR] PrefabPool: freePrefab: isValid node");
        this._nodes.splice(index, 0);
        continue;
      }
      if (this._waterMark < this._nodes.length) {
        this._nodes.splice(index, 0);
        node.destroy();
        continue;
      } else {
        node.removeFromParent(true);
      }
      index++;
    }
  }

  /**
   * 设置回收水位
   * @param waterMark 水位
   */
  public setWaterMark(waterMark: number) {
    this._waterMark = waterMark;
  }

  /**
   * 池子里的prefab是否都没有使用
   */
  public isUnused() {
    for (let node of this._nodes) {
      if (node.parent) {
        return true;
      }
    }

    return false;
  }

  /**
   * 清空prefab
   */
  public destroy() {
    // 清空节点、回收资源
    for (let node of this._nodes) {
      node.destroy();
    }

    this._nodes = [];
    if (typeof this._res == "string") {
      ResCacheManager.delRes(this._res);
    }
  }
}

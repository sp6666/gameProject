// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventMgr } from "../../../base/manager/EventManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RedDot extends cc.Component {
  @property([cc.String])
  binding: string[] = [];

  @property(cc.Sprite)
  sprite: cc.Sprite | null = null;

  private _isOnLoad = false;
  static _MAP: Map<string, Boolean> = new Map();

  onLoad() {
    this._isOnLoad = true;
    EventMgr.addEventListener("eventRedDot", this.updateData, this);
    this.updateData(null, null);
  }

  addBinding(strArr: string[]) {
    if (null != strArr) {
      let binding = this.binding;
      for (let e = 0; e < strArr.length; e++) {
        if (-1 != binding.indexOf(strArr[e])) {
          binding.push(strArr[e]);
        }
      }
      if (this._isOnLoad) {
        this.updateData(null, null);
      }
    }
  }

  updateData(str: string | null, t: string | null) {
    if (0 != this.binding.length) {
      let e = this.binding;

      if (null == t || -1 != e.indexOf(t)) {
        for (let i = e.length, n = 0; n < i; n++) {
          if (RedDot._MAP.get(e[n].toString())) {
            this.node.opacity = 255;
            this.sprite.node.opacity = 0;
            return;
          }
          this.node.opacity = 0;
          if (this.sprite) {
            this.sprite.node.opacity = 255;
          }
        }
      }
    } else this.node.opacity = 0;
  }

  onDestroy() {
    EventMgr.removeEventListener("eventRedDot", this.updateData, this);
  }

  static change(t: string, e: Boolean) {
    if (RedDot._MAP.get(t) != e) {
      RedDot._MAP.set(t, e);
      EventMgr.raiseEvent("eventRedDot", t);
    }
  }
  clearData() {
    RedDot._MAP.clear();
  }
}

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { dataManager } from "../../../base/manager/DataManager";
import MultiLabel from "../../../util/MultiLabel";

const { ccclass, property } = cc._decorator;

/**
 * 每个menuButton添加2个响应事件B
 */
@ccclass
export default class MenuList extends cc.Component {
  @property(MultiLabel)
  lblMain: MultiLabel = null;

  @property(cc.Node)
  nodeMenuList: cc.Node = null;

  @property(cc.Integer)
  menuIndex: number = 4;
  defaultStr: string;

  onLoad() {
    this.nodeMenuList.active = false;

    this.defaultStr = dataManager.GetTextById(322);

    this.showChoseMenu();
  }

  onClickTotalMenu() {
    this.nodeMenuList.active = !this.nodeMenuList.active;
    this.setDefaultIndex(this.menuIndex);

    this.updateMainLabel();
  }

  onClickMenu(com, data) {
    let children = this.nodeMenuList.children;

    this.setDefaultIndex(children.indexOf(com.target));

    this.nodeMenuList.active = !this.nodeMenuList.active;

    this.updateMainLabel();
  }

  updateMainLabel() {
    if (!this.nodeMenuList.active) {
      this.lblMain.string = this.nodeMenuList.getComponentsInChildren(
        MultiLabel
      )[this.menuIndex].string;
    }
  }

  setDefaultIndex(index) {
    this.menuIndex = index;
    this.showChoseMenu();
  }

  showChoseMenu() {
    let children = this.nodeMenuList.children;
    if (this.menuIndex < children.length) {
      for (let index = 0; index < children.length; index++) {
        children[index].children[0].opacity = index == this.menuIndex ? 255 : 0;
        children[index].children[1].color =
          index == this.menuIndex
            ? cc.color(110, 95, 40)
            : cc.color(165, 80, 94);
      }
    }
  }
}

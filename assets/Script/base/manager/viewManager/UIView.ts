// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { uiManager } from "./UIManager";

const { ccclass, property } = cc._decorator;

/** 界面展示类型 */
export enum UIShowTypes {
  UIFullScreen, // 全屏显示，全屏界面使用该选项可获得更高性能
  UIAddition, // 叠加显示，性能较差
  UISingle, // 单界面显示，只显示当前界面和背景界面，性能较好
}

/** 界面类型 */
export enum UILevel {
  BottomUI, // 最底层UI，游戏只存在一个，放在最底层
  CommonUI,
  TopUI, // 提示框
}

/** 自动释放配置 */
interface autoResInfo {
  url: string;
  use?: string;
  type: typeof cc.Asset;
}

@ccclass
export class UIView extends cc.Component {
  /** 屏蔽点击选项 在UIConf设置屏蔽点击*/
  // @property
  // preventTouch: boolean = true;
  /** 缓存选项 */
  @property
  cache: boolean = false;
  /** 界面显示类型 */
  @property({ type: cc.Enum(UIShowTypes) })
  showType: UIShowTypes = UIShowTypes.UIAddition;

  @property({ type: cc.Enum(UILevel) })
  uiLevel: UILevel = UILevel.CommonUI;

  /** 界面id */
  public UIid: number = 0;
  /** 该界面资源占用key */
  private useKey: string = null;
  /**  静态变量，用于区分相同界面的不同实例 */
  private static uiIndex: number = 0;

  /********************** UI的回调 ***********************/
  /**
   * 当界面被创建时回调，生命周期内只调用一次,优先于onLoad
   * @param args 可变参数
   */
  public init(...args): void {}

  /**
   * 当界面被打开时回调，每次调用Open时回调
   * @param fromUI 从哪个UI打开的
   * @param args 可变参数
   */
  public onOpen(fromUI: number, ...args): void {}

  /**
   * 每次界面Open动画播放完毕时回调
   */
  public onOpenAniOver(): void {}

  /**
   * 当界面被关闭时回调，每次调用Close时回调
   * 返回值会传递给下一个界面
   */
  public onClose(): any {}

  /**
   * 当界面被置顶时回调，Open时并不会回调该函数
   * @param preID 前一个ui
   * @param args 可变参数，
   */
  public onTop(preID: number, ...args): void {}

  public closeSelf() {
    if (this.uiLevel === UILevel.BottomUI) {
      return;
    }
    uiManager.close(uiManager.getUI(this.UIid));
  }

  //不自动释放prefab,加快打开界面速度
  releaseAutoRes() {}
}

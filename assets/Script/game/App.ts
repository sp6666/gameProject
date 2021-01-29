import { uiManager } from "../base/manager/viewManager/UIManager";
import { netManager } from "../base/network/NetManager";
import { NetNode } from "../base/network/NetNode";
import { WebSock } from "../base/network/WebSock";
import SysDef, { DebugMode } from "../util/SysDef";
import { gameFlowManager } from "./flow/GameFlowManager";
import { ZhiMengProtocol, netMsg } from "./netMsg/NetMsg";
import { UIConfig } from "./ui/UIConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class App extends cc.Component {
  @property({ type: cc.Enum(DebugMode) })
  DevMode: DebugMode = DebugMode.Dev;
  public onLoad() {
    SysDef.DebugMode = this.DevMode;

    uiManager.initUIConf(UIConfig);
    gameFlowManager.onload();
    let Node = new NetNode();
    Node.init(new WebSock(), new ZhiMengProtocol());
    netMsg.initHander(Node);
    netManager.setNetNode(Node);
  }

  public onEnable() {}
  public start() {}

  public update(dt) {
    gameFlowManager.update(dt);
  }
  public onDisable() {}
  public onDestroy() {
    netManager.close();
  }
}

export let app: App = new App();

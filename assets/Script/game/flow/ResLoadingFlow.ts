import GameFlow from "./GameFlow";
import { dataManager } from "../../base/manager/DataManager";

export default class ResLoadingFlow extends GameFlow {
  public EnterFlow() {
    var self = this;
    dataManager.onload();
  }

  public WaitFlow() {
    return this.waitStatus;
  }
}

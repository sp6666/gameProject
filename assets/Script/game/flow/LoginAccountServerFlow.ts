import GameFlow from "./GameFlow";
import { UIID, UILEVEL } from "../ui/UIConfig";
import { uiManager } from "../../base/manager/viewManager/UIManager";

export default class LoginAccountServerFlow extends GameFlow {
  public EnterFlow() {
    uiManager.open(UIID.UITips);
    uiManager.open(UIID.UILogin);
  }

  public WaitFlow() {
    return this.waitStatus;
  }
}

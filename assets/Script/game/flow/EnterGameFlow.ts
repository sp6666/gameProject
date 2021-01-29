import GameFlow from "./GameFlow";

export class test {
  text: string = "";
}
export default class EnterGameFlow extends GameFlow {
  public EnterFlow() {}

  public WaitFlow() {
    return this.waitStatus;
  }
}

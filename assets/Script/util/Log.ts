import SysDef from "./SysDef";

export class Log {
  public static log(...args) {
    var backLog = console.log || cc.log;
    if (!SysDef.DebugMode) {
      return;
    }
    backLog.apply(backLog, args);
  }
}

import { dataManager } from "../base/manager/DataManager";
import { uiManager } from "../base/manager/viewManager/UIManager";
import { ErrorCode } from "../game/netMsg/ErrorCode";
import { UIID } from "../game/ui/UIConfig";

export enum BoxStatus {
  Default = 0,
  Opened,
  CanOpen,
}

export default class Utils {
  public AccessToken: string = "";

  public showTips(msg: any) {
    /*if (TipsView.instance != null) {
      TipsView.instance.showTip(msg);
    } else {
      uiManager.open(UIID.UITips);
      TipsView.instance.showTip(msg);
    }*/
  }

  public showComingSoonTips() {
    this.showTips(dataManager.GetTextById(397));
  }

  public getGoldNumberStr(num: number) {
    var str = "";
    var a = num / 100000000;
    if (a >= 1) {
      str = (parseFloat(a.toFixed(1)) * 10) / 10 + dataManager.GetTextById(398);
    } else {
      a = num / 10000;
      if (a >= 1) {
        str =
          (parseFloat(a.toFixed(1)) * 10) / 10 + dataManager.GetTextById(399);
      } else {
        str += num;
      }
    }
    return str;
  }
  public eachBean(arrProxy: string | any[], func: string, data: any) {
    for (let n = 0, len = arrProxy.length; n < len; n++) {
      let proxy = arrProxy[n];
      if (func in proxy)
        try {
          proxy[func].apply(proxy, data);
        } catch (erro) {
          cc.error(
            "[FACADE]eachBean error: " +
              proxy.constructor.name +
              " " +
              erro.toString()
          );
        }
    }
  }

  public saveLocalData(key: string, value: string) {
    cc.sys.localStorage.setItem(key, value);
  }
  public getLocalData(key: string): string {
    let valueStr: string = "";
    if (cc.sys.localStorage.getItem(key))
      valueStr = cc.sys.localStorage.getItem(key);
    return valueStr;
  }

  public getRandomName(): string {
    let length: number = 0;
    for (let ever in dataManager.getNameData()) {
      length++;
    }
    let random1 = Math.ceil(Math.random() * length);
    let random2 = Math.ceil(Math.random() * length);
    return (
      dataManager.getNameData()[random1].first_name +
      dataManager.getNameData()[random2].second_name
    );
  }

  getRandomInt(min: number, max: number) {
    return min + Math.floor(Math.random() * (max + 1 - min));
  }

  formatMoney(num: number) {
    return null == num
      ? "0"
      : num < 1e5
      ? num.toString()
      : num < 1e8
      ? (num / 1e4).toFixed(2) + dataManager.GetTextById(290)
      : (num / 1e8).toFixed(2) + dataManager.GetTextById(291);
  }

  showNodeEffect(node: cc.Node, num: number, callBack = null) {
    if (null != node) {
      let aniCom = node.getComponent(cc.Animation);
      if (aniCom) {
        let clips = aniCom.getClips();
        -1 == num && (num = Math.floor(Math.random() * clips.length));
        -1 != num &&
          clips.length > 2 &&
          clips.length % 2 == 0 &&
          (num += 2 * Math.floor((Math.random() * clips.length) / 2));
        let ani = clips[num];
        ani && aniCom.play(ani.name);
        if (callBack) {
          aniCom.on(cc.Animation.EventType.FINISHED, callBack);
        }
      }
    }
  }

  deepClone(obj: { [x: string]: any }) {
    let newObj = obj instanceof Array ? [] : {};
    //obj属于基本数据类型,直接返回obj
    if (typeof obj !== "object") {
      return obj;
    } else {
      //obj属于数组或对象，遍历它们
      for (let i in obj) {
        newObj[i] =
          typeof obj[i] === "object" ? utils.deepClone(obj[i]) : obj[i];
      }
    }
    return newObj;
  }

  copyData(des: { [x: string]: any }, from: { [x: string]: any }) {
    if (null != from && null != des)
      if (des instanceof Array && from instanceof Array)
        this.copyList(des, from);
      else for (let o in from) des[o] = null != from[o] ? from[o] : des[o];
  }

  copyList(des: any[], from: any[], o = "id", check = false, n = "") {
    if (null != des && null != from)
      if (0 == from.length) des = from;
      else
        for (let l = 0; l < from.length; l++) {
          let r = false;
          for (let a = 0, r = false; a < des.length; a++) {
            if (
              null != des[a] &&
              null != from[l] &&
              des[a][o] &&
              from[l][o] &&
              des[a][o] == from[l][o]
            ) {
              check && des[a][n] < from[l][n] && (from[l]["isNew"] = true);
              this.copyData(des[a], from[l]);
              r = true;
            }
          }
          if (!r && null != from[l]) {
            from[l]["isNew"] = true;
            des.push(from[l]);
          }
        }
  }

  public getBoneIndex(name: string) {
    let index = 1;
    switch (name) {
      case "Ba_hair":
        index = -2;
        break;
      case "body":
        index = -1;
        break;

      case "socks":
        index = 2;
        break;

      case "shoes":
        index = 3;
        break;

      case "ershi3":
        index = 4;
        break;
      case "head":
        index = 5;
        break;

      case "xiashen":
        index = 6;
        break;
      case "r_arm":
        index = 7;
        break;
      case "shoushi":
        index = 8;
        break;
      case "shangshen":
        index = 9;
        break;

      case "guashi":
        index = 10;
        break;
      case "neck":
        index = 11;
        break;
      case "Mid_hair":
        index = 12;
        break;
      case "ershi2":
        index = 13;
        break;
      case "Fr_hair":
        index = 14;
        break;
      case "fashi":
        index = 15;
        break;
      case "handcarry":
        index = 16;
        break;

      case "R_clavicalis2":
        index = 17;
        break;
    }
    return index;
  }

  stringFormat(strBase: any, ...arg: {}[]) {
    let s = strBase;
    if (s) {
      for (let i = 0; i < arg.length; i++) {
        let reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arg[i]);
      }
    }
    return s;
  }

  stringFormatObject(strBase: string, obj: { [x: string]: any }) {
    if (strBase && obj) {
      for (let str in obj) {
        let reg = new RegExp("\\{" + str + "\\}", "gm");
        strBase = strBase.replace(reg, obj[str]);
      }
    }

    return strBase;
  }

  public showStringOneByOne(
    richTextNode: {
      unschedule: (arg0: () => void) => void;
      string: string;
      schedule: (
        arg0: () => void,
        arg1: number,
        arg2: number,
        arg3: number
      ) => void;
    },
    str: string = "",
    speed: number = 0.05,
    callback = null
  ) {
    const regex = /<.+?\/?>/g; // 匹配尖括号标签
    const matchArr = str.match(regex);
    const specialChar = "│";
    const replaceStr = str.replace(regex, specialChar); // 标签数组
    const textArr: string[] = replaceStr.split(specialChar); // 文字数组
    const strArr: string[] = []; // 存放处理过的文字数组
    let paraNum = 0; // 待替换参数个数
    for (let text of textArr) {
      // 非空字符替换成类似 $[0-n] 参数
      if (text !== "") {
        text = `$[${paraNum}]`;
        paraNum += 1;
      }
      strArr.push(text);
    }
    let templeStr: string = strArr.join(specialChar); // 数组转成待替换字符串
    for (let index = 0; index < textArr.length; index++) {
      // 转换代替换字符串之后, 删除文字数组多余空字符
      if (textArr[index] === "") {
        textArr.splice(index, 1);
        index = index - 1;
      }
    }
    while (templeStr.search(specialChar) !== -1) {
      // 数组转成的字符串原本 '特殊字符' 位置都是富文本标签的位置, 替换回标签
      if (matchArr[0]) {
        templeStr = templeStr.replace(specialChar, matchArr[0].toString());
        matchArr.splice(0, 1);
      } else {
        templeStr = templeStr.replace(specialChar, ""); // 空字符串替换,防止死循环
        console.warn("matchArr not enough");
      }
    }
    const lastStrArr: string[] = []; // 转换后富文本数组
    const arrayParm: string[] = new Array(paraNum).fill(""); // 替换参数数组
    for (let i = 0; i < textArr.length; i++) {
      for (const text of textArr[i]) {
        arrayParm[i] = arrayParm[i] + text;
        let replaceStr1 = templeStr;
        for (let index = 0; index < paraNum; index++) {
          replaceStr1 = replaceStr1.replace(`$[${index}]`, arrayParm[index]);
        }
        lastStrArr.push(replaceStr1);
      }
    }
    let lastStrIndex = 0;
    const func = () => {
      if (lastStrIndex >= lastStrArr.length) {
        richTextNode.unschedule(func);
        if (callback) callback();
        return;
      }
      richTextNode.string = lastStrArr[lastStrIndex];
      lastStrIndex += 1;
    };
    richTextNode.schedule(func, speed, cc.macro.REPEAT_FOREVER, 0);
  }
  bytesToInt(bytes: number[]) {
    let b3 = bytes[3] & 0xff;
    let b2 = bytes[2] & 0xff;
    let b1 = bytes[1] & 0xff;
    let b0 = bytes[0] & 0xff;
    return (b0 << 24) | (b1 << 16) | (b2 << 8) | b3;
  }
  intToByte4(i: number) {
    let targets = [];
    targets[3] = i & 0xff;
    targets[2] = (i >> 8) & 0xff;
    targets[1] = (i >> 16) & 0xff;
    targets[0] = (i >> 24) & 0xff;
    return targets;
  }

  byteToString(utf8Bytes: string | any[]) {
    let unicodeStr = "";
    for (let pos = 0; pos < utf8Bytes.length; ) {
      let flag = utf8Bytes[pos];
      let unicode = 0;
      if (flag >>> 7 === 0) {
        unicodeStr += String.fromCharCode(utf8Bytes[pos]);
        pos += 1;
      } else if ((flag & 0xfc) === 0xfc) {
        unicode = (utf8Bytes[pos] & 0x3) << 30;
        unicode |= (utf8Bytes[pos + 1] & 0x3f) << 24;
        unicode |= (utf8Bytes[pos + 2] & 0x3f) << 18;
        unicode |= (utf8Bytes[pos + 3] & 0x3f) << 12;
        unicode |= (utf8Bytes[pos + 4] & 0x3f) << 6;
        unicode |= utf8Bytes[pos + 5] & 0x3f;
        unicodeStr += String.fromCharCode(unicode);
        pos += 6;
      } else if ((flag & 0xf8) === 0xf8) {
        unicode = (utf8Bytes[pos] & 0x7) << 24;
        unicode |= (utf8Bytes[pos + 1] & 0x3f) << 18;
        unicode |= (utf8Bytes[pos + 2] & 0x3f) << 12;
        unicode |= (utf8Bytes[pos + 3] & 0x3f) << 6;
        unicode |= utf8Bytes[pos + 4] & 0x3f;
        unicodeStr += String.fromCharCode(unicode);
        pos += 5;
      } else if ((flag & 0xf0) === 0xf0) {
        unicode = (utf8Bytes[pos] & 0xf) << 18;
        unicode |= (utf8Bytes[pos + 1] & 0x3f) << 12;
        unicode |= (utf8Bytes[pos + 2] & 0x3f) << 6;
        unicode |= utf8Bytes[pos + 3] & 0x3f;
        unicodeStr += String.fromCharCode(unicode);
        pos += 4;
      } else if ((flag & 0xe0) === 0xe0) {
        unicode = (utf8Bytes[pos] & 0x1f) << 12;
        unicode |= (utf8Bytes[pos + 1] & 0x3f) << 6;
        unicode |= utf8Bytes[pos + 2] & 0x3f;
        unicodeStr += String.fromCharCode(unicode);
        pos += 3;
      } else if ((flag & 0xc0) === 0xc0) {
        //110
        unicode = (utf8Bytes[pos] & 0x3f) << 6;
        unicode |= utf8Bytes[pos + 1] & 0x3f;
        unicodeStr += String.fromCharCode(unicode);
        pos += 2;
      } else {
        unicodeStr += String.fromCharCode(utf8Bytes[pos]);
        pos += 1;
      }
    }
    return unicodeStr;
  }
  stringToBytes(str: string) {
    let bytes = new Array();

    let len: number, c: number;

    len = str.length;

    for (let i = 0; i < len; i++) {
      c = str.charCodeAt(i);

      if (c >= 0x010000 && c <= 0x10ffff) {
        bytes.push(((c >> 18) & 0x07) | 0xf0);

        bytes.push(((c >> 12) & 0x3f) | 0x80);

        bytes.push(((c >> 6) & 0x3f) | 0x80);

        bytes.push((c & 0x3f) | 0x80);
      } else if (c >= 0x000800 && c <= 0x00ffff) {
        bytes.push(((c >> 12) & 0x0f) | 0xe0);

        bytes.push(((c >> 6) & 0x3f) | 0x80);

        bytes.push((c & 0x3f) | 0x80);
      } else if (c >= 0x000080 && c <= 0x0007ff) {
        bytes.push(((c >> 6) & 0x1f) | 0xc0);

        bytes.push((c & 0x3f) | 0x80);
      } else {
        bytes.push(c & 0xff);
      }
    }

    return bytes;
  }
  CheckNetMsgErrorCode(errCode: number) {
    if (errCode == 0) {
      return true;
    }

    if (errCode == ErrorCode.ERR_PLAYER_NON_EXISTENT) {
      uiManager.open(UIID.UICreateRole);
      return;
    }
    var str = dataManager.GetTextById(Math.floor(errCode * 1000));

    if (!str || str === "") {
      str = errCode + "";
    }

    utils.showTips(str);
    return false;
  }

  getRotationTwoPoint(
    p1: { y: number; x: number },
    p2: { y: number; x: number }
  ) {
    let angle = Math.atan2(p1.y - p2.y, p2.x - p1.x); //弧度 -0.6435011087932844, 即 2*Math.PI - 0.6435011087932844
    return angle * (180 / Math.PI); //角度 -36.86989764584402，即360 - 36.86989764584402 = 323.13010235415598
  }

  showItemInfo(id: number) {
    uiManager.open(UIID.UIItemInfoView, { ID: id });
  }

  showItemUse(id: number) {
    utils.showTips(dataManager.GetTextById(397));
    //uiManager.open(UIID.UIItemUse, { ID: id });
  }

  showItemSell(id: number) {
    uiManager.open(UIID.UIItemSell, { ID: id });
  }

  /**
   * 因为richtext机制，道具图片在构建后才能显示
   *  @param itemID 消耗道具id
   * @param itemNum 消耗道具数量
   * @param content 消耗用途str
   * @param okCall 确认回调
   * @param cancelCall 取消回调
   * @param lblOK 确认str
   * @param lblCancel 取消str
   */
  showUseConfirmView(
    itemID: number,
    itemNum: any,
    content: string,
    okCall: any,
    cancelCall = null,
    lblOK: string = null,
    lblCancel: string = null
  ) {
    uiManager.open(UIID.UIConfirm, {
      content: content,
      itemID: itemID,
      itemNum: itemNum,
      okCall: okCall,
      cancelCall: cancelCall,
      lblOK: lblOK,
      lblCancel: lblCancel,
    });
  }

  /**
   *
   * @param content 提示
   * @param okCall 确认回调
   * @param cancelCall 取消回调
   * @param lblOK 确认str
   * @param lblCancel 取消str
   */
  showConfirmView(
    content: string,
    okCall: any,
    cancelCall = null,
    lblOK: string = null,
    lblCancel: string = null
  ) {
    uiManager.open(UIID.UIConfirm, {
      content: content,
      itemID: 0,
      itemNum: 0,
      contenUse: null,
      okCall: okCall,
      cancelCall: cancelCall,
      lblOK: lblOK,
      lblCancel: lblCancel,
    });
  }

  getDistance(start: cc.Vec3, end: cc.Vec3) {
    return Math.sqrt(
      (start.x - end.x) * (start.x - end.x) +
        (start.y - end.y) * (start.y - end.y)
    );
  }
}
export let utils: Utils = new Utils();

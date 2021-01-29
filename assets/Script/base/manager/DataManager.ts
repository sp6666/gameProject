import { gameFlowManager } from "../../game/flow/GameFlowManager";
import SysDef from "../../util/SysDef";
import { utils } from "../../util/Utils";

export default class DataManager {
  public allDates = null;

  private allProxy = [];

  private static instance: DataManager = null;
  systemProxy: any;
  public static getInstance(): DataManager {
    if (!this.instance) {
      this.instance = new DataManager();
    }
    return this.instance;
  }

  public onload() {
    this.initProxy();

    let self = this;
    cc.resources.load(
      SysDef.getJsonDataUrl(),
      cc.JsonAsset,
      (error, res: cc.JsonAsset) => {
        if (error != null) {
          return;
        }
        self.allDates = res.json;
        utils.eachBean(this.allProxy, "ctor", null);
        gameFlowManager.resLoadingFlow.waitStatus = true;
      }
    );
  }

  initProxy() {
    // this.playerProxy = new PlayerProxy();
    // this.skillProxy = new SkillProxy();
    // this.bagProxy = new BagProxy();
    // this.retinueProxy = new RetinueProxy();
    // this.battleRetinueProxy = new BattleRetinueProxy();
    // this.storyProxy = new StoryProxy();
    // this.clotheProxy = new ClotheProxy();
    // this.systemProxy = new SystemProxy();
    // this.buyCardProxy = new BuyCardProxy();
    // this.workshopProxy = new WorkshopProxy();
    // this.allProxy.push(this.playerProxy);
    // this.allProxy.push(this.skillProxy);
    // this.allProxy.push(this.bagProxy);
    // this.allProxy.push(this.retinueProxy);
    // this.allProxy.push(this.battleRetinueProxy);
    // this.allProxy.push(this.storyProxy);
    // this.allProxy.push(this.clotheProxy);
    // this.allProxy.push(this.systemProxy);
    // this.allProxy.push(this.buyCardProxy);
    // this.allProxy.push(this.workshopProxy);
  }

  clearData() {
    //释放
    utils.eachBean(this.allProxy, "clearData", null);

    this.allDates = null;
    this.allProxy = [];
  }

  public GetTextById(id: number, ...arg: {}[]) {
    if (!this.allDates) return id + "";
    if (this.allDates.text[id]) {
      if (arg.length > 0 && typeof arg[0] != "object") {
        return utils.stringFormat(this.allDates.text[id].text_cn, ...arg);
      } else if (arg.length === 1) {
        return utils.stringFormatObject(this.allDates.text[id].text_cn, arg[0]);
      }
      return this.allDates.text[id].text_cn;
    } else {
      return id + "";
    }
  }

  GetChineseTextByNum(num: number) {
    if (num === 0) {
      return this.GetTextById(375);
    } else if (num > 0 && num <= 10) {
      return this.GetTextById(360 + num);
    } else if (num > 10 && num < 100) {
      return this.GetTextById(370) + this.GetChineseTextByNum(num % 10);
    } else if (num >= 100 && num < 1000) {
      return (
        this.GetChineseTextByNum(Math.floor(num / 100)) +
        this.GetTextById(371) +
        this.GetChineseTextByNum(num % 100)
      );
    } else if (num >= 1000 && num < 10000) {
      return (
        this.GetChineseTextByNum(Math.floor(num / 1000)) +
        this.GetTextById(372) +
        this.GetChineseTextByNum(num % 1000)
      );
    } else if (num >= 10000 && num < 100000000) {
      return (
        this.GetChineseTextByNum(Math.floor(num / 10000)) +
        this.GetTextById(373) +
        this.GetChineseTextByNum(num % 10000)
      );
    } else if (num >= 100000000) {
      return (
        this.GetChineseTextByNum(Math.floor(num / 100000000)) +
        this.GetTextById(374) +
        this.GetChineseTextByNum(num % 100000000)
      );
    }
  }

  public getRetinueStatus(type) {
    return this.GetTextById(252 + type);
  }

  public getEffectSpineUrlByBuffId(id: number) {
    let data = this.allDates.skill_effect[id];
    if (data) {
      return this.getEffectSpineUrl(data.effectId);
    } else {
      return null;
    }
  }

  public getEffectSpineUrl(id: number) {
    if (this.allDates.effect[id]) {
      return this.allDates.effect[id].pic_name;
    } else {
      return null;
    }
  }

  public getHeroData() {
    return this.allDates.hero_info;
  }
  public getNpcData() {
    return this.allDates.npc_info;
  }
  public getNameData() {
    return this.allDates.name;
  }
  public getCreateRoleData() {
    return this.allDates.create_role;
  }
  public getRetinueSpineData() {
    return this.allDates.retinue_spine;
  }
  public getSpineData() {
    return this.allDates.spine;
  }
  public getAccessorieFirstTypeData() {
    return this.allDates.accessorie_first_type;
  }
  public getAccessorieSecondTypeData() {
    return this.allDates.accessorie_second_type;
  }
  public getAccessorieData() {
    return this.allDates.accessorie;
  }
  public getAccessorieBgData() {
    return this.allDates.accessorie_bg;
  }
  public getAccessorieStyleData() {
    return this.allDates.accessorie_style;
  }
  public getAccessorieTagData() {
    return this.allDates.accessorie_tag;
  }
  public getConfigData() {
    return this.allDates.config;
  }
  public getAudioData() {
    return this.allDates.audio;
  }
  public getSceneData() {
    return this.allDates.scene;
  }
  public getSpeakerData() {
    return this.allDates.speaker;
  }
  public getCounterData() {
    return this.allDates.counter;
  }
  public getOrderTaskData() {
    return this.allDates.order_task;
  }
  public getMainRoleLevelData() {
    return this.allDates.mainrole_level;
  }
  public getDropPkgData() {
    return this.allDates.drop_packet;
  }
}
export let dataManager: DataManager = DataManager.getInstance();

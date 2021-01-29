// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../util/MultiLabel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectMax extends cc.Component {
  @property(cc.Button)
  btnMax: cc.Button | null = null;
  @property(cc.Button)
  btnMin: cc.Button | null = null;
  @property(cc.Button)
  btnAdd: cc.Button | null = null;
  @property(cc.Button)
  btnSub: cc.Button | null = null;
  @property(MultiLabel)
  lblCount: MultiLabel | null = null;
  @property(cc.EditBox)
  editBox: cc.EditBox | null = null;

  _changeHandler: CallableFunction | undefined;
  _min = 0;
  _max = 0;
  _curNum = 0;
  _baseCount = 1;
  onLoad() {}

  /**
   *
   * @param min 最小值
   * @param max 最大值
   * @param curNum 当前值
   * @param _baseCount 倍数
   * @param changeHandler 回调
   */
  setStatus(
    min: number,
    max: number,
    curNum: number,
    _baseCount: number,
    changeHandler: CallableFunction | undefined
  ) {
    this._min = min;
    this._max = max;
    this._baseCount = _baseCount;

    this._changeHandler = changeHandler;

    this.updateCurNum(curNum);
  }
  /**
   * 返回当前数值
   */
  getCount(): number {
    return this._min + this._curNum * this._baseCount;
  }

  updateBtns() {
    this.lblCount &&
      (this.lblCount.string = this._min + this._curNum * this._baseCount + "");
    this.btnSub && (this.btnSub.interactable = this._curNum > this._min);
    this.btnMin && (this.btnMin.interactable = this._curNum > this._min);
    this.btnMax && (this.btnMax.interactable = this._curNum < this._max);
    this.btnAdd && (this.btnAdd.interactable = this._curNum < this._max);

    this._changeHandler && this._changeHandler();
  }

  updateCurNum(curNum: number) {
    this._curNum = curNum;

    if (this._curNum < this._min) {
      this._curNum = this._min;
    }

    if (this._curNum > this._max) {
      this._curNum = this._max;
    }
    this.updateBtns();
  }

  onTextChange() {
    if (this.editBox && this.lblCount) {
      this.lblCount.string = this.editBox.string;
    }
  }
  onTextDidEnd() {
    this.endEditing();
  }
  editingDidBegan() {
    if (this.lblCount) {
      this.lblCount.node.active = false;
    }
  }

  editingReturn() {
    this.endEditing();
  }
  endEditing() {
    if (
      !this.editBox ||
      this.editBox.string == "" ||
      this.editBox.string == null
    ) {
      if (this.lblCount) {
        this.lblCount.string = this._curNum + "";
      }
    } else {
      this._curNum = parseInt(this.editBox.string);
    }
    this.updateBtns();
    this.hideEditContent();
  }
  hideEditContent() {
    if (this.lblCount) {
      this.lblCount.node.active = true;
    }
    if (this.editBox) this.editBox.string = "";
  }

  onClickAdd() {
    this._curNum++;
    this._curNum = this._curNum < this._min ? this._min : this._curNum;
    this.updateBtns();
  }

  onClickSub() {
    this._curNum--;
    this._curNum = this._curNum < this._min ? this._min : this._curNum;
    this.updateBtns();
  }

  onClickMin() {
    this._curNum = this._min;
    this.updateBtns();
  }

  onClickMax() {
    this._curNum = this._max;
    this.updateBtns();
  }

  // update (dt) {}
}

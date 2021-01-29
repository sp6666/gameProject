// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpriteFrameArr extends cc.Component {
  //onLoad () {}

  @property([cc.SpriteFrame])
  allSpriteFrames: cc.SpriteFrame[] = [];

  private _index: number = 0;

  public set index(index: number) {
    this._index = index;
    let sprite = this.node.getComponent(cc.Sprite);
    if (sprite) {
      sprite.spriteFrame = this.allSpriteFrames[index];
    }
  }

  // update (dt) {}
}

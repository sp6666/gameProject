import { ResCacheManager } from "../../../base/manager/resManager/ResCacheManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UrlLoad extends cc.Component {
  //onLoad () {}

  private _res: string = "";
  private _url: string = "";
  private _animation: string = "idle";
  private _bRepeat: boolean = true;
  private _loadHandle: Function | null = null;
  private _target = null;

  public set animation(animation: string) {
    this._animation = animation;
  }

  public set bRepeat(repeat: boolean) {
    this._bRepeat = repeat;
  }

  public get url() {
    return this._url;
  }

  public set url(url: string) {
    if (this._url === url) {
      return;
    }
    this._url = url;
    this.onChangeUrl();
  }

  onChangeUrl() {
    let self = this,
      url = this._url;
    if (!url) {
      this.reset();
    } else {
      this.reset();

      if (this.node && self.node.getComponent(cc.Sprite)) {
        //替换sprite
        cc.resources.load(url, cc.SpriteFrame, function (
          err: Error | null,
          res?: any | null
        ) {
          if (null == err && null != res) {
            self._res = self._url = url;
            if (self.node) {
              let material = self.node.getComponent(cc.Sprite);
              if (material) {
                material.spriteFrame = res;
                ResCacheManager.addRes(url, res);
              }
            }
            if (self._target && self._loadHandle) {
              self._loadHandle.apply(self._target);
            }
          } else cc.error(JSON.stringify(err));
        });
      } else if (this.node && this.node.getComponent(sp.Skeleton)) {
        //替换spine
        let animation = this._animation;

        //替换spine
        cc.resources.load(url, sp.SkeletonData, function (
          err: Error | null,
          res?: any | null
        ) {
          if (err != null || null == res) {
            cc.error(JSON.stringify(err));
            return;
          }
          self._res = self._url = url;
          let spineCom = self.node.getComponent(sp.Skeleton);
          if (spineCom) {
            spineCom.skeletonData = res;
            ResCacheManager.addRes(url, res);
          }
          if (animation) {
            //这里直接调用会出现bug，延时一帧调用
            self.scheduleOnce(self.playAnimation, 0);
          }

          if (self._loadHandle) {
            self._loadHandle.apply(self._target);
          }
        });
      } else {
        //替换prefab
      }
    }
  }

  setAnimation(name: string, loop: boolean) {
    this.animation = name;
    this.bRepeat = loop;
  }

  playAnimation() {
    let animation = this._animation;
    let spineCom = this.node.getComponent(sp.Skeleton);
    if (animation && spineCom) {
      spineCom.setAnimation(0, animation, this._bRepeat);
    }
  }

  setCallBack(call: Function, target: any) {
    this._loadHandle = call;
    this._target = target;
  }

  reset() {
    if (null == this.node) return;
    let t = this.node.getComponent(cc.Sprite);
    if (null != t && null != t.spriteFrame) {
      t.spriteFrame = null;
      ResCacheManager.delRes(this._url);
    } else {
      let t = this.node.getComponent(sp.Skeleton);
      if (null != t && null != t.skeletonData) {
        t.skeletonData = null;
        ResCacheManager.delRes(this._url);
      } else {
        ResCacheManager.delRes(this._url);
      }
    }

    this._url = "";
    this.clearRes();
  }

  clearRes() {
    if (this._res) {
      this._res = "";
    }
  }

  onDestroy() {
    this._loadHandle = null;
    this._target = null;
    this.reset();
    this.clearRes();
  }

  // update (dt) {}
}

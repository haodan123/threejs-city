import { BaseModel } from '@/model/BaseModel'


// 游艇类
export class FlyBot extends BaseModel {
  init() {
    this.model.scale.set(100, 100, 100)
    this.model.rotation.set(0, 0, 0)
    //scene 和model都在baseModel类中设置了 直接调用就行
    this.scene.add(this.model)


  }
}
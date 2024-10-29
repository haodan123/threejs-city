import { BaseModel } from '@/model/BaseModel'
import * as THREE from 'three'


// 游艇类
export class Ship extends BaseModel {
  init() {
    //scene 和model都在baseModel类中设置了 直接调用就行
    this.scene.add(this.model)
  }
}

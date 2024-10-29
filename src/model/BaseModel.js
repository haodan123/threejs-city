import * as THREE from 'three'


// 基础模型的类

export class BaseModel {
  constructor(model, scene, camear, controls) {
    this.model = model//模型
    this.scene = scene //场景
    this.camear = camear //相机
    this.controls = controls //轨道控制器

    // 因为子类无需定义 constructor，所以没有地方调用 init 方法，因此在这里调用子类的 init
    this.init()//调用init
  }

}

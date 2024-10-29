// 城市水的类
import * as THREE from 'three'
import { Water } from 'three/addons/objects/Water.js';

export class CityWater {
  constructor(model, scene) {
    this.model = model //模型
    this.scene = scene //场景

    this.init()
  }
  init() {
    const modelGeo = this.model.geometry //老的水模型
    // 新的水模型
    this.model = new Water(
      modelGeo,
      {
        textureWidth: 512, // 水贴图的宽度
        textureHeight: 512, // 水贴图的高度（值越大细节越多）
        waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', (texture) => { // 水模型的法线贴图（不同像素点有不同反光效果）
          // 纹理图片 UV 环绕到目标物体身上的重复方式
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        sunDirection: new THREE.Vector3(), // 阳光方向
        sunColor: 0xffffff, // 阳光颜色
        waterColor: new THREE.Color("#1e90ff"), // 水颜色
        distortionScale: 4, // 水倒影分散度（值大越分散）
      }
    );
    this.model.rotation.x = - Math.PI / 2  // 默认模型是垂直于 x 轴，所以翻转
    // 添加到场景中
    this.scene.add(this.model)
  }
}


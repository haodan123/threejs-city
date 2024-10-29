import * as THREE from 'three'

// 火灾标记类
export class Fire {
  constructor(scene, center, size) {
    this.scene = scene
    this.center = center //建筑物中心点三维向量对象
    this.size = size //建筑物大小的三维向量对象
    this.init()
  }
  init() {

    const map = new THREE.TextureLoader().load("icon/fire.png");
    map.colorSpace = THREE.SRGBColorSpace //让纹理 颜色更好
    const material = new THREE.SpriteMaterial({ map: map });
    const sprite = new THREE.Sprite(material);
    // x就是中心的x . y是中心的y ,加上建筑高度的一半再加3 ,让精灵物体中心点不在建筑物顶点 ,再往上一点 .z就是中心的z
    sprite.position.set(this.center.x, this.center.y + this.size.y / 2 + 3, this.center.z)
    sprite.scale.set(10, 10, 10) //图标太小了 放大十倍

    this.scene.add(sprite);

  }
}

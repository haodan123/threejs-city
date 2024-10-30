// 火灾影响范围-球体标记类
import * as THREE from 'three'
export class FireBall {
  constructor(scene, center) {
    this.scene = scene
    this.center = center //建筑的中心

    this.nowMesh = {}//班球体的对象
    this.nowScale = 0//当前放大的比例(0)

    this.init()
  }
  init() {
    // 设置七个参数  半球体
    const geometry = new THREE.SphereGeometry(25,
      32,
      16,
      0,
      Math.PI * 2,// 水平方向扫描角度
      0,
      Math.PI / 2// 垂直方向扫描角度（一半）-半球体
    );
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#f4790d'),
      side: THREE.DoubleSide,
      depthTest: false // 关闭深度测试（透视效果）- 多个像素点同时渲染
      // 下面的两个属性效果不如depthTest好
      // transparent: true,   // 启用透明
      // opacity: 0.5         // 设置透明度

    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(this.center.x, 0, this.center.z)
    this.scene.add(sphere);
    this.nowMesh = sphere
  }

  // 放大的动效
  onTick() {
    // 慢慢放大
    if (this.nowScale < 1) {
      this.nowScale += 0.0001
      this.nowMesh.scale.set(this.nowScale, this.nowScale, this.nowScale)
    } else {
      this.nowScale = 0
    }
  }
}

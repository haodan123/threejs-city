import * as THREE from 'three'

// 城市边缘边线效果类
export class EdgesLine {
  constructor(scene, mesh, color) {
    this.scene = scene
    this.mesh = mesh //需要添加边线的小物体模型对象
    this.color = color //边线的颜色
    this.init()
  }
  init() {
    // 边缘几何体给建筑加边线
    const edges = new THREE.EdgesGeometry(this.mesh.geometry);//给建筑小物体添加边线
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: this.color })); //设置边线的颜色

    // 把目标小物体模型对象（位置，旋转角度，缩放）赋予给边线物体
    line.position.copy(this.mesh.position)  //复制 建筑的位置
    line.rotation.copy(this.mesh.rotation) //复制建筑的旋转
    line.scale.copy(this.mesh.scale) //复制建筑的缩放
    this.scene.add(line);
  }
}

import { BaseModel } from '@/model/BaseModel'
import * as THREE from 'three'


// 游艇类
export class Ship extends BaseModel {
  init() {
    //scene 和model都在baseModel类中设置了 直接调用就行
    this.scene.add(this.model)
    this.pointIndex = 0//保存当前游船所在位置的坐标索引

    // 生成游船移动的路线
    this.generatorMovePath()
  }
  // 生成游船进行的路线坐标点集合
  generatorMovePath() {
    // 设置平滑的三维样条曲线路线坐标点，CatmullRomCurve3
    // 设置关键的几个点坐标，其他的构造函数内会帮我们计算
    const shipPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(134.356097129589, 2.0112688541412354, -78.91746888546072),
      new THREE.Vector3(13.132075955743915, 2.0112688541412425, -69.85260460470285),
      new THREE.Vector3(13.132075955743915, 2.0112688541412425, -69.85260460470285),
      new THREE.Vector3(-80.28995611104816, 2.0112688541412282, -12.640254617216172),
      new THREE.Vector3(-71.5470123066941, 2.0112688541412354, 25.641138454485144),
      new THREE.Vector3(-71.5470123066941, 2.0112688541412354, 25.641138454485144),
      new THREE.Vector3(-17.5179164111899, 2.0112688541412354, 139.95062075065943),
      new THREE.Vector3(-67.10547001341894, 2.0112688541412354, 64.30494908329582),
      new THREE.Vector3(-87.03568940230136, 2.0112688541412354, 20.40776369519459),
      new THREE.Vector3(-88.0509634357777, 2.0112688541412425, -32.429601593890354),
      new THREE.Vector3(-70.27457116256328, 2.0112688541412425, -50.370253013515836),
      new THREE.Vector3(-39.206573479212764, 2.0112688541412425, -64.28841112963838),
      new THREE.Vector3(47.33347662423566, 2.0112688541412354, -73.13885409538068),
      new THREE.Vector3(134.356097129589, 2.0112688541412354, -78.91746888546072),
    ])

    // getSpacedPoints 等间距的坐标点  3500个坐标点连城的线
    this.pointArr = shipPath.getSpacedPoints(3500)

    // 用线段吧路线描绘出来
    const geometry = new THREE.BufferGeometry().setFromPoints(this.pointArr);
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });

    const curveObject = new THREE.Line(geometry, material);
    this.scene.add(curveObject)

  }

  // 游船行径的方法 切换坐标点位置
  onTick() {
    // 检查是否到达路径终点
    if (this.pointIndex >= this.pointArr.length - 1) {
      this.pointIndex = 0;
      return;
    }
    // 获取当前位置和下一个位置
    const currentPoint = this.pointArr[this.pointIndex];
    const nextPoint = this.pointArr[this.pointIndex + 1];
    // 更新游船位置
    this.model.position.copy(currentPoint);
    // 让船头朝向下一个点的方向
    this.model.lookAt(nextPoint);
    // 移动到下一个点
    // this.pointIndex += 1
    this.pointIndex++

  }
}

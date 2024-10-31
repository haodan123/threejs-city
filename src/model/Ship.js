import { BaseModel } from '@/model/BaseModel'
import emitter from '@/utils/mitt'
import * as THREE from 'three'


// 游艇类
export class Ship extends BaseModel {
  init() {
    //scene 和model都在baseModel类中设置了 直接调用就行
    this.scene.add(this.model)
    this.pointIndex = 0//保存当前游船所在位置的坐标索引
    this.isCameraMove = false // 控制摄像机是否跟随切换位置的开关

    // 生成游船移动的路线
    this.generatorMovePath()
    this.onModelAttach() // 鼠标事件

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

    // 游船模式
    if (this.isCameraMove) {
      const { x, y, z } = nextPoint
      // 更改摄像机位置
      // this.camera.position.copy(])
      // 让摄像机中心观察点往上偏移一 点
      if (!this.isMouseTouching) { // 鼠标没有被按下时，才设置摄像机的 lookAt
        // 如果处于漫游模式+鼠标被按下，证明自己要旋转摄像机，那就不能让摄像的 lookAt 执行影响旋转效果
        this.camera.lookAt(x, y + 20, z)
      }
      this.camera.position.set(x, y + 20, z)
    }
    // 更新游船位置
    this.model.position.copy(currentPoint);
    // 让船头朝向下一个点的方向
    this.model.lookAt(nextPoint);
    // 移动到下一个点
    // this.pointIndex += 1
    this.pointIndex++

  }
  // 鼠标按下
  mousedownFn = () => {
    this.isMouseTouching = true

  }
  // 鼠标移动
  mousemoveFn = (e) => {
    if (this.isMouseTouching) { //按下鼠标时进入此逻辑
      // 旋转核心思想：在原有的旋转角度基础上，新增移动的偏移量，乘以 0.01 让旋转弧度降低
      // rotateY() 在上一次旋转的角度上继续新增你传入的弧度数值
      // rotation.y = 直接赋予一个旋转的最终弧度数值
      this.camera.rotateY((this.prePos - e.clientX) * 0.01)
    }
    this.prePos = e.clientX

  }
  // 鼠标抬起
  mouseupFn = () => {
    this.isMouseTouching = false
    this.prePos = undefined//清空上一次坐标的数据
  }

  // 绑定/移除鼠标事件
  onModelAttach() {
    // 点击漫游模式 - 绑定/移除鼠标相关事件

    emitter.on('mode-roaming', isOpen => {
      if (isOpen) {
        // 这三个函数用箭头函数的方式赋值  不然this对不上
        window.addEventListener('mousedown', this.mousedownFn) //鼠标按下
        window.addEventListener('mousemove', this.mousemoveFn)//鼠标移动
        window.addEventListener('mouseup', this.mouseupFn)//鼠标抬起
      } else {
        window.removeEventListener('mousedown', this.mousedownFn) //移除鼠标按下  
        window.removeEventListener('mousemove', this.mousemoveFn)//移除鼠标移动
        window.removeEventListener('mouseup', this.mouseupFn)//移除鼠标抬起
      }
    })
  }
}
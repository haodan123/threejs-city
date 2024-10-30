// 单击事件管理类
import * as THREE from 'three'
export class ClickHandler {
  static getInstance() {
    if (!this.instance) {
      this.instance = new ClickHandler()
    }
    return this.instance
  }
  init(camera, dom) {
    this.camera = camera
    this.dom = dom//渲染的dom
    this.list = [] // 光线投射交互计算的物体
    this.map = new Map() // key 可以是 three.js 物体（与点击要执行的回调函数产生一对一关系）

    // 光线投射
    const rayCaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    window.addEventListener('click', e => {
      e.stopPropagation()
      const width = dom.clientWidth || window.innerWidth
      const height = dom.clientHeight || window.innerHeight
      pointer.x = (e.clientX / width) * 2 - 1
      pointer.y = -(e.clientY / height) * 2 + 1

      rayCaster.setFromCamera(pointer, this.camera)
      const resultList = rayCaster.intersectObjects(this.list, false)

      // 默认只触发第一个收集到的物体（后面物体不触发交互）
      if (resultList.length > 0) {
        const targetObj = resultList[0]
        const fn = this.map.get(targetObj.object)
        // 回调绑定点击事件函数体，并回传当前触发的这个 three.js 物体
        fn(targetObj.object)
      }

      // resultList.forEach(obj => {
      //   // console.log(obj);
      //   const fn = this.map.get(obj.object)
      //   // 调用这个函数 并吧three物体传回去
      //   fn(obj.object)
      // })
    })
  }
  // 传入要点击物体和函数体
  addMesh(mesh, fn) {
    this.list.push(mesh)
    this.map.set(mesh, fn)
  }
}
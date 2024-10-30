import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// 2d物体 建筑信息
export class BuildInfo {
  constructor(scene, center, dataObj) {
    this.scene = scene
    this.center = center
    this.dataObj = dataObj

    this.list = []//用来保存两个2D物体的信息

    this.createNameDiv()
    this.createInfoDiv()
  }
  // 建筑名字的2d物体
  createNameDiv() {
    const nameDiv = document.querySelector('#tag-1')
    nameDiv.innerHTML = this.dataObj.name//建筑的名称
    // 标签虽然有display:none 但是转换成2D物体后会在2D 渲染器浩总直接显示
    // 创建2d物体
    const nameObject = new CSS2DObject(nameDiv)
    // 设置2d的位置
    nameObject.position.set(this.center.x, this.center.y + 10, this.center.z)
    // 添加到场景
    this.scene.add(nameObject)
    this.list.push(nameObject)
  }
  // 建筑信息的2d物体
  createInfoDiv() {
    const infoDiv = document.querySelector('#tag-2')
    // infoDiv.innerHTML = this.dataObj.name//建筑的名称
    const { squareMeters, accommodate, officesRemain, parkingRemain } = this.dataObj
    const textHeml = `
    <div>总平米数： ${squareMeters}</div>
    <div>容纳人数： ${accommodate} </div>
    <div>可出租位： ${officesRemain} </div>
    <div>空余车位： ${parkingRemain} </div>
    `
    infoDiv.innerHTML = textHeml
    // 创建2d物体
    const infoObject = new CSS2DObject(infoDiv)
    // 设置2d的位置
    infoObject.position.set(this.center.x, this.center.y + 5, this.center.z)
    // 添加到场景
    this.scene.add(infoObject)
    this.list.push(infoObject)
    // 点击事件 点击2d物体隐藏
    infoDiv.style.pointerEvents = 'all'//让2d物体可以被点击
    infoDiv.addEventListener('click', (e) => {
      e.stopPropagation()//  阻止事件冒泡,避免触发其他点击事件
      this.clear.call(this) //  调用clear方法并绑定this上下文,用于隐藏信息面板
    })

  }

  // 隐藏信息物体
  clear() {
    this.list.forEach(item => {
      item.visible = false
    })
  }

}

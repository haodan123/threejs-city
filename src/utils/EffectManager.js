// 整个项目的动效管理类

export class EffectManager {
  constructor() {
    this.list = []//保存起来 将来要做动效的实例对象
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new EffectManager()
    }
    return this.instance
  }

  // 添加要做动效的实例对象
  addObj(obj) {
    this.list.push(obj)
    // console.log(this.list[0].onTick);
  }
  tickForEach(t) {
    // t: 将来渲染循环传过来的毫秒级时间数值
    this.list.forEach(item => {
      item.onTick(t)
    })

  }
}

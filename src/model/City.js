import { EdgesLine } from '@/effect/EdgesLine'
import { BaseModel } from '@/model/BaseModel'
import * as THREE from 'three'

// 修改城市模型的着色器函数
import { modifyCityDefaultMaterial } from '@/shader/modifyCityMaterial';
import { CityWater } from '@/effect/CityWater'; //水
import { Fire } from '@/effect/Fire';//火灾
import { FireBall } from '@/effect/FireBall';//火灾范围影像
import { BuildInfo } from '@/dom/BuildInfo';//建筑信息 弹窗
// 获取模型的中心和大小
import { getBoxCenter } from '@/utils/getBoxCenter';
// 动效管理类
import { EffectManager } from '@/utils/EffectManager';
import { ClickHandler } from '@/utils/ClickHandler';
// 城市类
export class City extends BaseModel {
  init() {
    //scene 和model都在baseModel类中设置了 直接调用就行
    this.scene.add(this.model)

    this.buildNameObj = { // 模型名字和建筑显示名字对应关系
      '01-shanghaizhongxindasha': '上海中心大厦',
      "02-huanqiujinrongzhongxin": "环球金融中心",
      "03-jinmaodasha": "金茂大厦",
      "04-dongfangmingzhu": "东方明珠",
    }

    this.initEffect()
    this.initFire('01-shanghaizhongxindasha')
    this.bindClick()
  }

  // 初始化城市效果
  initEffect() {
    // console.log(this.model.traverse);
    // 中间城市建筑 基础材质  不需要反光什么的  所以使用基础材质
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: 0xA8CDED,
      transparent: true,//透明
    })
    // 外围的城市建筑  基础材质
    const periphery = new THREE.MeshBasicMaterial({
      color: 0xA8CDED,
      transparent: true,//透明
    })
    this.model.traverse(model => {
      // console.log(model);
      if (model.name === 'Text') {
        // 隐藏建筑上面的文字
        model.visible = false
        return
        // console.log(model);
      }
      if (model.name === 'Shanghai-08-River') {
        // 隐藏一开始的河流
        model.visible = false
        // 添加 处理之后的水的材质
        const theWater = new CityWater(model, this.scene)
        // 把水添加到动效管理类里面 做动效
        // console.log(EffectManager.getInstance());
        EffectManager.getInstance().addObj(theWater)

      }

      // Shanghai-08-River  //河流的name
      // Shanghai-09-Floor  //地板的name
      // 除了地板和河流 修改城市的建筑模型材质
      if (model.name !== 'Shanghai-08-River' && model.name !== 'Shanghai-09-Floor') {

        // console.log(model);
        // new EdgesLine(this.scene, model, 'red')
        if (model.name === 'Shanghai-06' || model.name === 'Shanghai-07' || model.name === 'Shanghai-05' || model.name === 'Shanghai-02' || model.name === 'Shanghai-03' || model.name === 'Shanghai-04') {
          // 修改外围的材质
          model.material = periphery
          new EdgesLine(this.scene, model, new THREE.Color('#666666')) //给建筑加边线
          // 修改建筑模型的着色器函数  对物体追加混合的着色器代码（渐变色白膜效果）
          modifyCityDefaultMaterial(model, false)

        } else {
          // 修改中心的材质  centerMaterial
          model.material = centerMaterial
          new EdgesLine(this.scene, model, new THREE.Color('#00ffff')) //给建筑加边线
          // 修改建筑模型的着色器函数
          modifyCityDefaultMaterial(model, true)

        }
      }
    })

  }

  // 创建火灾标记
  // buildName就是建模师模型中的小物体名字
  initFire(buildName) {
    const build = this.model.getObjectByName(buildName)
    const { center, size } = getBoxCenter(build)
    new Fire(this.scene, center, size) //火灾标记

    const fireBall = new FireBall(this.scene, center) //火灾范围影像
    // 添加到动效管理类
    EffectManager.getInstance().addObj(fireBall)



  }

  // 给中心四个建筑绑定点击事件 
  bindClick() {
    Object.keys(this.buildNameObj).forEach(key => {
      const build = this.model.getObjectByName(key)
      ClickHandler.getInstance().addMesh(build, (object) => {
        // console.log(object);
        const { center } = getBoxCenter(object) //获取建筑的中心
        // 测试建筑信息
        let dataObj = {
          "squareMeters": "200",
          "name": this.buildNameObj[key],
          "officesRemain": "200",
          "accommodate": "500",
          "parkingRemain": "88",
          "cameraPosition": {
            "x": "-27.60404773326758",
            "y": "77.6723594934777",
            "z": "190.86129619259177"
          }
        }
        new BuildInfo(this.scene, center, dataObj)
      })
    })
  }
}

import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js' //  单独引入 stats 组件 性能监视器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //轨道控制器
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js' //辅助工具

import { loadManager } from '@/model/loadManager'
import { City } from '@/model/City.js' //城市类
import { Ship } from '@/model/Ship.js'//游艇类
import { Sky } from '@/environment/Sky';//天空类
import { Fly } from '@/model/Fly';//飞行器类

import { ClickHandler } from '@/utils/ClickHandler.js'
//动效管理类
import { EffectManager } from '@/utils/EffectManager';
import emitter from '@/utils/mitt';
import { DataManager } from '@/utils/DataManager';



/**
 *初始化threejs
 * @param {*} dom 渲染到哪个dom下
 * @param {*} domId 渲染到哪个dom的id下
 * @returns  把场景摄像机 渲染器等必要的东西返回出去
 */

export const useThreeInit = (domId) => {
  // 统一状态管理
  const state = {
    dom: null,//渲染到哪个dom
    scene: null,//场景
    camera: null,//摄像机
    renderer: null,//渲染器
    controls: null,//轨道控制器
    stats: null,//性能监视器
    css3dRenderer: null,//3d渲染器
    css2dRenderer: null,//2d渲染器
    width: 0,//宽度
    height: 0,//高度
    modelList: [],//模型列表
    clock: new THREE.Clock() // 添加时钟对象 用来做鸟的动画速度

  }

  // 初始化场景摄像机渲染器
  const init = () => {
    try {
      state.dom = document.getElementById(domId) || document.body
      state.width = state.dom?.clientWidth || window.innerWidth
      state.height = state.dom?.clientHeight || window.innerHeight

      state.scene = new THREE.Scene() //场景
      state.renderer = new THREE.WebGLRenderer({ //渲染器
        antialias: true, //抗锯齿
        powerPreference: "high-performance" // 性能优化
      })

      state.renderer.setSize(state.width, state.height)
      state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 优化高DPI设备  对mac高分辨率屏幕优化非常明显
      state.renderer.shadowMap.enabled = true //开启阴影渲染支持

      state.renderer.shadowMap.type = THREE.PCFSoftShadowMap // 更好的阴影效果

      // 添加到dom上
      state.dom.appendChild(state.renderer.domElement)
    } catch (error) {
      console.error('Scene initialization failed:', error)
    }

  }
  // 创建摄像机
  const createCamera = () => {
    state.camera = new THREE.PerspectiveCamera(75, state.width / state.height, 0.1, 10000) //模型比较大 设置为1万
    // camera.position.z = 0.1 //z轴正0.1 做全景效果
    // camera.position.z = 5 //z轴正5 做正常效果
    state.camera.position.set(-148, 55, -101) //摄像头位置 模型比较大 摄像机调远一点
  }
  // 轨道控制器
  const createControls = () => {
    state.controls = new OrbitControls(state.camera, state.renderer.domElement)
    state.controls.update()

    // 摄像机移动范围控制
    // controls.maxDistance = 10 //最多放大到10个单位
    // controls.minDistance = 2 //最小缩小到2个单位
  }

  // 创建模型
  const createModel = () => {
    // 创建天空
    const skybg = new Sky(state.scene)
    // 图片 右左上下前后
    skybg.setBack('textures/sky/', [
      'px.jpg',
      'nx.jpg',
      'py.jpg',
      'ny.jpg',
      'pz.jpg',
      'nz.jpg',
    ])

    // 加载城市和游轮的模型
    loadManager(['fbx/city.fbx', 'gltf/fly/scene.gltf', 'gltf/ship.glb'], modelList => {
      state.modelList = modelList
      // console.log(modelList)
      modelList.forEach(async (item) => {
        if (item.url === 'fbx/city.fbx') {
          // 如果是城市的fbx模型
          const city = new City(item.model, state.scene, state.camera, state.controls)
          const data = await DataManager.getInstance().getData()
          city.dataObj = data // 传入默认数据
        } else if (item.url === 'gltf/fly/scene.gltf') {
          // 飞行器的gltf模型
          const fly = new Fly(item.model, state.scene, state.camera, state.controls)

          // 如果模型有动画，播放第一个动画
          if (item.actions && item.actions.length > 0) {
            item.actions[0].play();
            item.actions[0].timeScale = 0.01; // 设置为原速度的一半
          }
          // 添加到动效管理类
          EffectManager.getInstance().addObj(fly)
          // eventBus 事件监听
          emitter.on('mode-topView', (isOpen) => {
            // console.log(isOpen)
            fly.controls.enabled = !isOpen // 鸟瞰时轨道控制器禁止交互

            fly.isCameraMove = isOpen //控制摄像机是否跟着飞行器移动
          })
        } else if (item.url === 'gltf/ship.glb') {
          // 游艇的glb模型


          const ship = new Ship(item.model, state.scene, state.camera, state.controls)
          // console.log(ship);
          ship.model.position.set(150, 0, -80)//放到合适的位置
          ship.model.rotation.set(0, -Math.PI / 2, 0) //y轴旋转掉头
          ship.model.scale.set(100, 100, 100) //模型本身太小了 放大100倍

          // ship.generatorMovePath()
          // 把游艇添加到动效管理类里面 做动效
          EffectManager.getInstance().addObj(ship)

          emitter.on('mode-roaming', (isOpen) => {
            ship.controls.enabled = !isOpen // 漫游时轨道控制器禁止交互
            ship.isCameraMove = isOpen //控制摄像机是否跟着飞行器移动
          })

        }
      })
    })
    // // 把立方体当成飞行器
    // 在上面吧立方体更换成了鸟的模型
    // const geometry = new THREE.BoxGeometry(5, 5, 5);
    // const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('lightblue') });
    // const cube = new THREE.Mesh(geometry, material);
    // state.scene.add(cube);
    // // 生成飞行器对象
    // const fly = new Fly(cube, state.scene, state.camera, state.controls)
    // // 添加到动效管理类
    // EffectManager.getInstance().addObj(fly)
    // // eventBus 事件监听
    // emitter.on('mode-topView', (isOpen) => {
    //   // console.log(isOpen)
    //   fly.controls.enabled = !isOpen // 鸟瞰时轨道控制器禁止交互

    //   fly.isCameraMove = isOpen //控制摄像机是否跟着飞行器移动
    // })
  }
  // 创建3d点击事件
  const createClick3D = () => {
    // // three.js 光线投射统一管理类初始化  threejs的点击事件
    // ClickHandler.getInstance().init(camera, cityRef.value)
    ClickHandler.getInstance().init(state.camera, state.dom, state.scene)
  }

  // 坐标轴
  const createHelper = () => {
    // const axesHelper = new THREE.AxesHelper(5)
    const axesHelper = new THREE.AxesHelper(1500)
    // console.log(axesHelper)
    state.scene.add(axesHelper)
  }
  // 创建性能监视器
  const createStats = () => {
    // 记得在循环渲染中调用 stats.update()
    state.stats = new Stats()
    state.stats.setMode(0) //0先显示fps 1先显示ms 2先显示mb
    state.stats.domElement.style.position = 'absolute'
    state.stats.domElement.style.left = '0'
    state.stats.domElement.style.top = '0'
    // 渲染到body上
    if (state.dom) {
      state.dom.appendChild(state.stats.domElement)
    } else {
      document.body.appendChild(state.stats.domElement)
    }
  }

  // 创建灯光 环境光
  const createLight = () => {
    const light = new THREE.AmbientLight(0x404040, 50); // 柔和的白光
    state.scene.add(light);
  }

  // 渲染3dcss的文字 记得在renderLoop中调用  不然不显示
  const create3dRenderer = () => {
    state.css3dRenderer = new CSS3DRenderer()
    state.css3dRenderer.setSize(state.width, state.height)
    state.css3dRenderer.domElement.style.position = 'absolute'
    state.css3dRenderer.domElement.style.left = '0'
    state.css3dRenderer.domElement.style.top = '0'
    state.css3dRenderer.domElement.style.pointerEvents = 'none'
    // document.body.appendChild(state.css3dRenderer.domElement)
    if (state.dom) {
      state.dom.appendChild(state.css3dRenderer.domElement)
    } else {
      document.body.appendChild(state.css3dRenderer.domElement)
    }
  }

  // 渲染2dcss的文字  记得在renderLoop中调用  不然不显示
  const create2dRenderer = () => {
    state.css2dRenderer = new CSS2DRenderer()
    state.css2dRenderer.setSize(state.width, state.height)
    state.css2dRenderer.domElement.style.position = 'fixed'
    state.css2dRenderer.domElement.style.left = '0'
    state.css2dRenderer.domElement.style.top = '0'
    state.css2dRenderer.domElement.style.pointerEvents = 'none'
    // document.body.appendChild(state.css2dRenderer.domElement)
    if (state.dom) {
      state.dom.appendChild(state.css2dRenderer.domElement)
    } else {
      document.body.appendChild(state.css2dRenderer.domElement)
    }
  }

  // 监听浏览器宽高
  const resizeRender = () => {
    const handleResize = () => {
      state.width = state.dom?.clientWidth || window.innerWidth
      state.height = state.dom?.clientHeight || window.innerHeight
      if (state.camera) {
        // 摄像机
        state.camera.aspect = state.width / state.height
        state.camera.updateProjectionMatrix()
      }
      // 批量处理所有渲染器的大小调整
      const renderers = [
        state.renderer, //渲染器
        state.css3dRenderer, //3d渲染器
        state.css2dRenderer //2d渲染器
      ]

      renderers.forEach(renderer => {
        if (renderer?.setSize) {
          renderer.setSize(state.width, state.height)
        }
      })
    }

    // 使用防抖优化resize事件
    let resizeTimeout
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 100)
    })
  }
  //主要播放鸟模型的自带动画
  const animate = (deltaTime) => {
    state.modelList.forEach(item => {
      if (item.mixer) {
        // 动画加载太快了 手动延迟200ms
        setTimeout(() => {
          item.mixer.update(deltaTime);
        }, 200)
      }
    });
  }



  // 循环渲染
  const renderLoop = (t) => {
    if (!state.renderer || !state.scene || !state.camera) return
    requestAnimationFrame(renderLoop)
    // 开始做动效->遍历所有要做动效的实例物体内置的 onTick 方法
    EffectManager.getInstance().tickForEach(t)
    // 鸟模型自带的的动画
    const deltaTime = (t / t) * 0.1
    animate(deltaTime)
    // 性能优化：只在需要时更新
    if (state.stats?.update) state.stats.update() //更新性能监视器
    if (state.css3dRenderer?.render) state.css3dRenderer.render(state.scene, state.camera) //更新3d渲染器
    if (state.css2dRenderer?.render) state.css2dRenderer.render(state.scene, state.camera) //更新2d渲染器
    state.renderer.render(state.scene, state.camera) //更新渲染器
  }

  onMounted(() => {
    // console.log('hook');
    // 初始化
    init()
    // 摄像机
    createCamera()
    // 轨道控制器
    createControls()
    // css3d渲染
    create3dRenderer()
    // css2d渲染
    create2dRenderer()
    // 创建模型
    createModel()
    // 创建环境光
    createLight()
    // 创建3d点击事件
    createClick3D()

    // 创建坐标轴
    createHelper()

    // 创建性能监视器
    createStats()
    // 循环渲染
    renderLoop()
    // 监听浏览器宽高
    resizeRender()
    // 监听轨道控制器 旋转/拖拽等事件 方便找到驾驶位的坐标
    // controls.addEventListener('change', () => {
    // console.log(camera.position) //摄像机的位置
    // console.log(controls.target) //正在观察的坐标点对象
    // })

    // 双击进入驾驶位
    window.addEventListener('dblclick', () => {
      // 外观
      // camera.position.set(3, 1.5, 3)
      // controls.target = new THREE.Vector3(0, 0, 0)
      // 主驾驶
      // camera.position.set(0.31, 0.98, -0.23)
      // controls.target = new THREE.Vector3(0.16, 0.38, 0.49)
      // 副驾驶
      // camera.position.set(-0.26, 0.93, -0.17)
      // controls.target =new THREE.Vector3(0.16, 0.38, 0.49)

    })

  })
  // 清理函数
  onUnmounted(() => {

    // 释放资源
    // state.scene?.dispose()
    // state.renderer?.dispose()
    // state.controls?.dispose()

    // 移除事件监听
    // window.removeEventListener('resize', resizeRender)
    // window.removeEventListener('dblclick', handleDblClick)
  })

  // 返回响应式的状态   threejs对象不能用响应式  所以返回去的数据没接收到
  return {
    // 返回需要的属性和方法
    getScene: () => state.scene,
    getCamera: () => state.camera,
    getRenderer: () => state.renderer,
    getControls: () => state.controls,
    getStats: () => state.stats,
    getCss3dRenderer: () => state.css3dRenderer,
    getCss2dRenderer: () => state.css2dRenderer,
    getDimensions: () => ({
      width: state.width,
      height: state.height
    })
  }
  // return scene

}

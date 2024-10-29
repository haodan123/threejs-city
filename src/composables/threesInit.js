import { ref, onMounted, watch, nextTick } from 'vue'
import Stats from 'three/examples/jsm/libs/stats.module.js' //  单独引入 stats 组件 性能监视器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //轨道控制器
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

import { loadManager } from '@/model/loadManager'
import { City } from '@/model/City.js' //城市类
import { Ship } from '@/model/Ship.js'//游艇类
import { Sky } from '@/environment/Sky';//天空类
import { ClickHandler } from '@/utils/ClickHandler.js'
import * as THREE from 'three'

/**
 *初始化threejs
 * @param {*} dom 渲染到哪个dom下
 * @param {*} domId 渲染到哪个dom的id下
 * @returns  把场景摄像机 渲染器等必要的东西返回出去
 */
export const useThreeInit = (domId) => {
  //渲染到哪个dom
  let dom
  // 创建 场景 摄像机 渲染器
  let scene, camera, renderer
  // 轨道控制器
  let controls
  // 性能监视器
  let stats
  // 把css渲染到threejs中
  let css3dRenderer
  // 渲染2d属性
  let css2dRenderer
  // console.log('dom', dom, scene, camera, renderer, controls, css3dRenderer);
  let width, height


  // 初始化场景摄像机渲染器
  const init = () => {
    dom = document.getElementById(domId) || document.body
    // console.log(dom, domId);
    // console.log(dom);
    if (dom) {
      width = dom.clientWidth
      height = dom.clientHeight
    } else {
      width = window.innerWidth
      height = window.innerHeight
    }


    scene = new THREE.Scene()
    renderer = new THREE.WebGLRenderer({ antialias: true }) //设置antialias为true就没有锯齿了
    renderer.setSize(width, height)

    renderer.shadowMap.enabled = true // 开启阴影渲染支持

    // testBox.value.appendChild(renderer.domElement)
    // 渲染到body上
    if (dom) {
      dom.appendChild(renderer.domElement)
    } else {
      document.body.appendChild(renderer.domElement)
    }


  }
  // 创建摄像机
  const createCamera = () => {
    // camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000) //模型比较大 设置为1万
    // camera.position.z = 0.1 //z轴正0.1 做全景效果
    // camera.position.z = 5 //z轴正5 做正常效果
    camera.position.set(-148, 55, -101) //摄像头位置 模型比较大 摄像机调远一点
  }
  // 轨道控制器
  const createControls = () => {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    // 摄像机移动范围控制
    // controls.maxDistance = 10 //最多放大到10个单位
    // controls.minDistance = 2 //最小缩小到2个单位
  }

  // 创建模型
  const createModel = () => {

    // 创建天空
    const skybg = new Sky(scene)
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
    loadManager(['fbx/city.fbx', 'gltf/ship.glb'], modelList => {
      // console.log(modelList)
      modelList.forEach(item => {
        if (item.url === 'fbx/city.fbx') {
          // 如果是城市的fbx模型
          new City(item.model, scene, camera, controls)
        } else if (item.url === 'gltf/ship.glb') {
          // 游艇的glb模型
          const ship = new Ship(item.model, scene, camera, controls)
          // console.log(ship);
          ship.model.position.set(150, 0, -80)//放到合适的位置
          ship.model.rotation.set(0, -Math.PI / 2, 0) //y轴旋转掉头
          ship.model.scale.set(100, 100, 100) //模型本身太小了 放大100倍
        }
      })
    })
  }
  // 创建3d点击事件
  const createClick3D = () => {
    // // three.js 光线投射统一管理类初始化  threejs的点击事件
    // ClickHandler.getInstance().init(camera, cityRef.value)
    ClickHandler.getInstance().init(camera, dom)
  }

  // 坐标轴
  const createHelper = () => {
    // const axesHelper = new THREE.AxesHelper(5)
    const axesHelper = new THREE.AxesHelper(1500)
    // console.log(axesHelper)
    scene.add(axesHelper)
  }
  // 创建性能监视器
  const createStats = () => {
    // 记得在循环渲染中调用 stats.update()
    stats = new Stats()
    stats.setMode(0) //0先显示fps 1先显示ms 2先显示mb
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0'
    stats.domElement.style.top = '0'
    // 渲染到body上
    if (dom) {
      dom.appendChild(stats.domElement)
    } else {
      document.body.appendChild(stats.domElement)
    }
  }

  // 创建灯光 环境光
  const createLight = () => {
    const light = new THREE.AmbientLight(0x404040, 50); // 柔和的白光
    scene.add(light);
  }

  // 渲染3dcss的文字 记得在renderLoop中调用  不然不显示
  const create3dRenderer = () => {
    css3dRenderer = new CSS3DRenderer()
    css3dRenderer.setSize(width, height)
    css3dRenderer.domElement.style.position = 'absolute'
    css3dRenderer.domElement.style.left = '0'
    css3dRenderer.domElement.style.top = '0'
    css3dRenderer.domElement.style.pointerEvents = 'none'
    // document.body.appendChild(css3dRenderer.domElement)
    if (dom) {
      dom.appendChild(css3dRenderer.domElement)
    } else {
      document.body.appendChild(css3dRenderer.domElement)
    }
  }

  // 渲染2dcss的文字  记得在renderLoop中调用  不然不显示
  const create2dRenderer = () => {
    css2dRenderer = new CSS2DRenderer()
    css2dRenderer.setSize(width, height)
    css2dRenderer.domElement.style.position = 'fixed'
    css2dRenderer.domElement.style.left = '0'
    css2dRenderer.domElement.style.top = '0'
    css2dRenderer.domElement.style.pointerEvents = 'none'
    // document.body.appendChild(css2dRenderer.domElement)
    if (dom) {
      dom.appendChild(css2dRenderer.domElement)
    } else {
      document.body.appendChild(css2dRenderer.domElement)
    }
  }

  // 监听浏览器宽高
  const resizeRender = () => {
    window.addEventListener('resize', () => {
      renderer.setSize(width, height) //场景的宽高
      camera.aspect = width / height //摄像机的宽高
      css3dRenderer.setSize(width, height) //3d渲染的宽高
      css2dRenderer.setSize(width, height) //2d渲染的宽高
      camera.updateProjectionMatrix()
    })
  }


  // 循环渲染
  const renderLoop = () => {
    requestAnimationFrame(renderLoop)
    // 这里不再调用轨道控制器 update 方法，会影响摄像机 lookAt
    // controls?.update() //更新轨道控制器
    stats?.update() //更新监视器

    // 也要让 DOM 渲染器不断更新不同角度的最新画面
    css3dRenderer.render(scene, camera)
    css2dRenderer.render(scene, camera)
    renderer.render(scene, camera)
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
    // 创建3d点击事件
    createClick3D()
    // 创建环境光
    createLight()

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
    window.addEventListener('dblclick', e => {
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

  return { scene, camera, renderer, controls, css3dRenderer, css2dRenderer };
  // return scene

}

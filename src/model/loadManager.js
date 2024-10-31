
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' //GLTF模型加载器
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js' //FBX模型加载器
import gsap from 'gsap'
import * as THREE from 'three'

// 模型加载的进度
const manager = new THREE.LoadingManager();

/**
 * 专门加载模型文件=>模型对象
 * @param {*} pathList 模型文件路径数组
 * @param {*} successFn 接收成功结果回调函数
 */
export const loadManager = (pathList, successFn) => {
  // 定义加载器对象
  const gltfLoader = new GLTFLoader(manager)
  const fbxLoader = new FBXLoader(manager)
  let preValue = 0 // 上一次进度值


  // 保存加载成功模型对象数组
  const model = []

  // 加载器对象关联属性和回调函数
  manager.onProgress = (url, loadedNum, totalNum) => {
    // url: 当前被加载完成的模型路径
    // loadedNum: 当前加载完成的个数 
    // totalNum: 总共要加载的个数
    // * 100 目的：为了让 0.5 进度变成 50 后续添加 % 后缀
    // 当前已经加载的进度数字
    // console.log(url, loadedNum, totalNum);
    let progressRatio = Math.floor(loadedNum / totalNum * 100)

    // 更新进度条
    gsap.fromTo('#processing-number', {
      innerText: preValue // 暂时先传入一个数字（后面再去加 % 字符串）
    }, {
      innerText: progressRatio,
      onUpdate() {
        // 做动画期间的函数
        // 详细控制显示的内容
        // 取出当前正在做动画的目标对象的属性值（进度数字）  其实就是取出上面的progressRatio给后面加百分符号
        const num = gsap.getProperty(this.targets()[0], 'innerText')
        this.targets()[0].innerText = num + '%'
        preValue = progressRatio // 把当前最新的加载进度值，赋予到外面变量上

        if (num === 100) {
          // loader 加载器工作完毕
          // 模型全部加载完毕  把加载数组返回 隐藏进度条
          successFn(model)
          document.querySelector('.loading').style.display = 'none'
        }
      }
    })
    // 对进度条再来做一个动画
    // scaleX 范围是 0 - 1 做横向的缩放
    gsap.fromTo('#loading-bar', {
      scaleX: preValue / 100
    }, {
      scaleX: progressRatio / 100
    })
  }

  pathList.forEach(path => {
    // console.log(path);

    if (path.indexOf('fbx') > -1) {
      //如果是fbx文件
      fbxLoader.load(path, (obj) => {
        // 处理FBX动画
        const animations = obj.animations;
        const mixer = animations.length > 0 ? new THREE.AnimationMixer(obj) : null;

        // 数据结构 存到数组里
        model.push({
          model: obj,
          url: path,
          animations, // 保存动画数据
          mixer,     // 保存动画混合器
          actions: animations.map(clip => mixer?.clipAction(clip)) // 预创建动作
        })
        // 如果加载的模型数量和存贮的数量一致就返回 在上面用loadingManager的onProgress方法 已经返回了
        // model.length === pathList.length && successFn(model)
      })
    } else if (path.indexOf('gltf') > -1) {
      // 如果是gltf文件
      gltfLoader.load(path, gltf => {
        // 处理GLTF动画
        const animations = gltf.animations;
        const mixer = animations.length > 0 ? new THREE.AnimationMixer(gltf.scene) : null;

        model.push({
          model: gltf.scene,
          url: path,
          animations, // 保存动画数据
          mixer,     // 保存动画混合器
          actions: animations.map(clip => mixer?.clipAction(clip)) // 预创建动作
        });
        // 如果加载的模型数量和存贮的数量一致就返回 在上面用loadingManager的onProgress方法 已经返回了
        // model.length === pathList.length && successFn(model)

      })
    }
  })

}


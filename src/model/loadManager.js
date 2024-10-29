
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' //GLTF模型加载器
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js' //FBX模型加载器
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js' //FBX模型加载器


/**
 * 专门加载模型文件=>模型对象
 * @param {*} pathList 模型文件路径数组
 * @param {*} successFn 接收成功结果回调函数
 */
export const loadManager = (pathList, successFn) => {
  // 定义加载器对象
  const gltfLoader = new GLTFLoader()
  const fbxLoader = new FBXLoader()

  // 保存加载成功模型对象数组
  const model = []
  pathList.forEach(path => {
    if (path.indexOf('fbx') > -1) {
      //如果是fbx文件
      fbxLoader.load(path, (obj) => {
        // 数据结构 存到数组里
        model.push({
          model: obj,
          url: path
        })
        // 如果加载的模型数量和存贮的数量一致就返回
        model.length === pathList.length && successFn(model)
      })

    } else if (path.indexOf('gltf') > -1) {
      // 如果是gltf文件
      gltfLoader.load(path, gltf => {
        model.push({
          model: gltf.scene,
          url: path
        });
        // 如果加载的模型数量和存贮的数量一致就返回
        model.length === pathList.length && successFn(model)
        // (model.length === pathList.length) && suc(model)
      })
    }
  })

  // gltfLoader.load(path, (gltf) => successFn(gltf.scene), (process) => {
  //   //模型加载的经度
  // }, (error) => {
  //   // 报错
  //   throw new Error(error)
  // })

}


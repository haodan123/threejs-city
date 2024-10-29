// 天空类
import * as THREE from 'three'

export class Sky {
  constructor(scene) {
    this.scene = scene
  }
  // 创建并设置天空背景的方法
  setBack(publicPath, pathList) {
    // const loader= new THREE.TextureLoader()
    const loader = new THREE.CubeTextureLoader()
    loader.setPath(publicPath) //公共路径
    loader.load(pathList, (texture) => {
      // console.log(texture);
      // 设置场景的背景图片
      this.scene.background = texture
    })
  }
}

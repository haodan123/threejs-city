<template>
  <div class="page_bg">
    <div class="body_bg">
      <topHeader_sc :textImg="yztextimg"></topHeader_sc>
      <div class="main_body">
        <!-- <div class="sc1_container_item">
          <div class="sc1_view_item anim_in_left1">
            <boxContainer_sc title="城市概括"> </boxContainer_sc>
          </div>
          <div class="sc1_view_item anim_in_left2">
            <boxContainer_sc title="城市年度收入分析"> </boxContainer_sc>
          </div>
          <div class="sc1_view_item anim_in_left3">
            <boxContainer_sc title="城市产业分布"> </boxContainer_sc>
          </div>
        </div> -->
        <!-- <view style="width: 50%"></view> -->
      </div>
      <div class="map_main_view" ref="cityRef" id="cityRef">
        <!-- <div id="loading" class="loading">
          <p id="processing" class="text">园区资源加载中<span id="processing-number"></span>…</p>
          <div id="loading-bar" class="loading-bar"></div>
        </div> -->
      </div>

      <!-- 3个标点start -->
      <div id="tag-1" class="building-name" style="display: none">东方明珠</div>
      <div id="tag-2" class="building-info" style="display: none">
        <div>总平米数： 2000</div>
        <div>容纳人数： 10000</div>
        <div>可出租位： 50</div>
        <div>空余车位： 10</div>
      </div>

      <div id="tag-3" class="building-fire" style="display: none">
        <div>着火大楼： 东方明珠</div>
        <div>着火楼层： 18层</div>
        <div>疏散人数： 1800人</div>
      </div>
      <!-- 3个标点end -->
    </div>
  </div>
</template>

<script setup>
import yztextimg from '@/assets/global_sc/yztextimg.png'
import topHeader_sc from '@/components/topHeader_sc/index.vue'
import boxContainer_sc from '@/components/boxContainer_sc/index.vue'
import { ref, onMounted, computed } from 'vue'
import { useThreeInit } from '@/composables/threesInit.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js' //辅助工具
import { loadManager } from '@/model/loadManager'
import { City } from '@/model/City.js'
import { Ship } from '@/model/Ship.js'
import { ClickHandler } from '@/utils/ClickHandler.js'
import emitter from '@/utils/mitt'
import * as THREE from 'three'

const cityRef = ref()
let scene, camera, renderer, controls, css3dRenderer, css2dRenderer
const init = useThreeInit('cityRef')
// console.log(init)

onMounted(() => {
  // const init = useThreeInit(cityRef.value)
  // scene = init.scene
  // camera = init.camera
  // renderer = init.renderer
  // controls = init.controls
  // css3dRenderer = init.css3dRenderer
  // css2dRenderer = init.css2dRenderer
  // renderer.shadowMap.enabled = true // 开启阴影渲染支持
  // camera.position.set(-148, 55, -101) //摄像头位置 模型比较大 摄像机调远一点
  // // 加载城市和游轮的模型
  // loadManager(['fbx/city.fbx', 'gltf/ship.glb'], modelList => {
  //   // console.log(modelList)
  //   modelList.forEach(item => {
  //     if (item.url === 'fbx/city.fbx') {
  //       // 如果是城市的fbx模型
  //       new City(item.model, scene, camera, controls)
  //     } else if (item.url === 'gltf/ship.glb') {
  //       // 游艇的glb模型
  //       new Ship(item.model, scene, camera, controls)
  //     }
  //     // scene.add(item.model)
  //   })
  // })
  // // three.js 光线投射统一管理类初始化  threejs的点击事件
  // ClickHandler.getInstance().init(camera, cityRef.value)
  // resizeRender()
})

// 监听浏览器宽高
const resizeRender = () => {
  window.addEventListener('resize', () => {
    renderer.setSize(cityRef.value.clientWidth, cityRef.value.clientHeight) //场景的宽高
    camera.aspect = cityRef.value.clientWidth / cityRef.value.clientHeight //摄像机的宽高
    // css3dRenderer.setSize(cityRef.value.clientWidth, cityRef.value.clientHeight) //3d渲染的宽高
    css2dRenderer.setSize(cityRef.value.clientWidth, cityRef.value.clientHeight) //2d渲染的宽高
    camera.updateProjectionMatrix()
  })
}
</script>

<style lang="scss">
/* 容器 */
// .wrap {
//   width: 100vw;
//   height: 100vh;
//   display: flex;
// }
// .cityRef {
//   flex: 3;
//   position: relative;
// }

.loading {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translateX(-50%);
  text-align: center;
  // TODO: 进度条先隐藏
  // display: none;

  .text {
    font-size: 14px;
    color: #909399;
    margin-bottom: 16px;
  }

  .loading-process {
    width: 280px;
    height: 4px;
    background: rgba(255, 255, 255, 0.16);
    border-radius: 20px;
    overflow: hidden;
  }

  .loading-bar {
    transform: scaleX(0.3);
    transform-origin: top left;
    width: 280px;
    height: 4px;
    background: linear-gradient(90deg, #48ffff 0%, #3656ff 100%);
    border-radius: 20px;
    overflow: hidden;
  }
}

// 弹窗的样式 start

.building-name {
  text-align: center;
  color: #fff;
  font-size: 10px;
  background-size: 100% 100%;
  background-image: url('@/assets/icon/text_select.png');
  background-repeat: no-repeat;
  padding: 16px;
}

.building-info {
  display: flex;
  width: 300px;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  text-align: center;
  color: #ccc;
  font-size: 10px;
  padding: 12px;
  background-size: 100% 100%;
  // text.png
  background-image: url('@/assets/icon/modal-bg.png');
  background-repeat: no-repeat;
  margin-top: 60px;
}

.building-info div {
  width: 40%;
  position: relative;
  margin: 10px 0;
}

// 左边
.building-info div:nth-child(odd) {
  text-align: right;
  padding-right: 12px;
}

.building-info div:nth-child(odd)::after {
  position: absolute;
  content: '';
  width: 10px;
  background-color: lightblue;
  border-radius: 10px;
  top: 33%;
  right: 0;
}

// 右边
.building-info div:nth-child(even) {
  text-align: left;
  // padding-left: 12px;
}

.building-info div:nth-child(even)::before {
  position: absolute;
  content: '';
  width: 10px;
  background-color: #00ffff;
  border-radius: 10px;
  top: 33%;
  left: 0;
}

.building-fire {
  color: #ccc;
  font-size: 10px;
  padding: 12px 28px;
  background-size: 100% 100%;
  background-image: url('@/assets/icon/modal-bg.png');
  background-repeat: no-repeat;
}

.building-fire div {
  position: relative;
}

.building-fire div::before {
  position: absolute;
  content: '';
  width: 10px;
  background-color: red;
  border-radius: 10px;
  top: 33%;
  left: -20px;
}
// 弹窗的样式end
</style>

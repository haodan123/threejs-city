<template>
  <div class="page_bg">
    <div class="body_bg">
      <topHeader_sc :textImg="yztextimg"></topHeader_sc>
      <div class="main_body">
        <div class="sc1_container_item">
          <div class="sc1_view_item anim_in_left1">
            <boxContainer_sc title="城市概括">
              <cityOverview></cityOverview>
            </boxContainer_sc>
          </div>

          <div class="sc1_view_item anim_in_left2">
            <boxContainer_sc title="城市年度收入分析">
              <cityAnalysis></cityAnalysis>
            </boxContainer_sc>
          </div>
          <div class="sc1_view_item anim_in_left3">
            <boxContainer_sc title="城市产业分布">
              <cityIndustry></cityIndustry>
            </boxContainer_sc>
          </div>
        </div>
        <!-- <view style="width: 50%"></view> -->
      </div>
      <div class="map_main_view" ref="cityRef" id="cityRef">
        <div id="loading" class="loading">
          <p id="processing" class="text">园区资源加载中<span id="processing-number"></span>…</p>
          <div id="loading-bar" class="loading-bar"></div>
        </div>
      </div>
      <div id="right-btns" class="right-btns" style="pointer-events: all">
        <div @click="btnClick(item)" v-for="item in rightBtnList" :key="item.name">
          <img :id="item.name" :class="item.name" :src="item.img" style="pointer-events: all" alt="" />
        </div>
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
import cityOverview from './components/cityOverview.vue'
import cityAnalysis from './components/cityAnalysis.vue'
import cityIndustry from './components/cityIndustry.vue'
import { ref, onMounted } from 'vue'
import { useThreeInit } from '@/composables/threesInit.js'
import emitter from '@/utils/mitt'

const cityRef = ref()

const rightBtnList = ref([
  {
    name: 'mode-topView',
    img: '/image/city-niaokan.png',
    isOpen: false
  },
  {
    name: 'mode-roaming',
    img: '/image/city-manyou.png',
    isOpen: false
  }
])

// const { getScene, getCamera, getRenderer, getControls, getStats, getCss3dRenderer, getCss2dRenderer, getDimensions } =
//   useThreeInit('cityRef')
// 上面的方法可以获取到hook中的参数  但是必须在onMounted中使用
useThreeInit('cityRef')
onMounted(() => {
  // console.log(getScene())
  // console.log(getCamera())
  // console.log(getRenderer())
  // console.log(getControls())
  // console.log(getStats())
  // console.log(getCss3dRenderer())
  // console.log(getCss2dRenderer())
  // console.log(getDimensions())
})
// 点击右上角按钮
const btnClick = item => {
  // console.log(item)
  item.isOpen = !item.isOpen // 控制打开状态等
  if (item.name === 'mode-topView') {
    // 鸟瞰模式
    flyClick(item.isOpen)
  } else if (item.name === 'mode-roaming') {
    // 漫游模式
    roamingClick(item.isOpen)
  }
}
// 鸟瞰模式
const flyClick = isOpen => {
  emitter.emit('mode-topView', isOpen)
}
// 漫游模式
const roamingClick = isOpen => {
  emitter.emit('mode-roaming', isOpen)
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

//右边的按钮start

.right-btns {
  z-index: 3;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 88px 20px 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    to right,
    rgba(0, 6, 15, 0) 0%,
    rgba(0, 6, 15, 0) 20%,
    rgba(0, 0, 0, 0.4) 70%,
    rgba(0, 0, 0, 0.6) 80%
  );

  div {
    margin-bottom: 48px;
    margin-right: 24px;
  }

  img {
    width: 96px;
    cursor: pointer;
  }
}
// 右边的按钮end
</style>

<template>
  <!-- 背景 -->
  <div class="page_title">
    <div class="title_left_text">
      <!-- <img class="title_left_text_img" src="@/assets/global_sc/header_left.png" /> -->
      <img :src="textImg" alt="" class="title_left_text_name" />
    </div>
    <div class="title_mid_btn">
      <div
        class="title_mid_btn_item"
        @click="tabclick(item.url)"
        :class="tabselect == item.url ? 'active' : ''"
        v-for="(item, index) in navRouter"
        :key="index"
      >
        {{ item.name }}
      </div>
    </div>

    <div class="title_right_content">
      <!-- <switchDemo></switchDemo> -->
      <img class="weather_icon" src="@/assets/global_sc/wenter.png" />
      <div class="weather_text">
        <span>15.1°</span>
        <span>雨</span>
      </div>
      <div class="time">
        <span>{{ day }}</span>
        <span>{{ week }}</span>
        <span>{{ time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getTimeDate } from '@/utils/time.js'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import yztextimg from '@/assets/global_sc/yztextimg.png'
const route = useRoute()
const router = useRouter()
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  textImg: {
    type: String,
    default: yztextimg
  }
})
const day = ref('')
const time = ref('')
const week = ref('')
const tabselect = ref('')

const navRouter = ref([
  {
    url: '/index1',
    name: '养殖专题'
  },
  {
    url: '/index2',
    name: '环控专题'
  },
  {
    url: '/index3',
    name: '监控专题'
  }
])

let timerID = null

onMounted(() => {
  tabselect.value = route.path
  getDay()
  timerID = setInterval(() => {
    getDay()
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timerID)
})

const getDay = () => {
  const { year, month, day: tian, hours, min, second, weekDay } = getTimeDate()
  day.value = `${year}-${month}-${tian}`
  time.value = `${hours}:${min}:${second}`
  week.value = weekDay
}
const tabclick = url => {
  // router.push(url)
  // router.push({
  //   path: router
  // })
}
</script>

<style scoped lang="scss">
.page_title {
  height: var(--header-height);
  width: 100%;
  position: relative;
  background-size: cover;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
  background: url('@/assets/global_sc/header_bg.png') no-repeat 100% 100%;
}
.title_left_img {
  width: 30%;
  height: 100%;
}
.title_left_text {
  padding-left: 10px;
  width: 30%;
  font-weight: bold;
  height: var(--header-height);
  line-height: var(--header-height);
  font-size: 22px;
  letter-spacing: 0.625rem;
  background-clip: text;
  text-align: center;
  position: relative;
  // background: url('@/assets/global_sc/header_left.png') no-repeat 100% 100%;
  // background-size: contain;
}
.title_left_text_img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.title_left_text_name {
  position: absolute;
  width: 60%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.title_name {
  background: linear-gradient(to bottom, #d9fafb, #31dcff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.title_mid_btn {
  color: #39beff;
  display: flex;
  gap: 15px;
}
.title_mid_btn_item {
  height: 40px;
  line-height: 40px;
  width: 130px;
  font-size: 14px;
  cursor: pointer;
  background: url('@/assets/global_sc/btnn.png') no-repeat;
  background-size: 100% 100%;
  padding-left: 30px;
  // text-align: center;
  &:hover {
    text-shadow:
      0 0 3px #5e8fce,
      0 0 3px #5e8fce,
      0 0 3px #5e8fce,
      0 0 3px #5e8fce;
  }
}
.active {
  color: #1ee2e3;
  background: url('@/assets/global_sc/btnn_a.png') no-repeat;
  // background-size: contain;
  background-size: 100% 100%;
  text-shadow:
    0 0 3px #5e8fce,
    0 0 3px #5e8fce,
    0 0 3px #5e8fce,
    0 0 3px #5e8fce;
}

.title_right_content {
  width: 25%;
  display: flex;
  gap: 20px;
  font-size: 0.875rem;
  align-items: center;
  padding-right: 10px;

  .weather_icon {
    width: 30px;
    height: 30px;
  }
  .weather_text {
    color: #e2b140;
    display: flex;
    gap: 10px;
  }
  .time {
    display: flex;
    gap: 10px;
  }
}
</style>

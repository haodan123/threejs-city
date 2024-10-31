<template>
  <div class="main-box" style="width: 100%; height: 100%; position: relative">
    <div class="main-content" ref="chartRef" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup>
import { debounce } from '@/utils/index.js'
import { ref, markRaw, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { DataManager } from '@/utils/DataManager'
const chartRef = ref()
const chartInstance = ref()

onMounted(() => {
  initChart()
  window.addEventListener('resize', screenAdapter)
})
onUnmounted(() => {
  chartInstance.value.dispose()
  window.removeEventListener('resize', screenAdapter)
})

const initChart = async () => {
  chartInstance.value = markRaw(echarts.init(chartRef.value))

  // 获取默认数据
  let dataJson = await DataManager.getInstance().getData()

  // 解构需要的数据
  const {
    parkIncome: { yIncome }
  } = dataJson
  const initOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      // 让图表占满容器
      top: '10px',
      left: '0px',
      right: '0px',
      bottom: '0px',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
          show: false
        },
        data: ['6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月']
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '居民收入情况',
        type: 'bar',
        barWidth: '10px',
        data: yIncome.map((item, index) => {
          const color =
            index % 2 === 0
              ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.23, color: '#74c0f8' },
                  { offset: 1, color: 'rgba(116,192,248,0.00)' }
                ])
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.23, color: '#ff7152' },
                  { offset: 1, color: 'rgba(255,113,82,0.00)' }
                ])
          return { value: item, itemStyle: { color } }
        })
      }
    ],
    textStyle: {
      color: '#B4C0CC'
    }
  }
  chartInstance.value.setOption(initOption)
  // readData()
}

const screenAdapter = debounce(() => {
  const titleFontSize = (chartRef.value.offsetWidth / 100) * 3.6
  // this.titleFontSize = titleFontSize;
  const adapterOption = {
    title: {},
    // 图例的大小
    legend: {
      itemWidth: titleFontSize / 2,
      itemHeight: titleFontSize / 2,
      itemGap: titleFontSize / 2
    }
  }
  chartInstance.value.setOption(adapterOption)
  chartInstance.value.resize()
})
</script>

<style scoped lang="scss">
.main-box {
  width: 100%;
  height: 100%;
  color: rgba(75, 255, 252, 1);
}

.main-content {
  width: 100%;
  height: 100%;
}
</style>

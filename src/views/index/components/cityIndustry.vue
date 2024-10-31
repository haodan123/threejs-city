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
  const { parkIndustry } = dataJson
  const initOption = {
    color: ['#00B2FF', '#2CF2FF', '#892CFF', '#FF624D', '#FFCF54', '#86ECA2'],
    legend: {
      itemGap: 20,
      bottom: '0',
      icon: 'rect',
      itemHeight: 10, // 图例icon高度
      itemWidth: 10, // 图例icon宽度
      textStyle: {
        color: '#c6d1db'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '产业分布',
        type: 'pie',
        radius: ['55%', '60%'], // 设置内圈与外圈的半径使其呈现为环形
        center: ['50%', '40%'], // 圆心位置， 用于调整整个图的位置
        tooltip: {
          trigger: 'item',
          formatter: params => {
            return `${params.seriesName}</br><div style='display:flex;justify-content: space-between;'><div>${params.marker}${params.name}</div><div>${params.percent}%</div></div>`
          }
        },
        label: {
          show: false,
          position: 'center'
        },
        data: parkIndustry
      }
    ]
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

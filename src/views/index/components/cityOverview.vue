<template>
  <div class="cityOverview_container">
    <div class="icons-container">
      <div class="item">
        <div class="icons-item building-icon">
          <span id="building-number" class="number"> 28 </span>
        </div>
        <span class="title">电量峰值</span>
        <span class="unity">（度）</span>
      </div>
      <div class="item">
        <div class="icons-item enterprise-icon">
          <span id="enterprise-number" class="number"> 6 </span>
        </div>
        <span class="title"> 实时温度</span>
        <span class="unity">（度）</span>
      </div>
      <div class="item">
        <div class="icons-item car-icon">
          <span id="car-number" class="number"> 1530 </span>
        </div>
        <span class="title">出租车运力</span>
        <span class="unity">（个）</span>
      </div>
      <div class="item">
        <div class="icons-item rod-icon">
          <span id="rod-number" class="number"> 48 </span>
        </div>
        <span class="title">拥堵程度</span>
        <span class="unity">（个）</span>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.cityOverview_container {
  width: 100%;
  height: 100%;
}

.icons-container {
  display: flex;
  justify-content: space-between;

  .item {
    text-align: center;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 10px 0;

    .icons-item {
      position: relative;
      height: 80px;

      .number {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 18px;
        font-family: FontquanXinYiGuanHeiTi, FontquanXinYiGuanHeiTi-Regular;
        color: #ffffff;
      }
    }

    .building-icon {
      background: url('@/assets/cityOverview/building-icon.png') no-repeat 50% 0 / contain;
    }

    .enterprise-icon {
      background: url('@/assets/cityOverview/enterprise-icon.png') no-repeat 50% 0 / contain;
    }

    .rod-icon {
      background: url('@/assets/cityOverview/rod-icon.png') no-repeat 50% 0 / contain;
    }

    .car-icon {
      background: url('@/assets/cityOverview/car-icon.png') no-repeat 50% 0 / contain;
    }

    .title,
    .unity {
      font-size: 14px;
      color: #cdd7e1;
    }

    .title {
      margin-top: 8px;
    }
  }
}
</style>

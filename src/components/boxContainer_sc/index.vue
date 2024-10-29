<template>
  <div class="box_container_page">
    <boxTitle_sc :img="img" :title="title"></boxTitle_sc>
    <div class="container_content_view" @click.stop>
      <div class="real_content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import defIcon from '@/assets/sc1/you3_icon.png'

// import boxTitle from '@/components/boxTitle/index.vue'
import boxTitle_sc from '@/components/boxTitle_sc/index.vue'
defineProps({
  title: {
    type: String,
    default: '',
    require: true
  },
  img: {
    default: defIcon,
    type: String
  }
})
</script>

<style scoped lang="scss">
.box_container_page {
  position: relative;
  width: 100%;
  height: 100%;
  width: 100%;
  background: url('@/assets/global_sc/border.png') no-repeat;
  background-size: 100% 100%;
  padding: 0.625rem;
  background-color: rgba(0, 0, 0, 0.1);
}

.container_content_view {
  height: calc(100% - var(--box-sc-title-height));
  width: 100%;
  position: relative;
  .real_content {
    position: absolute;
    inset: 0;
    right: 2%;
    left: 2%;
  }
}
</style>

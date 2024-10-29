<template>
  <div class="top_title">
    <img class="top_img" :src="img"></img>
    <div class="top_text">{{ title }}</div>
    <img v-if="noBtmline" src="@/assets/global_sc/border_line.png" alt="" class="line_btm">
  </div>
</template>

<script setup>
import defIcon from '@/assets/sc1/you3_icon.png'
defineProps({
  title: {
      default: '',
      type: String
    },
    img: {
      default: defIcon,
      type: String
    },
    noBtmline:{
      type:Boolean,
      default:false
    }
})
</script>



<style scoped lang="scss">
.top_title {
  width: 100%;
  height: var(--box-sc-title-height);
  display: flex;
  padding: 0 5%;
  gap: .625rem;
  color: #e8f9ff;
  font-size: .875rem;
  position: relative;
  align-items: center;
  display: flex;
}
.top_img {
  width: .9375rem;
  height: .9375rem;
}
.line_btm{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.top_text {
  font-size: .875rem;
}
</style>

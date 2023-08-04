<template>
  <!-- <div class="footer">Copyright 2014-2020 智网网络. All Rights Reserved</div> -->
  <div />
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.footer {
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #F0F2F5;
  font-size: $fontSizeExtraExtraSmall;
  // 浮动底部
  // position: fixed;
  // bottom: 0;
  // right: 0;
}
</style>

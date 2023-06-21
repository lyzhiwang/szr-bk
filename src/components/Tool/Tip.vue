<template>
  <el-row class="tip-title">
    <div :class="'tip-' + size">
      <b>{{ title }}</b>
      <slot />
      <small>
        <slot name="small" />
      </small>
    </div>
  </el-row>
</template>

<script>
export default {
  name: 'Tip',
  props: {
    size: {
      type: String,
      default: 'small'
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.tip-title {
  margin-bottom: 20px;
  line-height: 22px;
  border-radius: 0 2px 2px 0;
  border-left: 5px solid $mainColor;
  background-color: #f5f7fa;
  color: $fontColorDefault;
  .tip-big {
    font-size: $fontSizeMedium;
    padding: 15px;
    font-size: $fontSizeMedium;
  }
  .tip-small {
    padding: 10px;
    font-size: $fontSizeSmall;
  }
}
</style>

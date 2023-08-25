<template>
  <el-dialog
    append-to-body
    top="7vh"
    title="预览"
    :visible.sync="isDialogVisible"
    :fullscreen="$store.state.app.device === 'mobile' ? true : false"
    class="dialog"
    @close="close"
  >
    <audio v-if="type === 'audio'" :src="src" controls="controls">
      您的浏览器不支持 audio 标签。
    </audio>
    <video v-else-if="type === 'video'" :src="src" controls="controls" class="yulan">
      您的浏览器不支持 video 标签。
    </video>
    <img v-else-if="type === 'img'" :src="src" class="yulan" alt>
  </el-dialog>
</template>
<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'img'
    },
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isDialogVisible: false
    }
  },
  watch: {
    isVisible: function(newV, oldV) {
      this.isDialogVisible = newV
      if (this.isVisible === false) {
        this.close()
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.yulan {
  max-width: 100%;
  max-height: 70vh;
  display: block;
  margin: 0 auto;
}
>>> .el-dialog__body {
  padding: 0 20px 20px;
}
</style>

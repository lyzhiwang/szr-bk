<template>
  <el-tree
    ref="tree"
    :data="treeData"
    :default-expanded-keys="expandedKey"
    :default-checked-keys="checkedKey"
    :props="defaultProps"
    :check-strictly="checkStrictly"
    :default-expand-all="expand"
    :show-checkbox="showCheckbox"
    node-key="id"
    @node-click="handlerClick"
  />
</template>
<script>
import { getAuthorityTree } from '@/utils/authority'

export default {
  name: 'AuthorityTree',
  props: {
    expandedKey: {
      type: Array,
      default: function() {
        return []
      }
    },
    checkedKey: {
      type: Array,
      default: function() {
        return []
      }
    },
    data: {
      type: Array,
      default() { return [] }
    },
    // 是否级联 ，默认无级联
    checkStrictly: {
      type: Boolean,
      default: true
    },
    // 是否展开
    expand: {
      type: Boolean,
      default: false
    },
    // 是否展示选择框
    showCheckbox: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    data: {
      deep: true,
      handler(newV, oldV) {
        this.formatTree(newV)
      }
    }
  },
  created() {
    if (this.data.length > 0) this.formatTree(this.data)
  },
  methods: {
    formatTree(data) {
      this.treeData = getAuthorityTree(data)
    },
    clearTree() {
      // 清空tree
      this.$refs.tree.setCheckedKeys([])
    },
    getCheckedKeys() {
      // 获取选中节点
      return this.$refs.tree.getCheckedKeys()
    },
    handlerClick(o, n, c) {
      this.$emit('click', o)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>


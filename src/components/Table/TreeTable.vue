<template>

  <el-table
    :data="formatData"
    style="width: 100%;margin-bottom: 20px;"
    row-key="id"
    border
    lazy
    :load="load"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
  >
    <el-table-column
      v-for="(column, index) in columns"
      :key="index"
      :label="column.text"
      :sortable="column.sortable"
      :width="column.width"
      :fixed="column.text==='操作'?'right':false"
    >
      <template v-slot:default="scope">
        <span v-if="!column.isCustomize">{{ scope.row[column.value] }}</span>
        <slot v-else :column="column" :index="index" :scope="scope" :name="column.value" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getAreaStorage } from '@/utils/storage'

export default {
  name: 'TreeTable',
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    formatData:function(){
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      this.format(this.data)
      return this.data;
    },
  },
  data(){
    return{
      children:[]
    }
  },
  methods: {
    async load(tree, treeNode, resolve) {
      this.findArea(getAreaStorage(), tree.id)
      this.format(this.children)
      resolve(this.children)
    },
    // 添加hasChilren字段
    format(data){
      for(let item of data){
        item.hasChildren = item.children ? true : false
      }
    },
    // 用于懒加载找到对应子数组
    findArea(allData, id) {
      let flag = false
      let res = []
      const findChild = allData => {
        let i = 0
        while (!flag && i < allData.length) {
          if (allData[i].id === id) {
            flag = true
            this.children= allData[i].children
            break
          }
          if (allData[i].children && allData[i].children.length > 0) {
            findChild(allData[i].children)
          }
          i++
        }
      }
      if(flag) return res
      else findChild(allData)
    }
  }
}
</script>

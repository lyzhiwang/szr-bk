<template>
  <div class="pageTable">
    <el-table :data="tableData" border fixed>
      <el-table-column
        v-for="(item,index) in tableHeader"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :width="item.width?item.width:''"
        :sortable="item.sortable"
        :fixed="item.label==='操作'?'right':false"
        :align="item.align || 'center'"
      >
        <template slot-scope="scope">
          <slot
            v-if="item.isCustomize"
            :scope="scope"
            :index="index"
            :name="item.prop"
          >{{ scope.row[item.prop] }}</slot>
          <div v-else>{{ scope.row[item.prop] }}</div>
        </template>
      </el-table-column>
      <slot />
    </el-table>
    <!-- 分页 -->
    <div v-if="hasPagination" class="box-pagination">
      <el-pagination
        :current-page="pagination.page"
        :page-sizes="[ 10, 20, 30,40,50,60,70,80,90,100]"
        :page-size="pagination.size"
        :total="pagination.total"
        :layout="layout"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageTable',
  props: {
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    hasPagination: {
      type: Boolean,
      default: true
    },
    tableHeader: {
      type: Array,
      default() {
        return [{
          prop: '',
          width: '',
          label: '',
          isCustomize: false, // true显示自定义内容；false显示默认字段
          sortable: ''
        }]
      }
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    pagination: {
      type: Object,
      default() {
        return {
          page: 1, // 当前页数
          size: 10, // 每页显示条目个数
          total: 100 // 总条目数
        }
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    handleSizeChange(val) {
      this.pagination.size = val
      this.$emit('refreshTable', this.pagination)
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.$emit('refreshTable', this.pagination)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.box-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>

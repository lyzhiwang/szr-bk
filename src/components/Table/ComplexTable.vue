<template>
  <div>
    <el-card v-show="hasSearch" class="search-card">
      <slot name="search" />
    </el-card>
    <slot />
    <el-card>
      <template #header>
        <div v-if="pageName" class="card-header">
          <span>{{ pageName }}</span>
          <slot name="btn" />
        </div>
      </template>
      <div class="content">
        <el-table :data="tableData" :border="border" fixed @selection-change="handleSelectionChange" @row-click="handleRowClick">
          <!-- 展开行 -->
          <el-table-column v-if="expand" type="expand">
            <template v-slot:default="props">
              <el-form label-position="left">
                <el-form-item
                  v-for="(item,index) in expandHeader"
                  :key="index + item.prop"
                  :label="item.label"
                  :prop="item.prop"
                >
                  <slot v-if="item.isCustomize" :scope="props" :index="index" :name="item.prop">
                    {{ props.row[item.prop] }}
                  </slot>
                  <template v-else>{{ props.row[item.prop] }}</template>
                  <!-- </template> -->
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <!-- 筛选框 -->
          <el-table-column v-if="hasSelection" type="selection" width="35" align="center" />
          <!-- 表格 -->
          <el-table-column
            v-for="(item,index) in tableHeader"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width?item.width:''"
            :sortable="item.sortable"
            :fixed="item.label==='操作'?'right':false"
            :align="item.align?item.align:'center'"
            :show-overflow-tooltip="item.over"
          >
            <template v-slot:default="scope">
              <slot v-if="item.isCustomize" :scope="scope" :index="index" :name="item.prop">
                {{ scope.row[item.prop] }}
              </slot>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ComplexTable',
  props: {
    hasSearch: {
      type: Boolean,
      default: true
    },
    hasSelection: {
      type: Boolean,
      default: false
    },
    hasPagination: {
      type: Boolean,
      default: true
    },
    pageName: {
      type: String,
      default: ''
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
    expandHeader: {
      type: Array,
      default() {}
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    expand: { // 是否展开行
      type: Boolean,
      default: false
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
    },
    border: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pagination.size = val
      this.$emit('refreshTable', this.pagination)
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.$emit('refreshTable', this.pagination)
    },
    handleSelectionChange(val) {
      this.$emit('changeMultipleSelection', val)
    },
    handleRowClick(row, column, event) {
      this.$emit('rowClick', row, column, event)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.search-card {
  margin-bottom: 20px;
}
.box-pagination {
  text-align: center;
  margin-top: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-table__expanded-cell .el-form-item{
  margin-bottom: 0;
}
::v-deep td{
  overflow: hidden;
}
</style>

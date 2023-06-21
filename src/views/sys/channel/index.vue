<template>
  <div class="app-container">
    <complex-table
      :page-name="'资源分类管理'"
      :has-search="false"
      :has-pagination="false"
      :table-header="tableHeader"
      :table-data="channelList"
      @refreshTable="loadList"
    >
      <template v-slot:btn>
        <el-button v-has="'ChannelStore'" type="primary" size="medium" @click="visible = true">添加资源分类</el-button>
      </template>

      <!-- 操作 -->
      <template v-slot:action="slotProps">
        <el-button
          v-has="'ChannelUpdate'"
          type="primary"
          size="small"
          @click="editChannel(slotProps.scope.row)"
        >编辑</el-button>
        <el-button
          v-has="'ChannelDestroy'"
          type="warning"
          size="small"
          @click="deleteChannel(slotProps.scope.row)"
        >删除</el-button>
      </template>
    </complex-table>
    <!-- 修改弹出框 -->
    <channel-dialog
      :is-visible="visible"
      :form="form"
      @refresh="loadList"
      @close="close"
    />
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import ChannelDialog from '@/components/Dialog/ChannelDialog' // base on element-ui

import { deleteArrayById } from '@/utils'

export default {
  name: 'Channel',
  components: { ComplexTable, ChannelDialog },
  data() {
    return {
      tableHeader: [
        { prop: 'id', label: 'ID', sortable: true, width: 80 },
        { prop: 'title', label: '名称' },
        { prop: 'sort', label: '排序' },
        { prop: 'action', label: '操作', width: 160, isCustomize: true }
      ],
      channelList: [],
      listLoading: true,
      visible: false,
      form: {
        title: '',
        sort: ''
      }
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    // 列表
    loadList() {
      // 页面table加载
      this.listLoading = true
      this.apiBtn('ChannelIndex')
        .then(response => {
          this.channelList = response.data
          this.listLoading = false
        })
    },
    editChannel(row) {
      // 编辑资源分类
      this.form = { ...row }
      this.visible = true
    },
    deleteChannel(row) {
      // 删除资源分类
      this.defalultConfirm('此操作将永久删除该资源分类', () => {
        this.apiBtn('ChannelDestroy', { id: row.id })
          .then(res => {
            // 为this.channelList删除数据
            deleteArrayById(this.channelList, row.id)
          })
      })
    },
    close() {
      this.visible = false
      this.form = {
        title: '',
        sort: ''
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>

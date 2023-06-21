<template>
  <div class="app-container">
    <complex-table
      :page-name="'资源字典管理'"
      :has-search="false"
      :has-pagination="false"
      :table-header="tableHeader"
      :table-data="systemList"
      @refreshTable="loadList"
    >

      <template v-slot:btn>
        <el-button v-has="'SystemStore'" type="primary" size="medium" @click="visible = true">添加资源字典</el-button>
      </template>
      <template v-slot:channel="slotProps">
        <span>{{ channelOption[slotProps.scope.row.channel] }}</span>
      </template>

      <template v-slot:type="slotProps">
        <span>{{ typeOption[slotProps.scope.row.type] }}</span>
      </template>
      <!-- 操作 -->
      <template v-slot:action="slotProps">
        <el-button
          v-has="'SystemUpdate'"
          type="primary"
          size="small"
          @click="editSystem(slotProps.scope.row)"
        >编辑</el-button>
        <el-button
          v-has="'SystemDestroy'"
          type="warning"
          size="small"
          @click="deleteSystem(slotProps.scope.row)"
        >删除</el-button>
      </template>
    </complex-table>
    <!-- 修改弹出框 -->
    <system-dialog
      :is-visible="visible"
      :form="form"
      :channel-option="channelOption"
      :type-option="typeOption"
      @refresh="loadList"
      @close="close"
    />
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import SystemDialog from '@/components/Dialog/SystemDialog' // base on element-ui

import { deleteArrayById } from '@/utils'

export default {
  name: 'System',
  components: { ComplexTable, SystemDialog },
  data() {
    return {
      tableHeader: [
        {
          prop: 'id',
          label: 'ID',
          sortable: true,
          width: 80
        },
        {
          prop: 'title',
          label: '名称'
        },
        {
          prop: 'name',
          label: '命名'
        },
        {
          prop: 'channel',
          label: '资源分类',
          isCustomize: true
        },
        {
          prop: 'type',
          label: '表单类型',
          isCustomize: true
        },
        {
          prop: 'action',
          label: '操作',
          width: 160,
          isCustomize: true
        }
      ],
      channelOption: {},
      typeOption: { 1: 'input', 2: 'image', 3: 'textarea', 4: 'editor' },
      systemList: [],
      listLoading: true,
      visible: false,
      form: {
        title: '',
        name: '',
        channel: '',
        type: ''
      }
    }
  },
  created() {
    this.getChannel()
    this.loadList()
  },
  methods: {
    // 分类列表
    getChannel() {
      this.apiBtn('ChannelIndex')
        .then(response => {
          response.data.map(item => {
            this.channelOption[item.id] = item.title
          })
        })
    },
    // 列表
    loadList() {
      // 页面table加载
      this.listLoading = true
      this.apiBtn('SystemIndex')
        .then(response => {
          this.systemList = response.data
          this.listLoading = false
        })
    },
    editSystem(row) {
      // 编辑资源字典
      this.form = { ...row }
      this.visible = true
    },
    deleteSystem(row) {
      // 删除资源字典
      this.defalultConfirm('此操作将永久删除该资源字典', () => {
        this.apiBtn('SystemDestroy', { id: row.id })
          .then(res => {
            // 为this.systemList删除数据
            deleteArrayById(this.systemList, row.id)
          })
      })
    },
    close() {
      this.visible = false
      this.form = {
        title: '',
        name: '',
        channel: '',
        type: ''
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

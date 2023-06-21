<template>
  <div class="app-container">
    <ComplexTable :has-selection="searchStore" :table-header="tableHeader" :table-data="tableData" :pagination="pagination" page-name="客户管理" @refreshTable="getList" @changeMultipleSelection="handleSelectionChange">
      <!-- 搜索框 -->
      <template v-slot:search>
        <el-select v-if="checkRole(['admin','operation','account'])" v-model="formSearch.role_id" placeholder="请选择角色" clearable @change="roleChange">
          <el-option v-for="item in roleList" :key="item.id+item.name" :label="item.name" :value="item.id" />
        </el-select>

        <el-select v-if="checkRole(['admin'])" v-model="formSearch.deleted_at" placeholder="请选择用户状态" clearable>
          <el-option v-for="item in deletedOptions" :key="item.label" :label="item.label" :value="item.value" />
        </el-select>

        <el-select v-if="checkRole(['admin','operation','account'])" v-model="formSearch.review" placeholder="请选择审核状态" clearable>
          <el-option v-for="item in reviewOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-input v-model="otherSearch.keywords" placeholder="请输入ID|用户名|备注" clearable @keyup.native.enter="search" @clear="getList" />

        <DatePicker v-if="checkRole(['admin','operation','account'])" :value="formSearch.inputtime" :has-shortcuts="true" value-format="timestamp" @changeTime="changeTime" />

        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </template>

      <!-- 为门店选择代理、添加按钮 -->
      <template v-slot:btn>
        <div class="select-box">
          <template v-if="searchStore">
            <el-cascader v-model="agentSelect" v-has="'AdminMigrate'" :options="selectList" :props="selectProps" filterable clearable placeholder="请选择代理">
              <template slot-scope="{ data }">
                <span>{{ data.username }}</span>
                <span v-if="data.remark"> ({{ data.remark }}) </span>
              </template>
            </el-cascader>
            <el-button v-has="'AdminMigrate'" type="primary" icon="el-icon-connection" @click="moveStore">转移用户</el-button>
          </template>

          <el-button v-has="'AdminExport'" icon="el-icon-download" @click="exportToExcel()">导出</el-button>

          <el-button v-has="'AdminStore'" icon="el-icon-plus" @click="toRedirect('AdminStore')">添加用户</el-button>
        </div>
      </template>

      <!-- 角色 -->
      <template v-slot:role="props">
        <span>{{ roleOption[props.scope.row.role_id] }}</span>
      </template>

      <!-- 地区 -->
      <template v-slot:area="props">
        <span>{{ props.scope.row.area | areaFilter }}</span>
      </template>

      <!-- 备注 -->
      <template v-slot:remark="props">
        <el-input
          v-if="props.scope.row.isRemark"
          v-model="props.scope.row.remark"
          v-focus="props.scope.row.isRemark"
          style="width:100%;"
          placeholder="最多输入10个字符"
          maxlength="10"
          @blur="blurRemark(props.scope.row)"
          @change="changeRemark(props.scope.row)"
        />
        <el-tooltip v-else :content="props.scope.row[props.scope.column.property]" placement="top-start">
          <span class="ellipsis" @dblclick="focusRemark(props.scope.row)" @touchend="focusRemark(props.scope.row)">
            {{ props.scope.row[props.scope.column.property] }}
          </span>
        </el-tooltip>
      </template>

      <!-- 代理商信息是否展示 1不展示 0展示 -->
      <template v-slot:agent="props">
        <el-tooltip :content="'当前状态: ' + (props.scope.row.close_agent_info === 1 ? '不展示代理商信息' : '展示代理商信息')" placement="top">
          <el-switch v-model="props.scope.row.close_agent_info" :active-value="0" :inactive-value="1" @change="changeAgent(props.scope.row)" />
        </el-tooltip>
      </template>

      <!-- 有效期 -->
      <template v-slot:date="props">
        <span v-if="props.scope.row.start_time > 0">{{ props.scope.row.start_time | parseTime('{y}-{m}-{d}') }}</span><span v-if="props.scope.row.end_time > 0">~{{ props.scope.row.end_time | parseTime('{y}-{m}-{d}') }}</span>
      </template>

      <!-- 门店 -->
      <template v-slot:store="props">
        <div :class="checkRole(['agent'])?'store':''" @click="storeHandler(props.scope.row)">{{ props.scope.row.store }}</div>
      </template>

      <!-- 操作 -->
      <template v-slot:operation="props">
        <div class="btn-box">
          <template v-if="props.scope.row.deleted_at">
            <el-button v-has="'AdminRestore'" type="warning" size="small" @click="restore(props.scope.row)">恢复</el-button>
          </template>
          <template v-else>
            <el-button v-has="'AdminUpdate'" type="primary" size="small" @click="toRedirect('AdminUpdate', {id:props.scope.row.id})">编辑</el-button>
            <el-button v-has="'AdminDestroy'" type="danger" size="small" @click="deleteUser('AdminDestroy', props.scope.row)">删除</el-button>
            <el-button v-has="'AdminLabourStore'" type="success" size="small" @click="labour('AdminLabourStore', props.scope.row)">充值</el-button>
            <el-button v-if="showCheck(props.scope.row)" type="warning" size="small" @click="toRedirect('AdminCheck', {id:props.scope.row.id})">审核</el-button>
          </template>
          <el-button v-if="showDetail(props.scope.row)" type="info" size="small" @click="toRedirect('AdminCheck', {id:props.scope.row.id})">详情</el-button>
        </div>
      </template>
    </ComplexTable>
    <!-- 充值 -->
    <laboure-dialog :is-visible="isVisible" :user="laboureUser" @close="isVisible=false" @success="handlerSuccess" />

    <agent-change-dialog :is-visible="isVisibleAgent" :store="selectedStore" @close="isVisibleAgent=false" @success="getList" />
  </div>
</template>

<script>

import ComplexTable from '@/components/Table/ComplexTable'
import LaboureDialog from '@/components/Dialog/LaboureDialog'
import AgentChangeDialog from '@/components/Dialog/AgentChangeDialog'
import DatePicker from '@/components/Tool/DatePicker'

export default {
  components: { ComplexTable, DatePicker, LaboureDialog, AgentChangeDialog },
  data() {
    return {
      isInit: true, // 防止初始化搜索数据重复请求
      formSearch: {
        role_id: '',
        deleted_at: '',
        review: '',
        inputtime: [],
        agent_id: 0
      },
      otherSearch: {
        keywords: '',
        user_id: ''
      },
      deletedOptions: [
        { label: '正常用户', value: false },
        { label: '已删除用户', value: true }
      ],
      reviewOptions: [
        { label: '待审核', value: 1 },
        { label: '已审核', value: 2 },
        { label: '已驳回', value: 3 },
        { label: '未填写', value: 4 }
      ],
      agentSelect: [], // 下拉选择框、代理
      selectList: [
        { id: 9, username: '代理商', children: [] }
      ],
      selectProps: {
        value: 'id',
        label: 'username',
        multiple: false
      },
      tableData: [],
      pagination: {
        page: 1, // 当前页数
        size: 10, // 每页显示条目个数
        total: 0
      },
      oldRemark: '', // 修改前的备注
      isVisible: false, // 充值
      isVisibleAgent: false, // 转移门店的弹窗
      laboureUser: {}, // 充值用户
      selectedStore: []
    }
  },
  computed: {
    searchStore: function() {
      return this.checkRole(['store'], this.formSearch.role_id)
    },
    roleList: function() {
      return this.$store.state.config.roleList
    },
    // 角色
    roleOption: function() {
      const res = {}
      for (const item of this.roleList) {
        res[Number(item.id)] = item.name
      }
      return res
    },
    tableHeader: function() {
      const header = [
        { prop: 'id', label: 'ID', width: 70, sortable: true },
        { prop: 'username', label: '用户', width: 120 },
        { prop: 'remark', label: '备注', isCustomize: true },
        { prop: 'area', label: '地区', isCustomize: true },
        { prop: 'role', label: '角色', width: 100, isCustomize: true },
        { prop: 'date', label: '有效期', width: 200, isCustomize: true, sortable: true },
        { prop: 'money', label: '余额', width: 100 },
        { prop: 'operation', label: '操作', width: 210, isCustomize: true }
      ]
      if (this.checkRole(['admin', 'operation', 'agent'])) header.splice(6, 0, { prop: 'agent', label: '展示代理商信息', width: 80, isCustomize: true })
      if (this.checkRole(['admin', 'operation', 'account'])) header.splice(9, 0, { prop: 'store', label: '门店', width: 80, sortable: true, isCustomize: true })
      if (this.checkRole(['admin'])) header.splice(10, 0, { prop: 'deleted_at', label: '删除时间' })

      return header
    }
  },
  watch: {
    formSearch: {
      deep: true,
      handler(newVal) {
        if (this.isInit) return
        this.getList()
        this.$store.commit('search/SearchUpdate', { name: 'agent', key: 'formSearch', value: newVal })
      }
    },
    otherSearch: {
      deep: true,
      handler(newVal, oldVal) {
        this.$store.commit('search/SearchUpdate', { name: 'agent', key: 'otherSearch', value: newVal })
      }
    },
    pagination: {
      deep: true,
      handler(newVal, oldVal) {
        this.$store.commit('search/SearchUpdate', { name: 'agent', key: 'pagination', value: newVal })
      }
    },
    agentSelect: function(newVal) {
      if (this.isInit) return
      this.formSearch.agent_id = newVal[newVal.length - 1] || 0
      this.$store.commit('search/SearchUpdate', { name: 'agent', key: 'agentSelect', value: newVal })
    }
  },
  created() {
    this.getSelectList()
    this.$store.dispatch('config/GetRoleList')
      .then(res => {
        this.$store.dispatch('area/GetArea')
          .then(res => {
            this.initSearch()
          })
      })
  },
  methods: {
    // 初始化搜索
    initSearch() {
      this.formSearch = { ...this.$store.state.search.agent.formSearch }
      this.otherSearch = { ...this.$store.state.search.agent.otherSearch }
      this.agentSelect = [...this.$store.state.search.agent.agentSelect]
      this.getList(this.$store.state.search.agent.pagination)
    },
    // 备注：切换input与span
    focusRemark(row) {
      // 代理商创建门店时，可填写备注，不能修改备注
      if (this.checkRole(['admin', 'operation'])) {
        this.oldRemark = row.remark
        this.$set(row, 'isRemark', true)
      }
    },
    blurRemark(row) {
      if (row.remark) this.$set(row, 'isRemark', false)
    },
    // 修改备注
    changeRemark(row) {
      const msg = '修改该' + row.username + '的备注为：' + row.remark
      const params = { ...row }
      const successBack = () => {
        this.$set(row, 'oldRemark', row.remark)
        this.blurRemark(row)
      }
      const catchBack = () => {
        this.$set(row, 'remark', this.oldRemark)
        this.blurRemark(row)
      }
      this.patchUser(msg, 'AdminUpdate', params, successBack, catchBack)
    },
    // 展示代理商信息
    changeAgent(row) {
      const msg = '修改' + row.username + (row.close_agent_info ? '不展示代理商信息' : '展示代理商信息')
      const params = { ...row }
      const successBack = () => {}
      const catchBack = () => {
        this.$set(row, 'close_agent_info', row.close_agent_info ? 0 : 1)
      }
      this.patchUser(msg, 'AdminUpdate', params, successBack, catchBack)
    },
    // 恢复用户
    restore(row) {
      const msg = '恢复' + row.username + '的使用'
      const params = {
        ...row,
        deleted_at: ''
      }
      const successBack = () => {
        this.$set(row, 'deleted_at', '')
      }
      this.patchUser(msg, 'AdminRestore', params, successBack)
    },
    // 修改用户
    patchUser(msg, name, params, successBack, catchBack) {
      const callBack = () => {
        this.apiBtn(name, params)
          .then(res => {
            successBack()
          })
          .catch(res => {
            catchBack()
          })
      }
      this.defalultConfirm(msg, callBack, catchBack)
    },
    // 删除
    deleteUser(name, row) {
      const msg = '此操作将删除' + row.username
      const callBack = () => {
        this.apiBtn(name, { id: row.id })
          .then(res => {
            this.$set(row, 'deleted_at', res.data.deleted_at)
          })
      }
      this.defalultConfirm(msg, callBack)
    },
    // 普通查找
    search() {
      this.getList()
    },
    getList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else this.initPagination()
      const params = {
        ...this.formSearch,
        ...this.otherSearch,
        page: this.pagination.page,
        size: this.pagination.size
      }
      if (!params.agent_id) delete params.agent_id
      this.apiBtn('AdminIndex', params).then(res => {
        // 增加字段isRemark：是否修改备注
        for (var item of res.data) {
          item['isRemark'] = false
        }
        this.tableData = res.data
        this.pagination.total = res.meta.total
        if (this.isInit) this.isInit = false
      })
    },
    // 获取下拉选择框中的代理商列表
    getSelectList() {
      if (this.checkRole(['admin', 'operation', 'account'])) {
        for (const item of this.selectList) {
          const params = {
            role_id: item.id,
            size: 100,
            page: 1
          }
          if (!item.children.length) {
            this.apiBtn('AdminIndex', params).then(res => {
              item.children = res.data.list
            })
          }
        }
      }
    },
    // 是否显示审核按钮
    showCheck(row) {
      return this.checkRole(['admin', 'operation']) && this.checkRole(['agent', 'store'], row.role_id) && row.review === 1 && this.$_has('AdminCheck')
    },
    // 是否展示已有审核结果的审核信息按钮
    showDetail(row) {
      return this.checkRole(['admin', 'operation']) && this.checkRole(['agent', 'store'], row.role_id) && [2, 3].includes(row.review) && this.$_has('AdminShow')
    },
    initPagination() {
      this.pagination = {
        page: 1,
        size: 10,
        total: 0
      }
    },
    // 搜索组件：时间搜索改变的回调
    changeTime(val) {
      this.formSearch.inputtime = val
    },
    // 充值
    labour(name, row) {
      this.laboureUser = row
      this.isVisible = true
    },
    // 充值成功
    handlerSuccess(balance) {
      this.laboureUser.money = balance
    },
    // 多选
    handleSelectionChange(obj) {
      this.selectedStore = obj
    },
    // 转移用户
    moveStore() {
      if (this.selectedStore.length === 0) {
        this.$message('请先选择需要转移的门店')
      } else this.isVisibleAgent = true
    },
    // 导出Excel
    exportToExcel() {
      const data = {
        apiName: 'AdminExport',
        params: { ...this.formSearch, ...this.otherSearch },
        excelHeader: ['ID', '用户', '角色', '地区', '备注', '开始时间', '到期时间', '门店数量', '操作客服', '运营客服'],
        excelFilter: ['id', 'username', 'role', 'area', 'remark', 'start_time', 'end_time', 'store', 'operator_service', 'market_service'],
        excelTitle: '客户列表'
      }
      this.defaultExportToExcel(data)
    },
    // 门店查询
    storeHandler(row) {
      this.setAgentSelect([row.role_id, row.id])
      this.formSearch.role_id = 10
    },
    // 修改选中代理商
    setAgentSelect(arr) {
      this.agentSelect = arr
      this.formSearch.agent_id = arr[arr.length - 1] || 0
      this.initPagination()
    },
    // 角色选择框修改
    roleChange(newVal) {
      if (!this.checkRole(['store', newVal])) this.setAgentSelect([])
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.select-box {
  display: flex;
  ::v-deep .el-input {
    width: 200px;
    margin-right: 10px;
  }
}
.btn-box {
  .el-button {
    margin: 5px 2px;
  }
}
.store{
  color: #409EFF;
  cursor: pointer;
}
</style>

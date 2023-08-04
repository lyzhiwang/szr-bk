<template>
  <div class="app-container">
    <ComplexTable :has-selection="hasSelection" :table-header="tableHeader" :table-data="tableData" :pagination="pagination" page-name="账号管理" @refreshTable="getList" @changeMultipleSelection="handleSelectionChange">
      <!-- 搜索框 -->
      <template v-slot:search>
        <el-select v-if="'156'.indexOf($store.state.user.roles) > -1" v-model="formSearch.role_id" placeholder="请选择角色" clearable @change="roleChange">
          <el-option v-for="item in roleList" :key="item.label" :label="item.name" :value="item.id" />
        </el-select>

        <!-- <el-select v-model="formSearch.status" placeholder="请选择用户状态" clearable>
          <el-option v-for="item in statuOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->

        <el-input v-model="otherSearch.keywords" placeholder="请输入ID|用户名|备注" clearable @keyup.native.enter="search" @clear="getList" />

        <!-- 时间选择器 -->
        <!-- <DatePicker v-if="'156'.indexOf($store.state.user.roles) > -1" :value="formSearch.inputtime" :has-shortcuts="true" value-format="timestamp" @changeTime="changeTime" /> -->

        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </template>

      <!-- 选择服务、添加按钮 -->
      <template v-slot:btn>
        <div class="select-box">
          <!-- <el-cascader v-if="isAgent && formSearch.role_id === 9" v-model="agentSelect" :options="selectList" :props="selectProps" filterable clearable placeholder="请选择服务">
            <template slot-scope="{ data }">
              <span>{{ data.username }}</span>
              <span v-if="data.remark"> ({{ data.remark }}) </span>
            </template>
          </el-cascader> -->

          <!-- <el-button v-has="'AgentExport'" icon="el-icon-download" @click="exportToExcel()">导出</el-button> -->

          <!-- <el-button v-if="hasSelection" v-has="'AgentMigrate'" type="primary" icon="el-icon-connection" @click="moveStore">转移用户</el-button> -->

          <!-- <el-button v-has="'AllocateResources'" type="info" size="small" @click="toRedirect('AdminRecharge', {id:''})">分配资源</el-button> -->

          <el-button v-has="'AdminStore'" icon="el-icon-plus" @click="toRedirect('AdminStore')">添加用户</el-button>
        </div>
      </template>

      <!-- 角色 -->
      <template v-slot:role="props">
        <span>{{ props.scope.row[props.scope.column.property].name }}</span>
      </template>

      <!-- 地区 -->
      <!-- <template v-slot:area_id="props">
        <span>{{ props.scope.row.area_id | areaFilter }}</span>
      </template> -->

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

      <!-- 状态 -->
      <template v-slot:is_bind="props">
        <div v-if="props.scope.row.is_bind">{{ props.scope.row.bind_phone }}</div>
        <div v-else>未绑定</div>
      </template>

      <!-- 有效期 -->
      <template v-slot:time="props">
        <div v-if="props.scope.row.time &&props.scope.row.time[0]">
          <span v-if="props.scope.row.time[0]">{{ props.scope.row.time[0] }}</span>
          <span v-if="props.scope.row.time[1]">~</span>
          <span v-if="props.scope.row.time[1]">{{ props.scope.row.time[1] }}</span>
        </div>
        <div v-else>
          ---
        </div>
      </template>

      <!-- 剩余数量 -->
      <!-- <template v-slot:surplus_number="props">
        <span v-if="props.scope.row.card_number === 0">无限</span>
        <span v-else>{{ props.scope.row.surplus_number }}</span>
      </template> -->

      <!--  -->
      <template v-slot:area_id="props">
        <span v-if="props.scope.row.area_id === 0">暂无</span>
        <span v-else>{{ props.scope.row.area_id | areaFilter }}</span>
      </template>

      <template v-slot:account="props">
        <span>{{ props.scope.row.account }}</span>
        <!-- <span v-else>--</span> -->
      </template>

      <!-- 门店 -->
      <!-- <template v-slot:store="props">
        <div :class="[7, 8].includes(props.scope.row.role.id)?'store':''" @click="storeHandler(props.scope.row)">{{ props.scope.row.store }}</div>
      </template> -->

      <!-- 操作 -->
      <template v-slot:operation="props">
        <div class="btn-box">
          <el-button v-has="'AdminUpdate'" type="primary" size="small" @click="toRedirect('AdminUpdate', {id:props.scope.row.id})">编辑</el-button>
          <!-- <el-button v-has="'AllocateResources'" type="info" size="small" @click="toRedirect('AdminRecharge', {id:props.scope.row.id})">分配资源</el-button> -->
          <el-button v-has="'AllocateResources'" type="info" size="small" @click="openCover('AdminRecharge', row)">分配资源</el-button>
          <!--  -->
          <!-- <el-button v-if="IsEditBindStore(props.scope.row) && props.scope.row.is_bind===false" v-has="'AdminBindStore'" type="primary" plain size="small" @click="BindStore('AdminBindStore', props.scope.row)">绑定商家</el-button> -->
          <!-- <el-button v-if="IsEditBindStore(props.scope.row)&& props.scope.row.is_bind===true" v-has="'AdminUnbindStore'" type="danger" size="small" @click="UnbindStore('AdminUnbindStore', props.scope.row)">解绑商家</el-button> -->
          <!-- <el-button v-has="'BlanceChange'" type="success" size="small" @click="toRedirect('AdminRecharge', {id:props.scope.row.id})">余额变化</el-button> -->
          <!-- <el-button v-if="isaccount(props.scope.row)" v-has="'AllocateResources'" type="info" size="small" @click="openCover('AllocateResources', props.scope.row)">分配资源</el-button> -->
          <!-- <el-button v-has="'AccountNumberChange'" size="small" @click="toRedirect('', props.scope.row)">账号数变化</el-button> -->
          <!-- <el-button v-has="'AdminDestroy'" type="danger" size="small" @click="deleteUser('AdminDestroy', props.scope.row)">删除</el-button> -->
          <!-- <el-button v-has="'RechargeCard'" type="success" size="small" @click="toRedirect('AdminRecharge', {id:props.scope.row.id,type:'1'})">充值权益卡</el-button> -->
          <!-- <el-button v-has="'RechargeBalance'" type="info" size="small" @click="toRedirect('AdminRecharge', {id:props.scope.row.id,type:'2'})">充值余额</el-button> -->
          <!-- <el-button v-if="showDetail(props.scope.row)" type="info" size="small" @click="toRedirect('AdminCheck', {id:props.scope.row.id})">详情</el-button> -->
        </div>
      </template>
    </ComplexTable>

    <laboure-dialog :is-visible="isVisible" :user="laboureUser" @close="isVisible=false" @success="handlerSuccess" />

    <agent-change-dialog :is-visible="isVisibleAgent" :store="selectedStore" @close="isVisibleAgent=false" @success="getList" />

    <!-- 添加 验证员 -->
    <Binding :is-visible="isCodeVisible" :row="checkedRow" @close="closegeneratecard" />

    <!--  -->
    <CoverDialog :is-visible="isCoverVisible" :row="CoverRow" @close="closeCover" />

  </div>
</template>

<script>
import { getCity } from '@/utils/area'
import ComplexTable from '@/components/Table/ComplexTable'
import LaboureDialog from '@/components/Dialog/LaboureDialog'
import AgentChangeDialog from '@/components/Dialog/AgentChangeDialog'
// import DatePicker from '@/components/Tool/DatePicker'
import CoverDialog from './components/CoverDialog.vue'

import Binding from './components/Binding.vue'

export default {
  components: { ComplexTable, LaboureDialog, AgentChangeDialog, Binding, CoverDialog },
  filters: {
    areaFilter: function(val) {
      if (val === 0) return '全国'
      const nameList = getCity(val, true)
      let name = ''
      for (const item of nameList) {
        name = name + item.name
      }
      return name
    }
  },
  data() {
    return {
      isInit: true, // 防止初始化搜索数据重复请求
      isCodeVisible: false, //
      isCoverVisible: false,
      CoverRow: {},
      checkedRow: {},
      formSearch: {
        role_id: '',
        status: '',
        review: '',
        inputtime: [],
        agent_id: 0
      },
      otherSearch: {
        keywords: '',
        user_id: ''
      },
      statuOptions: [
        { label: '正常', value: 1 },
        { label: '禁用', value: 2 }
      ],
      reviewOptions: [
        { label: '待审核', value: 1 },
        { label: '已审核', value: 2 },
        { label: '已驳回', value: 3 },
        { label: '未填写', value: 4 }
      ],
      agentSelect: [], // 下拉选择框、服务
      // selectList: [
      //   { id: 7, username: '服务商', children: [] },
      //   { id: 8, username: '品牌服务', children: [] }
      // ],
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
      isVisible: false,
      isVisibleAgent: false, // 转移门店的弹窗
      laboureUser: {}, // 充值用户
      selectedStore: []
    }
  },

  computed: {
    //
    hasSelection: function() {
      return this.formSearch.role_id === 9
    },

    //
    roleList: function() {
      return this.$store.state.config.roleList
    },

    //
    isAgent: function() { // 筛选权限：156可以筛选某个服务下的所有门店
      // 1管理员 2运营 3财务 4OEM 5代理 6商家
      const userRole = this.$store.state.user.roles
      const whiteRole = '156'
      if (whiteRole.indexOf(userRole[0]) >= 0) { // 是否展示
        return true
      } else {
        return false
      }
    },

    //
    statusDisabled: function() {
      return !this.$_has('AgentPatch')
    },

    //
    tableHeader: function() {
      const header = [
        { prop: 'id', label: 'ID', width: 70, sortable: true },
        { prop: 'username', label: '用户', width: 120 },
        { prop: 'remark', label: '备注', isCustomize: true },
        { prop: 'area_id', label: '地区', isCustomize: true },
        { prop: 'role', label: '角色', width: 100, isCustomize: true },
        // { prop: 'surplus_number', label: '权益卡数量', width: 100, isCustomize: true },
        // { prop: 'already_card_number', label: '已使用权益卡', width: 100, isCustomize: true },
        // { prop: 'balance', label: '余额', width: 100, isCustomize: true },
        // { prop: 'is_bind', label: '绑定状态', width: 80, isCustomize: true },
        { prop: 'account', label: '可用账号数', width: 100, isCustomize: true },
        { prop: 'duration', label: '视频时长(秒)', width: 100, isCustomize: true },
        // { prop: 'voice_number', label: '语音次数', width: 100, isCustomize: true },
        { prop: 'time', label: '有效期', width: 200, isCustomize: true, sortable: true },
        { prop: 'operation', label: '操作', width: 250, isCustomize: true }
      ]

      // if (this.$store.state.user.roles[0] !== 5) {
      //   var obj = {
      //     prop: 'account_number', label: '可用账号数', width: 100, isCustomize: true
      //   }
      //   header.push(obj)
      // }

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
    }
    // agentSelect: function(newVal) {
    //   if (this.isInit) return
    //   this.formSearch.agent_id = newVal[newVal.length - 1] || 0
    //   this.$store.commit('search/SearchUpdate', { name: 'agent', key: 'agentSelect', value: newVal })
    // }
  },

  created() {
    // 获取下拉选择框中的服务商列表
    // this.getSelectList()
    this.$store.dispatch('config/GetRoleList')
      .then(res => {
        this.$store.dispatch('area/GetArea')
          .then(res => {
            this.initSearch()
          })
      })
  },

  methods: {

    //
    isaccount(row) {
      // 1管理员 2运营 3财务 4OEM 5代理 6商家  当前
      // const userRole = this.$store.state.user.roles
      const whiteRole = '1245'
      if (whiteRole.indexOf(row.role.id) >= 0) { // 是否展示
        return true
      } else {
        return false
      }
    },
    // 初始化搜索
    initSearch() {
      this.formSearch = { ...this.$store.state.search.agent.formSearch }
      this.otherSearch = { ...this.$store.state.search.agent.otherSearch }
      // this.agentSelect = [...this.$store.state.search.agent.agentSelect]
      this.getList(this.$store.state.search.agent.pagination)
    },
    // 备注：切换input与span
    focusRemark(row) {
      // 服务商创建门店时，可填写备注，不能修改备注
      const user = this.$store.state.user.roles[0]
      if (!this.statusDisabled && '15'.indexOf(user) >= 0) {
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
      const params = {
        id: row.id,
        remark: row.remark
      }
      const catchBack = () => {
        this.$set(row, 'remark', this.oldRemark)
        this.blurRemark(row)
      }
      this.patchUser(row, msg, params, catchBack)
    },
    // 取消授权
    cancelStatus(name, row) {
      const msg = '此操作将取消' + row.username + '的公众号授权'
      const callBack = () => {
        this.apiBtn(name, { id: row.id }).then(() => {
          this.getList()
        })
      }
      this.defalultConfirm(msg, callBack)
    },
    // 修改状态
    changeStatus(row) {
      const msg = '修改' + row.username + '的状态为' + (row.status === 1 ? '正常' : '禁用')
      const params = {
        id: row.id,
        status: row.status
      }
      const catchBack = () => {
        this.resetStatus(row)
      }
      this.patchUser('', msg, params, catchBack)
    },
    // 重置状态
    resetStatus(row) {
      this.$set(row, 'status', row.status === 1 ? 2 : 1)
    },
    // 展示服务商信息
    changeAgent(row) {
      const msg = '修改' + row.username + (row.close_agent_info ? '不展示服务商信息' : '展示服务商信息')
      const params = {
        id: row.id,
        close_agent_info: row.close_agent_info
      }
      const catchBack = () => {
        this.resetAgent(row)
      }
      this.patchUser('', msg, params, catchBack)
    },
    // 重置服务商信息展示状态
    resetAgent(row) {
      this.$set(row, 'close_agent_info', row.close_agent_info ? 0 : 1)
    },
    // patch请求
    patchUser(row, msg, params, catchBack) {
      const callBack = () => {
        this.apiBtn('AgentPatch', params)
          .then(res => {
            if (row) this.blurRemark(row)
          })
          .catch(res => {
            catchBack()
          })
      }
      this.defalultConfirm(msg, callBack, catchBack)
    },
    // 删除
    deleteUser(name, row) {
      const msg = '此操作将永久删除' + row.username
      const callBack = () => {
        this.apiBtn(name, { id: row.id })
          .then(res => {
            this.tableData.splice(this.tableData.indexOf(row), 1)
          })
      }
      this.defalultConfirm(msg, callBack)
    },
    // 普通查找
    search() {
      this.getList()
    },
    // 初始化页码
    initPagination() {
      this.pagination = {
        page: 1,
        size: 10,
        total: 0
      }
    },
    // 获取列表数据
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
    // // 获取下拉选择框中的服务商列表
    // getSelectList() {
    //   if (this.isAgent) {
    //     for (const item of this.selectList) {
    //       const params = {
    //         role_id: item.id,
    //         size: 100,
    //         page: 1
    //       }
    //       if (!item.children.length) {
    //         this.apiBtn('', params).then(res => {
    //           item.children = res.data.list
    //         })
    //       }
    //     }
    //   }
    // },
    // 是否显示审核按钮
    showCheck(row) {
      const user = this.$store.state.user.roles[0]
      const roleRow = row.role.id
      const review = row.review
      if ('15'.indexOf(user) >= 0 && '156'.indexOf(roleRow) < 0 && review === 1) {
        return true
      } else {
        return false
      }
    },
    // 是否显示详情
    showDetail(row) {
      const user = this.$store.state.user.roles[0]
      const roleRow = row.role.id
      const review = row.review
      if ('15'.indexOf(user) >= 0 && '156'.indexOf(roleRow) < 0 && '23'.includes(review)) {
        return true
      } else {
        return false
      }
    },

    // 时间更改
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
      const params = {
        ...this.formSearch,
        ...this.otherSearch
      }
      if (!params.agent_id) delete params.agent_id
      this.apiBtn('AgentExport', params)
        .then(res => {
          // excel数据导出
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require('@/excel/Export2Excel')
            const tHeader = ['ID', '用户', '角色', '地区', '备注', '开始时间', '到期时间', '门店数量', '操作客服', '运营客服']
            const filterVal = ['id', 'username', 'role', 'area', 'remark', 'start_time', 'end_time', 'store', 'operator_service', 'market_service']
            const list = res.data.list
            const data = this.formatJson(filterVal, list)
            export_json_to_excel(tHeader, data, '客户列表')
          })
        })
    },
    //
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 门店查询
    storeHandler(row) {
      if ([7, 8].includes(row.role.id)) {
        this.setAgentSelect([row.role.id, row.id])
        this.formSearch.role_id = 9
      }
    },
    // 修改选中服务商
    setAgentSelect(arr) {
      this.agentSelect = arr
      this.formSearch.agent_id = arr[arr.length - 1] || 0
      this.initPagination()
    },
    // 角色选择框修改
    roleChange(newVal) {
      if (newVal !== 9) this.setAgentSelect([])
    },
    // 是否显示续约按钮 提前30天显示
    showRenew(row) {
      const user = this.$store.state.user.roles[0]
      const roleRow = row.role.id
      const nowTime = Date.parse(new Date()) / 1000
      return [1, 5, 7].includes(user) && [7, 8, 9].includes(roleRow) && (nowTime + 30 * 24 * 60 * 60) > row.end_time
    },
    // 续约
    agentRenew(name, row) {
      const msg = '此操作将为' + row.username + '(' + row.remark + ')' + '续约一年并扣除您的1个账号数,'
      const callBack = () => {
        this.apiBtn(name, { id: row.id })
          .then(res => {
            this.$set(row, 'end_time', res.data.end_time)
          })
      }
      this.defalultConfirm(msg, callBack)
    },

    // 计算完整的地区
    countFullAdcode(code) {
      const arr = getCity(code, true)
      const adcode = []
      for (const item of arr) {
        adcode.push(item.id)
      }
      return adcode
    },

    // 解绑商家
    UnbindStore(name, row) {
      const msg = '此操作将为' + row.username + '(' + row.remark + ')' + '解除绑定'
      const callBack = () => {
        this.apiBtn(name, { id: row.id })
          .then(res => {
            this.getList()
            // this.$set(row, 'end_time', res.data.end_time)
            // this.$message({
            //   message: '解绑成功',
            //   type: 'success'
            // })
          })
      }
      this.defalultConfirm(msg, callBack)
    },

    // 绑定商家
    BindStore(name, row) {
      this.checkedRow = row
      this.isCodeVisible = true
    },

    // 关闭绑定弹窗
    closegeneratecard(val) {
      if (val === 1) {
        this.getList()
      }
      this.checkedRow = {}
      this.isCodeVisible = false
    },

    // 是否允许绑定商家
    IsEditBindStore(row) {
      // var role = this.$store.state.user.roles[0]
      if ([6, 7].includes(row.role_id)) {
        return true
      } else {
        return false
      }
    },

    // 打开增加套数弹窗
    openCover(name, row) {
      this.CoverRow = row
      this.isCoverVisible = true
    },
    // 关闭增加套数弹窗
    closeCover(val) {
      if (val === 1) {
        this.getList()
      }
      this.isCoverVisible = false
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

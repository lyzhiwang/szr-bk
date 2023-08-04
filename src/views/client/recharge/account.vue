<template>
  <div class="app-container">
    <ComplexTable :table-header="tableHeader" :table-data="tableData" :has-search="false" :pagination="pagination" :page-name="'资源变化'" @refreshTable="getList">
      <!-- 搜索 -->
      <template v-slot:search>
        <!-- <tip size="big">余额：{{ balance }}(元)</tip> -->
        <!-- v-has="'RechargeBalance'" -->
        <!-- <span>
          充值余额
          <el-input-number v-model="money" :controls="false" :min="1" :max="1000000" :step="100" placeholder="数量" clearable />
          <el-button icon="el-icon-money" type="primary" @click="recharge">
            充值
          </el-button>
          <span class="tip-font">&nbsp;&nbsp;(充值余额：1~1000000)</span>
        </span> -->
        <!-- <el-input v-model="otherSearch.keywords" placeholder="请输入ID|用户名|备注" clearable @keyup.native.enter="search" @clear="getList" /> -->
        <!-- <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button> -->

        <!-- <el-form ref="form" :model="form" :rules="formRules" label-width="200px">

          <el-form-item label="资源类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择资源类型" clearable>
              <el-option v-for="item in statuOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item :label="form.type===1 ? '增加数量(秒)' : form.type===2 ? '增加数量(次)' :'增加数量(套)'" prop="resources">
            <el-input-number v-model="form.resources" placeholder="请输入增加账号数" maxlength="5" :precision="0" :controls="false" clearable />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>
        </el-form> -->
      </template>

      <template v-slot:btn>
        <div>
          <!-- <el-button v-has="'AllocateResources'" type="default" @click="openCover()">
            分配资源
          </el-button> -->
          <el-button icon="el-icon-refresh" type="default" @click="search">
            刷新
          </el-button>
        </div>
      </template>

      <!-- 操作人员 -->
      <template v-slot:operator="props">
        <span>{{ props.scope.row.operator.username }}</span>
      </template>
      <!-- 被操作人员 -->
      <template v-slot:user="props">
        <span>{{ props.scope.row.user.username }}</span>
      </template>

      <!-- 类型 -->
      <template v-slot:resource_type="props">
        <div>{{ props.scope.row.resource_type|typeFilter }}</div>
      </template>

      <!--  -->
      <template v-slot:change_type="props">
        <div>{{ props.scope.row.change_type|changetypeFilter }}</div>
      </template>

    </ComplexTable>

    <CoverDialog :is-visible="isCoverVisible" :row="CoverRow" @close="closeCover" />
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import CoverDialog from '../admin/components/CoverDialog.vue'
export default {
  filters: {
    // 类型
    typeFilter: function(val) {
      const obj = {
        1: '视频',
        2: '语音',
        3: '账号'
      }
      return obj[val]
    },

    changetypeFilter: function(val) {
      const obj = {
        1: '使用',
        2: '分配',
        3: '增加'
      }
      return obj[val]
    }
  },
  components: { ComplexTable, CoverDialog },
  data() {
    return {
      isCoverVisible: false,
      CoverRow: {},
      otherSearch: {
        keywords: ''
      },
      //   type: '1', // 1.充值权益卡  2、充值余额
      number: '',
      money: '',
      tableData: [],
      pagination: {
        total: 0, // 总条数
        size: 10, // 每页显示条目个数
        page: 1 // 当前页数
      },
      form: {
        id: '',
        type: '', // 资源类型 1视频 2语音 3账号
        resources: '' // 秒/次/套
      },
      statuOptions: [
        { label: '视频', value: 1 },
        { label: '语音', value: 2 },
        { label: '账号', value: 3 }
      ],
      formRules: {
        type: [{ required: true, trigger: 'blur', message: '请选择资源类型' }],
        resources: [{ required: true, trigger: 'blur', message: '请填写增加数量' }]
      },
      surplus_number: 0, //  剩余数量
      balance: 0 //  余额
    }
  },

  computed: {
    tableHeader() {
      var list = [
        { prop: 'id', label: 'ID', isCustomize: true },
        { prop: 'resource_type', label: '资源类型', isCustomize: true },
        { prop: 'change_type', label: '变化类型', isCustomize: true },
        { prop: 'number', label: '变化数量(秒/次/套)', isCustomize: true },
        { prop: 'change_before', label: '变化前', isCustomize: true },
        { prop: 'change_after', label: '变化后', isCustomize: true },
        { prop: 'created_at', label: '时间', isCustomize: true },
        { prop: 'operator', label: '操作人员', isCustomize: true },
        { prop: 'user', label: '被操作人员', isCustomize: true }
      ]

      return list
    }
  },

  created() {
    this.getList()
    // this.getAdminInfo()
  },

  methods: {
    // 搜索活动
    search() {
    //   if (this.otherSearch.admin_user_id) {
    //     this.getList()
    //   }
      this.getList()
    },

    // 打开增加套数弹窗
    openCover(name, row) {
      // this.CoverRow = row
      this.CoverRow.id = this.$route.query.id
      console.log(this.CoverRow)
      this.isCoverVisible = true
    },
    // 关闭增加套数弹窗
    closeCover(val) {
      if (val === 1) {
        this.getList()
      }
      this.isCoverVisible = false
    },

    // 获取用户详情
    getAdminInfo() {
      if (!this.$route.query.id) return
      this.apiBtn('AdminIndex', { id: this.$route.query.id }).then(res => {
        this.balance = res.data.balance
      })
    },

    // 获取列表
    getList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else {
        this.pagination = {
          page: 1,
          size: 10,
          total: 0
        }
      }
      var params = {
        // keywords: this.otherSearch.keywords,
        size: this.pagination.size,
        page: this.pagination.page
      }
      if (this.otherSearch.keywords) {
        params.keywords = this.otherSearch.keywords
      }
      this.apiBtn('ResourcesRecord', params).then(res => {
        // this.balance = res.balance
        this.tableData = res.data
        this.pagination.total = res.meta.total
      })
    },

    // 充值
    recharge() {
      if (!this.money) {
        this.$message('请先填写金额')
        return
      }
      this.apiBtn('', {
        admin_user_id: this.otherSearch.admin_user_id,
        money: this.money
      }).then(res => {
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.user {
  color: #00aaed;
  cursor: pointer;
}
::v-deep {
  .tip-title {
    margin-bottom: 10px;
  }
  .search-card .el-input-number {
    width: 200px;
    margin: 5px 10px;
    .el-input input {
      text-align: left;
    }
  }
}
</style>

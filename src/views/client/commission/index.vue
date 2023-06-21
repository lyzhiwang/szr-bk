<template>
  <div class="app-container">
    <ComplexTable
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      :page-name="'分佣详情列表'"
      :has-search="false"
      @refreshTable="getList"
    >
      <!-- 搜索 -->
      <!-- <template v-slot:search>
        <tip size="big">余额：{{ balance }}(元)</tip>
        <span v-has="'RechargeBalance'">
          充值余额
          <el-input-number v-model="money" :controls="false" :min="0.01" :max="1000000" :step="100" :precision="2" placeholder="充值余额" clearable />
          <el-button icon="el-icon-money" type="primary" @click="recharge">
            充值
          </el-button>
          <span class="tip-font">&nbsp;&nbsp;(充值余额：1~1000000)</span>
        </span>
        <el-input
          v-model="otherSearch.keywords"
          placeholder="请输入ID|用户名|备注"
          clearable
          @keyup.native.enter="search"
          @clear="getList"
        />
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="search"
        >搜索</el-button>
      </template> -->
      <!--
        <template v-slot:btn>
          <el-button icon="el-icon-refresh" type="default" @click="search">
            刷新
          </el-button>
        </template> -->

      <!-- 操作时间 -->
      <template v-slot:talent="props">
        <span v-if="props.scope.row.talent">{{ props.scope.row.talent }}</span>
        <span v-else>---</span>
      </template>

      <!-- 提现类型 -->
      <!-- <template v-slot:type="props">
          <div>{{ props.scope.row.type|cash_typeFilter }}</div>
        </template> -->
    </ComplexTable>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'

export default {
  filters: {
    // 提现类型
    cash_typeFilter: function(val) {
      const obj = {
        1: '',
        2: '',
        3: '',
        4: '佣金',
        5: '提现',
        6: '',
        7: '提现失败佣金返还',
        8: ''
        // 4佣金 5 提现 7 提现失败佣金返还
      }
      return obj[val]
    }
  },
  components: { ComplexTable },
  data() {
    return {
      otherSearch: {
        keywords: ''
      },
      //   type: '1', // 1.充值权益卡  2、充值余额
      //   number: '',
      //   money: '',
      tableData: [],
      pagination: {
        total: 0, // 总条数
        size: 10, // 每页显示条目个数
        page: 1 // 当前页数
      }
    //   surplus_number: 0, //  剩余数量
    //   balance: 0 //  余额
    }
  },

  computed: {
    tableHeader() {
      var list = [

        { prop: 'id', label: 'ID', isCustomize: true },
        { prop: 'order_id', label: '订单id', isCustomize: true },
        { prop: 'total_price', label: '订单总价(元)', isCustomize: true },
        { prop: 'unit_price', label: '订单单价(元)', isCustomize: true },
        { prop: 'verify_number', label: '核销份数', isCustomize: true },
        {
          prop: 'oem_commission_proportion',
          label: '平台分佣比例(%)',
          isCustomize: true
        },
        {
          prop: 'oem_commission_money',
          label: '平台分佣金额(元)',
          isCustomize: true
        },
        { prop: 'agent', label: '分佣服务商', isCustomize: true },
        {
          prop: 'agent_commission_proportion',
          label: '服务商分佣比例',
          isCustomize: true
        },
        {
          prop: 'agent_commission_money',
          label: '服务商分佣比例(%)',
          isCustomize: true
        },
        { prop: 'store', label: '分佣商家', isCustomize: true },
        {
          prop: 'store_commission_proportion',
          label: '商家分佣比例(%)',
          isCustomize: true
        },
        {
          prop: 'store_commission_money',
          label: '商家分佣金额(元)',
          isCustomize: true
        },
        { prop: 'talent', label: '分佣达人', isCustomize: true },
        {
          prop: 'talent_commission_proportion',
          label: '达人分佣比例(%)',
          isCustomize: true
        },
        {
          prop: 'talent_commission_money',
          label: '达人分佣比例(%)',
          isCustomize: true
        },
        { prop: 'created_at', label: '时间', isCustomize: true }
      ]

      return list
    }
  },

  created() {
    // this.type = this.$route.query.type
    // this.otherSearch.admin_user_id = this.$route.query.id || ''
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

    // // 获取用户详情
    // getAdminInfo() {
    //   if (!this.$route.query.id) return
    //   this.apiBtn('AdminIndex', { id: this.$route.query.id }).then((res) => {
    //     this.balance = res.data.balance
    //   })
    // },

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
      //   if (this.otherSearch.keywords) {
      //     params.keywords = this.otherSearch.keywords
      //   }
      this.apiBtn('CommissionListIndex', params).then((res) => {
        this.balance = res.balance
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
      }).then((res) => {
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

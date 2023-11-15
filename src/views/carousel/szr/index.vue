<template>
  <div class="app-container">

    <complex-table :page-name="'数字人列表'" :pagination="pagination" :table-header="tableHeader" :table-data="tableData" :has-search="false" @refreshTable="getList">

      <!-- 创建 -->
      <template v-slot:btn>
        <div>
          <el-button v-has="'HumanSync'" type="primary" icon="el-icon-plus" @click="humanSyncitem('HumanSync')">数字人同步</el-button>
          <el-button v-has="'HumansStore'" type="primary" icon="el-icon-plus" @click="toRedirect('SzrCreate')">添加数字人</el-button>
        </div>
      </template>

      <!-- 图片 -->
      <template v-slot:image="props">
        <div v-if="props.scope.row && props.scope.row.image">
          <img :src="props.scope.row.image.path" style="width: 75px;height: 118px;text-align: center;" alt="">
        </div>
        <div v-else />
      </template>

      <!-- 是否使公开 -->
      <template v-slot:public="props">
        <el-tooltip :content="props.scope.row.public === 1 ? '当前状态：公开' : '当前状态：不公开'" placement="top">
          <el-switch v-model="props.scope.row.public" :active-value="1" :inactive-value="0" @change="saleSwitch('', props.scope.row)" />
        </el-tooltip>
      </template>

      <template v-slot:operation="props">
        <div class="btn-box">
          <el-button v-has="'HumansUpdate'" type="primary" size="small" @click="toRedirect('SzrEdit', {image_id:props.scope.row.id})">编辑</el-button>
          <el-button v-has="'HumansDestroy'" type="danger" size="small" @click="deleteitem('HumansDestroy', props.scope.row)">删除</el-button>
        </div>
      </template>

    </complex-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ComplexTable from '@/components/Table/ComplexTable'
import { deleteArrayById } from '@/utils/index'
export default {
  name: '',
  filters: {
    // 是否公开
    typeFilter: function(val) {
      const obj = {
        0: '否',
        1: '是'
      }
      return obj[val]
    }
  },
  components: { ComplexTable },
  data() {
    return {
      formSearch: { //  搜索条件
        type: ''
        // platform_type: 1
      },
      otherSearch: { //  搜索条件
        keywords: ''
      },
      tableHeader: [ //  表格 表头
        { prop: 'id', label: 'ID', isCustomize: true, width: 80 },
        { prop: 'human_id', label: '数字人ID', isCustomize: true, width: 80 },
        { prop: 'name', label: '数字人名称', isCustomize: true },
        { prop: 'image', label: '形象', isCustomize: true },
        // { prop: 'public', label: '是否公开', isCustomize: true },
        { prop: 'operation', label: '操作', isCustomize: true, width: '250' }
      ],
      tableData: [], // 数据
      pagination: { //  搜索条件
        page: 1, // 当前是第几页
        size: 10, // 一页几条
        total: 30// 一共多少页
      },
      typelist: [], // 分类列表
      taglist: [] // 标签分类列表
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  // watch: {
  //   formSearch: {
  //     deep: true,
  //     handler(newVal, oldVal) {
  //       this.getList()
  //       this.$store.commit('SearchUpdate', { name: 'svbg', key: 'formSearch', value: newVal })
  //     }
  //   },
  //   otherSearch: {
  //     deep: true,
  //     handler(newVal, oldVal) {
  //       this.$store.commit('SearchUpdate', { name: 'svbg', key: 'otherSearch', value: newVal })
  //     }
  //   },
  //   pagination: {
  //     deep: true,
  //     handler(newVal, oldVal) {
  //       this.$store.commit('SearchUpdate', { name: 'svbg', key: 'pagination', value: newVal })
  //     }
  //   }
  // },

  created() {
    this.getList()
  },

  methods: {
    // 搜索
    search() {
      this.getList()
    },

    // 删除指定
    deleteitem(name, row) {
      const msg = '此操作将删除 ' + row.name + '(' + row.id + ')'
      const callBack = () => {
        this.apiBtn(name, { id: row.id })
          .then(res => {
            deleteArrayById(this.tableData, row.id)
          })
      }
      this.defalultConfirm(msg, callBack)
    },

    // 数字人同步
    humanSyncitem(name) {
      this.apiBtn(name).then(res => {
        console.log('数字人同步')
        console.log(res)
      })
    },

    // 开关控制 上架下架
    saleSwitch(name, row) {
      // row.name +
      const msg = (row.public === 0 ? '将要取消公开' : '将要公开') + '数字人“' + '(' + row.id + ')”,是否继续？'
      const params = {
        id: row.id,
        public: row.public
      }
      const catchBack = () => {
        this.$set(row, 'public', row.is_show === 0 ? 1 : 0)
      }
      const callBack = () => {
        this.apiBtn(name, params)
          .then(res => {
            this.$set(row, 'public', row.is_show === 0 ? 0 : 1)
          })
          .catch(res => {
            catchBack()
          })
      }
      this.defalultConfirm(msg, callBack, catchBack)
    },

    // 获取列表
    getList() {
      const params = { ...this.formSearch, ...this.otherSearch, ...this.pagination }
      this.apiBtn('HumansIndex', this.removeProperty(params))
        .then((res) => {
          this.tableData = res.data
          this.pagination.total = res.meta.total
        })
    }
  }
}
</script>

  <style lang="scss" rel="stylesheet/scss" scoped>
  .tag_list{
    display: flex;
    flex-wrap: wrap;
    .tag_item{
      margin-top: 5px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
  </style>


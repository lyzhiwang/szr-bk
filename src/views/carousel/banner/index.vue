<template>
  <div class="app-container">

    <complex-table :page-name="'轮播图列表'" :table-header="tableHeader" :table-data="tableData" :has-pagination="false" :has-search="false" @refreshTable="getList">

      <!-- 创建 -->
      <template v-slot:btn>
        <div>
          <el-button v-has="'BannerStore'" type="primary" icon="el-icon-plus" @click="toRedirect('BannerCreate')">添加轮播</el-button>
        </div>
      </template>

      <!-- 分类 -->
      <!-- <template v-slot:type="props">
        <span>{{ props.scope.row.type | modelFilter }}</span>
      </template> -->

      <!-- 图片位置 -->
      <!-- <template v-slot:position="props">
        <span>{{ props.scope.row.position | positionFilter }}</span>
      </template> -->

      <!-- 图片 -->
      <template v-slot:image="props">
        <div v-if="props.scope.row && props.scope.row.image">
          <img :src="props.scope.row.image.path" style="width: 70px;height: 70px;text-align: center;" alt="">
        </div>
        <div v-else />
      </template>

      <!-- 是否使用 -->
      <template v-slot:is_show="props">
        <el-tooltip :content="props.scope.row.is_show === 1 ? '当前状态：使用' : '当前状态：未使用'" placement="top">
          <el-switch v-model="props.scope.row.is_show" :active-value="1" :inactive-value="2" @change="saleSwitch('BannerShow', props.scope.row)" />
        </el-tooltip>
      </template>

      <template v-slot:operation="props">
        <div class="btn-box">
          <el-button v-has="'BannerUpdate'" type="primary" size="small" @click="toRedirect('BannerEdit', {image_id:props.scope.row.id})">编辑</el-button>
          <el-button v-has="'BannerDestroy'" type="danger" size="small" @click="deleteitem('BannerDestroy', props.scope.row)">删除</el-button>
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
    // // 分类
    // modelFilter: function(val) {
    //   const obj = {
    //     1: '会员分类',
    //     2: '车行易链接',
    //     3: '跳转url',
    //     4: '充话费',
    //     5: '充电费',
    //     6: '外卖',
    //     7: '加油',
    //     8: '充电桩',
    //     9: '无操作',
    //     10: '云油',
    //     11: '小程序',
    //     12: '抖音',
    //     13: '购物',
    //     14: '美团生活',
    //     15: 'CPS活动',
    //     16: '单会员推广'
    //   }
    //   return obj[val]
    // },

    // // 图片位置
    // positionFilter: function(val) {
    //   const obj = {
    //     1: '顶部',
    //     2: '中部',
    //     3: '中部魔方'
    //   }
    //   return obj[val]
    // }
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
        // { prop: 'name', label: '标题', isCustomize: true },
        // { prop: 'type', label: '分类', isCustomize: true },
        // { prop: 'position', label: '图片位置', isCustomize: true },
        { prop: 'image', label: '图片', isCustomize: true },
        { prop: 'is_show', label: '是否使用', isCustomize: true },
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
  watch: {
    formSearch: {
      deep: true,
      handler(newVal, oldVal) {
        this.getList()
        this.$store.commit('SearchUpdate', { name: 'banner', key: 'formSearch', value: newVal })
      }
    },
    otherSearch: {
      deep: true,
      handler(newVal, oldVal) {
        this.$store.commit('SearchUpdate', { name: 'banner', key: 'otherSearch', value: newVal })
      }
    },
    pagination: {
      deep: true,
      handler(newVal, oldVal) {
        this.$store.commit('SearchUpdate', { name: 'banner', key: 'pagination', value: newVal })
      }
    }
  },

  created() {
    this.getList()
  },

  methods: {
    // 搜索
    search() {
      this.getList()
    },

    // 删除指定分类
    deleteitem(name, row) {
      const msg = '此操作将删除 ' + row.id
      const callBack = () => {
        this.apiBtn(name, { id: row.id })
          .then(res => {
            deleteArrayById(this.tableData, row.id)
          })
      }
      this.defalultConfirm(msg, callBack)
    },

    // 开关控制 上架下架
    saleSwitch(name, row) {
      // row.name +
      const msg = (row.is_show === 2 ? '将要取消使用' : '将要使用') + '轮播图“' + '(' + row.id + ')”,是否继续？'
      const params = {
        id: row.id,
        is_show: row.is_show
      }
      const catchBack = () => {
        this.$set(row, 'is_show', row.is_show === 2 ? 1 : 2)
      }
      const callBack = () => {
        this.apiBtn(name, params)
          .then(res => {
            this.$set(row, 'is_show', row.is_show === 2 ? 2 : 1)
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
      this.apiBtn('BannerIndex', this.removeProperty(params))
        .then((res) => {
          this.tableData = res.data
          // this.pagination.total = res.meta.total
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


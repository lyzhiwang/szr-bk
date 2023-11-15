<template>
  <div class="app-container">

    <complex-table :page-name="'版本列表'" :pagination="pagination" :table-header="tableHeader" :table-data="tableData" :has-search="false" @refreshTable="getList">

      <!-- 创建 -->
      <template v-slot:btn>
        <div>
          <el-button v-has="'VersionsStore'" type="primary" icon="el-icon-plus" @click="toRedirect('VersionCreate')">添加版本</el-button>
        </div>
      </template>

      <!-- 是否使用 -->
      <!-- <template v-slot:is_show="props">
        <el-tooltip :content="props.scope.row.is_show === 1 ? '当前状态：使用' : '当前状态：未使用'" placement="top">
          <el-switch v-model="props.scope.row.is_show" :active-value="1" :inactive-value="2" @change="saleSwitch('BannerShow', props.scope.row)" />
        </el-tooltip>
      </template> -->

      <template v-slot:operation="props">
        <div class="btn-box">
          <el-button v-has="'VersionsUpdate'" type="primary" size="small" @click="toRedirect('VersionEdit', {version_id:props.scope.row.id})">编辑</el-button>
          <el-button v-has="'VersionsDestroy'" type="danger" size="small" @click="deleteitem('VersionsDestroy', props.scope.row)">删除</el-button>
          <el-button type="info" size="small" @click="downloaditem(props.scope.row)">下载</el-button>
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
        { prop: 'name', label: '名称', isCustomize: true },
        { prop: 'oem_id', label: 'OEM', isCustomize: true },
        { prop: 'version', label: '版本号', isCustomize: true },
        { prop: 'created_at', label: '时间', isCustomize: true },
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
      this.apiBtn('VersionsIndex', this.removeProperty(params))
        .then((res) => {
          this.tableData = res.data
          this.pagination.total = res.meta.total
        })
    },

    // 下载安装包
    downloaditem(item) {
      // console.log(item.file.path)
      if (item.file && item.file.path) {
        window.open(item.file.path)
      } else {
        this.$message.error('文件下载失败！')
      }
      // this.$message.error('文件下载失败！')
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


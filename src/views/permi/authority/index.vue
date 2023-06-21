<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card class="box-card">
          <template #header>
            <div class="clearfix card-header">
              <span>权限管理</span>

              <span style="float: right;">
                <el-button
                  v-show="type===2"
                  v-has="'AuthorityStore'"
                  size="medium"
                  @click="clearForm()"
                >新增</el-button>
                <el-button v-has="'AuthorityStore'" size="medium" @click="refresh">刷新</el-button>
              </span>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-alert :title="title" :description="description" :closable="false" type="success" />
              <authority-tree
                id="authorityTree"
                ref="tree"
                :data="data"
                :show-checkbox="false"
                @click="nodeClick"
              />
            </el-col>
            <el-col :span="18">
              <authority-form
                ref="form"
                :type="type"
                :form-authority="form"
                :authority-options="authorityOptions"
                @reUpdateAuthorityList="reUpdateAuthorityList"
                @updateAuthorityList="updateAuthorityList"
                @addAuthorityList="addAuthorityList"
                @deleteAuthorityList="deleteAuthorityList"
                @changeType="changeType"
                @clearForm="clearForm"
              />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAGroupOption, getAPageOption } from '@/utils/authority'
import { addArrayById, modifyArrayById, deleteArrayById } from '@/utils'

import AuthorityForm from '@/components/Form/AuthorityForm' // base on element-ui
import AuthorityTree from '@/components/Tree/AuthorityTree'

export default {
  name: 'Authority',
  components: { AuthorityForm, AuthorityTree },
  data() {
    return {
      data: [],
      // 1 新增 2 编辑
      type: 1,
      visibleDialog: false,
      form: {
        title: '',
        id: '',
        pid: 0,
        sort: '',
        name: '',
        // 1分组 2按钮 3页面
        type: 1,
        // 请求方式
        method: '',
        api: '',
        hidden: 0,
        icon: ''
      },
      aGroupOption: [],
      aPageOption: [],
      columns: [
        { value: 'title', text: '权限名称', isCustomize: true, width: '200px' },
        { value: 'path', text: '权限位置' },
        { value: 'type', text: '类型', isCustomize: true },
        { value: 'addTime', text: '添加时间', width: '152px', isCustomize: true },
        { value: 'editTime', text: '编辑时间', width: '152px', isCustomize: true },
        { value: 'action', text: '操作', isCustomize: true, width: '152px' }
      ],
      typeOption: {
        1: '分组',
        2: '按钮',
        3: '页面'
      }
    }
  },
  computed: {
    authirityType: function() {
      return this.form.type
    },
    // 对应页面下存在仓库中的API的进行对应展示（原本展示在下拉菜单中可以选择）
    // permissionBtnOption: function() {
    //   if (this.form.type === 2 && this.form.pid) {
    //     const authority = this.getAuthorityOptions(this.form.pid)['name']
    //     return { ...this.$store.state.permission.permissionBtnType[authority] }
    //   } else return {}
    // },
    authorityOptions: function() {
      // 按钮
      if (this.form.type === 2) return this.aPageOption
      // 页面
      if (this.form.type === 3) return this.aGroupOption
      // 分组
      else {
        return [{
          id: 0,
          title: '顶级权限',
          type: 0,
          name: null
        }]
      }
    },
    title: function() {
      return (this.type === 1 ? '新增' : '编辑') + (this.form.type ? this.typeOption[this.form.type] : '权限')
    },
    description: function() {
      return (this.type === 1 ? '' : '编辑') + this.form.title
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    // 刷新页面
    refresh() {
      this.clearForm()
      this.loadList()
    },
    loadList() {
      // 权限列表
      this.apiBtn('AuthorityIndex')
        .then(response => {
          this.data = response.data
          this.aGroupOption = getAGroupOption(this.data)
          this.aPageOption = getAPageOption(this.data)
        })
    },
    // 删除权限后更新列表
    deleteAuthorityList(form) {
      deleteArrayById(this.data, form.id)
      this.$refs['tree'].formatTree(this.data)
      if (form.type === 1) this.aGroupOption = getAGroupOption(this.data)
      if (form.type === 1 || form.type === 3) this.aPageOption = getAPageOption(this.data)
    },
    // 修改权限后更新列表
    updateAuthorityList(res) {
      modifyArrayById(this.data, res)
      this.$refs['tree'].formatTree(this.data)
      if (res.meta.type === 1) this.aGroupOption = getAGroupOption(this.data)
      if (res.meta.type === 1 || res.meta.type === 3) this.aPageOption = getAPageOption(this.data)
    },
    // 修改权限后更新列表：需要先删除再添加
    reUpdateAuthorityList(res) {
      deleteArrayById(this.data, res.id)
      addArrayById(this.data, res)
      this.$refs['tree'].formatTree(this.data)
      this.clearForm()
      if (res.meta.type === 1) this.aGroupOption = getAGroupOption(this.data)
      if (res.meta.type === 3) this.aPageOption = getAPageOption(this.data)
    },
    // 添加权限
    addAuthorityList(data) {
      // 添加数据
      if (data.pid === 0) {
        this.data.push(data)
      } else {
        addArrayById(this.data, data)
      }
      this.$refs['tree'].formatTree(this.data)
      this.clearForm()
      if (data.meta.type === 1) this.aGroupOption = getAGroupOption(this.data)
      if (data.meta.type === 3) this.aPageOption = getAPageOption(this.data)
    },
    // 获取权限具体信息
    getAuthorityOptions(id) {
      const arr = this.aPageOption
      for (const i in arr) {
        if (id === arr[i]['id']) {
          return arr[i]
        }
      }
    },
    // tree点击触发事件
    nodeClick(o) {
      // 清空
      this.clearForm()
      // 修改表单类型为修改
      this.type = 2
      // 赋值
      this.formatData(o)
    },
    // 格式化数据
    formatData(row) {
      // 修改权限数据结构
      const nform = {
        title: '',
        id: '',
        pid: 0,
        sort: '',
        name: '',
        // 1分组 2按钮 3页面
        type: 1,
        // 请求方式
        method: '',
        api: '',
        hidden: 0,
        icon: ''
      }
      for (const item in nform) {
        if (row[item] || row[item] === 0) {
          nform[item] = row[item]
        }
        if (row.meta[item] || row.meta[item] === 0) {
          nform[item] = row.meta[item]
        }
      }
      if (!row.hidden) nform.hidden = 0
      this.form = nform
    },
    // 清空表单
    clearForm() {
      for (const item in this.form) {
        this.form[item] = ''
      }
      // 修改 权限类型为组
      this.form.type = 1
      // 初始化 不隐藏
      this.form.hidden = 0
      // 父id为0
      this.form.pid = 0

      this.type = 1
      this.$refs['form'].clearValidate()
    },
    // 权限类型改变 清空个别字段
    changeType() {
      this.form.name = ''
      this.form.sort = ''
      this.form.path = ''
      this.form.icon = ''
      this.method = ''
      if (this.form.type === 1) this.form.pid = 0
      else this.form.pid = ''
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
.el-form-item:last-child {
  margin: 0;
}
.card-header {
  line-height: 36px;
}
</style>

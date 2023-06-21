<template>
  <div class="app-container">
    <complex-table
      :page-name="'角色管理'"
      :has-search="false"
      :has-pagination="false"
      :table-header="tableHeader"
      :table-data="roleList"
      @refreshTable="loadList"
    >
      <template v-slot:btn>
        <el-button v-has="'RoleStore'" type="primary" size="medium" @click="addRole">添加角色</el-button>
      </template>
      <!-- 状态 -->
      <template v-slot:state="slotProps">
        <el-tooltip
          v-has="'RolePatch'"
          :content="'当前状态 : '+(slotProps.scope.row.state === 1? '使用':'禁用')"
          placement="top"
        >
          <el-switch
            v-model="slotProps.scope.row.state"
            :active-value="1"
            :inactive-value="0"
            @change="disableRole(slotProps.scope.row)"
          />
        </el-tooltip>
      </template>
      <!-- 操作 -->
      <template v-slot:action="slotProps">
        <el-button
          v-has="'RoleUpdate'"
          type="primary"
          size="small"
          @click="editRole(slotProps.scope.row)"
        >编辑</el-button>
        <el-button
          v-has="'RoleDestroy'"
          type="warning"
          size="small"
          @click="deleteRole(slotProps.scope.row)"
        >删除</el-button>
      </template>
    </complex-table>
    <!-- 修改弹出框 -->
    <role-dialog
      :title="dialog.title"
      :is-visible="dialog.visible"
      :type="dialog.type"
      :role-form="roleForm"
      @changeDialog="changeDialog"
      @updateRoleList="updateRoleList"
      @addRoleList="addRoleList"
      @setAuthority="setAuthority"
    />
  </div>
</template>

<script>
import { deleteArrayById, modifyArrayById, addArrayToLast } from '@/utils'

import ComplexTable from '@/components/Table/ComplexTable'
import RoleDialog from '@/components/Dialog/RoleDialog' // base on element-ui

export default {
  name: 'Role',
  components: { ComplexTable, RoleDialog },
  data() {
    return {
      formSearch: {
        size: ''
      },
      tableHeader: [
        {
          prop: 'id',
          label: 'ID',
          sortable: true,
          width: 80
        },
        {
          prop: 'name',
          label: '角色名称'
        },
        {
          prop: 'state',
          label: '角色状态',
          isCustomize: true
        },
        {
          prop: 'tip',
          label: '备注',
          width: 100,
          over: true
        },
        {
          prop: 'action',
          label: '操作',
          width: 160,
          isCustomize: true
        }
      ],
      roleList: [],
      listLoading: true,
      dialog: {
        title: '角色',
        // 1 新增 2 编辑
        type: 1,
        visible: false
      },
      roleForm: {
        id: '',
        name: '',
        state: 1,
        tip: '',
        authority: [],
        add_time: '',
        edit_time: ''
      }
    }
  },
  created() {
    this.loadList()
  },
  methods: {
    // 用户列表
    loadList() {
      // 页面table加载
      this.listLoading = true
      this.apiBtn('RoleIndex')
        .then(response => {
          this.roleList = response.data
          this.listLoading = false
        })
    },
    addRole() {
      // 添加角色
      this.dialog.visible = true
      this.dialog.title = '添加角色'
      this.dialog.type = 1
    },
    editRole(row) {
      // 编辑角色
      for (const i in this.roleForm) {
        if (Object.prototype.hasOwnProperty.call(row, i)) this.roleForm[i] = row[i]
      }
      this.dialog.visible = true
      this.dialog.title = '编辑角色'
      this.dialog.type = 2
    },
    deleteRole(row) {
      // 删除角色
      this.defalultConfirm('此操作将永久删除该角色', () => {
        this.apiBtn('RoleDestroy', { id: row.id })
          .then(res => {
            // 为this.roleList删除数据
            deleteArrayById(this.roleList, row.id)
          })
      })
    },
    disableRole(row) {
      // 禁用羽解除禁用的事件 使用update的方法
      this.defalultConfirm((row.state === 1 ? '启用' : '禁用') + row.name, () => {
        this.apiBtn('RolePatch', { id: row.id, state: row.state })
          // 失败则还原状态
          .catch(() => { row.state = (row.state === 1 ? 0 : 1) })
      }, () => { row.state = (row.state === 1 ? 0 : 1) })
    },
    changeDialog(res) {
      // Dialog的显示隐藏事件
      this.dialog.visible = res
      for (const key in this.roleForm) {
        if (key === 'authority') this.roleForm[key] = []
        else this.roleForm[key] = ''
      }
      this.roleForm.state = 1
    },
    addRoleList(res) {
      // 添加角色至列表最后一个
      addArrayToLast(this.roleList, res)
    },
    updateRoleList(res) {
      // 修改角色后更新列表
      modifyArrayById(this.roleList, res)
    },
    setAuthority(res) {
      // tree修改后同步权限
      this.roleForm.authority = res
    }

  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>

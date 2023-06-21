<template>
  <el-dialog
    :visible.sync="isDialogVisible"
    :title="title"
    :fullscreen="$store.state.app.device === 'mobile' ? true : false"
    top="7vh"
    width="60%"
    @close="resetForm('roleForm')"
    @dragDialog="handleDrag"
  >
    <el-form ref="roleForm" :rules="rulesForm" :model="roleForm" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleForm.name" placeholder="请输入角色的名称" />
      </el-form-item>
      <el-form-item label="角色状态" prop="state">
        <el-radio-group v-model="roleForm.state">
          <el-radio v-for="item in stateOption" :key="item.value" :label="item.value">{{ item.title }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分配权限" prop="authority">
        <authority-tree
          id="authorityTree"
          ref="child"
          :data="treeData"
          :expanded-key="roleForm.authority"
          :checked-key="roleForm.authority"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
        <el-button @click="resetForm('roleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import AuthorityTree from '@/components/Tree/AuthorityTree'

export default {
  name: 'RoleDialog',
  components: {
    AuthorityTree
  },
  props: {
    title: {
      type: String,
      default: '角色'
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    type: {
      // 1 新增 2 编辑
      type: Number,
      default: 1
    },
    roleForm: {
      type: Object,
      default: function() {
        return {
          id: '',
          name: '',
          state: 1,
          authority: []
        }
      }
    },
    roleList: {
      type: Object,
      default() {}
    }
  },
  data() {
    return {
      isDialogVisible: false,
      stateOption: [
        {
          title: '启用',
          value: 1
        },
        {
          title: '禁用',
          value: 0
        }
      ],
      rulesForm: {
        name: [
          { required: true, message: '请输入角色的名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择角色状态', trigger: 'change' }
        ]
      },
      treeData: []
    }
  },
  watch: {
    isVisible: function(newV, oldV) {
      this.isDialogVisible = newV
      if (this.isVisible === false) {
        this.resetForm('roleForm')
      }
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    submitForm(formName) {
      this.$emit('setAuthority', this.$refs.child.getCheckedKeys())
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.apiBtn(this.type === 1 ? 'RoleStore' : 'RoleUpdate', { ...this.roleForm })
            .then(res => {
              //  为this.roleForm修改数据
              this.$emit(this.type === 1 ? 'addRoleList' : 'updateRoleList', res.data)
              this.resetForm(formName)
            })
        }
      })
    },
    getTreeData() {
      // 获取所有权限加载tree
      this.apiBtn('AuthorityIndex')
        .then(response => {
          this.treeData = response.data
        })
    },
    resetForm(formName) {
      // 清空表单，清空tree,关闭diaglog
      this.$refs.child.clearTree()
      this.$refs[formName].resetFields()
      this.$emit('changeDialog', false)
    },
    // v-el-drag-dialog onDrag callback function dialog拖动的回调事件
    handleDrag() {
      this.$refs.select.blur()
    }
  }
}
</script>
<style lang='scss' scoped>
.el-select {
  width: 100%;
}
.el-form-item:last-child {
  margin: 0;
}
#authorityTree {
  min-height: 42px;
  border: 1px solid #dcdfe6;
  padding-top: 7px;
  border-radius: 4px;
  max-height: 300px;
  overflow: auto;
}
</style>


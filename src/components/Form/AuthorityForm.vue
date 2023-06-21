<template>
  <el-form ref="formAuthority" :rules="rulesForm" :model="formAuthority" label-width="150px">
    <el-form-item label="类型" prop="type">
      <el-radio-group v-model="formAuthority.type" :disabled="type===2" @change="changeType">
        <el-radio v-for="item in typeOption" :key="item.key" :label="item.value">{{ item.key }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="标题" prop="title">
      <el-input v-model="formAuthority.title" placeholder="请输入标题" />
    </el-form-item>
    <!-- 编辑禁用字段 分组不显示 -->
    <el-form-item v-show="formAuthority.type!==1" label="所属权限" prop="pid">
      <el-select ref="select" v-model="formAuthority.pid" placeholder="请选择所属权限">
        <el-option
          v-for="item in authorityOptions"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <!-- API权限 -->
    <template v-if="formAuthority.type===2">
      <el-form-item label="API名称" prop="name">
        <el-input v-model="formAuthority.name" placeholder="请输入该页面的API名称" />
      </el-form-item>
      <el-form-item label="请求方式" prop="method">
        <el-select ref="select" v-model="formAuthority.method" placeholder="请选择请求方式">
          <el-option
            v-for="item in methodOption"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="API" prop="api">
        <el-input v-model="formAuthority.api" placeholder="请输入API（除去公共部分）" />
      </el-form-item>
    </template>
    <!-- 页面权限 -->
    <template v-else>
      <el-form-item label="路由名称" prop="name">
        <el-input v-model="formAuthority.name" placeholder="路由名称只能包含大小写字母,使用大驼峰命名法" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="formAuthority.sort" placeholder="值越大，排序越靠前" />
      </el-form-item>
      <el-form-item v-if="formAuthority.type===1" label="图标">
        <el-input v-model="formAuthority.icon" placeholder="请填写图标" />
      </el-form-item>
    </template>
    <el-form-item v-if="formAuthority.type!=2" label="入口是否隐藏" prop="hidden">
      <el-radio-group v-model="formAuthority.hidden">
        <el-radio :label="0">不隐藏</el-radio>
        <el-radio :label="1">隐藏</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button
        v-show="type===1"
        v-has="'AuthorityStore'"
        type="primary"
        @click="submitForm('formAuthority')"
      >提交并保存</el-button>
      <el-button
        v-show="type===2"
        v-has="'AuthorityUpdate'"
        type="primary"
        @click="submitForm('formAuthority')"
      >修改并保存</el-button>
      <el-button
        v-show="type===2"
        v-has="'AuthorityDestroy'"
        type="danger"
        @click="deleteForm('formAuthority')"
      >删除</el-button>
      <el-button v-show="type===1" type="danger" @click="resetForm()">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {
  validatMixRegular,
  validateNumber,
  validatAlphabets
} from '@/utils/validate'

export default {
  name: 'AuthorityForm',
  props: {
    type: {
      // 1 新增 2 编辑
      type: Number,
      default: 2
    },
    formAuthority: {
      type: Object,
      default: function() {
        return {
          title: '',
          id: '',
          pid: 0,
          sort: '',
          name: '',
          // 1分组 2ＡＰＩ 3页面
          type: 1,
          // 请求方式
          method: '',
          api: '',
          hidden: 0,
          icon: '',
          addTime: '',
          editTime: ''
        }
      }
    },
    authorityOptions: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    const validateTitle = (rule, value, callback) => {
      if (!validatMixRegular(value)) {
        callback(new Error('标题只能包含中文、英文、数字、下划线'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      if (this.formAuthority.type === 1 && !validatAlphabets(value)) {
        callback(
          new Error('路由名称只能包含大小写字母，且不能为空')
        )
      } else if (this.formAuthority.type === 2 && !value) {
        callback(
          new Error('请输入页面API名称，即当前权限下页面的ＡＰＩ名称')
        )
      } else {
        callback()
      }
    }
    const validateSort = (rule, value, callback) => {
      if (!validateNumber(value)) {
        callback(new Error('排序必须为数字值'))
      } else {
        callback()
      }
    }
    return {
      rulesForm: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { validator: validateTitle, trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
        ],
        type: [
          {
            required: true,
            message: '请选择权限类型',
            trigger: 'blur'
          }
        ],
        method: [
          {
            required: true,
            message: '请选择请求方式',
            trigger: 'change'
          }
        ],
        hidden: [
          {
            required: true,
            message: '请选择是否隐藏',
            trigger: 'change'
          }
        ],
        name: [
          { required: true, validator: validateName, trigger: 'blur' }

        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { validator: validateSort, trigger: 'blur' }
        ],
        pid: [
          { required: true, message: '请选择所属权限', trigger: 'blur' }
        ],
        api: [
          {
            required: true,
            message: '请以/开头后跟随字母且只能包含字母',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 100,
            message: '长度在 2 到 100 个字符',
            trigger: 'blur'
          }
        ],
        icon: [{ min: 0, max: 15, message: '长度在 0到 15 个字符', trigger: 'blur' }]
      },
      typeOption: [
        { key: '分组', value: 1 },
        { key: '页面', value: 3 },
        { key: 'API', value: 2 }
      ],
      methodOption: [
        { key: 'POST', value: 'POST' },
        { key: 'DELETE', value: 'DELETE' },
        { key: 'PUT', value: 'PUT' },
        { key: 'PATCH', value: 'PATCH' },
        { key: 'GET', value: 'GET' }
      ],
      fpid: '',
      needRefresh: false
    }
  },
  watch: {
    formAuthority: {
      deep: true,
      handler: function(newV, oldV) {
        // 修改所属权限刷新
        if (!oldV.id || newV.id !== oldV.id) {
          this.fpid = newV.pid
          this.needRefresh = false
        } else if (newV.id === oldV.id) {
          if (this.fpid !== newV.pid) this.needRefresh = true
        }
      }
    }
  },
  methods: {
    // 修改 新增
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.apiBtn(this.type === 1 ? 'AuthorityStore' : 'AuthorityUpdate', { ...this.formAuthority })
            .then(res => {
              console.log(this.needRefresh)
              // 所属权限改变刷新tree
              if (this.needRefresh && this.type === 2) {
                this.$emit('reUpdateAuthorityList', res.data)
                this.resetForm()
                return
              }
              // 为this.data添加数据
              this.$emit(this.type === 1 ? 'addAuthorityList' : 'updateAuthorityList', res.data)
              this.resetForm()
            })
        }
      })
    },
    // 删除权限
    deleteForm() {
      this.defalultConfirm('此操作将永久删除该权限', () => {
        this.apiBtn('AuthorityDestroy', { id: this.formAuthority.id })
          .then(res => {
            // 为this.data删除数据
            this.$emit('deleteAuthorityList', { ...this.formAuthority })
            this.resetFields()
          })
      })
    },
    resetForm() {
      this.clearValidate()
      this.fpid = ''
      this.needRefresh = false
    },
    resetFields() {
      // 清空表单并移除校验
      this.$refs['formAuthority'].resetFields()
      this.fpid = ''
      this.needRefresh = false
    },
    clearValidate() {
      // 移除校验结果
      this.$refs['formAuthority'].clearValidate()
    },
    changeType() {
      this.$emit('changeType')
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
::v-deep .el-dialog__body {
  padding: 10px 80px 20px 0;
}

::v-deep .el-input {
  width: 100%;
}
</style>


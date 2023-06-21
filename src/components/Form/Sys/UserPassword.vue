<template>
  <el-form ref="form" :rules="rulesForm" :model="form" label-width="251px">
    <tip title="修改密码" />
    <el-form-item label="当前密码" prop="oldPassword">
      <el-input
        v-model="form.oldPassword"
        auto-complete="off"
        placeholder="密码长度8-16位包含数字和字母"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-popover
        placement="top-start"
        title="提示"
        content="生成8位数的密码，该密码包含大小写英文字母和数字"
        width="200"
        trigger="hover"
      >
        <el-button slot="reference" @click="randomPwd">
          生成随机密码
        </el-button>
      </el-popover>
    </el-form-item>

    <el-form-item label="新密码" prop="password">
      <el-input
        ref="formPassword"
        v-model="form.password"
        auto-complete="off"
        placeholder="新密码和当前密码不能相同"
        show-password
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="passwordConfirmation">
      <el-input
        ref="formPasswordConfirmation"
        v-model="form.passwordConfirmation"
        auto-complete="off"
        placeholder="确认密码和新密码保存一致"
        show-password
      />
    </el-form-item>
  </el-form>
</template>

<script>
import { validatPwdEasy } from '@/utils/validate.js'
import { Random } from '@/utils/index.js'

export default {
  props: {
    form: {
      type: Object,
      default() {
        return {
          oldPassword: '',
          password: '',
          passwordConfirmation: ''
        }
      }
    }
  },
  data() {
    var validatOldPassword = (rule, value, callback) => {
      if (value === this.form.password) {
        callback(
          new Error('新密码和当前密码不能相同')
        )
      } else {
        callback()
      }
    }
    var validatPassword = (rule, value, callback) => {
      if (value === this.form.oldPassword) {
        callback(
          new Error('新密码和当前密码不能相同')
        )
      } else if (!validatPwdEasy(value)) {
        callback(
          new Error('密码至少包含字母，数字，且不少于8位')
        )
      } else {
        if (this.form.passwordConfirmation !== '') {
          this.$refs.form.validateField('passwordConfirmation')
        }
        callback()
      }
    }

    var validatPasswordConfirmation = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(
          new Error('两次输入密码不一致')
        )
      } else {
        callback()
      }
    }
    return {
      rulesForm: {
        oldPassword: [
          { required: true, message: '请输入当前密码', trigger: 'blur' },
          { validator: validatOldPassword, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatPassword, trigger: 'blur' }
        ],
        passwordConfirmation: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatPasswordConfirmation, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    validateForm: function() {
      var result = false
      this.$refs['form'].validate(valid => {
        result = valid
      })
      return result
    },
    clearValidate: function() {
      this.$refs.form.clearValidate()
    },
    // 生成随机密码
    randomPwd() {
      this.$refs.formPassword.passwordVisible = true
      this.$refs.formPasswordConfirmation.passwordVisible = true
      // 生成密码
      const random_password = new Random(8).init()
      this.$set(this.form, 'password', random_password)
      this.$set(this.form, 'passwordConfirmation', random_password)
      // 重新校验密码
      this.$refs['form'].validateField('formPassword')
    }
  }
}
</script>

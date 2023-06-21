<template>
  <div>
    <el-form ref="form" :model="form" :rules="formRules" :label-position="$store.state.app.labelPosition" label-width="251px">
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" placeholder="设置账号" clearable autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <div class="pwd-box">
          <el-input v-model="form.password" :placeholder="pwdPlaceholder" :type="pwdType">
            <template #append>
              <el-popover
                placement="top-start"
                title="提示"
                content="生成8位数的密码，该密码包含大小写英文字母和数字"
                width="200"
                trigger="hover"
              >
                <el-button slot="reference" @click="randomPwd">
                  <svg-icon icon-class="random" />
                </el-button>
              </el-popover>
            </template>
          </el-input>
          <span class="show-pwd" @click="showPwd = !showPwd">
            <svg-icon v-if="showPwd" icon-class="eye" />
            <svg-icon v-else icon-class="eye-open" />
          </span>
        </div>
        <el-checkbox v-if="!id" v-model="agreePwd" :style="{ color: pwdColor }">用户成功创建后，平台将不再储存和显示该密码，请妥善保存密码！</el-checkbox>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" maxlength="10" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="form.role_id" :disabled="checkRole(['agent'])" placeholder="请设置该用户角色" clearable>
          <el-option v-for="item in roleList" :key="item.name + item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validatMixRegular, validatPwdEasy } from '@/utils/validate'
import { Random } from '@/utils/index.js'

export default {
  name: 'UserBase',
  props: {
    form: {
      type: Object,
      default() {
        return {
          username: '', // 用户名
          password: '', // 密码
          remark: '', // 备注
          role_id: ''// 角色
        }
      }
    }
  },
  data() {
    const validateUsername = (rule, val, callback) => {
      if (val && val.length >= 5 && val.length <= 16 && validatMixRegular(val)) {
        callback()
      } else {
        callback(new Error('用户名只能是数字或字母，长度为5-16位'))
      }
    }
    const validatePassword = (rule, val, callback) => {
      if (!val && this.id) { // 编辑
        callback()
      } else if (val && validatPwdEasy(val) && val.length >= 8 && val.length <= 16) {
        callback()
      } else {
        callback(new Error('密码由数字和字母组成，长度为8-16位'))
      }
    }
    return {
      showPwd: false, // 是否显示密码内容
      agreePwd: false, // 密码保护
      pwdColor: '',
      formRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: false, trigger: 'blur', validator: validatePassword }],
        remark: [{ required: true, trigger: 'blur', message: '请设置备注' }],
        role_id: [{ required: true, trigger: 'change', message: '请设置用户角色' }]
      }
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    // 密码输入框 类型
    pwdType: function() {
      return this.showPwd ? '' : 'password'
    },
    // 密码输入框 提示
    pwdPlaceholder() {
      return this.id ? '不修改密码则留空' : '设置密码'
    },
    // 角色列表
    roleList: function() {
      const list = this.$store.state.config.roleList
      return list
    }
  },
  created() {
  },
  methods: {
    // 生成随机密码
    randomPwd() {
      this.showPwd = true
      this.$emit('change', { key: 'password', val: new Random(8).init() })
      // 重新校验密码
      this.$refs['form'].validateField('password')
    },
    // 表单验证
    validateForm: function() {
      var result = false
      this.$refs['form'].validate(valid => {
        if (this.id || this.agreePwd) result = valid
        else this.pwdColor = '#F56C6C'
      })
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
form {
  .pwd-box {
    position: relative;
    .show-pwd {
      position: absolute;
      left: 215px;
      top: 50%;
      font-size: 16px;
      cursor: pointer;
      user-select: none;
      transform: translateY(-50%);
    }
  }
}
</style>

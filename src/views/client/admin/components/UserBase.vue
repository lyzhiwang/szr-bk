<template>
  <div>
    <el-form ref="form" :model="form" :rules="formRules" :label-position="$store.state.app.labelPosition" label-width="251px">
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" placeholder="设置账号" :disabled="form.id>=0" clearable autocomplete="off" />
      </el-form-item>
      <el-form-item v-if="!id" label="密码" prop="password">
        <div class="pwd-box">
          <el-input v-model="form.password" :placeholder="pwdPlaceholder" :type="pwdType">
            <template #append>
              <el-popover placement="top-start" title="提示" content="生成8位数的密码，该密码包含大小写英文字母和数字" width="200" trigger="hover">
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

      <el-form-item v-if="!id" label="角色" prop="role_id">
        <el-select v-model="form.role_id" :disabled="checkRole(['agent'])" placeholder="请设置该用户角色" clearable>
          <el-option v-for="item in roleList" :key="item.name + item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item v-else label="角色">
        <el-input v-model="rolename" :disabled="true" />
      </el-form-item>

      <!-- 5代理 -->
      <el-form-item v-if="form.role_id === 5" label="地区" prop="area_id">
        <el-cascader v-model="userArea" :options="areaList" :props="areaProps" placeholder="请选择用户所在地区" clearable @change="areachange" />
      </el-form-item>

      <!-- 4OEM 5代理 6商家 -->
      <el-form-item v-if="form.role_id === 4 || form.role_id === 5 || form.role_id === 6" label="使用时间" prop="time">
        <DatePicker :value="form.time || []" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" :has-shortcuts="true" :shortcuts="shortcuts" @changeTime="changeTime" />
      </el-form-item>

      <!-- 4OEM 5代理 6商家 -->
      <el-form-item v-if="form.role_id === 4 || form.role_id === 5 || form.role_id === 6" label="账号套数" prop="account">
        <el-input-number v-model="form.account" :min="0" placeholder="请输入账号套数" :disabled="form.id>=0" :controls="false" clearable :precision="0" />
      </el-form-item>
      <el-form-item v-if="form.role_id === 4 || form.role_id === 5 || form.role_id === 6" label="视频时长(分钟)" prop="duration">
        <el-input-number v-model="form.duration" :min="0" placeholder="请输入视频时长(分钟)" :disabled="form.id>=0" :controls="false" clearable :precision="0" />
      </el-form-item>
      <!-- <el-form-item v-if="form.role_id === 4 || form.role_id === 5 || form.role_id === 6" label="语音次数" prop="voice_number">
        <el-input-number v-model="form.voice_number" :min="0" placeholder="请输入语音次数" :disabled="form.id>=0" :controls="false" clearable :precision="0" />
      </el-form-item> -->
      <!-- <el-form-item v-if="form.role_id === 2 || form.role_id ===4 || form.role_id ===5" label="账号套数" prop="account_number">
        <el-input-number v-model="form.account_number" :min="0" placeholder="请输入账号套数" :disabled="form.id>=0" :controls="false" clearable :precision="0" />
      </el-form-item> -->

      <!-- <el-form-item v-if="form.role_id!==2" label="权益卡数量" prop="card_number">
        <el-input-number v-model="form.card_number" :min="0" placeholder="请输入权益卡数量" :disabled="form.id>=0" :controls="false" clearable :precision="0" />
      </el-form-item>
      <div v-if="form.role_id!==2" class="tip-font" style="margin-left:255px;">权益卡数量为 0 表示权益卡数量为 无限</div> -->
    </el-form>
  </div>
</template>

<script>
// 超级管理员   可创建  运营 财务
// 运营         可创建   运营 OEM 代理商
// OEM         创建    代理商
// 代理商       可创建  商家

// 1管理员 2运营 3财务 4OEM 5代理 6商家

import { getCity } from '@/utils/area'
import { validatMixRegular, validatPwdEasy } from '@/utils/validate'
import { Random } from '@/utils/index.js'
import DatePicker from '@/components/Tool/DatePicker'

export default {
  name: 'UserBase',
  components: { DatePicker },
  props: {
    form: {
      type: Object,
      default() {
        return {
          username: '', // 账号
          password: '', // 密码
          remark: '', // 备注
          role_id: '', // 角色 id
          time: [], // 使用时间
          area_id: null,
          // card_number: 0 // 权益卡数量  必须为整数
          // account_number: 0// 必须为整数

          account: 0, // 可用账号数
          duration: 0, // 视频时长(分钟)
          voice_number: 0 // 语音次数

        }
      }
    },
    areaList: {
      type: Array,
      default() {}
    },
    rolename: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateArea = (rule, val, callback) => {
      const userArea = this.userArea
      if (userArea.length === 0) callback(new Error('请设置用户所属区域'))
      else if (userArea.length === 1) callback(new Error('请设置正确的地区'))
      else callback()
    }
    // const validateArea = (rule, val, callback) => {
    //   const isRequired = this.isRequired.area
    //   const userArea = this.userArea
    //   if (!isRequired) callback()
    //   else {
    //     if (userArea.length === 0) callback(new Error('请设置用户所属区域'))
    //     else if (userArea.length === 1) callback(new Error('请设置正确的地区'))
    //     else callback()
    //   }
    // }
    const validateDate = (rule, val, callback) => {
      if (val.length) {
        callback()
      } else {
        callback(new Error('请设置使用时间'))
      }
    }
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
      userArea: [], // 地区绑定数据
      showPwd: false, // 是否显示密码内容
      agreePwd: false, // 密码保护
      pwdColor: '',
      formRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: false, trigger: 'blur', validator: validatePassword }],
        remark: [{ required: true, trigger: 'blur', message: '请设置备注' }],
        role_id: [{ required: true, trigger: 'change', message: '请设置用户角色' }],
        // card_number: [{ required: true, trigger: 'blur', message: '请输入权益卡数量' }],
        // account_number: [{ required: true, trigger: 'blur', message: '请输入账号编号' }],
        area_id: [{ required: true, trigger: 'change', validator: validateArea }],
        time: [{ required: true, trigger: 'blur', validator: validateDate }],
        account: [{ required: true, trigger: 'change', message: '请设置可用账号数' }],
        duration: [{ required: true, trigger: 'change', message: '请设置视频时长(分钟)' }],
        voice_number: [{ required: true, trigger: 'change', message: '请设置语音次数' }]

      },

      areaProps: {
        value: 'id',
        label: 'name',
        disabled: 'status',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      shortcuts: [ // 快速选择使用时间
        // {
        //   text: '三天',
        //   onClick(picker) {
        //     const start = new Date()
        //     const end = new Date()
        //     end.setTime(start.getTime() + 3600 * 1000 * 24 * 3)
        //     picker.$emit('pick', [start, end])
        //   }
        // },
        {
          text: '一年',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            end.setFullYear(start.getFullYear() + 1)
            picker.$emit('pick', [start, end])
          }
        }
      ]
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

  watch: {
    // 根据表单数据变化 修改组件绑定数据
    'form.area_id': function() {
      // console.log('根据表单数据变化 修改组件绑定数据')
      // console.log(this.form.area_id)
      if (this.form.area_id > 0) this.userArea = this.countFullAdcode(this.form.area_id)
      else this.userArea = []
    },
    // 监听地区改变修改表单数据
    'userArea': function(newVal) {
      // console.log('监听地区改变修改表单数据')
      this.$emit('area_id', newVal[newVal.length - 1])
    }
  },

  created() {
  },

  methods: {
    // 获取地理位置
    areachange(value) {
      // console.log('获取地理位置')
      // console.log(value)
      this.$emit('change', { key: 'area_id', val: value[value.length - 1] })
    },

    // 计算完整的地区
    countFullAdcode(code) {
      const arr = getCity(code, true)
      const adcode = []
      for (const item of arr) {
        adcode.push(item.id)
      }
      return adcode
    },

    // 时间插件修改回调
    changeTime(val) {
      this.$emit('change', { key: 'time', val })
    },

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

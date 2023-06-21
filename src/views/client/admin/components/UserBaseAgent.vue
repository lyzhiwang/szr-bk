<template>
  <div>
    <el-form ref="form" :model="form" :rules="formRules" :label-position="$store.state.app.labelPosition" label-width="251px">
      <el-form-item label="地区" prop="area">
        <el-cascader v-model="userArea" :options="areaList" :props="areaProps" placeholder="请选择用户所在地区" clearable />
      </el-form-item>
      <el-form-item label="使用时间" prop="date">
        <DatePicker :value="form.date || []" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" :has-shortcuts="true" :shortcuts="shortcuts" @changeTime="changeTime" />
      </el-form-item>

      <template v-if="checkRole(['agent'],form.role_id)">
        <el-form-item label="账号数量" prop="account">
          <el-input-number v-model="form.account" :controls="false" :min="0" :max="999999" placeholder="请输入该用户可开通账号数量" />
        </el-form-item>
        <el-form-item label="操作客服" prop="operator_service">
          <el-select v-model="form.operator_service" placeholder="请设置该用户的操作客服" clearable>
            <el-option v-for="item in agentList" :key="'operator_service'+item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="市场客服" prop="market_service">
          <el-select v-model="form.market_service" placeholder="请设置该用户的市场客服" clearable>
            <el-option v-for="item in agentList" :key="'market_service'+item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </template>

    </el-form>
  </div>
</template>

<script>
import { getCity } from '@/utils/area'
import { validatePositiveInteger } from '@/utils/validate'

import DatePicker from '@/components/Tool/DatePicker'

export default {
  name: 'UserBaseAgent',
  components: { DatePicker },
  props: {
    form: {
      type: Object,
      default() {
        return {
          area: '', // 地区
          date: '', // 使用时间
          account: '', // 账号数量
          operator_service: '', // 操作客服
          market_service: ''// 市场客服
        }
      }
    },
    areaList: {
      type: Array,
      default() {}
    }
  },
  data() {
    const validateArea = (rule, val, callback) => {
      const userArea = this.userArea
      if (userArea.length === 0) callback(new Error('请设置用户所属区域'))
      else if (userArea.length === 1) callback(new Error('请设置正确的地区'))
      else callback()
    }
    const validateDate = (rule, val, callback) => {
      if (val.length) {
        callback()
      } else {
        callback(new Error('请设置使用时间'))
      }
    }
    const validateAccount = (rule, val, callback) => {
      const account = this.form.account
      if (account > 0 && validatePositiveInteger(account)) {
        callback()
      } else {
        callback(new Error('请设置用户可开通账号数量'))
      }
    }
    const validateService = (rule, val, callback) => {
      if (val) {
        callback()
      } else {
        callback(new Error('请设置客服'))
      }
    }
    return {
      userArea: [], // 地区绑定数据
      areaProps: {
        value: 'id',
        label: 'name',
        disabled: 'status',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      shortcuts: [ // 快速选择使用时间
        {
          text: '三天',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 3)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '一年',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            end.setFullYear(start.getFullYear() + 1)
            picker.$emit('pick', [start, end])
          }
        }
      ],
      agentList: [], // 客服列表
      formRules: {
        area: [{ required: true, trigger: 'change', validator: validateArea }],
        date: [{ required: true, trigger: 'blur', validator: validateDate }],
        account: [{ required: true, trigger: 'blur', validator: validateAccount }],
        operator_service: [{ required: true, trigger: 'blur', validator: validateService }],
        market_service: [{ required: true, trigger: 'blur', validator: validateService }]
      }
    }
  },
  computed: {
  },
  watch: {
    // 根据表单数据变化 修改组件绑定数据
    'form.area': function() {
      if (this.form.area > 0) this.userArea = this.countFullAdcode(this.form.area)
      else this.userArea = []
    },
    // 监听地区改变修改表单数据
    'userArea': function(newVal) {
      this.$emit('area', newVal[newVal.length - 1])
    }
  },
  created() {
    this.getAgentList()
    if (this.form.area > 0) this.userArea = this.countFullAdcode(this.form.area)
  },
  methods: {
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
      this.$emit('change', { key: 'date', val })
    },
    // 获取客服列表
    getAgentList() {
      this.apiBtn('AdminIndex', { page: 1, size: 100, role_id: 5 }).then(res => {
        this.agentList = res.data.list
      })
    },
    // 表单验证
    validateForm: function() {
      var result = false
      this.$refs['form'].validate(valid => {
        result = valid
      })
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input-number .el-input__inner{
  text-align: left;
}
</style>

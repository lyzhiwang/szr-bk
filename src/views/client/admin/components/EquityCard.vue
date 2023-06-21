<template>
  <el-dialog :visible.sync="isDialogVisible" title="充值权益卡" :fullscreen="$store.state.app.device === 'mobile' ? true : false" top="7vh" width="450px" @close="resetForm()">
    <el-form ref="form" :rules="rulesForm" :model="form" label-width="100px">

      <!-- <div v-show="step===1">
        <el-form-item label="订单号">
          {{ order.num }}
        </el-form-item>
        <el-form-item label="充值金额">
          ￥ {{ order.money }}
        </el-form-item>
      </div> -->

      <el-form-item label="用户名">
        {{ user.username }}
      </el-form-item>
      <el-form-item label="地区">
        {{ userCity }}
      </el-form-item>
      <el-form-item label="备注">
        {{ user.remark }}
      </el-form-item>

      <div v-show="step===0">
        <el-form-item label="充值金额" prop="money">
          <el-input-number v-model="form.money" :precision="2" :step="1" :min="0" :max="10000000" :controls="false" clearable />
        </el-form-item>
        <!-- <el-form-item label="用户确认" prop="name">
          <el-input v-model="form.name" placeholder="请完整的输入充值用户的用户名" />
        </el-form-item> -->
      </div>

      <el-form-item>
        <el-button v-show="step===0" type="primary" @click="submitForm()">提交</el-button>
        <el-button v-show="step===1" type="primary" @click="confirm()">确认充值</el-button>
        <el-button @click="resetForm()">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>
<script>
import { getCity } from '@/utils/area'

export default {
  name: 'RoleDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default() {
        return {
          id: 1,
          // username: '',
          area: '',
          remark: ''
        }
      }
    }
  },
  data() {
    // const validateName = (rule, val, callback) => {
    //   if (val && val === this.user.username) {
    //     callback()
    //   } else {
    //     callback(new Error('请完整的输入充值用户的用户名'))
    //   }
    // }
    const validateMoney = (rule, val, callback) => {
      if (val && val - 0 !== 0) {
        callback()
      } else {
        callback(new Error('请输入充值权益卡数量'))
      }
    }
    return {
      step: 0,
      isDialogVisible: false,
      form: {
        name: '',
        money: ''
      },
      rulesForm: {
        // name: [
        //   { required: true, trigger: 'blur', validator: validateName }
        // ],
        money: [
          { required: true, trigger: 'blur', validator: validateMoney }
        ]
      },
      order: {
        num: '',
        money: ''
      }
    }
  },
  computed: {
    userCity() {
      const nameList = getCity(this.user.area, true)
      let name = ''
      for (const item of nameList) {
        name = name + item.name
      }
      return name
    }
  },
  watch: {
    isVisible: function(newV, oldV) {
      this.isDialogVisible = newV
      if (this.isVisible === false) {
        this.resetForm()
      }
    }
  },
  methods: {
    // 创建充值
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.apiBtn('', { id: this.user.id, money: this.form.money })
            .then(res => {
              if (res) {
                this.step = 1
                this.order = res.data
              }
            })
        }
      })
    },
    // 二次确认
    confirm() {
      this.apiBtn('', { id: this.user.id, ...this.order })
        .then(res => {
          this.$emit('success', res.data.balance)
          this.resetForm()
        })
    },
    resetForm() {
      this.$emit('close')
      this.step = 0
      this.$refs['form'].resetFields()
    }
  }
}
</script>
<style lang='scss' scoped>
::v-deep .el-input-number .el-input__inner{
  text-align: left;
}
</style>


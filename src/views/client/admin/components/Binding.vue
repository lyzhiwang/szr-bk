<template>
  <div class="generatecard">
    <el-dialog :visible.sync="isDialogVisible" :title="'绑定商家'" top="7vh" width="750px" @close="close">

      <el-form ref="form" :model="form" :rules="formRules" label-width="200px">

        <!-- <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" clearable />
        </el-form-item> -->

        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>
<script>
import { apiBtnTwo } from '@/api/default'
import { mapGetters } from 'vuex'
import { validatePhone } from '@/utils/validate'
/**
 * 添加验证员
 */
export default {
  name: '',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    const validatPhoneNumber = (rule, value, callback) => {
      if (value && (!validatePhone(value))) {
        callback(
          new Error('请输入正确的手机号')
        )
      } else {
        callback()
      }
    }
    return {
      isDialogVisible: false,
      form: {
        id: '',
        // name: '', //   姓名
        phone: '' //   电话
      },
      formRules: {
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: validatPhoneNumber, trigger: 'blur' }],
        name: [{ required: true, trigger: 'blur', message: '请输入姓名' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },

  watch: {
    isVisible: function(newV, oldV) {
      this.isDialogVisible = newV
      if (this.isVisible === false) {
        this.close()
      }
    },
    row: function(newV, oldV) {
      if (this.row.id) {
        this.form.id = this.row.id
        // this.form.name = this.row.name
        this.form.phone = this.row.phone
      }
    }
  },
  created() {
    // this.getAdminInfo()
  },
  methods: {
    // 关闭
    close(val) {
      this.$emit('close', val)
      setTimeout(() => {
        this.form.id = ''
        // this.form.name = ''
        this.form.phone = ''
      }, 10)
    },

    // 提交
    submit() {
    //   console.log(this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          apiBtnTwo('AdminBindStore', this.formateData({ ...this.form }))
            .then((res) => {
              this.close(1)
            })
        }
      })
    },

    // 提交数据校验
    formateData(form) {
    //   this.deleteData(['number'], form)

      return form
    },

    // 便利删除对象
    deleteData(delData, data) {
      // 便利删除对象
      for (const key in data) {
        if (delData.includes(key) && data[key] !== undefined) delete data[key]
      }
    }

  }
}
</script>
<style lang='scss' scoped>
>>> .el-dialog__body {
  padding: 10px 20px 30px;
}
.code {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-around;
  img {
    margin-bottom: 10px;
  }
  .tip-font {
    margin-bottom: 0;
  }
}
.download {
  cursor: pointer;
  color: #3a8ee6;
}

</style>
<style>
.el-picker-panel .el-input{
  width: 100%;
}
</style>

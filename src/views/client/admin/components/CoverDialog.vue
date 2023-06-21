<template>
  <div class="generatecard">
    <el-dialog :visible.sync="isDialogVisible" :title="'增加账号数'" top="7vh" width="750px" @close="close">

      <el-form ref="form" :model="form" :rules="formRules" label-width="200px">

        <el-form-item label="增加账号数" prop="account_number">
          <!-- <el-input v-model="form.account_number" placeholder="请输入增加账号数" clearable /> -->
          <el-input-number v-model="form.account_number" placeholder="请输入增加账号数" maxlength="5" :precision="0" :controls="false" clearable />
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
/**
 *
 */
export default {
  name: 'Generatecard',
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
    return {
      isDialogVisible: false,
      form: {
        id: '',
        account_number: '' //
      },
      formRules: {
        account_number: [{ required: true, trigger: 'blur', message: '请填写增加账号数' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  watch: {
    //
    isVisible: function(newV, oldV) {
      this.isDialogVisible = newV
      if (this.isVisible === false) {
        this.close()
      }
    },

    //
    row: function(newV, oldV) {
      if (this.row.id) {
        this.form.id = this.row.id
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
        this.form.account_number = ''
      }, 10)
    },

    // 提交
    submit() {
      console.log(this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          apiBtnTwo('AdminAccountNum', this.formateData({ ...this.form }))
            .then((res) => {
              this.close(1)
            })
        }
      })
    },

    // 提交数据校验
    formateData(form) {
      if (this.row.id) {
        // this.deleteData(['number'], form)
        form.id = this.row.id
      }

      return form
    },

    // 便利删除对象
    deleteData(delData, data) {
      // 便利删除对象
      for (const key in data) {
        if (delData.includes(key) && data[key] !== undefined) delete data[key]
      }
    },

    // 获取用户详情
    getAdminInfo() {
      this.apiBtn('AdminIndex', { id: this.userId }).then((res) => {
        console.log(res)
        this.surplus_number = res.data.surplus_number
      })
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

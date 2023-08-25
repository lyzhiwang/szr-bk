<template>
  <div class="generatecard">
    <el-dialog :visible.sync="isDialogVisible" :title="'资源分配记录'" top="7vh" width="750px" @close="close">

      <el-form ref="form" :model="form" :rules="formRules" label-width="200px">

        <el-form-item label="资源类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择资源类型" clearable>
            <el-option v-for="item in statuOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item :label="form.type===3 ? '增加数量(套)' : form.type===2 ? '增加数量(次)' :'增加数量(秒)'" prop="resources">
          <el-input-number v-model="form.resources" placeholder="请输入增加账号数" maxlength="5" :precision="0" :controls="false" clearable />
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
// import { apiBtnTwo } from '@/api/default'
import { apiBtn } from '@/api/default'
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
      // statuOptions: [
      //   { label: '视频', value: 1 },
      //   // { label: '语音', value: 2 },
      //   { label: '账号', value: 3 }
      // ],
      form: {
        id: '',
        type: '', // 资源类型 1视频 2语音 3账号
        resources: '' // 秒/次/套
      },
      formRules: {
        type: [{ required: true, trigger: 'blur', message: '请选择资源类型' }],
        resources: [{ required: true, trigger: 'blur', message: '请填写增加数量' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ]),

    // statuOptions: [
    //     { label: '视频', value: 1 },
    //     // { label: '语音', value: 2 },
    //     { label: '账号', value: 3 }
    //   ],
    statuOptions() {
      const list = [
        { label: '时长', value: 1 }
      ]

      if (this.row.role_id !== 6) {
        var obj = { label: '账号', value: 3 }
        list.push(obj)
      }

      return list
    }
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
        this.form.user_id = ''
        this.form.type = ''
        this.form.resources = ''
      }, 10)
    },

    // 提交
    submit() {
      console.log(this.form)
      console.log(this.formateData({ ...this.form }))
      this.$refs['form'].validate((valid) => {
        if (valid) {
          apiBtn('AllocateResources', this.formateData({ ...this.form }))
            .then((res) => {
              this.close(1)
            })
        }
      })
    },

    // 提交数据校验
    formateData(form) {
      var params = {}
      if (this.row.id) {
        // this.deleteData(['number'], form)
        params.user_id = this.row.id
      }
      params.type = form.type
      params.resources = form.resources
      // console.log('zzzzzzzzzzz')
      // console.log(form)
      return params
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

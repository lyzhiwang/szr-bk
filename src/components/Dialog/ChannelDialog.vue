<template>
  <el-dialog
    :visible.sync="isDialogVisible"
    :title="form.id?'编辑':'新增'"
    :fullscreen="$store.state.app.device === 'mobile' ? true : false"
    top="7vh"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :rules="rulesForm" :model="form" label-width="150px">
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="排序（倒序）" prop="sort">
        <el-input-number v-model="form.sort" :min="0" :max="99" label="倒序" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>

export default {
  name: 'ChannelDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: function() {
        return {
          title: '',
          sort: ''
        }
      }
    }
  },
  data() {
    return {
      isDialogVisible: false,
      rulesForm: {
        title: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    isVisible: function(newV, oldV) {
      this.isDialogVisible = newV
      if (this.isVisible === false) {
        this.close()
      }
    }
  },
  created() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.apiBtn(this.form.id ? 'ChannelUpdate' : 'ChannelStore', { ...this.form })
            .then(res => {
              this.$emit('refresh')
              this.close()
            })
        }
      })
    },
    close() {
      this.$emit('close')
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


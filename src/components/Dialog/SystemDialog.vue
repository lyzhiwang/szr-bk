<template>
  <el-dialog
    :visible.sync="isDialogVisible"
    :title="form.id?'编辑':'新增'"
    :fullscreen="$store.state.app.device === 'mobile' ? true : false"
    top="7vh"
    width="700px"
    @close="close"
  >
    <el-form ref="form" :rules="rulesForm" :model="form" label-width="150px">
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入名称（建议中文）" />
      </el-form-item>
      <el-form-item label="命名" prop="name">
        <el-input v-model="form.name" placeholder="请输入命名（建议英文）" />
      </el-form-item>
      <el-form-item label="资源分类" prop="channel">
        <el-select ref="select" v-model="form.channel" placeholder="请选择资源分类">
          <el-option v-for="(item,key) in channelOption" :key="item+key" :label="item" :value="Number(key)" />
        </el-select>
      </el-form-item>
      <el-form-item label="表单类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="(item,key) in typeOption" :key="item+key" :label="Number(key)">{{ item }}</el-radio>
        </el-radio-group>
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
  name: 'SystemDialog',
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
          name: '',
          channel: '',
          type: ''
        }
      }
    },
    channelOption: {
      type: Object,
      default() {}
    }
    // typeOption: {
    //   type: Object,
    //   default() {}
    // }
  },
  data() {
    return {
      typeOption: { 1: 'input', 2: 'image', 3: 'textarea', 4: 'editor' },
      isDialogVisible: false,
      rulesForm: {
        title: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        channel: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择分类', trigger: 'change' }
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
          this.apiBtn(this.form.id ? 'SystemUpdate' : 'SystemStore', { ...this.form })
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


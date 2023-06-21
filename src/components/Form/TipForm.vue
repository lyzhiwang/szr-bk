<template>
  <div class="app-container">
    <el-card class="box-card">
      <tip :title="$route.query.id?'修改系统公告': '添加系统公告'" size="small" />

      <el-form ref="form" :model="form" :rules="rulesForm" label-width="251px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题,2-20个字符" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入公告描述，2-50个字符" />
        </el-form-item>
        <el-form-item label="公告时间" prop="time">
          <DatePicker :value="form.time" type="date" @changeTime="changeTime" />
        </el-form-item>
        <el-form-item label="类型" prop="role">
          <el-checkbox-group v-model="form.role">
            <el-checkbox
              v-for="(item,key) in roleOption"
              :key="key"
              :label="item.id"
              name="role"
            >{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="标签">
          <tag-manage :value="form.tag" @change="tagChange" />
        </el-form-item>
        <el-form-item label="详情" prop="content">
          <Tinymce :html="form.content" @change="changeRichText" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">提交</el-button>
          <el-button @click="resetForm('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import DatePicker from '@/components/Tool/DatePicker'
import Tinymce from '@/components/Tinymce/index'
import TagManage from '@/components/TagManage/index'
import { apiBtn } from '@/api/default'

export default {
  components: { Tinymce, TagManage, DatePicker },
  data() {
    var validateEditor = (rule, value, callback) => {
      if (!this.form.content) {
        callback(new Error('请输入详情'))
      } else {
        callback()
      }
    }
    return {
      form: {
        title: '',
        time: '',
        role: [],
        tag: [],
        content: '',
        description: ''
      },
      rulesForm: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, max: 20, message: '长度2-20个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          { min: 2, max: 50, message: '长度2-50个字符', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入详情', trigger: 'change' },
          { validator: validateEditor, trigger: 'change' }
        ]
      },
      roleOption: [
        {
          id: 7,
          // name: '服务商'
          name: '服务商'
        },
        {
          id: 9,
          name: '门店'
        }
      ]
    }
  },
  created() {
    if (this.$route.query.id) this.getTip()
    this.getTipRole()
  },
  methods: {
    // 角色列表
    getTipRole() {
      apiBtn('RoleIndex', { route: 'tip' })
        .then(res => {
          this.roleOption = res.data
        })
    },
    getTip() {
      apiBtn('TipShow', { id: this.$route.query.id })
        .then(res => {
          this.form = res.data
        })
    },
    onSubmit(formName) {
      // 富文本框 提交事件
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$route.query.id) this.edit(formName)
          else this.add(formName)
        }
      })
    },
    add(formName) {
      apiBtn('TipStore', { ...this.form })
        .then(() => {
          this.resetForm(formName)
        })
    },
    edit(formName) {
      apiBtn('TipUpdate', { ...this.form }).then(() => {
        this.resetForm(formName)
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$store.dispatch('tagsView/delView', this.$route).then(() => {
        this.$router.go(-1)
      })
    },
    // 同步富文本框值
    changeRichText(val) {
      this.form.content = val
    },
    // 标签改变事件
    tagChange(arr) {
      this.form.tag = arr
    },
    changeTime(v) {
      this.form.time = v
    }
  }

}
</script>
<style lang="scss" scoped>
.el-checkbox {
  margin-left: 0;
  margin-right: 30px;
  width: 80px;
}
</style>


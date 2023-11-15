<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-position="right"
      label-width="251px"
    >
      <tip :title="disabled ? '修改版本' : '添加版本'" />

      <el-form-item label="oem_id" prop="oem_id">
        <el-input v-model="form.oem_id" clearable />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>

      <template>
        <el-form-item label="文件" prop="file_id">
          <UploadAli :type="19" :list="form.file_id" :limit="1" :size-limit="1024000" @change="changeimg" @delete="removeimg" />
        </el-form-item>
      </template>

      <el-form-item label="版本号" prop="version">
        <el-input v-model="form.version" clearable />
      </el-form-item>

      <div class="submit_btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click=" submititem( disabled ? 'VersionsUpdate' : 'VersionsStore' )">
          提交
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import UploadAli from '@/components/Upload/Ali.vue'
// import { apiBtnTwo } from '@/api/default'
export default {
  name: '',
  components: { UploadAli },
  data() {
    const validatePic = (rule, val, callback) => {
      if (this.form.file_id && this.form.file_id[0] && this.form.file_id[0].path && this.form.file_id[0].id) { callback() } else callback(new Error('请上传文件'))
    }
    return {
      disabled: !!this.$route.query.version_id,
      form: {
        id: '',
        file_id: [], // (上传到阿里云)
        oem_id: '', //
        name: '', //
        version: '' //
      },

      formRules: {
        oem_id: [{ required: true, trigger: 'change', message: '请输入oem_id' }],
        name: [{ required: true, trigger: 'change', message: '请输入项目名称' }],
        version: [
          { required: true, trigger: 'change', message: '请输入版本号' }
        ],
        file_id: [{ required: true, trigger: 'change', validator: validatePic }]
      }
    }
  },

  computed: {

  },

  watch: {},
  created() {
    if (this.$route.query.version_id) {
      this.getDetail(this.$route.query.version_id)
    }
  },

  mounted() {

  },

  methods: {

    // 获取
    changeimg(val) {
      console.log('获取图片')
      console.log(val)
      var obj = {}
      obj.id = val.id
      obj.path = val.path
      obj.name = val.name
      this.form.file_id[0] = obj
    },

    // 删除
    removeimg(val) {
      console.log('删除')
      console.log(val)
      // const file_id = [...this.form.file_id]
      // for (let i = 0; i < file_id.length; i++) {
      //   if (file_id[i].id === val.id) {
      //     file_id.splice(i, 1)
      //   }
      // }
      // this.form.file_id = file_id
    },

    // 获取详情
    getDetail(id) {
      this.apiBtn('VersionsDetail', {
        id: id
      }).then((res) => {
        this.form.id = res.data.id
        this.form.oem_id = res.data.oem_id
        this.form.name = res.data.name
        this.form.version = res.data.version
        this.form.file_id.push(res.data.file)
      })
    },

    // 返回上一页
    cancel() {
      this.$router.go(-1)
    },

    // 提交
    submititem(name) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.apiBtn(name, this.formateData({ ...this.form })).then((res) => {
            // console.log(res)
            this.cancel()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 提交数据校验
    formateData(form) {
      var params = {}
      if (form.id) {
        params.id = form.id
      }
      params.oem_id = form.oem_id
      params.name = form.name
      params.version = form.version
      // params.file_id = form.file_id
      params.file_id = form.file_id[0].id
      // if (form.charge_commission_switch === 0) {
      //   this.deleteData(['charge_commission_ratio'], form)
      // }
      // console.log('qqqqqqqqqqqq')
      // console.log(params)
      return params
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

<style lang="scss" scoped>
.tip-font {
  margin-left: 250px;
}
.submit_btn {
  margin-left: 250px;
  margin-bottom: 40px;
}
.type_list {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  top: 13px;
  .type_list_item {
    margin-right: 20px;
    margin-bottom: 20px;
  }
}
</style>

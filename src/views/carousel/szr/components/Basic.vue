<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-position="right"
      label-width="251px"
    >
      <tip :title="disabled ? '修改数字人' : '添加数字人'" />

      <el-form-item label="数字人名称" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>

      <el-form-item label="数字人ID" prop="human_id">
        <el-input v-model="form.human_id" clearable />
      </el-form-item>

      <template>
        <el-form-item label="数字人形象" prop="image">
          <UploadAli :type="9" :list="form.image" :limit="1" @change="changeimg" @delete="removeimg" />
        </el-form-item>
      </template>

      <el-form-item label="是否公开" prop="public">
        <el-radio-group v-model="form.public">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="submit_btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click=" submititem( disabled ? 'HumansUpdate' : 'HumansStore' )">
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
      // if (this.form.image && this.form.image && this.form.image.path && this.form.image.id) {
      //   callback()
      // } else {
      //   callback(new Error('请上传图片'))
      // }
      if (this.form.image && this.form.image[0] && this.form.image[0].path && this.form.image[0].id) { callback() } else callback(new Error('请上传图片'))
    }
    return {
      disabled: !!this.$route.query.image_id,
      form: {
        id: '',
        human_id: '',
        name: '',
        public: null,
        image: [
          // {
          //   id: '', // 图片id
          //   path: '' // 图片地址
          // }
        ]
      },

      formRules: {
        name: [{ required: true, trigger: 'change', message: '请输入数字人名称' }],
        human_id: [{ required: true, trigger: 'change', message: '请输入数字人id' }],
        public: [{ required: true, trigger: 'change', message: '请选择是否公开' }],
        image: [{ required: true, trigger: 'change', validator: validatePic }]
      }
    }
  },

  computed: {

  },

  watch: {},
  created() {
    if (this.$route.query.image_id) {
      this.getDetail(this.$route.query.image_id)
    }
  },

  mounted() {

  },

  methods: {

    // 获取图片
    changeimg(val) {
      console.log('获取图片')
      console.log(val)
      var obj = {}
      obj.id = val.id
      obj.path = val.path
      this.form.image[0] = obj
    },

    // 删除图片
    removeimg(val) {
      // console.log('删除图片')
      // console.log(val)
      const image = [...this.form.image]
      for (let i = 0; i < image.length; i++) {
        if (image[i].id === val.id) {
          image.splice(i, 1)
        }
      }
      this.form.image = image
    },

    // 获取详情
    getDetail(id) {
      this.apiBtn('HumansDetail', {
        id: id
      }).then((res) => {
        // this.form = res.data
        this.form.id = res.data.id
        this.form.human_id = res.data.human_id
        this.form.name = res.data.name
        this.form.public = res.data.public
        if (res.data.image) {
          this.form.image.push(res.data.image)
        }
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
      params.human_id = form.human_id
      params.name = this.form.name
      // params.image = form.image.id
      params.image = form.image[0].id
      params.public = this.form.public

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

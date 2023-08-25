<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-position="right"
      label-width="251px"
    >
      <tip :title="disabled ? '修改背景图' : '添加背景图'" />

      <el-form-item label="背景图类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">纯色</el-radio>
          <el-radio :label="2">普通</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="屏幕方向" prop="screen">
        <el-radio-group v-model="form.screen">
          <el-radio :label="1">竖屏</el-radio>
          <el-radio :label="2">横屏</el-radio>
        </el-radio-group>
      </el-form-item>

      <template>
        <el-form-item label="图片" prop="image">
          <UploadAli :type="9" :list="form.image" :limit="1" @change="changeimg" @delete="removeimg" />
        </el-form-item>
      </template>

      <el-form-item label="排序" prop="sort">
        <el-input v-model="form.sort" clearable />
      </el-form-item>
      <div class="tip-font">数值越大排序越靠前</div>

      <div class="submit_btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click=" submititem( disabled ? 'ShortvideobackgroundUpdate' : 'ShortvideobackgroundStore' )">
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
      if (this.form.image && this.form.image[0] && this.form.image[0].path && this.form.image[0].id) { callback() } else callback(new Error('请上传图片'))
    }
    return {
      disabled: !!this.$route.query.image_id,
      form: {
        id: '',
        screen: 1, //    屏幕方向 1竖屏 2横屏
        image: [
          // {
          //   id: '', // 图片id
          //   path: '' // 图片地址
          // }
        ],
        type: 1, // 类型 1纯色 2普通
        bg_id: '', // 背景图id (上传到阿里云)
        sort: 100 // 排序值
      },

      formRules: {
        bg_id: [{ required: true, trigger: 'change', message: '请上传背景图片' }],
        screen: [{ required: true, trigger: 'change', message: '请选择屏幕方向' }],
        type: [{ required: true, trigger: 'change', message: '请选择背景类型' }],
        sort: [
          { required: true, trigger: 'change', message: '请输入商品排序权重' }
        ],
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
      // console.log('获取图片')
      // console.log(val)
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
      // platform_type: this.platform_type
      this.apiBtn('ShortvideobackgroundShow', {
        id: id
      }).then((res) => {
        this.form.id = res.data.id
        this.form.sort = res.data.sort
        this.form.bg_id = res.data.bg_id
        this.form.type = res.data.type
        this.form.screen = res.data.screen
        this.form.image.push(res.data.bg)
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
          // if (!this.disabled) {
          //   this.apiBtn(name, this.formateData({ ...this.form })).then((res) => {
          //   // console.log(res)
          //     this.cancel()
          //   })
          // } else {
          //   apiBtnTwo(name, this.formateData({ ...this.form })).then((res) => {
          //   // console.log(res)
          //     this.cancel()
          //   })
          // }
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
      params.sort = form.sort
      params.screen = this.form.screen
      params.bg_id = form.image[0].id
      params.type = this.form.type

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

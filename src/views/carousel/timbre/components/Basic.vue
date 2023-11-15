<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-position="right"
      label-width="251px"
    >
      <tip :title="disabled ? '修改音色' : '添加音色'" />

      <el-form-item label="数字人名称" prop="name">
        <el-input v-model="form.name" clearable />
      </el-form-item>

      <el-form-item label="平台类型" prop="platform_type">
        <el-select v-model="form.platform_type" placeholder="请选择平台类型" clearable>
          <el-option v-for="item in statuOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="voice" prop="voice">
        <el-input v-model="form.voice" clearable />
      </el-form-item>
      <el-form-item label="声音类型" prop="type">
        <el-input v-model="form.type" clearable />
      </el-form-item>
      <el-form-item label="场景" prop="scene">
        <el-input v-model="form.scene" clearable />
      </el-form-item>

      <template>
        <el-form-item label="文件" prop="file_id">
          <UploadAli :type="20" :list="form.file_id" :limit="1" @change="changeimg" @delete="removeimg" />
        </el-form-item>
      </template>

      <div class="submit_btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click=" submititem( disabled ? 'TimbresUpdate' : 'TimbresStore' )">
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
      disabled: !!this.$route.query.timbres_id,
      form: {
        id: '',
        name: '', //
        platform_type: '',
        voice: '',
        type: '',
        scene: '',
        file_id: [
          // {
          //   id: '', // 图片id
          //   path: '' // 图片地址
          // }
        ]
      },
      statuOptions: [
        { label: '阿里云', value: 1 },
        { label: '深声', value: 2 }
      ],

      formRules: {
        name: [{ required: true, trigger: 'change', message: '请输入数字人名称' }],
        platform_type: [{ required: true, trigger: 'change', message: '请选择平台类型' }],
        type: [{ required: true, trigger: 'change', message: '请选择声音类型' }],
        scene: [{ required: true, trigger: 'change', message: '请输入场景' }],
        voice: [
          { required: true, trigger: 'change', message: '请输入voice' }
        ],
        file_id: [{ required: true, trigger: 'change', validator: validatePic }]
      }
    }
  },

  computed: {

  },

  watch: {},
  created() {
    if (this.$route.query.timbres_id) {
      this.getDetail(this.$route.query.timbres_id)
    }
  },

  mounted() {

  },

  methods: {

    // 获取图片
    changeimg(val) {
      // console.log('获取')
      // console.log(val)
      var obj = {}
      obj.id = val.id
      obj.path = val.path
      obj.name = val.name
      this.form.file_id[0] = obj
    },

    // 删除
    removeimg(val) {
      // console.log('删除')
      // console.log(val)
      const file_id = [...this.form.file_id]
      for (let i = 0; i < file_id.length; i++) {
        if (file_id[i].id === val.id) {
          file_id.splice(i, 1)
        }
      }
      this.form.file_id = file_id
    },

    // 获取详情
    getDetail(id) {
      // platform_type: this.platform_type
      this.apiBtn('TimbresDetail', {
        id: id
      }).then((res) => {
        this.form.id = res.data.id
        this.form.name = res.data.name
        this.form.platform_type = res.data.platform_type
        this.form.type = res.data.type
        this.form.scene = res.data.scene
        this.form.voice = res.data.voice
        const objj = {
          id: res.data.file_id,
          path: res.data.audition_url,
          name: res.data.file_name
        }
        this.form.file_id.push(objj)
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
      params.name = form.name
      params.scene = form.scene
      params.platform_type = form.platform_type
      params.type = form.type

      params.voice = form.voice

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

<template>
  <div class="detail">
    <el-form ref="form" :model="form" :rules="formRules" label-position="right" label-width="180px">

      <!-- <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item> -->

      <el-form-item label="默认分配账号套数">
        <el-input-number v-model="form.acount" placeholder="请输入默认分配账号套数" maxlength="10" :controls="false" clearable :precision="0" />
      </el-form-item>
      <el-form-item label="默认分配视频时长(分钟)">
        <el-input-number v-model="form.duration" placeholder="请输入默认分配视频时长" maxlength="10" :controls="false" clearable :precision="0" />
      </el-form-item>
      <el-form-item label="默认分配语音次数">
        <el-input-number v-model="form.voice_number" placeholder="请输入默认分配语音次数" maxlength="10" :controls="false" clearable :precision="0" />
      </el-form-item>

      <div class="submit_btn">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Allocation',
  data() {
    return {
      iscreate: true, // 是否是创建
      form: {
        id: '',
        acount: '', // 默认分配账号套数
        duration: '', // 默认分配视频时长
        voice_number: '' // 默认分配语音次数
      },
      formRules: {
        name: [{ required: true, trigger: 'change', message: '请输入名称' }],
        phone: [{ required: true, trigger: 'change', message: '联系方式不能为空' }]
      }
    }
  },
  computed: {
    ...mapState({
      userid: state => state.user.userId
    })
  },
  created() {
    this.getDetail()
  },
  mounted() {},
  methods: {

    // 获取设置详情
    getDetail() {
      this.apiBtn('AllocationShow', { id: this.userid }).then((res) => {
        if (res.data.length !== 0) {
          this.iscreate = false
          this.form = res.data
        }
      })
    },

    // 提交
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.apiBtn(this.iscreate ? 'AllocationStore' : 'AllocationUpdate', this.formateData({ ...this.form })).then(res => {
            console.log(res)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 提交数据校验
    formateData(form) {
      form.id = this.userid
      //   form.logo = form.logo.id
      //   form.qrcode = form.qrcode.id
      //   this.deleteData(['fixed'], form)
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

  <style lang="scss" scoped>
  .detail{
    padding-top: 30px;
  }
  .submit_btn{
    margin-left: 150px;
    margin-bottom: 40px;
  }
  </style>


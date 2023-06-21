<template>
  <el-dialog :visible.sync="currentVisible" :close-on-click-modal="false" :fullscreen="$store.state.app.device === 'mobile' ? true : false" title="地区信息" width="500px" center>
    <el-form
      ref="currentForm"
      :model="currentForm"
      :rules="formRules"
      :label-position="$store.state.app.labelPosition"
      label-width="120px"
    >
      <el-form-item v-if="name === 'AreaStore'" label="省级行政区">
        <el-input v-model="province" disabled />
      </el-form-item>
      <el-form-item v-if="name === 'AreaStore' && currentForm._level >= 2" label="地级行政区">
        <el-input v-model="city" disabled />
      </el-form-item>
      <el-form-item label="Id" prop="id">
        <el-input v-model="currentForm.id" maxlength="6" clearable />
      </el-form-item>
      <el-form-item label="地区" prop="name">
        <el-input v-model="currentForm.name" clearable />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button type="primary" @click="submit">{{ name === 'AreaStore' ? '添加' : '修改' }}</el-button>
      <el-button @click="toggleDialog()">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>

import { validateNumber, validatChinese } from '@/utils/validate'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    areaInfo: {
      type: Object,
      default() { }
    },
    name: {
      type: String,
      default: 'AreaStore'
    }
  },
  data() {
    const validateId = (rule, val, callback) => {
      if (String(val).length === 6 && validateNumber(val)) {
        callback()
      } else {
        callback(new Error('请设置正确的Id'))
      }
    }
    const validateName = (rule, val, callback) => {
      if (val && validatChinese(val)) {
        callback()
      } else {
        callback(new Error('请设置正确的地区'))
      }
    }
    return {
      currentVisible: false,
      currentForm: {},
      formRules: {
        id: [{ required: true, trigger: 'blur', validator: validateId }],
        name: [{ required: true, trigger: 'blur', validator: validateName }]
      }
    }
  },
  computed: {
    province() {
      if (this.areaInfo._level === 1) {
        const p = this.areaInfo.name
        return p
      } else if (this.areaInfo._level === 2) {
        const p = this.areaInfo.parent.name
        return p
      } else if (this.areaInfo._level === 3) {
        const p = this.areaInfo.parent.parent.name
        return p
      } else return ''
    },
    city() {
      if (this.areaInfo._level === 2) {
        const p = this.areaInfo.name
        return p
      } else {
        const p = this.areaInfo.parent.name
        return p
      }
    }
  },
  watch: {
    dialogVisible(val) {
      this.currentVisible = val
      if (!val) this.$refs.currentForm.resetFields()
    },
    areaInfo: {
      deep: true,
      handler() {
        this.currentForm = { ...this.areaInfo }
        if (this.name === 'AreaStore') {
          this.currentForm.id = null
          this.currentForm.name = null
        }
      }
    }
  },
  methods: {
    submit() {
      this.$refs['currentForm'].validate(valid => {
        if (valid) {
          if (this.name === 'AreaStore') {
            this.append()
            return
          }
          if (this.name === 'AreaUpdate') {
            this.update()
            return
          }
        }
      })
    },
    // 添加
    append() {
      const params = {
        pid: Number(this.areaInfo.id),
        id: Number(this.currentForm.id),
        name: this.currentForm.name
      }
      this.apiBtn(this.name, params)
        .then(res => {
          this.$store.commit('area/APPEND_AREA', params)
          this.toggleDialog()
        })
    },
    // 修改
    update() {
      var hasChange = false
      for (const item in this.currentForm) { // 判断是否修改
        if (this.currentForm[item] !== this.areaInfo[item]) {
          hasChange = true
          break
        }
      }

      if (hasChange) {
        const params = {
          id: this.areaInfo.id,
          name: this.currentForm.name,
          newId: Number(this.currentForm.id)
        }
        this.apiBtn(this.name, { ...params })
          .then(res => {
            this.$store.commit('area/UPDATE_AREA', params)
            this.toggleDialog()
          })
      }
    },
    toggleDialog() {
      this.currentForm = {} // 初始化
      this.currentVisible = false
      this.$emit('toggleDialog', '')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

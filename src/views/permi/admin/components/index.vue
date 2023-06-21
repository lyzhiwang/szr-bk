<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div>
          <span>{{ $route.query.id?'编辑用户':'新增用户' }}</span>
        </div>
      </template>
      <div>
        <!-- 基础 所有-->
        <tip title="基础信息" />
        <user-base ref="userBase" :form="form" @change="changeForm" />
        <template v-if="checkRole(['admin','operation'])">
          <!-- 基础 代理门店-->
          <user-base-agent v-if="checkRole(['agent','store'],form.role_id)" ref="userBaseAgent" :area-list="areaList" :form="form" @change="changeForm" />
          <!-- 基础 运营-->
          <user-base-operation v-if="checkRole(['operation'],form.role_id)" ref="userBaseOperation" :form="form" @change="changeForm" />
        </template>
        <!-- 特殊功能 -->
        <template v-if="checkRole(['agent','store'],form.role_id)">
          <tip title="附加功能" />
          <user-features ref="userFeatures" :form="form" @change="changeForm" />
        </template>

        <div style="padding-left:251px">
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAreaStorage } from '@/utils/storage'

import UserBase from './UserBase.vue'
import UserBaseAgent from './UserBaseAgent.vue'
import UserBaseOperation from './UserBaseOperation.vue'
import UserFeatures from './UserFeatures.vue'

export default {
  name: 'Base',
  components: { UserBase, UserBaseAgent, UserBaseOperation, UserFeatures },
  data() {
    return {
      form: {
        // 基础字段
        username: '', // 用户名
        password: '', // 密码
        remark: '', // 备注
        role_id: '', // 角色
        area: '', // 地区
        date: '', // 使用时间
        account: '', // 账号数量
        operator_service: '', // 操作客服
        market_service: '', // 市场客服
        // 客服填写
        name: '', // 商家姓名/运营名称
        phone: '', // 商家电话/运营电话
        service_code: { path: '' }, // 商家二维码/运营二维码
        // 附加功能
        customer_video: false, // 霸屏广告
        is_national: false, // 全国红包
        is_open_card: false, // 红包卡劵
        is_open_authorization: false, // 吸粉
        custom_name: '', // 自定义名称
        custom_icon: { path: '' }, // 自定义logo
        is_weapp: false, // 是否开启小程序
        weapp_image: { path: '' }// 小程序码
      }
    }
  },
  computed: {
  },
  created() {
    this.$store.dispatch('config/GetRoleList', { route: 'agent' })
      .then(res => {
        this.$store.dispatch('area/GetArea')
          .then(res => {
            this.getAdminInfo()
            // 获取地区列表
            this.areaList = getAreaStorage()
          })
      })
  },
  methods: {
    // 获取用户详情
    getAdminInfo() {
      if (!this.$route.query.id) return
      this.apiBtn('AdminIndex', { id: this.$route.query.id }).then((res) => {
        console.log(res)
      })
    },
    // 提交数据
    submit() {
      if (this.validateForm()) {
        this.apiBtn(this.form.id ? 'AdminUpdate' : 'AdminStore', this.formateData({ ...this.form })).then((res) => {
          console.log(res)
        })
      }
    },
    // 子组件修改值
    changeForm(obj) {
      this.$set(this.form, obj.key, obj.val)
    },
    // 校验
    validateForm() {
      const list = ['userBase', 'userBaseAgent', 'userBaseOperation', 'userFeatures']
      let result = true
      for (let i = 0; i < list.length; i++) {
        const name = list[i]
        const ref = this.$refs[name]
        // 保证全部检验：一定要用一个&
        result = result & (ref ? ref.validateForm() : true)
      }
      return result
    },
    // 格式化字段
    formateData(data) {
      // 不会删除的字段： const base = ['username', 'password', 'remark', 'role_id']
      const agent = ['account', 'operator_service', 'market_service']
      const store = ['area', 'date']
      const actionStore = ['customer_video', 'is_national', 'is_open_card']
      const actionAgent = ['is_open_authorization', 'is_open_card', 'custom_name', 'custom_icon', 'is_weapp', 'weapp_image']
      const operation = ['name', 'phone', 'service_code']

      // 将要删除的字段
      let delData = []
      // 图片字段
      const pic = ['service_code', 'custom_icon', 'weapp_image']

      if (this.checkRole(['admin', 'operation'])) {
        if (this.checkRole(['admin', 'account'], data.role)) delData = delData.concat(agent, store, actionStore, actionAgent, operation)
        else if (this.checkRole(['operation'], data.role)) delData = delData.concat(agent, store, actionStore, actionAgent)
        else if (this.checkRole(['agent'], data.role)) {
          delData = delData.concat(operation)
          // 代理未打开直接关闭
          if (!data.is_weapp) delete data.weapp_image
        } else if (this.checkRole(['store'], data.role)) {
          delData = delData.concat(agent, actionAgent, operation)
        }
      } else {
        // 此情况下是代理创建门店，只需要填写基本信息
        delData = delData.concat(agent, store, actionAgent, operation)
      }

      // 便利删除对象 修改图片对象格式
      for (const key in data) {
        if (delData.includes(key)) delete data[key]
        else if (pic.includes(key)) data[key] = data.id || 0
      }

      return data
    }

  }

}
</script>

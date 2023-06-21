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
        <user-base ref="userBase" :form="form" :area-list="areaList" :rolename="rolename" @change="changeForm" />
        <!-- <template v-if="checkRole(['admin','operation'])"> -->
        <!-- 基础 服务门店-->
        <!-- <user-base-agent v-if="checkRole(['agent','store'],form.role_id)" ref="userBaseAgent" :area-list="areaList" :form="form" @change="changeForm" /> -->
        <!-- 基础 运营-->
        <!-- <user-base-operation v-if="checkRole(['operation'],form.role_id)" ref="userBaseOperation" :form="form" @change="changeForm" /> -->
        <!-- </template> -->
        <!-- 特殊功能 -->
        <!-- <template v-if="checkRole(['agent','store'],form.role_id)">
          <tip title="附加功能" />
          <user-features ref="userFeatures" :form="form" @change="changeForm" />
        </template> -->

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
import { toDates } from '@/utils/index'
// import UserBaseAgent from './UserBaseAgent.vue'
// import UserBaseOperation from './UserBaseOperation.vue'
// import UserFeatures from './UserFeatures.vue'

export default {
  name: 'Base',
  // components: { UserBase, UserBaseAgent, UserBaseOperation, UserFeatures },
  components: { UserBase },
  data() {
    return {
      form: {
        username: '', // 用户名
        password: '', // 密码
        role_id: '', // 角色id  2-运营3-OEM服务商4-门店
        remark: '', // 备注
        time: [],
        area_id: null, //
        // card_number: 0 // 权益卡数量
        account_number: 0
      },
      rolename: '',
      areaList: []
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
        var data = res.data
        for (const item in data) {
          if (item === 'time') {
            data[item][0] = new Date(data[item][0]).getTime() / 1000
            data[item][1] = new Date(data[item][1]).getTime() / 1000
          }
        }
        this.form = data
        this.rolename = data.role.name
      })
    },

    // 返回
    cancel() {
      this.$router.go(-1)
    },

    // 提交数据
    submit() {
      if (this.validateForm()) {
        this.apiBtn(this.form.id ? 'AdminUpdate' : 'AdminStore', this.formateData({ ...this.form })).then((res) => {
          console.log(res)
          this.cancel()
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
      for (const item in data) {
        if (item === 'time') {
          data[item][0] = toDates(data[item][0])
          data[item][1] = toDates(data[item][1])
        }
      }
      return data
    }

  }

}
</script>

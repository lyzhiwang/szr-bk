<template>
  <div v-loading="loading" class="app-container">
    <el-row>
      <el-col>
        <el-card v-show="showAll" class="box-card top-card">
          <template #header>
            <div class="top-card-header">
              <img :src="$store.state.user.avatar">
              <div class="top-card-info">
                <div class="top-card-info-user">{{ person.username }}</div>
                <div class="top-card-info-money">{{ person.money }}元</div>
              </div>
              <div>
                <el-button type="primary" @click="toRedirect('PaymentStore')">充值</el-button>
                <el-button v-if="showAuth" :disabled="!!isAuth" type="primary" @click="getURL('AgentAuth')">{{ isAuth?'公众号已授权':'公众号授权' }}</el-button>
              </div>
            </div>
          </template>
          <el-row>
            <el-col :xs="12" :sm="8">地区：{{ getArea }}</el-col>
            <el-col :xs="12" :sm="8">账号：{{ person.store + '/' + person.account }}(已开通/总数量)</el-col>
            <el-col :xs="12" :sm="8">时间：{{ person.date[0] | parseTime('{y}-{m}-{d}') }} ~ {{ person.date[1] | parseTime('{y}-{m}-{d}') }}</el-col>
            <el-col :xs="12" :sm="8">商户类型：{{ nature_status[person.nature] }}</el-col>
            <el-col :xs="12" :sm="8">负责人姓名：{{ person.name }}</el-col>
            <el-col :xs="12" :sm="8">负责人电话：{{ person.phone }}</el-col>
          </el-row>
        </el-card>
        <el-card class="box-card">
          <template #header>
            <div>修改账户信息</div>
          </template>
          <tip title="用户信息" />
          <el-form ref="person" :rules="rulesForm" :model="person" :label-position="$store.state.app.labelPosition" label-width="251px">
            <template v-if="showAll">
              <el-form-item label="头像" prop="avatar" class="person-avater">
                <FileManager key="avatar" :value="person.avatar" :type="9" :size="1024" @change="update" />
              </el-form-item>
              <el-form-item label="紧急联系人姓名" prop="two_name">
                <el-input
                  v-model="person.two_name"
                  placeholder="紧急联系人姓名长度在 2 到 10 个字符"
                  maxlength="10"
                />
              </el-form-item>
              <el-form-item label="紧急联系人电话" prop="two_phone">
                <el-input v-model="person.two_phone" maxlength="11" placeholder="紧急联系人手机号码" />
              </el-form-item>
            </template>
            <user-base-operation v-else ref="serviceChild" :form="person" @change="updateForm" />
          </el-form>
          <shop v-if="showAll" ref="shopChild" :form="person" @change="updateForm" />

          <el-button
            v-has="'AdminPatch'"
            type="primary"
            style="margin-left:251px"
            @click="onSubmit"
          >更新</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import { getCity } from '@/utils/area'
import { validatePhone } from '@/utils/validate'

import FileManager from '@/components/FileManager/index'
import Shop from '@/components/Form/Sys/Shop'
import UserBaseOperation from '@/views/permi/admin/components/UserBaseOperation'

export default {
  name: 'BaseInfo',
  components: { FileManager, Shop, UserBaseOperation },
  data() {
    const validatPhoneNumber = (rule, value, callback) => {
      if (value && (!validatePhone(value))) {
        callback(
          new Error('请输入正确的手机号')
        )
      } else {
        callback()
      }
    }
    const validateFile = (rule, value, callback) => {
      if (value && value.id && value.path) callback()
      else callback(new Error('请上传图片'))
    }

    return {
      person: {
        'id': 0,
        'username': 'XXX',
        'area': 110101,
        'store': 0, // 已经开通的账号数
        'account': 0, // 可以开通账号的总数量
        'remark': 'XXX', // 备注
        'phone': 'XXX',
        'money': 0,
        'date': [1589385600, 1592582400],
        'name': 'XXX',
        'nature': 1,
        'two_name': '',
        'two_phone': '',
        'avatar': { path: '' }, // 头像

        shop_name: '', // 商家名称
        address: '', // 商家位置
        location: '', // 商家坐标
        service_code: { path: '' }, // 商家二维码
        service_phone: '' // 商家客服电话
      },
      rulesForm: {
        avatar: [
          { required: true, validator: validateFile, message: '请上传头像', trigger: 'change' }
        ],
        two_name: [
          { required: false, min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        two_phone: [
          { validator: validatPhoneNumber, trigger: 'blur' }
        ]
      },
      // 1:企业 2：个人 3：门店
      nature_status: {
        1: '企业',
        2: '个人',
        3: '门店'
      },
      loading: true
    }
  },
  computed: {
    ...mapState({
      isAuth: state => state.user.is_open_authorization && state.user.is_authorization
    }),
    ...mapGetters([
      'roles'
    ]),
    notShowStore() {
      return this.$store.getters.roles[0] !== 9
    },
    getArea() {
      if (!this.person.area) return '全国'
      var area = getCity(this.person.area, true)
      var result = ''
      area.forEach(element => {
        result += (result ? ' / ' + element.name : element.name)
      })
      return result
    },
    showAll() {
      return [7, 8, 9].includes(this.roles[0])
    },
    showAuth() {
      return this.$store.state.user.is_open_authorization && this.$_has('AgentAuth')
    }
  },
  created() {
    this.getInfo()
    this.$store.dispatch('area/GetArea')
  },
  methods: {
    getInfo() {
      // 获取用户信息
      this.apiBtn('AdminShow', { id: this.$store.getters.userId })
        .then((res) => {
          this.person = { ...res.data }
          this.person.service_code = {
            id: this.person.service_code,
            path: this.person.upload[this.person.service_code]
          }
          this.person.avatar = {
            id: this.person.avatar,
            path: this.person.upload[this.person.avatar]
          }
          setTimeout(() => {
            this.loading = false
          }, 500)
        })
    },
    // 更新基本信息,开户方信息
    onSubmit(callback) {
      this.$refs['person'].validate(valid => {
        if (this.showAll) valid = valid && this.$refs.shopChild.validateForm()
        else valid = this.$refs.serviceChild.validateForm()
        if (valid) {
          // 运营仅可修改指定字段，与普通用户不同
          var patchObj
          if (this.showAll) {
            patchObj = {
              id: this.$store.getters.userId,
              avatar: this.person.avatar.id,
              two_name: this.person.two_name,
              two_phone: this.person.two_phone,
              shop_name: this.person.shop_name, // 商家名称
              address: this.person.address, // 商家位置
              location: this.person.location, // 商家坐标
              service_phone: this.person.service_phone,
              service_code: this.person.service_code.id
            }
          } else {
            patchObj = {
              id: this.$store.getters.userId,
              name: this.person.name,
              phone: this.person.phone,
              service_code: this.person.service_code.id ? this.person.service_code.id : ''
            }
          }
          this.apiBtn('AdminPatch', patchObj)
            .then((res) => {
              if (this.showAll) this.$store.commit('user/SET_AVATAR', this.person.avatar.path)
            })
            .catch(() => {
              this.getInfo()
            })
        }
      })
    },
    // 获取授权地址并跳转授权
    getURL(name) {
      if (this.isAuth) return
      this.apiBtn(name, { admin_id: this.$store.getters.userId })
        .then(res => {
          window.open(res.data)
        })
    },
    // 图片上传成功回调
    update(obj) {
      this.person.avatar = obj
      if (obj.id) this.onSubmit()
    },
    updateForm(key, val) {
      this.person[key] = val
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

  .top-card {
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 30px;
    .top-card-header{
      display: flex;
      align-items: center;
      img{
        width: 45px;
        height:45px;
        border-radius: 50%;
        border: 1px solid #ccc;
      }
      >div{
        margin-left: 20px;
      }
      .top-card-info-user{
        font-weight: 500;
        font-size: 20px;
        line-height: 30px;
      }
      .top-card-info-money{
        color:$mainColor;
        font-size: 12px;
        line-height: 25px;
      }
    }
  }

::v-deep .top-card .el-card__body {
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
::v-deep .person-avater .img-box img{
  border-radius: 50%;
}
</style>


<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户信息</span>
          <el-button circle icon="el-icon-back" @click="goBack" />
        </div>
      </template>
      <ul>
        <li>
          <label for>用户信息状态：</label>
          <span>{{ status[data.review] }}</span>
        </li>
        <li>
          <label for>负责人姓名：</label>
          <span>{{ data.name }}</span>
        </li>
        <li>
          <label for>负责人电话：</label>
          <span>{{ data.phone }}</span>
        </li>
        <li>
          <label for>紧急联系人姓名：</label>
          <span :class="data.two_name?'':'no-text'">{{ data.two_name?data.two_name:'未填写' }}</span>
        </li>
        <li>
          <label for>紧急联系人电话：</label>
          <span :class="data.two_phone?'':'no-text'">{{ data.two_phone?data.two_phone:'未填写' }}</span>
        </li>
        <li v-if="data.role && '78'.includes(data.role.id)">
          <label for>招商电话：</label>
          <span :class="data.service_phone?'':'no-text'">{{ data.service_phone }}</span>
        </li>
        <li>
          <label for>开户方性质：</label>
          <span>{{ nature[data.nature] }}</span>
        </li>
        <li v-if="data.nature!=2">
          <label for>营业执照：</label>
          <span>
            <img
              :src="data.upload[data.license]"
              alt
              srcset
              @click="show(data.upload[data.license])"
            >
          </span>
        </li>
        <li v-if="data.nature!=3">
          <label for>身份证正面：</label>
          <span>
            <img
              :src="data.upload[data.idcard_a]"
              alt
              srcset
              @click="show(data.upload[data.idcard_a])"
            >
          </span>
        </li>
        <li v-if="data.nature!=3">
          <label for>身份证反面：</label>
          <span>
            <img
              :src="data.upload[data.idcard_b]"
              alt
              srcset
              @click="show(data.upload[data.idcard_b])"
            >
          </span>
        </li>
        <li>
          <label for>地址：</label>
          <span :class="data.address?'':'no-text'">{{ data.address?data.address:'未填写' }}</span>
        </li>
        <li v-if="data.review===1">
          <label for />
          <div class="action-box">
            <el-button v-has="'AgentCheck'" type="primary" @click="handlePass(2)">通过</el-button>
            <el-button v-has="'AgentCheck'" type="warning" @click="handlePass(3)">驳回</el-button>
          </div>
        </li>
      </ul>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" :fullscreen="$store.state.app.device === 'mobile' ? true : false" top="7vh">
      <div class="yulan-div">
        <img :src="dialogImageUrl" class="yulan" alt>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'UserInfoDetail',
  data() {
    return {
      nature: {
        1: '企业',
        2: '个人',
        3: '门店'
      },
      status: {
        1: '未审核',
        2: '已审核',
        3: '审核驳回'
      },
      statusType: {
        2: '通过',
        3: '驳回'
      },
      data: {
        id: '',
        name: '',
        phone: '',
        two_name: '',
        two_phone: '',
        nature: '',
        license: '',
        idcard_a: '',
        idcard_b: '',
        address: '',
        review: 1,
        upload: {}
      },
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  created() {
    this.apiBtn('AdminShow', { id: this.$route.query.id })
      .then((res) => {
        this.data = res.data
      })
  },
  methods: {
    show(url) {
      this.dialogVisible = true
      this.dialogImageUrl = url
    },
    // 通过驳回方法
    handlePass(status) {
      this.defalultConfirm(this.statusType[status] + '该用户的用户信息', () => {
        this.apiBtn('AgentCheck', { id: this.data.id, review: status })
          .then((res) => {
            this.data.review = status
          })
      })
    },
    goBack() {
      this.$router.go(-1)
    }

  }
}
</script>
<style lang='scss' scoped>
@import "@/styles/variables.scss";
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
ul {
  line-height: 30px;
  margin-left: 91px;
  li {
    list-style: none;
    display: flex;
    margin-bottom: 10px;
    font-size: $fontSizeSmall;
    label {
      width: 160px;
      text-align: right;
    }
  }
  .no-text {
    color: $fontColorAide;
  }
  img {
    display: block;
    width: inherit;
    max-width: 200px;
    cursor: pointer;
  }
}
.action-box {
  padding: 10px 0;
}
.yulan-div{
  text-align: center;
}
.yulan{
  max-height: 80vh;
  width: auto;
}
</style>


<template>
  <div id="weixinBind">
    <div v-show="tableData.length">
      <tip title="微信账号"><small>(可用于微信登录、微信提现、核销活动)</small></tip>
      <PageTable :table-header="tableHeader" :table-data="tableData" :has-pagination="false">
        <template v-slot:user="props">
          <div class="avatar-div">
            <img :src="props.scope.row.user.headimg" class="avatar">
            <span>{{ props.scope.row.user.nickname }}</span>
          </div>
        </template>
        <template v-slot:state="props">
          <span>{{ props.scope.row.state ? '使用中' : '已解绑' }}</span>
        </template>
        <template v-slot:operation="props">
          <el-button
            v-show="props.scope.row.state===1"
            v-has="'WxUpdate'"
            type="danger"
            size="mini"
            @click.native.prevent="removeAccountBinding(props.scope.$index)"
          >解除绑定</el-button>
          <el-button
            v-show="props.scope.row.state!==1"
            v-has="'WxUpdate'"
            type="primary"
            size="mini"
            @click.native.prevent="accountBinding(props.scope.$index)"
          >启用</el-button>
          <el-button
            v-show="props.scope.row.state!==1"
            v-has="'WxDestroy'"
            type="warning"
            size="mini"
            @click.native.prevent="DelAccountBinding(props.scope.$index)"
          >删除</el-button>
        </template>
      </PageTable>
    </div>
    <div v-has="'WxStore'" style="margin-top:15px">
      <tip title="请点击下方微信图标绑定用户" />
      <div class="user-bind">
        <a href="javascript:void(0);" @click="addWx">
          <div class="weixin-icon">
            <svg-icon icon-class="weixin" />
          </div>
          <span class="app-name">微信</span>
        </a>
      </div>
      <p class="tip-font">绑定微信流程：点击微信图标 -> 弹框确认 -> 微信扫码 ->  密码确认 -> 绑定成功。</p>
    </div>
    <!-- <tip title="核销活动"><small>（请使用微信客户端）</small></tip>
    <div class="tip-font">方式一：打开链接&nbsp;{{ url }}</div>
    <div class="tip-font">方式二：扫描下方二维码</div>
    <canvas id="code" /> -->
  </div>
</template>

<script>
import PageTable from '@/components/Table/PageTable'
// import QRCode from 'qrcode'

export default {
  components: { PageTable },
  data() {
    return {
      url: this.$store.state.config.review_location,
      wx_bind_location: this.$store.state.config.wx_bind_location,
      redirect_uri: '',
      state: 'state',
      tableHeader: [
        { prop: 'info', label: '绑定账号信息' },
        { prop: 'user', label: '详情', isCustomize: true },
        { prop: 'create_time', label: '绑定时间' },
        { prop: 'state', label: '状态', isCustomize: true },
        { prop: 'operation', label: '操作', isCustomize: true }
      ],
      tableData: []
    }
  },
  created() {
    // 用户授权后，重定向到本页面，提示信息
    // 用户禁止授权 仅携带 state参数 ，用户授权成功 携带 state和code参数
    if (this.$route.query.state) {
      if (this.$route.query.code) {
        // 向后台发送code 余下的操作由后台进行
        this.apiBtn('WxStore', { state: this.$route.query.state, code: this.$route.query.code })
          .then(() => {
            this.getList()
          })
      } else {
        this.$message({
          type: 'warning',
          message: '用户取消了授权，操作绑定失败。'
        })
      }
    } else this.getList()
  },
  mounted() {
    // this.getQrcode(this.url)
  },
  methods: {
    //   解除绑定
    removeAccountBinding(index) {
      this.binding(index, '解除', 0)
    },
    // 重新绑定
    accountBinding(index) {
      this.binding(index, '绑定', 1)
    },
    binding(index, str, state) {
      this.defalultConfirm(`${str}${this.tableData[index].user.nickname}的微信到您的帐号`, () => {
        this.apiBtn('WxUpdate', { id: this.tableData[index].user.userId, state })
          .then(() => {
            // 重新获取页面列表
            this.getList()
          })
      })
    },
    DelAccountBinding(index) {
      this.apiBtn('WxDestroy', { id: this.tableData[index].user.userId })
        .then(() => {
          // 重新获取页面列表
          this.getList()
        })
    },
    getList() {
      // 获取绑定的微信用户的列表信息
      this.apiBtn('WxIndex')
        .then((res) => {
          this.tableData = res.data
        })
    },
    addWx() {
      this.defalultConfirm('正在绑定微信号', () => {
        location.replace(this.wx_bind_location)
      })
    }
    // 生成二维码
    // getQrcode(url) {
    //   setTimeout(() => {
    //     var canvas = document.getElementById('code')
    //     QRCode.toCanvas(canvas, url, (error) => {
    //       if (error) console.error(error)
    //     })
    //   }, 10)
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.avatar-div {
  display: flex;
  justify-content: center;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  span {
    display: inline-block;
    margin-left: 5px;
    line-height: 20px;
  }
}

a {
  text-decoration: none;
  cursor: pointer;
  color: #005980;
}

.user-bind {
  display: inline-flex;
  margin: 5px 0;

  :hover {
    background: #46d800;
    color: #fff;
    .weixin-icon,
    .app-name {
      color: #fff;
    }
  }

  a {
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -moz-box-orient: vertical;
    -moz-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    min-width: 50px;
    padding: 10px 0;

    .app-name {
      color: #8c92a4;
      white-space: nowrap;
      font-size: 13px;
      line-height: 20px;
    }

    .weixin-icon {
      color: #46d800;
      font-size: 30px;
    }
  }
}
</style>
<style lang="scss">
#weixinBind th {
  background: #f5f7fa;
}
</style>


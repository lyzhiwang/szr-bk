<template>
  <div id="weixinBind">
    <div v-show="tableData.length">
      <tip title="微信账号"><small>(可用于微信登录、微信提现、核销活动)</small></tip>
      <PageTable :table-header="tableHeader" :table-data="tableData" :has-pagination="false">
        <template v-slot:user="props">
          <div class="avatar-div">
            <img :src="props.scope.row.user.avatar" class="avatar">
            <span>{{ props.scope.row.user.nickname }}</span>
          </div>
        </template>
        <template v-slot:status="props">
          <span>{{ props.scope.row.status ? '使用中' : '已解绑' }}</span>
        </template>
        <template v-slot:add_time="props">
          <span>{{ props.scope.row.add_time |parseTime }}</span>
        </template>
        <template v-slot:operation="props">
          <el-button
            v-show="props.scope.row.status===1"
            v-has="'AuditorPatch'"
            type="danger"
            size="mini"
            @click.native.prevent="removeAccountBinding(props.scope.$index)"
          >解除绑定</el-button>
          <el-button
            v-show="props.scope.row.status!==1"
            v-has="'AuditorPatch'"
            type="primary"
            size="mini"
            @click.native.prevent="accountBinding(props.scope.$index)"
          >启用</el-button>
          <!-- <el-button
            v-show="props.scope.row.status!==1"
            v-has="'WxDestroy'"
            type="warning"
            size="mini"
            @click.native.prevent="DelAccountBinding(props.scope.$index)"
          >删除</el-button> -->
        </template>
      </PageTable>
    </div>
    <div v-has="'GetWechatLink'" style="margin-top:15px">
      <tip title="请点击下方微信图标绑定核销员" />
      <div class="user-bind">
        <a href="javascript:void(0);" @click="addWx">
          <div class="weixin-icon">
            <svg-icon icon-class="weixin" />
          </div>
          <span class="app-name">微信</span>
        </a>
      </div>
      <p class="tip-font">绑定核销员流程：点击微信图标 -> 弹框微信扫码 -> 手机端扫码->  扫码成功后点击网页端【扫码成功】按钮 -> 绑定成功。</p>
    </div>
    <tip title="核销"><small>（请绑定核销员成功后进入码上拓客小程序）</small></tip>
    <div class="tip-font">进入小程序后点击优惠券页面左上角'核销'文字，进入核销页面，可扫码核销和查看核销记录</div>
    <img src="@/assets/weapp_code.jpg" alt="" srcset="" class="code">

    <el-dialog
      title="绑定核销员"
      :visible.sync="dialogVisible"
      width="300px"
      center
    >
      <div class="dialog-content">
        <canvas id="code" />
        <div class="tip-font">
          <div>1.该二维码有效期为5分钟，5分钟后失效。</div>
          <div>2.请扫码成功后点击下方扫码成功按钮</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="bindSuccess">扫码成功</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'

import PageTable from '@/components/Table/PageTable'

export default {
  name: 'WriterWeixinBind',
  components: { PageTable },
  data() {
    return {
      dialogVisible: false,
      tableHeader: [
        { prop: 'user', label: '详情', isCustomize: true },
        { prop: 'add_time', label: '绑定时间', isCustomize: true },
        { prop: 'status', label: '状态', isCustomize: true },
        { prop: 'operation', label: '操作', isCustomize: true }
      ],
      tableData: []
    }
  },
  created() {
    this.getList()
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
    binding(index, str, status) {
      this.defalultConfirm(`${str}${this.tableData[index].user.nickname}核销员`, () => {
        this.apiBtn('AuditorPatch', { id: this.tableData[index].id, status })
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
      this.apiBtn('AuditorList')
        .then((res) => {
          this.tableData = res.data
        })
    },
    addWx() {
      // this.defalultConfirm('正在绑定核销员', () => {

      // })
      this.apiBtn('GetWechatLink')
        .then((res) => {
          this.getQrcode(res.data)
          this.dialogVisible = true
        })
    },
    bindSuccess() {
      this.dialogVisible = false
      this.getList()
    },
    // 生成二维码
    getQrcode(url) {
      setTimeout(() => {
        var canvas = document.getElementById('code')
        QRCode.toCanvas(canvas, url, { margin: 0, width: '150' }, (error) => {
          if (error) console.error(error)
        })
      }, 10)
    }
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

.code{
  width: 150px;
}
.dialog-content{
  text-align: center;
  .tip-font{
    line-height: 20px;
    margin: 15px 0 0 0;
  }
}
</style>
<style lang="scss">
#weixinBind th {
  background: #f5f7fa;
}
</style>


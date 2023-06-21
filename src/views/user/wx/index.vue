<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card class="box-card">
          <el-tabs v-model="activeName">
            <el-tab-pane label="系统登录绑定" name="first">
              <user-weixin-bind />
            </el-tab-pane>
            <el-tab-pane label="活动核销员绑定" name="second">
              <writer-weixin-bind />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import UserWeixinBind from '@/components/Form/Sys/UserWeixinBind'
import WriterWeixinBind from '@/components/Form/Sys/WriterWeixinBind'

export default {
  name: 'Wx',
  components: {
    UserWeixinBind,
    WriterWeixinBind
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<template>
  <el-date-picker
    v-model="time"
    :picker-options="pickerOptions"
    :default-time="defaultTime"
    :type="type"
    :disabled="disabled"
    :clearable="clearable"
    :size="size"
    align="right"
    unlink-panels
    range-separator="-"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    placeholder="选择日期"
    value-format="timestamp"
    @change="changeHandel"
    @focus="focusHandel"
  />
</template>

<script>
import { formatTime10, formatTime13 } from '@/utils/index'

export default {
  name: 'DatePicker',
  props: {
    // 10位
    value: {
      type: [Array, String, Number],
      default() {}
    },
    type: {
      type: String,
      default: 'daterange'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    hasShortcuts: {
      type: Boolean,
      default: false
    },
    shortcuts: {
      type: Array,
      default() {
        return [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    },
    disabledType: {
      type: Number,
      /**
       * 0 所有时间都可以选
       * 1 选择今天以及今天之后的日期
       * 2 选择今天以及今天以前的日期
       * 3 选择今天之后的日期（不能选择当天时间）
       * 4 选择今天之前的日期（不能选择当天）
       * 5 选择n个月之前到今天的日期(默认n=3)
       * 6 选择指定日期以及指定日期之后的日期
       * 7 只能选择活动期限内日期
       * 8 活动当天起两个月内选择45天，并且不能超过账号期限
       * 9 只能选取当天之后的180天,新建活动和编辑活动用，并且不能超过账号期限
       */
      default: 0
    },
    // 指定日期
    disTime: {
      type: [String, Number],
      default: Date.now()
    },
    month: {
      type: Number,
      default: 3
    },
    disabledDate: {
      type: Object,
      default() { }
    },
    clearable: {
      type: Boolean,
      default: true
    },
    defaultTime: {
      type: [Array, String, Number],
      default() {}
    },
    size: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 13位
      time: [],
      // type8 编辑活动时需要的时间判断disabledDate
      times: [],
      // type8 防止times再次触发
      num: 0,
      pickerOptions: {},
      // 1 选择今天以及今天之后的日期
      disabledDate1(time) {
        return time.getTime() < Date.now() - 8.64e7
      },
      // 2 只能选择今天及今天以前的时间
      disabledDate2(time) {
        return time.getTime() > Date.now() - 8.64e6
      },
      // 3 选择今天之后的日期（不能选择当天时间）
      disabledDate3(time) {
        return time.getTime() < Date.now()
      },
      // 4 选择今天之前的日期（不能选择当天）
      disabledDate4(time) {
        return time.getTime() > Date.now()
      },
      // 5 选择n个月之前到今天的日期
      disabledDate5(time) {
        const curDate = (new Date()).getTime()
        const three = this.month * 30 * 24 * 3600 * 1000
        const threeMonths = curDate - three
        return time.getTime() > Date.now() || time.getTime() < threeMonths
      }
    }
  },
  computed: {
    // pickerOptions() {
    //   const _this = this
    //   return {
    //     disabledDate(time) {
    //       const times = 86400000 * 45// 45天的毫秒数
    //       const times2 = 86400000 * 60// 60天的毫秒数
    //       const curSelectTime = new Date(_this.minDate).getTime()
    //       const before = curSelectTime - times // 前45天毫秒数
    //       const after = curSelectTime + times// 后45天毫秒数
    //       const endTime = this.$route.path === '/act/activity/edit' ? this.$store.state.activity.times.account_end_time * 1000 : this.$store.state.user.account_end_time * 1000
    //       // admin和门店账号没有结束时间
    //       if (!endTime) {
    //         if (_this.minDate) {
    //           return time.getTime() < Date.now() - 8.64e7 || time.getTime() > after || time.getTime() - times2 > Date.now() - 8.64e6 || time.getTime() < before
    //         }
    //         return time.getTime() < Date.now() - 8.64e7 || time.getTime() - times2 > Date.now() - 8.64e6
    //       } else {
    //         if (_this.minDate && endTime) {
    //           // 只能在今日之后的两个月内选取时间最多45天，并且要在账号的有效期内
    //           return time.getTime() < Date.now() - 8.64e7 || time.getTime() > after || time.getTime() - times2 > Date.now() - 8.64e6 || time.getTime() > endTime * 1000 || time.getTime() < before
    //         }
    //         // 初始化 只能选取今日日期之后的60天，并且要在账号的有效期内
    //         return time.getTime() < Date.now() - 8.64e7 || time.getTime() > endTime * 1000 || time.getTime() - times2 > Date.now() - 8.64e6
    //       }
    //     },
    //     onPick({ maxDate, minDate }) {
    //       if (minDate) _this.minDate = minDate
    //     }
    //   }
    // }
  },
  watch: {
    value: {
      deep: true,
      handler(newV, oldV) {
        if (newV !== this.time) this.time = formatTime13(newV)
      }
    },
    time(newV, oldV) {
      if (oldV.length === 0 && this.num < 2) {
        this.times = this.time
        this.num++
      }
    }
  },
  created() {
    // 初始化页面将父元素传递过来的值付给组件
    this.time = formatTime13(this.value)
    if (this.hasShortcuts) this.pickerOptions.shortcuts = this.shortcuts
    if (this.disabledType !== 8) {
      if (this.disabledType) this.pickerOptions.disabledDate = this['disabledDate' + Number(this.disabledType)]
      if (this.disabledDate) this.pickerOptions.disabledDate = this.disabledDate
    }
  },
  methods: {
    // 6 选择指定日期以及指定日期之后的日期
    disabledDate6(time) {
      return time.getTime() < formatTime13(this.disTime)
    },
    // 7 活动日期内修改时间
    disabledDate7(time) {
      return time.getTime() < this.times[0] || time.getTime() > this.times[1]
    },
    // 9 只能选取当天之后的180天,新建活动和编辑活动用
    disabledDate9(time) {
      const times = 86400000 * 180// 45天的毫秒数
      const addTime = this.$store.state.activity.times.create_date
      const endTime = this.$route.path === '/act/activity/edit' ? this.$store.state.activity.times.account_end_time * 1000 : this.$store.state.user.account_end_time * 1000
      // 改为0点的时间戳
      // const endTime = this.$store.state.user.account_end_time ? new Date(new Date(this.$store.state.user.account_end_time * 1000).toLocaleDateString()).getTime() : ''
      if (endTime) {
        if (!addTime) {
          return time.getTime() < Date.now() - 8.64e7 || time.getTime() - times > Date.now() - 8.64e6 || time.getTime() > endTime
        } else {
          return time.getTime() < addTime * 1000 || time.getTime() - times > addTime * 1000 || time.getTime() > endTime
        }
      } else {
        if (!addTime) {
          return time.getTime() < Date.now() - 8.64e7 || time.getTime() - times > Date.now() - 8.64e6
        } else {
          return time.getTime() < addTime * 1000 || time.getTime() - times > addTime * 1000
        }
      }
    },
    //
    changeHandel(v) {
      var res = []
      if (v) res = formatTime10(v)
      else {
        if (this.type !== 'daterange') res = ''
        else res = []
      }
      // 时间改变通知父组件
      this.$emit('changeTime', res)
    },
    //
    focusHandel(v) {
      // 时间改变通知父组件
      this.$emit('focus', v)
    }
  }
}
</script>

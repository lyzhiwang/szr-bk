<template>
  <!-- value-format="timestamp" -->
  <el-date-picker
    v-model="time"
    :picker-options="pickerOptions"
    :default-time="defaultTime"
    :type="type"
    :disabled="disabled"
    :clearable="clearable"
    align="right"
    unlink-panels
    range-separator="-"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    placeholder="选择日期"
    :value-format="valueFormat"
    @change="changeHandel"
    @focus="focusHandel"
  />
</template>

<script>
// import { formatTime10, formatTime13 } from '@/utils/index'

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
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
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
       * 6 选择指定日期以及指定日期之后的日期(需要指定日期)
       * 7 选择指定指定日期，以及多少天内的日期（用于活动限制使用时间）
       */
      default: 0
    },
    // disabledType为6时候 指定日期
    disTime: {
      type: [String, Number],
      default: Date.now()
    },
    // disabledType为7时候 指定日期以及天数
    disDate: {
      type: Object,
      default() {
        return {
          date: (new Date().getTime() - 24 * 60 * 60 * 1000) / 1000,
          day: 6 * 30
        }
      }
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

    }
  },
  data() {
    return {
      time: [],
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
  watch: {
    value: {
      deep: true,
      handler(newV, oldV) {
        this.time = newV
        // if (newV !== this.time) this.time = formatTime13(newV)
      }
    }
  },
  created() {
    // 初始化页面将父元素传递过来的值付给组件 formatTime13(this.value)
    this.time = this.value
    if (this.hasShortcuts) this.pickerOptions.shortcuts = this.shortcuts
    if (this.disabledType) this.pickerOptions.disabledDate = this['disabledDate' + Number(this.disabledType)]
    if (this.disabledDate) this.pickerOptions.disabledDate = this.disabledDate
  },
  methods: {
    // 6 选择指定日期以及指定日期之后的日期
    disabledDate6(time) {
      // formatTime13(this.disTime)
      return time.getTime() < new Date(this.disTime).getTime()
    },
    // 7 选择指定指定日期，以及多少天内的日期
    disabledDate7(time) {
      // formatTime13(this.disDate.date)
      const date = new Date(time).getTime()
      return time.getTime() < date || (time.getTime() > date + this.disDate.day * 24 * 60 * 60 * 1000 + this.timeToNextDay(date))
    },
    // 计算某一时间距离当天凌晨23:59:59剩余的毫秒数。本方法用于修复 时间选择器选择时间范围限制类型为7时候，无法选中最后一天的问题
    timeToNextDay(time) {
      time = new Date(time)
      return (24 * 60 * 60 * 1000 - 1) - (time.getHours() * 60 * 60 * 1000 + time.getMinutes() * 60 * 1000 + time.getSeconds() * 1000 + time.getMilliseconds())
    },
    changeHandel(v) {
      // console.log(v)
      var res = []
      // formatTime10(v)
      if (v) res = v
      else {
        if (this.type !== 'daterange') res = ''
        else res = []
      }
      // 时间改变通知父组件
      this.$emit('changeTime', res)
    },
    focusHandel(v) {
      // 时间改变通知父组件
      this.$emit('focus', v)
    }
  }
}
</script>
<style>
.el-picker-panel .el-input{
  width: 100%;
}
</style>

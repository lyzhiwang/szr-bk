<template>
  <div>
    <div class="search">
      <el-input
        v-model="address"
        :disabled="disabled"
        placeholder="请填写详细的位置信息，用于一键导航"
        clearable
        @keyup.native.enter="geolocation"
      />
      <el-button @click.native.prevent="geolocation">搜索</el-button>
      <el-button class="submit" type="primary" @click="submit">使用此位置</el-button>
      <el-button class="submit" @click="reset">重置并关闭</el-button>
    </div>
    <div :id="id" style="width: 100%; min-height: 520px;" />
  </div>
</template>
<script>
import { TMap } from '@/api/definite'

export default {
  props: {
    form: {
      type: Object,
      default() {
        return {
          location: '' // 坐标
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      address: '',
      key: 'DQSBZ-7STCW-NWWR2-RYFQ7-W3SE7-GHBQ4',
      id: 'container' + new Date().getTime(),
      geocoder: null,
      map: null,
      marker: null,
      qq: null
    }
  },
  mounted() {
    // 加载地图依赖脚本
    TMap(this.key).then(qq => {
      this.qq = qq
      var location = this.form.location || { lat: 39.916527, lng: 116.397128 }

      // 地图的中心地理坐标。
      var center = new qq.maps.LatLng(location.lat, location.lng)
      // 初始化地图
      this.map = new qq.maps.Map(document.getElementById(this.id), { center, zoom: 15 })
      // 如果有缓存 标记地图中心
      if (this.form.location && this.form.location.lat) this.setMarker(center)

      // 调用地址解析类
      this.geocoder = new qq.maps.Geocoder({
        complete: result => {
          // 视图居中
          this.map.setCenter(result.detail.location)
          // 添加标记
          this.setMarker(result.detail.location)
        },
        error: result => {
          if (result) this.$message.error('请填写完整的商家地址')
        }
      })

      // 添加监听事件
      qq.maps.event.addListener(this.map, 'click', event => {
        // 添加标记
        this.setMarker(event.latLng)
      })
    })
  },
  methods: {
    updateForm(key, val) {
      this.$emit('change', key, val)
    },
    geolocation() {
      // 通过getLocation();方法获取位置信息值
      if (this.address) this.geocoder.getLocation(this.address)
      else this.$message('请填写商家地址')
    },
    setMarker(position) {
      var qq = this.qq
      // 设置标记
      if (this.marker) this.marker.setMap(null)
      this.marker = new qq.maps.Marker({
        map: this.map,
        position
      })
      this.updateForm('location', position)
    },
    // 确认使用所选商家位置
    submit() {
      // if (!this.form.address) {
      //   this.$message('请填写商家位置')
      //   return
      // }
      if (!this.form.location.lat) {
        this.$message('请选择商家位置')
        return
      }
      this.$emit('hide')
    },
    // 重置并关闭模态框
    reset() {
      if (this.marker) this.marker.setMap(null)
      this.updateForm('location', '')
      this.$emit('hide')
    }
  }
}
</script>

<style scoped>
.search {
  margin-bottom: 10px;
}
.submit {
  float: right;
}
</style>

<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-position="right"
      label-width="251px"
    >
      <tip :title="disabled ? '修改轮播图' : '添加轮播图'" />

      <!-- <template>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" maxlength="5" clearable />
        </el-form-item>
        <div class="tip-font">字数在5个以内</div>
      </template> -->

      <template>
        <el-form-item label="图片" prop="image">
          <FileManager
            :value="form.image"
            :page-size="8"
            :type="2"
            :size="1024"
            @change="changeTopPic"
          />
        </el-form-item>
        <!-- <div class="tip-font">{{ form.position | banner_tip }}</div> -->
      </template>

      <el-form-item label="排序" prop="sort">
        <el-input v-model="form.sort" clearable />
      </el-form-item>
      <div class="tip-font">数值越大排序越靠前</div>

      <div class="submit_btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click=" submititem( disabled ? 'BannerUpdate' : 'BannerStore' )">
          提交
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import FileManager from '@/components/FileManager/index'
import { apiBtnTwo } from '@/api/default'
export default {
  name: '',
  components: { FileManager },
  filters: {
    // 图片尺寸提示
    banner_tip: function(val) {
      const obj = {
        1: '1.建议图片尺寸：690px*240px ；2.图片大小必须小于1M',
        2: '1.建议图片尺寸：710px*180px ；2.图片大小必须小于1M',
        3: '1.建议图片尺寸：350px*166px ；2.图片大小必须小于1M'
      }
      return obj[val]
    }
  },
  data() {
    const validatePic = (rule, val, callback) => {
      if (this.form.image && this.form.image.path && this.form.image.id) { callback() } else callback(new Error('请上传图片'))
    }
    return {
      disabled: !!this.$route.query.image_id,
      platform_type: 1, // 平台所属  1：app  2：H5  3：小程序 4:h5公众号
      form: {
        id: '',
        // name: '', //    名称
        // title: '', // 	副标题
        image: {
          id: '', // 图片id
          path: '' // 图片地址
        },
        // position: 1, // 位置  1顶部  2 中部
        // pid: '', // 父类id
        sort: 100 // 排序值
        // type: 0, //  1会员充值  2车行易  3自定义链接
        // original_id: '', // 微信小程序 原始ID
        // interior: '', // 内部页面选择 提交删除
        // detail: '' // type=1 会员分类id   type=2 车行易链接(1违章查办2罚款代缴3年检代办4田螺洗美)    type =3 跳转url
      },

      // options: [{ id: 0, name: '顶级分类' }],

      // vipoptions: [],
      // 内部页面
      // interioroptions: [],

      formRules: {
        // pid: [{ required: true, trigger: 'change', message: '请选择类别' }],
        // name: [{ required: true, trigger: 'change', message: '请输入名称' }],
        // title: [{ required: true, trigger: 'change', message: '请输入副标题' }],
        // type: [{ required: true, trigger: 'change', message: '请选择类型' }],
        sort: [
          { required: true, trigger: 'change', message: '请输入商品排序权重' }
        ],
        image: [{ required: true, trigger: 'change', validator: validatePic }]
        // detail: [{ required: true, trigger: 'change', message: '不能为空' }],
        // interior: [
        //   { required: true, trigger: 'change', message: '请选择内部页面' }
        // ],
        // original_id: [
        //   {
        //     required: true,
        //     trigger: 'change',
        //     message: '微信小程序原始ID不能为空'
        //   }
        // ]
      }
    }
  },

  computed: {
    // // 平台头部总数据概览
    // type_list() {
    //   var arr = [
    //     { indexes: 0, name: '内部页面' },
    //     // // // // { indexes: 1, name: '会员充值' }, // 暂时 舍弃
    //     { indexes: 2, name: '车行易' },
    //     { indexes: 3, name: '自定义链接' },
    //     // { indexes: 4, name: '充话费' }, // 内部页面 隐藏 改为动态
    //     // { indexes: 5, name: '充电费' }, // 内部页面 隐藏 改为动态
    //     // // // // { indexes: 6, name: '外卖' },   // 暂时 舍弃
    //     // { indexes: 7, name: '加油' }, // 内部页面 隐藏 改为动态
    //     // { indexes: 8, name: '充电桩' }, // 暂时 舍弃
    //     { indexes: 9, name: '无操作' },
    //     // // // // { indexes: 10, name: '云油' },  // 暂时 舍弃
    //     { indexes: 11, name: '小程序' },
    //     // { indexes: 12, name: '抖音' }, // 内部页面 隐藏 改为动态
    //     // { indexes: 13, name: '购物' }, // 内部页面 隐藏 改为动态
    //     // { indexes: 14, name: '美团生活' }, // 内部页面 隐藏 改为动态
    //     { indexes: 15, name: 'CPS活动' },
    //     { indexes: 16, name: '单会员推广' }
    //     // { indexes: 17, name: '美团' }, // 内部页面 隐藏 改为动态
    //     // { indexes: 18, name: '饿了么' }, // 内部页面 隐藏 改为动态
    //     // { indexes: 19, name: '卡券列表' }, // 内部页面 隐藏 改为动态
    //     // { indexes: 20, name: '电影票' }// 内部页面 隐藏 改为动态
    //   ]
    //   for (var i = 0; i < arr.length; i++) {
    //     if (Number(this.platform_type) === 1) {
    //       // if (arr[i].indexes === 9) { arr.splice(i, 1) }
    //       // if (arr[i].indexes === 17) { arr.splice(i, 1) }
    //       // if (arr[i].indexes === 18) { arr.splice(i, 1) }
    //       // if (arr[i].indexes === 19) { arr.splice(i, 1) }
    //     }
    //     if (Number(this.platform_type) === 2) {
    //       // if (arr[i].indexes === 1) { arr.splice(i, 1) }
    //       // if (arr[i].indexes === 9) { arr.splice(i, 1) }
    //       if (arr[i].indexes === 11) {
    //         arr.splice(i, 1)
    //       }
    //       // if (arr[i].indexes === 17) { arr.splice(i, 1) }
    //       // if (arr[i].indexes === 18) { arr.splice(i, 1) }
    //       // if (arr[i].indexes === 19) { arr.splice(i, 1) }
    //     }
    //     if (Number(this.platform_type) === 3) {
    //       // if (arr[i].indexes === 1) { arr.splice(i, 1) }
    //       if (arr[i].indexes === 2) {
    //         arr.splice(i, 1)
    //       }
    //       if (arr[i].indexes === 3) {
    //         arr.splice(i, 1)
    //       }
    //       // if (arr[i].indexes === 6) { arr.splice(i, 1) }
    //       // if (arr[i].indexes === 7) { arr.splice(i, 1) }
    //       // if (arr[i].indexes === 8) { arr.splice(i, 1) }
    //       // if (arr[i].indexes === 10) { arr.splice(i, 1) }
    //       if (arr[i].indexes === 16) {
    //         arr.splice(i, 1)
    //       }
    //     }
    //     if (Number(this.platform_type) === 4) {
    //       // if (arr[i].indexes === 1) { arr.splice(i, 1) }
    //       // if (arr[i].indexes === 9) { arr.splice(i, 1) }
    //       if (arr[i].indexes === 11) {
    //         arr.splice(i, 1)
    //       }
    //       // if (arr[i].indexes === 17) { arr.splice(i, 1) }
    //       // if (arr[i].indexes === 18) { arr.splice(i, 1) }
    //       // if (arr[i].indexes === 19) { arr.splice(i, 1) }
    //     }
    //   }
    //   return arr
    // }
  },

  watch: {},
  created() {
    // if (this.$route.query.pagetype) {
    //   this.platform_type = Number(this.$route.query.pagetype)
    // }
    if (this.$route.query.image_id) {
      this.getDetail(this.$route.query.image_id)
    }
    // else {
    //   if (Number(this.platform_type) === 1) {
    //     // this.form.type = 2
    //   } else if (Number(this.platform_type) === 2) {
    //     this.form.type = 2
    //   } else if (Number(this.platform_type) === 3) {
    //     this.form.type = 4
    //   } else if (Number(this.platform_type) === 4) {
    //     this.form.type = 2
    //   }
    // }
    // this.GetProgramPage()
    // localStorage.setItem('page_type', 'Rotation')
    // localStorage.setItem('platform_type', this.platform_type)
    // this.getvipList()
  },

  mounted() {
    this.getQnToken()
  },

  methods: {
    // // 切换
    // changedetail(index) {
    //   if (index === 1) {
    //     this.form.detail = this.vipoptions[0].id
    //   } else if (index === 2) {
    //     this.form.detail = 1
    //   } else {
    //     this.form.detail = ''
    //   }
    // },

    // // 获取内部页面
    // GetProgramPage() {
    //   this.apiBtn('ProgramPage', { platform_type: this.platform_type }).then(
    //     (res) => {
    //       this.interioroptions = res.data[0]
    //     }
    //   )
    // },

    // // 获取会员下拉列表
    // getvipList() {
    //   this.apiBtn('CategoriesIndex', {
    //     platform_type: this.platform_type
    //   }).then((res) => {
    //     for (var i = 0; i < res.data.length; i++) {
    //       if (res.data[i].children) {
    //         for (var j = 0; j < res.data[i].children.length; j++) {
    //           var obj = {
    //             id: res.data[i].children[j].id,
    //             name: res.data[i].children[j].name
    //           }
    //           this.vipoptions.push(obj)
    //         }
    //       }
    //     }
    //   })
    // },

    // 更换图片
    changeTopPic(val) {
      this.form.image.id = val.id
      this.form.image.path = val.path
    },

    // 获取七牛token
    getQnToken() {
      const config = this.$store.state.config
      if (!config.imgToken || !config.audioToken) {
        this.$store.dispatch('config/GetQiniuToken', { other: true })
      }
    },

    // 获取详情
    getDetail(id) {
      // platform_type: this.platform_type
      this.apiBtn('BannerDetail', {
        id: id
      }).then((res) => {
        this.form.id = res.data.id
        // this.form.name = res.data.name
        // this.form.title = res.data.title
        // this.form.banner = res.data.banner
        // this.form.position = res.data.position
        // this.form.pid = res.data.pid
        // this.form.type = res.data.type
        this.form.sort = res.data.sort
        this.form.image = res.data.image
        // this.form.original_id = res.data.original_id
        // if (res.data.type === 1 || res.data.type === 2) {
        //   this.form.detail = Number(res.data.detail)
        // } else {
        //   this.form.detail = res.data.detail
        // }
        // if (res.data.is_inside === true) {
        //   this.form.interior = res.data.type
        //   this.form.type = 0
        // } else {
        //   this.form.type = res.data.type
        // }
      })
    },

    // 返回上一页
    cancel() {
      this.$router.go(-1)
    },

    // 提交
    submititem(name) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.disabled) {
            this.apiBtn(name, this.formateData({ ...this.form })).then((res) => {
            // console.log(res)
              this.cancel()
            })
          } else {
            apiBtnTwo(name, this.formateData({ ...this.form })).then((res) => {
            // console.log(res)
              this.cancel()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 提交数据校验
    formateData(form) {
      var params = {}
      // params.name = this.form.name
      // params.position = this.form.position
      // params.banner = this.form.banner.id
      // params.type = this.form.type

      if (form.id) {
        params.id = form.id
      }
      params.sort = form.sort
      params.image = form.image.id
      // params.platform_type = this.platform_type
      // if (form.type === 0) {
      //   params.type = form.interior
      // } else {
      //   params.type = form.type
      // }
      // if (
      //   params.type === 1 ||
      //   params.type === 2 ||
      //   params.type === 3 ||
      //   params.type === 11 ||
      //   params.type === 15 ||
      //   params.type === 16
      // ) {
      //   params.detail = this.form.detail
      // }
      // if (params.type === 11) {
      //   params.original_id = this.form.original_id
      // }
      // if (this.$route.query.banner_id) {
      //   params.id = this.$route.query.banner_id
      // }
      // if (form.charge_commission_switch === 0) {
      //   this.deleteData(['charge_commission_ratio'], form)
      // }
      console.log('qqqqqqqqqqqq')
      console.log(params)
      return params
    },

    // 便利删除对象
    deleteData(delData, data) {
      // 便利删除对象
      for (const key in data) {
        if (delData.includes(key) && data[key] !== undefined) delete data[key]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tip-font {
  margin-left: 250px;
}
.submit_btn {
  margin-left: 250px;
  margin-bottom: 40px;
}
.type_list {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  top: 13px;
  .type_list_item {
    margin-right: 20px;
    margin-bottom: 20px;
  }
}
</style>

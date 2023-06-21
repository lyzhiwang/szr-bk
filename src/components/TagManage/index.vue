<template>
  <div>
    <el-row class="content-tag">
      <div>
        <el-select
          v-model="checkedOption"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="回车键可创建标签(选填)"
          @change="handleChange"
        >
          <el-option
            v-for="item in tagOption"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </div>
      <div v-if="hasEdit" class="content-tag-action">
        <el-button type="warning" icon="el-icon-delete" circle plain @click="showTagList" />
      </div>
    </el-row>
    <el-row>
      <el-dialog :visible.sync="isDialogVisible" :fullscreen="$store.state.app.device === 'mobile' ? true : false" title="标签管理" width="60%">
        <page-table :table-header="tableHeader" :table-data="tagOption" :has-pagination="false">
          <!-- 操作 -->
          <template v-slot:action="props">
            <el-button type="warning" size="small" @click="delTag(props.scope.row)">删除</el-button>
          </template>
        </page-table>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import PageTable from '@/components/Table/PageTable'
import { apiBtn } from '@/api/default'
import { defalultConfirm, deleteArrayById } from '@/utils'

// 系统公告标签组管理
export default {
  name: 'TagManage',
  components: { PageTable },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    hasEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tagOption: [],
      checkedOption: [],
      isDialogVisible: false,
      tableHeader: [
        { prop: 'id', label: 'ID', sortable: true, width: 80 },
        { prop: 'name', label: '名称' },
        { prop: 'action', label: '操作', isCustomize: true, width: 100 }
      ]
    }
  },
  watch: {
    value: {
      deep: true,
      handler: function(newV, oldV) {
        // 获取选中值
        this.checkedOption = this.value
      }
    }
  },
  created() {
    // 获取标签列表
    this.getOption()
  },
  methods: {
    // 获取标签
    getOption() {
      apiBtn('TagIndex').then((res) => {
        this.tagOption = res.data
      })
    },
    // 标签改变事件
    handleChange(arr) {
      this.$emit('change', arr)
    },
    // 删除标签
    delTag(row) {
      defalultConfirm('删除' + row.name, () => {
        apiBtn('TagDestroy', { id: row.id })
          .then((res) => {
            deleteArrayById(this.tagOption, row.id)
            this.synDel(row.name)
          })
      })
    },
    // 同步删除选中的option
    synDel(name) {
      var index = this.checkedOption.indexOf(name)
      if (index > -1) {
        this.checkedOption.splice(index, 1)
      }
      this.handleChange(this.checkedOption)
    },
    // 展示标签列表
    showTagList() {
      this.isDialogVisible = true
    }

  }

}
</script>
<style lang="scss" scoped>
.content-tag {
  display: flex;
  .content-tag-action {
    display: flex;
    align-items: flex-start;
    margin-left: 20px;
  }
}
.el-checkbox {
  margin-left: 0;
  margin-right: 30px;
  width: 80px;
}
</style>


const state = {
  // 客户
  agent: {
    formSearch: {
      role_id: '',
      created_at: ''
    },
    otherSearch: {
      id: '',
      username: '',
      remark: ''
    },
    pagination: {
      total: 0, // 总条数
      size: 10, // 每页显示条目个数
      page: 1 // 当前页数
    }
  },

  //
  banner: {
    otherSearch: {
      keywords: ''
    },
    formSearch: {
      type: ''
      // platform_type: 1
    },
    pagination: {
      total: 0, // 总条数
      size: 10, // 每页显示条目个数
      page: 1 // 当前页数
    }
  }
}

const mutations = {
  // 更新搜索项
  SearchUpdate: (state, a) => {
    state[a.name][a.key] = a.value
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

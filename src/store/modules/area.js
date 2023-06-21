import { setAreaStorage, getAreaStorage } from '@/utils/storage'
import { deleteArrayById } from '@/utils/index'
import { addChildren, updateChildren } from '@/utils/area'
import { apiBtn } from '@/api/default'

const state = {
  list: []
}

const mutations = {
  SET_LIST: (state, list) => {
    state.list = list
  },
  DELETE_AREA: (state, params) => {
    deleteArrayById(state.list, params.scope.row.id)
  },
  // 新增地区
  APPEND_AREA: (state, params) => {
    addChildren(state.list, params)
    // 同步storage
    const list = getAreaStorage()
    addChildren(list, params)
    setAreaStorage(list)
  },
  // 修改地区
  UPDATE_AREA: (state, params) => {
    updateChildren(state.list, params)
    // 同步storage
    const list = getAreaStorage()
    updateChildren(list, params)
    setAreaStorage(list)
  }
}

const actions = {
  // 获取所有地区
  GetArea({ commit }) {
    return new Promise((resolve, reject) => {
      const storage = getAreaStorage()
      if (storage && storage.length) {
        for (const item of storage) {
          if (item.children && item.children.length) {
            item.children = []
          }
        }
        commit('SET_LIST', storage)
        resolve()
      } else {
        apiBtn('AreaIndex')
          .then(res => {
            const list = res.data
            setAreaStorage(list)
            for (const item of list) {
              if (item.children && item.children.length) {
                item.children = []
              }
            }
            commit('SET_LIST', list)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      }
    })
  },
  // 删除指定地区
  DeleteArea({ commit }, params) {
    apiBtn(params.name, { id: params.scope.row.id })
      .then(() => {
        commit('DELETE_AREA', params)
        // 同步storage
        const list = getAreaStorage()
        deleteArrayById(list, params.scope.row.id)
        setAreaStorage(list)
      })
  },
  // 省级需要查询子级，其他不需要
  ToggleFold({ commit, state }, id) {
    if (!id) {
      return
    }
    const list = getAreaStorage()
    let i = 0
    while (i < list.length) {
      const item = list[i]
      // 添加子地区
      if (item.id === Number(id)) {
        state.list[i].children = item.children
        break
      }
      i++
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

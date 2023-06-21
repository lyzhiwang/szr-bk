import Vue from 'vue'
import store from '@/store'
/** 权限指令**/
const has = Vue.directive('has', {
  bind: function(el, binding, vnode) {
    /** el可以获取当前dom节点，并且进行编译，也可以操作事件 **/
    /** binding指的是一个对象，一般不用 **/
    /** vnode 是 Vue 编译生成的虚拟节点 **/
    // 获取按钮权限
    if (!Vue.prototype.$_has(binding.value)) {
      // el.parentNode.removeChild(el)
      el.style.display = 'none'
    }
  }
})
// 权限检查方法
Vue.prototype.$_has = function(value) {
  const permissionBtn = store.getters.permissionBtn // 权限按钮列表
  const permisssion = permissionBtn[value] // 当前按钮的权限
  if (permisssion && permisssion.api && permisssion.method) return true
  else return false
}

// el-input自动获取焦点
const focus = Vue.directive('focus', {
  inserted: function(el) {
    el.firstElementChild.focus()
  }
})

export default {
  has,
  focus
}

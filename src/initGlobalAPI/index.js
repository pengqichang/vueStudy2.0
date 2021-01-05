import initMixin from './mixin'
import initAssetRegisters from './assets'
import { ASSETS_TYPE } from './const'



export function initGlobalAPI(Vue) {
  // 整合了所有全局相关的内容
  Vue.options = {}
  initMixin(Vue)


  // 初始化的全局过滤器 指令 组件

  ASSETS_TYPE.forEach(type => {
    Vue.options[type + 's'] = {}
  })

  Vue.options._base = Vue; // _base 是 Vue 的构造函数

  initAssetRegisters(Vue)
}
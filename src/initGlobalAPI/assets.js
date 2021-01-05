
import {ASSETS_TYPE} from './const'

export default function initAssetRegisters(Vue) {
  ASSETS_TYPE.forEach(type => {
    Vue[type] = function(id,definition) {
      console.log(id, definition)
      if (type === 'component') {
        // 注册全局组件
        // 使用 extend 方法，将对象变成构造函数
        // 子组件可能也有这个 Vue.component 方法
        definition = this.options._base.extend(definition)

      } else if (type === 'filter') {

      } else if (type === 'directive') {

      }
      this.options[type + 's'][id] = definition
    }
  })
}
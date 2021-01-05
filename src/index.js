import {initMixin} from './init'
import {renderMinin} from './render'
import {lifecycleMixin} from './lifecycle'
import {initGlobalAPI} from './initGlobalAPI/index'
function Vue(options) {
  this._init(options)
}
initMixin(Vue)
renderMinin(Vue)
lifecycleMixin(Vue)

// 初始化全局 api
initGlobalAPI(Vue)
export default Vue
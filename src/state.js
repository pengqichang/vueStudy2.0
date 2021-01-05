import {observe, proxy} from './observe/index'
import {
  hasOwn
} from './util/index'
export function initState(vm) {
  const opts = vm.$options
  // vue 初始化数据顺序， 属性  方法  数据  计算属性  watch
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethods(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}
function initProps(vm) {}
function initMethods(vm) {}
function initData(vm) {// 数据初始化
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  // 对象劫持 用户改变了数据，希望可以得到通知 =》 刷新页面
  // MVVM模式, 数据变化，可以驱动视图变化

  // Object.defineProperty() 给属性增加 get 方法和 set 方法
  observe(data) // 响应式原理 
  const keys = Object.keys(data)
  let i = keys.length
  while(i--) {
    if (!hasOwn(vm, keys[i])) {
      proxy(vm, `_data`, keys[i])
    }
  }
}
function initComputed(vm) {}
function initWatch(vm) {}

 import {initState} from './state'
 import {complieToFunction} from './complier/index.js'
 import {mountComponent, callHook} from './lifecycle'
import {mergeOptions} from './util/index'
import { nextTick } from './util/next-tick'

// 在原型上添加 init 方法
export function initMixin(Vue){
  // 初始化流程
  Vue.prototype._init = function(options) {
    //数据劫持
    const vm = this

    // 将用户传递的和全局的进行合并


      vm.$options = mergeOptions(vm.constructor.options, options)
  
      callHook(vm, 'beforeCreate')
       // 初始化状态
      initState(vm)
  
      callHook(vm, 'created')



    // 如果页面传入了 el 属性， 需要将页面渲染出来
    // 如果用户传入了 el ，就要实现挂载流程

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function(el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el);
    // 默认先会查找有没有 render 方法，没有 render 会采用 template ， template 也灭有，就会采用 el 中的内容

    if (!options.render) {
      // 对模板进行编译
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      const render = complieToFunction(template)
      options.render = render
      // 需要将 template 转化成 render 方法  2.0  虚拟 dom
    }

    // 渲染当前组件，挂载这个组件
    mountComponent(vm, el);
  }
  Vue.prototype.$nextTick = nextTick

}
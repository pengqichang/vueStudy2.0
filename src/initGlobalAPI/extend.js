import {mergeOptions} from '../util/index'


export default function initExtend(Vue) {

  // 为什么要有子类和父类  new Vue  (Vue 的构造函数)
  // 创建子类  继承与父类    扩展的时候都扩展到自己的属性上
  // 组件可能创建多个，需要一个唯一标识
  let cid = 0;
  Vue.extend = function(extendOptions) {
    const Sub = function VueComponent(options) {
      this._init(options)
    }
    Sub.cid = cid++;
    Sub.prototype = Object.create(this.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(this.options, extendOptions)
    // minin
    // use
    // ...component


    return Sub;
  }
}   

// 组件渲染的时候，会调用当前组件对应的构造函数，产生一个实例
// 我们可以 new 这个类  每个组件调用，都会 new 一下

// 每个组件在使用时，都会调用 Vue.extend 方法，创建一个构造函数
// 实例化子组件时，会将当前选项和用户定义选项合并  mergeOptions
// 通过创建实例  内部会调用子类的_init()  内部会再创建一个渲染 watcher  将渲染后的结果，放到vm.$el 上， 组件的渲染结果
export default function initExtend(Vue) {

  // 为什么要有子类和父类  new Vue  (Vue 的构造函数)
  // 创建子类  继承与父类    扩展的时候都扩展到自己的属性上
  Vue.extend = function(extendOptions) {
    const Sub = function VueComponent() {

    }
    return Sub;
  }
}   
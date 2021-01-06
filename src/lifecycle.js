import Watcher from './observe/watcher'
import {patch} from './vdom/patch'

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm  = this
    // 通过虚拟节点，渲染真实 dom
    vm.$el = patch(vm.$el, vnode)  // 需要用虚拟节点创建出真实节点，替换掉真实的$el
  }
}


export function mountComponent(vm, el) {
  const options = vm.$options;
  vm.$el = el;
  // Watcher 就是用来渲染的
  // vm._render 通过解析的 render 方法，渲染出虚拟 dom
  // vm._update 通过虚拟 dom，创建真实 dom
  callHook(vm, 'beforeMount');
  // 渲染页面
  let updateComponent = () => {  // 无论渲染还是更新，都会调用此方法
    vm._update(vm._render())
  }
  // 渲染 watcher 每个组件，都有一个 watcher
  new Watcher(vm, updateComponent, () => { }, true) // true 标识他是一个渲染 watcher
  callHook(vm, 'mounted')
}

 
export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for(let i of handlers) {
      i.call(vm)
    }
  }
}

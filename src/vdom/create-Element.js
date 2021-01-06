import { isObject, isReservedTag } from "../util/index"; 

export function createElement(vm, tag,data = {}, ...children) {
  let key = data.key;
  if (key) {
    delete data.key
  } 

  // 以前标识的是标签， 现在是组件 名字  上下文
  if (isReservedTag(tag)) {
    return vnode(tag, data, key, children, undefined)
  } else {
    // 组件
    let Ctor = vm.$options.components[tag];
    return createComponent(vm, tag, data, key, children, Ctor)
  }
}

function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor)
  }
  data.hook = {
    init(vnode) {
      let child = vnode.componentInstance = new Ctor({_isComponent: true})
      child.$mount();
    }
  }
  return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, {Ctor, children})
} 


export function createTextNode(vm, text) {
    return vnode(undefined, undefined, undefined, undefined ,text)

}

function vnode(tag, data, key, children, text, componentOptions) {
  return {
    tag,
    data,
    key,
    children,
    text,
    componentOptions
  }
}

// 虚拟节点，就是通过_c _v 实现用对象来描述 dom 操作 （对象）
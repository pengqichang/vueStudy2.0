// 把 data 中的数据，使用 Object.defineProperty 重新定义 
import {
  isObject, def
} from '../util/index'
import {arrayMethods} from './array.js'

import Dep from './dep'

class Observer{
  constructor(value) {
    this.dep = new Dep(); // 给数组用的
    // vue 如果数据层次过多，需要递归去解析对象中的属性， 依次增加 set 和 get 方法
    // value.__ob__ = this // 给每一个监控过的对象增加一个__ob__属性
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 如果数组的话，并不会对索引进行观测，因为会导致性能问题
      // 前端开发中很少去操作索引  push  shift unshift
      value.__proto__ = arrayMethods
      // 如果数组里放的是对象，再监控
      this.observerArray(value)
    } else {
      this.walk(value)
    }
  }
  observerArray(value) {
    for (let i in value) {
      observe(value[i])
    }
  }  
  walk(data) {
    let keys = Object.keys(data);
    keys.forEach((key, index) => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(data,key,value) {
  let dep = new Dep() // 这个dep 是给对象用的
  // 这里这个 value 可能是给数组，也可能是对象，返回结果是observer的实例，当前这个 value 对应的observer
  let childOb = observe(value) // 递归实现深度检测
  Object.defineProperty(data,key,{
    configurable: true,
    enumerable: true,
    set(newValue) {
      if (newValue === value) return
      observe(newValue) // 劫持对象改变指针，劫持新对象
      value = newValue

      dep.notify()  // 通知依赖 watcher 执行操作
    },   
    get() { 
      console.log('取值')
      if (Dep.target) { // 如果当前有 watcher
        dep.depend() // 意味着要讲 watcher 存起来
        if (childOb) {  // 数组的依赖收集
          childOb.dep.depend(); // 收集了数组的相关依赖
          
          // 如果数组中还有数组
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
       // 每个属性，都对应着自己的 watcher
      return value
    }
  })
}
function dependArray(value) {
  for(let i in value) {
    let current = value[i] // 将数组的每一个都取出来，数据变化后也去更新视图
    // 数组中的数组的依赖收集
    current.__ob__ && current.__ob__.dep.depend()
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}

export function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}
const noop = _ => _


export function observe(data) {
  let isObj = isObject(data)
  if (!isObj) return
  return new Observer(data) // 用来观测数据
}
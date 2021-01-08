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




// demo 产生两个虚拟节点进行比对    dom-diff
// template => render function =>  vnode

import {complieToFunction} from './complier/index'
import {createElm, patch} from './vdom/patch'

let vm1 = new Vue({
  data: {name: 'hello'}
})

let render = complieToFunction(`<div id=aap >
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
</div>`)
let vnode = render.call(vm1)
let el = createElm(vnode)
document.body.appendChild(el)


let vm2 = new Vue({
  data: {name: 'zz', age: 28}
})

let render1 = complieToFunction(`<div id=app1>
<p>E</p>
  <div>A</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
</div>`)
let newVnode = render1.call(vm2)
// let el1 = createElm(newVnode)
// console.log(vnode, newVnode)

patch(vnode, newVnode) // 如果传入两个虚拟节点后，会再内部进行比对

// 1. ddff 算法特点是评级对比，我们正常操作 dom 元素，很少涉及到父变子，子变父 O(n3)

export default Vue
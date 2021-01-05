import {pushTarget, popTarget} from './dep.js'
import {queueWatcher} from './schedular'

let id = 0;

class Watcher{
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm;
    this.callback = callback;
    this.options = options;
    this.id = id++;   // 保证 watcher id 唯一性
    this.getter = exprOrFn; // 将内部传过来的回调函数， 放到 getter 属性上
    this.depsId = new Set(); // ES6 中的集合，不能放重复项
    this.deps = [];
    this.get() // 调用 get 方法，会让渲染 watcher 执行
  }
  get() {
    pushTarget(this) // 把 watcher 存起来   Dep.target
    this.getter();  // 渲染 watcher的执行     
    popTarget() // 移除 watcher
  }
  update() {
    queueWatcher(this)
    // console.log(this.id)
    // 等待一起更新，因为每次调用 update 的时候，都放入了 watcher
    // this.get()
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }   
  run() {
    this.get()
  }
}
export default Watcher
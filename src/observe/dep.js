let id = 0;
class Dep{
  constructor() {
    this.id = id ++ 
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)  // 观察者模式
  }
  depend() {
    // 让 watch 记住当前dep ，如果 watcher 没存过 dep， 那 dep 肯定不能存过 watcher
    Dep.target.addDep(this);
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}


let stack = [];
// 将 watcher 保留起来，和移除的功能
export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget () {
  stack.pop()
  Dep.target = stack[stack.length -1]
}

export default Dep
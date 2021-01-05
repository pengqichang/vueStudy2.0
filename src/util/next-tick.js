

let callbacks = [];

let waiting = false;
function flushCallback() {
  callbacks.forEach(v => v())
  waiting = false;
  callbacks = []
}
export function nextTick(cb) {
  // 多次调用 nextTick 如果没有刷新的时候，就先把它放到数组中，
  // 刷新后 更改 waitting
  callbacks.push(cb)
  if (waiting === false) {
    setTimeout(flushCallback,0)
    waiting = true
  }
}
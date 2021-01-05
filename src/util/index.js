
// 判断当前数据是不是对象
export function isObject(data) {
  return typeof data === "object" && data !== null 
}

export function def(data, key, value) {
  Object.defineProperty(data, key, {
    value,
    enumerable: false,
    configurable:  false
  })
}

export function hasOwn(target, key) {
  return target.hasOwnProperty(key)
}

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]

let strats = {}

function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

export function mergeOptions(parent, child) {
  const options = {}
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) { // 如果已经合并过了，就不需要再次合并了
    if(!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  // 默认的合并策略，但是有些属性  需要有特殊的合并方式
  function mergeField(key) {
    if (strats[key]) {
      return options[key] = strats[key](parent[key], child[key])
    }
    if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
      options[key] = {
        ...parent[key],
        ...child[key]
      }
    } else if (child[key] == null) {
      options[key] = parent[key]
    } else {
      options[key] = child[key]
    }
  }
  return options
}
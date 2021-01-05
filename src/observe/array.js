//  要重写数组的那些方法，7 个  push shift unshift pop reverse sort splice 会导致数组本身发生变化
// slice() 

let oldArrayMethods = Array.prototype
// value.__proto__ = arrayMethods 原型链查找问题，会向上查找，会先查找重写的，重写的没有，会继续向上查找
// arrayMethods.__proto___ = oldArrayMethods

export const arrayMethods = Object.create(oldArrayMethods)

const methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'sort',
  'splice',
  'reverse'
]

methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    // 切片编程
     const result = oldArrayMethods[method].apply(this, args) // 调用原生的数组方法
     let inserted; // 当前用户插入的元素
     let ob = this.__ob__
     switch(method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice': // 3个参数  新增的属性 splice 有删除  新增的功能 arr.splice(0,1,{name: 1})
        inserted = args.slice(2)
        break
      default: 
        break;
     }  
     if (inserted) ob.observerArray(inserted)
     
     ob.dep.notify(); // 如果用户调用了 push 方法，会通知当前 dep 去更新
     console.log(args)
     return result
  }
})
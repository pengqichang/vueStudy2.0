// import { isReservedTag } from "../util/index"; 
export function patch(oldVnode, vnode) {
  // 1. 判断是更新还是要渲染

  if (!oldVnode) {
    // 这个是组件的挂载  vm.$mount()
    return createElm(vnode)
  } else {
    const isRealElement = oldVnode.nodeType;
    if (isRealElement) {
      const oldElm = oldVnode;  // div  id= app
      const parentElm = oldElm.parentNode;  // body
      let el = createElm(vnode)
  
      parentElm.insertBefore(el, oldElm.nextSibling)
  
      parentElm.removeChild(oldElm)
      return el
    } else {
      if (oldVnode.tag !== vnode.tag) {
        // 标签不一致 直接替换
        console.log(oldVnode.el.parentNode)
        oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
      }
      // 比对两个虚拟节点，操作真是 dom
      // 如果是文本  文本没有 tag
      if (!oldVnode.tag) { // 文本的情况
        if (oldVnode.text !== vnode.text) {
          oldVnode.el.textContent = vnode.text  // 文本不一致，直接替换即可
        }
      }

      // 标签一致，而且不是文本    (对比属性是否一致)
      let el = vnode.el = oldVnode.el
      updateProperties(vnode, oldVnode.data)

      // 需要比对子节点
      let oldChildren = oldVnode.children || []
      let newChildren = vnode.children || []
      if (oldChildren.length > 0 && newChildren.length) {
        // 新的老的都有子节点，需要对比里面的孩子
        updateChildren(el, oldChildren, newChildren)
      } else if (newChildren.length > 0) {
        // 新的有孩子，老的没有  直接将虚拟节点转换成真实节点  插入即可
        for(let i in newChildren) {
          let child =  newChildren[i]; // 此时是虚拟节点
          el.appendChild(createElm(child))
        }
      } else if (oldChildren.length > 0) { 
        // 老的节点有子节点，新的没有，直接清空
        el.innerHTML = '';
      }

    }
    // 递归创建真实节点  替换掉老的节点 
  }
}

function updateChildren(parent, oldChildren, newChildren) {
  // vue 采用的是双指针的方式
  // vue 在比对的过程中，做了很多优化策略
  
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0;
  let newStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  const makeIndexByKey = (children) => {
    let map = {};
    children.forEach((item,index) => {
      // 根据 key 创建一个映射表
      if (item.key) map[item.key] = index;
    })

    return map
  }
  let map = makeIndexByKey(oldChildren)

  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 优化向后插入的情况
    if (!oldStartVnode) { // 在老指针移动的过程中，可能会碰到 undefined 的情况
      oldStartVnode = oldChildren[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    }
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 如果是同一个节点 就需要比对这两个元素的差异
      patch(oldStartVnode, newStartVnode) // 比对开头节点
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
      
       // 优化向前插入的情况
    } else if (isSameVnode(oldEndVnode, newEndVnode)) { 
      patch(oldEndVnode, newEndVnode) // 比对开头节点
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
      // 头移尾  （涉及到 倒序变成正序）
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
      // 尾移头   （涉及到正序变成倒序）
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el.nextSibling)
      oldEndVnode = oldChildren[--oldStartIndex]
      newStartVnode = newChildren[++newEndIndex]
    } else {
      // 直接暴力对比
      /**
       * 根据老节点的 key 做一个映射表，拿新的虚拟节点去映射表中查找，如果可以查找到，则进行移动操作（移动到当前头指针前面的位置）
       * 如果找不到，则直接将元素插入即可
       *  **/ 
      let moveIndex = map[newStartVnode.key];
      if (!moveIndex) { // 不需要复用
         parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      } else {
        // 如果再映射表中查找到了，则直接将元素移走，并且将当前位置置为空
        let moveVnode = oldChildren[moveIndex] // 查找到对应的 key，开始移动
        oldChildren[moveIndex] = undefined
        parent.insertBefore(moveVnode.el, oldStartVnode.el)
        patch(moveVnode, oldStartVnode);
      }
      newStartVnode = newChildren[++newStartIndex]

    }
  }
  
  if (newStartIndex <= newEndIndex) {
    for(let i = newStartIndex; i <= newEndIndex; i++) {
      // 将新增的元素进行直接插入 （可能是向后插入，可能是从头插入）
      // parent.appendChild(createElm(newChildren[i]))
      let el = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
      console.log(el)
      parent.insertBefore(createElm(newChildren[i]),el) // 写 null，就等价于 appendChild
    }
  }
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i<= oldStartIndex;i++) {
      let child = oldchildren[i];
      if (child != undefined) {
        parent.removeChild(child.el)
      }
    }
  }
  
}
function isSameVnode (oldVnode, newVnode) {
  return (oldVnode.tag == newVnode.tag) && (oldVnode.key === newVnode.key);
}
 function createComponent(vnode) {
   // 需要创建组件的实例
   let i = vnode.data
   if ((i = i.hook) && (i = i.init )) {
     i(vnode)
   }
   // 执行完毕后
   if (vnode.componentInstance) {
     return true
   }
 }

export function createElm(vnode) { // 根据虚拟节点创建真实的节点
  let {tag, children, key, data,text} = vnode
  // 是标签就创建标签
  if (typeof tag === 'string') {
    // 不是 tag 是字符串的，就是普通的 html， 还有可能是组件

    // 实例化组件
    if (createComponent(vnode)) {
      // 这里应该返回真是的元素
      return vnode.componentInstance.$el;
    }

    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach(child => {
      return vnode.el.appendChild(createElm(child)) // 递归创建子节点，将子节点扔进父节点
    })
  } else {
    // 虚拟 dom 上映射着真实 dom  方便后期更新操作
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
  // 如果不是标签，就是文本
}

// 更新属性
function updateProperties(vnode, oldProps = {}) {
  let newProps = vnode.data || {};

  let el = vnode.el;
  // 如果老的属性中有，新的属性中没有，要再真实的 dom 中删除此属性

  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  for (let key in oldStyle) {
    if(!newStyle[key]) {
      el.style[key] = ''
    }
  }
  // el.style = newStyle
  for (let key in oldProps) {
    if(!newProps[key]) {
      el.removeAttribute(key)
    }
  }
  for (let key in newProps) {
    if (key === 'style') {
      // 都是新增样式
      for(let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if(key  === 'class') {
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}
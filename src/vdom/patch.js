export function patch(oldVnode, vnode) {
  // 1. 判断是更新还是要渲染
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    const oldElm = oldVnode;  // div  id= app
    const parentElm = oldElm.parentNode;  // body
    let el = createElm(vnode)

    parentElm.insertBefore(el, oldElm.nextSibling)

    parentElm.removeChild(oldElm)
    return el
  }
  // 递归创建真实节点  替换掉老的节点 
}


function createElm(vnode) { // 根据虚拟节点创建真实的节点
  let {tag, children, key, data,text} = vnode
  // 是标签就创建标签
  if (typeof tag === 'string') {
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
function updateProperties(vnode) {
  let newProps = vnode.data;
  let el = vnode.el;
  for (let key in newProps) {
    if (key === 'style') {
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
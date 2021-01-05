const defaultTagRe = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
  let str = '';
  for (let i in attrs) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      // style=color:red;fontSize: 14px;   =>   {style: {color: red}}
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function genChildren(el) {
  let children = el.children
  if (children && children.length > 0) {
    return `${children.map(c => gen(c)).join(',')}`
  } else {
    return false
  }
}

function gen(node) {
  if (node.type == 1) {
    // 元素标签
    return generate(node)
  } else {
    let text = node.text;   // a {{name}}   b{{age}}   c
    let tokens = []
    let match, index;
    let lastIndex = defaultTagRe.lastIndex = 0
    while (match = defaultTagRe.exec(text)) {
      index = match.index;
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    // _v("a" + _s(name) + "b" + _s(age) + "c")
    return `_v(${tokens.join('+')})`
  }
}

export function generate(el) {
  let children = genChildren(el)
  let code = `_c("${el.tag}", ${
    el.attrs.length ? genProps(el.attrs) : 'undefined'
    },${
    children ? children : ''
    })
  `
  return code
}
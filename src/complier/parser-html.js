
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const defaultTagRe = /\{\{((?:.|\r?\n)+?)\}\}/g

export function parseHTML(html) {
  let root = null   // ast语法书树的树根
  let currentParent; // 标识父节点
  let stack = []
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3

function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null
  }
}

function start (tagName, attrs) {
  // 遇到开始标签，创建一个 ast 元素
  let element = createASTElement(tagName, attrs)
  if (!root) {
    root = element
  }
  currentParent = element   // 把当前元素标记成父 ast 树
  stack.push(element)     // 将开始标签存放到栈中
}
function chars(text) {
  text = text.replace(/\s/g, '')
  if (text) {
    currentParent.children.push({
      text,
      type: TEXT_TYPE
    })
  }
}

function end(tagName) {
  let element = stack.pop()  // 拿到的是 ast 对象
  // 标识当前这个标签是属于这个 div 的儿子的
  currentParent = stack[stack.length - 1]
  if (currentParent) {
    element.parent = currentParent
    currentParent.children.push(element)
  }
}

  // 不停的去解析 html 字符串
  while (html) {
    let textEnd = html.indexOf('<');
    if (textEnd == 0) {
      // 如果当前索引为 0， 肯定是一个标签  开始标签   结束标签
      let startTagMatch = parseStartTag()   // 通过这个方法获取到匹配的结果  tagName, attrs
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue;
      }
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue;
      }
    }
    let text;
    if (textEnd >= 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }
  function parseStartTag() {
    let start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) // 将标签删除
      let end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })  // 解析属性，放到 attrs 里
      }
      if (end) { // 去掉开始标签
        advance(end[0].length);
        return match
      }

    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  return root
}


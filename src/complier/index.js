import { parseHTML } from './parser-html.js'
import { generate } from './generate.js'

// AST语法书   用对象来描述原生语法的  虚拟 dom  用对象来描述dom 节点

export function complieToFunction(template) {
  let root = parseHTML(template)
  // 需要将 ast 语法树生成 render 函数  就是字符串拼接   （模板引擎）
  let code = generate(root)
  // console.log(code)
  // 核心思路，就是将模板转换成下面这段字符串
  // <div id="app"><p>hello {{name}}</p> hello</div>
  // 将 ast 树再次转换成 js 语法
  // _c("div", {id: app}, _c("p",undefined, _v("hello" + _s(name))), _v("hello"))

  // 所有的模板引擎实现，都需要new Function + with

  code = `with(this){return ${code}}`

  let renderFn = new Function(code)
  return renderFn
}
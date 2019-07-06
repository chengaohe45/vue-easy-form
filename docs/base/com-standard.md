# 组件化标准写法

组件化是指某个属性根据实际要求，按一定的格式引入Vue组件；目前支持组件化的属性有：项标签label、描述desc、帮助help、单元unit、标题title、项组件component，当然，这些属性都有自己其它的写法，具体的写法见各属性详解。

引入一个组件(从一个Object开始)：
```js
属性名: {     // 表单配置属性名如：label, help
  name: "el-input",  // 这个是不支持es写法，也就是一经固定，不支持改变
  props: { // Vue组件需要的属性
    type: "textarea",   // 值固定写法
    placeholder: "es: {{$root}}.isOpen ? '提示1' : '提示2'", // 支持es写法
    // options => {global, rootData, idxChain, index, pathKey, $hidden}
    disabled: function(options) {  // 支持函数写法, options返回构造需要的参数
      return options.rootData.isOpen;
    }
  },
  text: "文本描述"    // 有些组件不支持这个；就是default-slot
}
```

运用函数构造Vue属性，options所携带的信息：
- `global`：form属性的global
- `rootData`：表单的原始值（隐藏的项值也会取出）
- `pathKey`：项组件的路径
- `idxChain`： 项组件所要数组所组成的id 如: 1,2
- `index`：项组件处于数组的子节点(非孙子)时的索引，其余的返回-1
- `$hidden`：函数。判断某项是否处于隐藏，这个函数会自动匹配所处于哪个表单，所以参数只需要传入一个pathKey。如: $hidden("base.name"), 

::: warning
`没有this指针` 当props里的的属性（如：disabled）写成一个函数时，this并不指向表单的。
为什么? 因为当执行这些函数时，表单内的组件正处于未构造或正在重复构造，不建议调用表单内的函数(如：form.getValue等)；这个与验证rules.checks、数组array.insertValue、项组件component.actions里面的函数不同，后者们的this是指向表单的
:::



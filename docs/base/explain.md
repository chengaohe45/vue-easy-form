# 表单相关概念

## 根值

rootData: 表单中所有的值，包含隐藏的；也就是说有什么值就取什么值出来；用于操作`表单项组件`的逻辑控制

## 表单值

formValue: 表单中用户所需要的值（一般不包含隐藏的值、临时值；场景如下）；用于数据提交；可认为formValue是rootData的一个子集。

影响formValue的场景：
- 在表单逻辑控制中，一般隐藏的`表单项组件`不需要提交的(若需要提交, 可设置`hdValue`)；
- 在表单逻辑控制中，隐藏的`表单项组件`需要提交的指定的值(可设置`hdValue`)；
- 在`表单项组件`件显示中，有的值只是显示，但并不需要提交(可设置`isTmp`)

## 索引链
idxChain: 指出`表单项组件`所处于数组的位置<br>
如：base.student[0].courses[1].name, 如索引链为'0,1'; 当父节点或祖先节点不是数据时，则`表单项组件`为`空字符`
> 应用场景：[项组件事件](./component.md#组件事件)、[项组件验证](./rules.md)、[数组事件](./array.md#数组事件)所携带的信息会返回此值


## 项组件路径
pathKey: `表单项组件`位置的具体路径. 如：
```js
base.student[0].courses[1].name // 推荐的写法
base.target.name        // 推荐的写法
base.target["name"]
```
> 应用场景：[项组件事件](./component.md#组件事件)、[项组件验证](./rules.md)、[数组事件](./array.md#数组事件)所携带的信息会返回此值; [form.setValue](./form.md#表单方法)等需要此值设置

## es语法
es语法就一条`es:`为前缀的字符串，再按照一定的规则解析出来的js语句。<br />
如：<br /><span v-pre>`es: {{$root}}.isJson ? 'JSON格式' : 'XML格式'`</span><br />
说明：字符串以es:开关，用表单根数据代替<span v-pre>{{$root}}</span>, 最终变为<br />
`rootData.isJson ? 'JSON格式' : 'XML格式'`<br />

支持es有4个数据源，这4个值共同影响整个es的解析：
1. `rootData`： 整个表单的`根值/rootData`. root在es语法中的写法是<span v-pre>`{{$root}}`</span>
2. `global`： 从表单中传入，用于外部对表单影响, 不设置则默认为`空对象`; global在es语法中的写法是<span v-pre>`{{$global}}`</span>
3. `index`：数组中孩子节点(非孙子节点))项所在的索引，其它节点(非孩子)节点此值是-1. index在es语法中的写法是<span v-pre>`{{$index}}`</span>
4. `hidden`： 用于判断某一项是否隐藏. hidden在es语法中的写法是<span v-pre>`{{$hidden(base.target)}}`</span>; 括号中是路径

[es写法](./com-standard.md#es写法)<br/>
[es写法实例](https://chengaohe45.github.io/vue-easy-form-docs/demo/#/es-function)



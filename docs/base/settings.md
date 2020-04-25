# schema配置

## 配置列表
| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| [title](./title.md) | 表单块（properties）的名称 | string<br/>object | -- | -- | properties中有效;<br/>支持[动态解析](./parse.md)和[组件化](./com-format.md)
| [ui](./ui.md) | 影响块(properties)的布局 | string<br/>object | -- | -- | properties中有效
| [rowHeight](./ui.md) | 项的行高 | number | -- | 上一级 | 不设置时，<br/>继承上一级的ui.rowHeight
| [rowSpace](./ui.md) | 与上一次项(行)之间的间隔 | number | -- | 上一级 | 不设置时，<br/>继承上一级的ui.rowSpace
| [labelWidth](./ui.md) | 项label的宽度 | number | -- | 上一级 | 不设置时，<br/>继承上一级的ui.labelWidth
| [offsetLeft](./ui.md) | 项的左边偏移量 | number | >=0 | 上一级 | 不设置时，<br/>继承上一级的ui.offsetLeft
| [offsetRight](./ui.md) | 项的右边偏移量 | number | >=0 | 上一级 | 不设置时，<br/>继承上一级的ui.offsetRight
| [colon](./ui.md) | label中是否有冒号 | boolean | -- | 上一级 | 不设置时，<br/>继承上一级的ui.colon
| [direction](./ui.md) | 项的排版方向 | string | "h" "v" | 上一级 | 不设置时，<br/>继承上一级的ui.direction
| [hidden](./hidden.md) | 是否隐藏此项 | boolean | -- | false | 支持[动态解析](./parse.md)
| [hdValue](./hidden.md) | `hidden`或`祖先hidden`为true时有效 | -- | -- | -- | 值为`undefined`时：相应的字段不会取出<br />值为`null`时: 为正常遍历节点<br />`其余`: 取此值
| [isTmp](./hidden.md) | 临时值 | boolean | -- | false | 表单不输出此项值,但可作为表单内部使用
| [col](./d-col-group.md) | 列数(宽度) | number | 1到24 | 24 | 一行分24列
| [group](./d-col-group.md) | 项与项进行分组 | string | -- | -- | 设置为分组，是`相邻`的；<br/>只对`component`有效，对`properties`是无效的
| [label](./label.md) | label设置 | strin<br/>object | -- | false | false代表隐藏label<br/>支持[动态解析](./parse.md)和[组件化](./com-format.md)
| [component](./component.md) | 配置组件 | string<br/>object | -- | 全局 | 
| [unit](./unit.md) | 对项进行补充 如：px| string | -- | -- | 支持[动态解析](./parse.md)和[组件化](./com-format.md)
| [desc](./desc.md) | 对项进行描述 | string | -- | 全局 | 支持[动态解析](./parse.md)和[组件化](./com-format.md)
| [help](./help.md) | 对项设置帮助 | string<br/>object | -- | -- | 支持[动态解析](./parse.md)和[组件化](./com-format.md)
| [value](./value.md) | 组件的值 | -- | -- | -- |
| [isTrim](./value.md) | 是否去掉两边的空格 | boolean | -- | true |
| [format](./format.md) | 数值转换 | array<br/>object | -- | -- | 组件内有效
| [array](./array.md) | 此项为数组 | string<br/>object | -- | -- | 根节点无效
| [rules](./rules.md) | 规则设置 | object | -- | -- |
| layout | 布局 | object<br/>string | "space"<br/>"tabs"<br/>Object | false | `区分大小写`<br />`space`: 是一个[占位空间](./d-col-group.md)<br />`tabs`:下一级为[tabs布局](./tabs.md)
| [properties](./properties.md) | 下一级 | object | -- | -- | 下一级，重复上面的配置
| [autoMatch](./auto-match.md) | 一二级的数据自动匹配 | boolean | -- | false | 只在根节点中有效
### [ui属性](./ui.md)

只有在properties中有效；主要是影响头部的样式和body的边距

| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| showBody | 隐藏/打开切换按钮 | boolean | -- | -- | `不设置`代表没有切换按钮；<br/>`设置`说明有切换按钮，值代表最先是否显示body
| <span style="white-space: nowrap;">toggleTexts<badge text="1.6.2" /></span> | 切换按钮不同状态显示的文字 | array | -- | ["打开", "隐藏"] | 数组长度必须是2，且内容是字符串
| type | 整个块的布局类型 | string | <span style="white-space:nowrap">"bg"</span><br/><span style="white-space:nowrap">"block"</span><br/><span style="white-space:nowrap">"bg-block"</span><br/>""| -- | `block`就是前面有一竖
| hasBorder | 内容区是否有边框 | boolean | -- | false | --
| padding | 内容区的内边距 | number<br/>string<br/>array | -- | -- | `不设置`：根据实际情况调整<br/>`整数`：20 <br> `字符串`：'20px 10px', `数组`：[20, 10]
| rowHeight | 项的行高 | number | -- | 上一级 | 会影响下一级
| rowSpace | 与上一次项(行)之间的间隔 | number | -- | 上一级 | 会影响下一级
| labelWidth | 项label的宽度 | number | -- | 上一级 | 会影响下一级
| offsetLeft | 项的左边偏移量 | number | >=0 | 上一级 | 会影响下一级
| offsetRight | 项的右边偏移量 | number | >=0 | 上一级 | 会影响下一级
| colon | label中是否有冒号 | boolean | -- | 上一级 | 会影响下一级
| direction | 项的排版方向 | string | "h" "v" | 上一级 | 会影响下一级


### layout属性
layout有两种作用：
- [占位空间](./d-col-group.md)：此项什么都不显示，类似visibility: hidden;
- [tabs布局](./tabs.md)：对properties下的属性进行tabs布局

写法：
- `String`: 字符串，值有：`space` | `tabs`
- `Object`: 对象，其详细配置如下:

| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| name | 类型 | string | space<br/>tabs | -- | --
| type | 布局类型 | string | bg<br/>card<br/>line | card | --
| hasBorder | 内容区是否有边框 | boolean | -- | false | --
| padding | 内容区的内边距 | number/string | -- | -- | `不设置`：根据实际情况调整<br/>`整数`：20 <br> `字符串`：'20px 10px' <br>`数组`：[20, 10]

注：`当name为space时，其余的属性是无效的，不用设置也可`

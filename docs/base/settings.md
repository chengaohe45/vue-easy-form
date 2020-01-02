# schema配置

## 配置列表
| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| autoMatch | 一二级的数据自动匹配 | boolean | -- | false | 只在根节点中有效
| title | 表单块（properties）的名称 [写法](./title.md) | string<br/>object | -- | -- | properties中有效<br/>支持[动态解析](./com-standard.md)
| ui | 影响块(properties)的布局 [写法](#ui属性) | string<br/>object | -- | -- | properties中有效
| rowHeight | 项的行高 | number | -- | 上一级 | 不设置时，继承上一级的[ui](#ui属性).rowHeight
| rowSpace | 与上一次项(行)之间的间隔 | number | -- | 上一级 | 不设置时，继承上一级的[ui](#ui属性).rowSpace
| labelWidth | 项label的宽度 | number | -- | 上一级 | 不设置时，继承上一级的[ui](#ui属性).labelWidth
| offsetLeft | 项的左边偏移量 | number | >=0 | 上一级 | 不设置时，继承上一级的[ui](#ui属性).offsetLeft
| offsetRight | 项的右边偏移量 | number | >=0 | 上一级 | 不设置时，继承上一级的[ui](#ui属性).offsetRight
| colon | label中是否有冒号 | boolean | -- | 上一级 | 不设置时，继承上一级的[ui](#ui属性).colon
| direction | 项的排版方向 | string | "h" "v" | 上一级 | 不设置时，继承上一级的[ui](#ui属性).direction
| hidden | 是否隐藏此项 | boolean | -- | false | 支持[动态解析](./com-standard.md)
| hdValue | `hidden`或`祖先hidden`为true时有效 | -- | -- | -- | 值为`undefined`时：相应的字段不会取出<br />值为`null`时: 为正常遍历节点<br />`其余`: 取此值
| value | 组件的值 | -- | -- | -- |
| isTrim | 是否去掉两边的空格 | boolean | -- | true |
| col | 列数(宽度) | number | 1到24 | 24 | 一行分24列
| label | label设置 [写法](./label.md) | strin<br/>object | -- | false | false代表隐藏label
| rules | 规则设置 [写法](./rules.md) | object | -- | -- |
| format | 数值转换 [写法](./format.md) | array<br/>object | -- | -- | 组件内有效
| component | 配置组件 [写法](./component.md) | string<br/>object | -- | 全局 |
| group | 项与项进行分组 | string | -- | -- | 设置为分组，是`相邻`的；<br/>只对`component`有效，对`properties`是无效的
| unit | 对项进行补充 | string | -- | -- | 如：px；支持es或组件化<br/>支持[动态解析](./com-standard.md)
| desc | 对项进行描述 | string | -- | 全局 | 支持[动态解析](./com-standard.md)
| help | 对项设置帮助 [写法](./help.md) | string<br/>object | -- | -- | 支持[动态解析](./com-standard.md)
| array | 此项为数组 [写法](./array.md) | string<br/>object | -- | -- | 根节点无效
| isTmp | 临时值 | boolean | -- | false | 表单不输出此项值,但可作为表单内部使用
| layout | 布局 | object<br/>string | "space" "tabs" or Object | false | `区分大小写`<br />`space`: 是一个占位符<br />`tabs`:下一级为tabs布局[写法](#layout属性)
| `properties` | 下一级 | object | -- | -- | 下一级，重复上面的配置

### ui属性

只有在properties中有效；主要是影响头部的样式和body的边距<br />
`（下面都是ui的属性，分为两部分是为了更好区别分类）`

- 1. ui属性>>界面设置

| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| showBody | 隐藏/打开切换按钮 | boolean | -- | -- | 不设置没有按钮；设置有按钮，此值代表最先是否显示body
| type | 整个块的布局类型 | string | "bg"<br/>"block"<br/>"bg-block"<br/>""| -- | `block`就是前面有一竖
| hasBorder | 内容区是否有边框 | boolean | -- | false | --
| padding | 内容区的内边距 | number<br/>string<br/>array | -- | -- | `不设置`：根据实际情况调整<br/>`整数`：20 <br> `字符串`：'20px 10px', `数组`：[20, 10]

- 2. ui属性>>可被继承

| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| rowHeight | 项的行高 | number | -- | 上一级 | 注：影响的是下一级
| rowSpace | 与上一次项(行)之间的间隔 | number | -- | 上一级 | 注：影响的是下一级
| labelWidth | 项label的宽度 | number | -- | 上一级 | 注：影响的是下一级
| offsetLeft | 项的左边偏移量 | number | >=0 | 上一级 | 注：影响的是下一级
| offsetRight | 项的右边偏移量 | number | >=0 | 上一级 | 注：影响的是下一级
| colon | label中是否有冒号 | boolean | -- | 上一级 | 注：影响的是下一级
| direction | 项的排版方向 | string | "h" "v" | 上一级 | 注：影响的是下一级

>`ui属性>>可被继承`里的配置并不影响当前的项，只会影响下一级，这样做只是为了统一配置下一级，不用一个一个配置

### layout属性

有两种情况：
- `space` 占位空间，什么都不显示，类似visibility: hidden;
- `tabs` 对properties下的属性进行tabs布局

可以直接对layout赋值一个字符串(`space`/`tabs`);<br>
当layout写成一个对象时，其详细配置如下:

| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| name | 类型 | string | `space`, `tabs` | -- | --
| type | 布局类型 | string | `bg`, `card`, `line` | `card` | --
| hasBorder | 内容区是否有边框 | boolean | -- | false | --
| padding | 内容区的内边距 | number/string | -- | -- | `不设置`：根据实际情况调整<br/>`整数`：20 <br> `字符串`：'20px 10px', `数组`：[20, 10]

注：`当name为space时，其余的属性是无效的，不用设置也可`

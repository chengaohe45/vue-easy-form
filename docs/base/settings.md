# 表单应用/配置

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        name: {
          label: "广告名称",
          component: "el-input",
          value: "首页位置"
        }
      },
    };
  },
```

[schema的具体写法](./schema.md)

## schema属性
| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| autoMatch | 一二级的数据自动匹配 | boolean | -- | false | 只在根节点中有效
| title | 表单（或properties块）的名称 [写法](./title.md) | string/object | -- | -- | properties中有效
| direction | 项的排版方向 | string | "h" "v" | 全局 | 不设置时，继承上一级的direction
| colon | label中是否有冒号 | boolean | -- | 全局 |
| rowHeight | 项的行高 | number | -- | --  | 不设置时，继承上一级的boxRowHeight
| boxRowHeight | 子节点中每一项的高度 | number | -- | 全局 | properties中有效
| rowSpace | 与上一次行之间的间隔 | number | -- | -- | 不设置时，继承上一级的boxRowSpace
| boxRowSpace | 子节点中行与行的高度 | number | -- | 全局 | properties中有效
| labelWidth | label的宽度 | number | -- | 全局 | 不设置时，继承上一级的boxLabelWidth
| boxLabelWidth | 子节点的label的宽度 | number | -- | 全局 | properties中有效
| offsetLeft | 每一项左边留白的空间 | number | >=0 | 0 | 没有继承
| offsetRight | 每一项右边留白的空间 | number | >=0 | 0 | 没有继承
| hidden | 是否隐藏此项 | boolean | -- | true | 支持es语法
| hdValue | `hidden`或`祖先hidden`为true时有效 | -- | -- | -- | 值为`undefined`时：相应的字段不会取出<br />值为`null`时: 为正常遍历节点<br />`其余`: 取此值
| value | 组件的值 | -- | -- | -- |
| isTrim | 是否去掉两边的空格 | boolean | -- | true |
| col | 列数(宽度) | number | 1到24 | 24 | 一行分24列
| label | label设置 [写法](./label.md) | string/object | -- | false | false代表隐藏label
| rules | 规则设置 [写法](./rules.md) | object | -- | -- |
| format | 数值转换 [写法](./format.md) | array/object | -- | -- | 组件内有效
| component | 配置组件 [写法](./component.md) | string/object | -- | 全局 |
| group | 项与项进行分组 | string | -- | -- | 设置为分组，是`相邻`的
| unit | 对项进行补充 | string | -- | -- | 如：px；支持es或组件化
| desc | 对项进行描述 | string | -- | 全局 | 支持es或组件化
| help | 对项设置帮助 [写法](./help.md) | string/object | -- | -- |
| array | properties或组件是数组，[写法](./array.md) | string/object | -- | -- | 
| isTmp | 临时值 | boolean | -- | false | 表单不输出此项值,但可作为表单内部使用
| layout | 布局 | object/string | "space" "tabs" or Object | false | `区分大小写`<br />`space`: 是一个占位符<br />`tabs`:下一级为tabs布局[写法](./layout.md)

[schema的具体写法](./schema.md)

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
| unit | 对项进行补充 | string | -- | -- | 如：px
| desc | 对项进行描述 | string | -- | 全局 | 支持html
| help | 对项设置帮助 [写法](./help.md) | string/object | -- | -- |
| array | properties是数组，[写法]见下边 | string/object | -- | -- | 
| isTmp | 临时值 | boolean | -- | false | 表单不输出此项值,但可作为表单内部使用
| layout | 布局 | object/string | "space" "tabs" or Object | false | `区分大小写`<br />`space`: 是一个占位符<br />`tabs`:下一级为tabs布局[写法](./layout.md)

## widget属性

当widget设置时

| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| name | 哪种分组 | string/object | "array"、"array-table"、"array-tabs" | "array" | 
| hasSort | 是否有排序按钮 | boolean | -- | false | 
| hasDelete | 是否有删除按钮 | boolean | -- | true |
| hasAdd | 是否有添加按钮 | boolean | -- | true | 
| fixed | 固定数量 | number | >=0 | 0 | 前几条是固定的，不可移动，也不可删除
| min | 最少多少条 | number | >=0 | 0 | 0 代表无限制
| max | 最多多少条 | number | >=0 | 0 | 0 代表无限制
| hasOrder | 可排序 | boolean | -- | true | 
| hasDelWarn | 删除提示 | boolean | -- | true | 删除时是否有提示
| headRequired | “星号”的位置 | boolean | -- | true | 当name为`array`无效，为`array-table`有效；当设置为true时，“星号”在table头部显示，而不是在内容区随组件显示；注意：required的值不能受properties里面的属性影响
| header | 头部类型 | string | `line`,`border`,`bg` | '' | 
| border | body边框 | number | >=0 | 0 |
| body | body内边距 | number | >=0 | 0 | 
| tabsName | tabs头部名称 | number | >=0 | 0 | `array-tabs`时为效，其余情况无效; 支持es语法
| tabsHeader | tabs头部类型 | string | `underline`,`card`,`border-card` | `underline` | 
| tabsBorder | tabs框里body边框 | number | >=0 | 0 | 0
| tabsBody | tabs框里body内边距 | number | >=0 | 0 | 0

[schema的具体写法](./schema.md)

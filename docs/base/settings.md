# 表单开始/配置

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

## 标准写法

标准的表单配置从一个对象开始，里面包含一个properties，可在每一层properties这一相同的层级中设置一些影响此表单的基本配罢(如ui, boxRowSpace)。

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {   // 从一个对象开始，里面包含一个properties
        colon: true,  // label前是否有冒号
        boxRowSpace: 20,  // 每一行的间距
        ui: {
          showBody: true  // 隐藏/打开切换按钮
          // ...
        },
        properties: {   // 最外层的properties(第一层级)
          title: "个人信息",
          name: {
            label: "名称",
            component: "el-input",
            value: "首页位置"
          },
          baseInfo: {
            properties: { // 下一层级(第二层级)
              age: {
                label: "年龄",
                component: "el-input",
                value: "18"
              },
              address: {
                label: "地址",
                component: "el-input",
                value: "广东"
              }
            }
          }
        }
      }
    };
  },
```

## 简写

当表单的基础配置已经完成，不需要个性化设置，可以写一个简单的写法，去掉properties这一层，直接进入表单属性

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        name: {
          label: "名称",
          component: "el-input",
          value: "首页位置"
        },
        baseInfo: {
          properties: { // 下一层级(第二层级，因为第一层级的properties不写了)
            age: {
              label: "年龄",
              component: "el-input",
              value: "18"
            },
            address: {
              label: "地址",
              component: "el-input",
              value: "广东"
            }
          }
        }
      }
    };
  },
```


[schema的具体写法](./schema.md)

## schema属性
| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| autoMatch | 一二级的数据自动匹配 | boolean | -- | false | 只在根节点中有效
| title | 表单（或properties块）的名称 [写法](./title.md) | string/object | -- | -- | properties中有效
| ui | 影响块(properties)的布局 [写法](#ui属性) | string/object | -- | -- | properties中有效
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
| layout | 布局 | object/string | "space" "tabs" or Object | false | `区分大小写`<br />`space`: 是一个占位符<br />`tabs`:下一级为tabs布局[写法](#layout属性)

[schema的具体写法](./schema.md)

### ui属性

只有在properties中有效；主要是影响头部的样式和body的边距

| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| showBody | 隐藏/打开切换按钮 | boolean | -- | -- | 不设置没有按钮；设置有按钮，此值代表最先是否显示body
| type | 整个块的布局类型 | string | `bg`, `block`, `bg-block` | -- | `block`就是前面有一竖
| hasBorder | 内容区是否有边框 | boolean | -- | false | --
| padding | 内容区的内边距 | number/string | -- | -- | `不设置`：根据实际情况调整<br/>`整数`：20 <br> `字符串`：'20px 10px'

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
| padding | 内容区的内边距 | number/string | -- | -- | `不设置`：根据实际情况调整<br/>`整数`：20 <br> `字符串`：'20px 10px'

注：`当name为space时，其余的属性是无效的，不用设置也可`


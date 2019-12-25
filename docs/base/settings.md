# 表单开始/配置

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

## 标准写法

标准的表单配置从一个对象开始，里面包含一个properties，可在每一层properties这一相同的层级中设置一些影响此表单的基本配置(如ui)。

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {   // 从一个对象开始，里面包含一个properties
        ui: {
          showBody: true,  // 隐藏/打开切换按钮
          // 以下的配置会被properties里面的字段(name/baseInfo)继承，
          // name和baseInfo若没有覆盖，则继承
          rowHeight: 40,
          rowSpace: 20,
          labelWidth: 100,
          offsetLeft: 0,
          offsetRight: 0,
          colon: false,
          direction: "h"
        },
        properties: {   // 最外层的properties(第一层级)
          title: "个人信息",
          name: {
            label: "名称",
            component: "el-input",
            value: "首页位置"
          },
          baseInfo: {
            rowSpace: 30, // 覆盖上一级的ui.rowSpace(若没有ui就往上取，直到全局)
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
          rowSpace: 30, // 覆盖上一级的ui.rowSpace(若没有ui就往上取，直到全局)
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
| title | 表单块（properties）的名称 [写法](./title.md) | string/object | -- | -- | properties中有效<br/>支持[es写法](./com-standard.md#es写法)、[函数写法](./com-standard.md#函数写法)
| ui | 影响块(properties)的布局 [写法](#ui属性) | string/object | -- | -- | properties中有效
| rowHeight | 项的行高 | number | -- | 上一级 | 不设置时，继承上一级的[ui](#ui属性).rowHeight
| rowSpace | 与上一次项(行)之间的间隔 | number | -- | 上一级 | 不设置时，继承上一级的[ui](#ui属性).rowSpace
| labelWidth | 项label的宽度 | number | -- | 上一级 | 不设置时，继承上一级的[ui](#ui属性).labelWidth
| offsetLeft | 项的左边偏移量 | number | >=0 | 上一级 | 不设置时，继承上一级的[ui](#ui属性).offsetLeft
| offsetRight | 项的右边偏移量 | number | >=0 | 上一级 | 不设置时，继承上一级的[ui](#ui属性).offsetRight
| colon | label中是否有冒号 | boolean | -- | 上一级 | 不设置时，继承上一级的[ui](#ui属性).colon
| direction | 项的排版方向 | string | "h" "v" | 上一级 | 不设置时，继承上一级的[ui](#ui属性).direction
| hidden | 是否隐藏此项 | boolean | -- | true | 支持[es写法](./com-standard.md#es写法)、[函数写法](./com-standard.md#函数写法)
| hdValue | `hidden`或`祖先hidden`为true时有效 | -- | -- | -- | 值为`undefined`时：相应的字段不会取出<br />值为`null`时: 为正常遍历节点<br />`其余`: 取此值
| value | 组件的值 | -- | -- | -- |
| isTrim | 是否去掉两边的空格 | boolean | -- | true |
| col | 列数(宽度) | number | 1到24 | 24 | 一行分24列
| label | label设置 [写法](./label.md) | string/object | -- | false | false代表隐藏label
| rules | 规则设置 [写法](./rules.md) | object | -- | -- |
| format | 数值转换 [写法](./format.md) | array/object | -- | -- | 组件内有效
| component | 配置组件 [写法](./component.md) | string/object | -- | 全局 |
| group | 项与项进行分组 | string | -- | -- | 设置为分组，是`相邻`的；<br/>只对`component`有效，对`properties`是无效的
| unit | 对项进行补充 | string | -- | -- | 如：px；支持es或组件化<br/>支持[es写法](./com-standard.md#es写法)、[函数写法](./com-standard.md#函数写法)
| desc | 对项进行描述 | string | -- | 全局 | 支持[es写法](./com-standard.md#es写法)、[函数写法](./com-standard.md#函数写法)
| help | 对项设置帮助 [写法](./help.md) | string/object | -- | -- | 支持[es写法](./com-standard.md#es写法)、[函数写法](./com-standard.md#函数写法)
| array | properties或组件是数组，[写法](./array.md) | string/object | -- | -- | 
| isTmp | 临时值 | boolean | -- | false | 表单不输出此项值,但可作为表单内部使用
| layout | 布局 | object/string | "space" "tabs" or Object | false | `区分大小写`<br />`space`: 是一个占位符<br />`tabs`:下一级为tabs布局[写法](#layout属性)
| `properties` | 下一级 | object | -- | -- | 下一级，重复上面的配置
[schema的具体写法](./schema.md)

### ui属性

只有在properties中有效；主要是影响头部的样式和body的边距<br />
`（下面都是ui的属性，分为两部分是为了更好区别分类）`

- 1. ui属性>>界面设置

| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| showBody | 隐藏/打开切换按钮 | boolean | -- | -- | 不设置没有按钮；设置有按钮，此值代表最先是否显示body
| type | 整个块的布局类型 | string | `bg`, `block`, `bg-block` | -- | `block`就是前面有一竖
| hasBorder | 内容区是否有边框 | boolean | -- | false | --
| padding | 内容区的内边距 | number/string | -- | -- | `不设置`：根据实际情况调整<br/>`整数`：20 <br> `字符串`：'20px 10px', `数组`：[20, 10]

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


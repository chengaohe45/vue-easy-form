# schema配置

## 配置列表
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

## json一览表

schema就是一个json对象
```js
{
  autoMatch: false, // 非必填 一二级的数据自动匹配, 只在根节点中有效
  title: '表单名称', // 非必填 标题, properties(同组)要存在
  layout: '',     // 非必填。space: 是一个占位符; tabs: 下一级tabs布局, 详情见[表单开始/配置]
  ui: { // 非必填. 对properties界面的补充
    showBody: undefined,  // 此值有undefined, true, false
    type: undefined,      // 此值有undefined, bg, block, bg-block
    hasBorder: false,
    padding: undefined,   // 内容区的内边距

    // 以下的这几个值会被下一级继承（如name）
    direction: "v", // 非必填 类型：字符串; 值：v或h 横排还是竖排
    colon: false, // 非必填 是否有冒号，根节点默认为没有，其它的没有设置就会继承
    rowHeight: 40, // 非必填 整数（px） 每一行的高度
    rowSpace: 20, // 非必填 整数（px）与上一次行之间的间隔
    labelWidth: 120, // 非必填 整数（px） label的宽度
    offsetLeft: 0,    // 非必填 每一项左边留白的空间
    offsetRight: 0   // 非必填 每一项右边留白的空间
    
  },
  hidden: false, // 非必填，隐藏此项; 在根节点（最外级）中无效
  hdValue: undefined, //  非必填，隐藏项时的值; 在根节点（最外级）中无效
  isTmp: false, // 非必填 临时值; 在根节点（最外级）中无效
  label: false, // 非必填 项标签名; 在根节点（最外级）中无效
  properties: { // properties代表块，下面包含项
    name: {     // 这就一项
      // 在项中设置，只影响当前的项，也就是只影响name
      direction: "v", // 非必填值：v或h 横排还是竖排；不写就继承父类
      colon: false, // 非必填 是否有冒号，根节点默认为没有，其它的没有设置就会继承
      rowHeight: 40, // 非必填 整数（px） 每一行的高度
      rowSpace: 20, // 非必填 整数（px）与上一次行之间的间隔
      labelWidth: 120, // 非必填 整数（px） label的宽度
      offsetLeft: 0,    // 非必填 每一项左边留白的空间
      offsetRight: 0,   // 非必填 每一项右边留白的空间

      hidden: false, // 非必填 支持es语法; 是否隐藏此级，默认为显示
      hdValue: undefined, //  非必填 同上hdValue
      isTmp: false, // 非必填 临时值
      isTrim: false, // 非必填 是否去掉左右两边的空格，包括换行，默认为true
      col: 12,  // 非必填 每一个属性原则上是点一行的，一行分为24列，12就代表一半
      // label: "姓名", // 必填
      label: {
        text: "广告名称",
        flex: ""        // self or full 默认为没有设置，则label的长度将会是labelWidth
      },
      rules: { // 非必填
        required: true, //支持es语法; 
        emptyMsg: "代号不能为空", //当requred为true时有用
        checks: {
          trigger: "input", // 触发时机
          handler: (options) {  // 处理

          }
        },
        errMsg: "代号不能大于10"  //当check中的函数返回的值不是字符串（为false）时有效
      },
      //component: "el-input" // 非必填, 组件名, 不配置取全局默认的
      component: {  //标准写法
        name: "el-input",
        flex: "", // self or full
        props: {  // 组件需要的属性配置 全部属性(如type)支持es语法; 
          type: "password",
          placeholder: "请输入代号"
        },
        text: null,     // 非必填 一般用于文本显示：如<el-button>新建</el-button>
        ref: "testRef", // 非必填 组件索引
        actions: []    // 非必填 组件事件
      },
      value: '', // 非必填：此项的值；最好填写，用于默认值；默认为undefined
      // 字符串（如"g"可以是任意字符串），设置此值说明相邻的"同组"节点会排成一行，不换行; 
      group: "g", // 非必填; 在component项有效，在properties块中是无效的
      unit: "%",  // 非必填 字符串，对组件进行补充; 是对component的补充,对properties无效
      desc: "姓名必须这个样子", // 非必填 对此属性的描述
      help: "我就是要提示" //非必填
    },

    info: { // 这也是一项；只不过这项就是一个块（下一级）
      label: "当前项的标签名",
      title: "主题",
      //group: "分组在这里是无效的：因为是在块里面（properties），块不做分组",
      properties: { // 说明当前的项是一个块
        subname: {
          // ... 项的写法
        }
      }
    },

    aboutArray: {
      title: "...",
      // array: "array",  // 简写, 其余使用默认值
      array: {  // 有此值说明是一个动态数组，可添加、删除、排序
        name: "array",
        hasSort: true,  //是否有排序按钮，默认为true
        hasDelete: true,  //是否有删除按钮，默认为true
        hasCopy: false, //是否有拷贝按钮，默认为false
        hasAdd: true, //是否有添加按钮，默认为true
        min: 0,  //不写或小于等于0代表不限制
        max: 10,  //不写或小于等于0代表不限制
        hasOrder: true,  //是否有序号，默认为true
        hasDelWarn: true, // 是否有删除提示，默认为true
        fixed: 1,  //前几条是固定的，不可移动，也不可删除
        // headRequired值当name为array-table有效
        // 当设置为true时，“星号”在table头部显示，而不是在内容区随组件显示，默认为true;
        // 注意：当为true时，required的值不能受properties里面的属性影响
        headRequired: false
      }
      properties: {
        subname: {
          // ... 项的写法
        }
      }
    }
  }
}
```
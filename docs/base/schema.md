# 配置json一览表

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

[schema的配置详解](./settings.md)

## schema一览表

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

[schema的配置详解](./settings.md)
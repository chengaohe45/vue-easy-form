# 项组件/component

## 简写

component字段

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
  }
```

## 标准(组件化)写法

component字段

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        name: {
          label: "广告名称",
          component: {
            name: "el-input",
            props: {
              placeholder: "请输入广告名称"
            },
            // text: "新建",  // 一般用于文本显示：如<el-button>新建</el-button>
            // align: "left",      // left, center, right
            // ref: "testRef",   // 索引值，可以通过 form.getRef('testRef')取出
            // flex: "full",      // 这个一般用于分组
            // actions: []         // 见下面
          },
          value: "首页位置"
        }
      },
    };
  }
```
### flex值
- `''`： 默认为没有设置，component的长度根据自身情况自动取值
- `full`： 项中有多少点多少。此值一般用于component
- `self`： label的文本占多宽就多宽。此值一般用于label

## 组件事件

component.actions字段描述
```js
标准写法
actions: {
  // 默认为click, 多个事件写法: ["change", "input"]或"change input"
  trigger: "change",
  // options => {value, event, pathKey, index, idxChain,target}
  handler: function(options){...}
}

简写 （直接写成一个函数），trigger默认为click
actions: function(options){...}

多个事件
actions: [标准写法或简写组成的数组]
```

- `this`： handler函数的this指针指向表单，这样可以方便取出其它组件(如`this.getRef("xxxx")`)，从而做联动等功能


### 事件示例
```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        isGood: {
          label: "",    // 占位置，但不显示文字
          component: {
            name: "el-checkbox",
            text: "是否好人",
            actions: {
              trigger: "change",
              // options => {value, event, pathKey, index, idxChain,target}
              handler: function(options) {
                console.log("this对象: ", this);
                console.log('options: ', options);
              }
            }
          },
          value: true,
          col: 12
        },
        desc: {
          label: "es: {{$root}}.isGood ? '好人描述' : '描述'",
          component: {
            name: "el-input",
            props: {
              placeholder: "es: {{$root}}.isGood ? '好人描述要讲多点' : '一般描述啦'"
            },
            ref: "desc"
          },
          value: ""
        }
      },
    };
  }
```

handler => options包含的属性：
- `value`： 当前项组件的值，表单的值可以通过this取出
- `event`： 事件本身所携带的信息, 如keyup.native,可以从这里提取键值；若是$emit事件，则value等于event
- `target`： 当前项组件(若是`数组事件`，这个为`null`)
- `pathKey`： 需要检查的组件的路径
- `idxChain`： 需要检查的组件所要数组所组成的id 如: 1,2
- `index`：组件处于数组的子节点(非孙子)时的索引，其余的返回-1
> 注：[数组事件](./array.html#数组事件)是没有target信息的

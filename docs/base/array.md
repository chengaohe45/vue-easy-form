# 数组

属性array

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
          label: "名称",
          array: {
            name: "array-card",
            hasOrder: true,
            hasDelete: true,  // 是否有删除按钮，默认为true
            hasSort: false,   // 是否有排序按钮，默认为false
            hasAdd: true,     // 是否有添加按钮(下边的添加按钮)，默认为true
            hasCopy: true,    // 是否有拷贝添加按钮(每一行的添加按钮)，默认为false
            hasDelWarn: true,
            fixed: 1,       // 若第一条数据存在，则固定位置，不可移动
            max: 5,         // 不写或小于等于0代表不限制
            value: ["名称1", "名称2", "名称3"],   // 数组的默认值
            insertValue: function(options) {    // 插入(添加/拷贝)时对插入值的处理
              console.log(this.getValue(), options);
              return "1";
            },
            rules: true,  // 验证，跟平时一样的写法。trigger只有 input、change
            actions: {  // 事件，跟平时一样的写法。trigger只有 input、change
              trigger: "input",
              handler: function(options) {
                console.log("test array input2:", options);
              }
            },
            rowSpace: 20
          },
          component: {
            name: "el-input",
            props: {
              clearable: true,
              disabled: data => {
                // console.log("data: ", data);
                return data.index % 2 ? true : false;
              }
            },
            ref: "testRef"
          },
          // col: 15,
          value: "小明",
          rules: "es: {{$root}}.isRequired",
          // unit: "px",
          desc: "名称就是这样子",
          help: "帮助就是这样子"
        }
      },
    };
  },
```

## 配置属性

若array存在，说明是一个数组，具体配置如下：

| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| name | 哪种分组 | string/object | "array"、<br />"array-table"、<br />"array-tabs"、<br />"array-legend"、<br />"array-card"、<br />"array-tabs" | "array" | 
| hasSort | 是否有排序按钮 | boolean | -- | false | 
| hasDelete | 是否有删除按钮 | boolean | -- | true |
| hasAdd | 是否有添加按钮 | boolean | -- | true | 
| hasCopy | 是否有复制按钮 | boolean | -- | false | 
| fixed | 固定数量 | number | >=0 | 0 | 前几条是固定的，不可移动，也不可删除
| min | 最少多少条 | number | >=0 | 0 | 0 代表无限制
| max | 最多多少条 | number | >=0 | 0 | 0 代表无限制
| hasOrder | 可排序 | boolean | -- | true | --
| hasDelWarn | 删除提示 | boolean | -- | true | 删除时是否有提示
| headRequired | “星号”的位置 | boolean | -- | true | 当name为`array`无效，为`array-table`有效；<br />当设置为true时，“星号”在table头部显示，而不是在内容区随组件显示；<br />注意：required的值不能受properties里面的属性影响
| type | 头部类型 | string | `line`,<br />`card`,<br />`bg` | 'card' | `array-tabs`时有效
| rowSpace | 每一行的间隔 | number | >=0 | undefined | 当为`undefined`, 继承父类的rowSpace
| insertValue | 插入时的值 | function/其它的值 | -- | 添加或拷贝时各自的默认值 | 
| hasBorder | 是否有边框 | boolean | true/false | true |
| subLabel | tabs头部名称 | number | >=0 | 0 | `array-tabs` or `array-legend`时有效，其余情况无效; 支持es语法
| actions | 数组事件 | array/object | trigger只有:<br> input<br>change | -- | 跟[项组件事件写法](./component.html#组件事件)一样，就是返回信息少了`target`
| rules | 数组验证 | boolean/object | trigger只有:<br> input<br>change | -- | 跟[项组件验证写法](./rules.html)一样
| value | 数组的默认值 | array | -- | -- | --

### insertValue
当insertValue为函数时，insertValue(options)的`this`指向`表单`，返回值（不为undefined, undefined说明取各自的默认值）即为插入的值；参数options为一个对象，包含的信息为：
- `oldValues`： 插入前，当前数组的值
- `position`： 插入的位置，从0开始计算
- `type`： "copy" or "add"

## 数组事件

属性array.actions写法跟项组件事件一样，具体见[项组件事件](./component.html#组件事件)<br>
> 注：数组事件是没有target信息的，其trigger只有 input、change

## 数组验证

属性array.rules写法跟项组件验证一样，具体见[项组件验证](./rules.html)

## 数组[es写法](./com-standard.md#es写法)

如schema为：
```js
data() {
    return {
      formSchema: {
        // ...
        // 数组
        courses: {
          array: true,
          properties: {
            name: {   // pathKey: 当是第一个时，则是: courses[0].name, 如此类推
              col: 12,
              label: "学科名",
              component: "el-input",
              value: "语文"
            },
            code: { // pathKey: 当是第一个时，则是: courses[0].code, 如此类推
              value: "100",
              col: 12,
              label: "学科代号",
              component: {
                name: "el-input",
                props: {
                  placeholder: "学科名有值我才可写",
                  // [i]代表当前行，必须写在大括号内
                  disabled: "es: !{{$root.courses[i].name}}"
                }
              }
            }
          }
        }

      }
    };
  }
```
>在es写法中，`[i]`是一个固定的写法，它代表当前的行，运行时会用[索引链(idxChain)](./explain.md#索引链)进行代替. <br/>若孩(孙)子节点也为数组，也是用`[i]`, <br/>如：<span v-pre>`es: !{{$root.courses[i].students[i].name}}`</span>
::: warning
`[i]`必须写在大括号内
:::

[schema的具体写法](./schema.md)

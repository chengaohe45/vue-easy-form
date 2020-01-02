# 数组

字段（见`行高亮`）：
```js {4,33}
propName: {
  label: false,   // 块properties的label一般都设置为false
  title: "标题",
  array: {  // 以下是array设置：块项作为数组
    name: "array-tabs",   // 数组类型
    hasOrder: true,   // 是否有序号
    hasDelete: true,  // 是否有删除按钮，默认为true
    hasSort: false,   // 是否有排序按钮，默认为false
    hasAdd: true,     // 是否有添加按钮(下边的添加按钮)，默认为true
    hasCopy: true,    // 是否有拷贝添加按钮(每一行的添加按钮)，默认为false
    hasDelWarn: true, // 是否有删除提示
    fixed: 1,         // 若第一条数据存在，则固定位置，不可移动
    max: 5,           // 不写或小于等于0代表不限制
    value: [{name: "小天"}],   // 数组的默认值
    insertValue: function(options) {    // 插入(添加/拷贝)时对插入值的处理
      console.log(this.getValue(), options);
      return {name: "小天"};
    },
    rules: true,  // 验证，跟平时一样的写法。trigger只有 input、change
    actions: {    // 事件，跟平时一样的写法。trigger只有 input、change
      trigger: "input",
      handler: function(options) {
        console.log("test array input:", options);
      }
    },
    rowSpace: 20
  },
  properties: {
    name: {
      label: "名称",
      component: "el-input",
      value: "天天",
      array: "array-card"   // 组件项作为数组
    }
    // ... 其它项
  }
}
```

### 实例1
功能：`行数组`、`列表数组`、`insertValue`、`动态解析`

<ClientOnly>
  <demo-block>

  ```html
  <es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>

  <script>
    export default {
      data() {
        return {

          formValue: {},

          formSchema: {
            ui: {
              colon: true,
              rowSpace: 20
            },
            properties: {
              
              name: {
                label: "我的姓名",
                component: "el-input",
                value: "小明"
              },

              // 行数组
              courses: {
                title: "我的课程",
                label: false,
                ui: {
                  rowHeight: 32,
                  labelWidth: 80
                },
                array: {  // 数组配置
                  name: "array",
                  hasOrder: false,
                  hasDelete: true,
                  hasSort: true,
                  hasAdd: true,
                  hasCopy: true,
                  hasDelWarn: true,
                  hasAdd: true,
                  rowSpace: 12,
                  value: [
                    { subject: "语文", code: "1" },
                    { subject: "数学", code: "2" }
                  ],
                  insertValue: function(options) {    // 插入(添加/拷贝)时对插入值的处理
                    if (options.type === "copy") {  // 只做拷贝
                      var targetValue = options.oldValues[options.position - 1];
                      targetValue.subject = "拷贝后的修改值";
                      return targetValue;
                    }
                  }
                },

                properties: {
                  subject: {
                    value: "默认名",
                    col: 12,
                    label: "学科名",
                    component: {
                      name: "el-input",
                      props: {
                        size: "small"
                      }
                    }
                  },
                  code: {
                    col: 12,
                    label: "代号",
                    component: {
                      name: "el-input",
                      props: {
                        disabled: "es:!{{$root.courses[i].subject}}", // 动态解析: 注意[i]在大括号里面
                        size: "small"
                      }
                    },
                    value: "默认代号"
                  }
                }
              },

              // table数组
              experiences: {
                title: "求学经历",
                label: false,
                ui: {
                  rowHeight: 32
                },
                array: {  // 数组配置
                  name: "array-table",
                  // hasOrder: true,
                  // hasDelete: true,
                  hasSort: true,
                  hasAdd: true,
                  // hasCopy: true,
                  hasDelWarn: false,
                  // hasAdd: false,
                  fixed: 1,
                  min: 2,
                  max: 5,
                  headRequired: true,
                  value: [
                    { school: "四中", address: "广州" },
                    { school: "交大", address: "上海" },
                    { school: "清华", address: "北京" }
                  ]
                },

                properties: {
                  school: {
                    col: 8,
                    label: {
                      name: "div",
                      text: "学校名",
                      align: "left"
                    },
                    component: {
                      name: "el-input",
                      props: {
                        size: "small"
                      }
                    },
                    rules: {
                      required: true,
                      emptyMsg: "请输入学校名"
                    },
                    help: {
                      hidden: "es: {{$index}} !== 0",
                      props: {
                        content: "我在外面-演示帮助: 第1条固定（fixed为1）"
                      }
                    },
                    value: "默认名"
                  },
                  address: {
                    col: 12,
                    label: {
                      text: "地址",
                      help: "我在label里面：代号"
                    },
                    component: {
                      name: "el-input",
                      props: {
                        size: "small"
                      }
                    },
                    value: "默认地址"
                  }
                },
                desc: "提示： 最多只能添加5条数据"
              }

            }
          }
        };
      }
    };
  </script>
  ```
  </demo-block>
</ClientOnly>

### 实例2
功能：`tabs数组`、`legend数组`、`卡片数组`、`subLabel`、`动态解析`

<ClientOnly>
  <demo-block>

  ```html
  <es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>

  <script>
    export default {
      data() {
        return {

          formValue: {},

          formSchema: {
            ui: {
              colon: true,
              rowSpace: 20
            },
            properties: {
              
              name: {
                label: "我的姓名",
                component: "el-input",
                value: "小明"
              },

              // legend数组
              classmates: {
                title: "我的同学",
                label: false,
                ui: {
                  rowHeight: 32,
                  labelWidth: 80,
                  rowSpace: 12,
                  offsetRight: 130
                },
                array: {  // 数组配置
                  name: "array-legend",
                  hasOrder: false,
                  hasDelete: true,
                  hasSort: true,
                  hasAdd: true,
                  hasCopy: true,
                  hasDelWarn: true,
                  hasAdd: true,
                  rowSpace: 12,
                  value: [
                    { name: "大宝", code: "1" },
                    { name: "小宝", code: "2" }
                  ],
                  insertValue: function(options) {    // 插入(添加/拷贝)时对插入值的处理
                    if (options.type === "copy") {  // 只做拷贝
                      var targetValue = options.oldValues[options.position - 1];
                      targetValue.name = "拷贝后的修改值";
                      return targetValue;
                    }
                  }
                },

                properties: {
                  name: {
                    value: "默认名",
                    col: 24,
                    label: "同学名",
                    component: {
                      name: "el-input",
                      props: {
                        size: "small"
                      }
                    }
                  },
                  code: {
                    col: 24,
                    label: "学号",
                    component: {
                      name: "el-input",
                      props: {
                        disabled: "es:!{{$root.classmates[i].name}}", // 动态解析: 注意[i]在大括号里面
                        size: "small"
                      }
                    },
                    value: "默认代号"
                  }
                }
              },

              // tabs数组
              teachers: {
                title: "我的老师",
                label: false,
                ui: {
                  rowHeight: 32
                },
                array: {  // 数组配置
                  name: "array-tabs",
                  hasOrder: false,
                  // hasDelete: true,
                  hasSort: true,
                  hasAdd: true,
                  // hasCopy: true,
                  hasDelWarn: true,
                  // hasAdd: false,
                  fixed: 1,
                  min: 2,
                  max: 10,
                  subLabel: "es: '老师' + ({{$index}}  + 1)",
                  value: [
                    { name: "高老师", address: "广州" },
                    { name: "文老师", address: "北京" },
                    { name: "邵老师", address: "深圳" }
                  ]
                },

                properties: {
                  name: {
                    col: 12,
                    label: "名称",
                    component: {
                      name: "el-input",
                      props: {
                        size: "small"
                      }
                    },
                    rules: {
                      required: true,
                      emptyMsg: "请输入名称"
                    },
                    value: "默认名"
                  },
                  address: {
                    col: 12,
                    label: "地址",
                    component: {
                      name: "el-input",
                      props: {
                        size: "small"
                      }
                    },
                    value: "默认地址"
                  }
                },
                desc: "提示： 最多只能添加10条数据"
              },

              // 卡片数组
              works: {
                label: "我的作品集",
                array: {  // 数组配置
                  name: "array-card",
                  hasOrder: true,
                  hasDelete: true,
                  hasSort: true,
                  hasAdd: false,
                  hasCopy: false,
                  hasDelWarn: false,
                  min: 1,
                  // max: 5,
                  value: [
                    "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg", 
                    "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg", 
                    "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg"
                  ],
                  rowSpace: 20
                },
                component: {
                  name: "el-image",
                  style: {width: "100px", height: "100px"},
                  props: {
                    lazy: true,
                    fit: "cover",
                    // 使用本身的值
                    src: "es: {{$root.works[i]}}"   // 动态解析: 注意[i]在大括号里面
                  }
                },
                value: "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
                desc: "我是一个组件项数组"
              }

            }
          }
        };
      }
    };
  </script>
  ```
  </demo-block>
</ClientOnly>


### 默认插入值
字段：array.insertValue
1. 类型为`函数`时：即可动态根据实际情况修改输出默认值。insertValue(options)的`this`指向`表单`；当函数的返回值不为`undefined`时，即为插入的值，若为`undefined`，则说明取各自的默认值（如：copy时则取copy的那一行的值）<br/>
  `参数options`：为一个对象，包含的信息如下：
    - `oldValues`： 插入前，当前数组的值
    - `position`： 插入的位置，从0开始计算
    - `type`： "copy" or "add"
2. 类型为`其它的值`时：即插入固定值

### 数组事件

属性array.actions写法跟项组件事件一样，具体见[项组件事件](./component.html#组件事件)<br>
> 注：数组事件是没有target信息的，其trigger只有 input、change

### 数组验证

属性array.rules写法跟项组件验证一样，具体见[项组件验证](./rules.html)

### 数组es写法

见实例

> 在`数组es写法`中，`[i]`是一个固定的写法，它代表当前的行，运行时会用[索引链(idxChain)](./explain.md#索引链)进行代替. <br/>若孩(孙)子节点也为数组，也是用`[i]`, <br/>如：<span v-pre>`es: !{{$root.courses[i].students[i].name}}`</span>
::: warning 注意
`[i]`必须写在大括号内
:::

（普通的）[es写法](./com-standard.md#es写法)

### 配置属性

若array存在，说明是一个数组，具体配置如下：

| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| name | 哪种分组 | string/object | "array"<br /><span style="white-space:nowrap">"array-table"</span><br /><span style="white-space:nowrap">"array-tabs"</span><br /><span style="white-space:nowrap">"array-legend"</span><br /><span style="white-space:nowrap">"array-card"</span> | "array" | "array-table"不支持组件项（叶子节点）<br />"array-card"只支持组件项（叶子节点）
| hasSort | 是否有排序按钮 | boolean | -- | false | 
| hasDelete | 是否有删除按钮 | boolean | -- | true |
| hasAdd | 是否有添加按钮 | boolean | -- | true | 
| hasCopy | 是否有复制按钮 | boolean | -- | false | array-tabs不支持拷贝功能
| fixed | 固定数量 | number | >=0 | 0 | 前几条是固定的，不可移动，也不可删除
| min | 最少多少条 | number | >=0 | 0 | 0 代表无限制
| max | 最多多少条 | number | >=0 | 0 | 0 代表无限制；<br/>大于min
| minMsg | 小于最小条数时提示 | string | -- | `长度不能小于(min)` | min>0时有效
| maxMsg | 大于最小条数时提示 | string | -- | `长度不能大于(max)` | max>0时有效
| hasOrder | 是否有序号 | boolean | -- | true | --
| hasDelWarn | 删除提示 | boolean | -- | true | 删除时是否有提示
| headRequired | “星号”的位置 | boolean | -- | true | 只在`array-table`有效；<br />当设置为true时，“星号”在table头部显示，而不是在内容区随组件显示
| type | 头部类型 | string | `line`,<br />`card`,<br />`bg` | 'card' | `array-tabs`时有效；效果跟[tabs布局](./tabs.md)一样
| rowSpace | 每一行的间隔 | number | >=0 | undefined | 当为`undefined`, 继承父类的rowSpace
| insertValue | 插入时的值 | function/其它的值 | -- | 添加或拷贝时各自的默认值 | 
| hasBorder | 是否有边框 | boolean | true/false | true |
| subLabel | tabs头部名称 | number | >=0 | 0 | <span style="white-space:nowrap">`array-tab`</span>和<span style="white-space:nowrap">`array-legend`</span>时有效，其余情况无效; 支持[组件化](./com-format.md)和[动态解析](./com-standard.md)
| actions | 数组事件 | array/object | trigger只有:<br> input<br>change | -- | 跟[项组件事件写法](./component.html#组件事件)一样，就是返回信息少了`target`
| rules | 数组验证 | boolean/object | trigger只有:<br> input<br>change | -- | 跟[项组件验证写法](./rules.html)一样
| value | 数组的默认值 | array | -- | -- | --


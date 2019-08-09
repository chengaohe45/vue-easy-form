# 表单值/value

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```
```js
data() {
    return {

      formValue: {},

      formSchema: {
        // 组件项
        name: {       // pathKey: name
          label: "广告名称",
          component: "el-input",
          value: "首页位置"
        },

        // 组件块
        base: {
          title: {
            text: "基本信息"
          },
          label: false,
          properties: {
            startTime: {    // pathKey: base.startTime
              label: "上线时间",
              col: 12,
              component: "el-input",
              value: ""
            },
            endTime: {    // pathKey: base.endTime
              label: "到",
              col: 12,
              component: "el-input",
              value: ""
            }
          }
        },

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
              component: "el-input"
            }
          }
        }

      }
    };
  }
```
>[pathKey:项组件路径](./explain.md#项组件路径)的组成形式：各个块(properties)中的属性(如name, base)连接起来形式唯一的字符路径

## 设值
有两种方式设置([具体实例](https://chengaohe45.github.io/vue-easy-form-docs/demo/#/value))：
- `formValue`: 表单非深度监听此值，若要通过此值设置表单值，必须重新改变此变量的地址(`不推荐`)
- `form.setValue(key, value)`: 表单设置值(`推荐`)

如：
```js
// setValue参数只有一个对象，则一次性设置多个值
// 设置多个值：只设置所要设置的key, 如endTime是不会改变的
form.setValue({     // 多值设置
  name: "广告名称", 
  base: {
    startTime: "2015/02/03"
    }
  });

// setValue参数有两个，单设置某项的值
form.setValue("base.startTime", "2015/02/03");  // 单值设置
```

## 取值
取出的值为一个对象，有两种方式取出：

- `formValue`: v-model双向绑定(Vue机制，非实时)
- `form.getValue()`: 表单输出的值(setValue过后，可即时取出，实时)<br />
注：若想取`某个项`的值，可从上值中解析
<br />
<br />
<br />
表单的根值
- `form.getRootData()`: 表单的根(原始)值(setValue过后，可即时取出，实时)

## 值转换
字段format；[具体实例](https://chengaohe45.github.io/vue-easy-form-docs/demo/#/format)<br/>
控制入值和输出值的转换; 场景：当外部值不是表单所需要的数据或类型时（`比如：el-switch的值是一个boolean值，但是后台保存的是0/1`），此时就需要做转换<br/>
值转换有两种形式写法：
- `枚举`： (推荐)
- `函数`： ---

### 枚举写法

写成一个数组，format的每一项的属性`outer`和`inner`是成对出现的。

- `outer`: 外部值
- `inner`: 对应的表单内部值

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        status: {
          label: "状态",
          component: {
            name: "el-switch"
          },
          format: [
            {
              outer: 0,   // 外部值
              inner: false  // 转化为对应的内部值
            },
            {
              outer: 1,   // 外部值
              inner: true // 转化为对应的内部值
            }
          ],
          value: true
        }
      },
    };
  },
```

### 函数写法

写成一个对象，format中包含两个属性`outer`和`inner`，这两个属性是一个函数，至少写一个。
- `outer`: 外部数据转换为表单内部数据的函数，参数value就是外部值
- `inner`: 表单内部数据转换为外部数据的函数，参数value就是内部值

::: warning
`inner` 所值入的参数value就是表单组件的值，这个值要进行健壮性判断。比如: 表单组件有值的情况返回一个数组，没有值的情况返回一个空数组，也有可能返回null值，主要是看组件怎么实现。
:::

```js
data() {
    return {
      formValue: {
        // name: "默认小花"
      },
      formSchema: {
        status: {
          label: "状态",
          component: {
            name: "el-switch"
          },
          format: {
            outer: (value) => {   // 外部传入来时的转换函数。value:外部值
              if (value == 0) {
                return false;
              } else {
                return true;
              }
            },
            inner: (value) => {   // 内部输出时的转换函数。value:内部值
              if (value == true) {
                return 1;
              } else {
                return 0;
              }
            }
          },
          value: true
      },
    };
  },
```


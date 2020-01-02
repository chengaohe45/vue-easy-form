# 表单值

字段（见`行高亮`）：
```js {7,8}
propName: {
  label: "label值", 
  properties: {
    name: {
      label: "名称",
      component: "el-input",
      isTrim: true,   // 是否去掉值两边空间
      value: "天天"   // 默认值。重置时也用到此值
    }
    // ... 其它项
  }
}
```
### 实例
<ClientOnly>
  <demo-block :canOperate="true">

  ```html
  <es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>

  <script>
    export default {
      data() {
        return {

          formValue: {},

          formSchema: {
            // 组件项
            name: {       // pathKey: name
              label: "广告名称",
              component: "el-input",
              value: "",
              rules: true
            },

            // 组件块
            base: {
              title: "基本信息",
              label: false,
              properties: {
                backgroundColor: {    // pathKey: base.backgroundColor
                  label: "背景颜色",
                  component: "el-color-picker",
                  value: "#409EFF"
                },
                fontColor: {    // pathKey: base.fontColor
                  label: "字体颜色",
                  component: "el-color-picker",
                  value: null
                }
              }
            },

            // 数组
            courses: {
              array: {
                value: [
                  {
                    name: "语文",
                    code: "123"
                  }
                ]
              },
              title: "我的课程",
              properties: {
                name: {   // pathKey: 当是第一个时，则是: courses[0].name, 如此类推
                  col: 12,
                  label: "学科名",
                  component: "el-input",
                  value: "默认值"
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
    };
  </script>
  ```
  </demo-block>
</ClientOnly>

>[pathKey:项组件路径](./explain.md#项组件路径)的组成形式：各个块(properties)中的属性(如name, base)连接起来形式唯一的字符路径

### 设值
有两种方式设置：
- `formValue`: 表单非深度监听此值，若要通过此值设置表单值，必须重新改变此变量的地址(`不推荐`)
- `form.setValue(key, value)`: 表单设置值(`推荐`)

如：
```js
// setValue参数只有一个对象，则一次性设置多个值
// 设置多个值：只设置所要设置的key, 如endTime是不会改变的
form.setValue({     // 多值设置
  name: "广告名称", 
  base: {
    backgroundColor: "#f00"
    }
  });

// setValue参数有两个，单设置某项的值
form.setValue("base.backgroundColor", "#f00");  // 单值设置
```

### 取值
取出的值为一个对象，有两种方式取出：

- `formValue`: v-model双向绑定(Vue机制，非实时)
- [`form.getValue()`](./form.md#表单方法): 表单输出的值([setValue](./form.md#表单方法)过后，可即时取出，实时)<br />
注：若想取`某个项`的值，可从上值中解析
<br />
<br />
表单的[根值](./explain.md#根值)
- [`form.getRootData()`](./form.md#表单方法): 表单的根(原始)值([setValue](./form.md#表单方法)过后，可即时取出，实时)

### 去掉两边的空格/isTrim
1. 当isTrim不设置时，系统会根据全局设置的[trimDoms](./install.md#全局设置)来判断组件是否去掉空格；
2. isTrim触发的时机为change.native或者change，也就是`输入框改变，光标离开输入框时`才会触发；
3. 直接设置值([setValue](./form.md#表单方法))是不会触发change.native或者change。
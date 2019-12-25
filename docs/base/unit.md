# 单位/unit

字段：`unit`<br/>
值类型有：
- `string`： 补充的内容；支持[动态解析](./com-standard.md)
- `object`： 一个对象，见[组件写法](./com-format.md)

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

## 写法

<ClientOnly>
  <demo-block>

  ```html
    <script>
      export default {
        data() {
          return {

            formValue: {},

            formSchema: {
              // 写法一
              age: {
                label: "年龄",
                col: 12,
                component: {
                  name: "el-input-number",
                  flex: "full"
                },
                value: 15,
                unit: "岁"    // 也可以直接写动态解析，如es语句
              },

              // 写法二
              esUnit: {
                label: "切换单位",
                component: {
                  name: "el-slider",
                  props: {
                    min: 10,
                    max: 99
                  }
                },
                value: 50,
                unit: {
                  // hidden: false,   // 控制unit是否隐藏，支持动态解析
                  text: "es: '单位' + {{$root.esUnit}}"
                }
              },

              // 写法三：组件写法
              // comUnit: {
              //   label: "组件方法",
              //   component: {
              //     name: "el-slider",
              //     props: {
              //       min: 10,
              //       max: 99
              //     }
              //   },
              //   value: 80,
              //   unit: {
              //     // hidden: false, // 控制unit是否隐藏，支持动态解析
              //     name: unit,
              //     props: {
              //       num: "es: {{$root.comUnit}}"
              //     }
              //   }
              // }
            }
          };
        }
      };
    </script>
  ```
  </demo-block>
</ClientOnly>


# Quick Start

### demo
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

## Standard Writing

The standard form configuration starts from an object, which contains a key of `properties`, and some basic configuration (such as ui) that affects the form can be set in the same level of each layer of `properties`.

<ClientOnly>
  <demo-block :open="true">

  ```html
  <script>
    export default {
      data() {
        return {

          formValue: {},

          formSchema: {   // 从一个对象开始，里面包含一个properties
            // 第一级ui在应用过程中一般都不会配置，基本都是使用全局配置(全局配置在esForm注册时设置)
            ui: { // 块（properties）的ui配置；非必填，不写会继承全局的配置；这些配置也会被下一级继承
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
              name: {
                label: "名称",
                component: "el-input",
                value: "天天"
              },
              baseInfo: {
                
                properties: { // 下一层级(第二层级)：properties理论上可以无限级下去
                  age: {
                    label: "年龄",
                    component: "el-input-number",
                    value: 18
                  },
                  score: {
                    label: "得分",
                    component: "el-rate",
                    value: 4,
                    rowHeight: 20, // 覆盖上一级的ui.rowHeight(若没有ui就往上取，直到全局)
                  }
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

## Simple Writing

When the basic configuration of the form has been completed, there is no need for personalized settings, you can write a simple wording, omit the `properties` layer, and directly enter the form `properties`

<ClientOnly>
  <demo-block :open="true">

  ```html
  <script>
    export default {
      data() {
        return {

          formValue: {},

          formSchema: { // 从一个对象开始，省略第一层级的properties，只写其里面的属性
            name: {
              label: "名称",
              component: "el-input",
              value: "首页位置"
            },
            baseInfo: {
              // rowSpace: 30, // 覆盖上一级的ui.rowSpace(若没有ui就往上取，直到全局)
              properties: { // 下一层级(第二层级)：properties理论上可以无限级下去
                age: {
                  label: "年龄",
                  component: "el-input-number",
                  value: 18
                },
                score: {
                  label: "得分",
                  component: "el-rate",
                  value: 4,
                  rowHeight: 20, // 覆盖上一级的ui.rowHeight(若没有ui就往上取，直到全局)
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




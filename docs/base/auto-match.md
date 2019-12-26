# 自动匹配
- `autoMatch`： `true`

`自动匹配就是把所有的二级的项在输出时提升为一级。`
应用场景：一般用于表单结构和接口字段不一致时匹配。比如：现需要保存一个页面信息，后台需要保存接口的字段只需要一级{pageName, fontSize, fontColor, backgroundImage, backgroundColor), 但对产品设计来说，可能需要把字体和背景按各自模块区分，页面结构才更加清晰。（见[自动匹配实例](https://chengaohe45.github.io/vue-easy-form-docs/demo/#/auto-match)）

### 实例
可打开`调试面版`查看输出结果，`formValue`全部都平级了

<ClientOnly>
  <demo-block :open="true">

  ```html
  <es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>

  <script>
    export default {
      data() {
        return {

          formValue: {},

          formSchema: {
            autoMatch: true,    // 设置autoMatch为true
            properties: {
              pageName: "页面名称",
              font: {
                title: {
                  text: "字体信息"
                },
                label: false,
                properties: { // autoMatch为true, 这一级(fontSize、fontColor)将提升
                  fontSize: {
                    label: "字体大小",
                    component: "el-input-number",
                    value: 14
                  },
                  fontColor: {
                    label: "字体颜色",
                    component: "el-color-picker",
                    value: "#67C23A"
                  }
                }
              },
              background: {
                title: "背景信息",
                label: false,
                properties: { // autoMatch为true, 这一级(backgroundImage、backgroundColor)将提升
                  backgroundImage: {
                    label: "背景图片",
                    component: "el-input",
                    value: ""
                  },
                  backgroundColor: {
                    label: "背景颜色",
                    component: "el-color-picker",
                    value: "#3AABC2"
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

::: warning 注意
- autoMatch设置只能在根节点中设置，其它块是无效的；
- 自动匹配只影响一级和二级的表单值输出，对根值rootData没有影响；
- 因为输出表单值时，二级要提升为一级，为了保持key的唯一性，编写schema时，一级和二级的所有的key（如：pageName、font、background、fontSize、backgroundImage）不能相同。
:::

### 设值

在自动匹配中，因为key是唯一的，下面的值的设置效果是一样的：<br />
如：
```js
form.setValue({     // 正常结构
  font: {
    fontSize: 12
    }
  });

form.setValue({     // 简化结构
  fontSize: 12
  });

form.setValue("font.fontSize", 12);  // 正常结构
form.setValue("fontSize", 12);  // 简化结构
```

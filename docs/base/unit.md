# 单位/unit

字段：`unit`<br/>
值类型有：
- `string`： 补充的内容；支持[动态解析](./parse.md)
- `object`： 一个对象，见[组件格式](./com-format.md)

<style lang="scss">
.demo-block {
  /* .es-form .es-form-unit {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
  } */

  .el-slider {
    margin-left: 12px;
    margin-right: 12px;
  }
}
</style>

### 实例

<ClientOnly>
  <demo-block hash="#/unit">

  ```html
    <es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>

    <script>
      export default {
        data() {
          return {

            formValue: {},

            formSchema: {
              // 写法一
              birthYear: {
                label: "出生年份",
                col: 12,
                component: {
                  name: "el-date-picker",
                  props: {
                    type: "year",
                    valueFormat: "yyyy"
                  },
                  flex: "full"
                },
                value: "2000",
                unit: "年"
              },

              // 写法二
              esUnit: {
                label: "es方法",
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
              comUnit: {
                label: "组件方法",
                component: {
                  name: "el-slider",
                  props: {
                    min: 10,
                    max: 99
                  }
                },
                value: 80,
                unit: {
                  // hidden: false, // 控制unit是否隐藏，支持动态解析
                  name: "g-unit", // g-unit是自定义全局组件；也可以是import导入的局部组件
                  props: {
                    num: "es: {{$root.comUnit}}"
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

### 组件详解

| 属性名 | 说明 | 类型 | 可选值| 默认值
| -- | -- | -- | -- | -- 
| hidden | 控制组件是否隐藏, 支持[动态解析](./parse.md) | boolean | -- | false
| 其它 | 跟[组件格式](./com-format.md)一样 | -- | -- | --

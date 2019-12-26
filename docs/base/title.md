# 标题/title

字段：`title`，就是块(properties)的标题, 它在properties(同级)才有效

值类型有：
- `false`： 默认值，没有标题
- `string`： 标题；支持[动态解析](./com-standard.md)
- `object`： 一个对象，见[组件写法](./com-format.md)

### 实例
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
            name: {
              label: "页面名称",
              component: "el-input",
              value: "首页位置"
            },

            // 写法一
            base: {
              // title: "背景信息", // 也可以直接写动态解析，如es语句；这句等价于下面
              title: {
                // hidden: false, // 控制title文本是否隐藏，支持动态解析
                text: "背景信息"
              },
              label: false,
              properties: {
                image: {
                  label: "背景图片",
                  component: "el-input",
                  value: ""
                },
                color: {
                  label: "背景颜色",
                  component: "el-color-picker",
                  value: "#269520"
                }
              }
            },

            // 写法二：组件写法
            more: {
              ui: {
                showBody: true,
                hasBorder: true,
                padding: 20,
                rowSpace: 10,
                type: "bg-block"
              },
              title: {
                // hidden: false, // 控制title是否隐藏，支持动态解析
                name: "span", // 可以为自定义的组件
                props: {},
                text: "自定义-组件化写法",
                help: "我在title里面"
              },
              label: false,
              properties: {
                whitelist: {
                  label: "白名单",
                  component: {
                    name: "el-input"
                  },
                  value: "xiaoming.lo"
                },
                note: {
                  label: "备注",
                  component: {
                    name: "el-input"
                  },
                  value: "备注就是这么简单"
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
| hidden | 控制组件是否隐藏, 支持[动态解析](./com-standard.md) | boolean | -- | false
| 其它 | 跟[组件写法](./com-format.md)一样 | -- | -- | --

title和[ui属性](./settings.md#ui属性)都只有在properties中有效


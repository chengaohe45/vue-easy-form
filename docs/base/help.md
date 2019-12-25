
# 帮助/help

字段：`help`<br/>
值类型有：
- `string`： 提示的内容，支持html；会直接调用系统默认的help组件；支持[动态解析](./com-standard.md)
- `object`： 一个对象，见[组件写法](./com-format.md)

## 实例
```html
<es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>
```

## 写法/位置
<ClientOnly>
  <demo-block>

  ```html
  <script>
    export default {
      data() {
        return {

          formValue: {},

          formSchema: {

            // 位置一：在项组件后面
            // 下面的简写形式，会自动匹配系统help组件
            name: {
              label: "广告名称",
              component: "el-input",
              value: "首页位置",
              help: "提示的内容" // 也可以直接写动态解析，如es语句
            },

            // 位置二：在项label后面
            // 下面是系统help组件的写法，不要写name
            duration: {
              label: {
                text: "活动时间",
                help: {
                  // hidden: false, // 是否隐藏help
                  // name: "",   // 不用写这个，系统会自动采用默认的help
                  props: {
                    content: "我在label里面", // 提示的内容，支持html
                    maxWidth: 200, // mouseover pop提示框的宽度
                    href: "http://www.qq.com", // 配置这个就个跳转
                    placement: "top" // pop的方向
                  }
                }
              },
              component: {
                name: "el-date-picker",
                props: {
                  type: "datetimerange",
                  rangeSeparator: "至",
                  startPlaceholder: "开始日期",
                  endPlaceholder: "结束日期",
                  valueFormat: "yyyy-MM-dd"
                },
                flex: "full"
              },
              value: [],
              col: 20
            },

            // 位置三：在title文字后面
            // 下面自定义help组件
            district: {
              ui: {
                type: "bg-block",
                rowSpace: 10,
                hasBorder: true
              },
              title: {
                // hidden: false, // 是否隐藏title
                text: "投放地区",
                help: {
                  // hidden: false, // 是否隐藏help
                  name: "g-help", // 这个就是自定义的帮助组件
                  props: {
                    // 组件的属性
                    content: "我在title里面：这个是自定义的help",
                    href: "http://www.qq.com"
                  }
                }
              },
              label: false,
              properties: {
                province: {
                  label: "省份",
                  component: {
                    name: "el-input"
                  },
                  value: "广东省"
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


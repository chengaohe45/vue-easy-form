# 项标签/label

字段：`label`<br/>
值类型有：
- `false`： 默认值，label隐藏，空间不存在的
- `''`： 空值 但label空间是存在的
- `string`： 项label文字；支持[动态解析](./parse.md)
- `object`： 一个对象，见[组件格式](./com-format.md)

### 实例
<ClientOnly>
  <demo-block hash="#/label">

  ```html
  <es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>

  <script>
    export default {
      data() {
        return {

          formValue: {},

          formSchema: {
            // 写法一
            name: "广告名称", // 直接写在属性上，component将会取系统默认的

            // 写法二
            isOpen: {
              label: "状态", // 直接写label，相当于label: {text: "状态"}
              component: "el-switch",
              value: true
            },

            // 写法三
            esLabel: {
              label: "es: {{$root}}.isOpen ? '广告标签(开)' : '广告标签(关)'", // es写法
              component: {
                name: "el-input",
                props: {
                  placeholder: "切换开关试试: es写法"
                }
              },
              rules: true,
              value: ""
            },

            // 写法四：text写法, 没有name
            textLabel: {
              colon: true, // 冒号
              label: {
                hidden: "es: !{{$root}}.isOpen", // 控制label是否隐藏
                text: "text写法",
                help: {
                  // label中的帮助
                  // hidden: "es: !{{$root}}.isOpen", // 控制help是否隐藏
                  props: {
                    content: "我在label里面"
                  }
                }
              },
              component: {
                name: "el-input",
                props: {
                  placeholder:
                    "es: {{$root}}.isOpen ? '切换开关试试: label显示' : '切换开关试试: label隐藏'"
                }
              },
              value: ""
            },

            // 写法五：组件写法
            comLabel: {
              label: {
                name: "g-label", // g-label是自定义全局组件；也可以是import导入的局部组件
                props: {
                  color: "es: {{$root}}.isOpen ? '' : '#909399'"
                }
              },
              component: "el-input",
              value: ""
            },

            // 以下是其它属性，见注释
            spaceLabel: {
              label: "", // label设置为空, 说明是占空间位置
              component: {
                name: "el-input",
                props: {
                  placeholder: "label设置为空, 说明是占空间位置"
                }
              },
              value: ""
            },

            falseLabel: {
              label: false, // label设置为false, 说明是不占空间位置
              component: {
                name: "el-input",
                props: {
                  placeholder: "label设置为false, 说明是不占空间位置"
                }
              },
              value: ""
            },

            alignLabel1: {
              label: {
                text: "左",
                align: "left" // 文本靠左
              },
              col: 8,
              direction: "v", // 上下排版
              offsetRight: 4, // 项右边偏移量
              component: {
                name: "el-input",
                props: {
                  placeholder: "label设置了align=left"
                }
              },
              value: ""
            },

            alignLabel2: {
              label: {
                text: "中",
                align: "center", // 文本居中
                help: {
                  hidden: "es:!{{$root}}.isOpen",
                  props: {
                    content: "我在label里面"
                  }
                }
              },
              col: 8,
              direction: "v", // 上下排版
              offsetLeft: 2, // 项左边偏移量
              offsetRight: 2, // 项右边偏移量
              component: {
                name: "el-input",
                props: {
                  placeholder: "label设置了align=center"
                }
              },
              value: ""
            },
            alignLabel3: {
              label: {
                text: "右",
                align: "right" // 文本靠右
              },
              col: 8,
              direction: "v", // 上下排版
              offsetLeft: 4, // 项左边偏移量
              component: {
                name: "el-input",
                props: {
                  placeholder: "label设置了align=right"
                }
              },
              value: ""
            },

            start: {
              label: "从",
              labelWidth: 50,   // 可自定义设置label的宽度
              group: "date",
              col: 12,
              component: {
                name: "el-input",
                props: {
                  placeholder: "label没有设置flex, 说明占labelWidth宽"
                }
              },
              value: ""
            },
            end: {
              label: {
                text: "到",
                flex: "self" // 长度就是我本身
              },
              group: "date",
              col: 12,
              component: {
                name: "el-input",
                props: {
                  placeholder: "label设置flex=self, 说明文字是多宽就多宽"
                }
              },
              value: ""
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
| align | 文本的方向 | string | `left`、`center`、`right` | --
| flex | label的长度控制 | string | `""`： label的长度将会是labelWidth<br><br>`full`： 项中有多少点多少。此值一般用于component<br><br>`self`： label的文本占多宽就多宽。此值一般用于label | ""
| 其它 | 跟[组件格式](./com-format.md)一样 | -- | -- | --



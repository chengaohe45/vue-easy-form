# 隐藏控制/隐藏值/临时值

字段（见`行高亮`）：
```js {2,3,4,8,9,10}
propName: {
  hidden: false,  // 是否隐藏此项; 支持动态解析；在根节点（最外级）中无效
  hdValue: undefined, // 当hidden为true时，根据此设置取出隐藏时的值
  isTmp: false,   // 临时值; 在根节点（最外级）中无效
  label: "label值", 
  properties: {
    name: {
      hidden: false,   // 是否隐藏此项; 在根节点（最外级）中无效
      hdValue: undefined, // 当hidden为true时，根据此设置取出隐藏时的值
      isTmp: false,   // 临时值; 在根节点（最外级）中无效
      label: "名称",
      component: "el-input",
      value: "天天"
    }
    // ... 其它项
  }
}
```

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
            ui: {
              colon: true,
              rowSpace: 20
            },
            properties: {
              id: {
                label: "id",
                component: {
                  name: "span",
                  text: "2"
                },
                value: 2,
                hidden: true,   // 隐藏
                hdValue: null   // null代表保持取出value值
              },

              name: {
                label: "广告名称",
                component: {
                  name: "el-input",
                  props: {
                    placeholder: "我的上面有一个广告ID,只不过隐藏了"
                  }
                },
                value: ""
              },

              type: {
                label: "广告类型",
                component: {
                  name: "div",
                  text: "热点（我是一个临时值）"
                },
                isTmp: true,  // 临时值，只界面显示
                rowHeight: 20,
                value: "热点"
              },

              status: {
                label: "状态",
                component: {
                  name: "el-switch",
                  props: {
                    activeText: "开",
                    inactiveText: "关"
                  }
                },
                rowHeight: 22,
                value: true,
                desc: "切换开关试试"
              },

              duration: {
                hidden: "es: !{{$root}}.status",
                label: "投放时段",
                component: {
                  name: "el-date-picker",
                  props: {
                    type: "datetimerange",
                    rangeSeparator: "至",
                    startPlaceholder: "开始日期",
                    endPlaceholder: "结束日期",
                    valueFormat: "yyyy-MM-dd hh:mm:ss"
                  },
                  flex: "full"
                },
                col: 22,
                value: []
              },

              area: {
                hidden: "es: !{{$root}}.status",
                hdValue: {
                  province: "省份的隐藏默认值",
                  city: "城市的隐藏默认值"
                },
                label: "投放区域",
                col: 22,
                ui: {
                  colon: false,
                  labelWidth: 60
                },
                properties: {
                  province: {
                    label: "省份",
                    component: "el-input",
                    col: 12,
                    value: ""
                  },
                  city: {
                    label: "城市",
                    component: "el-input",
                    col: 12,
                    value: ""
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

### 临时值
临时值是指此项在页面中是存在的，但表单值并不会输出。<br/>`应用场景`：当编辑用户信息，界面显示从后台接口取出`姓名、性别、生日`等信息，但`姓名、性别`不能提交到后端修改，此时就可以把`姓名、性别`设置为临时值，表单并不会取出此两项值


### 隐藏值
隐藏值只有当当前的hidden为true时有效；当hidden为true时，hdValue的设置对此项值的影响：
- `不设置/undefined`: 不取出此项的值；
- `null`: 此项的值是什么照样取出；若是properties，则其子节点也要设置为null；
- `其它值`: 取出此值，如值为hdValue为5，则取出为5

::: warning
1. `隐藏`包括本节点的hidden为true或祖先节点存在hidden为true；
2. `临时值`的优先级比`hdValue`大，当同时符合条件时（为临时值、hidden为true且hdValue非undefined），也不会取出此项值。
2. `临时值`只是值不输出而已，它和`hdValue`一样，并不影响[根值](./explain.md#根值)的动态解析。
:::



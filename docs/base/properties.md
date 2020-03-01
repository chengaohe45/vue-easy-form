# 块布局/标题

字段（见`行高亮`）：
```js {4,5,6,7,8,14,15}
propName: {
  ui: { // 块（properties）的ui配置
    
    showBody: true,     // 隐藏/打开切换按钮；不设置则没有切换按钮
    toggleTexts: ["打开", "隐藏"],  // 切换按钮不同状态显示的文字
    type: "",           // 整个块的布局类型；值："bg","block","bg-block"或空值
    hasBorder: false,   // 内容区是否有边框
    padding: undefined, // 内容区的内边距；若没有设置，则根据type和hasBorder的值进行自动取值

    colon: false       // label中是否有冒号
    // ...
  },
  label: false,   // 块properties的label一般都设置为false
  title: "标题",
  properties: {
    name: {
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

          formSchema: {   // 根节点
            ui: {
              type: "bg-block", // 块标题类型
              hasBorder: true,
              showBody: true,   // 有切换按钮，初始化时是打开状态
              padding: [15, 10] // 内边距
            },
            title: "我的表单",
            properties: {
              name: {
                label: "广告名称",
                component: "el-input",
                value: "首页位置"
              },

              base: {
                title: "基本信息",
                label: false,
                properties: {
                  startTime: {
                    label: "上线时间",
                    group: "date",
                    col: 11,
                    component: {
                      name: "el-date-picker",
                      props: {
                        type: "datetime",
                        valueFormat: "yyyy-MM-dd hh:mm:ss"
                      },
                      flex: "full"
                    },
                    value: ""
                  },
                  endTime: {
                    label: {
                      text: "到",
                      flex: "self"
                    },
                    group: "date",
                    col: 11,
                    component: {
                      name: "el-date-picker",
                      props: {
                        type: "datetime",
                        valueFormat: "yyyy-MM-dd hh:mm:ss"
                      },
                      flex: "full"
                    },
                    value: ""
                  }
                }
              },

              target: {
                ui: {
                  type: "bg",         // 块标题类型
                  hasBorder: true,    // 有边框
                  padding: 20         // 内边距
                },
                title: "投放目标",
                label: false,
                properties: {
                  person: {
                    label: "投放人群",
                    component: "el-input",
                    value: "年轻人"
                  },
                  district: {
                    label: "投放地区",
                    component: "el-input",
                    value: "广东省"
                  }
                }
              },
              more: {
                ui: {
                  type: "block",    // 块标题类型
                  showBody: false,  // 有切换按钮，初始化时是隐藏状态
                  toggleTexts: ["打开更多设置", "隐藏更多设置"],  // 切换按钮不同状态显示的文字
                  hasBorder: true   // 有边框
                },
                title: "更多设置",
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
                    component: "el-input",
                    value: "备注就是这么简单"
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

### 子属性
当properties的子属性（如name）设置为`null`、`undefined`、`false`时，说明此项是不显示的; 这样写的目的是为了提高代码的可读性。
> `场景`：新增和编辑可能用到同一个页面，编辑时可能某些项是不需要的，但是新增是需要填写的；写法如：name: this.$route.params.id ? false : {正常的组件}

::: warning 注意
当`properties`和`component`同时存在, `component`将失效。
:::


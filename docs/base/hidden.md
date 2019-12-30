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
              labelWidth: 90,
              colon: true
            },
            layout: {
              name: "tabs",   // tabs布局
              type: "bg",     // /tabs是有背景类型
              padding: "20px 10px"
            },
            properties: {

              // 一级：广告信息
              base: {
                label: "基本信息",
                properties: {

                  name: {
                    label: "广告名称",
                    component: "el-input",
                    value: "首页",
                  },

                  style: {
                    title: "样式设置",
                    label: false,
                    layout: {
                      name: "tabs",
                      type: "card"  // tabs是卡片类型
                    },
                    ui: {
                      labelWidth: 60
                    },
                    rowSpace: 20,
                    properties: {
                      background: {
                        label: "背景",
                        properties: {
                          color: {
                            label: "颜色",
                            component: "el-color-picker",
                            value: "#B9C2B6",
                          },
                          image: {
                            label: "图片",
                            component: "el-input",
                            value: "",
                          }
                        }
                      },

                      font: {
                        label: "字体",
                        properties: {
                          color: {
                            label: "颜色",
                            component: "el-color-picker",
                            value: "#67C23A",
                          },
                          size: {
                            label: "大小",
                            component: {
                              name: "el-input-number",
                              flex: "self"
                            },
                            unit: "px",
                            value: 14,
                          }
                        }
                      }
                    }
                  }
                }
              },
              
              // 一级：更多
              target: {   // 块项
                label: "投放目标",
                layout: {
                  name: "tabs",
                  type: "line",   // tabs是下划线类型
                  hasBorder: false
                },
                ui: {
                  labelWidth: 60
                },

                properties: {

                  district: {
                    label: "地区",
                    properties: {
                      province: {
                        label: "省份",
                        component: "el-input",
                        value: "",
                      },
                      city: {
                        label: "城市",
                        component: "el-input",
                        value: "",
                      }
                    }
                  },

                  person: {
                    label: "人群",
                    component: {
                      name: "el-input",
                      props: {
                        placeholder: "请输入人群的ID"
                      }
                    },
                    value: ""
                  },

                  whitelist: {
                    label: "白名单",
                    component: {
                      name: "el-input",
                      props: {
                        type: "textarea",
                        rows: 3
                      }
                    },
                    value: "xiaoming.lo"
                  }

                }
              },

              // 一级：作者
              author: {   // 组件项
                label: {
                  text: "作者",
                  help: "我在label里面"
                },
                component: {
                  name: "el-input",
                  props: {
                    placeholder: "请输入作者的名称"
                  }
                },
                value: "",
                rules: true
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



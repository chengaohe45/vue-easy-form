# tabs布局

字段（见`行高亮`）：
```js {3,4,5,6,7,9,10}
propName: {
  label: "label值", 
  layout: {
    name: "tabs",  // 值："tabs","space"; 当是"space",说明是一个占位空间,其它值设置是无效的
    type: "card",  // 类型："bg","card","line"; 默认为card
    hasBorder: true,
    padding: undefined
  },
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

::: tip tabs布局
1. tabs的头部显示的是`label`的文本，并不是`title`,当`label`为空或不设置时，则会显示该项的key；
2. 占位空间若作为tabs的一项，将会忽略；
3. tabs的项存在分组，将会忽略。
:::




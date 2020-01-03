<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
  ></demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";

export default {
  data() {
    return {
      title: "tabs布局",
      docsTitle: "tabs布局配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/tabs.html",

      formSchema: {
        ui: {
          labelWidth: 90,
          colon: true
        },
        layout: {
          name: "tabs", // tabs布局
          type: "bg", // /tabs是有背景类型
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
                value: "首页"
              },

              style: {
                title: "样式设置",
                label: false,
                layout: {
                  name: "tabs",
                  type: "card" // tabs是卡片类型
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
                        value: "#B9C2B6"
                      },
                      image: {
                        label: "图片",
                        component: "el-input",
                        value: ""
                      }
                    }
                  },

                  font: {
                    label: "字体",
                    properties: {
                      color: {
                        label: "颜色",
                        component: "el-color-picker",
                        value: "#67C23A"
                      },
                      size: {
                        label: "大小",
                        component: {
                          name: "el-input-number",
                          flex: "self"
                        },
                        unit: "px",
                        value: 14
                      }
                    }
                  }
                }
              }
            }
          },

          // 一级：更多
          target: {
            // 块项
            label: "投放目标",
            layout: {
              name: "tabs",
              type: "line", // tabs是下划线类型
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
                    value: ""
                  },
                  city: {
                    label: "城市",
                    component: "el-input",
                    value: ""
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
          author: {
            // 组件项
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
  },

  created() {},

  computed: {},

  mounted() {},

  methods: {},
  components: {
    demoFrame
  }
};
</script>

<style lang="scss"></style>

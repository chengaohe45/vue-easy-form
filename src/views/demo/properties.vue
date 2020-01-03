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
      title: "块布局",
      docsTitle: "块布局配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/properties.html",

      formSchema: {
        // 根节点
        ui: {
          type: "bg-block", // 块标题类型
          hasBorder: true,
          showBody: true, // 有切换按钮，初始化时是打开状态
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
              type: "bg", // 块标题类型
              hasBorder: true, // 有边框
              padding: 20 // 内边距
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
              type: "block", // 块标题类型
              showBody: false, // 有切换按钮，初始化时是隐藏状态
              hasBorder: true // 有边框
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

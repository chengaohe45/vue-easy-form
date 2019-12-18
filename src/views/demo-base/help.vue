<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
  >
    <div slot="details">
      字段help
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";

export default {
  data() {
    return {
      title: "帮助",
      docsTitle: "帮助配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/help.html",

      formSchema: {
        ui: {
          direction: "h"
        },
        properties: {
          name: {
            label: "广告名称",
            component: "el-input",
            value: "首页位置",
            // col: 16,
            help: "我只写了内容文字，我将采用系统的help"
          },
          author: {
            label: "作者名称",
            component: {
              name: "el-input",
              props: {
                placeholder: "请输入作者的名字"
              }
            },
            value: "",
            col: 12,
            help: {
              // name: "不写将使用系统的",
              props: {
                content:
                  "点击查看我的主页：<span style='color: #67c23a;'>我支持html</span>",
                maxWidth: 200,
                href: "http://www.qq.com",
                placement: "right"
              }
            }
          },
          status: {
            rowHeight: 20,
            label: "是否投放",
            component: "el-switch",
            value: true,
            desc: "切换开关试试"
          },
          startTime: {
            col: 12,
            group: "g",
            value: "",
            label: {
              text: "活动时间",
              help:
                "es: '我在label里面：' + ({{$root}}.status ? '<span style=\"color: #67c23a;\">投放</span>': '不投放')"
            },
            component: {
              name: "el-date-picker",
              props: {
                type: "date",
                valueFormat: "yyyy-MM-dd"
              },
              flex: "full"
            }
          },
          endTime: {
            col: 12,
            group: "g",
            value: "",
            label: {
              text: "-",
              flex: "self"
            },
            component: {
              name: "el-date-picker",
              props: {
                type: "date",
                valueFormat: "yyyy-MM-dd"
              },
              flex: "full"
            }
          },

          target: {
            ui: {
              type: "bg-block",
              rowSpace: 10,
              hasBorder: true
            },
            title: {
              text: "投放目标",
              help: {
                hidden: "es: !{{$root}}.status",
                props: {
                  content: "我在title里面"
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
                value: "广东省",
                help: {
                  name: "g-help",
                  props: {
                    icon: "el-icon-location",
                    content: "这个是自定义的help",
                    href: "http://www.qq.com"
                  }
                }
              },
              people: {
                label: "人群",
                component: {
                  name: "el-input"
                },
                value: "中年人"
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

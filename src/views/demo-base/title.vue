<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
  >
    <div slot="details">
      <div>字段title</div>
      <div class="sys-danger">块的标题、在项中不起作用(跟properties同级)</div>
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";
import title from "@/components/units/title";
export default {
  data() {
    return {
      title: "标题",
      docsTitle: "标题配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/title.html",

      formSchema: {
        ui: {
          colon: true,
          rowSpace: 20
        },
        properties: {
          name: {
            label: "广告名称",
            component: "el-input",
            value: "首页位置",
            col: 12
          },
          simulateTitle: {
            isTmp: true,
            label: false,
            rowHeight: 26,
            component: {
              name: title,
              props: {
                text: "自定义-模拟标题",
                color: "es: {{$root}}.simulateColor"
              }
            },
            value: ""
          },
          simulateColor: {
            rowSpace: 10,
            label: "颜色",
            component: "el-color-picker",
            value: "#409EFF"
          },

          district: {
            ui: {
              type: "bg-block",
              rowSpace: 10,
              hasBorder: true
            },
            title: {
              text: "投放地区",
              help: "我在title里面"
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
          },

          more: {
            ui: {
              showBody: true,
              hasBorder: true,
              rowSpace: 10,
              padding: 20
            },
            title: {
              name: title,
              props: {
                text: "自定义-组件化写法",
                color: "es: {{$root}}.simulateColor"
              }
            },
            help: "我在title外里",
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

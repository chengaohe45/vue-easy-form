<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      写法跟写一个平常组件一样：<br />
      layout有两个值："space", "tabs"; 区分大小写；其余的认为是false<br />
      当layout为'space'时,说明这个是占位空间，此值不会取出，label也不会显示（有效值只有col,hidden,
      group;其余的失效）
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
import title from "@/components/units/title";
export default {
  data() {
    return {
      title: "占位空间",

      formSchema: {
        colon: true,
        boxRowSpace: 20,
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
            boxRowSpace: 10,
            ui: {
              type: "bg-block",
              hasBorder: true
            },
            title: {
              text: "投放地区"
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
            boxRowSpace: 10,
            ui: {
              showBody: true,
              hasBorder: true,
              padding: 20
            },
            title: {
              name: title,
              props: {
                text: "自定义-组件化写法",
                color: "es: {{$root}}.simulateColor"
              }
            },
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

  created() {
    // console.log("dynamicTags", dynamicTags);
  },

  computed: {},

  mounted() {},

  methods: {},
  components: {
    demoFrame
  }
};
</script>

<style lang="scss"></style>

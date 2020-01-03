<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
  >
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
        name: {
          label: "页面名称",
          component: "el-input",
          value: "首页位置"
        },

        // 写法一
        base: {
          // title: "背景信息", // 也可以直接写动态解析，如es语句；这句等价于下面
          title: {
            // hidden: false, // 控制title文本是否隐藏，支持动态解析
            text: "背景信息"
          },
          label: false,
          properties: {
            image: {
              label: "背景图片",
              component: "el-input",
              value: ""
            },
            color: {
              label: "背景颜色",
              component: "el-color-picker",
              value: "#269520"
            }
          }
        },

        // 写法二：组件写法
        more: {
          ui: {
            showBody: true,
            hasBorder: true,
            padding: 20,
            rowSpace: 10,
            type: "bg-block"
          },
          title: {
            // hidden: false, // 控制title是否隐藏，支持动态解析
            name: title, // title是import导入的局部组件
            props: {
              text: "自定义标题"
            },
            text: "自定义-组件化写法",
            help: "我在title里面"
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

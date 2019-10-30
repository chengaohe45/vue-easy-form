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
            col: 12,
            help:
              "es: '我只写了内容文字，我将采用系统的help: pv='+ {{$root}}.pv"
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
            col: 24,
            help: {
              // name: "不写将使用系统的",
              props: {
                content:
                  "点击查看我的主页: 我不写help.name, 我将采用系统的help",
                maxWidth: 200,
                href: "http://www.qq.com",
                placement: "right"
              }
            }
          },
          pv: {
            label: {
              text: "pv",
              align: "center"
            },
            component: {
              name: "el-input-number",
              props: {
                // placeholder: "请输入作者的名字"
              },
              flex: "self"
            },
            value: 0,
            col: 18,
            help: {
              name: "g-help",
              props: {
                icon: "el-icon-location",
                content: "es: '这个是自定义的help: pv=' + {{$root}}.pv",
                href: "http://www.qq.com"
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

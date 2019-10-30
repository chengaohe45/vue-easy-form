<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
  >
    <div slot="details">
      <div>字段desc: 对每一项进行补充</div>
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";
import desc from "./components/desc";
export default {
  data() {
    return {
      title: "描述",
      docsTitle: "描述配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/desc.html",

      formSchema: {
        ui: {
          colon: true
        },
        properties: {
          name: {
            label: "广告名称",
            component: "el-input",
            value: "首页位置",
            // col: 12,
            desc: "一般的描述方法"
          },
          isJson: {
            label: "传输格式",
            component: {
              name: "el-switch",
              props: {
                activeText: "JSON格式",
                inactiveText: "XML格式"
              }
            },
            value: true
          },
          data: {
            label: "传输数据",
            component: {
              name: "el-input",
              props: {
                placeholder: "改变‘传输格式’试试"
              }
            },
            value: "",
            desc: "es: {{$root}}.isJson ? 'JSON格式' : 'XML格式'"
          },

          note: {
            label: "备注",
            component: {
              name: "el-input",
              props: {
                placeholder: ""
              }
            },
            value: "",
            desc: {
              name: desc
              // style: {
              //   color: "red"
              // },
              // class: "haha hah"
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

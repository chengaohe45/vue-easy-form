<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
  >
    <div slot="details">
      字段array
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";

export default {
  data() {
    return {
      title: "表格数组",
      docsTitle: "数组配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/array.html",

      formSchema: {
        ui: {
          direction: "v"
        },
        properties: {
          name: {
            label: "名称",
            component: {
              name: "el-input"
              // ref: "subject"
            },
            value: "小明",
            col: 12
          },
          courses: {
            layout: "tabs",
            ui: {
              rowHeight: 32,
              showBody: true
            },
            title: {
              text: "我的课程"
            },
            label: false,
            array: {
              name: "array-table",
              // hasOrder: true,
              // hasDelete: true,
              // hasSort: true,
              hasAdd: true,
              // hasCopy: true,
              hasDelWarn: true,
              // hasAdd: false,
              fixed: 1,
              min: 3,
              max: 5,
              headRequired: true,
              value: [
                { name: "语文", code: "1" },
                { name: "数学", code: "2" },
                { name: "英语", code: "3" },
                { name: "政治", code: "4" }
              ]
            },

            properties: {
              name: {
                value: "默认名",
                direction: "h",
                col: 8,
                label: {
                  name: "div",
                  text: "学科名",
                  align: "left"
                  // help: "我在label里面：学科名"
                },
                component: {
                  name: "el-input",
                  props: {
                    disabled: "es:!{{$root.courses[i].code}}",
                    size: "small"
                  },
                  ref: "subject"
                },
                rules: {
                  required: true,
                  emptyMsg: "请输入学科名"
                },
                help: {
                  hidden: "es: {{$index}}%2",
                  props: {
                    content: "我在外面：间隔演示帮助"
                  }
                }
              },
              code: {
                value: "100",
                // direction: "v",
                col: 8,
                label: {
                  text: "代号",
                  help: "我在label里面：代号"
                },
                component: {
                  name: "el-input",
                  props: {
                    size: "small"
                  }
                }
                // help: "帮帮我吧"
              }
            },
            desc: "提示： 最多只能添加5条数据"
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

<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :has-value="true"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
    :hasOperate="hasOperate"
  >
    <div slot="details">
      <div>form.getValue(): 取值</div>
      <div>form.setValue(Object): 设值</div>
      <div>form.setValue(key, value): 设值某一个值</div>
      <div>form.reset(): 重置</div>
      <div>form.checkAll(): 表单检查，返回true/false</div>
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";
export default {
  data() {
    return {
      title: "取值/赋值",
      docsTitle: "值设置文档",
      docsHref: "/vue-easy-form-docs/dist/base/form-value.html",
      hasOperate: true,

      formSchema: {
        ui: {
          direction: "v"
        },
        properties: {
          name: {
            label: "名称",
            component: "el-input",
            value: "",
            col: 12,
            rules: {
              required: true,
              emptyMsg: "名称不能为空"
            }
          },
          courses: {
            ui: {
              showBody: true,
              rowHeight: 32
            },
            title: {
              text: "我的课程"
            },
            label: false,

            array: {
              name: "array-table",
              hasOrder: true,
              hasDelete: true,
              hasSort: false,
              hasAdd: true,
              max: 5,
              headRequired: true,
              value: [
                { name: "语文", code: "Y100" },
                { name: "数学", code: "" }
              ]
            },
            properties: {
              name: {
                value: "",
                direction: "h",
                col: 12,
                label: "学科名",
                component: {
                  name: "el-input",
                  props: {
                    placeholder: "学科名",
                    size: "small"
                  }
                },
                rules: {
                  required: true,
                  emptyMsg: "请输入学科名"
                }
              },
              code: {
                value: "",
                col: 12,
                label: {
                  text: "代号"
                },
                component: {
                  name: "el-input",
                  props: {
                    size: "small",
                    disabled: "es:!{{$root.courses[i].name}}",
                    placeholder:
                      "es:{{$root.courses[i].name}} ? '代号' : '先输入学科名'"
                  }
                },
                help: "帮帮我吧",
                rules: {
                  required: true,
                  emptyMsg: "请输入代号"
                }
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

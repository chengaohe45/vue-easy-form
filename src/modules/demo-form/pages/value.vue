<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :has-value="true"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
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
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "取值/赋值",
      docsTitle: "所有表单事件/方法",
      docsHref: "/vue-easy-form-docs/dist/base/event.html",

      formSchema: {
        direction: "v",
        properties: {
          name: {
            label: "名称",
            component: "el-input",
            value: "小明",
            col: 12
          },
          courses: {
            ui: {
              showBody: true
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
              value: [{ name: "语文", code: 123 }, { name: "数学", code: 123 }]
            },
            boxRowHeight: 32,
            properties: {
              name: {
                value: "默认名",
                direction: "h",
                col: 12,
                label: "学科名",
                component: {
                  name: "el-input",
                  props: {
                    disabled: "es:!{{$root.courses[i].code}}",
                    size: "small"
                  }
                },
                rules: {
                  required: true,
                  emptyMsg: "请输入学科名"
                }
              },
              code: {
                value: "100",
                // direction: "v",
                col: 12,
                label: {
                  text: "代号"
                },
                component: {
                  name: "el-input",
                  props: {
                    size: "small"
                  }
                },
                help: "帮帮我吧"
              }
            },
            desc: "提示： 最多只能添加5条数据"
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

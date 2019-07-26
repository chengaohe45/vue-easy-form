<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      <!-- ?? -->
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "表格数组",

      formSchema: {
        direction: "v",
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
              value: [{ name: "语文", code: 123 }, { name: "数学", code: 123 }]
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
                help: "帮帮"
              },
              code: {
                value: "100",
                // direction: "v",
                col: 8,
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

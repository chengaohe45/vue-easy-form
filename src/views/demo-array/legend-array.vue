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
      title: "行数组",
      docsTitle: "数组配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/array.html",

      formSchema: {
        // layout: "tabs",
        properties: {
          // name: {
          //   value: "默认名",
          //   direction: "h",
          //   offsetRight: 200,
          //   // col: 12,
          //   label: "Test",
          //   // hidden: "es: !{{$hidden(  courses[i].code)}}",
          //   component: {
          //     ref: "code",
          //     name: "el-input"
          //   },
          //   rules: true
          // },

          target: {
            title: {
              text: "投放目标",
              type: "bg-border",
              showBody: true
            },
            label: "",
            ui: {
              rowSpace: 20,
              rowHeight: 32
            },
            array: {
              name: "array-legend",
              subLabel: "es: '投放目标' + ({{$index}} + 1)",
              hasOrder: false,
              hasDelete: true,
              hasSort: true,
              hasAdd: true,
              hasCopy: true,
              fixed: 1,
              max: 15,
              rowSpace: 10,
              value: [
                { name: "清华", code: "a??" },
                { name: "北大", code: "b??" }
              ],
              actions: {
                trigger: "change",
                handler: function(options) {
                  console.log("test array input:", options);
                }
              }
            },

            properties: {
              name: {
                value: "大学默认名",
                direction: "h",
                offsetRight: 200,
                // col: 12,
                label: "es: '大学' + ({{$index}} + 1)",
                // hidden: "es: {{$hidden(target)}}",
                component: {
                  ref: "code",
                  name: "el-input",
                  props: {
                    // disabled: "es:!{{$root.courses[i].code}} || {{$index}} == 0",
                    size: "small"
                  }
                },
                rules: true
              },
              courseList: {
                array: {
                  name: "array",
                  subLabel: "es: '投放目标' + ({{$index}} + 1)",
                  hasOrder: false,
                  hasDelete: true,
                  hasSort: true,
                  hasAdd: true,
                  hasCopy: true,
                  fixed: 1,
                  max: 5,
                  rowSpace: 10,
                  value: [
                    { name: "语文", code: "a" },
                    { name: "数学", code: "b" }
                  ],
                  actions: {
                    trigger: "change",
                    handler: function(options) {
                      console.log("test array input:", options);
                    }
                  },
                  // insertValue: { applyNum: "1234", code: 123 }
                  // options 为 {oldValues, position, type}
                  insertValue: function(options) {
                    if (options.type == "copy") {
                      var oldValues = options.oldValues;
                      oldValues[options.position - 1].applyNum =
                        "" + options.position;
                      return oldValues[options.position - 1];
                    }
                  }
                },
                properties: {
                  code: {
                    value: "100",
                    // direction: "v",
                    // col: 12,
                    // hidden: "es: {{$hidden(target)}}",
                    label: {
                      text: "学科代号"
                    },
                    col: 12,
                    component: {
                      ref: "code",
                      name: "el-input",
                      props: {
                        size: "small",
                        disabled:
                          "es: !{{$root.target[i].courseList[i].applyNum}}"
                      },
                      actions: {
                        trigger: "input",
                        handler: function(data) {
                          console.log("data: ", data);
                        }
                      }
                    }
                  },
                  applyNum: {
                    value: "100",
                    // direction: "v",
                    // col: 12,
                    // hidden: "es: {{$hidden(target[i][courseList][i].code)}}",
                    label: {
                      text: "报名人数"
                    },
                    col: 12,
                    component: {
                      name: "el-input",
                      props: {
                        size: "small"
                      },
                      actions: {
                        trigger: "input",
                        handler: function(options) {
                          console.log("options: ", options);
                        }
                      }
                    }
                  }
                }
              }
            },
            desc: "提示： 最多只能添加5条数据",
            help: "help： 最多只能添加5条数据"
          }

          // name1: {
          //   value: "默认名",
          //   direction: "h",
          //   offsetRight: 200,
          //   // col: 12,
          //   label: "Test",
          //   // hidden: "es: !{{$hidden(  courses[i].code)}}",
          //   component: {
          //     ref: "code1",
          //     name: "el-input"
          //   },
          //   rules: true
          // }
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

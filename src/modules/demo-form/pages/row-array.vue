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
      title: "行数组",

      formSchema: {
        layout: "tabs",
        properties: {
          isRequired: {
            label: "是否验证",
            component: "el-switch",
            value: false
          },
          name: {
            label: "名称",
            array: {
              name: "array-card",
              hasOrder: true,
              hasDelete: false,
              hasSort: false,
              hasAdd: true,
              // hasCopy: true,
              hasDelWarn: false,
              fixed: 1,
              max: 5,
              value: ["名称1", "名称2", "名称3"],
              insertValue: function(arrayValue, index) {
                console.log(this.getValue(), arrayValue, index);
                return "1";
              },
              rules: true,
              actions: {
                trigger: "input",
                handler: function(value, key, event) {
                  console.log("test array input2:", value, key, event);
                }
              },
              rowSpace: 20
            },
            component: {
              name: "el-input",
              props: {
                clearable: true
              },
              ref: "testRef"
            },
            // col: 15,
            value: "小明",
            rules: "es: {{$root}}.isRequired",
            // unit: "px",
            desc: "名称就是这样子",
            help: "帮助就是这样子"
          },
          target: {
            title: {
              text: "投放目标",
              type: "bg-border",
              showBody: true
            },
            label: "",
            boxRowSpace: 15,
            // col: 15,
            array: {
              name: "array",
              subLabel: "es: '投放目标' + ({{$index}} + 1)",
              hasOrder: false,
              hasDelete: true,
              hasSort: true,
              hasAdd: true,
              fixed: 1,
              max: 5,
              rowSpace: 30,
              value: [{ name: "语文", code: 123 }, { name: "数学", code: 123 }],
              actions: {
                trigger: "change",
                handler: function(value, key, event) {
                  console.log("test array input:", value, key, event);
                }
              }
            },
            boxRowHeight: 32,
            properties: {
              name: {
                value: "默认名",
                direction: "h",
                // col: 12,
                label: "es: '学科名' + ({{$index}} + 1)",
                // hidden: "es: !{{$hidden(  courses[i].code)}}",
                component: {
                  name: "el-input",
                  props: {
                    // disabled: "es:!{{$root.courses[i].code}} || {{$index}} == 0",
                    size: "small"
                  }
                },
                rules: true
              },
              code: {
                value: "100",
                // direction: "v",
                col: 12,
                label: {
                  text: "学科代号"
                },
                component: {
                  name: "el-input",
                  props: {
                    size: "small"
                  },
                  actions: {
                    trigger: "input",
                    handler: function(value, pathkey) {
                      console.log("value: ", value);
                      console.log("pathkey: ", pathkey);
                    }
                  }
                }
              },
              applyNum: {
                value: "100",
                // direction: "v",
                col: 12,
                label: {
                  text: "报名人数"
                },
                component: {
                  name: "el-input",
                  props: {
                    size: "small"
                  },
                  actions: {
                    trigger: "input",
                    handler: function(value, pathkey) {
                      console.log("value: ", value);
                      console.log("pathkey: ", pathkey);
                    }
                  }
                }
              }
            },
            desc: "提示： 最多只能添加5条数据",
            help: "help： 最多只能添加5条数据"
          },
          courses: {
            layout: "tabs",
            title: {
              text: "我的课程",
              type: "bg-border",
              showBody: true
            },
            label: "",
            // col: 15,
            array: {
              name: "array",
              // hasCopy: true,
              hasOrder: true,
              hasDelete: true,
              hasSort: true,
              hasAdd: true,
              fixed: 1,
              max: 5,
              rowSpace: 8,
              value: [{ name: "语文", code: 123 }, { name: "数学", code: 123 }],
              actions: {
                trigger: "change",
                handler: function(value, key, event) {
                  console.log("test array input:", value, key, event);
                }
              }
            },
            boxRowHeight: 32,
            properties: {
              name: {
                value: "默认名",
                direction: "h",
                col: 12,
                label: "es: '学科名' + ({{$index}} + 1)",
                // hidden: "es: !{{$hidden(  courses[i].code)}}",
                component: {
                  name: "el-input",
                  props: {
                    // disabled: "es:!{{$root.courses[i].code}} || {{$index}} == 0",
                    size: "small"
                  }
                },
                rules: true
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
                  },
                  actions: {
                    trigger: "input",
                    handler: function(value, pathkey) {
                      console.log("value: ", value);
                      console.log("pathkey: ", pathkey);
                    }
                  }
                }
              }
            },
            desc: "提示： 最多只能添加5条数据",
            help: "help： 最多只能添加5条数据"
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

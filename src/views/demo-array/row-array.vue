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
        ui: {
          rowSpace: 20
        },
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
              hasDelete: true,
              hasSort: false,
              hasAdd: true,
              hasCopy: true,
              hasDelWarn: true,
              fixed: 1,
              max: 5,
              value: ["名称1", "名称2", "名称3"],
              insertValue: function(options) {
                console.log(this.getValue(), options);
                return "1";
              },
              rules: true,
              actions: {
                trigger: "input",
                handler: function(options) {
                  console.log("test array input2:", options);
                }
              },
              rowSpace: 20
            },
            component: {
              name: "el-input",
              props: {
                clearable: true,
                disabled: data => {
                  // console.log("data: ", data);
                  return data.index % 2 ? true : false;
                }
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
            ui: {
              type: "bg-block",
              rowSpace: 10,
              rowHeight: 32,
              showBody: true
            },
            title: "投放目标",
            label: "",
            // col: 15,
            array: {
              name: "array",
              subLabel: "es: '投放目标' + ({{$index}} + 1)",
              hasOrder: true,
              hasDelete: true,
              hasSort: true,
              hasAdd: true,
              // fixed: 1,
              rules: true,
              max: 20,
              // rowSpace: 20,
              value: [
                { name: "语文", code: "001", applyNum: 155 },
                { name: "英语", code: "005", applyNum: 888 }
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
                    handler: function(options) {
                      console.log("options: ", options);
                    }
                  }
                }
              }
            },
            desc: "提示： 至少要添加一条数据",
            help: "help： 最多只能添加20条数据"
          },
          courses: {
            // layout: "tabs",
            ui: {
              type: "bg-border",
              // rowHeight: 32,
              showBody: true
            },
            title: "我的课程",
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
              value: [{ name: "语文", code: "100" }, { name: "", code: "" }],
              actions: {
                trigger: "change",
                handler: function(options) {
                  console.log("test array input:", options);
                }
              }
            },

            properties: {
              name: {
                // pathKey: 当是第一个时，则是: courses[0].name, 如此类推
                col: 12,
                label: "学科名",
                component: "el-input",
                value: "语文"
              },
              code: {
                // pathKey: 当是第一个时，则是: courses[0].code, 如此类推
                value: "",
                col: 12,
                label: "学科代号",
                component: {
                  name: "el-input",
                  props: {
                    placeholder:
                      "es: !{{$root['courses'][i].name}} ? '学科名有值我才可写' : '输入学科代号'",
                    disabled: "es: !{{$root.courses[i]}}.name" // [i]代表当前行
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

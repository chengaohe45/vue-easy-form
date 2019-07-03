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
        // layout: "tabs",
        properties: {
          target: {
            title: {
              text: "投放目标",
              type: "bg-border",
              showBody: true
            },
            label: "",
            // col: 15,
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
              rowSpace: 8,
              value: [{ name: "语文", code: 123 }, { name: "数学", code: 123 }],
              actions: {
                trigger: "change",
                handler: function(options) {
                  console.log("test array input:", options);
                }
              }
            },
            boxRowHeight: 32,
            properties: {
              name: {
                value: "默认名",
                direction: "h",
                offsetRight: 200,
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
                  rowSpace: 8,
                  value: [
                    { name: "语文", code: 123 },
                    { name: "数学", code: 123 }
                  ],
                  actions: {
                    trigger: "change",
                    handler: function(options) {
                      console.log("test array input:", options);
                    }
                  },
                  // insertValue: { applyNum: "1234", code: 123 }
                  insertValue: function(arrayValues, position, type) {
                    console.log(arrayValues, position, type);
                    if (type == "copy") {
                      arrayValues[position - 1].applyNum = "";
                      return arrayValues[position - 1];
                    }
                  }
                },
                properties: {
                  code: {
                    value: "100",
                    // direction: "v",
                    // col: 12,
                    label: {
                      text: "学科代号"
                    },
                    col: 12,
                    component: {
                      name: "el-input",
                      props: {
                        size: "small",
                        disabled:
                          "es: !{{$root.target[i].courseList[i].applyNum}}"
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
                    // col: 12,
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
                        handler: function(value, pathkey) {
                          console.log("value: ", value);
                          console.log("pathkey: ", pathkey);
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

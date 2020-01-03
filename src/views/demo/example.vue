<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <!-- <div slot="details">
      属性format >>
      场景：当接口所需要的是1/0,而"开关组件"则是true/false,此时就需要转换
    </div> -->
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";

import Select from "@/components/units/select";
import CheckboxGroup from "@/components/units/checkbox-group";
import radioGroup from "@/components/units/radio-group";

export default {
  data() {
    return {
      title: "综合例子",

      formSchema: {
        rowSpace: 40,
        properties: {
          name: {
            value: "",
            label: "活动名称",
            rules: {
              required: true,
              emptyMsg: "活动名称不能为空"
            },
            component: {
              name: "el-input",
              props: {
                clearable: true,
                placeholder: "请输入活动名称"
              },
              actions: {
                trigger: "change",
                handler: function(value) {
                  console.log(this, value);
                }
              },
              ref: "testRef"
            }
          },
          regions: {
            value: "",
            label: "活动区域",
            component: {
              name: Select,
              props: {
                placeholder: "请选择活动区域",
                clearable: true,
                multiple: true,
                options: [{ text: "区域1", id: 1 }, { text: "区域2", id: 2 }]
              },
              actions: {
                trigger: "change",
                handler: function() {
                  console.log("Select $listener");
                }
              }
            },
            rules: {
              required: true,
              emptyMsg: "请选择"
            }
          },

          startTime: {
            col: 12,
            group: "g",
            value: "",
            label: "活动时间",
            component: {
              name: "el-date-picker",
              props: {
                type: "date",
                valueFormat: "yyyy-MM-dd"
              },
              flex: "full"
            }
          },
          endTime: {
            col: 12,
            group: "g",
            value: "",
            label: {
              text: "-",
              flex: "self"
            },
            component: {
              name: "el-date-picker",
              props: {
                type: "date",
                valueFormat: "yyyy-MM-dd"
              },
              flex: "full"
            }
          },

          delivery: {
            value: false,
            label: "即时配送",
            rowHeight: 30,
            component: {
              name: "el-switch"
            }
          },

          type: {
            value: [2, 4],
            label: "活动性质",
            rowHeight: 30,
            component: {
              name: CheckboxGroup,
              props: {
                options: [
                  { text: "美食/餐厅线上活动", id: 1 },
                  { text: "地推活动", id: 2 },
                  { text: "线下主题活动", id: 3 },
                  { text: "单纯品牌曝光", id: 4 }
                ]
              },
              actions: {
                trigger: "change",
                handler: function() {
                  console.log("CheckboxGroup $listener");
                }
              }
            }
          },

          leader: {
            value: "liu.xiao",
            label: "负责人",
            rowHeight: 30,
            component: {
              name: radioGroup,
              props: {
                options: [
                  { text: "陈总", id: "manager.chen" },
                  { text: "肖总", id: "manager.xiao" },
                  { text: "刘总", id: "liu.xiao" }
                ]
              },
              actions: {
                trigger: "change",
                handler: function() {
                  console.log("radioGroup $listener");
                }
              }
            }
          },

          staffs: {
            ui: {
              type: "bg-border",
              rowHeight: 32,
              rowSpace: 15,
              showBody: true
            },
            title: {
              text: "参与人员"
            },
            // label: "",
            rowSpace: 15,
            // col: 15,

            array: {
              name: "array",
              hasOrder: true,
              hasDelete: true,
              hasSort: true,
              hasAdd: true,
              max: 5,
              value: [
                { name: "小明", code: "T123" },
                { name: "小花", code: "A623" }
              ]
            },
            properties: {
              name: {
                value: "默认名",
                direction: "h",
                col: 12,
                label: "姓名",
                component: {
                  name: "el-input",
                  props: {
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
                  text: "工号"
                },
                component: {
                  name: "el-input",
                  props: {
                    size: "small"
                  }
                }
              }
            },
            desc: "提示： 最多只能添加5个人员"
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

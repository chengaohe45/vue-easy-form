<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details"></div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
import label from "../components/label";
export default {
  data() {
    return {
      title: "项标签",

      formSchema: {
        name: {
          label: "广告名称",
          component: "el-input",
          value: "首页位置"
        },

        isOpen: {
          label: "开关",
          component: "el-switch",
          value: true
        },

        esLabel: {
          label: "es: '广告标签' + ({{$root}}.isOpen ? '(开)' : '(关)')",
          component: {
            name: "el-input",
            props: {
              placeholder: "切换开关试试"
            }
          },
          rules: true,
          value: ""
        },

        textLabel: {
          label: {
            text: "text写法"
          },
          component: {
            name: "el-input",
            props: {}
          },
          value: ""
        },

        comLabel: {
          label: {
            name: label,
            props: {}
          },
          component: {
            name: "el-input",
            props: {}
          },
          value: ""
        },

        spaceLabel: {
          label: "",
          component: {
            name: "el-input",
            props: {
              placeholder: "设置为空, 说明是占空间位置"
            }
          },
          value: ""
        },

        falseLabel: {
          label: false,
          component: {
            name: "el-input",
            props: {
              placeholder: "设置为false, 说明是不占空间位置"
            }
          },
          value: ""
        },

        alignLabel1: {
          label: {
            text: "左",
            align: "left"
          },
          col: 8,
          direction: "v",
          offsetRight: 4,
          component: {
            name: "el-input",
            props: {
              placeholder: "label设置了align"
            }
          },
          value: ""
        },

        alignLabel2: {
          label: {
            text: "中",
            align: "center"
          },
          col: 8,
          direction: "v",
          offsetLeft: 2,
          offsetRight: 2,
          component: {
            name: "el-input",
            props: {
              placeholder: "label设置了align"
            }
          },
          value: ""
        },
        alignLabel3: {
          label: {
            text: "右",
            align: "right"
          },
          col: 8,
          direction: "v",
          offsetLeft: 4,
          component: {
            name: "el-input",
            props: {
              placeholder: "label设置了align"
            }
          },
          value: ""
        },

        start: {
          label: "从",
          group: "date",
          col: 12,
          component: {
            name: "el-input",
            props: {
              placeholder: "label没有设置size=fixed; 说明占labelWidth宽"
            }
          },
          value: ""
        },
        end: {
          label: {
            text: "到",
            size: "fixed"
          },
          group: "date",
          col: 12,
          component: {
            name: "el-input",
            props: {
              placeholder: "label设置size=fixed; 说明文字是多宽就多宽"
            }
          },
          value: ""
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

<style lang="scss">
.demo-base-details {
  line-height: 20px;

  .base-title {
    margin: 6px 0 0 0;
    padding: 0;
    line-height: 26px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>

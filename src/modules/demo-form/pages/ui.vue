<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      <div class="ui-details">
        colon, direction, rowHeight, rowSpace, labelWidth, offsetLeft,
        offsetRight
      </div>
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "组件行为/事件",

      formSchema: {
        ui: {
          rowSpace: 40
        },
        properties: {
          name: {
            label: "广告名称",
            component: "el-input",
            value: "首页位置",
            col: 12
          },
          pholder: {
            layout: "space",
            col: 1
          },
          author: {
            label: "作者名称",
            rowSpace: 10,
            component: {
              name: "el-input",
              props: {
                placeholder: "请输入作者的名字"
              }
            },
            value: "",
            col: 12
          },
          rate: {
            label: "评分",
            rowHeight: 20,
            component: {
              name: "el-rate",
              props: {
                colors: ["#99A9BF", "#F7BA2A", "#FF9900"]
              }
            },
            value: 1
          },
          status: {
            label: "状态",
            rowHeight: 20,
            rowSpace: 10,
            component: {
              name: "el-switch"
            },
            value: true
          },

          more: {
            ui: {
              type: "bg-border",
              rowSpace: 10,
              rowHeight: 28,
              labelWidth: 80,
              colon: true,
              showBody: true
            },
            title: {
              name: "div",
              text: "es: {{$root}}.status ? '更多设置' : '很多设置'"
            },
            label: false,
            offsetLeft: 30,
            offsetRight: 30,
            properties: {
              leader: {
                label: "负责人",
                labelWidth: 70,
                component: {
                  name: "el-input",
                  props: {
                    size: "mini"
                  }
                },
                value: "kyle.lo (label不对齐：为了测试写成一个是80，一个是70)"
              },
              whitelist: {
                col: 12,
                label: {
                  text: "白名单"
                },
                component: {
                  name: "el-input",
                  props: {
                    size: "mini"
                  }
                },
                value: "he"
              }
            }
          },

          minSourceId: {
            label: {
              text: "关联数据源ID",
              align: "center"
            },
            direction: "v",
            col: 6,
            offsetRight: 5,
            component: {
              name: "el-input",
              props: {
                placeholder: "最小值"
              }
            },
            value: ""
          },

          maxSourceId: {
            label: "                  ",
            direction: "v",
            offsetLeft: 5,
            col: 6,
            component: {
              name: "el-input",
              props: {
                placeholder: "最大值"
              }
            },
            value: ""
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

<style lang="scss">
@import "@/static/css/mixins.scss";
.ui-details {
  line-height: 20px;
  font-size: 14px;
}
</style>

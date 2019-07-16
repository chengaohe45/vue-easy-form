<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      <div class="ui-details">
        <div>
          <strong>colon:</strong> 可全局设置; true/false;
          是否有冒号，根节点默认为没有，其它的没有设置就会继承
        </div>
        <div>
          <strong>rowHeight:</strong> 整数(px);
          每一行的高度，为什么设置这个，因为每一个的组件的高度是没有办法知道的，只能根据实际情况设置，这样使排版更加美观；如el-input是40,
          el-switch是20
        </div>
        <div>
          <strong>boxRowHeight:</strong> 可全局设置; 整数(px);
          在properties中有效，表明子节点每一行的高度（在子节点没有设置rowHeight时，就会取这个值），会被下一个properties继承
        </div>
        <div>
          <strong>rowSpace:</strong> 整数(px); 与上一次行之间的间隔;
          注意：是与上一行的间隔，那么第一行设置了也没有用
        </div>
        <div>
          <strong>boxRowSpace:</strong> 可全局设置; 整数(px);
          在properties中有效，表明子节点中行与行之间的间隔（在子节点没有设置rowSpace时，就会取这个值），会被下一个properties继承
        </div>
        <div><strong>labelWidth:</strong> 整数(px); label的宽度</div>
        <div>
          <strong>boxLabelWidth:</strong> 可全局设置; 整数(px);
          在properties中有效，表示子节点的label的宽度，原理同boxRowSpace，不过在table中无效
        </div>
        <div>
          <strong>offsetLeft:</strong> 整数(px); 每一项左边留白的空间;
          这个值没有继承; 当是分组情况时，组内的第一个组件为此项的值
        </div>
        <div>
          <strong>offsetRight:</strong> 整数(px); 每一项右边留白的空间;
          这个值没有继承; 当是分组情况时，组内的第一个组件为此项的值
        </div>
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
        boxRowSpace: 40,
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
              showBody: true
            },
            title: {
              name: "div",
              text: "es: {{$root}}.status ? '更多设置' : '很多设置'"
            },
            label: false,
            boxRowSpace: 10,
            boxRowHeight: 28,
            colon: true,
            boxLabelWidth: 80,
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

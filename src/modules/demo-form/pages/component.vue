<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      “广告名称1” >>
      只有一个属性，它会去匹配全局的默认项组件和值(看esform初始化设置)
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
import alignDesc from "../components/align-desc";
export default {
  data() {
    return {
      title: "项组件",

      formSchema: {
        name1: "广告名称1",
        name2: {
          label: "广告名称2",
          component: "el-input",
          value: "首页位置",
          desc: "我只写component"
        },
        isOpen: {
          label: "开关",
          component: "el-switch",
          value: false
        },
        name3: {
          label: "广告名称3",
          component: {
            name: "el-input",
            props: {
              placeholder:
                "es: {{$root}}.isOpen ? '提示：占位符' : '提示：厉害了'",
              disabled: "es: {{$root}}.isOpen"
            }
          },
          value: "首页位置",
          desc: "标准的写法：所有props子属性(不包括孙子和以下)都支持es"
        },
        color: {
          label: {
            text: "颜色",
            align: "center"
          },
          direction: "v",
          // col: 12,
          component: {
            name: "el-color-picker",
            // flex: "self",
            align: "center"
          },
          value: "#67C23A",
          desc: {
            name: alignDesc,
            props: {
              align: "center",
              txt: "设置了flex=self是为了组件的宽度自动变化"
            }
          }
        },

        unitHelp1: {
          label: "单位/帮助1",
          component: "el-input",
          value: "5",
          unit: "天",
          help: "天啊",
          desc: {
            name: alignDesc,
            props: {
              txt: "因为el-input会自动占100%,所以不设置flex=self"
            }
          }
        },

        unitHelp2: {
          label: "单位/帮助2",
          component: {
            name: "el-input-number",
            flex: "self"
          },
          value: "5",
          unit: "天",
          help: "天啊",
          desc: {
            name: alignDesc,
            props: {
              txt: "设置了flex=self是为了组件的宽度自动变化"
            }
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

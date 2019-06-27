<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      字段direction：设置label和组件的排列方向；值：v或h；根节点默认为h（横排），其它的没有设置就会继承上一级的方向(注：group项不受接爱v的控制，无论怎么样都是横排)"
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
import alignDesc from "../components/align-desc";
export default {
  data() {
    return {
      title: "项排列设置",

      formSchema: {
        direction: "v",
        colon: true,
        properties: {
          name: {
            label: "作者",
            direction: "h",
            component: "el-input",
            value: "首页位置",
            col: 24
          },

          width: {
            label: "宽",
            component: {
              name: "el-input",
              props: {
                placeholder: "写宽"
              }
            },
            value: "",
            col: 11,
            unit: "px",
            direction: "v"
          },
          tmpHolder: {
            layout: "space",
            col: 1
          },
          height: {
            label: "高",
            component: {
              name: "el-input",
              props: {
                placeholder: "写高"
              }
            },
            value: "",
            col: 11,
            unit: "px",
            // help: "高应怎么样?",
            direction: "v"
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
              flex: "self",
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

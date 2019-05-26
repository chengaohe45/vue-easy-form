<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      字段help:
      <div>
        1. 可直接写成string, 提示的内容，支持html;
        当设置为string时，会调用系统的帮助组件es-help
      </div>
      <div>2. 写成一个对象, 跟写组件一样</div>
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "帮助设置",

      formSchema: {
        direction: "h",
        properties: {
          name: {
            label: "广告名称",
            component: "el-input",
            value: "首页位置",
            col: 12,
            help: "我只写了content"
          },
          author: {
            label: "作者名称",
            component: {
              name: "el-input",
              props: {
                placeholder: "请输入作者的名字"
              }
            },
            value: "",
            col: 24,
            help: {
              name: "es-help",
              props: {
                content: "点击查看我的主页",
                maxWidth: 200,
                href: "http://www.qq.com",
                placement: "right"
              }
            }
          },
          pv: {
            label: {
              text: "pv",
              align: "center"
            },
            direction: "v",
            component: {
              name: "el-input-number",
              props: {
                // placeholder: "请输入作者的名字"
              },
              align: "right",
              size: "fixed"
            },
            value: 0,
            col: 18,
            help: {
              name: "g-help",
              props: {
                content: "这个是自定义的help",
                href: "http://www.qq.com"
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

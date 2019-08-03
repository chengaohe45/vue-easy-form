<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
  >
    <div slot="details">
      <div>字段format</div>
      <div class="sys-danger">
        场景：当接口所需要的是1/0,而"开关组件"则是true/false,此时就需要转换
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
      title: "数据转换",
      docsTitle: "数据转换配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/form-value.html#值转换",

      formSchema: {
        name: {
          label: "广告名称",
          component: "el-input",
          value: "首页位置",
          col: 12
        },
        status: {
          label: "状态",
          rowHeight: 20,
          component: {
            name: "el-switch"
          },
          format: [
            {
              outer: 0,
              inner: false
            },
            {
              outer: 1,
              inner: true
            }
          ],
          value: false
        },

        isOpen: {
          label: "是否打开",
          rowHeight: 20,
          component: {
            name: "el-switch"
          },
          format: {
            outer: value => {
              if (value == 0) {
                return false;
              } else {
                return true;
              }
            },
            inner: value => {
              if (value == true) {
                return 1;
              } else {
                return 0;
              }
            }
          },
          value: 1
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

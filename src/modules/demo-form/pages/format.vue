<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      属性format
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "占位符",

      formSchema: {
        name: {
          label: "广告名称",
          component: "el-input",
          value: "首页位置",
          col: 12
        },
        status: {
          label: "状态",
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

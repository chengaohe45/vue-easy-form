<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      当项设置为null、undefined、false时，说明此项是不显示的
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";
import dynamicTags from "@/components/tags/index";
export default {
  data() {
    return {
      title: "标准写法",

      formSchema: {
        title: "表单名称",
        ui: {
          colon: true
        },
        properties: {
          test: false,
          name: {
            label: {
              text: "广告名称"
            },
            component: {
              name: "el-input",
              props: {
                placeholder: "请输入广告名称"
              }
            },
            value: ""
          },
          tags: {
            label: "广告标签",
            component: {
              name: dynamicTags
            },
            value: ["标签1", "标签2"]
          },
          someAttr: undefined
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

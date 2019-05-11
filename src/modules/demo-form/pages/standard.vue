<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      properties说明是一个模块;<br />properties里面的属性代表一项;<br />
      当项设置为null或undefined时; 此项是不显示的; 这样写的目的是为了提高可读性
      <div style="color: red">
        场景：新增和编辑可能用到同一个页面，编辑时可能某些项是不需要的，但是新增是需要填写的；<br />写法如：someAttr:
        this.$route.params.id ? null : {正常的组件}
      </div>
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "基础写法",

      formSchema: {
        title: "表单名称",
        colon: true,
        properties: {
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
          someAttr: null
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

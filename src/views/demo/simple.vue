<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      只需求配置label、component、value即可；<span class="sys-danger"
        >（注：esForm框架并不依赖于element-ui，只是编写示例时结合element-ui编写）</span
      >
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";

export default {
  data() {
    return {
      title: "简单写法",

      formSchema: {
        name: {
          label: "广告名称",
          component: {
            name: "g-slot",
            scopedSlots: {
              default: (data, scoped) => {
                // console.log("default: ", data, scoped);
                return [<span>{scoped.color}</span>, 12344556];
              },
              test: [123, 890]
            }
          },
          value: "首页位置"
        },
        author: "作者名称"
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

<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      字段col：设置每一项的长度，值是1到24；默认为24列, 也就是整行
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";

export default {
  data() {
    return {
      title: "项长度设置",

      formSchema: {
        name: {
          label: "广告名称",
          component: "el-input",
          value: "首页位置",
          col: 12
        },
        author: {
          label: "作者名称",
          component: {
            name: "el-input",
            props: {
              // disabled: "es: {{$global}}.isApp ? true : false",
              placeholder: "请输入作者的名字"
            }
          },
          value: "",
          col: 12
        },
        rate: {
          label: "评分",
          component: {
            name: "el-rate",
            props: {
              colors: ["#99A9BF", "#F7BA2A", "#FF9900"]
            }
          },
          value: 1
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

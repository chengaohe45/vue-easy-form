<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      <div>
        在component对象中添加ref属性，应用时再用form.getRef('testRef')取出
      </div>
      <div></div>
      <div>
        1.
        当component.name是一个组件，则取出一个Vue对象；当是html元素，则取出的是一个Dom节点（就是根据$refs取出的）
      </div>
      <div>
        2. 主要作用用于取出相关的标（对象或节点），从而操作目标里面的对外方法
      </div>
      <strong style="color: red;">（应用见“行为/事件”）</strong>
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "引用",

      formSchema: {
        direction: "h",
        properties: {
          name: {
            label: "名称",
            component: {
              name: "el-input",
              ref: "testRef"
            },
            value: "小明",
            col: 12
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
.actions-details {
  @include display-flex;
  @include direction-h;
  line-height: 14px;
  font-size: 12px;
}
</style>

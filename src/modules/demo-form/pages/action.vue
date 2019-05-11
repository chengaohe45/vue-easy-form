<template>
  <demo-frame :title="title" :formSchema="formSchema">
    <div slot="details">
      <div class="actions-details">
        <div>
          <pre>
字段component.actions: 
{
  trigger: "change",   //默认为click, 可以写数据["change", "input"]或字符吕"change input"
  handler: function(value){...}
}
注：
handler会返回一个参数，这个参数就是当前组件的值
this指针：指向的是form表单，而不是当前组件（因为处理事件，表单更加常用）</pre
          >
        </div>
        <div>
          <pre>
            component.actions写法：
            actions: Object, //写法一: 如左边
            actions: function //写法二: 直接写成一个函数，会自动动补充trigger和handler
            actions: [写法一或二, 写法一或二, ...], //写法三: 多个事件时</pre
          >
        </div>
      </div>
      <strong style="color: red;"
        >（打开浏览器的开发者模式看事件的打印结果）</strong
      >
    </div>
  </demo-frame>
</template>

<script>
import demoFrame from "../components/demo-frame.vue";
// import dynamicTags from "@/components/dynamicTags/index";
export default {
  data() {
    return {
      title: "组件行为/事件",

      formSchema: {
        properties: {
          isGood: {
            label: "",
            component: {
              name: "el-checkbox",
              text: "是否好人",
              actions: {
                trigger: "change changed",
                handler: function(value, key, event) {
                  console.log("this对象: ", this);
                  console.log('this.getRefs("desc")值: ', this.getRefs("desc"));
                  console.log("value值", value);
                  console.log("key值", key);
                  console.log("event值", event);
                  console.log("\n");
                  this.submit();
                }
              }
            },
            value: true,
            col: 12
          },

          desc: {
            label: "es: {{$root}}.isGood ? '好人描述' : '描述'",
            component: {
              name: "el-input",
              props: {
                placeholder:
                  "es: {{$root}}.isGood ? '好人描述要讲多点' : '一般描述啦'"
              },
              ref: "desc",
              // actions: {
              //   trigger: "input.native",
              //   handler: function(value, key, event) {
              //     console.log("value: ", value, event);
              //   }
              // }
              actions: [
                {
                  trigger: "input",
                  handler: function(value, key, event) {
                    console.log("input: ", value, key, event);
                  }
                },
                {
                  trigger: "change",
                  handler: function(value, key, event) {
                    console.log("change: ", value, key, event);
                  }
                }
              ]
            },
            value: ""
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

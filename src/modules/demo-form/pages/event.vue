<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :print-event="true"
    :has-value="true"
  >
    <div slot="details">
      <div class="event-details">
        <div>
          <strong>事件写法:</strong> <br />&lt;es-form ref="form"
          :schema="formSchema" v-model="formValue" @input="formInput"
          @change="formChange"&gt;&lt;/es-form&gt;
        </div>
        <div>
          <strong>input:</strong>
          表单值同步时触发（包括表单组件改变、或外部设值、reset），会返回两个参数，如inputChange(value,
          sourcePathKey)，第一个参数是表单的值，第二个参数是触发源的路径(表单组件触发一定有值，其它的为false)
        </div>
        <div>
          <strong>change:</strong>
          表单内的组件改变时触发，会返回两个参数，如formChange(value,
          sourcePathKey)，第一个参数是表单的值，第二个参数是触发源的路径（一定有值，是字符串）
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
        },
        targets: {
          ui: {
            type: "bg-border",
            rowHeight: 32,
            rowSpace: 15,
            showBody: true
          },
          title: {
            text: "目标人员"
          },
          // label: "",
          rowSpace: 15,
          // col: 15,
          value: [
            { name: "小明", code: "T123" },
            { name: "小花", code: "A623" }
          ],
          array: {
            name: "array",
            hasOrder: true,
            hasDelete: true,
            hasSort: true,
            hasAdd: true,
            max: 5
          },

          properties: {
            name: {
              value: "默认名",
              direction: "h",
              col: 12,
              label: "姓名",
              component: {
                name: "el-input",
                props: {
                  size: "small"
                }
              }
            },
            code: {
              value: "100",
              // direction: "v",
              col: 12,
              label: {
                text: "代号"
              },
              component: {
                name: "el-input",
                props: {
                  size: "small"
                }
              }
            }
          },
          desc: "提示： 最多只能添加5个人员"
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
.event-details {
  line-height: 20px;
  font-size: 14px;
}
</style>

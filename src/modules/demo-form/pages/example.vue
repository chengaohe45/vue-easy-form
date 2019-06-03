<template>
  <div class="demo-example-box">
    <div class="demo-example-body">
      <div class="demo-example-ui">
        <div class="demo-example-wrap">
          <es-form
            ref="form"
            :schema="formSchema"
            v-model="formValue"
            @inited="inited"
            @input="formInput"
            @change="formChange"
          ></es-form>
          <div class="btn-box">
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="onReset">重置</el-button>
          </div>
        </div>
        <div class="demo-example-value-box">
          <div>
            表单值(formValue):
            <pre>{{ JSON.stringify(formValue, null, 2) }}</pre>
          </div>
        </div>
      </div>
      <div class="demo-example-source">
        <div class="source-inner">
          <strong>formSchema:</strong>
          <pre>{{
            JSON.stringify(
              formSchema,
              (key, value) => {
                if (
                  key == "name" &&
                  typeof value == "object" &&
                  value.render &&
                  value.staticRenderFns
                ) {
                  return "[编译的Vue Object]";
                } else if (typeof value == "function") {
                  //return "[Function]";
                  return value.toString();
                } else {
                  return value;
                }
              },
              2
            )
          }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Select from "@/components/units/select";
import CheckboxGroup from "@/components/units/checkbox-group";
import radioGroup from "@/components/units/radio-group";

export default {
  data() {
    return {
      formValue: {
        // name: "默认小花"
      },

      formSchema: {
        rowSpace: 40,
        properties: {
          name: {
            value: "",
            label: "活动名称",
            rules: {
              required: true,
              emptyMsg: "活动名称不能为空"
            },
            component: {
              name: "el-input",
              props: {
                clearable: true,
                placeholder: "请输入活动名称"
              },
              actions: {
                trigger: "change",
                handler: function(value) {
                  console.log(this, value);
                }
              },
              ref: "testRef"
            }
          },
          region: {
            value: "",
            label: "活动区域",
            component: {
              name: Select,
              props: {
                placeholder: "请选择活动区域",
                clearable: true,
                multiple: true,
                options: [{ text: "区域1", id: 1 }, { text: "区域2", id: 2 }]
              },
              actions: {
                trigger: "change",
                handler: function() {
                  console.log("Select $listener");
                }
              }
            },
            rules: {
              required: true,
              emptyMsg: "请选择"
            }
          },

          startTime: {
            col: 12,
            group: "g",
            value: "",
            label: "活动时间",
            component: {
              name: "el-date-picker",
              props: {
                type: "date",
                valueFormat: "yyyy-MM-dd"
              },
              size: "auto"
            }
          },
          endTime: {
            col: 12,
            group: "g",
            value: "",
            label: {
              text: "-",
              size: "fixed"
            },
            component: {
              name: "el-date-picker",
              props: {
                type: "date",
                valueFormat: "yyyy-MM-dd"
              },
              size: "auto"
            }
          },

          delivery: {
            value: false,
            label: "即时配送",
            rowHeight: 30,
            component: {
              name: "el-switch"
            }
          },

          type: {
            value: [2, 4],
            label: "活动性质",
            rowHeight: 30,
            component: {
              name: CheckboxGroup,
              props: {
                options: [
                  { text: "美食/餐厅线上活动", id: 1 },
                  { text: "地推活动", id: 2 },
                  { text: "线下主题活动", id: 3 },
                  { text: "单纯品牌曝光", id: 4 }
                ]
              },
              actions: {
                trigger: "change",
                handler: function() {
                  console.log("CheckboxGroup $listener");
                }
              }
            }
          },

          leader: {
            value: "liu.xiao",
            label: "负责人",
            rowHeight: 30,
            component: {
              name: radioGroup,
              props: {
                options: [
                  { text: "陈总", id: "manager.chen" },
                  { text: "肖总", id: "manager.xiao" },
                  { text: "刘总", id: "liu.xiao" }
                ]
              },
              actions: {
                trigger: "change",
                handler: function() {
                  console.log("radioGroup $listener");
                }
              }
            }
          },

          staffs: {
            ui: {
              type: "bg-border",
              showBody: true
            },
            title: {
              text: "参与人员"
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
            boxRowHeight: 32,
            boxRowSpace: 15,
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
                  text: "工号"
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
      }
    };
  },

  props: {},

  created() {},

  computed: {},

  mounted() {},

  methods: {
    inited(value) {
      console.log("inited(value)：打印结果 ******************** start");
      console.log(">>>>>返回value的值: ", value);
      console.log("inited(value)：打印结果 ******************** end");
      console.log("\n");
    },
    formInput(value, sourcePathKey) {
      console.log(
        "formInput(value, sourcePathKey)：打印结果 ******************** start"
      );
      console.log(">>>>>返回两个value的值: ", value);
      console.log(">>>>>返回两个sourcePathKey的值: ", sourcePathKey);
      console.log(
        "formInput(value, sourcePathKey)：打印结果 ******************** end"
      );
      console.log("\n");
    },
    formChange(value, sourcePathKey) {
      console.log(
        "formChange(value, sourcePathKey)：打印结果 --------------- start"
      );
      console.log(">>>>>返回两个value的值: ", value);
      console.log(">>>>>返回两个sourcePathKey的值: ", sourcePathKey);
      console.log(
        "formChange(value, sourcePathKey)：打印结果 --------------- end"
      );
      console.log("\n");
    },

    onSubmit() {
      if (this.$refs.form.checkAll()) {
        this.$message({
          message: "恭喜你，这是一条成功消息",
          type: "success"
        });
      }
    },

    onReset() {
      this.$refs.form.reset();
    }
  },
  components: {}
};
</script>

<style lang="scss">
@import "@/static/css/mixins.scss";

.demo-example-box {
  @include display-flex;
  @include direction-v;
  @include flex-full;
  overflow: hidden;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  font-size: 14px;

  .demo-example-wrap {
    margin: 10px;
    padding: 20px;
    border: 1px solid #caccd2;
    border-radius: 4px;
  }

  .demo-example-body {
    overflow: auto;
    @include flex-full;
    height: 100%;
    @include display-flex;
    @include direction-h;
    padding-top: 20px;
    box-sizing: border-box;
  }

  .demo-example-value-box {
    margin: 20px 10px 0 10px;
    border-top: 1px dashed #d6d7da;
    padding: 10px;
    text-align: left;
  }

  .demo-example-ui {
    width: 70%;
    padding: 10px 0;
    box-sizing: border-box;
    border: 1px dashed #d6d7da;
    border-radius: 4px;
    overflow: auto;
  }

  .demo-example-source {
    width: 30%;
    overflow: auto;
    .source-inner {
      box-sizing: border-box;
      border: 1px dashed #d6d7da;
      border-radius: 4px;
      text-align: left;
      margin-left: 20px;
      padding: 10px;
      overflow: auto;
      height: 100%;
      @include display-flex;
      @include direction-v;
    }

    .source-area-box {
      margin-top: 5px;
      @include flex-full;
      @include display-flex;
      @include direction-v;
    }
  }

  .btn-box {
    margin-top: 20px;
    text-align: center;
  }
}
</style>

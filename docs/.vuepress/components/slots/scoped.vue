
<template>
  <es-form :schema="schema" v-model="formValue"></es-form>
</template>

<script>

  import demoSlot from "@/components/units/slot.vue";
  export default {
    data() {
      return {
        formValue: {},

        schema: {
          status: {
            label: "切换试试",
            component: {
              name: "el-switch"
            },
            value: true
          },
          city: {
            label: "地址",
            component: {
              name: "el-select",
              scopedSlots: {
                default: (data, scoped) => {  // 函数写法：返回jsx
                  var cities = [
                    { value: "BJ", label: "北京" },
                    { value: "SH", label: "上海" }
                  ];

                  var options = [];
                  cities.forEach(item => {
                    options.push(
                      <el-option key={item.value} label={item.label} value={item.value}>
                        { data.root.status ? 
                        <div>
                          <span style="float: left">{item.label}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{item.value}</span>
                        </div>
                        :
                        item.label }
                      </el-option>
                    );
                  });
                  return options;
                }
              }
            },
            desc: "切换后选择项的显示会有变化",
            value: "SH"
          },

          tag: {
            label: "标签",
            component: {
              name: demoSlot,
              props: {
                tag: "标签值"
              },
              scopedSlots: {
                default: {  // 组件对象写法
                  hidden: "es: !{{$root}}.status",
                  name: "el-tag",
                  props: {
                    disableTransitions: true
                  },
                  text: "有插槽"
                }
              }
            },
            value: ""
          }
        }
        
      };
    }
  };
</script>

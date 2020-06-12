<template>
  <demo-frame
    :title="title"
    :formSchema="formSchema"
    :docsTitle="docsTitle"
    :docsHref="docsHref"
  >
  </demo-frame>
</template>

<script>
import demoFrame from "@/components/demo-frame/index.vue";
import demoSlot from "@/components/units/slot.vue";

export default {
  data() {
    return {
      title: "组件插槽",
      docsTitle: "组件插槽配置文档",
      docsHref: "/vue-easy-form-docs/dist/base/scopedSlots.html",

      formSchema: {
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
              default: (data, scoped) => {
                // (这部分jsx可能经过编译器编译了，最好前往配置文档查看)
                // 函数写法：返回jsx
                var cities = [
                  { value: "BJ", label: "北京" },
                  { value: "SH", label: "上海" }
                ];

                var options = [];
                cities.forEach(item => {
                  options.push(
                    <el-option
                      key={item.value}
                      label={item.label}
                      value={item.value}
                    >
                      {data.root.status ? (
                        <div>
                          <span style="float: left">{item.label}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">
                            {item.value}
                          </span>
                        </div>
                      ) : (
                        item.label
                      )}
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
              default: {
                // 组件对象写法
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

<style lang="scss">
.demo-base-details {
  line-height: 20px;

  .base-title {
    margin: 6px 0 0 0;
    padding: 0;
    line-height: 26px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>

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
            name: "el-select",
            // text: " es: $root.author",
            scopedSlots: {
              default: (data, scoped) => {
                // console.log("default: ", data, scoped);
                var cities = [
                  {
                    value: "Beijing",
                    label: "北京"
                  },
                  {
                    value: "Shanghai",
                    label: "上海"
                  },
                  {
                    value: "Nanjing",
                    label: "南京"
                  },
                  {
                    value: "Chengdu",
                    label: "成都"
                  },
                  {
                    value: "Shenzhen",
                    label: "深圳"
                  },
                  {
                    value: "Guangzhou",
                    label: "广州"
                  }
                ];

                var options = [];
                cities.forEach(item => {
                  options.push(
                    <el-option
                      key={item.value}
                      label={item.label}
                      value={item.value}
                    >
                      <span style="float: left">{item.label}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">
                        {item.value}
                      </span>
                    </el-option>
                  );
                });
                return options;
              }
              // test: [123, 890]
            }
          },
          desc: {
            name: "g-slot",
            scopedSlots: {
              default: (data, scoped) => {
                console.log(data, scoped);
                return [<span>{scoped.color}</span>, data.root.author];
              }
            }
          },
          value: "Shanghai"
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

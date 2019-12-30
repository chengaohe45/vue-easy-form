# 界面调整

字段（见`行高亮`）：
```js {12,13,14,15,16,17,18,24,25,26,27,28,29,30,39,40,41,42,43,44,45}
propName: {
  ui: { // 块（properties）的ui配置
    
    showBody: true,     // 隐藏/打开切换按钮
    type: "",           // 整个块的布局类型
    hasBorder: false,   // 内容区是否有边框
    padding: undefined, // 内容区的内边距

    // 以下属性：在ui里面，是对块（properties）的补充，
    // 它只会影响块（properties）里面的属性，如name；
    // 对当前的块（properties）没有影响；有点类似display:flex
    rowHeight: 40,      // 项的行高
    rowSpace: 20,       // 项的行高与上一次项(行)之间的间隔
    labelWidth: 100,    // 项label的宽度
    offsetLeft: 0,      // 项的右边偏移量
    offsetRight: 0,     // 项的右边偏移量
    colon: false,       // label中是否有冒号
    direction: "h"      // 项的排版方向: "h" "v"
  },

  label: "label名称",

  // 我在块properties，影响的是properties本身这一项，若没有继承上一级的ui
  rowHeight: 40,      // 项的行高
  rowSpace: 20,       // 项的行高与上一次项(行)之间的间隔
  labelWidth: 100,    // 项label的宽度
  offsetLeft: 0,      // 项的右边偏移量
  offsetRight: 0,     // 项的右边偏移量
  colon: false,       // label中是否有冒号
  direction: "h"      // 项的排版方向: "h" "v"

  properties: {
    name: {
      label: "名称",
      component: "el-input",
      value: "天天",

      // 我在组件项内，影响的是component本身这一项；若没有写则继承上一级的ui(就是第一个高亮部分)
      rowHeight: 40,      // 项的行高
      rowSpace: 20,       // 项的行高与上一次项(行)之间的间隔
      labelWidth: 100,    // 项label的宽度
      offsetLeft: 0,      // 项的右边偏移量
      offsetRight: 0,     // 项的右边偏移量
      colon: false,       // label中是否有冒号
      direction: "h"      // 项的排版方向: "h" "v"

    }
    // ... 其它项
  }
}
```

### 实例
<ClientOnly>
  <demo-block>

  ```html
  <es-form ref="form" :schema="formSchema" v-model="formValue"></es-form>

  <script>
    export default {
      data() {
        return {

          formValue: {},

          formSchema: {
            ui: {
              rowSpace: 15  // 子和子以下节点的项与项之前的间隔为15
            },
            properties: {
              name: {
                label: "广告名称",
                component: "el-input",
                value: "首页位置",
                col: 16
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
                col: 16
              },
              rate: {
                label: "评分",
                labelWidth: 70,   // label的长度
                rowSpace: 30,     // 与上一项的空间距离
                rowHeight: 20,    // 因为实际情况el-rate的高度为20,所以这里要修改一下才好看
                component: {
                  name: "el-rate",
                  props: {
                    colors: ["#99A9BF", "#F7BA2A", "#FF9900"]
                  }
                },
                desc: "rowSpace设置为30,所以与'作者名称'距离宽点",
                value: 3
              },
              status: {
                label: "状态",
                labelWidth: 70, // label的长度
                rowHeight: 20,  // 因为实际情况el-switch的高度为20,所以这里要修改一下才好看
                rowSpace: 10,     // 与上一项的空间距离
                component: {
                  name: "el-switch"
                },
                value: true
              },

              more: {
                ui: {
                  type: "bg-border",
                  showBody: true,
                  rowSpace: 10,   // 项与项的空间距离
                  direction: "v", // 上下排版
                  colon: true     // 有冒号
                },
                title: "更多设置",
                label: false,
                rowSpace: 40,
                offsetLeft: 30,
                offsetRight: 30,
                properties: {
                  widht: {
                    col: 12,
                    label: "图片宽",
                    component: "el-input",
                    value: "",
                    offsetRight: 5,
                    desc: "项的右边偏移量为5"
                  },
                  height: {
                    col: 12,
                    label: "图片高",
                    component: "el-input",
                    value: "",
                    offsetLeft: 5,
                    desc: "项的左边偏移量为5"
                  },

                  bgColor: {
                    col: 12,
                    label: {
                      text: "背景颜色",
                      align: "center"   // 文本居中
                    },
                    component: {
                      name: "el-color-picker",
                      flex: "self",   // 设置了flex=self是为了项组件区域的宽度就是组件的宽度
                      align: "center" // 组件居中
                    },
                    value: "#B9C2B6"
                  },

                  fontColor: {
                    col: 12,
                    label: {
                      text: "字体颜色",
                      align: "center"   // 文本居中
                    },
                    component: {
                      name: "el-color-picker",
                      flex: "self",   // 设置了flex=self是为了项组件区域的宽度就是组件的宽度
                      align: "center" // 组件居中
                    },
                    value: "#67C23A"
                  }
                }
              }
            }
          }
        };
      }
    };
  </script>
  ```
  </demo-block>
</ClientOnly>

::: tip ui配置
ui里面的配置(rowSpace、colon等)并不影响`当前properties(与ui同一级)`界面调整，只会影响`当前properties(与ui同一级)`里面的属性。
:::



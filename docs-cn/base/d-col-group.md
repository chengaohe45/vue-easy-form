# 方向/长度/分组/占位

字段（见`行高亮`）：
```js {4,5,6,9}
propName: {
  label: "姓名",
  component: "el-input",
  col: 24,        // 所占列数(宽度)；一行分为24列
  group: "date",  // 分组；任意字符串
  direction: "h", // 排版方向；direction值："h"、"v"

  // 当设置为占位空间，component和label是失效的，可以不写
  layout: "space" // 占位空间；layout值："space"、"tabs"；"tabs"见tabs布局
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
            name: {
              label: "广告名称",
              component: {
                name: "el-input",
                props: {
                  placeholder: "不写col，默认占满24列"
                }
              },
              // col: 24, // 不写col，默认占满24列
              value: ""
            },

            author: {
              label: "作者名称",
              component: {
                name: "el-input",
                props: {
                  placeholder: "col=12：占12列"
                }
              },
              col: 12,  // 占24列中的12列
              value: ""
            },
            pholder: {
              layout: "space",  // 占位空间，没有值
              col: 1
            },
            url: {
              label: "链接地址",
              component: {
                name: "el-input",
                props: {
                  placeholder: "col=12：占12列"
                }
              },
              value: "",
              desc: "前面有个占位空间，所以我掉下来了",
              col: 12
            },
            startTime: {
              label: {
                name: "div",
                text: "有效年份"
              },
              group: "date",  // startTime和endTime是相邻的且group是相同的
              col: 16,  // 这个分组的长度是startTime和endTime相加
              component: {
                name: "el-date-picker",
                flex: "full"
              },
              value: ""
            },
            endTime: {
              label: {
                text: "到",
                flex: "self"
              },
              group: "date",  // startTime和endTime是相邻的且group是相同的
              col: 8,   // 这个分组的长度是startTime和endTime相加
              component: {
                name: "el-date-picker",
                flex: "full"
              },
              unit: "年",
              value: "",
            },

            size: {
              label: "版面尺寸",
              component: "el-input",
              col: 16,  // 占24列中的16列
              value: "50 x 100",
              direction: "v", // 上下排版
              offsetLeft: 100
            }
          }
        };
      }
    };
  </script>
  ```
  </demo-block>
</ClientOnly>

### 占位空间
占位空间是指布局的过程中，某些项是不可见的，但需要占用一定的究竟，使项与项之前的布局更加美观。
::: tip 注意
1. 当设置layout为"space"，说明是占位空间项，优先级最高，其它`无效的配置`可以不用设置；
2. 占位空间没有值，只是占位作用。
:::

当设置layout为"space"，只有以下配置是`有效`的：
| 属性名 | 说明 | 类型 | 可选值| 默认值 | 备注
| -- | -- | -- | -- | -- | --
| hidden | 是否隐藏此项 | boolean | -- | false | 支持[动态解析](./parse.md)
| col | 列数(宽度) | number | 1到24 | 24 | 一行分24列
| group | 项与项进行分组 | string | -- | -- | --

### 分组/group
分组是指两个或两个以上的项合成一个总长度，减去label、unit、help所占用的空间，剩下的空间平均分配给每项的组件。
::: tip 注意
1. 项与项之间要是相邻的且group值是相同的，中间不能有间隔；
2. 组的长度是各项长度之总和，若超过24列则长度为24列；
3. 对组件`component`有效，对块`properties`是无效的。
:::

### 分组实例
实例中的分组`输入框组件`是不相同的：一个是日历输入框，一个是文本输入框，若自动分配剩余空间，它们的长度将会是不一样的；为了使它们的对剩余的空间分配置的长度是一样，必须要为这两个组件设置相同的原始长度值。

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
            name: {
              label: "广告名称",
              component: {
                name: "el-input",
                props: {
                  placeholder: "不写col，默认占满24列"
                }
              },
              // col: 24, // 不写col，默认占满24列
              value: ""
            },

            
            startTime: {
              label: {
                name: "div",
                text: "有效年份"
              },
              group: "date",  // startTime和endTime是相邻的且group是相同的
              col: 16,  // 这个分组的长度是startTime和endTime相加
              component: {
                name: "el-date-picker",
                flex: "full",
                style: { width: '180px'}  // 因为是不同输入组件，设置相同的长度可按相同比例分配剩余空间
              },
              value: ""
            },
            endTime: {
              label: {
                text: "到",
                flex: "self"
              },
              group: "date",  // startTime和endTime是相邻的且group是相同的
              col: 8,   // 这个分组的长度是startTime和endTime相加
              component: {
                name: "el-input",
                flex: "full",
                style: { width: '180px'}  // 因为是不同输入组件，设置相同的长度可按相同比例分配剩余空间
              },
              unit: "年",
              value: "",
            }
          }
        };
      }
    };
  </script>
  ```
  </demo-block>
</ClientOnly>


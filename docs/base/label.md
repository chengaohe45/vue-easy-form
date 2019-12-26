# 项标签/label

字段：`label`<br/>
值类型有：
- `false`： 默认值，label隐藏，空间不存在的
- `''`： 空值 但label空间是存在的
- `string`： 项label文字；支持[动态解析](./com-standard.md)
- `object`： 一个对象，见[组件写法](./com-format.md)

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
            // 写法一
            name: "广告名称", // 直接写在属性上，component将会取系统默认的

            // 写法二
            status: {
              label: "状态", // 直接写label，相当于label: {text: "状态"}
              component: "el-switch",
              value: true
            },

            // 写法三
            tags: {
              label: {
                // hidden: "es: !{{$root}}.status", // 控制title是否隐藏
                text: "es: '标签' + ({{$root}}.status ? '(开)' : '(关)')",
                help: "我在label里"
              },
              component: "el-input",
              value: ""
            },

            // 写法四：组件写法
            target: {
              label: {
                hidden: "es: !{{$root}}.status", // 控制title是否隐藏
                name: "g-label",   // g-label是自定义全局组件；也可以是import导入的局部组件
                props: {},
                // flex: "self", // self or full; 默认为没有设置，则会是labelWidth
                // align: "left", // left, center, right
                help: "我在label里" // 帮助提示
              },
              component: "el-input",
              value: "中年人"
            }
          }
        };
      }
    };
  </script>
  ```
  </demo-block>
</ClientOnly>

### 组件详解

| 属性名 | 说明 | 类型 | 可选值| 默认值
| -- | -- | -- | -- | -- 
| hidden | 控制组件是否隐藏, 支持[动态解析](./com-standard.md) | boolean | -- | false
| align | 文本的方向 | string | `left`、`center`、`right` | --
| flex | label的长度控制 | string | `""`： label的长度将会是labelWidth<br><br>`full`： 项中有多少点多少。此值一般用于component<br><br>`self`： label的文本占多宽就多宽。此值一般用于label | ""
| 其它 | 跟[组件写法](./com-format.md)一样 | -- | -- | --



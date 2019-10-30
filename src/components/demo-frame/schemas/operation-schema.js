export default {
  ui: {
    colon: true,
    rowSpace: 10,
    labelWidth: 72
  },
  properties: {
    key: {
      label: "Key",
      component: {
        name: "el-input",
        props: {
          placeholder: "项组件路径/pathKey"
        }
      },
      value: "",
      help: {
        props: {
          content: "点击查看pathKey",
          href:
            "https://chengaohe45.github.io/vue-easy-form-docs/dist/base/explain.html#项组件路径"
        }
      }
      // desc: "pathKey可以为空；为空则\"值\"要写成一个Object"
    },
    value: {
      label: "Value",
      component: {
        name: "el-input",
        props: {
          placeholder:
            "es: {{$root.key}} ? '格式：整数(123)，字符串(\"123\")': '格式：对象({...})'",
          type: "textarea",
          rows: 4
        }
      },
      value: "",
      rules: {
        required: true,
        emptyMsg: "值不能为空"
      },
      desc:
        "es: {{$root.key}} ? '对应的值(字符串两边记得加上双引号，如：\"你好\")': '必须是一个Object(可复制下面的值来试试)'",
      help: {
        props: {
          content:
            "此值会用eval解析, 所以输入要符合格式。<br/>点击可查看值设值",
          href:
            "https://chengaohe45.github.io/vue-easy-form-docs/dist/base/form-value.html#设值"
        }
      }
    }
  }
};

// import constant from "./constant";
// import esHelp from "../components/help.vue";

let global = {
  boxRowHeight: 40,
  boxRowSpace: 20,
  boxLabelWidth: 100,
  colon: false,
  direction: "h",
  defaultCom: "input",
  defaultVal: "", // 这个是对defaultCom的补充，当组件为defaultCom时且没有设置默认值，则取此值；注：此值对其它组件不补充
  // help: { name: esHelp, props: {} },
  trimDoms: ["input", "textarea", "el-input"],
  // 经测试：在el-input里，change比change.native先触发
  hasConsole: false, // 是否有控制台，默认为false
  trimEvent:
    "change.native" /* 这个是form的表单项改变时，此事件触发后会去掉左右两边空格；一般都是change, 因为有些类库可以喜欢写changed */
};

export default global;
